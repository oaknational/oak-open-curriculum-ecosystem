---
name: "URL Generation Cleanup and Type Safety"
overview: "Retire legacy generateOakUrl dispatcher, make bulk unit sequenceSlug/oakUrl type-safe at document-creation boundaries, plan for broader API-to-website resource mapping"
todos:
  - id: phase-0
    content: "Phase 0: Verify assumptions -- confirmed with scope adjustments (second caller in bulk-sequence-transformer.ts, additional createRollupDocument/createUnitDocument callers)"
    status: completed
  - id: phase-1-retire
    content: "Phase 1: Retire generateOakUrl -- removed from generator, barrel exports, migrated consumer to generateSubjectProgrammesUrl, cleaned dead tests"
    status: completed
  - id: phase-2-type-safe
    content: "Phase 2: Type-safe unit URLs -- sequenceSlug required, unitUrl: string added to CreateRollupDocumentParams/CreateUnitDocumentParams, all callers updated with explicit narrowing"
    status: completed
  - id: phase-3-docs
    content: "Phase 3: Documentation -- plan updated to COMPLETE"
    status: completed
  - id: quality-gates
    content: "Quality gates: type-check, lint, test, format all passing after each phase"
    status: completed
isProject: false
---

# URL Generation Cleanup and Type Safety

**Last Updated**: 2026-04-01
**Status**: COMPLETE
**Scope**: Retire legacy `generateOakUrl`, make bulk unit URL
generation type-safe, and plan for broader API-to-website
resource mapping using the sitemap reference data.

---

## Context

### What Exists

The URL generation system has three layers:

1. **Generator** (`generate-url-helpers.ts`) produces
   `url-helpers.ts` with URL pattern functions and two
   dispatchers: `generateOakUrlWithContext` (correct) and
   `generateOakUrl` (legacy fallback).
2. **Convenience functions** (`oak-url-convenience.ts`) wrap
   `generateOakUrlWithContext` with domain-specific parameters.
3. **Response augmentation** (`response-augmentation.ts`)
   computes `oakUrl` at runtime for API responses.

The bulk indexing path constructs `SearchUnitSummary` objects
with `oakUrl` that is optionally generated depending on whether
`sequenceSlug` is provided. Downstream document builders throw
at runtime if `oakUrl` is missing.

The sitemap reference (`canonical-url-map.json`) contains
27,797 teacher paths, 2,319 unit-to-programme mappings, and
17,377 lesson-to-programme-unit mappings. The
`subjectToKeyStages` mapping is empty (not yet populated).

### Issue 1: Legacy `generateOakUrl` still exists

The generated `url-helpers.ts` exports two dispatchers:

- `generateOakUrlWithContext` returns `string | null` with
  clear semantics: `string` = valid URL, `null` = entity type
  has no URL, throws = invalid input.
- `generateOakUrl` returns `string | undefined` conflating
  "no URL possible" and "missing context" into `undefined`.

All convenience functions delegate to `generateOakUrlWithContext`.
Only one consumer of `generateOakUrl` remains:

- [index-oak-helpers.ts](apps/oak-search-cli/src/lib/index-oak-helpers.ts)
  line 94 -- wraps a single key stage in an array and calls
  `generateOakUrl('subject', ...)`.

**Root Cause**: `generateOakUrl` was the original function;
`generateOakUrlWithContext` was added later with better
semantics. The old one was never removed.

### Issue 2: Bulk unit `sequenceSlug` is optional where
callers always provide it

In [bulk-rollup-builder.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts),
`transformBulkUnitToSummary` accepts `sequenceSlug?: string`
(optional) but all callers pass it. When undefined, `oakUrl`
becomes undefined. Downstream
[document-transforms.ts](apps/oak-search-cli/src/lib/indexing/document-transforms.ts)
throws at runtime if `summary.oakUrl` is missing.

`CreateRollupDocumentParams` and `CreateUnitDocumentParams`
rely on `summary.oakUrl` being present, but the schema-derived
`SearchUnitSummary` type has `oakUrl` as optional. The
narrowing is runtime, not compile-time.

**Root Cause**: The `sequenceSlug` was made optional when the
function was first written and never tightened after the call
sites stabilised.

### Issue 3: No plan for broader API-to-website mapping

The `canonicalUrl` is upstream-provided, lesson-only. `oakUrl`
is generated for all content types but uses hardcoded URL
templates. The sitemap reference has comprehensive path data
but `subjectToKeyStages` is empty.

The subject URL heuristic in `urlForSubject` picks from an
array of key stages (`ks1 > ks2 > ks3 > ks4`) because the
response augmentation extracts all key stages from the
response body rather than from the request path.

---

## Quality Gate Strategy

SDK changes propagate across workspaces. All gates run
unfiltered from repo root.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After Each Phase

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Solution Architecture

### Principle

> "Strict and complete, everywhere, all the time. Prefer
> explicit, total, fully checked systems over permissive,
> partial, or hand-wavy ones." -- principles.md

### Key Insight

The document-creation boundary (`CreateUnitDocumentParams`,
`CreateRollupDocumentParams`) should require `unitUrl: string`
as a separate field, just like `subjectProgrammesUrl: string`.
The caller proves it has the URL. The builder never guesses.
The schema-derived `SearchUnitSummary.oakUrl` stays optional
(schema-first preserved), but the narrowing moves from a
runtime throw to a compile-time requirement.

### Non-Goals (YAGNI)

- Changing the `urlForSubject` heuristic (requires sitemap
  scanner work)
- Making `canonicalUrl` available for non-lesson content
  types (accepted asymmetry per user decision)
- Modifying the response augmentation middleware for
  subjects (future plan)
- Changing the `SearchUnitSummary` schema type (schema-first)

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/testing-strategy.md`
3. **Re-read** `.agent/directives/schema-first-execution.md`
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts,
   no disabled checks

---

## Resolution Plan

### Phase 0: Verify Assumptions (~15 min)

#### Task 0.1: Confirm `generateOakUrl` consumers

**Assumption**: Only `index-oak-helpers.ts` imports
`generateOakUrl` from product code.

**Validation**:

```bash
rg 'generateOakUrl[^W]' --type ts -l
# Expected: only test files + index-oak-helpers.ts +
# generator + barrel exports
```

**If additional consumers found**: Add them to Phase 1
migration scope. Do not proceed until all are identified.

#### Task 0.2: Confirm `transformBulkUnitToSummary` callers

**Assumption**: Only `buildRollupDocs` calls
`transformBulkUnitToSummary`, and it always passes
`sequenceSlug`.

**Validation**:

```bash
rg 'transformBulkUnitToSummary' --type ts
# Expected: definition + buildRollupDocs call only
```

#### Task 0.3: Confirm `CreateRollupDocumentParams` sites

**Assumption**: `createRollupDocument` is called only where
`oakUrl` is already known (via the summary constructed by
`transformBulkUnitToSummary` or the API path).

**Validation**:

```bash
rg 'createRollupDocument\(' --type ts
# Expected: bulk-rollup-builder.ts and document-transforms
# test files
```

**Phase 0 Complete When**: All three assumptions confirmed
or scope adjusted.

---

### Phase 1: Retire `generateOakUrl` (TDD, ~30 min)

**Foundation Check-In**: Re-read principles.md section on
"Removing unused code" and "No compatibility layers".

#### Task 1.1: RED -- Generator test asserts absence

Update
[generate-url-helpers.unit.test.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.unit.test.ts):

- Change the `generateOakUrl (fallback)` describe block to
  assert the output does NOT contain `export function
  generateOakUrl`.
- Run test -- must FAIL (function still generated).

**Acceptance Criteria**:

1. Test exists asserting `generateOakUrl` is absent from
   generated output
2. Test fails (RED) because function is still generated

#### Task 1.2: GREEN -- Remove from generator and migrate

**Changes**:

1. [generate-url-helpers.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts):
   Remove the `fallbackSection` variable and its inclusion
   in the `generateUrlHelpers()` return array.
2. Run `pnpm sdk-codegen` to regenerate
   `url-helpers.ts` without `generateOakUrl`.
3. [api-schema.ts](packages/sdks/oak-sdk-codegen/src/api-schema.ts):
   Remove `generateOakUrl` from re-exports.
4. [index.ts](packages/sdks/oak-curriculum-sdk/src/index.ts):
   Remove `generateOakUrl` from barrel export.
5. [index-oak-helpers.ts](apps/oak-search-cli/src/lib/index-oak-helpers.ts):
   Replace `import { generateOakUrl }` with
   `import { generateSubjectProgrammesUrl }` and simplify
   `getSubjectProgrammesUrl` to call it directly with
   `(subject, ks)` instead of wrapping in an array.

**Acceptance Criteria**:

1. Generated `url-helpers.ts` does not contain
   `generateOakUrl`
2. No product code imports `generateOakUrl`
3. `index-oak-helpers.ts` uses `generateSubjectProgrammesUrl`
4. Generator test from Task 1.1 passes (GREEN)
5. `pnpm type-check` passes

#### Task 1.3: Remove dead tests

**Changes**:

1. [url-helpers.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/types/test-generated/url-helpers.unit.test.ts):
   Remove the `describe('generateOakUrl', ...)` block,
   the `generateOakUrl` import, the behavioural consistency
   test, and the `CONTENT_TYPE_PREFIXES coverage` tests
   that reference `generateOakUrl`.
2. [generate-url-helpers.unit.test.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.unit.test.ts):
   Replace the old `generateOakUrl (fallback)` tests with
   the absence assertion from Task 1.1.

**Acceptance Criteria**:

1. No test file references `generateOakUrl`
2. All tests pass

**Phase 1 Complete Validation**:

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix
pnpm test && pnpm test:e2e && pnpm smoke:dev:stub
```

---

### Phase 2: Type-Safe Unit URLs (TDD, ~45 min)

**Foundation Check-In**: Re-read principles.md sections on
"Strict and complete" and "Preserve type information".
Re-read schema-first-execution.md on schema-derived types.

#### Task 2.1: RED -- Tests for required `sequenceSlug`

Write/update tests in
[bulk-rollup-builder.unit.test.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.unit.test.ts):

- Test that `transformBulkUnitToSummary` produces a summary
  with `oakUrl` as a string (not undefined) when
  `sequenceSlug` is provided.
- Test that callers must provide `sequenceSlug` (compile-time
  check -- verified by the test file itself importing and
  calling the function with the required parameter).

Run tests -- must FAIL or produce type errors.

**Acceptance Criteria**:

1. Test exists asserting `oakUrl` is always a string when
   `sequenceSlug` is provided
2. Test fails (RED) or type-check fails

#### Task 2.2: RED -- Tests for required `unitUrl` on params

Write/update tests in
[document-transforms.unit.test.ts](apps/oak-search-cli/src/lib/indexing/document-transforms.unit.test.ts):

- Test that `createRollupDocument` uses the explicit
  `unitUrl` parameter for `unit_url` in the output.
- Test that `createUnitDocument` uses the explicit
  `unitUrl` parameter for the unit URL in the output.

Run tests -- must FAIL because `unitUrl` doesn't exist on
the params interfaces yet.

**Acceptance Criteria**:

1. Tests exist for explicit `unitUrl` usage
2. Tests fail (RED) because the parameter doesn't exist

#### Task 2.3: GREEN -- Interface changes

**Changes**:

1. [bulk-rollup-builder.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts):
   Make `sequenceSlug` required (remove `?`) in
   `transformBulkUnitToSummary` signature.

2. [document-transforms.ts](apps/oak-search-cli/src/lib/indexing/document-transforms.ts):
   - Add `unitUrl: string` to `CreateRollupDocumentParams`
   - Add `unitUrl: string` to `CreateUnitDocumentParams`
   - In `createRollupDocument`: use `p.unitUrl` for
     `unit_url` instead of extracting from
     `extractRollupDocumentFields`
   - In `extractUnitParamsFromAPI`: use `params.unitUrl`
     for `unitUrl` instead of throwing on
     `summary.oakUrl`. Remove the `if (!summary.oakUrl)
     throw` block.

3. Update all callers of `createRollupDocument` and
   `createUnitDocument` to pass `unitUrl` explicitly.
   Callers already have the URL available:
   - Bulk path: `generateUnitOakUrlFromSequence(...)` or
     `summary.oakUrl` (known present from construction)
   - API path: `summary.oakUrl` (validated by the API
     response augmentation layer)

**Acceptance Criteria**:

1. `transformBulkUnitToSummary` requires `sequenceSlug`
2. `CreateRollupDocumentParams` has `unitUrl: string`
3. `CreateUnitDocumentParams` has `unitUrl: string`
4. No runtime throw for missing `oakUrl` in
   `extractUnitParamsFromAPI`
5. All RED tests from 2.1 and 2.2 pass (GREEN)
6. `pnpm type-check` passes

#### Task 2.4: REFACTOR -- TSDoc and cleanup

- Add TSDoc to the new `unitUrl` fields on both interfaces
- Remove any dead `oakUrl` extraction code from
  `extractRollupDocumentFields` if it's no longer needed
- Verify TSDoc on `transformBulkUnitToSummary` reflects
  the required `sequenceSlug`

**Acceptance Criteria**:

1. TSDoc on all changed interfaces
2. No dead code remains
3. All tests pass

**Phase 2 Complete Validation**:

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix
pnpm test && pnpm test:e2e && pnpm smoke:dev:stub
```

---

### Phase 3: Documentation and Planning (~20 min)

**Foundation Check-In**: Re-read principles.md section on
"Document Everywhere".

#### Task 3.1: Update canonical-url-enforcement plan

Add a "Future Enhancements" section to
[canonical-url-enforcement.plan.md](.agent/plans/sdk-and-mcp-enhancements/current/canonical-url-enforcement.plan.md)
with two tracked improvements:

1. **Populate `subjectToKeyStages`**: The sitemap scanner
   should extract subject-to-key-stage mappings from the
   OWA sitemap, enabling data-driven subject URL generation
   and eliminating the `urlForSubject` heuristic.
2. **Subject response augmentation path-awareness**: The
   response augmentation middleware for subjects should
   extract the key stage from the request path (e.g.
   `/key-stages/ks3/subjects/maths`) rather than from the
   response body's `keyStages` array. This would make the
   augmented `oakUrl` match the teacher's browsing context.

#### Task 3.2: Update napkin

Record session decisions:
- `generateOakUrl` retired (no compatibility layer)
- `sequenceSlug` and `unitUrl` made type-safe at boundaries
- Subject heuristic deferred with tracked improvements
- `canonicalUrl` asymmetry accepted

#### Task 3.3: Quality gates

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix
pnpm test && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## Testing Strategy

### Unit Tests

**Existing Coverage**:

- `url-helpers.unit.test.ts` -- generated URL helper tests
- `generate-url-helpers.unit.test.ts` -- generator output
  tests
- `bulk-rollup-builder.unit.test.ts` -- bulk rollup builder
- `document-transforms.unit.test.ts` -- document transforms

**Modified Tests**:

- Remove `generateOakUrl` test suites (dead code)
- Add `sequenceSlug` required parameter tests
- Add `unitUrl` explicit parameter tests

**New Tests Required**:

- Generator output does NOT contain `generateOakUrl`
- `transformBulkUnitToSummary` always produces `oakUrl`
  when `sequenceSlug` provided
- `createRollupDocument` uses explicit `unitUrl` param
- `createUnitDocument` uses explicit `unitUrl` param

### Integration Tests

No new integration tests required. The existing integration
tests in `builder-field-integrity.integration.test.ts` and
`unit-lesson-count-correctness.integration.test.ts` will
validate the changes work correctly in context.

### E2E Tests

No E2E test changes expected. The changes are internal to
the document creation pipeline.

---

## Dependencies

**Blocking**: None. The URL remediation snagging plan is
complete and archived.

**Related Plans**:

- [canonical-url-enforcement.plan.md](.agent/plans/sdk-and-mcp-enhancements/current/canonical-url-enforcement.plan.md)
  -- receives a new "Future Enhancements" section
- [ADR-145](docs/architecture/architectural-decisions/145-oak-url-naming-collision-remediation.md)
  -- documents the naming remediation this builds on
- [ADR-047](docs/architecture/architectural-decisions/047-canonical-url-generation-at-codegen-time.md)
  -- canonical URL generation architecture

---

## Key Decisions

- **Schema-first preserved**: `SearchUnitSummary.oakUrl`
  stays `string | undefined` (schema-derived). Narrowing
  happens at the document-creation boundary via the new
  `unitUrl: string` field.
- **No compatibility layer**: `generateOakUrl` is deleted,
  not deprecated. Callers migrate immediately.
- **Convenience function reuse**: `index-oak-helpers.ts`
  migrates to `generateSubjectProgrammesUrl` (takes explicit
  single key stage) rather than `generateOakUrlWithContext`
  (which would still need the heuristic).
- **Subject heuristic deferred**: The `urlForSubject`
  heuristic stays in generated code for now. Tracked as a
  future improvement requiring `subjectToKeyStages`
  population in the sitemap scanner.

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to graduate settled content, extract
reusable patterns, rotate the napkin, manage fitness, and
update the practice exchange.

---

## Future Enhancements (Out of Scope)

- Populate `subjectToKeyStages` in sitemap scanner (enables
  data-driven subject URL generation)
- Path-aware subject response augmentation (extract key
  stage from request path)
- `canonicalUrl` for non-lesson content types (requires
  upstream API changes or OWA routing internalisation)
- `urlForSubject` heuristic elimination (depends on
  `subjectToKeyStages` population)

---

## References

- [url-helpers.ts](packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/routing/url-helpers.ts)
  -- generated URL helpers
- [generate-url-helpers.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts)
  -- generator source
- [oak-url-convenience.ts](packages/sdks/oak-curriculum-sdk/src/oak-url-convenience.ts)
  -- convenience wrappers
- [response-augmentation.ts](packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts)
  -- runtime augmentation
- [bulk-rollup-builder.ts](apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts)
  -- bulk rollup builder
- [document-transforms.ts](apps/oak-search-cli/src/lib/indexing/document-transforms.ts)
  -- document creation
- [canonical-url-map.json](packages/sdks/oak-sdk-codegen/reference/canonical-url-map.json)
  -- sitemap reference (27,797 paths)
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
