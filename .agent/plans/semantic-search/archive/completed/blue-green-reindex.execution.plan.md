---
name: "Blue/Green Reindex — First Live Run"
overview: >
  Stage versioned indexes using the new blue/green infrastructure (ADR-130),
  validate offline, then promote to live. This is the first use of the
  stage/promote workflow and will migrate the existing bare indexes to
  alias-backed indexes. Bulk data is already downloaded. The first attempt
  (2026-03-08) failed because the SDK's ingest function was built in isolation
  from the existing CLI bulk ingestion pipeline and does not understand the
  bulk download data format. A rewrite is required before staging can succeed.
todos:
  - id: migration-fix
    content: "Add remove_index support to atomicAliasSwap for bare-index migration."
    status: completed
  - id: reviewer-fixes
    content: "Fix 2 remaining type errors from reviewer-mandated changes and run quality gates."
    status: completed
  - id: preflight
    content: "Verify environment, cluster health, and current index state."
    status: completed
  - id: remove-index-smoke-test
    content: "Smoke-test remove_index on Elastic Serverless with throwaway index."
    status: completed
  - id: ingest-rewrite
    content: "SUPERSEDED — moved to unified-versioned-ingestion.md (Phase 1-2)."
    status: completed
  - id: stage
    content: "SUPERSEDED — moved to unified-versioned-ingestion.md (Phase 3)."
    status: completed
  - id: validate
    content: "SUPERSEDED — moved to unified-versioned-ingestion.md (Phase 3)."
    status: completed
  - id: promote
    content: "SUPERSEDED — moved to unified-versioned-ingestion.md (Phase 3)."
    status: completed
  - id: verify
    content: "SUPERSEDED — moved to unified-versioned-ingestion.md (Phase 3)."
    status: completed
isProject: false
---

# Blue/Green Reindex — First Live Run

## Session Entry Point

**Status: SUPERSEDED** — this plan has been replaced by
[unified-versioned-ingestion.md](../../active/unified-versioned-ingestion.md) (2026-03-09).

This document is retained as a historical record: the "What Went Wrong"
analysis, root cause investigation, and completed prerequisites
(migration fix, reviewer fixes, preflight, `remove_index` smoke test)
are referenced by the successor plan.

## What Went Wrong (2026-03-08)

### Timeline

1. Preflight passed — 6 bare concrete indexes, cluster green, env loaded
2. `remove_index` smoke test passed on Elastic Serverless (throwaway index)
3. `pnpm oaksearch admin stage --bulk-dir ./bulk-downloads --verbose` — **failed**
4. All 6 versioned indexes were created (green) but all had **0 documents**
5. Verification caught the failure: `oak_lessons_v2026-03-08-203118 has 0 docs`
6. Orphaned empty versioned indexes were manually cleaned up

### Root Cause

The SDK's `runIngest` function (`packages/sdks/oak-search-sdk/src/admin/ingest.ts`)
was **built in complete isolation** from the existing CLI bulk ingestion pipeline.
It expects flat JSON arrays of documents with a `doc_type` field. The actual bulk
download files are **objects** structured as:

```json
{
  "sequenceSlug": "maths-primary",
  "subjectTitle": "Maths",
  "sequence": [ /* units */ ],
  "lessons": [ /* lessons */ ]
}
```

This format is fully documented in `apps/oak-search-cli/bulk-downloads/schema.json`
and typed in `@oaknational/sdk-codegen` as `BulkDownloadFile` with Zod validation
via `bulkDownloadFileSchema`. The SDK's `runIngest` uses none of this.

### Specific Failures

| Principle | Violation |
|-----------|-----------|
| **Cardinal Rule** (types from schema) | `runIngest` reads raw `unknown[]` instead of using `BulkDownloadFile` |
| **Fail fast** | `readJsonFile()` silently returns `[]` when data is not an array |
| **No type shortcuts** | Entire ingest operates on `unknown` with a loose `doc_type` type guard |
| **Define types once** | File reading, doc classification reinvented instead of using `parseBulkFile()` |
| **Prefer library types** | Generated Zod schemas in `sdk-codegen` completely ignored |
| **DRY** | Bulk file reading duplicated between SDK ingest and `sdk-codegen/bulk/reader.ts` |
| **No debug logging** | Zero `logger.debug()` calls — failure was invisible |

### What the SDK's `runIngest` Cannot Produce

The existing CLI pipeline transforms raw bulk data through adapters that produce:

- **Unit rollups** — synthetic faceting documents (entire `oak_unit_rollup` index)
- **Thread extraction** — from unit thread metadata
- **Sequence/sequence facet extraction** — from file-level sequence data
- **KS4 tier enrichment** — API supplementation for exam boards/tiers
- **Computed fields** — slug composites, content types, vocabulary aggregation
- **Vocabulary statistics** — keyword/misconception aggregation

The SDK's `runIngest` does none of this. It would push raw lesson JSON directly
to ES without any transformation, even if the data format issue were fixed.

### Cleanup Done

- 6 orphaned empty versioned indexes deleted manually
- Cluster restored to original state (6 bare concrete indexes)

---

## What Works

The following lifecycle code is **sound and tested** (172 tests pass):

- **Alias operations** — `atomicAliasSwap`, `resolveCurrentAliasTargets`, bare-index detection
- **Swap builders** — `buildSwapActions` with `bareIndexToRemove` for first-run migration
- **Promote flow** — `lifecycle-promote.ts`, metadata write, cleanup
- **Rollback** — atomic swap back to previous version from `oak_meta`
- **Alias validation** — `validate-aliases` command
- **Index creation** — `createAllIndexes` with SDK-generated mappings
- **Version generation** — timestamp-based version strings
- **`remove_index` on Elastic Serverless** — confirmed working (smoke tested)

The problem is **only** the ingest integration: the `runVersionedIngest` dep
calls a broken `runIngest` instead of the existing CLI bulk pipeline.

---

## Potential Solutions

The next session should evaluate these options critically.

### Option A: Thread `IndexResolverFn` Through CLI Bulk Pipeline

**Approach**: Replace the 6 hardcoded index name constants in
`bulk-ingestion-phases.ts` with calls to an injected `IndexResolverFn`.
Wire the `stage` command to call the existing bulk pipeline with a
versioned resolver.

**Scope**:

- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts` — replace
  6 constants with resolver calls, thread resolver through phase functions
- `apps/oak-search-cli/src/adapters/hybrid-data-source.ts` — accept resolver
  in `toBulkOperations()`
- `apps/oak-search-cli/src/adapters/bulk-thread-transformer.ts` — accept resolver
- `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts` — accept resolver
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` — wire
  `stage` command to call the refactored pipeline
- `packages/sdks/oak-search-sdk/src/admin/ingest.ts` — delete or gut

**Pros**: Reuses all transformation logic, all types, all adapters.
**Cons**: Wider refactor surface. Must thread resolver through many functions.
Existing `admin ingest` command must continue to work (regression risk).

### Option B: Pre-Transform Bulk Data, Then Use SDK Ingest

**Approach**: Add a pre-processing step that reads bulk files via
`readAllBulkFiles()`, runs them through the adapter transformers, and writes
flat `{doc_type, ...}` arrays. Then the SDK's `runIngest` reads those.

**Pros**: Smaller change to SDK ingest. Clear separation.
**Cons**: Extra disk I/O. Two-step process. Still need to wire transformers.
Creates an intermediate format that is itself a new type to maintain.

### Option C: Lifecycle Service Delegates to CLI Bulk Pipeline

**Approach**: The `stage` command calls the existing `executeBulkIngestion()`
function directly, but with a versioned index target. The lifecycle service
only handles alias swapping, metadata, and cleanup.

**Pros**: Minimal change. The existing pipeline already works.
**Cons**: The existing pipeline dispatches operations to ES directly —
the versioned index names would need to be injected. The existing pipeline's
`rewriteBulkOperations()` only handles primary↔sandbox, not versioned names.

### Recommended Starting Point

**Option A** is the most architecturally sound — it unifies the two systems
and eliminates the DRY violation. But the next session should **validate this
assumption** by reading the actual adapter code and assessing the threading
difficulty. Option C may be faster if `rewriteBulkOperations()` can be
extended to handle versioned names.

---

## Assumptions

The next session **must question and validate** each of these:

1. **The existing CLI bulk pipeline produces correct ES documents** — the bare
   indexes were populated by this pipeline, and search works. But has the
   pipeline been run recently? Are the adapters current with the latest mappings?

2. **Threading `IndexResolverFn` through the pipeline is feasible** — the
   hardcoded index names are in ~6 locations. But the adapters may have
   deeper assumptions about index names (e.g., in NDJSON construction).

3. **The existing `admin ingest` command can continue working** — the refactor
   must not break the bare-index ingestion path. Regression testing is needed.

4. **KS4 API supplementation is needed during stage** — the bulk downloads
   lack tier/exam board data for KS4. The stage command may need API access.
   If so, `OAK_API_KEY` is required and rate limiting applies.

5. **The 6 index kinds are exhaustive** — `lessons`, `units`, `unit_rollup`,
   `threads`, `sequences`, `sequence_facets`. No new index kinds are pending.

6. **Mappings are current** — the versioned indexes will be created with
   SDK-generated mappings. These must match what the CLI adapters produce.

---

## Prevention

How to avoid this class of error in future:

1. **Type-driven design** — The `runVersionedIngest` dep should have been typed
   to accept `BulkDownloadFile[]`, not `IngestOptions` with a `bulkDir` string.
   If the function signature demanded the typed data, the compiler would have
   forced correct handling.

2. **Read existing code first** — Before writing new ingestion code, the
   existing pipeline (`bulk-ingestion-phases.ts`, `hybrid-data-source.ts`,
   `bulk-downloads/schema.json`) should have been read and understood.

3. **Debug logging as standard** — Every IO function should have
   `logger.debug()` calls at entry, decision points, and exit. The
   silent `return []` in `readJsonFile()` is a textbook fail-fast violation.

4. **Smoke test with real data** — The ingest function was never tested
   against actual bulk download files. An integration test that reads one
   real bulk file and asserts non-zero doc counts would have caught this.

5. **Schema-first for internal data too** — The cardinal rule applies to
   internal data formats, not just the upstream API. The bulk download
   schema exists (`schema.json`) and generates types. Use them.

6. **Invoke reviewers before AND after code** — The original lifecycle
   ingest code was never reviewed. Architecture reviewers (Barney, Betty,
   Fred, Wilma) would have caught the isolation from existing infrastructure.
   Type reviewer would have caught the `unknown[]` signature. Elasticsearch
   reviewer would have questioned whether raw JSON could produce valid ES
   documents. **Reviewers must be invoked on approach (before code) and on
   implementation (after code).** See the
   [invoke-code-reviewers directive](../../../../directives/invoke-code-reviewers.md)
   for the full invocation matrix.

7. **Review intentions, not just code** — Per AGENT.md: "Reviewers can
   review intentions, not just code. Before implementing a complex change,
   ask a reviewer whether the approach is sound." If the approach for the
   lifecycle ingest had been described to any architecture reviewer, the
   response would have been: "Why are you not using the existing pipeline?"

---

## Context

This is the **first live use** of the blue/green index lifecycle
infrastructure (ADR-130). The current Elasticsearch cluster has 6 bare
concrete indexes (`oak_lessons`, `oak_units`, etc.). This run will:

1. Create 6 new versioned indexes alongside the bare ones
2. Ingest all bulk data into the versioned indexes
3. Atomically swap: remove bare indexes + create aliases in one ES request
4. The MCP server and search CLI continue working — they already use alias
   names, which will now resolve to the versioned indexes

**Why this matters**: After this run, all future reindexes are zero-downtime
blue/green swaps. The bare-index-to-alias migration is a one-time operation.

### Key References

- [ADR-130](../../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green design
- [INDEXING.md](../../../../../apps/oak-search-cli/docs/INDEXING.md) — Ingestion field expectations
- [high-level plan](../../../high-level-plan.md) — Strategic context (step 2 of immediate intentions)
- [API gaps inventory](../../active/api-gaps-for-bulk-downloads.md) — Data not in bulk downloads

### Key Files

- `apps/oak-search-cli/` — CLI that runs stage/promote/rollback commands
- `packages/sdks/oak-search-sdk/src/admin/` — Lifecycle service, alias operations, swap builders
- `apps/oak-search-cli/bulk-downloads/` — Pre-downloaded bulk data
- `apps/oak-search-cli/bulk-downloads/schema.json` — **Bulk data format schema**
- `packages/sdks/oak-sdk-codegen/src/bulk/reader.ts` — **Typed bulk file reader**
- `packages/sdks/oak-sdk-codegen/src/types/generated/bulk/` — **Generated Zod schemas**
- `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts` — **Existing pipeline (hardcoded names)**
- `apps/oak-search-cli/src/adapters/` — **Transformation adapters (lesson, unit, thread, etc.)**

### Existing Pipeline Architecture

```text
bulk-downloads/*.json (BulkDownloadFile objects)
  ↓ parseBulkFile() — Zod validation via bulkDownloadFileSchema
  ↓ HybridDataSource — merges bulk data + API supplementation (KS4)
  ├→ bulk-lesson-transformer → SearchLessonsIndexDoc[]
  ├→ bulk-unit-transformer → SearchUnitsIndexDoc[]
  ├→ bulk-rollup-builder → SearchUnitRollupDoc[]
  ├→ bulk-thread-transformer → thread docs
  ├→ bulk-sequence-transformer → sequence + facet docs
  └→ vocabulary-mining-adapter → vocabulary statistics
  ↓ NDJSON bulk operations (with HARDCODED index names)
  ↓ ES /_bulk API dispatch
```

The hardcoded index names at the NDJSON level are the integration point
that needs to change for versioned indexes.

## Non-Goals

- Changing mappings or analysers (use existing SDK-generated mappings)
- Adding new indexes beyond the 6 curriculum indexes
- Running ground truth benchmarks (separate follow-up)

## Rollback

At any point after promotion, if the service is degraded:

```bash
cd apps/oak-search-cli
pnpm oaksearch admin rollback
```

This atomically swaps aliases back to the previous version (recorded in
`oak_meta`). The previous versioned indexes are retained (2-generation policy).

---

## Completed Prerequisites

### Migration Fix (2026-03-08)

The `atomicAliasSwap` function now supports `remove_index` actions for
bare-index-to-alias migration. `AliasTargetInfo` is a discriminated union
(`isAlias: true` → `targetIndex: string`; `isAlias: false` → `targetIndex: null`
with `isBareIndex` flag). `buildSwapActions` propagates `bareIndexToRemove`
when a bare concrete index blocks alias creation. Four reviewers approved.

### Reviewer Fixes (2026-03-08)

Two type errors from the discriminated union change fixed. Dead code branch
in `assessAliasHealth` removed (type system prevents the state). Pre-existing
`Object.keys()` lint errors in `alias-operations.ts` replaced with
`typeSafeKeys`. All quality gates pass (build, type-check, lint, 172 tests,
format, markdownlint).

### Preflight (2026-03-08)

- Cluster: green, ES 8.11.0
- Indexes: 6 bare concrete (oak_lessons 193k, oak_unit_rollup 172k,
  oak_units 1.6k, oak_threads 328, oak_sequence_facets 57, oak_sequences 30)
- validate-aliases: all unhealthy (bare indexes, not aliases) — expected
- Env: loaded via dotenv from `apps/oak-search-cli/.env.local`

### `remove_index` Smoke Test (2026-03-08)

Created throwaway index, atomically removed via `POST /_aliases` with
`remove_index` action. Confirmed deleted. **`remove_index` works on Elastic
Serverless.**

### Deferred Follow-ups (not blocking)

- Consider narrowing `Client` to a typed sub-interface to eliminate
  `as unknown as Client` in tests (architectural boundary change, pre-existing)

---

## Tasks

### Ingest Rewrite

**This is the next task.** Rewrite the stage command's ingest to use the
existing CLI bulk ingestion pipeline with versioned index names.

See [Potential Solutions](#potential-solutions) and
[Assumptions](#assumptions). The next session should validate assumptions
before implementing.

#### Mandatory Reviewer Gates

This rewrite touches ingestion, types, architecture, and Elasticsearch
concerns. **All of the following reviewers must be invoked** — the original
code was written without any reviews, which is how the violations went
undetected.

**Before writing code** (review the approach):

- `architecture-reviewer-barney` — boundary and dependency mapping: is the
  resolver threading the simplest approach?
- `architecture-reviewer-betty` — cohesion/coupling trade-offs: does
  threading the resolver increase coupling unacceptably?
- `architecture-reviewer-fred` — ADR compliance: does the approach respect
  ADR-130 (blue/green), ADR-078 (dependency injection), ADR-029 (no manual
  API data structures)?
- `architecture-reviewer-wilma` — resilience: what failure modes exist if
  the refactored pipeline errors mid-ingest?

**After writing code** (review the implementation):

- `code-reviewer` — gateway review for correctness and quality
- `type-reviewer` — verify `BulkDownloadFile` types flow through without
  assertion pressure; no `unknown`, no `as`, no loose type guards
- `test-reviewer` — verify TDD was followed; integration test with real
  bulk data file required
- `elasticsearch-reviewer` — verify bulk operations, NDJSON format,
  versioned index targeting are correct
- `config-reviewer` — if any config files changed

**Key question for reviewers**: Does the rewrite use the existing typed
infrastructure (`BulkDownloadFile`, `parseBulkFile`, `bulkDownloadFileSchema`)
or does it reinvent anything? Any reinvention is a blocking finding.

### Stage, Validate, Promote, Verify

Blocked on ingest rewrite. Once the rewrite is complete, follow the
original operational plan:

1. `pnpm oaksearch admin stage --bulk-dir ./bulk-downloads --verbose`
2. `pnpm oaksearch admin status` — eyeball doc counts
3. `pnpm oaksearch admin promote --version <version>`
4. `pnpm oaksearch admin validate-aliases`
5. Smoke test: `pnpm oaksearch search lessons "photosynthesis"`

---

## Done When

1. All 6 curriculum aliases point to versioned indexes
2. `validate-aliases` reports all healthy
3. Search queries return current results (stale data issues cleared)
4. `oak_meta` records the current version with a rollback target
5. Old bare indexes have been removed
