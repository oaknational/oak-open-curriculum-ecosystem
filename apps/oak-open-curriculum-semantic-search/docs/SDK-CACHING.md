# SDK Response Caching

This document describes the optional Redis-based caching system for Oak SDK API responses during ingestion.

## Overview

The ingestion CLI (`pnpm es:ingest-live`) makes many API calls to the Oak Curriculum API to fetch lesson and unit data. During development, repeated ingestion runs can be slow due to these API calls.

SDK response caching stores API responses in Redis, dramatically speeding up subsequent runs by avoiding redundant network requests.

## Key Features

- **Optional** - Caching is disabled by default; enable with `SDK_CACHE_ENABLED=true`
- **Persistent** - Cache survives script restarts (stored in Redis with Docker volume)
- **Long TTL** - Default 7-day cache duration (configurable)
- **Graceful degradation** - If Redis is unavailable, ingestion continues without caching
- **Easy invalidation** - Multiple ways to clear the cache

## Setup

### 1. Start Redis

```bash
cd apps/oak-open-curriculum-semantic-search
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

# Optional: customise cache TTL in days (default: 7)
# SDK_CACHE_TTL_DAYS=7
```

### 3. Run Ingestion

```bash
# First run: cache miss for all requests (normal speed)
pnpm es:ingest-live --subject maths --dry-run --verbose

# Second run: cache hits (much faster!)
pnpm es:ingest-live --subject maths --dry-run --verbose
```

## Configuration

| Environment Variable  | Default                  | Description                  |
| --------------------- | ------------------------ | ---------------------------- |
| `SDK_CACHE_ENABLED`   | `false`                  | Enable/disable caching       |
| `SDK_CACHE_REDIS_URL` | `redis://localhost:6379` | Redis connection URL         |
| `SDK_CACHE_TTL_DAYS`  | `7`                      | Cache entry lifetime in days |

## Cache Invalidation

### Clear via CLI Flag

```bash
# Clear cache before running ingestion
pnpm es:ingest-live --subject maths --clear-cache --dry-run
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
pnpm es:ingest-live --subject history --keystage ks2 --dry-run
# Cache: 127 hits, 99 misses

# Second run: 100% cache hits (including cached 404 fallbacks)
pnpm es:ingest-live --subject history --keystage ks2 --dry-run
# Cache: 226 hits, 0 misses
```

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
# Clear cache and re-run
pnpm es:ingest-live --subject maths --clear-cache --dry-run
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

## See Also

- [ADR-066: SDK Response Caching](../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) - Architecture decision record
- [Semantic Search Prompt](.agent/prompts/semantic-search/semantic-search.prompt.md) - Complete context for continuation
