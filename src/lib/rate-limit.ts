const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Simple in-memory rate limiter for public API endpoints.
 * @param identifier IP or client key
 * @param maxHits Maximum requests within window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxHits: number = 10,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || record.expiresAt < now) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: maxHits - 1 };
  }

  if (record.count >= maxHits) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxHits - record.count };
}
