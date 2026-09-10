import { createHash, timingSafeEqual } from "crypto";
import { isStatConfidence, isStatDirection, STAT_CONFIDENCES, STAT_DIRECTIONS } from "@/lib/stats-schema";
import { readEnv } from "@/lib/server/env";
import {
  closeDay,
  COUNT_COMPLETION_SCRIPT,
  getClientIp,
  GLOBAL_DAILY_LIMIT,
  GLOBAL_WINDOW_SECONDS,
  ipLimiterKeys,
  isDayClosed,
  PER_IP_DAY_WINDOW_SECONDS,
  PER_IP_LIMIT_PER_DAY,
  PER_IP_LIMIT_PER_MINUTE,
  PER_IP_MINUTE_WINDOW_SECONDS,
  retryAfterSeconds
} from "@/lib/server/rate-limit";
import {
  allTimeKeys,
  completionCounterKeys,
  CounterGroupKeys,
  dayKey,
  flattenGroupKeys,
  monthKey,
  monthlyKeys,
  recentMonthKeys
} from "@/lib/server/stats-keys";
import { isStatsStoreConfigured, readRedisValues, runRedisScript } from "@/lib/server/stats-store";

// Anonymous aggregate completion counters. See lib/server/stats-keys.ts for
// the complete list of what is stored: counters only — no per-user records,
// no ids, no timestamps finer than the month bucket, no answers, no weights,
// nothing joinable to a person.

export const runtime = "nodejs";

const MAX_BODY_LENGTH = 300;
const RECENT_MONTHS = 6;

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

function tooManyRequests(reason: "ip" | "global") {
  return new Response(null, {
    status: 429,
    headers: { "Retry-After": String(retryAfterSeconds(reason)) }
  });
}

export async function POST(request: Request) {
  // Free first-line filters — no Redis commands spent on junk.
  if (!isSameOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return new Response(null, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > MAX_BODY_LENGTH) {
    return new Response(null, { status: 413 });
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

  let parsed: { direction?: unknown; confidence?: unknown } | null;

  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return new Response(null, { status: 400 });
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !isStatDirection(parsed.direction) ||
    !isStatConfidence(parsed.confidence)
  ) {
    return new Response(null, { status: 400 });
  }

  if (!isStatsStoreConfigured()) {
    // Local dev / store not provisioned: accept silently, store nothing.
    return new Response(null, { status: 204 });
  }

  const nowMs = Date.now();

  if (isDayClosed(nowMs)) {
    return tooManyRequests("global");
  }

  const now = new Date(nowMs);
  const day = dayKey(now);
  const ip = getClientIp(request);
  const ipKeys = ipLimiterKeys(ip ?? "none", nowMs, day);
  const keys = [
    ipKeys.minute,
    ipKeys.day,
    `rl:global:${day}`,
    ...completionCounterKeys(monthKey(now), parsed.direction, parsed.confidence)
  ];
  const args = [
    ip ? PER_IP_LIMIT_PER_MINUTE : 0,
    PER_IP_MINUTE_WINDOW_SECONDS,
    PER_IP_LIMIT_PER_DAY,
    PER_IP_DAY_WINDOW_SECONDS,
    GLOBAL_DAILY_LIMIT,
    GLOBAL_WINDOW_SECONDS
  ];

  const outcome = await runRedisScript(COUNT_COMPLETION_SCRIPT, keys, args);

  if (outcome === "ip") {
    return tooManyRequests("ip");
  }

  if (outcome === "global") {
    closeDay(nowMs);
    return tooManyRequests("global");
  }

  // "ok" counted; null (store unreachable) is deliberately indistinguishable
  // to the client — stats are best-effort.
  return new Response(null, { status: 204 });
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

// Bearer only: query-string tokens would land in request logs, browser
// history and Referer headers.
function isAuthorized(request: Request) {
  const adminToken = readEnv("STATS_ADMIN_TOKEN");
  const header = request.headers.get("authorization");
  const provided = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;

  if (!adminToken || !provided) {
    return false;
  }

  return timingSafeEqual(sha256(provided), sha256(adminToken));
}

function decodeGroup(values: Map<string, unknown>, group: CounterGroupKeys) {
  const count = (key: string) => Number(values.get(key) ?? 0) || 0;

  return {
    total: count(group.total),
    byDirection: Object.fromEntries(STAT_DIRECTIONS.map((value) => [value, count(group.direction[value])])),
    byConfidence: Object.fromEntries(
      STAT_CONFIDENCES.map((value) => [value, count(group.confidence[value])])
    )
  };
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    // Same response whether the token is wrong or the view is unconfigured.
    return new Response(null, { status: 404 });
  }

  const noStore = { "Cache-Control": "no-store" };

  if (!isStatsStoreConfigured()) {
    return Response.json({ configured: false, note: "Stats store env vars are not set." }, { headers: noStore });
  }

  const months = recentMonthKeys(new Date(), RECENT_MONTHS);
  const monthGroups = months.map((month) => monthlyKeys(month));
  const keys = [...flattenGroupKeys(allTimeKeys), ...monthGroups.flatMap(flattenGroupKeys)];
  const values = await readRedisValues(keys);

  if (!values) {
    return Response.json(
      { configured: true, error: "Stats store unreachable." },
      { status: 502, headers: noStore }
    );
  }

  return Response.json(
    {
      configured: true,
      allTime: decodeGroup(values, allTimeKeys),
      byMonth: Object.fromEntries(
        months.map((month, index) => [month, decodeGroup(values, monthGroups[index])])
      )
    },
    { headers: noStore }
  );
}
