---
name: "Codegen Schema Error Response Adaptation"
overview: "Adapt sdk-codegen to handle upstream OpenAPI schema error responses (400, 401, 404) that were added across endpoints."
status: complete
priority: critical
prerequisite: none
blocking: none (unblocked — follow-up work in error-response-classification plan)
completed: 2026-03-20
todos:
  - id: investigate-response-map
    content: "Investigate how the response-map builder generates wildcard *:status entries and why cross-validation rejects them."
    status: complete
  - id: fix-cross-validator-wildcards
    content: "Fix cross-validator to expect wildcard entries when all operations share the same component for a status code (Bug 1)."
    status: complete
  - id: fix-emitter-dotted-component-names
    content: "Fix emitter buildSchemaExpression to use bracket notation for component names containing dots (Bug 2)."
    status: complete_superseded
    note: "Root cause was in the builder, not the emitter. sanitizeIdentifier applied in collectResponses."
  - id: fix-builder-componentname-sanitisation
    content: "Ensure response-map builder sanitises component names from $ref to match Zod schema keys (Bug 2 root cause)."
    status: complete
  - id: update-schema-cache
    content: "Update the cached schema (schema-cache/api-schema-original.json) to the live version so CI mode also works."
    status: complete
    note: "Automatically updated by writeSchemaCacheIfChanged during pnpm sdk-codegen."
  - id: regenerate-types
    content: "Regenerate all types with pnpm sdk-codegen and fix downstream compilation."
    status: complete
  - id: full-gates
    content: "Run pnpm check end-to-end and confirm Cardinal Rule is restored."
    status: complete
---

# Codegen Schema Error Response Adaptation

**Status**: Investigation complete — two bugs identified, fix approach designed
**Priority**: Critical — Cardinal Rule breach, blocks all quality gates
**Branch**: `feat/es_index_update`
**Session**: Separate from semantic-search closure — this is a codegen concern,
not a search concern. The search session gates on this completing first.
**Investigated**: 2026-03-19

## Problem

The upstream OpenAPI schema at `https://open-api.thenational.academy/api/v0/swagger.json`
(version `0.6.0-e9319ab8cd3e3b02d3db3215d2d4d1640e0ef515`) now documents error
responses (HTTP 400, 401, 404) with JSON schemas across all 26 endpoints.
Previously only 200 responses were documented.

`pnpm sdk-codegen` fails at the response-map cross-validation step:

```text
Response map cross-validation failed.
Extra   (3): *:400, *:401, *:404
```

This is a Cardinal Rule breach: the repo cannot adapt to an upstream schema
change by running `pnpm sdk-codegen`.

## Investigation Findings (2026-03-19)

### Upstream Schema Shape

The live upstream schema documents error responses as follows:

- **400**, **401**, **404** on **all 26 endpoints** (uniform coverage)
- All three use `$ref` to `components/schemas` — specifically:
  - `#/components/schemas/error.BAD_REQUEST`
  - `#/components/schemas/error.UNAUTHORIZED`
  - `#/components/schemas/error.NOT_FOUND`
- There is **no** `components/responses` section — refs are at the schema
  level within each operation's response content
- All three share a consistent shape: `{ message: string, code: string, issues: Array<{ message: string }> }`
- Component names contain **dots** (e.g., `error.BAD_REQUEST`) — this is
  unusual for OpenAPI and has implications for code generation

### Cached Schema vs Live Schema

The cached schema (`schema-cache/api-schema-original.json`) has **no error
responses** — only 200s, and no `components/responses` section. The cache is
updated at codegen time only when the schema version changes (README says
"iff `info.version` differs").

**Implication**: `SDK_CODEGEN_MODE=ci pnpm sdk-codegen` (or `--ci` flag) uses
the cache and would pass today because the cache predates the error-response
addition. This provides a decoupling mechanism for development and testing.

### Schema Transformation Pipeline

Before the response-map builder sees the schema, it passes through:

1. `loadSchema()` — fetches live or reads cache
2. `createOpenCurriculumSchema(validated)` in `schema-separation-core.ts`:
   - `decorateCanonicalUrls(validated)` — adds canonicalUrl fields
   - `add404ResponsesWhereExpected(canonicalised)` — applies 404 decorators
3. Returns `{ original, validated, sdk }` where `sdk` is the decorated version

The 404 decorator list (`ENDPOINTS_WITH_LEGITIMATE_404S`) is now empty — the
transcript decorator was removed since the upstream schema now documents 404
natively. The decorator infrastructure remains for future use and is a no-op.

### Bug 1: Cross-Validator Does Not Expect Wildcard Entries

**Where**: `cross-validate.ts:56-64` (`crossValidateResponseMap`)

**Mechanism**: The response-map builder (`build-response-map.ts:62-93`) has a
deliberate wildcard consolidation pass. After collecting all per-operation
entries, it groups by status code. If every `source: 'component'` entry for a
given status uses the **same single component name**, it emits an additional
wildcard entry: `{ operationId: '*', status, path: '*', method: '*' }`.

With the live schema, this produces:

- 26 per-operation entries for each of 400, 401, 404 (78 entries)
- 3 wildcard entries: `*:400`, `*:401`, `*:404`
- Plus all existing `{opId}:200` entries

The cross-validator's `collectExpectedResponseKeys` walks the schema and builds
`{operationId}:{status}` keys for every operation+response with a JSON schema.
It never generates `*:` keys because the schema has no wildcard concept. The
78 per-operation error entries match their expected keys. But the 3 wildcard
entries have no match → appear as "Extra".

**Existing wildcard support**: The rest of the pipeline already handles
wildcards correctly:

- The **emitter** (`emit-response-validators.ts:84-90`) has `getWildcardRecord()`
  that looks up `*:{statusCode}` entries at runtime
- The **descriptor helpers** (`build-response-descriptor-helpers.ts:19-49`)
  separate wildcards from per-operation entries and merge them as a base layer
  under each operation, with operation-specific entries overriding

The cross-validator is the **only component** that was not updated when the
wildcard consolidation was added.

### Bug 2: Dotted Component Names Break the Emitter

**Where**: `emit-response-validators.ts:159-175` (`buildSchemaExpression`)

**Mechanism**: The upstream error schemas use dotted component names
(`error.BAD_REQUEST`, `error.UNAUTHORIZED`, `error.NOT_FOUND`). The response-map
builder extracts these from `$ref` via `extractComponentNameFromRef()` which
splits by `/` and takes the last segment — returning the raw name including dots.

The emitter's `buildSchemaExpression` generates:

```typescript
return 'curriculumSchemas.' + entry.componentName;
```

For `componentName = 'error.BAD_REQUEST'`, this produces:

```typescript
curriculumSchemas.error.BAD_REQUEST
```

This is **syntactically valid** JavaScript but **semantically wrong** — it
would try to access `curriculumSchemas.error` (undefined) then `.BAD_REQUEST`
instead of `curriculumSchemas['error.BAD_REQUEST']`.

**Compounding factor**: The Zod schema generation pipeline sanitises keys via
`sanitizeSchemaKeys` / `renameInlineSchema` using
`original.replace(/[^A-Za-z0-9_]/g, "_")`. So the Zod registry stores these as
`error_BAD_REQUEST`, not `error.BAD_REQUEST`. The emitter would need to either:

- Use the sanitised name to access the Zod registry, or
- Use bracket notation with the raw name

The `sanitizeIdentifier` function in `shared.ts` already exists and performs the
same transformation (`value.replace(/[^A-Za-z0-9_]/g, '_')`), but it is only
applied to **inline** schemas, not to component schemas. This is the root cause:
component names from `$ref` are passed through unsanitised.

### Downstream Type Errors (Reassessed)

The plan previously noted two downstream errors:

1. **`curriculum-sdk:build` — `SearchScopeWithAll` indexing error**: The scope
   generator (`generate-search-scopes.ts`) is **static** — it hardcodes
   `['lessons', 'units', 'sequences']` and ignores the schema. So
   `SearchScopeWithAll` will not change from the upstream update. This error is
   likely from **stale generated types** (the current generated code was produced
   from the old schema) and should resolve once codegen regenerates successfully.

2. **`oak-search-sdk:build` — type predicate in `rrf-query-helpers.ts`**: No
   `SearchScopeWithAll` or type predicate references found in the search SDK's
   `rrf-query-helpers.ts`. This was likely a cascade from stale types and should
   also resolve after regeneration.

**Conclusion**: No targeted downstream fixes are expected. Both errors should
resolve once `pnpm sdk-codegen && pnpm build` runs cleanly.

### Schema-Status Guard

The `assertResponseStatusSlotAvailable` guard (`schema-status-guard.ts`) is a
simple slot-collision detector for the 404 decorator. It checks if a response
status already exists for an operation before adding a decorator. It worked
exactly as designed — failing fast when the upstream schema started documenting
404 responses, which triggered the transcript decorator removal. No changes
needed here.

## Recommended Fix Approach

### Fix 1 — Cross-Validator Wildcard Awareness (Bug 1)

**Approach**: Option A from the original plan — teach `collectExpectedResponseKeys`
to also generate wildcard expected keys when it detects that a status code
appears with the same `$ref` component across all operations.

**Implementation**:

1. After walking all operations, group the collected keys by status code
2. For each status code that appears across **all** operations with JSON schemas,
   check if they all reference the same component schema (via `$ref`)
3. If so, add `*:{status}` to the expected set
4. This mirrors the response-map builder's consolidation logic (lines 62-93)

**Why not the other options**:

- **Option B** (remove wildcards from builder): Wrong — the emitter's runtime
  already uses `getWildcardRecord()` and the descriptor helpers merge wildcards.
  Removing wildcards would break the emitter's error-response lookup.
- **Option C** (exclude errors from validation): Too blunt — would lose
  validation for legitimate per-endpoint error responses (e.g., if the upstream
  later adds endpoint-specific error schemas).

**Test strategy**:

- RED: Unit test with a schema having shared error responses across all
  operations, asserting `crossValidateResponseMap` does not throw when wildcard
  entries are present alongside per-operation entries
- GREEN: Implement the wildcard-aware expected-key collection
- Refactor: Extract the grouping logic into a named pure function

### Fix 2 — Component Name Sanitisation (Bug 2)

**Approach**: Sanitise component names from `$ref` in the response-map builder
to match the Zod schema key convention. The `sanitizeIdentifier` function in
`shared.ts` already exists and does the right transformation.

**Implementation options** (in order of preference):

1. **Apply `sanitizeIdentifier` to component names in `collectResponses`**
   (response-map builder). When `getJsonResponseInfo` returns a component
   source, sanitise the `name` field. This ensures all downstream consumers
   (emitter, descriptor helpers) receive consistent identifiers.

2. **Apply bracket notation in `buildSchemaExpression`** (emitter). Change
   `'curriculumSchemas.' + entry.componentName` to
   `'curriculumSchemas[' + JSON.stringify(entry.componentName) + ']'`. This
   handles arbitrary names but doesn't fix the mismatch with Zod registry keys.

Option 1 is preferred because it fixes the problem at the source. The component
name flows through three layers (builder → cross-validator → emitter →
descriptor helpers), and sanitising at the entry point ensures consistency.

**Test strategy**:

- RED: Unit test in `build-response-map.unit.test.ts` with a schema using
  dotted `$ref` component names, asserting entries have sanitised
  `componentName` values
- GREEN: Apply `sanitizeIdentifier` to component names in the builder
- Refactor: Verify emitter output references the correct Zod schema key

### Fix 3 — Update Schema Cache

After fixes 1 and 2 are in place and `pnpm sdk-codegen` passes against the live
schema, the cache will be automatically updated by `writeSchemaCacheIfChanged`
in `codegen.ts:141` (it compares `info.version`). Confirm the cache is updated
and CI mode also passes.

## Execution Sequence (TDD)

### Phase 1: Bug 2 — Component Name Sanitisation

Fix the builder first because Bug 1's fix depends on correct component names
for the "same component" detection logic.

1. **RED**: Write unit test in `build-response-map.unit.test.ts`:
   - Schema with dotted `$ref` names (e.g., `error.BAD_REQUEST`)
   - Assert `componentName` in resulting entries is sanitised (`error_BAD_REQUEST`)
2. **GREEN**: In `collectResponses` or `getJsonResponseInfo`, apply
   `sanitizeIdentifier` to the component name extracted from `$ref`
3. **Verify**: Run existing response-map tests to ensure no regressions

### Phase 2: Bug 1 — Cross-Validator Wildcard Awareness

4. **RED**: Write unit test in `cross-validate.unit.test.ts`:
   - Schema with shared error responses (all operations → same component per status)
   - Response-map entries including both per-operation and wildcard entries
   - Assert `crossValidateResponseMap` does not throw
5. **RED**: Write unit test for the inverse — different components per status
   should NOT generate wildcards and SHOULD throw if wildcards are in entries
6. **GREEN**: Implement wildcard-aware expected-key collection in
   `collectExpectedResponseKeys`
7. **Verify**: Run existing cross-validator tests

### Phase 3: Integration and Regeneration

8. Run `pnpm sdk-codegen` against the live schema — confirm success
9. Run `pnpm build` — fix any downstream type errors (likely none per analysis)
10. Run `pnpm check` — confirm full gate passage

### Phase 4: Update Authority Documents

11. Mark this plan as complete
12. Update the semantic-search prompt's prerequisite gate

## Files to Change

| File | Change | Bug |
|------|--------|-----|
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/shared.ts` | Possibly extend `getJsonResponseInfo` to sanitise component names | 2 |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.ts` | Apply `sanitizeIdentifier` to component names from `$ref` | 2 |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-map.unit.test.ts` | Add tests for dotted component name sanitisation | 2 |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts` | Teach `collectExpectedResponseKeys` to detect shared-component wildcards | 1 |
| `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.unit.test.ts` | Add tests for wildcard-aware validation | 1 |

Files **NOT** expected to change:

- `emit-response-validators.ts` — already handles wildcards correctly
- `build-response-descriptor-helpers.ts` — already handles wildcards correctly
- `schema-enhancement-404.ts` — already updated (empty list), no changes needed
- `schema-status-guard.ts` — working as designed
- Downstream SDK files — errors expected to resolve after regeneration

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Component name sanitisation creates key mismatch with Zod registry | Low | Use the same `sanitizeIdentifier` function used by `renameInlineSchema` |
| Wildcard detection has edge cases (e.g., only some endpoints have errors) | Low | The wildcard consolidation in the builder only triggers when ALL `source: 'component'` entries for a status share one component; cross-validator should mirror this |
| Live schema adds more error codes later (e.g., 429, 500) | Expected | Both fixes are general — no hardcoded status codes |
| Regenerated types change downstream API surfaces | Low | `SearchScopeWithAll` is static, response types are stable |

## Decoupling Strategy

- `SDK_CODEGEN_MODE=ci pnpm sdk-codegen` uses the cached schema (no errors) —
  passes today. This allows developing and testing the fix with synthetic
  schemas in unit tests before touching the live schema.
- Once the fix is in place, a normal `pnpm sdk-codegen` run fetches live,
  applies the fix, and updates the cache automatically.

## Constraints

- TDD at all levels. No type shortcuts.
- The fix must be general — if the upstream adds more error status codes
  in future, `pnpm sdk-codegen` must handle them without manual intervention.
- The Cardinal Rule is the acceptance criterion: `pnpm sdk-codegen && pnpm build`
  must succeed after the fix.
- Do not expand scope beyond making `pnpm sdk-codegen` and `pnpm check` pass.
- Do not touch search-cli ingestion code — that is a separate session.
- All reviewer findings are blocking.

## References

- Cardinal Rule: `.agent/directives/AGENT.md`, `.agent/directives/principles.md`
- Response-map builder: `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/`
- Cross-validator: `packages/sdks/oak-sdk-codegen/code-generation/typegen/validation/cross-validate.ts`
- Emitter: `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/emit-response-validators.ts`
- Descriptor helpers: `packages/sdks/oak-sdk-codegen/code-generation/typegen/response-map/build-response-descriptor-helpers.ts`
- Zod schema generation: `packages/sdks/oak-sdk-codegen/code-generation/zodgen-core.ts`
- Schema transformation: `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-core.ts`
- 404 decorator (now empty): `packages/sdks/oak-sdk-codegen/code-generation/schema-enhancement-404.ts`
- Schema status guard: `packages/sdks/oak-sdk-codegen/code-generation/schema-status-guard.ts`
- Upstream wishlist: `.agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md` item #4
