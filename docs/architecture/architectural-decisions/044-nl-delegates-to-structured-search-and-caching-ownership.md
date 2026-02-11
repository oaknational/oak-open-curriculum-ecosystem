# 044: NL search delegates to Structured search; caching owned by Structured route

Date: 2025-09-14

## Status

Superseded by [ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)

> The Next.js App Router that hosted the API routes described below was removed in February 2026.
> ADR-107 now governs the NL/structured boundary: the search SDK is deterministic and accepts only
> structured parameters; NL parsing, intent extraction, and query reformulation belong in the
> consuming application layer (e.g. the MCP server). Caching strategy will be revisited as part of
> SDK extraction. The original decision is preserved below for historical context.

## Context

We have two search entry points in the Semantic Search app (Next.js App Router):

- Natural‑language (NL) search at `POST /api/search/nl`
- Structured search at `POST /api/search`

The NL handler parses free‑text into a deterministic structured payload. We also want robust
server‑side caching using Next.js Data Cache, with explicit keys and tag‑based revalidation when
indices/rollups change.

## Decision

1. NL search delegates to the Structured endpoint
   - The NL route deterministically transforms the NL request into a validated structured payload
     and then POSTs that payload to `POST /api/search`.
   - The NL route does not own any cache logic.

2. Structured route owns caching
   - The Structured route wraps execution in `unstable_cache`, using a stable key derived from the
     validated payload plus an index version prefix, and tags like `['search-structured',
`index:vX`]`.
   - The route exports `dynamic = 'force-dynamic'` and `revalidate = 0` (POST responses are not
     CDN‑cached). Invalidation is performed via `revalidateTag` when index/rollup completes.

This ensures:

- A single source of truth for cache behaviour, avoiding duplicated cache layers.
- NL queries benefit from the same caching as equivalent structured queries.
- The cache key is the best representation of the request semantics (the structured payload), not
  the unstructured text.

## Consequences

- The NL route is a thin adapter; it remains dynamic and side‑effect free.
- Cache metrics and invalidation logic are centralised in the structured handler.
- Revalidation continues to be driven by index/rollup workflows via tag rotation.

## Telemetry and observability

- We will instrument cache operations with OpenTelemetry spans/metrics.
- Export target is Sentry when credentials are present; otherwise, instrumentation is a no‑op.
  - Gate via environment (e.g., `SENTRY_DSN` and `SENTRY_ENVIRONMENT`). If `SENTRY_DSN` is
    absent, do not initialise Sentry exporters.
  - Capture span attributes only with non‑sensitive data: route, cacheOutcome (`hit`/`miss`),
    indexVersion, keyHash (hash of the canonical structured payload), resultCount, duration, and
    error type (if any). Do not log raw request bodies or PII.
  - Suggested sample rates: traces 0.1–0.5 in production; 1.0 in preview/test.

## References

- Code (removed): `apps/oak-search-cli/app/api/search/route.ts`
- Code (removed): `apps/oak-search-cli/app/api/search/nl/route.ts`
- Plan: `.agent/plans/semantic-search-caching-plan.md`
- Next.js Data Cache docs: [Vercel docs](https://vercel.com/docs/infrastructure/data-cache)
- Successor: [ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)
