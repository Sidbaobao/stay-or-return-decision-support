import { createHmac, randomBytes } from "crypto";
import { readEnv } from "@/lib/server/env";

export const PER_IP_LIMIT_PER_MINUTE = 5;
export const PER_IP_MINUTE_WINDOW_SECONDS = 120;
export const PER_IP_LIMIT_PER_DAY = 20;
export const PER_IP_DAY_WINDOW_SECONDS = 60 * 60 * 48;
// One completion costs a single Redis command now, so this cap exists to
// bound stat pollution, not quota: 2000/day ≈ 60K commands/month, far under
// the 500K free tier. A single IP can contribute at most PER_IP_LIMIT_PER_DAY.
export const GLOBAL_DAILY_LIMIT = 2000;
export const GLOBAL_WINDOW_SECONDS = 60 * 60 * 48;

// Vercel sets x-real-ip and sanitises x-forwarded-for (first hop = client).
// Behind other proxies these headers are caller-controlled; the worst a
// caller can then do is dodge or fill the per-IP buckets — the global cap
// and enum validation still hold, and nothing derived from the header is
// ever persisted beyond the limiter keys' 2-minute / 48-hour TTLs.
export function getClientIp(request: Request): string | null {
  const direct = request.headers.get("x-real-ip") ?? request.headers.get("x-vercel-forwarded-for");

  if (direct?.trim()) {
    return direct.trim();
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}

// HMAC key for the limiter. STATS_RATE_SALT gives consistent limiting across
// serverless instances; without it a per-process random key is used, which
// keeps the hash irreversible even for someone who can read Redis (the key
// never leaves memory) at the cost of per-instance limit buckets.
const processSalt = randomBytes(32).toString("hex");

function getRateSalt() {
  return readEnv("STATS_RATE_SALT") ?? processSalt;
}

// Limiter keys are HMACs of the IP under a server secret, bucketed to the
// minute and to the UTC day. They exist only to throttle: they are never
// stored beside the counters and the raw IP is never persisted.
export function ipLimiterKeys(ip: string, nowMs: number, dayBucket: string) {
  const digest = createHmac("sha256", getRateSalt()).update(ip).digest("hex").slice(0, 24);
  const minuteBucket = Math.floor(nowMs / 60_000);

  return {
    minute: `rl:ip:${digest}:${minuteBucket}`,
    day: `rl:ipday:${digest}:${dayBucket}`
  };
}

export function nextUtcMidnightMs(nowMs: number) {
  const now = new Date(nowMs);
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
}

// Warm-instance short-circuit: once the daily cap trips, answer 429 until UTC
// midnight without spending a Redis round trip.
let closedUntilMs = 0;

export function isDayClosed(nowMs: number) {
  return nowMs < closedUntilMs;
}

export function closeDay(nowMs: number) {
  closedUntilMs = nextUtcMidnightMs(nowMs);
}

// Coarse on purpose: a precise time-to-midnight would tell a caller exactly
// when a blackout engaged.
export function retryAfterSeconds(reason: "ip" | "global") {
  return reason === "ip" ? 60 : 3600;
}

// One atomic script. KEYS: [1] ip-minute, [2] ip-day, [3] global-day, [4..]
// the six counters. ARGV: [1] ip/min limit (0 = no client IP, skip both IP
// checks), [2] ip-minute TTL, [3] ip/day limit, [4] ip-day TTL, [5] global
// limit, [6] global TTL. Per-IP checks run first, so a throttled IP never
// touches the global budget; EXPIRE is set only when a key is created.
export const COUNT_COMPLETION_SCRIPT = [
  "local ipLimit = tonumber(ARGV[1])",
  "if ipLimit > 0 then",
  "  local m = redis.call('INCR', KEYS[1])",
  "  if m == 1 then redis.call('EXPIRE', KEYS[1], ARGV[2]) end",
  "  if m > ipLimit then return 'ip' end",
  "  local d = redis.call('INCR', KEYS[2])",
  "  if d == 1 then redis.call('EXPIRE', KEYS[2], ARGV[4]) end",
  "  if d > tonumber(ARGV[3]) then return 'ip' end",
  "end",
  "local g = redis.call('INCR', KEYS[3])",
  "if g == 1 then redis.call('EXPIRE', KEYS[3], ARGV[6]) end",
  "if g > tonumber(ARGV[5]) then return 'global' end",
  "for i = 4, #KEYS do redis.call('INCR', KEYS[i]) end",
  "return 'ok'"
].join("\n");
