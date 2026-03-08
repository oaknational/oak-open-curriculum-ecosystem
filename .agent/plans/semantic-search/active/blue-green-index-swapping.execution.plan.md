---
name: "ADR-130: Blue/Green Index Swapping — Reviewer Fixes + WS5 CLI Wiring"
overview: "Address all 6-reviewer findings from WS0–WS4, then wire CLI commands and delete alias-swap.sh to complete ADR-130."
adr: "docs/architecture/architectural-decisions/130-blue-green-index-swapping.md"
branch: "feat/search_qol_fixes"
todos:
  - id: phase-1-code-fixes
    content: "Phase 1: Code correctness fixes (C1–C7) from code-reviewer, type-reviewer, architecture-betty"
    status: done
  - id: phase-2-architecture
    content: "Phase 2: Architecture/layering fixes (A1–A4) — includes AliasTargetMap strict type (A4)"
    status: done
  - id: phase-3-es-performance
    content: "Phase 3: ES performance improvements (E1–E3) from elasticsearch-reviewer"
    status: done
  - id: phase-4-tests
    content: "Phase 4: Test fixes and coverage gaps (T1–T4) from test-reviewer"
    status: done
  - id: phase-5-adr-drift
    content: "Phase 5: ADR-130 drift fixes (D1–D5) — D1/D2/D4 done early; D3/D5 code done, docs remaining"
    status: done
  - id: phase-6-minor
    content: "Phase 6: Minor/TSDoc fixes (M1–M4) — M1/M3/M4 done; M2 deferred (cosmetic)"
    status: done
  - id: phase-7-ws5-cli
    content: "Phase 7 (WS5): CLI commands wired, alias-swap.sh deleted, bash pass-through + script removed"
    status: done
  - id: phase-7-docs
    content: "Phase 7 docs: Update infrastructure README, INDEXING.md, and ADR-130 CLI section (D3/D5)"
    status: done
  - id: phase-7b-docs
    content: "Phase 7b: Documentation — search SDK README (lifecycle section), root README (workspace summaries)"
    status: done
  - id: phase-8-reviewer-fixes
    content: "Phase 8a: Address reviewer findings (CR-1–3, ES-1–2, TR-1–3) — code + tests"
    status: done
  - id: phase-8c-second-reviewer-fixes
    content: "Phase 8c: Address second-round reviewer findings (W-7, W-1, CR-1, W-5, W-6, W-8, etc.) — code + tests + docs"
    status: done
  - id: phase-8d-max-lines-extraction
    content: "Phase 8d: Extract rollback/validate to lifecycle-rollback.ts (max-lines fix)"
    status: pending
  - id: phase-8-gates-review
    content: "Phase 8b: Full quality gates + final reviewer pass"
    status: pending
isProject: false
---

# ADR-130: Blue/Green Index Swapping — Reviewer Fixes + WS5 CLI Wiring

**Last Updated**: 2026-03-08
**Status**: ACTIVE
**Branch**: `feat/search_qol_fixes`
**ADR**: `docs/architecture/architectural-decisions/130-blue-green-index-swapping.md`

---

## Standalone Session Entry

Use this section to start a fresh session from this plan alone.

### Re-ground

Read:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `docs/architecture/architectural-decisions/130-blue-green-index-swapping.md`
5. This plan file

### Baseline

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test
```

**WARNING**: `pnpm lint:fix` currently FAILS — `index-lifecycle-service.ts` is 302 lines (limit 250). This is the first thing to fix in the next session (Phase 8d).

### What to do next (session 7)

One blocking lint issue remains, then quality gates and re-review.

#### Step 1: Extract rollback/validate to `lifecycle-rollback.ts` (Phase 8d)

`index-lifecycle-service.ts` is 302 lines (limit 250). The fix is to extract 4 functions to a new `lifecycle-rollback.ts`:

**Functions to extract** (lines 221-302 of `index-lifecycle-service.ts`):

- `rollback()` — exported
- `executeRollbackSwap()` — private
- `writeRollbackMeta()` — private
- `validateAliases()` — exported

**Update `index-lifecycle-service.ts`**:

- Remove the 4 extracted functions
- Remove unused imports: `IndexMetaDoc`, `RollbackResult`, `AliasValidationResult`, `SEARCH_INDEX_KINDS`, `BASE_INDEX_NAMES`, `resolveAliasName`, `buildVersionSwapActions`, `assessAliasHealth`, `validateRollbackMeta`
- Add: `import { rollback, validateAliases } from './lifecycle-rollback.js';`
- Update module TSDoc to reference the new file

**Create `lifecycle-rollback.ts`** with:

- The 4 extracted functions
- All necessary imports (`Result`, `ok`, `err`, `IndexMetaDoc`, `AdminError`, `AliasValidationResult`, `IndexLifecycleDeps`, `RollbackResult`, `SEARCH_INDEX_KINDS`, `BASE_INDEX_NAMES`, `resolveAliasName`, `buildVersionSwapActions`, `assessAliasHealth`, `validateRollbackMeta`)
- Module TSDoc header

**Tests**: No test changes needed — the integration test calls through `createIndexLifecycleService` which wires `rollback` and `validateAliases` regardless of where they're defined.

After this extraction, run `pnpm lint:fix` to confirm the max-lines error is resolved.

#### Step 2: Full quality gates

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm format:root && pnpm markdownlint:root
```

#### Step 3: Invoke final specialist reviewers

Invoke at minimum: code-reviewer, test-reviewer, elasticsearch-reviewer, docs-adr-reviewer, plus 2 architecture reviewers (fred + wilma).

#### Step 4: Address any new findings, archive plan

### Context Summary

WS0–WS4 of ADR-130 are complete. Two rounds of specialist review have been done: the first (session 4) produced ~30 findings across 6 reviewers; the second (session 5-6) produced ~25 findings across 6 reviewers (code-reviewer, test-reviewer, elasticsearch-reviewer, docs-adr-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma). All findings have been addressed in code, tests, and documentation.

**Progress as of 2026-03-08 (session 6)**: All code and documentation changes DONE except the max-lines extraction (Phase 8d). 142 search SDK tests passing (13 test files), 22 lifecycle integration tests. Build and type-check pass. Lint fails only on the 302-line file.

**What was completed in session 5-6** (Phase 8c — second-round reviewer findings):

Second-round reviewers (code-reviewer, test-reviewer, elasticsearch-reviewer, docs-adr-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma) produced a plan with 9 steps. All steps 1-8 completed:

- **Step 1 (T-CR1)**: Renamed `index-lifecycle-service.unit.test.ts` → `.integration.test.ts`
- **Step 2 (W-7, W-1, CR-1)**: Safety fixes — compound failure propagation from `attemptMetaFailureRollback` now returns `Result`; rollback version existence check via `verifyDocCounts`; `durationMs` timing fix (pass `startTime`, compute inside `swapAndCommit`)
- **Step 3 (W-5)**: `CleanupResult` type with `deleted`/`failed` counts; `cleanupFailures` added to `VersionedIngestResult`
- **Step 4 (W-6, W-8)**: Improved rollback error message clarity; aggregated all index creation errors in `hasSetupError`
- **Step 5 (T-IMP2/3/4, CR-2)**: Test improvements — removed positive-path `toHaveBeenCalledOnce` assertions; replaced inline `.every()` with `toHaveLength`; used `AliasSwap` type; added compound error tests for W-7, W-1, W-5
- **Step 6 (F-W1, F-W2)**: Extracted `createEsClient` shared helper; reduced admin barrel exports to consumer-facing APIs only; renamed `createLifecycleService` → `buildLifecycleService`
- **Step 7 (D-CR2)**: Deleted dead `registerBashPassThrough` function
- **Step 8 (D-CR1, D-IMP1, D-IMP3, CR-4)**: Documentation fixes — replaced stale `pnpm elastic:alias-swap` with CLI commands; marked migration steps as not-yet-implemented; removed `alias-swap.sh` reference from `alias-operations.ts` TSDoc; added blank line before `assessAliasHealth` docblock; updated SDK README test count (142 tests, 13 files); updated `.agent/analysis/repo-search-deep-dive.md`

**Deferred items (not in scope)**: concurrency guard (ADR-130 Phase 3), post-swap alias verification, transient ES error retry, parallel `client.count`, `SEARCH_INDEX_VERSION` env step, YAGNI query-pattern tests

**What was completed in session 4** (Phases 7d, 7b, 8a):

- **Phase 7d docs**: Rewrote `operations/infrastructure/README.md`; updated `docs/INDEXING.md`; updated ADR-130
- **Phase 7b docs**: Added lifecycle section to SDK README; added workspace summaries to root README
- **Phase 8a reviewer fixes** (8 findings): CR-1 empty getAlias, CR-2 TARGET_SUFFIXES, CR-3 cross-contamination tests, ES-1/ES-2 TSDoc, TR-1/TR-2/TR-3 test improvements
  - **TR-2**: Rollback swap test now asserts both `toIndex` and `fromIndex` values
  - **TR-3**: Renamed `getIndices` fake client key to `get` to match ES client method name

**What was completed in session 3** (Phases 3–7 code):

- **Phase 3 (E1–E3)**: `resolveOneAlias` rewritten to single `getAlias` + 404 catch; `resolveAllAliases` parallelised with `Promise.all`; `listVersionedIndexes` rewritten from `cat.indices` to `indices.get` + 404 catch
- **Phase 4 (T1–T4)**: Deleted 4 redundant versioned-index-resolver tests (kept 2); added 7 coverage gap tests (2 alias-ops, 5 lifecycle-service); renamed `alias-operations.unit.test.ts` → `.integration.test.ts`
- **Phase 7 code**: Created `build-lifecycle-deps.ts` (factory wiring `IndexLifecycleDeps` from ES client); created `admin-lifecycle-commands.ts` (3 Commander commands); registered in admin/index.ts; deleted `alias-swap.sh`; removed bash pass-through registration; removed `elastic:alias-swap` package.json script

**New files created in session 3**:

| File | Purpose |
|------|---------|
| `packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts` | Factory: `buildLifecycleDeps(client, target, logger?)` → `IndexLifecycleDeps` |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` | CLI: `versioned-ingest`, `rollback`, `validate-aliases` commands |

**Key files** (all phases):

| File | Purpose |
|------|---------|
| `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts` | ES alias operations (atomic swap, resolve targets) |
| `packages/sdks/oak-search-sdk/src/internal/index-resolver.ts` | Index name resolution (shared helpers: `resolveAliasName`, `resolveVersionedIndexName`, `TARGET_SUFFIXES`) |
| `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.ts` | Versioned index name factory (uses shared helpers) |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts` | Pure functions for building swap action arrays |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts` | Old generation cleanup |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-rollback.ts` | Rollback and alias validation (to be created in Phase 8d) |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` | Orchestration service (ingest + swap) |
| `packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts` | DI factory for lifecycle deps |
| `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` | DI interface, service types |
| `packages/sdks/oak-search-sdk/src/admin/index.ts` | Admin barrel exports |
| `packages/sdks/oak-search-sdk/src/index.ts` | SDK root barrel |
| `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` | CLI: versioned-ingest, rollback, validate-aliases |
| `apps/oak-search-cli/src/cli/admin/admin-orchestration-commands.ts` | CLI admin commands (bash pass-throughs) |

---

## Phase 1: Code Correctness Fixes (C1–C7) — DONE

**Sources**: code-reviewer, type-reviewer, architecture-betty
**Completed**: 2026-03-08

All 7 items resolved. Key changes:

- `buildRollbackSwaps` returns `Result` with `err` on null target (C1)
- `writeRollbackMeta` returns `Result`, checked in `rollback()` (C2)
- `attemptMetaFailureRollback` extracted, logs compound failures (C3)
- `duration_ms` recorded from `Date.now()` timing (C4)
- `AliasMigrationResult` deleted (C5)
- `createIndexLifecycleService` exported from SDK root (C6)
- `IndexLifecycleDeps` dual-export removed (C7)
- `validateRollbackMeta` and `buildIngestMeta` moved to `lifecycle-swap-builders.ts` to stay under 250-line limit

### C1: Fix `buildRollbackSwaps` null-target fallback

**File**: `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts:96`

**Problem**: When `info?.targetIndex` is null (alias exists with no backing index), the fallback `resolveAlias(base, target)` produces a swap pointing an alias to itself — semantically invalid and will error in ES.

**Current**:

```typescript
const toIndex = info?.targetIndex ?? resolveAlias(base, target);
```

**Fix**: The caller (`swapAndCommit`) should guard against this before calling `buildRollbackSwaps`. Since `buildRollbackSwaps` is a pure function that cannot return `Result`, the guard belongs in the orchestrator. If any `originalTargets` entry has `targetIndex === null`, the rollback swap cannot proceed — log the error and return the original `writeResult` without attempting rollback.

Alternatively, change `buildRollbackSwaps` signature to return `Result<readonly AliasSwap[], AdminError>` and return `err` when any target is null.

**Test**: Add a test in `index-lifecycle-service.unit.test.ts` where `resolveCurrentAliasTargets` returns an entry with `{ isAlias: true, targetIndex: null }`, and verify the service handles it gracefully.

### C2: Handle `writeRollbackMeta` failure

**File**: `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts:170`

**Problem**: `writeRollbackMeta` returns `Promise<void>` and discards the `Result` from `deps.writeIndexMeta`. If metadata write fails after a successful alias rollback swap, aliases point to the old version but metadata claims the new version — future rollback would target the wrong version.

**Fix**: Change `writeRollbackMeta` to return `Promise<Result<void, AdminError>>`. In `rollback()`, check the result and at minimum log the failure. Consider returning a compound result that includes both the rollback success and the metadata write status.

**Test**: Add test where `writeIndexMeta` fails during rollback; verify the error is surfaced (not swallowed).

### C3: Check rollback swap result in `swapAndCommit`

**File**: `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts:121`

**Problem**: When metadata write fails after a successful alias swap, the code attempts a rollback swap but discards its result. If the rollback swap also fails, the system is in an inconsistent state with no error surfaced.

**Current**:

```typescript
await deps.atomicAliasSwap(rollbackSwapActions);
return writeResult;
```

**Fix**: Check the rollback swap result. If it also fails, log the compound failure (metadata write failed AND rollback swap failed). Return the original `writeResult` either way, but ensure the double-failure is logged.

**Test**: Add test where both `writeIndexMeta` and the second `atomicAliasSwap` call fail; verify the compound error is logged.

### C4: Record actual `duration_ms` instead of hardcoded 0

**File**: `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts:128`

**Problem**: `buildIngestMeta` hardcodes `duration_ms: 0`, defeating the audit trail.

**Fix**: Record `Date.now()` at the start of `versionedIngest`, calculate elapsed time after `prepareVersionedIndexes`, and pass it through to `buildIngestMeta`.

**Test**: Existing tests will need the meta-write assertion updated to accept a non-zero `duration_ms` (use `expect.any(Number)` or a range check).

### C5: Remove orphaned `AliasMigrationResult` type

**File**: `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts:89-98`

**Problem**: `AliasMigrationResult` is defined and exported but no method produces it. `migrateToAliases` is planned but not implemented. YAGNI — the orphaned type advertises a contract that doesn't exist.

**Fix**: Delete the `AliasMigrationResult` interface. Remove its export from `types/index.ts`. Re-add when `migrateToAliases` is actually implemented.

### C6: Export `createIndexLifecycleService` from SDK root

**File**: `packages/sdks/oak-search-sdk/src/index.ts`

**Problem**: `IndexLifecycleService` types are exported at the top level, but the factory function isn't. Consumers cannot instantiate the service without reaching into internal paths.

**Fix**: Add `export { createIndexLifecycleService } from './admin/index.js';` to the SDK root `index.ts`.

### C7: Remove `IndexLifecycleDeps` dual-export

**Files**: `packages/sdks/oak-search-sdk/src/admin/index.ts`, `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts`

**Problem**: `IndexLifecycleDeps` is exported from both `admin/index.ts` (re-exported from the service file) and `types/index.ts`. Two canonical import paths for the same type.

**Fix**: Remove the `export type { IndexLifecycleDeps }` re-export from `index-lifecycle-service.ts` (line 32) and from `admin/index.ts`. Keep it only in `types/index-lifecycle-types.ts` → `types/index.ts` → `src/index.ts`.

---

## Phase 2: Architecture/Layering Fixes (A1–A4) — DONE

**Sources**: architecture-betty, docs-adr-reviewer, principles.md (type strictness)
**Completed**: 2026-03-08

All 4 items resolved. Key changes:

- `AliasSwap` and `AliasTargetInfo` moved from `alias-operations.ts` to `index-lifecycle-types.ts` (A1)
- Shared `resolveAliasName`, `resolveVersionedIndexName`, `TARGET_SUFFIXES` extracted to `internal/index-resolver.ts` (A2)
- ADR-130 updated with cleanup invariant (option b), sort comment added to `lifecycle-cleanup.ts` (A3)
- `AliasTargetMap = Readonly<Record<SearchIndexKind, AliasTargetInfo>>` replaces all `Record<string, AliasTargetInfo>` (A4)
- `IndexLifecycleDeps.resolveCurrentAliasTargets` now takes no args (resolves internally using `target`)
- `alias-operations.ts` `resolveCurrentAliasTargets` now takes `(client, target)` and returns kind-keyed `AliasTargetMap`
- `resolveAllAliases` uses explicit property assignment to avoid `as` assertion (lint compliance)
- All test fixtures updated from alias-name keys (`oak_lessons`) to kind keys (`lessons`)
- `lifecycle-swap-builders.ts` functions accept `AliasTargetMap` and look up by kind
- `index-lifecycle-service.ts` removes `resolveAliasNames` calls; `validateAliases` iterates `SEARCH_INDEX_KINDS`

**Quality gates**: build ✅, type-check ✅, lint 0 errors ✅, 43 admin tests ✅, 132 search SDK tests ✅

### A1: Move `AliasSwap` and `AliasTargetInfo` to types layer

**Files**: `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts`, `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts`

**Problem**: `types/index-lifecycle-types.ts` imports from `admin/alias-operations.ts` — types depending on implementation reverses the canonical direction.

**Fix**: Move `AliasSwap` and `AliasTargetInfo` type definitions from `alias-operations.ts` to `index-lifecycle-types.ts`. Update `alias-operations.ts` to import them from the types layer. Update all other consumers.

### A2: Unify versioned name formula

**Files**: `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts:36-39`, `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.ts:48-51`

**Problem**: Both files independently implement `${base}${suffix}_${version}`. `versioned-index-resolver.ts` uses exhaustive `Record<SearchIndexTarget, string>`; `lifecycle-swap-builders.ts` uses an inline conditional.

**Fix**: Extract a shared `resolveVersionedIndexName(base, target, version)` helper into `internal/index-resolver.ts` (where `BASE_INDEX_NAMES` already lives). Both consumers import from there. Use the exhaustive `Record` approach.

### A3: Cleanup does not protect `previous_version` index

**File**: `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts`

**Problem**: ADR-130 line 61 claims "Cleanup never deletes indexes referenced as `previous_version`". The implementation simply sorts and deletes the oldest beyond MAX_GENERATIONS, without consulting metadata.

**Fix options** (pick one):
- **(a)** Add a `readIndexMeta` dependency to cleanup and skip deletion of any index whose name matches `previous_version`.
- **(b)** Update ADR-130 to remove the safety claim, noting that MAX_GENERATIONS=2 naturally protects the rollback target since cleanup runs after the swap (generations are: current=n, previous=n-1; oldest deleted is n-2).

Option (b) is simpler and correct given the current single-level rollback constraint. If chosen, add a comment in `lifecycle-cleanup.ts` documenting this invariant.

### A4: Eliminate `Record<string, AliasTargetInfo>` — replace with strict `AliasTargetMap`

**Source**: `principles.md` line 74 — *"Never use `Record<string, unknown>` or `{ [key: string]: unknown }`"*. `Record<string, AliasTargetInfo>` is the same entropy vector: loose string keys where the domain is the closed `SearchIndexKind` union.

**Files affected**:

- `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` — define `AliasTargetMap = Readonly<Record<SearchIndexKind, AliasTargetInfo>>` (DONE)
- `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` — change `IndexLifecycleDeps.resolveCurrentAliasTargets` return type from `Record<string, AliasTargetInfo>` to `AliasTargetMap`, remove `aliasNames` parameter (the dep now resolves internally using `target`)
- `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts` — change `resolveCurrentAliasTargets` to accept `target: SearchIndexTarget` (not `aliasNames: readonly string[]`), iterate `SEARCH_INDEX_KINDS` internally, return `AliasTargetMap` keyed by kind
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts` — change `buildSwapActions`, `buildRollbackSwaps`, `buildVersionSwapActions` parameter types from `Record<string, AliasTargetInfo>` to `AliasTargetMap`; look up by `kind` instead of computed alias name
- `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` — remove `resolveAliasNames` calls before `resolveCurrentAliasTargets` (no longer needed); update `attemptMetaFailureRollback` parameter type
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.unit.test.ts` — update test fixtures from `{ oak_lessons: ... }` to `{ lessons: ... }` (keyed by kind)
- `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.unit.test.ts` — update fake `resolveCurrentAliasTargets` to return `AliasTargetMap`
- `packages/sdks/oak-search-sdk/src/admin/alias-operations.unit.test.ts` — update tests for new signature

**Strategy**: The alias name is still needed for ES API calls and for `AliasSwap.alias` — but the map key changes from alias name (a computed string) to `SearchIndexKind` (a literal union member). Consumers look up `targets[kind]` instead of `targets[computedAliasName]`. The `resolveAliasNames` function moves inside `resolveCurrentAliasTargets` rather than being called externally.

**Also check**: `DOC_TYPE_TO_KIND` in `ingest.ts` uses `Record<string, SearchIndexKind>` — this IS a genuine incoming boundary (doc type strings from NDJSON files) but should be validated. Defer to a separate item if needed.

**Test**: All existing tests must pass after the type change. The key behavioural assertion: swap actions still contain the correct alias name strings, but the map is now keyed by kind.

**Design note — all indexes, rollups, and aliases should be defined ahead of time**: The search index topology is fully known at compile time: 6 curriculum index kinds (`SEARCH_INDEX_KINDS`), 2 targets (primary/sandbox), plus zero-hit and meta indexes. Every possible index name, alias name, and versioned index name is derivable from these constants. We should define the complete topology as compile-time data (e.g. a `const` map of kind → base name → alias name → versioned name pattern) so that:

- All valid names and relationships are statically known
- No runtime string computation is needed to discover what indexes exist
- Type safety flows from the topology definition through to all consumers
- `AliasTargetMap` is one step in this direction — keying by `SearchIndexKind` instead of computed strings
- A future step could define the full `IndexTopology` as a compile-time structure that codegen or `as const` data drives, eliminating scattered `resolveAlias`/`resolveVersionedName` helper functions in favour of a single source of truth

---

## Phase 3: ES Performance Improvements (E1–E3) — DONE

**Source**: elasticsearch-reviewer
**Completed**: 2026-03-08 (session 3)

All 3 items resolved:

- E1: `resolveOneAlias` rewritten — single `getAlias` + `isNotFoundError` 404 catch (halves HTTP calls from 12→6)
- E2: `resolveAllAliases` parallelised with `Promise.all` (6 concurrent calls instead of sequential)
- E3: `listVersionedIndexes` rewritten from `cat.indices` to `indices.get` with 404 catch for no-match case
- Fake client in tests updated: removed `existsAlias` and `cat.indices` mocks, added `create404Error` helper
- Default `getAlias` mock now throws 404; default `indices.get` mock now throws 404
- 15 alias-operations integration tests passing

### E1: Single `getAlias` with 404 catch (halves HTTP calls)

**File**: `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts:131-138`

**Problem**: Sequential `existsAlias` + `getAlias` = 2 HTTP calls per alias = 12 calls for 6 aliases.

**Fix**: Replace `resolveOneAlias` with a single `getAlias` call, catching 404 via `isNotFoundError`:

```typescript
async function resolveOneAlias(client: Client, aliasName: string): Promise<AliasTargetInfo> {
  try {
    const aliasResponse = await client.indices.getAlias({ name: aliasName });
    return { isAlias: true, targetIndex: firstKey(aliasResponse) };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { isAlias: false, targetIndex: null };
    }
    throw error;
  }
}
```

**Test**: Update `alias-operations.unit.test.ts` — the "not found" tests should mock `getAlias` throwing a 404 error instead of mocking `existsAlias` returning false. Remove `existsAlias` mock entirely.

### E2: Batch alias resolution in a single HTTP call

**File**: `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts` — `resolveAllAliases`

**Problem**: Sequential per-kind resolution — 6 individual `existsAlias` + `getAlias` calls.

**Fix**: After E1 (single `getAlias` per alias), consider batching all 6 into a single `client.indices.getAlias({ name: 'oak_lessons,oak_units,...' })` call. The response is keyed by physical index name — need to invert the mapping to build the `AliasTargetMap`. Alternatively, use `Promise.all` to parallelize the 6 individual calls (simpler, still 6 HTTP calls but concurrent).

**Note**: The function now uses explicit property assignment (one `await resolve(kind)` per kind) to avoid `as` assertions. `Promise.all` parallelization is the simpler first step; full batching is more complex but reduces to 1 HTTP call.

### E3: Use `indices.get` instead of `cat.indices` for index listing

**File**: `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts:177`

**Problem**: `cat.indices` fetches all cluster indexes, then filters client-side. Loosely typed response.

**Fix**: Use `client.indices.get({ index: `${prefix}*` })` which returns only matching indexes server-side. The response keys are index names — use `for...in` or similar to extract them.

**Test**: Update `listVersionedIndexes` tests to mock `indices.get` instead of `cat.indices`.

---

## Phase 4: Test Fixes and Coverage Gaps (T1–T4) — DONE

**Source**: test-reviewer
**Completed**: 2026-03-08 (session 3)

All 4 items resolved:

- T1+T2: Deleted 4 redundant tests from `versioned-index-resolver.unit.test.ts` (kept 2 comprehensive tests: primary and sandbox, all 6 kinds each)
- T3: Added 7 coverage gap tests — 2 in `alias-operations.integration.test.ts` (full kind-keyed resolve, alias-exists-no-target) and 5 in `index-lifecycle-service.unit.test.ts` (ingest failure, swap failure, rollback swap shape, rollback alias-resolution failure, validateAliases ES error)
- T4: Renamed `alias-operations.unit.test.ts` → `alias-operations.integration.test.ts`
- Test counts: 2 versioned-index-resolver, 15 alias-operations, 11 lifecycle-swap-builders, 19 lifecycle-service = 47 admin tests

### T1: Delete `typeof` test in versioned-index-resolver

**File**: `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.unit.test.ts` — test 6

**Problem**: `typeof resolve === 'function'` and `typeof resolve('lessons') === 'string'` test types, not behaviour. TypeScript already enforces this.

### T2: Delete redundant tests in versioned-index-resolver

**File**: `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.unit.test.ts` — tests 1, 2, 4

**Problem**: Tests 1 and 2 are strict subsets of test 3; test 4 is a strict subset of test 5. No additional proof.

### T3: Add coverage gap tests (~7 new tests)

Add tests for:

1. **Full kind-keyed resolve** (`alias-operations`): Call `resolveCurrentAliasTargets(client, 'primary')`, verify all 6 kind keys present in result
2. **Alias-exists-no-target** (`alias-operations`): `getAlias` returns `{}`, verify `{ isAlias: true, targetIndex: null }`
3. **Ingest failure** (`lifecycle-service`): `runVersionedIngest` returns `err`, verify downstream not called
4. **Swap failure** (`lifecycle-service`): `atomicAliasSwap` returns `err` in versionedIngest, verify `writeIndexMeta` not called
5. **Rollback swap shape** (`lifecycle-service`): Verify rollback swap `toIndex` values match previous-version pattern
6. **Rollback alias-resolution failure** (`lifecycle-service`): `resolveCurrentAliasTargets` fails during rollback, verify `atomicAliasSwap` not called
7. **`validateAliases` ES error** (`lifecycle-service`): `resolveCurrentAliasTargets` fails, verify error propagation

### T4: Rename alias-operations test file

**File**: `packages/sdks/oak-search-sdk/src/admin/alias-operations.unit.test.ts`

**Problem**: Tests inject ES client mocks and test async IO functions — these are integration tests by the project taxonomy.

**Fix**: Rename to `alias-operations.integration.test.ts`.

---

## Phase 5: ADR-130 Drift Fixes (D1–D5) — DONE (code); docs remaining in Phase 7d

**Source**: docs-adr-reviewer
**Code fixes completed**: D1, D2, D4 in Phase 2; D5 code (alias-swap.sh deletion) in Phase 7. D3 and D5 doc updates deferred to Phase 7d remaining docs.

### D1: ADR claims `migrateToAliases()` exists — it doesn't — DONE (completed in Phase 2 A3)

Marked as "*(planned, not yet implemented)*" on line 43 of ADR-130.

### D2: ADR describes concurrency lock/TTL — not implemented — DONE (completed in Phase 2 A3)

Moved to "Future Safety Enhancements (not yet implemented)" subsection in ADR-130 (line 63).

### D3: ADR lists 4 CLI commands — none exist yet

**File**: `docs/architecture/architectural-decisions/130-blue-green-index-swapping.md:127-132`

**Fix**: After Phase 7 (WS5), update to reflect which commands are implemented. For now, mark them as "Planned CLI Interface" or implement them in Phase 7.

### D4: Key Files table missing 2 files — DONE (completed in Phase 2 A3)

Both `lifecycle-swap-builders.ts` and `lifecycle-cleanup.ts` added to ADR-130 key files table (lines 126–127).

### D5: `alias-swap.sh` still exists

**File**: `apps/oak-search-cli/operations/infrastructure/alias-swap.sh`

**Fix**: Delete in Phase 7 (WS5) alongside CLI wiring. Also remove:
- `admin-orchestration-commands.ts:68-70` — bash pass-through registration
- `package.json` — `elastic:alias-swap` script
- `operations/infrastructure/README.md` — alias-swap docs
- `docs/INDEXING.md` — references to `alias-swap.sh`

---

## Phase 6: Minor/TSDoc Fixes (M1–M4)

### M1: Fix `@param kind` → `@param base` — DONE (completed during Phase 2)

Already fixed in `lifecycle-swap-builders.ts`.

### M2: `previous_version` normaliser inconsistency

**Note only**: `previous_version` field in the generated ES mapping uses `oak_lower` normalizer; `version` uses plain `keyword`. Both are lowercase-only strings so there is no functional impact. Cosmetic — optionally align in a future codegen update.

### M3: Add sort invariant comment in cleanup — DONE (completed in A3)

**File**: `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts:31`

Sort invariant comment added as part of Phase 2 A3.

### M4: Remove migration mention from IndexLifecycleService TSDoc — DONE (completed in Phase 2 A4)

Migration mention already removed from `IndexLifecycleService` TSDoc.

---

## Phase 7 (WS5): CLI Commands + Alias-Swap Deletion — CODE DONE

**Completed**: 2026-03-08 (session 3)

Code work complete. New files:

- `packages/sdks/oak-search-sdk/src/admin/build-lifecycle-deps.ts` — factory `buildLifecycleDeps(client, target, logger?)` that creates `IndexLifecycleDeps` by partially applying existing SDK functions with the ES client
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` — 3 Commander commands (`versioned-ingest`, `rollback`, `validate-aliases`) using shared `createLifecycleService(cliEnv)` helper

Key implementation decisions:

- Used `buildLifecycleDeps` factory approach (partial application of SDK exports) rather than extending `SearchSdk`
- `versioned-ingest` options: `--bulk-dir` (required), `--subject-filter`, `--version`, `--min-doc-count`, `-v/--verbose`
- `buildLifecycleDeps` handles: `generateTimestampVersion`, `hasSetupError` wrapper for `createAllIndexes`, try/catch wrapper for `runIngest`, `client.count()` for `verifyDocCounts`
- Exported `buildLifecycleDeps` from SDK root (`src/index.ts`) and lifecycle types (`IndexLifecycleDeps`, `IndexLifecycleService`, `VersionedIngestOptions`, etc.)

Deletions:

- `alias-swap.sh` deleted via `git rm`
- Bash pass-through registration removed from `admin-orchestration-commands.ts`
- `elastic:alias-swap` script removed from `package.json`

### 7d remaining docs — DONE (session 4)

All 3 documentation files updated in session 4:

1. **`apps/oak-search-cli/operations/infrastructure/README.md`**: Rewritten — removed alias-swap.sh, added CLI commands, blue/green pattern, safety features
2. **`apps/oak-search-cli/docs/INDEXING.md`**: Replaced 2 alias-swap.sh references with CLI commands, added ADR-130 to related ADRs table
3. **ADR-130 CLI section (D3)**: Status → Accepted, CLI section corrected, key files table expanded

---

## Phase 7b: Documentation — DONE (session 4)

All 3 items completed:

- **7b-1**: ADR-130 updated (status → Accepted, CLI section, key files table)
- **7b-2**: Search SDK README — added "Blue/Green Index Lifecycle" section with `buildLifecycleDeps` + `createIndexLifecycleService` usage example
- **7b-3**: Root README — added "Workspace Summaries" section with tables for apps, SDKs, core, and libs

---

## Phase 8: Quality Gates + Final Reviewer Pass

### 8a: Address first-round reviewer findings (CR-1–3, ES-1–2, TR-1–3) — DONE (session 4)

All 8 session-3 reviewer findings addressed. See session 4 summary above for details.

### 8c: Address second-round reviewer findings — DONE (sessions 5-6)

Second round invoked 6 reviewers: code-reviewer, test-reviewer, elasticsearch-reviewer, docs-adr-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma. All findings addressed (see Context Summary above). Key changes:

- Compound failure propagation (W-7), rollback existence check (W-1), durationMs timing (CR-1)
- CleanupResult type with failed count (W-5)
- Error message improvements (W-6, W-8)
- Test reclassification and improvements (T-CR1, T-IMP2/3/4, CR-2)
- Boundary fixes: `createEsClient` extraction (F-W1), admin barrel reduction (F-W2)
- Dead code removal: `registerBashPassThrough` (D-CR2)
- Documentation: stale references, migration steps, TSDoc, SDK README test count

### 8d: Extract rollback/validate (max-lines fix) — PENDING

`index-lifecycle-service.ts` grew to 302 lines (limit 250) from the W-7/W-1/CR-1 changes. Extract `rollback`, `executeRollbackSwap`, `writeRollbackMeta`, `validateAliases` to `lifecycle-rollback.ts`. See "What to do next" for full instructions.

### 8b: Run full quality gates + invoke reviewers — PENDING

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm format:root && pnpm markdownlint:root
```

Then invoke at minimum:

- `code-reviewer` — gateway review of all changes
- `test-reviewer` — verify test changes (142 tests, 13 files)
- `elasticsearch-reviewer` — verify ES-related changes
- `docs-adr-reviewer` — verify all documentation updates
- `architecture-reviewer-fred` + `architecture-reviewer-wilma` — structural review

---

## Execution Order Notes

- **Phases 1–7 code**: DONE across sessions 1–3. All quality gates green.
- **Phases 7d, 7b docs + Phase 8a fixes**: DONE in session 4. 50 admin tests passing.
- **Phase 8c (second-round findings)**: DONE in sessions 5-6. 142 search SDK tests passing.
- **Next session (7)**: Fix max-lines (8d), run quality gates (8b), invoke reviewers, archive plan.

---

## Implementation Notes (from WS0–WS4 session)

These are hard-won lessons from the implementation session that will save time:

1. **ES 8.x client API**: The `@elastic/elasticsearch` v8 client takes parameters at the top level, NOT nested in `body`. E.g. `client.indices.updateAliases({ actions })` not `{ body: { actions } }`. This applies to all ES client calls written in WS5.

2. **ESLint is strict**: The monorepo enforces `max-lines: 250`, `max-lines-per-function: 50`, `complexity: 8`, `max-statements: 20`, `max-depth: 3`. Also banned: `Object.keys()`, `Object.entries()`, `as` type assertions, unsafe `any`. Plan for small, focused functions from the start.

3. **Linter expands compact `if` blocks**: Writing `if (!x.ok) {return x;}` on one line gets expanded to 3 lines by the linter. Budget for this when managing the 250-line limit — a file with 10 early-return guards loses ~20 lines to formatting.

4. **`buildIngestMeta` placeholder fields**: Beyond `duration_ms: 0` (C4), the function also hardcodes `key_stages: []` and `doc_counts: {}`. These are less actionable now (they'd need data from `IngestResult`) but are noted for future enrichment.

5. **Test command**: `pnpm vitest run packages/sdks/oak-search-sdk/src/admin/` runs all admin tests from the repo root. No absolute paths needed.

6. **sdk-codegen cardinal rule**: Any new field on `IndexMetaDoc` must go through `observability.ts` field definitions → `pnpm sdk-codegen` → generated types. Never manually edit `index-documents.ts`.

7. **No `Record<string, *>` except at genuinely unknown boundaries**: `principles.md` line 74 prohibits `Record<string, unknown>` and similar loose-key types. Where the key space is a known union (e.g. `SearchIndexKind`), use a mapped type instead. At genuine external boundaries (ES responses, file data), validate immediately with Zod or exhaustive parsing into a strict type. `Record<string, *>` propagates entropy — every downstream consumer must handle arbitrary keys.

---

## Done When

1. ~~All phases 1–8 complete with quality gates green.~~ **Phases 1–8c: DONE**
2. ~~All 55+ reviewer findings addressed (2 rounds).~~ **All findings addressed (sessions 1–6)**
3. ~~`alias-swap.sh` deleted from the codebase.~~ **DONE**
4. ~~ADR-130 accurately reflects the implementation (no drift).~~ **DONE — session 4**
5. ~~CLI commands `versioned-ingest`, `rollback`, `validate-aliases` registered and working.~~ **DONE**
6. `index-lifecycle-service.ts` under 250-line limit. **PENDING — Phase 8d**
7. Final reviewer pass produces no new critical or important findings. **PENDING — Phase 8b**

### Remaining work (2 items)

**Phase 8d** (session 7): Extract rollback/validate to `lifecycle-rollback.ts` — see "What to do next" for full instructions.

**Phase 8b** (session 7):

1. Run full quality gates: `pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm format:root && pnpm markdownlint:root`
2. Invoke final reviewers: code-reviewer, test-reviewer, elasticsearch-reviewer, docs-adr-reviewer, architecture-reviewer-fred, architecture-reviewer-wilma
3. Address any new findings
4. Archive plan
