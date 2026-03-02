# SDK Response Caching

**Last Updated**: 2026-01-03

This document describes the optional Redis-based caching system for Oak SDK API responses during ingestion.

## Overview

The ingestion CLI in API mode (`pnpm es:ingest -- --api`) makes many API calls to the Oak Curriculum API to fetch lesson and unit data. During development, repeated ingestion runs can be slow due to these API calls.

SDK response caching stores API responses in Redis, dramatically speeding up subsequent runs by avoiding redundant network requests.

## Key Features

- **Optional** - Caching is disabled by default; enable with `SDK_CACHE_ENABLED=true`
- **Persistent** - Cache survives script restarts (stored in Redis with Docker volume)
- **Long TTL** - Default 14-day cache duration with ±12 hour jitter (configurable)
- **Graceful degradation** - If Redis is unavailable, ingestion continues without caching
- **Easy invalidation** - Multiple ways to clear the cache
- **Stampede prevention** - Per-entry TTL jitter prevents thundering herd

## Setup

### 1. Start Redis

```bash
cd apps/oak-search-cli
pnpm redis:up
```

This starts a Redis container with persistent storage.

### 2. Configure Environment

Add to your `.env.local`:

```bash
# Enable SDK response caching
SDK_CACHE_ENABLED=true

# Optional: customise Redis URL (default: redis://localhost:6379)
# SDK_CACHE_REDIS_URL=redis://localhost:6379

# Optional: customise base cache TTL in days (default: 14, with ±12 hour jitter)
# SDK_CACHE_TTL_DAYS=14
```

### 3. Run Ingestion

```bash
# First run: cache miss for all requests (normal speed)
pnpm es:ingest -- --api --subject maths --dry-run --verbose

# Second run: cache hits (much faster!)
pnpm es:ingest -- --api --subject maths --dry-run --verbose
```

## Configuration

| Environment Variable  | Default                  | Description                      |
| --------------------- | ------------------------ | -------------------------------- |
| `SDK_CACHE_ENABLED`   | `false`                  | Enable/disable caching           |
| `SDK_CACHE_REDIS_URL` | `redis://localhost:6379` | Redis connection URL             |
| `SDK_CACHE_TTL_DAYS`  | `14`                     | Base cache TTL in days (±jitter) |

## Cache Invalidation

### Clear via CLI Flag

```bash
# Clear cache before running ingestion (API mode)
pnpm es:ingest -- --api --subject maths --clear-cache --dry-run
```

### Clear via Redis CLI

```bash
# Clear all SDK cache entries
docker compose exec redis redis-cli KEYS "oak-sdk:*" | xargs docker compose exec -T redis redis-cli DEL

# Or clear entire Redis database
docker compose exec redis redis-cli FLUSHDB
```

### Full Reset (Remove Volume)

```bash
# Stop Redis and remove all data
docker compose down -v
```

## What Gets Cached

The following per-resource API calls are cached:

| Resource Type      | Cache Key Pattern                     | Description       |
| ------------------ | ------------------------------------- | ----------------- |
| Unit Summaries     | `oak-sdk:v1:unit-summary:{slug}`      | Unit metadata     |
| Lesson Summaries   | `oak-sdk:v1:lesson-summary:{slug}`    | Lesson metadata   |
| Lesson Transcripts | `oak-sdk:v1:lesson-transcript:{slug}` | Video transcripts |

List endpoints (e.g., `getUnitsByKeyStageAndSubject`) are **not cached** as they are called once per subject/keystage combination.

### 404 Fallback Caching

Many Oak resources are optional. For example, lessons without video have no transcript, and the API returns 404 for these requests. Without special handling, these 404s would be re-fetched on every run, preventing 100% cache hit rates.

**The solution**: When a transcript request returns 404, the cache stores an empty fallback value (`{ transcript: '', vtt: '' }`). Subsequent runs get a cache hit for these "missing" resources.

This is critical for achieving true 100% cache hit rates:

```bash
# First run: 127 hits (from prior runs), 99 misses (new fetches + 404s)
pnpm es:ingest -- --api --subject history --key-stage ks2 --dry-run
# Cache: 127 hits, 99 misses

# Second run: 100% cache hits (including cached 404 fallbacks)
pnpm es:ingest -- --api --subject history --key-stage ks2 --dry-run
# Cache: 226 hits, 0 misses
```

## Cache Stampede Prevention

### The Problem

When all cache entries share the same TTL, they expire simultaneously. This causes a
"cache stampede" where the system must re-fetch all data at once, potentially overwhelming
the upstream Oak API (rate limited to 10,000 requests/hour).

### The Solution: TTL Jitter

Each cache entry receives a TTL with random jitter applied:

| Configuration   | Value            |
| --------------- | ---------------- |
| Base TTL        | 14 days          |
| Jitter Range    | ±12 hours        |
| Effective Range | 13.5 - 14.5 days |

This spreads cache expiration over a 24-hour window, ensuring no more than ~4% of entries
expire per hour.

### How It Works

```typescript
import { calculateTtlWithJitter } from './sdk-cache/ttl-jitter';

// Each cache write gets a unique TTL
const ttl1 = calculateTtlWithJitter(14, 12); // e.g., 1,198,543 seconds
const ttl2 = calculateTtlWithJitter(14, 12); // e.g., 1,223,891 seconds
```

Jitter is applied **per cache entry** at write time, not once at client creation. This
ensures all entries have unique TTLs, providing true stampede prevention.

### Testing

The jitter function accepts an injectable random function for deterministic tests:

```typescript
// Deterministic for testing
const ttl = calculateTtlWithJitter(14, 12, () => 0.5); // Exactly 14 days
```

### See Also

- [ADR-079: SDK Cache TTL Jitter](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)
- [ADR-066: SDK Response Caching](../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md)

## Cache Key Versioning

Cache keys include a version prefix (`oak-sdk:v1:`). If the API response format changes, increment the version in `oak-adapter-cached.ts` to automatically invalidate old cached data.

## Troubleshooting

### "Redis connection failed" Warning

This means caching is enabled but Redis isn't running or isn't reachable.

**Solution**: Start Redis with `docker compose up -d`

### Cache Not Speeding Up Runs

1. Check that `SDK_CACHE_ENABLED=true` is set
2. Verify Redis is running: `docker compose ps`
3. Check cache stats in CLI output at end of run

### Stale Data

If you suspect cached data is out of date:

```bash
# Clear cache and re-run (API mode)
pnpm es:ingest -- --api --subject maths --clear-cache --dry-run
```

## Docker Compose Reference

The `docker-compose.yml` file provides:

- Redis 7.x Alpine (lightweight)
- Persistent volume (`redis-data`)
- Health check
- Auto-restart on failure

```bash
# Start Redis
pnpm redis:up

# View logs
docker compose logs -f redis

# Stop Redis (keeps data)
pnpm redis:down

# Stop Redis and remove data (clears cache)
pnpm redis:reset

# Check Redis status
pnpm redis:status
```

## Performance Impact

Typical performance improvement with warm cache:

| Scenario       | Cold Cache | Warm Cache | Improvement |
| -------------- | ---------- | ---------- | ----------- |
| Maths (all KS) | ~10 min    | ~30 sec    | ~20x faster |
| History KS2    | ~2 min     | ~10 sec    | ~12x faster |

_Note: Actual times depend on network conditions and API response times._

## Related ADRs

| ADR                                                                                       | Topic                |
| ----------------------------------------------------------------------------------------- | -------------------- |
| [ADR-066](../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) | SDK Response Caching |
| [ADR-079](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) | SDK Cache TTL Jitter |
