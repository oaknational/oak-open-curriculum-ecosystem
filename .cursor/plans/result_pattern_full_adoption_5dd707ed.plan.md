---
name: Result Pattern Full Adoption
overview: Complete adoption of ADR-088 Result pattern across ALL fallible SDK operations, elimination of ALL naming-based versioning violations (files and functions), and moving error type generation to type-gen time per the Cardinal Rule.
todos:
  - id: phase0-audit
    content: Complete audit for all naming violations (safe* functions, duplicate utilities)
    status: completed
  - id: phase1-remove-throwing
    content: Remove ALL throwing SDK variants, rename safe* to standard names
    status: completed
  - id: phase1-interface-update
    content: Update OakSdkClient interface to Result-only methods
    status: completed
  - id: phase2-cache-result
    content: Create withCacheResult wrapper for Result<T,E> types
    status: completed
  - id: phase2-cache-update
    content: Apply caching to Result-returning methods
    status: completed
  - id: phase3-consumers
    content: Update all consumers to use Result pattern (no .catch())
    status: completed
  - id: phase4-consolidate-bulk
    content: Merge index-bulk-helpers-internal.ts and index-bulk-support.ts
    status: completed
  - id: phase4-review-overlap
    content: Review index-batch-helpers.ts vs index-oak-helpers.ts for overlap
    status: completed
  - id: phase4-dedupe-json
    content: Deduplicate safeJsonParse to shared utility
    status: completed
  - id: phase5-error-gen
    content: Create error type generator in SDK type-gen
    status: completed
  - id: phase5-delete-local
    content: Delete local sdk-error-types.ts after SDK generates
    status: completed
  - id: phase6-logging
    content: Enhance ingestion logging for post-run analysis
    status: completed
  - id: validation
    content: 'Validate: zero safe* matches, zero throwing variants, ingestion works'
    status: completed
---

# Result Pattern Full Adoption and Naming Discipline

This plan enforces ADR-088 as a **mandatory, universal pattern** for all fallible SDK operations. It eliminates all naming-based versioning violations discovered in the codebase, consolidates fragmented helper files, and moves error type generation to the SDK per the Cardinal Rule.

## Non-Negotiable Principle: Result Pattern for ALL Fallible Operations

Per ADR-088 and [rules.md](/.agent/directives-and-memory/rules.md):> "Handle All Cases Explicitly - Don't throw, use the result pattern `Result<T, E>`, handle all cases explicitly."**This means:**

- There is ONE version of each SDK method (Result-returning)
- NO throwing variants exist
- NO "safe" prefixes - the Result-returning version IS the standard version
- NO `.catch()` patterns to wrap exceptions - exceptions are wrapped once at the boundary

---

## Violations Identified

### 1. Function Naming Versioning (FORBIDDEN)

Having `safeGetX` and `getX` implies one is "unsafe" - this is versioning by naming:| File | Throwing Variant | "Safe" Variant (should be standard) ||------|------------------|-------------------------------------|| [`oak-adapter-sdk.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts) | `getUnitSummary` | `safeGetUnitSummary` || [`oak-adapter-sdk.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts) | `getLessonSummary` | `safeGetLessonSummary` || [`oak-adapter-sdk.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts) | `getLessonTranscript` | `safeGetLessonTranscript` |**Fix:** Remove throwing variants entirely. Rename `safeGetX` to `getX` - Result-returning IS the standard.

### 2. File Naming Versioning (FORBIDDEN)

Files with `-internal`, `-support` suffixes that share responsibility with a "main" file:| Main File | Versioned/Variant File | Violation ||-----------|------------------------|-----------|| `index-bulk-helpers.ts` | `index-bulk-helpers-internal.ts` | `-internal` suffix || `index-bulk-helpers.ts` | `index-bulk-support.ts` | `-support` suffix |**Fix:** Merge into single coherent module with clear public API.

### 3. Helper File Proliferation

Multiple overlapping helper files in the indexing domain:| File | Purpose | Status ||------|---------|--------|| [`src/lib/index-batch-helpers.ts`](apps/oak-open-curriculum-semantic-search/src/lib/index-batch-helpers.ts) | Subject context, pair building | Review for overlap || [`src/lib/index-oak-helpers.ts`](apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts) | Core document ops, pair building | Review for overlap || [`src/lib/indexing/index-bulk-helpers.ts`](apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts) | Unit/rollup documents | Consolidate || [`src/lib/indexing/index-bulk-helpers-internal.ts`](apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers-internal.ts) | processUnitSummary | Merge || [`src/lib/indexing/index-bulk-support.ts`](apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-support.ts) | fetchLessonMaterials | Migrate and merge |

### 4. Adapter Fragmentation

| File | Purpose | Status ||------|---------|--------|| [`oak-adapter-sdk.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts) | Main SDK client | Convert to Result only || [`oak-adapter-cached.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-cached.ts) | Caching wrapper | Update for Result types || [`oak-adapter-sdk-threads.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk-threads.ts) | Thread operations (split for length) | Valid split per rules.md |

### 5. Duplicate Functions

`safeJsonParse` exists in two files - DRY violation:

- [`oak-adapter-cached.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-cached.ts) line 48
- [`elasticsearch/setup/index.ts`](apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/setup/index.ts) line 110

### 6. Error Types in Wrong Location

[`sdk-error-types.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/sdk-error-types.ts) defines `SdkFetchError` locally. Per Cardinal Rule, this should be generated at type-gen time and flow from the SDK.---

## Implementation Phases

### Phase 0: Audit for Additional Violations

Before making changes, complete the audit:

1. Search for any remaining `safe*` function patterns
2. Search for duplicate utility functions
3. Verify all SDK methods have Result variants available

### Phase 1: SDK Adapter - Remove All Throwing Variants

In [`oak-adapter-sdk.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts):

1. Delete `assertSdkOk` helper (line 88-97)
2. Delete throwing factory functions:

- `makeGetUnitSummary` (lines 150-162)
- `makeGetLessonSummary` (lines 136-148)
- `makeGetLessonTranscript` (lines 122-134)

3. Rename Result-returning factories:

- `makeSafeGetUnitSummary` → `makeGetUnitSummary`
- `makeSafeGetLessonSummary` → `makeGetLessonSummary`
- `makeSafeGetLessonTranscript` → `makeGetLessonTranscript`

4. Update `OakSdkClient` interface:

- Remove throwing method signatures
- Rename `safeGet*` to `get*` (Result-returning IS the standard)

5. Add Result variants for remaining methods:

- `getUnitsByKeyStageAndSubject`
- `getSubjectSequences`
- `getSequenceUnits`
- `getLessonsByKeyStageAndSubject`

### Phase 2: Update Caching Layer

In [`oak-adapter-cached.ts`](apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-cached.ts):

1. Create `withCacheResult<T, E>` wrapper that handles `Result<T, E>` return types
2. Apply caching to Result-returning methods (currently bypassed at lines 164-166)
3. Remove `withCache` wrapper for throwing variants
4. Delete local `safeJsonParse` - consolidate to shared utility

### Phase 3: Update All Consumers

Files that still call throwing variants or use `.catch()`:

1. [`index-bulk-support.ts`](apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-support.ts) lines 81-97:

- Change from `.catch()` to await + Result handling

2. Any other files discovered in Phase 0 audit

### Phase 4: Consolidate Helper Files

Merge overlapping files into coherent modules:

1. **Indexing domain** - merge three files:

- `index-bulk-helpers-internal.ts` → delete
- `index-bulk-support.ts` → delete
- `index-bulk-helpers.ts` → becomes authoritative module

2. **Review index-batch-helpers.ts vs index-oak-helpers.ts**:

- Determine if they have overlapping concerns
- Consolidate if needed, or document distinct responsibilities

3. **Deduplicate safeJsonParse**:

- Create shared utility
- Import in both locations

### Phase 5: Move Error Types to SDK Type-Gen

Per Cardinal Rule, error types should flow from the schema:

1. Create generator template at `packages/sdks/oak-curriculum-sdk/type-gen/typegen/error-types/`
2. Generate `SdkFetchError` discriminated union from OpenAPI error responses
3. Export from SDK public API
4. Update imports in semantic-search app
5. Delete local `sdk-error-types.ts`

### Phase 6: Enhanced Logging

Improve ingestion issue reporting:

1. Structured log format for post-ingestion parsing
2. Retry attempt counts in warnings
3. Summary export for identifying consistent failures

---

## Files to Modify (Complete List)

| File | Action ||------|--------|| `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts` | Remove throwing variants, rename safe→standard || `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-cached.ts` | Add Result caching, remove throwing wrappers || `apps/oak-open-curriculum-semantic-search/src/adapters/sdk-error-types.ts` | DELETE (move to SDK) || `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers-internal.ts` | DELETE (merge) || `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-support.ts` | DELETE (merge) || `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts` | Consolidate || `apps/oak-open-curriculum-semantic-search/src/lib/index-batch-helpers.ts` | Review overlap || `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts` | Review overlap || `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/setup/index.ts` | Remove duplicate safeJsonParse || `packages/sdks/oak-curriculum-sdk/type-gen/typegen/error-types/*.ts` | CREATE generators || `packages/sdks/oak-curriculum-sdk/src/index.ts` | Export error types |---

## Quality Gates

After each phase, run complete suite:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Validation

After completion:

1. `grep -r "safeGet" src/` returns 0 matches
2. `grep -r "assertSdkOk" src/` returns 0 matches
