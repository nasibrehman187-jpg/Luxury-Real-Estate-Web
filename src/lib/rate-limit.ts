import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Fallback in-memory map for dev/mock mode if Upstash credentials are not set
const memoryStore = new Map<string, { count: number; resetTime: number }>();

let upstashRatelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    upstashRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: '@neoma/ratelimit',
    });
  } catch (err) {
    console.warn('Failed to initialize Upstash Redis ratelimit, falling back to local store.', err);
  }
}

export async function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (upstashRatelimit) {
    try {
      const res = await upstashRatelimit.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch (e) {
      console.warn('Upstash rate limit execution error, using local fallback:', e);
    }
  }

  // Local sliding window fallback
  const now = Date.now();
  const userRecord = memoryStore.get(identifier);

  if (!userRecord || now > userRecord.resetTime) {
    memoryStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
  }

  if (userRecord.count >= maxRequests) {
    return { success: false, limit: maxRequests, remaining: 0, reset: userRecord.resetTime };
  }

  userRecord.count += 1;
  return { success: true, limit: maxRequests, remaining: maxRequests - userRecord.count, reset: userRecord.resetTime };
}
