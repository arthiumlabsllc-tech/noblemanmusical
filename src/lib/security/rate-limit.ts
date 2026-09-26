/**
 * In-memory rate limiter using sliding window.
 * For production with multiple instances, use Redis instead.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    // Rate limit exceeded
    return { success: false, limit, remaining: 0, reset: entry.resetAt };
  }

  // Increment
  entry.count++;
  return { success: true, limit, remaining: limit - entry.count, reset: entry.resetAt };
}

export function rateLimitResponse(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}

// ── Predefined limits ──

export const limits = {
  /** Auth endpoints (login, register, forgot-password) */
  auth: (ip: string) => rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000), // 5 per 15min

  /** Search API */
  search: (ip: string) => rateLimit(`search:${ip}`, 30, 60 * 1000), // 30 per minute

  /** WhatsApp send */
  whatsapp: (ip: string) => rateLimit(`wa:${ip}`, 3, 60 * 1000), // 3 per minute

  /** Webhooks (Paystack, MoMo) */
  webhook: (source: string) => rateLimit(`webhook:${source}`, 100, 60 * 1000), // 100 per minute

  /** General API */
  api: (ip: string) => rateLimit(`api:${ip}`, 60, 60 * 1000), // 60 per minute

  /** Order tracking */
  tracking: (ip: string) => rateLimit(`track:${ip}`, 10, 60 * 1000), // 10 per minute
};
