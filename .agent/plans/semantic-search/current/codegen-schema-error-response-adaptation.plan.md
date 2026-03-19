---
name: "Codegen Schema Error Response Adaptation"
overview: "Adapt sdk-codegen to handle upstream OpenAPI schema error responses (400, 401, 404) that were added across endpoints."
status: not_started
priority: critical
prerequisite: none
blocking: all semantic-search closure work, all pnpm check runs
todos:
  - id: investigate-response-map
    content: "Investigate how the response-map builder generates wildcard *:status entries and why cross-validation rejects them."
    status: not_started
  - id: adapt-cross-validator
    content: "Adapt the cross-validator and/or response-map builder to handle shared error response patterns."
    status: not_started
  - id: regenerate-types
    content: "Regenerate all types with pnpm sdk-codegen and fix downstream compilation."
    status: not_started
  - id: full-gates
    content: "Run pnpm check end-to-end and confirm Cardinal Rule is restored."
    status: not_started
---

# Codegen Schema Error Response Adaptation

**Status**: Not started
**Priority**: Critical — Cardinal Rule breach, blocks all quality gates
**Branch**: `feat/es_index_update`

## Problem

The upstream OpenAPI schema at `https://open-api.thenational.academy/api/v0/swagger.json`
now documents error responses (HTTP 400, 401, 404) with JSON schemas across
endpoints. Previously only 200 responses were documented.

`pnpm sdk-codegen` fails at the response-map cross-validation step:

```text
Response map cross-validation failed.
Extra   (3): *:400, *:401, *:404
```

This is a Cardinal Rule breach: the repo cannot adapt to an upstream schema
change by running `pnpm sdk-codegen`.

## Root Cause

The codegen pipeline has two relevant components:

1. **Response-map builder** (`packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts`)
   — scans the OpenAPI schema and produces `ResponseMapEntry[]` with
   `{operationId}:{status}` keys.

2. **Cross-validator** (`packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts`)
   — compares response-map entries against the schema to detect drift.

The upstream error responses appear to use a shared/global pattern. The
response-map builder generates wildcard `*:400`, `*:401`, `*:404` entries,
but the cross-validator's `collectExpectedResponseKeys` function builds
per-operation keys like `{operationId}:404`. The wildcard keys don't match
any expected keys, so they appear as "Extra".

## Context

- The 404 decorator for transcript (`schema-enhancement-404.ts`) has already
  been removed — the upstream schema now provides this response natively. The
  decorator infrastructure remains for future use.
- The `assertResponseStatusSlotAvailable` guard worked exactly as designed: it
  failed fast when the upstream schema started documenting 404 responses,
  signalling that the temporary decorator should be removed.
- The error-response documentation was requested in the upstream API metadata
  wishlist (`.agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md`
  item #4). The upstream team has now delivered.

## Investigation Steps

1. **Read the cached upstream schema** to understand the shape of the new
   error responses:
   - `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`
   - Check whether 400/401/404 are on individual operations or use a shared
     `components/responses` pattern.

2. **Read the response-map builder** to understand how it generates the `*:`
   prefix entries:
   - `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts`
   - `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-descriptor-helpers.ts`

3. **Determine the correct fix**:
   - Option A: The cross-validator should recognise wildcard entries as valid.
   - Option B: The response-map builder should produce per-operation entries
     for error responses, matching the cross-validator's expectations.
   - Option C: Error responses should be filtered out of cross-validation
     entirely (if they use a shared schema that doesn't need per-operation
     type generation).
   - The correct option depends on whether the codegen needs to generate
     typed error discriminants per endpoint (likely not — error shapes are
     typically shared).

4. **Check downstream impact**: the curriculum-sdk and search-sdk had
   additional type errors once codegen output was stale:
   - `curriculum-sdk:build` — `SearchScopeWithAll` indexing error (suggests
     the upstream schema may have added a new scope)
   - `oak-search-sdk:build` — type predicate in `rrf-query-helpers.ts`
   - These may resolve once codegen regenerates, or may need targeted fixes.

## Fix Approach (TDD)

1. Write RED tests proving the desired cross-validation behaviour with
   error responses present.
2. Implement the fix (likely in cross-validator or response-map builder).
3. Run `pnpm sdk-codegen` — confirm generation succeeds.
4. Run `pnpm build` — fix any downstream type issues from regenerated types.
5. Run `pnpm check` — confirm full gate passage.

## Files Likely to Change

| File | Change |
|------|--------|
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts` | Handle wildcard/shared error entries |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts` | Possibly adjust error response handling |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-descriptor-helpers.ts` | Possibly adjust wildcard generation |
| Downstream SDK files | Fix any type errors from regenerated code |

## Constraints

- TDD at all levels.
- No type shortcuts (`as`, `any`, `!`).
- The fix must be general — if the upstream adds more error status codes
  in future, `pnpm sdk-codegen` must handle them without manual intervention.
- The Cardinal Rule is the acceptance criterion: `pnpm sdk-codegen && pnpm build`
  must succeed after the fix.

## References

- Cardinal Rule: `.agent/directives/AGENT.md`, `.agent/directives/principles.md`
- Response-map builder: `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/`
- Cross-validator: `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts`
- 404 decorator (now empty): `packages/sdks/oak-sdk-codegen/code-generation/schema-enhancement-404.ts`
- Upstream wishlist: `.agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md` item #4
