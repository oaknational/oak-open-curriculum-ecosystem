/**
 * Cache TTL jitter utilities to prevent cache stampede.
 *
 * ## Why Jitter?
 *
 * When all cache entries share the same TTL, they expire simultaneously, causing
 * a "thundering herd" or "cache stampede" where the system must re-fetch all
 * data at once. This can:
 *
 * 1. **Overwhelm upstream APIs** - Sudden spike in requests may hit rate limits
 * 2. **Degrade performance** - All requests block waiting for fresh data
 * 3. **Cause cascading failures** - If re-fetch fails, entire cache is invalid
 *
 * ## Solution: TTL Jitter
 *
 * Adding random jitter to each cache entry's TTL spreads expiration over a time
 * window. With ±12 hours jitter on a 14-day TTL:
 *
 * - Entries expire between 13.5 and 14.5 days
 * - Expiration spreads across a 24-hour window
 * - No more than ~4% of cache expires per hour (1/24)
 *
 * ## References
 *
 * - [AWS: Caching Best Practices](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
 * - [Redis: Cache Stampede Prevention](https://redis.io/docs/manual/client-side-caching/)
 * - [ADR-079: SDK Cache TTL Jitter](../../../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)
 *
 * @see {@link ../../../docs/SDK-CACHING.md} for SDK caching overview
 */

/** Seconds per hour constant for readability. */
const SECONDS_PER_HOUR = 60 * 60;

/** Hours per day constant for readability. */
const HOURS_PER_DAY = 24;

/**
 * Calculate TTL in seconds with jitter to prevent cache stampede.
 *
 * Applies random jitter to spread cache expiration over a time window,
 * preventing all entries from expiring simultaneously.
 *
 * @param baseTtlDays - Base TTL in days (e.g., 14)
 * @param jitterHours - Maximum jitter in hours, applied as ±jitterHours (default: 12)
 * @param randomFn - Random function for testability (default: Math.random)
 * @returns TTL in seconds with jitter applied
 *
 * @example
 * ```typescript
 * // Production usage - Math.random provides jitter
 * const ttl = calculateTtlWithJitter(14, 12);
 * // Returns value between 1,166,400 (13.5 days) and 1,252,800 (14.5 days)
 *
 * // Testing - deterministic random for reproducible tests
 * const ttl = calculateTtlWithJitter(14, 12, () => 0.5);
 * // Returns exactly 1,209,600 (14 days, no jitter when random = 0.5)
 * ```
 *
 * @remarks
 * The jitter formula: `baseTTL + (random * 2 - 1) * jitterRange`
 *
 * - When random = 0: TTL = base - jitter (minimum)
 * - When random = 0.5: TTL = base (no jitter)
 * - When random = 1: TTL = base + jitter (maximum)
 *
 * @see {@link ../../../docs/SDK-CACHING.md#cache-stampede-prevention}
 */
export function calculateTtlWithJitter(
  baseTtlDays: number,
  jitterHours = 12,
  randomFn: () => number = Math.random,
): number {
  const baseTtlSeconds = baseTtlDays * HOURS_PER_DAY * SECONDS_PER_HOUR;
  const jitterSeconds = jitterHours * SECONDS_PER_HOUR;
  // Random value in range [-jitterSeconds, +jitterSeconds]
  // When randomFn() returns 0.5, jitter is 0 (midpoint)
  // When randomFn() returns 0, jitter is -jitterSeconds (minimum)
  // When randomFn() returns 1, jitter is +jitterSeconds (maximum)
  const jitter = (randomFn() * 2 - 1) * jitterSeconds;
  return Math.round(baseTtlSeconds + jitter);
}
