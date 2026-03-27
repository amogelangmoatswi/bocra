/**
 * In-memory sliding-window rate limiter.
 * Works in Edge Runtime (middleware) — no external deps.
 */

const rateMap = new Map<string, number[]>();

// Clean up stale entries every 60s to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of rateMap) {
      const filtered = timestamps.filter((t) => now - t < 120_000);
      if (filtered.length === 0) rateMap.delete(key);
      else rateMap.set(key, filtered);
    }
  }, 60_000);
}

/**
 * Check if a request should be rate-limited.
 * @param key   Unique identifier (IP address, user ID, etc.)
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Window duration in milliseconds (default: 60s)
 * @returns { limited: boolean; remaining: number; resetMs: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = rateMap.get(key) ?? [];

  // Remove timestamps outside the current window
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    const retryAfterMs = windowMs - (now - oldest);
    return { limited: true, remaining: 0, retryAfterMs };
  }

  recent.push(now);
  rateMap.set(key, recent);

  return {
    limited: false,
    remaining: limit - recent.length,
    retryAfterMs: 0,
  };
}
