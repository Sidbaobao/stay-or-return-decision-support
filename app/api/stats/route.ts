import { createHash, timingSafeEqual } from "crypto";
import { isStatsStoreConfigured, runRedisPipeline } from "@/lib/server/stats-store";

// Anonymous aggregate completion counters. What gets stored, in full:
//   stats:total                            — all-time completions
//   stats:direction:{stay_us|return_china|balanced}
//   stats:confidence:{low|medium|high}
//   stats:m:{YYYY-MM}:… same three groups, bucketed by month
// Counters only — no per-user records, no ids, no timestamps finer than the
// month bucket, no answers, no weights, nothing joinable to a person.

const ALLOWED_DIRECTIONS = ["stay_us", "return_china", "balanced"] as const;
const ALLOWED_CONFIDENCE = ["low", "medium", "high"] as const;

const MAX_BODY_LENGTH = 300;
const PER_IP_LIMIT_PER_MINUTE = 5;
const GLOBAL_DAILY_LIMIT = 500;

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// The limiter key is an HMAC-style salted hash of the caller's IP with a
// 2-minute TTL. It exists only to throttle; it is never stored alongside the
// counters, expires almost immediately, and the raw IP is never persisted.
function rateLimiterKey(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const salt =
    process.env.STATS_RATE_SALT ?? process.env.STATS_ADMIN_TOKEN ?? "stay-or-return-rl";
  const minuteBucket = Math.floor(Date.now() / 60_000);

  return `rl:ip:${sha256(`${salt}|${ip}`).toString("hex").slice(0, 24)}:${minuteBucket}`;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    // Same-origin beacons may omit the Origin header; only an explicit
    // mismatch is rejected.
    return true;
  }

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // Free first-line filters — no Redis commands spent on junk.
  if (!isSameOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return new Response(null, { status: 415 });
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (rawBody.length > MAX_BODY_LENGTH) {
    return new Response(null, { status: 413 });
  }

  let direction: string;
  let confidence: string;

  try {
    const parsed = JSON.parse(rawBody) as { direction?: unknown; confidence?: unknown };
    direction = String(parsed.direction);
    confidence = String(parsed.confidence);
  } catch {
    return new Response(null, { status: 400 });
  }

  if (
    !ALLOWED_DIRECTIONS.includes(direction as (typeof ALLOWED_DIRECTIONS)[number]) ||
    !ALLOWED_CONFIDENCE.includes(confidence as (typeof ALLOWED_CONFIDENCE)[number])
  ) {
    return new Response(null, { status: 400 });
  }

  if (!isStatsStoreConfigured()) {
    // Local dev / store not provisioned: accept silently so the client never
    // sees an error, store nothing.
    return new Response(null, { status: 204 });
  }

  const now = new Date();
  const dayBucket = `${monthKey(now)}-${String(now.getUTCDate()).padStart(2, "0")}`;
  const ipKey = rateLimiterKey(request);
  const globalKey = `rl:global:${dayBucket}`;

  const limitResults = await runRedisPipeline([
    ["INCR", ipKey],
    ["EXPIRE", ipKey, 120],
    ["INCR", globalKey],
    ["EXPIRE", globalKey, 60 * 60 * 48]
  ]);

  if (!limitResults) {
    return new Response(null, { status: 204 });
  }

  const ipCount = Number(limitResults[0] ?? 0);
  const globalCount = Number(limitResults[2] ?? 0);

  if (ipCount > PER_IP_LIMIT_PER_MINUTE || globalCount > GLOBAL_DAILY_LIMIT) {
    return new Response(null, { status: 429 });
  }

  const month = monthKey(now);

  await runRedisPipeline([
    ["INCR", "stats:total"],
    ["INCR", `stats:direction:${direction}`],
    ["INCR", `stats:confidence:${confidence}`],
    ["INCR", `stats:m:${month}:total`],
    ["INCR", `stats:m:${month}:direction:${direction}`],
    ["INCR", `stats:m:${month}:confidence:${confidence}`]
  ]);

  return new Response(null, { status: 204 });
}

function isAuthorized(request: Request) {
  const adminToken = process.env.STATS_ADMIN_TOKEN;

  if (!adminToken) {
    return false;
  }

  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const queryToken = new URL(request.url).searchParams.get("token");
  const provided = bearer ?? queryToken;

  if (!provided) {
    return false;
  }

  return timingSafeEqual(sha256(provided), sha256(adminToken));
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    // Same response whether the token is wrong or the view is unconfigured.
    return new Response(null, { status: 404 });
  }

  if (!isStatsStoreConfigured()) {
    return Response.json({ configured: false, note: "Stats store env vars are not set." });
  }

  const months: string[] = [];
  const cursor = new Date();

  for (let index = 0; index < 6; index += 1) {
    months.push(monthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() - 1);
  }

  const commands: (string | number)[][] = [
    ["GET", "stats:total"],
    ...ALLOWED_DIRECTIONS.map((value) => ["GET", `stats:direction:${value}`]),
    ...ALLOWED_CONFIDENCE.map((value) => ["GET", `stats:confidence:${value}`]),
    ...months.flatMap((month) => [
      ["GET", `stats:m:${month}:total`],
      ...ALLOWED_DIRECTIONS.map((value) => ["GET", `stats:m:${month}:direction:${value}`]),
      ...ALLOWED_CONFIDENCE.map((value) => ["GET", `stats:m:${month}:confidence:${value}`])
    ])
  ];

  const results = await runRedisPipeline(commands);

  if (!results) {
    return Response.json({ configured: true, error: "Stats store unreachable." }, { status: 502 });
  }

  const asCount = (value: unknown) => Number(value ?? 0) || 0;
  let index = 0;
  const readGroup = () => {
    const total = asCount(results[index]);
    index += 1;
    const byDirection = Object.fromEntries(
      ALLOWED_DIRECTIONS.map((value) => {
        const count = asCount(results[index]);
        index += 1;
        return [value, count];
      })
    );
    const byConfidence = Object.fromEntries(
      ALLOWED_CONFIDENCE.map((value) => {
        const count = asCount(results[index]);
        index += 1;
        return [value, count];
      })
    );

    return { total, byDirection, byConfidence };
  };

  const allTime = readGroup();
  const byMonth = Object.fromEntries(months.map((month) => [month, readGroup()]));

  return Response.json({ configured: true, allTime, byMonth });
}
