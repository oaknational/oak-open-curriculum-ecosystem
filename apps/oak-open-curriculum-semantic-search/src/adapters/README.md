# Oak SDK Adapters

This directory contains the unified client for the Oak Curriculum API, providing type-safe access to curriculum data with optional Redis caching.

## Architecture

```text
oak-adapter.ts (Public API)
    │
    ├── sdk-client-factory.ts (Client creation)
    │       │
    │       ├── sdk-api-methods.ts (API method factories)
    │       │
    │       └── sdk-cache/ (Caching layer)
    │               ├── cache-wrapper.ts (withCache, withCacheAndNegative)
    │               ├── ttl-jitter.ts (Cache stampede prevention)
    │               └── redis-connection.ts (Connection management)
    │
    ├── oak-adapter-threads.ts (Thread-specific API methods)
    ├── oak-adapter-types.ts (Type definitions)
    └── sdk-guards.ts (Type guards for API responses)
```

## Key Design Decisions

### Result Pattern (ADR-088)

All API methods return `Result<T, SdkFetchError>` instead of throwing exceptions. This provides:

- **Explicit error handling** — Callers must handle failures
- **Type-safe errors** — Error kinds are discriminated unions
- **Composability** — Results can be mapped and chained

```typescript
const result = await client.getLessonSummary('adding-fractions');

if (!result.ok) {
  switch (result.error.kind) {
    case 'not_found':
      // Handle missing lesson
      break;
    case 'server_error':
      // Handle server error
      break;
  }
}

// result.value is typed as SearchLessonSummary
```

### Optional Caching (ADR-066)

Caching is enabled via environment variables:

| Variable              | Purpose                               |
| --------------------- | ------------------------------------- |
| `SDK_CACHE_ENABLED`   | Enable Redis caching (`true`/`false`) |
| `SDK_CACHE_REDIS_URL` | Redis connection URL                  |
| `SDK_CACHE_TTL_DAYS`  | Cache TTL in days (default: 14)       |

### Negative Caching

Transcripts return 404 for lessons without video. These are cached with a sentinel value (`__NOT_FOUND__`) to avoid repeated network calls. Use `--ignore-cached-404` to bypass.

### Cache Stampede Prevention (ADR-079)

TTL values include random jitter (±12 hours) to prevent all cache entries expiring simultaneously.

## Files

| File                     | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `oak-adapter.ts`         | **Public API** — `createOakClient()`, `OakClient` interface |
| `oak-adapter-types.ts`   | Type definitions for all API methods                        |
| `oak-adapter-threads.ts` | Thread-specific API methods                                 |
| `sdk-api-methods.ts`     | Factories for each API endpoint                             |
| `sdk-client-factory.ts`  | Client creation (cached/uncached)                           |
| `sdk-guards.ts`          | Type guards for API response validation                     |
| `sdk-cache/`             | Caching infrastructure                                      |

## Usage

### Basic Usage

```typescript
import { createOakClient } from './adapters/oak-adapter';

const client = await createOakClient();

// Fetch lesson summary
const result = await client.getLessonSummary('adding-fractions');
if (result.ok) {
  console.log(result.value.title);
}

// Check cache stats
const stats = client.getCacheStats();
console.log(`Cache: ${stats.hits} hits, ${stats.misses} misses`);

// Disconnect when done
await client.disconnect();
```

### Bypass Cached 404s

```typescript
const client = await createOakClient({
  caching: { ignoreCached404: true },
});
```

## Testing

Tests use dependency injection via `CacheOperations` interface:

```typescript
import { withCache, type CacheOperations } from './sdk-cache';

const fakeOps: CacheOperations = {
  get: async (key) => cache.get(key) ?? null,
  setex: async (key, ttl, value) => cache.set(key, value),
};

const wrapped = withCache(fn, fakeOps, 'prefix', 14, stats, isValid, ttlFn);
```

## Related ADRs

- [ADR-066](../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) — SDK Response Caching
- [ADR-079](../../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) — Cache TTL Jitter
- [ADR-088](../../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md) — Result Pattern
