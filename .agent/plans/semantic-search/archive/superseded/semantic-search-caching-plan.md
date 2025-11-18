# Semantic Search Caching Plan (Next.js App Router on Vercel)

Role: Define deterministic caching, invalidation, and tagging strategy for the semantic search API once the definitive architecture lands. Focus on Vercel Data Cache, CDN behaviour, SEARCH_INDEX_VERSION tagging, and observability expectations.

Related plans: `semantic-search-api-plan.md`, `semantic-search-ui-plan.md`, `semantic-search-documentation-plan.md`, `semantic-search-alignment-refresh-plan.md`

---

## Goals

- Minimise response latency and cost for read-only endpoints while ensuring fresh results after each ingestion/rollup.
- Use explicit cache keys and tags driven by `SEARCH_INDEX_VERSION`; avoid implicit behaviour tied to cookies/headers.
- Keep admin and mutation routes uncached; instrument invalidation hooks for zero-hit logging and rollup index swaps.

---

## Constraints & principles

- Obey repository rules: fail fast, no hidden implicit caching, British spelling in comments.
- Never cache responses for endpoints with side effects (`index-oak`, `rebuild-rollup`, status updates that mutate progress markers).
- Use the Oak Curriculum SDK for upstream data; do not cache raw fetches that bypass SDK invariants.
- NL and suggestion endpoints must remain deterministic: conversions to structured payloads must produce identical cache keys for identical inputs.
- All caching code must be testable via pure functions (hashing, tag derivation) to satisfy TDD expectations.

---

## Endpoint matrix & policies

| Endpoint                                                               | Behaviour                                                                 | Cache strategy                                                                                                                                                   | Invalidation triggers                                                                          |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `POST /api/search` (structured)                                        | Server-side RRF query over lessons/units/sequences                        | Wrap ES call in `unstable_cache` keyed by `SEARCH_INDEX_VERSION` + normalised payload hash. `dynamic='force-dynamic'`, `revalidate=0`.                           | Rotate `SEARCH_INDEX_VERSION` after ingestion/rollup; call `revalidateTag('index:<version>')`. |
| `POST /api/search/nl` (natural language)                               | Deterministic NL → structured translation                                 | No cache at NL layer. Delegate to structured endpoint so it benefits from the cached RRF response.                                                               | Same as structured (handled indirectly).                                                       |
| `POST /api/search/suggest` (completion/type-ahead)                     | Completion results with contexts + optional `search_as_you_type` fallback | Cache short-lived results via `unstable_cache` (~60s) using prefix + scope + filters + index version. Disable CDN caching; return `Cache-Control: no-store`.     | Invalidate on index version bump or when suggestion payload sources change.                    |
| `GET /api/index-oak/status`                                            | Reports ingestion progress, last batch, failures                          | No caching. Mark `dynamic='force-dynamic'`, `revalidate=0`.                                                                                                      | N/A; status endpoint always live.                                                              |
| Admin routes (`POST /api/index-oak`, `POST /api/rebuild-rollup`, etc.) | Mutate indices                                                            | No caching. After success, rotate `SEARCH_INDEX_VERSION`, emit cache invalidation, and log events.                                                               |
| Docs (`GET /api/openapi.json`, `/api/docs`)                            | Generated artefacts                                                       | Static generation with hourly revalidation (`revalidate=3600`, CDN `s-maxage=3600, stale-while-revalidate=86400`). Bump version/path on breaking schema changes. | Doc generation pipeline, OpenAPI regeneration.                                                 |

---

## Key design choices

### Stable keys

- Normalise request payloads (sort object keys, default optional values) before hashing.
- Cache key format: `${SEARCH_INDEX_VERSION}|${sha256(normalisedPayload)}` to avoid collisions when parameters shift.
- Suggestion keys include prefix, scope, optional filters, and suggestion variant (completion vs SATY).

### Tagging & invalidation

- Primary tag: `index:${SEARCH_INDEX_VERSION}` applied to every structured cache entry.
- Secondary tags: `search:structured`, `search:suggest` for manual flushes.
- After ingestion or rollup completes, the admin handler must:
  1. Compute next version (e.g., `v2025-03-16-02`).
  2. Persist the version (env/config/secrets manager).
  3. Call `revalidateTag` for the new version (which invalidates caches tied to the previous version upon next access).
  4. Emit structured logs noting old/new version and affected endpoints.

### Observability

- Log cache hits/misses at debug level (disabled by default); log invalidations at info level.
- Zero-hit telemetry must bypass caches: log before returning cached result so misses are still recorded.
- Include cache metadata (key hash, version, tags) in structured logs to aid debugging.

### Testing expectations

- Provide pure helpers for normalising payloads and deriving cache keys/tags; cover with Vitest.
- Add integration tests to ensure NL endpoint reuses structured caching and suggestion endpoint respects TTL.
- Verify admin routes do not import caching utilities (static analysis/lint rule or targeted tests).

---

## CDN vs Data Cache

- Use Data Cache for POST endpoints; do not rely on CDN for POST responses.
- Serve docs/OpenAPI through static generation with CDN headers; keep them separate from Data Cache.
- UI-level caching (client) must align with this plan; results that include canonical URLs should not be cached beyond the Data Cache TTL.

---

## Example snippets

```ts
// cache-key.ts
import { createHash } from 'node:crypto';

export function normalisePayload<T extends Record<string, unknown>>(payload: T): T {
  // Deterministically sort keys; ensure defaults are present before hashing.
  // Implementation must be pure for testing.
  return payload;
}

export function makeCacheKey(payload: unknown, indexVersion: string): string {
  const json = JSON.stringify(payload);
  const hash = createHash('sha256').update(json).digest('hex');
  return `${indexVersion}|${hash}`;
}
```

```ts
// app/api/search/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const cachedSearch = (version: string) =>
  unstable_cache(runStructuredSearch, ['search:structured'], {
    tags: [`index:${version}`, 'search:structured'],
  });

export async function POST(req: NextRequest) {
  const body = validateStructured(await req.json());
  const version = process.env.SEARCH_INDEX_VERSION ?? 'v0';
  const key = makeCacheKey(body, version);
  const execute = cachedSearch(version);
  const result = await execute(key, body);
  logSearchTelemetry({ kind: 'structured', cacheKey: key, version });
  return NextResponse.json(result, { status: 200 });
}
```

```ts
// app/api/search/suggest/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const cachedSuggest = (version: string) =>
  unstable_cache(fetchSuggestions, ['search:suggest'], {
    revalidate: 60,
    tags: [`index:${version}`, 'search:suggest'],
  });

export async function POST(req: NextRequest) {
  const payload = validateSuggest(await req.json());
  const version = process.env.SEARCH_INDEX_VERSION ?? 'v0';
  const key = makeCacheKey(payload, version);
  const data = await cachedSuggest(version)(key, payload);
  return NextResponse.json(data, { status: 200, headers: { 'cache-control': 'no-store' } });
}
```

```ts
// app/api/index-oak/route.ts
export async function POST() {
  await runIngestion();
  const nextVersion = computeNextVersion();
  await persistIndexVersion(nextVersion);
  revalidateTag(`index:${nextVersion}`);
  logger.info('index-version-rotated', { nextVersion });
  return NextResponse.json({ ok: true, indexVersion: nextVersion });
}
```

---

## Workflow reminders

- Follow GO.md cadence: each caching change → ACTION + REVIEW, with periodic grounding.
- Coordinate with documentation plan to update caching references in docs/README and QUERYING guides.
- Record cache key/tag changes in CHANGELOG or review log for observability teams.

---

## Acceptance criteria

- Structured and NL endpoints share deterministic caching keyed by `SEARCH_INDEX_VERSION`.
- Suggestion endpoint uses limited TTL caching and honours index version tagging.
- Admin routes rotate versions and invalidate caches immediately after ingestion/rollup.
- Status endpoint remains uncached, always returning live progress.
- Caching utilities include pure helper functions covered by tests; zero-hit logging operates regardless of cache hits.
- Documentation references (SETUP.md, QUERYING.md, docs/README.md) match this strategy.

---

## References

- `.agent/directives-and-memory/rules.md`
- `docs/agent-guidance/testing-strategy.md`
- `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`
- `.agent/plans/semantic-search/semantic-search-api-plan.md`
- Vercel App Router caching docs (`unstable_cache`, tag revalidation).
