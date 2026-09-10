// Server-only wrapper around the Upstash Redis REST API (what the Vercel
// Marketplace provisions in place of the retired Vercel KV). Kept
// dependency-free on purpose: the stats feature needs only INCR/EXPIRE/EVAL/
// MGET, which the REST pipeline endpoint covers with plain fetch.
//
// Reads whichever env names the integration injected: the Marketplace's
// KV-compatible names (KV_REST_API_URL / KV_REST_API_TOKEN) or Upstash's own
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).

import { readEnv } from "@/lib/server/env";

export type RedisCommand = (string | number)[];

const REQUEST_TIMEOUT_MS = 2500;

function getStoreConfig() {
  const url = readEnv("UPSTASH_REDIS_REST_URL") ?? readEnv("KV_REST_API_URL");
  const token = readEnv("UPSTASH_REDIS_REST_TOKEN") ?? readEnv("KV_REST_API_TOKEN");

  if (!url || !token) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), token };
}

export function isStatsStoreConfigured() {
  return getStoreConfig() !== null;
}

// Contract: returns the per-command results, or null on ANY failure — network,
// timeout, non-2xx, malformed payload, or a per-command error. Callers treat
// null as "skip silently"; stats must never break the app.
export async function runRedisPipeline(commands: RedisCommand[]): Promise<unknown[] | null> {
  const config = getStoreConfig();

  if (!config || commands.length === 0) {
    return null;
  }

  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload) || payload.length !== commands.length) {
      return null;
    }

    const results: unknown[] = [];

    for (const item of payload) {
      if (!item || typeof item !== "object" || "error" in item) {
        return null;
      }

      results.push((item as { result?: unknown }).result ?? null);
    }

    return results;
  } catch {
    return null;
  }
}

export async function runRedisScript(script: string, keys: string[], args: (string | number)[]) {
  const results = await runRedisPipeline([["EVAL", script, keys.length, ...keys, ...args]]);
  return results ? results[0] : null;
}

export async function readRedisValues(keys: string[]): Promise<Map<string, unknown> | null> {
  if (keys.length === 0) {
    return new Map();
  }

  const results = await runRedisPipeline([["MGET", ...keys]]);
  const values = results?.[0];

  if (!Array.isArray(values) || values.length !== keys.length) {
    return null;
  }

  return new Map(keys.map((key, index) => [key, values[index]]));
}
