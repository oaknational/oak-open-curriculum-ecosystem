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
    status: completed
  - id: phase-1-parameterise
    content: "Phase 1: Parameterise pipeline on index names (TDD)."
    status: completed
  - id: phase-2-wire
    content: "Phase 2: Wire lifecycle deps, delete broken SDK ingest, strengthen resilience (TDD)."
    status: completed
  - id: phase-3-operational
    content: "Phase 3: Stage, validate, promote, verify (live operation)."
    status: pending
  - id: phase-4-review
    content: "Phase 4: Adversarial review and documentation propagation."
    status: pending
isProject: false
---

# Unified Versioned Ingestion Pipeline

**Last Updated**: 2026-03-11
**Status**: IN PROGRESS — Phases 0–2 merged to `main` (PR #61). Phase 3 infrastructure complete (all commands wired: stage, promote, rollback, validate-aliases, count). Manual stage/promote/verify cycle underway (ingest run in progress). Phase 4 (adversarial review + documentation) not started.
**Scope**: Unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle
**Predecessor**: [blue-green-reindex.execution.plan.md](../archive/completed/blue-green-reindex.execution.plan.md) — what went wrong and why

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

See the [predecessor plan](../archive/completed/blue-green-reindex.execution.plan.md) for the
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
| Documentation current | ADR-130, ADR-093, INDEXING.md, and TSDoc reflect the unified pipeline |

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
| `architecture-reviewer-barney` (background) | APPROACH SOUND — hidden consumers and competing patterns found |
| `architecture-reviewer-betty` (background) | ISSUES FOUND — confirmed approach, flagged constant duplication |
| `architecture-reviewer-wilma` (background) | CRITICAL ISSUES — post-swap validation gap identified |
| `architecture-reviewer-fred` (background) | COMPLIANT — all ADRs respected, batch dispatch clarification needed |
| `code-reviewer` (background) | APPROVED WITH SUGGESTIONS — dryRun mismatch, OakClient closure pattern |

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

### Late-Arriving Findings (Barney, Background Review)

**10. `AdminService.ingest()` is a second consumer of `ingest.ts`** (Barney)
— `create-admin-service.ts` imports `runIngest` from the broken `ingest.ts`
and exposes it as `AdminService.ingest()`. Deleting `ingest.ts` breaks this
second consumer. **Addressed**: Task 0.7 (enumerate all consumers), Task 2.3
updated to handle `AdminService.ingest()`.

**11. `rewriteBulkOperations` becomes a competing index-name pattern** (Barney)
— The non-versioned pipeline has `rewriteBulkOperations` in
`search-index-target.ts` that post-hoc rewrites `_index` values in bulk
operations (used by the sandbox target). Once the versioned path uses an
upfront `IndexResolverFn`, two competing patterns exist for index name
resolution: post-hoc rewriting (non-versioned) and upfront resolution
(versioned). **Addressed**: Task 2.8 — unify both paths to use the resolver.

**12. Hardcoded constants duplicate `BASE_INDEX_NAMES`** (Betty, background
review) — The 6 constants in `bulk-ingestion-phases.ts` (`LESSONS_INDEX`,
`UNITS_INDEX`, etc.) duplicate `BASE_INDEX_NAMES` from the SDK's
`index-resolver.ts`. After the resolver is threaded through, these
constants should be replaced with lookups from `BASE_INDEX_NAMES` to
eliminate silent duplication. **Addressed**: Task 1.1 REFACTOR step —
when deleting the 6 constants, derive defaults from `BASE_INDEX_NAMES`
rather than maintaining parallel strings.

**13. No post-swap alias validation before metadata commit** (Wilma,
background review) — After `atomicAliasSwap()`, the promote flow writes
metadata assuming all 6 aliases swapped. If the swap partially fails
(e.g. ES timeout on one alias while others succeed), metadata records
incorrect state. No `resolveCurrentAliasTargets()` validation runs between
swap and commit. **Addressed**: Task 2.9 — add post-swap alias validation.

**14. Batch dispatch must comply with ADR-087** (Fred, background review)
— The plan references `dispatchBulk` for ES dispatch but does not verify
whether it batches operations or sends them as a single `/_bulk` request.
With ~200k documents across 6 indexes, a monolithic request would violate
ADR-087's batch-atomic guarantee and cause memory pressure. **Addressed**:
Task 0.5 expanded to verify batching behaviour.

**15. `IngestOptions.dryRun` semantic mismatch** (code-reviewer, background
review) — `IndexLifecycleDeps.runVersionedIngest` accepts `IngestOptions`,
which includes `dryRun`. In the lifecycle context, a dry-run ingest
silently produces zero documents with no error — the lifecycle service
interprets this as success and proceeds to verify/promote an empty index.
**Addressed**: Task 2.1 — use a narrower type (without `dryRun`) for the
lifecycle dep slot, or explicitly reject `dryRun: true` with a fail-fast
error.

### Process Refinements (Addressed in Phase 4)

**16. Diagnosis clarity** (code-reviewer, Betty) — The problem is a
**format mismatch** (SDK expects flat `{doc_type}` arrays, bulk files
are `BulkDownloadFile` objects), not merely an `unknown[]` type issue.
**Addressed**: Task 4.2 item 5 — commit messages and documentation must
describe the root cause accurately as a format mismatch.

---

## Progress Log

### 2026-03-10: Phase 3 Preparation Complete

**Session**: Dry run validated, progress visibility added, `admin count` tool created.

| Item | Summary |
|------|---------|
| Task 3.0 dry run | Pipeline validated end-to-end — parses, transforms, builds operations correctly |
| Logging improvements | Upgraded SDK index creation logging from `debug` to `info`; injected `ingestLogger` into lifecycle deps; per-chunk upload progress with percentage |
| `admin count` command | New CLI tool using ES `_count` API — reports true parent doc counts (excludes ELSER chunk inflation). Live-tested: 16,339 total (12,746 lessons + 1,671 units + 1,671 rollups + 164 threads + 30 sequences + 57 facets) |
| `SetupOptions` cleanup | Removed redundant `verbose` flag infrastructure — logger DI handles this concern |
| Document count clarity | `_cat/indices` reports 193k docs (includes ELSER `semantic_text` chunks); `_count` reports 12,746 true parent lessons (15x inflation is expected) |

**Task 3.2 expected counts updated**: The plan's expected doc counts for `_cat/indices` (193k lessons, 172k rollups) are correct for Lucene doc counts. True parent counts via `admin count` are: lessons 12,746, units 1,671, rollups 1,671, threads 164, sequences 30, facets 57.

**Next**: User runs `admin stage --bulk-dir ./bulk-downloads` manually (with visible logging and Ctrl+C kill capability). Then Task 3.2 validate, Task 3.3 promote, Task 3.4 verify.

### 2026-03-09: Phases 0–2 Merged to Main (PR #61)

**Branch `feat/search_qol_fixes` merged to `main`** — all Phase 0, 1, 2 code
and documentation is now on the default branch. 36 commits total on the PR
(including governance, blue/green lifecycle, versioned ingestion, and
agent infrastructure work).

**Next session starts Phase 3 — live operation against Elasticsearch.**

**Start with a dry run** to validate the pipeline end-to-end before writing
to the live cluster:

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin ingest --dry-run --verbose
```

Once the dry run confirms the pipeline parses, transforms, and would dispatch
correctly, proceed to Task 3.1 (stage versioned indexes for real). See
[Phase 3](#phase-3-stage-validate-promote-verify-live-operation) for the
full sequence: stage → validate → promote → verify.

---

### 2026-03-09: Wave 1 Complete (Phase 0 + Resilience Tasks)

**Session**: Batch parallel execution — 6 background agents in worktree isolation.

**Phase 0 — All 7 assumptions validated:**

| Task | Result |
|------|--------|
| 0.1 Adapter parameterisation | CONFIRMED — all 3 adapters accept index names as parameters |
| 0.2 Pipeline produces correct ES documents | CONFIRMED — output types match SDK-generated mappings |
| 0.3 `buildLifecycleDeps` single call site | CONFIRMED — only `admin-lifecycle-commands.ts` |
| 0.4 6 index kinds exhaustive | CONFIRMED — `SEARCH_INDEX_KINDS` matches `collectPhaseResults` |
| 0.5 `dispatchBulk` behaviour | CONFIRMED — pass-through (no index rewriting) + batched at 8MB chunks with 8s inter-chunk delay (ADR-087 compliant) |
| 0.6 Versioned path avoids `inferKindFromIndex` | CONFIRMED — neither current nor planned path touches it |
| 0.7 Consumers of `runIngest` | CONFIRMED — exactly 2: `build-lifecycle-deps.ts` and `create-admin-service.ts` (via `runIngestWrapped`) |

**Minor finding**: `buildSequenceBulkOperations` has a 4th optional `categoryMap?` parameter not in the plan. Does not affect parameterisation.

**No corrections needed to the plan.**

**Phase 2 resilience tasks completed (out of order — independent of core spine):**

| Task | Commit | Summary |
|------|--------|---------|
| 2.4 Per-index count verification | `2d01e1a1` | `dispatchBulk` returns typed `IndexOperationCounts` from ES bulk response |
| 2.5 Cleanup-on-failure | `2d01e1a1` | Stage flow deletes orphaned versioned indexes on ingest failure; cleanup errors logged as warnings |
| 2.6 `verifyDocCounts` all-failure reporting | `196a3580` | Accumulates all per-index failures instead of early exit. New `verify-doc-counts.ts` module with 7 unit tests |
| 2.7 `createHybridDataSource` Result pattern | `e54d6554` | Returns `Result<HybridDataSource, AdminError>` with `data_source_error` kind. All callers updated |
| 2.9 Post-swap alias validation | `c4f84f39` | `validatePostSwapAliases()` between `atomicAliasSwap()` and `writeIndexMeta()`. Per-alias mismatch reporting |

**Also completed:**

| Item | Commit | Summary |
|------|--------|---------|
| Task 4.3 Archive predecessor plan | `31d90821` | `blue-green-reindex.execution.plan.md` archived to `completed/`, all cross-references updated |
| Practice Core protection rule | `31d90821` | New rule: sub-agents must not modify `.agent/directives/`, `.agent/rules/`, or platform adapters |
| `claude-agent-ops` CLI tool | `31d90821` | Agent monitoring CLI: `status`, `worktrees`, `log`, `diff`, `commit-ready` commands |

**Remaining work (critical path):**

1. ~~**Phase 1**: Parameterise pipeline~~ — DONE (`ff746ac2`)
2. ~~**Phase 2 core**: Create closure, wire lifecycle, delete ingest.ts~~ — DONE (`1e159d32`)
3. ~~**Phase 2.8**: Unify `rewriteBulkOperations`~~ — DONE (`7a51148a`)
4. ~~**Merge to main**~~ — DONE (PR #61 merged 2026-03-09)
5. **Phase 3**: ~~Dry run~~ DONE. Live stage → validate → promote → verify (Task 3.1 ready for manual execution)
6. **Phase 4**: Adversarial reviews + documentation propagation (except Task 4.3 which is done)

### 2026-03-09: Phase 1 + Phase 2 Complete

**Branch**: `feat/search_qol_fixes` (now merged to `main` via PR #61) — 4 commits, 980 tests passing.

Phase 1 (commit `ff746ac2`):

- Parameterised `collectPhaseResults` and `prepareBulkIngestion` on `IndexResolverFn`
- Deleted 6 hardcoded `oak_*` constants, derived defaults from `BASE_INDEX_NAMES`
- Extracted `bulk-ingestion-stats.ts` (SRP)
- Exported `IndexResolverFn`, `BASE_INDEX_NAMES`, `SEARCH_INDEX_KINDS` from SDK

Phase 2 core (commit `1e159d32`):

- Created `run-versioned-ingest.ts` closure factory + 6 unit tests (TDD)
- Wired into `admin-lifecycle-commands.ts` with widened `CliSdkEnv & OakClientEnv`
- `buildLifecycleDeps` now requires 3rd param `runVersionedIngest` (explicit DI)
- Deleted broken SDK `ingest.ts` (235 lines), removed `AdminService.ingest()`
- Extracted `admin-lifecycle-alias-commands.ts` (promote/rollback/validate-aliases)
- Exported `createVersionedIndexResolver` from SDK

Specialist reviews (commit `502cd410`):

- code-reviewer, type-reviewer, test-reviewer, docs-adr-reviewer all invoked
- Eliminated `as unknown as OakClient` double-cast with structural fake pattern
- Replaced `as BulkOperationEntry[]` with `satisfies BulkOperationEntry[]`
- Fixed stale TSDoc and README (removed references to deleted `AdminService.ingest()`)
- Deleted duplicate test

Phase 2.8 — Unify index resolution (commit `7a51148a`):

- Integrated PR #66 (cherry-picked + conflict-resolved)
- Deleted `rewriteBulkOperations` + ~65 lines supporting code
- Added `createIndexResolver` factory and `resolveOperationIndexes`
- Threaded `IndexResolverFn` through harness, batch, and `ingest-bulk.ts`
- PR #66 closed

**Done When progress**: 14 of 20 criteria met. All code merged to `main`. Remaining: 1–5 (Phase 3 operational — start with dry run), 15–18 (Phase 4 documentation)

**Process observations for next session:**

- **Pre-flight gates are mandatory.** Run `pnpm agent-tools:claude-agent-ops preflight` before
  launching parallel agents. Quality gates must pass BEFORE sub-agents are spawned —
  a failing gate in the base tree causes every worktree agent to fail at push time.
- **Worktree cleanup is mandatory after parallel work.** Run `pnpm agent-tools:claude-agent-ops cleanup`
  to remove finished worktrees, prune dead references, and delete orphaned branches.
  `.claude/worktrees/` is now gitignored to prevent index leakage.
- **`bulk-retry-cli.e2e.test.ts` blocks all pushes** in environments without the local
  `bulk-downloads/` directory. Root cause: the ingest CLI reads the filesystem BEFORE
  checking `dryRun` — an architectural flaw, not just a test issue. This e2e test
  depends on ambient filesystem state (bulk download data), violating the testing
  strategy's isolation requirements. Fix options: (a) skip the FS-dependent test in
  the pre-push hook, (b) refactor `executeBulkIngestion` to check dry-run before
  reading files, or (c) provide a minimal test fixture. This is pre-existing and
  outside the scope of this plan.
- Worktree file changes can leak into the main working tree. The `claude-agent-ops`
  CLI tracks this via `commit-ready` and `diff` commands.
- Sub-agents attempted to modify plan files — a new rule
  (`subagent-practice-core-protection`) now prevents this.

---

## Tasks

### Phase 0: Validate Assumptions — COMPLETE

**Foundation Check-In**: Re-read `principles.md` (fail fast, DRY, types from schema).

All 7 assumptions validated on 2026-03-09. No corrections needed. See
[Progress Log](#progress-log) for detailed results.

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

#### Task 0.5: Confirm `dispatchBulk` Behaviour

**Assumption 1**: The ES dispatch layer sends whatever `_index` is embedded
in the bulk operations — it does not override or rewrite index names.

**Assumption 2** (ADR-087): `dispatchBulk` sends operations in batches,
not as a single monolithic `/_bulk` request. With ~200k documents across
6 indexes, a single request would violate ADR-087's batch-atomic guarantee
and cause memory pressure on the ES cluster.

**Validation**:

1. Read `dispatchBulk()` and confirm it passes operations through without
   index name manipulation
2. Confirm it batches operations (check for chunking logic, batch size
   parameter, or iteration over operation subsets)
3. Document the batch size used

**If dispatch is not batched**: Add batching before proceeding to Phase 1.
This is a prerequisite for safely dispatching to versioned indexes.

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

#### Task 0.7: Enumerate All Consumers of `runIngest` / `ingest.ts`

**Assumption**: `buildLifecycleDeps()` is the only consumer of the broken
`ingest.ts`. This was found to be **wrong** by Barney's background review.

**Validation**:

1. Search for all imports from `ingest.ts` or `ingest.js` in the SDK
2. Search for all references to `runIngest` across the codebase
3. Document each consumer and its usage pattern
4. For each consumer, determine whether it must be replaced or can be
   deleted alongside `ingest.ts`

**Known consumers** (from Barney's review):

- `build-lifecycle-deps.ts` — lifecycle factory default (planned for removal)
- `create-admin-service.ts` — `AdminService.ingest()` method (must be addressed)

**If additional consumers exist**: Update Task 2.3 to handle each one.

**Phase 0 Complete When**: All 7 assumptions validated. Document any
corrections to the plan.

---

### Phase 1: Parameterise Pipeline on Index Names (TDD) — COMPLETE

**Status**: All tasks complete, all reviewer findings addressed, quality gates pass. Ready to commit.

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
3. **REFACTOR**: Delete the 6 hardcoded constants. The default resolver
   should derive from `BASE_INDEX_NAMES` (SDK's `index-resolver.ts`),
   not maintain a parallel copy of the same strings (Finding 12, Betty).

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

### Phase 2: Wire Lifecycle Deps, Delete Broken Code, Strengthen Resilience (TDD) — COMPLETE

**Foundation Check-In**: Re-read `principles.md` (no compatibility layers,
clear boundaries, fail fast with helpful errors), `schema-first-execution.md`
(types from schema).

#### Task 2.1: Create CLI-Layer `runVersionedIngest` Implementation — DONE

The CLI provides a `runVersionedIngest` **closure** that captures the
`OakClient` (needed for KS4 supplementation via `HybridDataSource`)
and other CLI-layer dependencies. `buildLifecycleDeps` does NOT gain
an `OakClient` parameter — the CLI provides the complete ingest
function as a closure (Finding 14, code-reviewer).

The closure:

1. Creates a versioned `IndexResolverFn` from the version string
2. Calls `prepareBulkIngestion` with the versioned resolver
3. Dispatches the resulting bulk operations to Elasticsearch
4. Returns `IngestResult` with document counts
5. Includes `logger.debug()` calls at entry, decision points, and exit
   (the predecessor's silent failure was partly caused by zero debug logging)

**Type narrowing**: The dep slot should NOT accept `IngestOptions` with
`dryRun` — a lifecycle ingest is always live. Either define a narrower
`VersionedIngestOptions` (omitting `dryRun`), or reject `dryRun: true`
at the function boundary with a fail-fast error (Finding 14,
code-reviewer).

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

#### Task 2.2: Wire Into `buildLifecycleService` — DONE

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

#### Task 2.3: Delete SDK `ingest.ts` and Handle All Consumers — DONE

**Consumers to address** (from Phase 0, Task 0.7):

1. `build-lifecycle-deps.ts` — remove the default `runVersionedIngest`.
   Make it a required parameter (the CLI provides it).
2. `create-admin-service.ts` — `AdminService.ingest()` also calls
   `runIngest`. Either:
   - (a) Make `AdminService` accept an injected ingest function (DI,
     consistent with `IndexLifecycleDeps`), or
   - (b) Remove `AdminService.ingest()` if it is unused / dead code, or
   - (c) Have `AdminService` delegate to the lifecycle service's stage
     flow for versioned ingest
   — Decide during Phase 0 based on actual usage of `AdminService.ingest()`.

**Changes**:

1. Delete `packages/sdks/oak-search-sdk/src/admin/ingest.ts` (235 lines)
2. Remove the import from `build-lifecycle-deps.ts`
3. Remove the default `runVersionedIngest` from `buildLifecycleDeps()`
4. Make `runVersionedIngest` a required parameter of `buildLifecycleDeps()`
5. Address `AdminService.ingest()` per the chosen approach above
6. Update any re-exports from `index.ts` files

**Acceptance Criteria**:

1. `ingest.ts` is deleted from the SDK
2. No `unknown[]` processing anywhere in the ingestion path
3. No silent failure paths (`return []`) anywhere in the ingestion path
4. `buildLifecycleDeps()` does not provide a default ingest implementation
5. `AdminService.ingest()` either removed or uses injected implementation
6. All quality gates pass

#### Task 2.4: Per-Index Count Verification in Dispatch (Resilience) — DONE

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

#### Task 2.5: Cleanup-on-Failure for Orphaned Versioned Indexes (Resilience) — DONE

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

#### Task 2.6: `verifyDocCounts` Reports All Failures (Resilience) — DONE

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

#### Task 2.7: `createHybridDataSource` Result Pattern (Resilience) — DONE

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

#### Task 2.8: Unify Index Name Resolution (Eliminate Competing Patterns) — DONE

**Problem**: The non-versioned pipeline (`admin ingest`) uses
`rewriteBulkOperations` in `search-index-target.ts` to post-hoc
rewrite `_index` values in bulk operations (e.g. for sandbox targets).
The versioned pipeline will use an upfront `IndexResolverFn` to generate
correct index names from the start. Two competing patterns for the same
concern creates future confusion.

**Target**: Both the versioned and non-versioned pipelines use the same
`IndexResolverFn` mechanism. `rewriteBulkOperations` is deleted or
relegated to a compatibility path with a clear deprecation note.

**TDD Sequence**:

1. **RED**: Write test — `admin ingest` with sandbox target uses
   `IndexResolverFn` instead of `rewriteBulkOperations`. Run → FAILS.
2. **GREEN**: Thread the resolver through the non-versioned `admin ingest`
   path. Remove `rewriteBulkOperations` from the hot path. Run → PASSES.
3. **REFACTOR**: Delete `rewriteBulkOperations` if no longer needed.
   Update `search-index-target.ts` and its tests.

**Acceptance Criteria**:

1. One pattern for index name resolution across all ingestion paths
2. `rewriteBulkOperations` deleted or explicitly deprecated
3. `admin ingest` behaviour unchanged (existing tests pass)

#### Task 2.9: Post-Swap Alias Validation Before Metadata Commit (Resilience) — DONE

**Problem**: After `atomicAliasSwap()`, the promote flow immediately
writes metadata assuming all 6 aliases swapped successfully. If the
swap partially fails (some aliases swapped, others not), metadata
records incorrect state. No validation runs between swap and commit.

**Target**: After `atomicAliasSwap()` returns, call
`resolveCurrentAliasTargets()` to verify all 6 aliases point to the
expected versioned index. Only proceed to metadata write if all
aliases are confirmed. If any alias is wrong, return an error with
a detailed per-alias report.

**TDD Sequence**:

1. **RED**: Write test — `promote` with a partially-failed swap
   (mock `resolveCurrentAliasTargets` returning mismatched aliases)
   returns an error before writing metadata. Run → FAILS.
2. **GREEN**: Add post-swap validation in the promote flow between
   `atomicAliasSwap()` and `writeIndexMeta()`. Run → PASSES.
3. **REFACTOR**: Ensure the error includes which aliases failed and
   what they point to.

**Acceptance Criteria**:

1. Post-swap validation confirms all 6 aliases before metadata write
2. Partial swap failure is reported with per-alias details
3. No metadata is written for a partially-swapped state

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

#### Task 3.0: Dry Run (start here)

Before touching the live cluster, validate the full pipeline end-to-end
with a dry run:

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin ingest --dry-run --verbose
```

**Expected**: The pipeline parses bulk download files, runs all
transformers (lessons, units, rollups, threads, sequences, vocabulary),
builds NDJSON bulk operations, and reports what it *would* dispatch —
without writing anything to Elasticsearch.

**If it fails**: Fix the issue before proceeding. A dry-run failure means
the live stage will also fail. Check bulk-downloads data is present and
transformer output matches the expected index document shapes.

**Proceed to 3.1 only after the dry run succeeds.**

#### Task 3.1: Stage Versioned Indexes

```bash
cd apps/oak-search-cli
pnpm tsx bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads --verbose
```

**Expected**: All 6 versioned indexes created and populated with non-zero
document counts. The stage command reports the version string.

**If it fails**: Read the error. The debug logging added during the rewrite
should make the failure visible. Do not proceed until staging succeeds.

#### Task 3.2: Validate Staged Indexes

```bash
pnpm tsx bin/oaksearch.ts admin count
```

**Expected**: 6 versioned indexes visible alongside 6 bare indexes.

Use `admin count` for true parent document counts (excludes ELSER
`semantic_text` chunk inflation). Use `_cat/indices` for Lucene doc counts
(includes chunks — expected to be much higher for ELSER indexes).

**True parent counts** (via `admin count` / ES `_count` API):

- `oak_lessons_v*` ≈ 12,746 lessons
- `oak_unit_rollup_v*` ≈ 1,671 rollups
- `oak_units_v*` ≈ 1,671 units
- `oak_threads_v*` ≈ 164 threads
- `oak_sequence_facets_v*` ≈ 57 facets
- `oak_sequences_v*` ≈ 30 sequences

**Lucene doc counts** (via `_cat/indices`) will be
higher for indexes with `semantic_text` fields due to ELSER chunking:

- `oak_lessons_v*` ≈ 193k (15x inflation from ELSER chunks)
- `oak_unit_rollup_v*` ≈ 172k (similar inflation)
- Other indexes: comparable to parent counts (no `semantic_text` fields)

#### Task 3.3: Promote

```bash
pnpm tsx bin/oaksearch.ts admin promote --target-version <version-from-stage>
```

**Expected**: Atomic alias swap succeeds. Bare indexes removed via
`remove_index`. Aliases now point to versioned indexes. Metadata written.

#### Task 3.4: Verify

```bash
pnpm tsx bin/oaksearch.ts admin validate-aliases
pnpm tsx bin/oaksearch.ts search lessons "photosynthesis"
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

#### Task 4.3: Archive Predecessor Plan — DONE

`blue-green-reindex.execution.plan.md` has been moved to
`.agent/plans/semantic-search/archive/completed/`. Its completed
prerequisites and "what went wrong" documentation are retained as
historical records. All cross-references updated.

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
- `promote` with partially-failed swap — proves post-swap validation rejects

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
pnpm tsx bin/oaksearch.ts admin rollback
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

6. ~~SDK `ingest.ts` is deleted — no `unknown[]` processing exists~~ — DONE (`1e159d32`)
7. ~~`buildLifecycleDeps()` requires explicit `runVersionedIngest` injection~~ — DONE (`1e159d32`)
8. ~~`dispatchBulk()` returns per-index operation counts (not void)~~ — DONE (`2d01e1a1`)
9. ~~`verifyDocCounts()` reports all failures, not just the first~~ — DONE (`196a3580`)
10. ~~`createHybridDataSource()` returns `Result`, does not throw~~ — DONE (`e54d6554`)
11. ~~Failed `stage` cleans up orphaned versioned indexes~~ — DONE (`2d01e1a1`)
12. ~~`AdminService.ingest()` either removed or uses injected implementation~~ — DONE, removed (`1e159d32`)
13. ~~One index-name resolution pattern across all ingestion paths (`rewriteBulkOperations` eliminated)~~ — DONE (`7a51148a`)
14. ~~Post-swap alias validation confirms all 6 aliases before metadata write~~ — DONE (`c4f84f39`)

### Documentation

15. ADR-130 documents `remove_index` alias action
16. ADR-093 notes versioned ingestion support via `IndexResolverFn`
17. INDEXING.md describes versioned vs bare ingestion flow
18. TSDoc present on all changed function signatures

### Quality

19. All quality gates pass across all workspaces
20. All mandatory reviewers have been invoked and findings addressed

---

## References

### ADRs

- [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green design
- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — Dependency injection
- [ADR-029](../../../../docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-093](../../../../docs/architecture/architectural-decisions/093-bulk-first-ingestion-strategy.md) — Bulk-first ingestion
- [ADR-087](../../../../docs/architecture/architectural-decisions/087-batch-atomic-ingestion.md) — Batch-atomic ingestion

### Related Plans and Documentation

- [Predecessor plan](../archive/completed/blue-green-reindex.execution.plan.md) — What went wrong (2026-03-08)
- [API gaps inventory](./bulk_data_for_semantic_search.feature_request.md) — Data not in bulk downloads
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
| `packages/sdks/oak-search-sdk/src/admin/ingest.ts` | DELETED (Phase 2, Task 2.3) |
| `packages/sdks/oak-search-sdk/src/admin/create-admin-service.ts` | `AdminService.ingest()` — second consumer of `ingest.ts` (Phase 2, Task 2.3) |
| `apps/oak-search-cli/src/lib/search-index-target.ts` | `rewriteBulkOperations` — competing pattern, eliminated (Phase 2, Task 2.8) |
| `packages/sdks/oak-sdk-codegen/src/bulk/reader.ts` | Typed bulk file reader (`parseBulkFile`, `readAllBulkFiles`) — unchanged |
| `packages/sdks/oak-sdk-codegen/src/types/generated/bulk/` | Generated Zod schemas (`bulkDownloadFileSchema`) — unchanged |
| `apps/oak-search-cli/bulk-downloads/schema.json` | Bulk data format schema — unchanged |
| `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-bulk.ts` | `dispatchBulk` gains per-index counts (Phase 2, Task 2.4) |
| `apps/oak-search-cli/src/lib/indexing/ingest-harness-ops.ts` | Not modified — versioned path bypasses this (Phase 0, Task 0.6 confirms) |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` | Stage cleanup-on-failure + verify all failures (Phase 2, Tasks 2.5-2.6) |
| `apps/oak-search-cli/src/adapters/hybrid-data-source.ts` | Returns Result instead of throwing (Phase 2, Task 2.7) |
| `apps/oak-search-cli/src/adapters/bulk-thread-transformer.ts` | Unchanged — already parameterised |
| `apps/oak-search-cli/src/adapters/bulk-sequence-transformer.ts` | Unchanged — already parameterised |
| `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` | `IndexLifecycleDeps` interface — may gain required param |
