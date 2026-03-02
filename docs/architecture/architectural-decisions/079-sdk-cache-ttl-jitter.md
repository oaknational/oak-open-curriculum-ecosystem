# ADR-079: SDK Cache TTL Jitter

## Status

Implemented ✅

**Date**: 2025-12-15

## Context

The Oak SDK caching layer ([ADR-066](./066-sdk-response-caching.md)) stores API responses
in Redis with a configurable TTL. When all cache entries share the same TTL, they expire
simultaneously, causing a "cache stampede" or "thundering herd" problem:

1. All cached entries expire at once
2. Subsequent requests all miss the cache simultaneously
3. System makes a burst of requests to the Oak API
4. Risk of hitting rate limits (10,000 requests/hour)
5. Degraded performance during cache rebuild

This is a well-documented distributed systems problem that affects any caching layer
with uniform TTLs.

## Decision

Add random jitter to each cache entry's TTL to spread expiration over a time window.

### Configuration

| Parameter | Value     | Rationale                                          |
| --------- | --------- | -------------------------------------------------- |
| Base TTL  | 14 days   | Balance between data freshness and API load        |
| Jitter    | ±12 hours | Spreads expiration over 24-hour window             |
| Max TTL   | 60 days   | Allow longer caching for stable data if configured |

### Effect

- Minimum TTL: 13.5 days
- Maximum TTL: 14.5 days
- ~4% of cache expires per hour (1/24)
- No sudden spike in API requests

### Implementation

A pure function `calculateTtlWithJitter()` accepts an injectable random function
for testability, following our TDD practices and dependency injection principles
([ADR-078](./078-dependency-injection-for-testability.md)).

```typescript
export function calculateTtlWithJitter(
  baseTtlDays: number,
  jitterHours: number = 12,
  randomFn: () => number = Math.random,
): number {
  const baseTtlSeconds = baseTtlDays * 24 * 60 * 60;
  const jitterSeconds = jitterHours * 60 * 60;
  // Random value in range [-jitterSeconds, +jitterSeconds]
  const jitter = (randomFn() * 2 - 1) * jitterSeconds;
  return Math.round(baseTtlSeconds + jitter);
}
```

**Key design decision**: Jitter is applied **per cache entry** (at write time), not
once at client creation. This ensures all entries have unique TTLs, providing true
stampede prevention even for entries written in the same session.

## Consequences

### Positive

- Prevents cache stampede / thundering herd
- Protects against rate limiting during re-ingestion
- Distributes API load evenly over time
- Pure function is easily testable
- No change to cache semantics from the consumer's perspective

### Negative

- Slightly more complex than fixed TTL
- Cache entries expire at unpredictable times (by design)
- Requires documentation since jitter is non-obvious

### Neutral

- No change to cache hit/miss behaviour
- No change to API response freshness guarantees (still within 13.5-14.5 day window)
- Same Redis infrastructure, no additional dependencies

## Alternatives Considered

### 1. Probabilistic early refresh

Refresh entries before they expire based on probability. Rejected because:

- More complex to implement
- Requires tracking access patterns
- Overkill for our use case

### 2. Staggered initial load

Only populate cache gradually. Rejected because:

- Doesn't solve the problem for entries created at similar times
- Would slow down initial ingestion

### 3. Lock-based refresh

Use distributed locks to prevent duplicate refreshes. Rejected because:

- Requires additional infrastructure (Redis locks)
- More complex failure modes
- Jitter is simpler and sufficient

## References

- [AWS: Caching Challenges and Strategies](https://aws.amazon.com/builders-library/caching-challenges-and-strategies/)
- [Redis: Cache Stampede Prevention](https://redis.io/docs/manual/client-side-caching/)
- [Martin Kleppmann: Designing Data-Intensive Applications, Ch. 5](https://dataintensive.net/)
- [ADR-066: SDK Response Caching](./066-sdk-response-caching.md)
- [ADR-078: Dependency Injection for Testability](./078-dependency-injection-for-testability.md)
