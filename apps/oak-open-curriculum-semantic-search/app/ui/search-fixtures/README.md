# Search Fixtures Module Outline

## Goals

- Provide typed fixture builders for structured and natural search flows using SDK-aligned data.
- Centralise lesson/unit/sequence samples and suggestion payloads to remove duplication across server actions, controllers, and Playwright tests.
- Support variant outputs (single-scope, multi-scope, empty, timed-out) for UX validation and automated coverage.

## Proposed File Layout

```text
app/ui/search-fixtures/
├── README.md                  # Module overview (this file)
├── data/
│   ├── ks2-maths.ts           # Static data derived from KS2 maths snapshot
│   ├── ks4-maths.ts           # Static data derived from KS4 maths snapshot
│   ├── ks3-history.ts         # Static data derived from KS3 history snapshot
│   ├── ks3-art.ts             # Static data derived from KS3 art snapshot
│   └── index.ts               # Exports consolidated record map for builders
├── builders/
│   ├── single-scope.ts        # `buildSingleScopeFixture(scope, options)`
│   ├── multi-scope.ts         # `buildMultiScopeFixture(options)`
│   ├── empty.ts               # `buildEmptyFixture(scope)`
│   ├── timed-out.ts           # `buildTimedOutFixture(scope)`
│   └── index.ts               # Barrel exporting builder functions
├── suggestions.ts             # Shared suggestion arrays grouped by scope
├── metadata.ts                # Utility helpers for meta totals/timings
└── index.ts                   # Public surface re-exporting builders + helpers
```

## Builder Responsibilities

- **`buildSingleScopeFixture`**: returns `{ scope, results, facets, total, took, timedOut, suggestions }` shaped to `HybridResponseSchema` + suggestion list. Accept optional overrides for totals, highlights, and facets.
- **`buildMultiScopeFixture`**: returns multi-bucket payload matching `MultiScopeHybridResponseSchema` with suggestions list.
- **`buildEmptyFixture`**: wraps the single-scope builder with zero totals and empty results for error/empty state rendering.
- **`buildTimedOutFixture`**: extends single- or multi-scope output with `timedOut: true` while retaining last-known totals for UX messaging.

## Type References

- Use types imported from `../structured-search.shared` (`HybridResponse`, `MultiScopeHybridResponse`, `SuggestionItem`).
- Facets must conform to `SearchFacetsSchema` sourced from `src/types/oak`.
- Suggestions align with `SuggestionResponseSchema` shapes, respecting `scope`, `label`, `url`, and optional `contexts` metadata.

## Integration Points

- `structured-search.actions.ts` and `/api/search` will consume builders via the public `index.ts`, switching between fixture/live data using the new resolver utility.
- `useSearchController` parsing remains unchanged; builders must pass Zod validation to guarantee compatibility.
- Playwright responsive suite will import builders for direct payload injection when bypassing network calls is still desirable.

## Next Steps

1. Model static data modules from the curated JSON snapshots (KS2 maths, KS4 maths, KS3 history, KS3 art, KS4 science) including representative facet and aggregation payloads.
2. Implement builder functions with TDD (unit tests alongside builders), ensuring suggestion responses expose cache metadata (`version`, `ttlSeconds`).
3. Introduce fixture mode resolver utility and update search actions/routes to branch on it.
4. Replace existing ad-hoc fixtures and Playwright route intercepts with the shared module.

## Adoption Checklist

- `structured-search.actions.ts`: replace inline fixture logic with `buildSingleScopeFixture`, `buildMultiScopeFixture`, `buildEmptyFixture`, and timed-out helpers once the runtime toggle selects fixture mode.
- `/app/api/search` and `/app/api/search/nl`: branch on the shared resolver and reuse builders for deterministic payloads when fixtures are enabled, ensuring zero-hit logging continues to operate.
- Playwright responsive suite: remove bespoke route intercepts in favour of toggling fixture mode; where direct injection is still required, import builders to seed payloads, including facet/aggregation data.
- Legacy fixture file `app/ui/__fixtures__/search-structured.ts`: plan removal after adoption to prevent drift from SDK-derived shapes.
- Documentation: keep context/plan docs referencing this module as the canonical fixture source so future Phase 2 schema work respects the cardinal rule.
