// Server-only wrapper around the Upstash Redis REST API (what the Vercel
// Marketplace provisions in place of the retired Vercel KV). Kept
// dependency-free on purpose: the stats feature needs only INCR/EXPIRE/GET,
// which the REST pipeline endpoint covers with plain fetch.
//
// Reads whichever env names the integration injected: the Marketplace's
// KV-compatible names (KV_REST_API_URL / KV_REST_API_TOKEN) or Upstash's own
// (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).

type RedisCommand = (string | number)[];

function getStoreConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), token };
}

export function isStatsStoreConfigured() {
  return getStoreConfig() !== null;
}

// Runs commands atomically enough for counters (one HTTP round trip). Returns
// the per-command results, or null when the store is unreachable or not
// configured — callers treat null as "skip silently"; stats must never break
// the app.
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
      signal: AbortSignal.timeout(3000),
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { result?: unknown; error?: string }[];

    if (!Array.isArray(payload)) {
      return null;
    }

    return payload.map((item) => (item && "result" in item ? item.result : null));
  } catch {
    return null;
  }
}
