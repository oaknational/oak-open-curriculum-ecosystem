---
name: "Unified Versioned Ingestion Pipeline"
overview: >
  Unify all bulk ingestion through one parameterised pipeline, delete the
  broken SDK ingest code, and complete the first blue/green reindex cycle.
  Architectural excellence over expediency — one pipeline, one code path,
  correct layer boundaries, types from schema.
todos:
  - id: phase-0-validate
    content: "Phase 0: Validate assumptions against live code."
    status: pending
  - id: phase-1-parameterise
    content: "Phase 1: Parameterise pipeline on index names (TDD)."
    status: pending
  - id: phase-2-wire
    content: "Phase 2: Wire lifecycle deps, delete broken SDK ingest, strengthen resilience (TDD)."
    status: pending
  - id: phase-3-operational
    content: "Phase 3: Stage, validate, promote, verify (live operation)."
    status: pending
  - id: phase-4-review
    content: "Phase 4: Adversarial review and documentation propagation."
    status: pending
isProject: false
---

# Unified Versioned Ingestion Pipeline

**Last Updated**: 2026-03-09
**Status**: NOT STARTED
**Scope**: Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle
**Predecessor**: [blue-green-reindex.execution.plan.md](./blue-green-reindex.execution.plan.md) — what went wrong and why

---

## Vision

The search service has a proven, typed bulk ingestion pipeline that
transforms Oak curriculum data into Elasticsearch documents. It has
adapters for lessons, units, rollups, threads, sequences, vocabulary,
and KS4 enrichment. It validates input through generated Zod schemas.
It works.

Separately, the blue/green index lifecycle (ADR-130) provides versioned
index creation, atomic alias swapping, metadata management, rollback,
and cleanup. The orchestration is sound and has 172 passing tests.

These two systems are not connected. The lifecycle service calls a
broken `runIngest` function that was built in isolation from the
existing pipeline. The result: 0 documents indexed on the first live
staging attempt (2026-03-08).

**This plan connects the two systems.** Not with a workaround, not
with a compatibility layer, but with the simplest correct architecture:
parameterise the existing pipeline on index names, and inject it into
the lifecycle service at the CLI layer where it belongs.

## Operational Context

This is the **first live use** of the blue/green index lifecycle (ADR-130).
The current Elasticsearch cluster has 6 bare concrete indexes. This run will
migrate them to alias-backed versioned indexes — a one-time operation.
After this, all future reindexes are zero-downtime blue/green swaps.

The lifecycle orchestration code is **sound and tested** (172 tests pass).
Alias operations, swap builders, promote, rollback, cleanup, and index
creation all work correctly. The problem is **only** the ingest integration.

See the [predecessor plan](./blue-green-reindex.execution.plan.md) for the
full timeline, root cause analysis, and completed prerequisites (migration
fix, reviewer fixes, preflight, `remove_index` smoke test).

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
  ↓ NDJSON bulk operations (with HARDCODED index names ← the problem)
  ↓ ES /_bulk API dispatch
```

---

## Goals

1. **One ingestion pipeline** — all bulk ingestion (bare-index `admin ingest`,
   versioned `admin stage`, full `admin versioned-ingest`) flows through
   the same transformation pipeline with the same adapters, same types,
   same validation
2. **Correct layer boundaries** — the SDK defines lifecycle interfaces
   and orchestration; the CLI provides the ingestion implementation.
   The SDK does not know about bulk file formats, transformation
   adapters, or API supplementation
3. **Types from schema, end to end** — `BulkDownloadFile` →
   `bulkDownloadFileSchema` → typed adapters → typed ES documents.
   No `unknown`, no `as`, no loose type guards anywhere in the
   ingestion path
4. **Delete the broken code** — the SDK's `ingest.ts` (235 lines of
   `unknown[]` processing with silent failures) is removed entirely.
   No compatibility layer, no deprecation wrapper
5. **Operational blue/green lifecycle** — `admin stage` → validate →
   `admin promote` → verify. Zero-downtime reindexing is working

## Desired Outcomes

| Outcome | Measure |
|---------|---------|
| Pipeline unification | `admin ingest` and `admin stage` call the same `collectPhaseResults()` function |
| Layer boundary correctness | SDK's `admin/` directory has no bulk file reading, no transformation logic |
| Type safety | Zero `unknown` types, zero type assertions in the ingestion path |
| Operational readiness | 6 curriculum aliases point to versioned indexes, `validate-aliases` reports healthy |
| Code deletion | SDK `ingest.ts` deleted, `buildLifecycleDeps` no longer provides default ingest |

---

## Strategic Approach

### Key Architectural Insight

The dependency injection is already in place. `IndexLifecycleDeps.runVersionedIngest`
is an injected function (ADR-078). `buildLifecycleDeps()` provides a default
implementation that calls the broken `runIngest`. The fix is not to patch `runIngest`
— it is to **override `runVersionedIngest` at the CLI layer** with a function that
calls the existing working pipeline.

The adapters already accept index names as parameters:

- `toBulkOperations(lessonsIndex, unitsIndex, rollupIndex)` — HybridDataSource
- `buildThreadBulkOperations(threads, indexName)` — thread transformer
- `buildSequenceBulkOperations(files, sequencesIndex, facetsIndex)` — sequence transformer

The hardcoded index names exist **only** in `collectPhaseResults()` in
`bulk-ingestion-phases.ts`, where they are passed to the parameterised adapters.
The refactor surface is narrow: add an `IndexResolverFn` parameter to
`collectPhaseResults()` and `prepareBulkIngestion()`, defaulting to the
primary index names for backwards compatibility.

### Layer Boundary Model

```text
┌─────────────────────────────────────────────────────────┐
│  SDK (packages/sdks/oak-search-sdk/)                    │
│                                                         │
│  IndexLifecycleDeps interface ← defines the contract    │
│  IndexLifecycleService       ← orchestrates lifecycle   │
│  buildLifecycleDeps()        ← provides non-ingest deps │
│  alias-operations, swap-builders, cleanup, promote,     │
│  rollback, validate-aliases  ← all sound, tested        │
│                                                         │
│  ✗ ingest.ts                 ← DELETE                   │
│  ✗ runVersionedIngest default ← REMOVE from factory     │
└─────────────────────────────────────────────────────────┘
                         │
              runVersionedIngest is injected
              by the CLI, not defaulted by SDK
                         │
┌─────────────────────────────────────────────────────────┐
│  CLI (apps/oak-search-cli/)                             │
│                                                         │
│  prepareBulkIngestion(opts)  ← gains IndexResolverFn    │
│  collectPhaseResults(...)    ← gains IndexResolverFn    │
│  dispatchBulk(...)           ← sends operations to ES   │
│  HybridDataSource, adapters  ← unchanged (already       │
│                                 parameterised)           │
│                                                         │
│  buildLifecycleService()     ← wires runVersionedIngest │
│                                 to call the real pipeline│
└─────────────────────────────────────────────────────────┘
```

### What Does Not Change

- All transformation adapters (lesson, unit, rollup, thread, sequence, vocabulary)
- HybridDataSource and KS4 API supplementation
- Lifecycle orchestration (stage, promote, rollback, validate-aliases, cleanup)
- Alias operations, swap builders, metadata management
- Index creation with SDK-generated mappings
- The `admin ingest` command (gains a resolver parameter but defaults to current behaviour)

---

## Non-Goals (YAGNI)

- Changing mappings or analysers
- Adding new index kinds beyond the existing 6
- Running ground truth benchmarks (separate follow-up)
- Changing the lifecycle service interface or orchestration logic
- Refactoring the transformation adapters
- Addressing the category supplementation (built but unwired — separate concern)

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — Core principles
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at ALL levels
3. **Re-read** `.agent/directives/schema-first-execution.md` — Types from schema
4. **Ask**: "Does this deliver system-level value, not just fix the immediate issue?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Existing `admin ingest` regresses | Low | High — breaks proven ingestion path | Default resolver returns current hardcoded names; existing tests cover the path |
| KS4 API supplementation fails during stage | Medium | Medium — stage produces incomplete KS4 data | `OAK_API_KEY` required; rate limiting already handled; can stage without KS4 and re-stage |
| Mappings drift between SDK-generated and pipeline output | Low | High — mapping errors on ingest | Phase 0 validates adapter output against current mappings |
| `buildLifecycleDeps` callers break when default ingest removed | Low | Low — only CLI uses it | Only one call site (`admin-lifecycle-commands.ts`); change is co-located |
| Cross-workspace type errors after SDK change | Medium | Medium | Full quality gate chain after each phase |

---

## Mandatory Reviewer Gates

This work touches ingestion, types, architecture, layer boundaries, and
Elasticsearch concerns. The original code was written without reviews,
which is how every violation went undetected.

### Before Writing Code (Review the Approach)

Present this plan's strategic approach to all reviewers below:

- `code-reviewer` — gateway review of the approach for correctness and
  feasibility before any code is written
- `docs-adr-reviewer` — verify the plan aligns with ADR-130, ADR-078,
  ADR-093 and that documentation propagation is planned
- `architecture-reviewer-barney` — boundary and dependency mapping: is the
  resolver threading the simplest approach? Is the layer boundary correct?
- `architecture-reviewer-betty` — cohesion/coupling trade-offs: does
  parameterising `collectPhaseResults` increase coupling unacceptably?
- `architecture-reviewer-fred` — ADR compliance: does the approach respect
  ADR-130 (blue/green), ADR-078 (DI), ADR-029 (no manual API data), ADR-093
  (bulk-first)?
- `architecture-reviewer-wilma` — resilience: what failure modes exist if
  the refactored pipeline errors mid-ingest with versioned indexes?

### After Writing Code (Review the Implementation)

- `code-reviewer` — gateway review for correctness and quality
- `type-reviewer` — verify `BulkDownloadFile` types flow through without
  assertion pressure; no `unknown`, no `as`, no loose type guards
- `test-reviewer` — verify TDD was followed at all levels
- `elasticsearch-reviewer` — verify bulk operations, NDJSON format,
  versioned index targeting are correct
- `docs-adr-reviewer` — verify TSDoc, README updates, ADR compliance
- `config-reviewer` — if any config files changed

**Key question for all reviewers**: Does the implementation use the existing
typed infrastructure (`BulkDownloadFile`, `parseBulkFile`, `bulkDownloadFileSchema`,
`collectPhaseResults`, `HybridDataSource`) or does it reinvent anything?
Any reinvention is a blocking finding.

---

## Pre-Implementation Reviewer Findings (2026-03-09)

All 6 pre-implementation reviewers were invoked. Findings are classified
below. All blocking findings must be addressed during implementation.

### Approach Verdict

| Reviewer | Verdict |
|----------|---------|
| `architecture-reviewer-barney` | APPROACH SOUND — boundary and claims verified |
| `architecture-reviewer-betty` | ISSUES FOUND — directionally sound, one step needs sharper analysis |
| `architecture-reviewer-fred` | COMPLIANT — all ADRs respected |
| `architecture-reviewer-wilma` | CRITICAL ISSUES — failure modes and hidden coupling identified |
| `code-reviewer` | APPROVED WITH SUGGESTIONS |
| `docs-adr-reviewer` | GAPS FOUND |

### Blocking Findings

**1. Hidden hardcoded index map in `ingest-harness-ops.ts`** (Wilma)

`KIND_BY_INDEX` and `inferKindFromIndex()` in `ingest-harness-ops.ts` use
hardcoded index names. They would fail with versioned names like
`oak_lessons_v2026-03-09-120000`.

**Resolution**: The versioned ingest path calls `prepareBulkIngestion()`
directly and dispatches via `dispatchBulk()`. It does NOT go through
`executeBulkIngestion()` → `summariseOperations()` → `inferKindFromIndex()`.
Doc counts come from `BulkIngestionStats` returned by `prepareBulkIngestion()`,
not from the harness layer. Added as Phase 0 validation (Task 0.6).

**2. ADR-130 does not document `remove_index`** (docs-adr-reviewer)

The `remove_index` action for bare-index migration is implemented in code
(`alias-operations.ts`, `lifecycle-swap-builders.ts`) but not in ADR-130's
"Alias swap mechanics" section.

**Resolution**: Added to Phase 4 documentation propagation — update ADR-130.

**3. Documentation propagation uses hedging language** (docs-adr-reviewer)

Phase 4 tasks use "if", "consider" for changes that are certain.

**Resolution**: Phase 4 tasks rewritten with explicit, checkable deliverables.

**4. "Done When" criteria missing documentation deliverables** (docs-adr-reviewer)

**Resolution**: Added documentation criteria to "Done When".

### Resilience Findings (Addressed in Phase 2)

These pre-date this plan but directly affect the pipeline we are
unifying. Architectural excellence means addressing them now, not
deferring them. Each is assigned to a Phase 2 task.

**5. Partial ingest success undetectable** (Wilma) — `verifyDocCounts()`
cannot distinguish partial from full success. If a bulk chunk fails
mid-stream, the threshold check may still pass. **Addressed**: Task 2.4
— require `dispatchBulk()` to return per-index counts; validate against
expected totals before declaring success.

**6. Orphaned versioned indexes on mid-ingest failure** (Wilma) — If
ingest throws after `createVersionedIndexes()`, empty/partial versioned
indexes are left behind. This already happened on 2026-03-08. **Addressed**:
Task 2.5 — add cleanup-on-failure to the stage flow.

**7. `verifyDocCounts` early exit** (Wilma) — Reports only the first
failing index, not all failures. **Addressed**: Task 2.6 — accumulate all
failures and return a detailed per-index report.

**8. `createHybridDataSource` can throw** (Wilma) — KS4 API supplementation
has no try/catch in `createHybridDataSource()`. An API failure will
propagate as an unhandled exception. The lifecycle service's try/catch
in `buildRunVersionedIngest()` catches it, but the error type is
misleadingly `es_error`. **Addressed**: Task 2.7 — wrap in explicit Result
pattern with a specific `data_source_error` kind.

### Process Refinements (Addressed in Phase 4)

**9. Diagnosis clarity** (code-reviewer, Betty) — The problem is a
**format mismatch** (SDK expects flat `{doc_type}` arrays, bulk files
are `BulkDownloadFile` objects), not merely an `unknown[]` type issue.
**Addressed**: Task 4.2 item 5 — commit messages and documentation must
describe the root cause accurately as a format mismatch.

---

## Tasks

### Phase 0: Validate Assumptions

**Foundation Check-In**: Re-read `principles.md` (fail fast, DRY, types from schema).

Validate each assumption before writing any code. If any assumption is
wrong, update this plan before proceeding.

#### Task 0.1: Confirm Adapter Parameterisation

**Assumption**: The transformation adapters already accept index names
as string parameters, not hardcoded constants.

**Validation**:

1. Verify `HybridDataSource.toBulkOperations(lessonsIndex, unitsIndex, rollupIndex)` signature
2. Verify `buildThreadBulkOperations(threads, indexName)` signature
3. Verify `buildSequenceBulkOperations(files, sequencesIndex, facetsIndex)` signature
4. Verify the 6 hardcoded constants are ONLY in `bulk-ingestion-phases.ts`

**Acceptance Criteria**:

1. All three adapter functions accept index names as parameters
2. No hardcoded index names exist in any adapter file (only in `bulk-ingestion-phases.ts`)

#### Task 0.2: Confirm Pipeline Produces Correct ES Documents

**Assumption**: The existing pipeline produces documents that match the
SDK-generated Elasticsearch mappings.

**Validation**:

1. Check that `SearchLessonsIndexDoc`, `SearchUnitsIndexDoc`, etc. are the
   output types of the transformation adapters
2. Verify these types align with the SDK-generated mappings used by
   `createAllIndexes`

#### Task 0.3: Confirm `buildLifecycleDeps` Has Only One Call Site

**Assumption**: Only `admin-lifecycle-commands.ts` calls `buildLifecycleDeps()`.

**Validation**:

```bash
grep -r "buildLifecycleDeps" --include="*.ts" apps/ packages/
```

**If multiple call sites exist**: Assess each and update the plan.

#### Task 0.4: Confirm 6 Index Kinds Are Exhaustive

**Assumption**: The 6 curriculum index kinds (`lessons`, `units`,
`unit_rollup`, `threads`, `sequences`, `sequence_facets`) are the
complete set. No new kinds are pending.

**Validation**: Check `SEARCH_INDEX_KINDS` in the SDK and confirm
it matches the 6 kinds used by `collectPhaseResults`.

#### Task 0.5: Confirm `dispatchBulk` Can Target Any Index

**Assumption**: The ES dispatch layer sends whatever `_index` is embedded
in the bulk operations — it does not override or rewrite index names.

**Validation**: Read `dispatchBulk()` and confirm it passes operations
through without index name manipulation.

#### Task 0.6: Confirm Versioned Path Avoids `inferKindFromIndex`

**Assumption**: The versioned ingest path (`prepareBulkIngestion()` →
`dispatchBulk()`) does NOT go through `executeBulkIngestion()` →
`summariseOperations()` → `inferKindFromIndex()`. The `KIND_BY_INDEX`
reverse map in `ingest-harness-ops.ts` uses hardcoded index names and
would fail with versioned names like `oak_lessons_v2026-03-09-120000`.

**Validation**:

1. Trace the call graph from the versioned ingest entry point
2. Confirm `inferKindFromIndex()` is only called by `executeBulkIngestion()`
3. Confirm the versioned path does NOT call `executeBulkIngestion()`
4. Document which path provides doc counts for the versioned flow
   (expected: `BulkIngestionStats` from `prepareBulkIngestion()`)

**If the assumption is wrong**: The versioned path DOES go through the
harness layer → `inferKindFromIndex()` must be updated to handle versioned
names, or the harness must be bypassed. Update this plan before proceeding.

**Phase 0 Complete When**: All 6 assumptions validated. Document any
corrections to the plan.

---

### Phase 1: Parameterise Pipeline on Index Names (TDD)

**Foundation Check-In**: Re-read `testing-strategy.md` (TDD at all levels,
test behaviour not implementation).

#### Task 1.1: Add `IndexResolverFn` Parameter to `collectPhaseResults`

**Current** (`bulk-ingestion-phases.ts` lines 28-33):

```typescript
const LESSONS_INDEX = 'oak_lessons';
const UNITS_INDEX = 'oak_units';
const UNIT_ROLLUP_INDEX = 'oak_unit_rollup';
const THREADS_INDEX = 'oak_threads';
const SEQUENCES_INDEX = 'oak_sequences';
const SEQUENCE_FACETS_INDEX = 'oak_sequence_facets';
```

**Target**: `collectPhaseResults` gains an optional `resolveIndex` parameter.
When omitted, it defaults to the current primary index names (backwards
compatible). When provided, all 6 index references use the resolver.

**TDD Sequence**:

1. **RED**: Write unit test — call `collectPhaseResults` with a custom
   resolver that returns versioned names (e.g. `oak_lessons_vtest`).
   Assert the bulk operations contain the versioned names. Run test → FAILS.
2. **GREEN**: Add `IndexResolverFn` parameter with default. Replace
   6 constants with resolver calls. Run test → PASSES.
3. **REFACTOR**: Remove the 6 constants (now dead code). Clean up.

**Acceptance Criteria**:

1. `collectPhaseResults` accepts an optional `IndexResolverFn` parameter
2. Default behaviour is unchanged (existing tests pass without modification)
3. When a custom resolver is provided, all bulk operations use resolved names
4. The 6 hardcoded constants are deleted
5. No `unknown` types introduced

**Deterministic Validation**:

```bash
# Existing tests still pass
pnpm test --filter oak-search-cli

# No hardcoded index names remain in bulk-ingestion-phases.ts
grep -n "= 'oak_" apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts
# Expected: no matches (exit 1)
```

#### Task 1.2: Thread Resolver Through `prepareBulkIngestion`

**TDD Sequence**:

1. **RED**: Write test — `prepareBulkIngestion` with custom resolver
   produces operations with versioned index names. Run → FAILS.
2. **GREEN**: Add optional resolver parameter to `prepareBulkIngestion`,
   pass through to `collectPhaseResults`. Run → PASSES.
3. **REFACTOR**: Update TSDoc.

**Acceptance Criteria**:

1. `prepareBulkIngestion` accepts optional `IndexResolverFn`
2. Default behaviour unchanged (backwards compatible)
3. Resolver flows through to `collectPhaseResults`

**Phase 1 Quality Gates**:

```bash
pnpm type-check
pnpm lint:fix
pnpm test
```

---

### Phase 2: Wire Lifecycle Deps, Delete Broken Code, Strengthen Resilience (TDD)

**Foundation Check-In**: Re-read `principles.md` (no compatibility layers,
clear boundaries, fail fast with helpful errors), `schema-first-execution.md`
(types from schema).

#### Task 2.1: Create CLI-Layer `runVersionedIngest` Implementation

The CLI provides a `runVersionedIngest` function that:

1. Creates a versioned `IndexResolverFn` from the version string
2. Calls `prepareBulkIngestion` with the versioned resolver
3. Dispatches the resulting bulk operations to Elasticsearch
4. Returns `IngestResult` with document counts
5. Includes `logger.debug()` calls at entry, decision points, and exit
   (the predecessor's silent failure was partly caused by zero debug logging)

**TDD Sequence**:

1. **RED**: Write integration test — `runVersionedIngest` with a fake
   ES client and a test bulk file produces operations targeting versioned
   index names. Run → FAILS.
2. **GREEN**: Implement the function. It composes existing building blocks.
   Run → PASSES.
3. **REFACTOR**: Extract if needed. Update TSDoc.

**Acceptance Criteria**:

1. Function lives in the CLI app layer, not the SDK
2. Uses `prepareBulkIngestion` with a versioned resolver
3. Uses `dispatchBulk` (or equivalent) for ES dispatch
4. Returns `Result<IngestResult, AdminError>` matching the lifecycle dep contract
5. Types flow from `BulkDownloadFile` through to ES dispatch — no `unknown`

#### Task 2.2: Wire Into `buildLifecycleService`

Update `admin-lifecycle-commands.ts` to provide the CLI's
`runVersionedIngest` when building lifecycle deps.

**Approach**: Either override the dep after calling `buildLifecycleDeps()`,
or modify `buildLifecycleDeps()` to require `runVersionedIngest` as a
parameter (preferred — makes the dependency explicit).

**TDD Sequence**:

1. **RED**: Update existing lifecycle command tests to verify the
   correct `runVersionedIngest` is wired. Run → FAILS.
2. **GREEN**: Wire the CLI implementation. Run → PASSES.
3. **REFACTOR**: Clean up.

**Acceptance Criteria**:

1. `admin stage` command calls the existing CLI bulk pipeline with versioned names
2. `admin versioned-ingest` command does the same (stage + promote)
3. No code path calls the old SDK `runIngest`

#### Task 2.3: Delete SDK `ingest.ts`

**Changes**:

1. Delete `packages/sdks/oak-search-sdk/src/admin/ingest.ts` (235 lines)
2. Remove the import from `build-lifecycle-deps.ts`
3. Remove the default `runVersionedIngest` from `buildLifecycleDeps()`
4. Make `runVersionedIngest` a required parameter of `buildLifecycleDeps()`
   (or remove it from the factory entirely — the CLI provides it)
5. Update any re-exports from `index.ts` files

**Acceptance Criteria**:

1. `ingest.ts` is deleted from the SDK
2. No `unknown[]` processing anywhere in the ingestion path
3. No silent failure paths (`return []`) anywhere in the ingestion path
4. `buildLifecycleDeps()` does not provide a default ingest implementation
5. All quality gates pass

#### Task 2.4: Per-Index Count Verification in Dispatch (Resilience)

**Problem**: `dispatchBulk()` does not return per-index document counts.
`verifyDocCounts()` cannot distinguish partial from full ingest success.
A bulk chunk failing mid-stream is invisible.

**Target**: `dispatchBulk()` returns per-index operation counts (indexed,
failed). The CLI-layer `runVersionedIngest` compares these against expected
totals from `BulkIngestionStats` before reporting success.

**TDD Sequence**:

1. **RED**: Write test — `dispatchBulk` returns a `DispatchResult` with
   per-index counts. Run → FAILS (currently returns void or bulk response).
2. **GREEN**: Modify `dispatchBulk` to accumulate and return per-index
   counts from the ES bulk response. Run → PASSES.
3. **REFACTOR**: Add validation in `runVersionedIngest` that compares
   dispatch counts against expected totals.

**Acceptance Criteria**:

1. `dispatchBulk` returns typed per-index operation counts
2. `runVersionedIngest` validates expected vs actual counts
3. Partial ingest failures are detectable and logged

#### Task 2.5: Cleanup-on-Failure for Orphaned Versioned Indexes (Resilience)

**Problem**: If ingest throws after `createVersionedIndexes()`, partial
versioned indexes are left behind. This happened on 2026-03-08.

**Target**: The stage flow has a try/catch that deletes the versioned
indexes if ingest fails. The user sees a clear error and clean state.

**TDD Sequence**:

1. **RED**: Write test — when `runVersionedIngest` returns an error, the
   versioned indexes created by `stage` are deleted. Run → FAILS.
2. **GREEN**: Add cleanup logic in the stage orchestration. Run → PASSES.
3. **REFACTOR**: Ensure cleanup errors are logged but do not mask the
   original ingest error.

**Acceptance Criteria**:

1. Failed stage does not leave orphaned versioned indexes
2. Original error is preserved and reported to the user
3. Cleanup failure is logged as a warning, not thrown

#### Task 2.6: `verifyDocCounts` Reports All Failures (Resilience)

**Problem**: `verifyDocCounts()` exits on the first failing index. The
operator sees one problem, fixes it, re-runs, and discovers another.

**Target**: `verifyDocCounts()` accumulates all per-index results and
returns a comprehensive report.

**TDD Sequence**:

1. **RED**: Write test — `verifyDocCounts` with 3 failing indexes returns
   all 3 failures, not just the first. Run → FAILS.
2. **GREEN**: Change early-exit to accumulation. Return all results.
   Run → PASSES.
3. **REFACTOR**: Update return type if needed for richer reporting.

**Acceptance Criteria**:

1. All failing indexes are reported in a single invocation
2. Return type includes per-index status (pass/fail with counts)
3. Existing passing tests still pass (backwards compatible)

#### Task 2.7: `createHybridDataSource` Result Pattern (Resilience)

**Problem**: `createHybridDataSource()` can throw an unhandled exception
during KS4 API supplementation. The lifecycle service catches it but
wraps it as `es_error`, which is misleading.

**Target**: `createHybridDataSource()` returns a `Result` type. API
failures are captured with a specific error kind (`data_source_error`)
that distinguishes them from Elasticsearch errors.

**TDD Sequence**:

1. **RED**: Write test — `createHybridDataSource` with a failing API
   returns an error Result with kind `data_source_error`. Run → FAILS.
2. **GREEN**: Wrap API calls in try/catch, return Result. Run → PASSES.
3. **REFACTOR**: Add `data_source_error` to the `AdminError` discriminated
   union if not already present.

**Acceptance Criteria**:

1. `createHybridDataSource` returns `Result` instead of throwing
2. Error kind is `data_source_error`, not `es_error`
3. Callers handle the Result (no unhandled exceptions in the pipeline)

**Phase 2 Quality Gates**:

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:e2e
```

---

### Phase 3: Stage, Validate, Promote, Verify (Live Operation)

**Foundation Check-In**: Re-read `principles.md` (fail fast with helpful errors).

This phase operates against the live Elasticsearch cluster. It is the
first successful use of the blue/green lifecycle.

#### Task 3.1: Stage Versioned Indexes

```bash
cd apps/oak-search-cli
pnpm oaksearch admin stage --bulk-dir ./bulk-downloads --verbose
```

**Expected**: All 6 versioned indexes created and populated with non-zero
document counts. The stage command reports the version string.

**If it fails**: Read the error. The debug logging added during the rewrite
should make the failure visible. Do not proceed until staging succeeds.

#### Task 3.2: Validate Staged Indexes

```bash
pnpm oaksearch admin status
```

**Expected**: 6 versioned indexes visible alongside 6 bare indexes.
Document counts should be comparable to the bare indexes:

- `oak_lessons_v*` ≈ 193k docs
- `oak_unit_rollup_v*` ≈ 172k docs
- `oak_units_v*` ≈ 1.6k docs
- `oak_threads_v*` ≈ 328 docs
- `oak_sequence_facets_v*` ≈ 57 docs
- `oak_sequences_v*` ≈ 30 docs

#### Task 3.3: Promote

```bash
pnpm oaksearch admin promote --version <version-from-stage>
```

**Expected**: Atomic alias swap succeeds. Bare indexes removed via
`remove_index`. Aliases now point to versioned indexes. Metadata written.

#### Task 3.4: Verify

```bash
pnpm oaksearch admin validate-aliases
pnpm oaksearch search lessons "photosynthesis"
```

**Expected**: All aliases healthy. Search returns current results.

**Phase 3 Complete When**: All 6 curriculum aliases point to versioned
indexes, `validate-aliases` reports all healthy, search works, `oak_meta`
records the current version.

---

### Phase 4: Adversarial Review and Documentation

**Foundation Check-In**: Re-read all three foundation documents.

#### Task 4.1: Post-Implementation Reviews

Invoke all reviewers listed in [Mandatory Reviewer Gates](#mandatory-reviewer-gates)
(After Writing Code section). Document findings.

#### Task 4.2: Documentation Propagation

Every item below is a required deliverable, not a conditional check.

1. **TSDoc on all changed functions**: `collectPhaseResults`,
   `prepareBulkIngestion`, `dispatchBulk`, `verifyDocCounts`,
   `createHybridDataSource`, `buildLifecycleDeps`, and the CLI-layer
   `runVersionedIngest` — all must have accurate TSDoc reflecting their
   new signatures and behaviour
2. **Update INDEXING.md**: `apps/oak-search-cli/docs/INDEXING.md` must
   describe the versioned ingestion flow — how `IndexResolverFn` threads
   through the pipeline, the relationship between `admin ingest` (bare)
   and `admin stage` (versioned), and the per-index count verification
3. **Update ADR-130**: Add `remove_index` to the "Alias swap mechanics"
   section. Document the bare-index migration path (first-run only).
   This action is implemented in `alias-operations.ts` and
   `lifecycle-swap-builders.ts` but not documented in the ADR
4. **Update ADR-093**: Add a note that the bulk-first pipeline now
   supports versioned index targeting via `IndexResolverFn`, completing
   the integration with blue/green lifecycle (ADR-130)
5. **Commit message convention**: Per Finding 9, describe the root
   cause as a format mismatch ("SDK assumed flat arrays, bulk files are
   `BulkDownloadFile` objects"), not merely a type issue

**Acceptance Criteria**:

1. All 4 ADR/doc files updated with accurate, non-hedging content
2. TSDoc present on every function listed above
3. No "if", "consider", "may" in documentation about changes that happened

#### Task 4.3: Archive Predecessor Plan

Move `blue-green-reindex.execution.plan.md` to the appropriate archive
location. Its completed prerequisites and "what went wrong" documentation
are valuable historical records.

---

## Testing Strategy

### Unit Tests

**Existing Coverage** (unchanged):

- `bulk-ingestion-phases.unit.test.ts` — tests `collectPhaseResults` with mocked adapters
- `hybrid-data-source.unit.test.ts` — tests `toBulkOperations` with parameterised index names
- `bulk-thread-transformer.unit.test.ts` — tests `buildThreadBulkOperations` with index name
- `bulk-sequence-transformer.unit.test.ts` — tests `buildSequenceBulkOperations` with index names
- All lifecycle service tests (172 tests) — swap builders, cleanup, promote, rollback

**New Tests Required**:

- `collectPhaseResults` with custom `IndexResolverFn` — proves versioned names flow through
- `prepareBulkIngestion` with custom `IndexResolverFn` — proves resolver threading
- `dispatchBulk` returns per-index counts — proves count verification
- `verifyDocCounts` with multiple failures — proves all-failure accumulation
- `createHybridDataSource` with failing API — proves Result error wrapping

### Integration Tests

**New Tests Required**:

- CLI-layer `runVersionedIngest` with fake ES client — proves the full
  pipeline (read → transform → resolve → dispatch) works end-to-end
  with versioned index names
- CLI-layer `runVersionedIngest` with partial dispatch failure — proves
  count mismatch is detected and reported
- Stage flow with ingest failure — proves orphaned index cleanup

### E2E Tests

No new E2E tests needed. The existing CLI E2E tests cover `admin` command
registration. The live operation in Phase 3 serves as the E2E validation.

---

## Rollback

At any point after promotion, if the service is degraded:

```bash
cd apps/oak-search-cli
pnpm oaksearch admin rollback
```

This atomically swaps aliases back to the previous version (recorded in
`oak_meta`). The previous versioned indexes are retained (2-generation policy).

---

## Done When

### Functional

1. `admin stage` produces versioned indexes with correct document counts
2. `admin promote` atomically swaps aliases from bare indexes to versioned
3. `validate-aliases` reports all 6 aliases healthy
4. Search queries return current results
5. `oak_meta` records the current version with rollback target

### Architectural

6. SDK `ingest.ts` is deleted — no `unknown[]` processing exists
7. `buildLifecycleDeps()` requires explicit `runVersionedIngest` injection
8. `dispatchBulk()` returns per-index operation counts (not void)
9. `verifyDocCounts()` reports all failures, not just the first
10. `createHybridDataSource()` returns `Result`, does not throw
11. Failed `stage` cleans up orphaned versioned indexes

### Documentation

12. ADR-130 documents `remove_index` alias action
13. ADR-093 notes versioned ingestion support via `IndexResolverFn`
14. INDEXING.md describes versioned vs bare ingestion flow
15. TSDoc present on all changed function signatures

### Quality

16. All quality gates pass across all workspaces
17. All mandatory reviewers have been invoked and findings addressed

---

## References

### ADRs

- [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green design
- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — Dependency injection
- [ADR-029](../../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) — Bulk-first ingestion
- [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) — Batch-atomic ingestion

### Related Plans and Documentation

- [Predecessor plan](./blue-green-reindex.execution.plan.md) — What went wrong (2026-03-08)
- [API gaps inventory](./api-gaps-for-bulk-downloads.md) — Data not in bulk downloads
- [INDEXING.md](../../../../apps/oak-search-cli/docs/INDEXING.md) — Ingestion field expectations
- [High-level plan](../../high-level-plan.md) — Strategic context (step 2 of immediate intentions)

### Foundation Documents

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

---

## Key Files

| File | Role |
|------|------|
| `apps/oak-search-cli/src/lib/indexing/bulk-ingestion-phases.ts` | Hardcoded constants → resolver (Phase 1) |
| `apps/oak-search-cli/src/lib/indexing/bulk-ingestion.ts` | `prepareBulkIngestion` — gains resolver param (Phase 1) |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` | Wires CLI ingest into lifecycle deps (Phase 2) |
| `packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts` | Removes default ingest (Phase 2) |
| `packages/sdks/oak-search-sdk/src/admin/ingest.ts` | DELETED (Phase 2) |
| `packages/sdks/oak-sdk-codegen/src/bulk/reader.ts` | Typed bulk file reader (`parseBulkFile`, `readAllBulkFiles`) — unchanged |
| `packages/sdks/oak-sdk-codegen/src/types/generated/bulk/` | Generated Zod schemas (`bulkDownloadFileSchema`) — unchanged |
| `apps/oak-search-cli/bulk-downloads/schema.json` | Bulk data format schema — unchanged |
| `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-bulk.ts` | `dispatchBulk` gains per-index counts (Phase 2, Task 2.4) |
| `apps/oak-search-cli/src/lib/indexing/ingest-harness-ops.ts` | Not modified — versioned path bypasses this (Phase 0, Task 0.6 confirms) |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` | Stage cleanup-on-failure (Phase 2, Task 2.5), verify all failures (Task 2.6) |
| `apps/oak-search-cli/src/adapters/hybrid-data-source.ts` | Returns Result instead of throwing (Phase 2, Task 2.7) |
| `apps/oak-search-cli/src/adapters/bulk-thread-transformer.ts` | Unchanged — already parameterised |
| `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts` | Unchanged — already parameterised |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` | Unchanged — orchestration is sound |
| `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` | `IndexLifecycleDeps` interface — may gain required param |
