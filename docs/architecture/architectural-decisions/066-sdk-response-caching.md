# ADR 066: SDK Response Caching for Ingestion

## Status

Accepted

## Context

The semantic search ingestion CLI (`pnpm es:ingest-live`) fetches curriculum data from the Oak Curriculum API via the SDK. A full ingestion run for a single subject (e.g., maths across all key stages) makes hundreds of API calls:

- Unit summaries: ~100-200 calls
- Lesson summaries: ~500-1000 calls
- Lesson transcripts: ~500-1000 calls

During development, engineers frequently re-run ingestion to:

1. Test index mapping changes
2. Debug document transformation logic
3. Verify search result quality
4. Iterate on ingestion pipeline improvements

Each run takes 10-15 minutes due to API latency, significantly impacting developer velocity.

### Constraints

1. **API rate limits**: The Oak API has rate limiting that can slow repeated requests
2. **Data freshness**: Curriculum content changes infrequently (weekly at most)
3. **Development workflow**: Fast iteration is critical for development productivity
4. **Production safety**: Caching must not affect production data integrity

### Options Considered

#### Option A: In-Memory Cache

- Pros: Zero infrastructure, simple implementation
- Cons: Lost between runs, no persistence, limited to single process

#### Option B: File-Based Cache

- Pros: Persists across runs, no external dependencies
- Cons: Complex cache invalidation, disk I/O overhead, harder to manage

#### Option C: Redis Cache (Chosen)

- Pros: Fast, persistent, easy invalidation, industry standard, Docker-based
- Cons: Requires Docker, additional infrastructure

## Decision

Implement **optional Redis-based caching** for SDK API responses during ingestion.

### Key Design Decisions

1. **Optional by Default**

   Caching is disabled unless explicitly enabled via `SDK_CACHE_ENABLED=true`. This ensures:
   - Production ingestion always uses fresh data
   - No surprise behaviour for new developers
   - Explicit opt-in for development workflows

2. **Long TTL with Easy Invalidation**

   Default 7-day cache TTL balances:
   - Development speed (cache persists across sessions)
   - Data freshness (weekly refresh aligns with content updates)

   Multiple invalidation mechanisms:
   - CLI flag: `--clear-cache`
   - Redis CLI: `FLUSHDB` or pattern delete
   - Docker: `docker compose down -v`

3. **Graceful Degradation**

   If Redis is unavailable when caching is enabled:
   - Log a warning
   - Continue with uncached operation
   - Never fail the ingestion

4. **Versioned Cache Keys**

   Keys use prefix `oak-sdk:v1:` to enable bulk invalidation when:
   - API response schemas change
   - Transformation logic changes
   - Cache format evolves

5. **Selective Caching**

   Only cache per-resource endpoints (unit/lesson summaries, transcripts).
   List endpoints are called once per subject/keystage and don't benefit from caching.

6. **Negative Caching (404 Responses)**

   Many Oak resources are optional (e.g., transcripts for lessons without video).
   When the API returns 404, cache a sentinel value (`__NOT_FOUND__`) to avoid
   repeated network calls. This is critical for achieving 100% cache hit rates -
   without this, 404s would be re-fetched every run.

   **TTL**: 404s use the same TTL as successful responses (default 7 days).
   Most missing transcripts are legitimately absent (e.g., art/PE lessons without
   video content) and will remain absent.

   **Override**: Use `--ignore-cached-404` to re-fetch transcripts that were
   previously 404. This is useful when new transcripts are added to existing
   lessons and you want to update without clearing the entire cache.

   See also: [Wikipedia: Negative cache](https://en.wikipedia.org/wiki/Negative_cache)

### Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     ingest-live.ts                          │
│                    (CLI Entry Point)                        │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              createCachedOakSdkClient()                     │
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │  parseCacheConfig│    │  buildCacheKey  │   Pure         │
│  │  (pure function) │    │  (pure function)│   Functions    │
│  └─────────────────┘    └─────────────────┘                │
│                                                             │
│  ┌─────────────────────────────────────────┐               │
│  │           withCache()                    │   IO          │
│  │  (wraps SDK methods with Redis caching)  │   Layer       │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────┐        ┌─────────────────────┐
│    Redis (Docker)    │        │    Oak SDK Client   │
│                      │        │                     │
│  - Persistent volume │        │  - API calls        │
│  - 7-day TTL         │        │  - Rate limited     │
└─────────────────────┘        └─────────────────────┘
```

### Files

| File                                           | Purpose                                |
| ---------------------------------------------- | -------------------------------------- |
| `docker-compose.yml`                           | Redis container with persistent volume |
| `src/adapters/oak-adapter-cached.ts`           | Cache implementation                   |
| `src/adapters/oak-adapter-cached.unit.test.ts` | Unit tests for pure functions          |
| `docs/SDK-CACHING.md`                          | User documentation                     |

## Consequences

### Positive

1. **10-20x faster re-runs**: Subsequent ingestion runs complete in seconds vs minutes
2. **Reduced API load**: Fewer redundant calls to Oak API
3. **Better DX**: Faster iteration enables more experimentation
4. **Observable**: Cache stats reported at end of each run

### Negative

1. **Docker dependency**: Developers must run Docker for caching
2. **Stale data risk**: Must remember to clear cache after API changes
3. **Infrastructure complexity**: Additional service to manage

### Neutral

1. **Optional feature**: No impact on production or developers who don't enable it
2. **Standard tooling**: Redis is widely understood and documented

## Implementation Notes

### TDD Compliance

- Pure functions (`parseCacheConfig`, `buildCacheKey`) have unit tests
- IO functions are isolated for integration testing
- Cache wrapper preserves original function signatures

### Type Safety

- No type assertions in cache read path (JSON.parse returns `unknown`)
- Generic `withCache<TArg, TResult>` preserves type information
- Configuration interface is exported for type-safe testing

### Error Handling

- All catch blocks log errors with context
- Cache failures never interrupt ingestion
- Connection errors are clearly communicated

## Related Documents

- [SDK-CACHING.md](../../apps/oak-search-cli/docs/SDK-CACHING.md) - User documentation
- [ADR 065: Turbo Task Dependencies](./065-turbo-task-dependencies.md) - Build system context
