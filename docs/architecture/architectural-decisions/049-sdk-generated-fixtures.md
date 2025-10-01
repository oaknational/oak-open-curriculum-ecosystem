# 049: Generate deterministic fixtures via the Oak Curriculum SDK

Date: 2025-10-06

## Status

Accepted

## Context

The semantic search workspace needs deterministic data for:

- Local onboarding without live Elasticsearch
- Unit/Integration/Playwright suites that exercise admin _and_ search endpoints
- UI/UX work that depends on consistent copy, zero-hit flows, and cookie behaviour

Previously, fixtures lived in the app layer as handwritten objects. They were hard to keep in sync as
soon as the SDK schema evolved, and they duplicated knowledge about payload shapes. The repository
operates under the cardinal rule that all static data flows from the Open Curriculum OpenAPI schema;
fixtures were the last remaining place that broke this principle.

## Decision

1. Generate fixture builders inside `@oaknational/oak-curriculum-sdk` during `pnpm type-gen`.
   - Zero-hit telemetry fixtures already follow this pattern; admin stream fixtures now do the same.
   - Builders live under `src/types/generated/**/stream-fixtures.ts` and export strongly typed
     factories that re-use the SDK’s Zod schemas.

2. Expose the fixtures through the shared fixture resolver in the semantic search app.
   - `SEMANTIC_SEARCH_USE_FIXTURES` (server) and `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` (client) control
     the behaviour.
   - Admin endpoints (`GET /api/index-oak`, `GET /api/rebuild-rollup`, `GET /api/index-oak/status`)
     use the same resolver, so fixture modes cover search + admin routes consistently.

3. Default Playwright and integration environments to fixture mode.
   - Deterministic responses unlock offline CI runs and UX development.
   - Cookie persistence (`semantic-search-fixtures`) stays identical to live behaviour.

## Consequences

### Positive

- Fixtures stay aligned with the OpenAPI contract automatically; `pnpm type-gen` regenerates them.
- No divergence between search/admin fixtures and live response shapes.
- Local onboarding is completely offline: `pnpm make`, `pnpm qg`, run fixtures.
- Tests and demos can switch between success/empty/error modes without network state.

### Negative

- The SDK build now emits additional generated files and requires the semantic search app to depend
  on them, increasing cross-package surface area.
- Changing fixture copy requires edits to the generator template rather than simple JSON files.

### Neutral

- Fixture toggle env vars (`SEMANTIC_SEARCH_USE_FIXTURES`, `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE`) are
  now part of the documented contract; deployments must decide whether to surface them.
- Admin endpoints returning fixtures via GET may surprise legacy clients that expected POST; all
  first-party tooling already uses GET.

## Implementation

- SDK type-gen module: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/admin/generate-admin-fixtures.ts`
- Generated output: `packages/sdks/oak-curriculum-sdk/src/types/generated/admin/stream-fixtures.ts`
- App wiring: `apps/oak-open-curriculum-semantic-search/app/lib/admin-fixtures.ts`,
  `app/lib/fixture-mode.ts`
- Fixture toggle UI: `app/lib/fixture-toggle.ts` and the corresponding Playwright helpers

## References

- Cardinal rule: `.agent/directives-and-memory/rules.md`
- Architecture updates: `apps/oak-open-curriculum-semantic-search/docs/ARCHITECTURE.md`
- Indexing + Query docs describing fixture workflow
