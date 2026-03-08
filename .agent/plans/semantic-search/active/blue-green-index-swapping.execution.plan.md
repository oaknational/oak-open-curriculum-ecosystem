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
    status: pending
  - id: phase-4-tests
    content: "Phase 4: Test fixes and coverage gaps (T1–T4) from test-reviewer"
    status: pending
  - id: phase-5-adr-drift
    content: "Phase 5: ADR-130 drift fixes (D1–D5) from docs-adr-reviewer"
    status: pending
  - id: phase-6-minor
    content: "Phase 6: Minor/TSDoc fixes (M1–M4)"
    status: pending
  - id: phase-7-ws5-cli
    content: "Phase 7 (WS5): CLI commands, alias-swap.sh deletion"
    status: pending
  - id: phase-7b-docs
    content: "Phase 7b: Documentation — update ADR-130, search SDK README, root README (blue-green as search CLI feature)"
    status: pending
  - id: phase-8-gates-review
    content: "Phase 8: Quality gates + final reviewer pass"
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

All gates must pass before starting any phase. They passed as of 2026-03-08 (43 admin tests, 132 total search SDK tests, full monorepo green).

### Context Summary

WS0–WS4 of ADR-130 are complete. Six specialist reviewers were invoked (code-reviewer, elasticsearch-reviewer, test-reviewer, type-reviewer, architecture-reviewer-betty, docs-adr-reviewer). Their unified findings produced ~30 action items, organised below into 8 phases.

**Progress as of 2026-03-08**: Phases 1–2 DONE. Several items from Phases 5–6 also completed early (D1, D2, D4, M1, M3, M4). Next up: Phase 3 (ES performance). D3, D5, M2 remain pending. All quality gates green (0 lint errors, 43 admin tests, 132 SDK tests).

**Key files**:

| File | Purpose |
|------|---------|
| `packages/sdks/oak-search-sdk/src/admin/alias-operations.ts` | ES alias operations (atomic swap, resolve targets) |
| `packages/sdks/oak-search-sdk/src/internal/index-resolver.ts` | Index name resolution (shared helpers: `resolveAliasName`, `resolveVersionedIndexName`, `TARGET_SUFFIXES`) |
| `packages/sdks/oak-search-sdk/src/admin/versioned-index-resolver.ts` | Versioned index name factory (uses shared helpers) |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-swap-builders.ts` | Pure functions for building swap action arrays |
| `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts` | Old generation cleanup |
| `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts` | Orchestration service |
| `packages/sdks/oak-search-sdk/src/types/index-lifecycle-types.ts` | DI interface, service types |
| `packages/sdks/oak-search-sdk/src/admin/index.ts` | Admin barrel exports |
| `packages/sdks/oak-search-sdk/src/index.ts` | SDK root barrel |
| `apps/oak-search-cli/src/cli/admin/admin-orchestration-commands.ts` | CLI admin commands (bash pass-throughs) |
| `apps/oak-search-cli/operations/infrastructure/alias-swap.sh` | Bash alias swap (TO BE DELETED) |

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

## Phase 3: ES Performance Improvements (E1–E3)

**Source**: elasticsearch-reviewer

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

## Phase 4: Test Fixes and Coverage Gaps (T1–T4)

**Source**: test-reviewer

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

## Phase 5: ADR-130 Drift Fixes (D1–D5)

**Source**: docs-adr-reviewer

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

## Phase 7 (WS5): CLI Commands + Alias-Swap Deletion

### 7a: Wire `admin versioned-ingest` CLI command

**File**: `apps/oak-search-cli/src/cli/admin/admin-sdk-commands.ts`

Register a new Commander command that:
1. Accepts `--bulk-dir`, `--subject-filter`, `--version`, `--min-doc-count`, `--verbose`
2. Creates `IndexLifecycleDeps` by wiring existing admin service methods
3. Calls `createIndexLifecycleService(deps).versionedIngest(options)`
4. Prints result or error

### 7b: Wire `admin rollback` CLI command

Same file. No arguments needed. Calls `service.rollback()`.

### 7c: Wire `admin validate-aliases` CLI command

Same file. No arguments. Calls `service.validateAliases()`. Prints health table.

### 7d: Delete `alias-swap.sh` and all references

Delete:
- `apps/oak-search-cli/operations/infrastructure/alias-swap.sh`
- Registration in `admin-orchestration-commands.ts:68-70`
- `package.json` `elastic:alias-swap` script
- References in `operations/infrastructure/README.md`
- References in `docs/INDEXING.md`

### 7e: Update ADR-130 CLI section

After implementing 7a-7c, update ADR-130 lines 127-132 to reflect the implemented commands (removing `migrate-aliases` for now).

---

## Phase 7b: Documentation

### 7b-1: Update ADR-130

Ensure ADR-130 accurately reflects the final implementation after all code phases. This overlaps with D1–D5 but is the final pass.

### 7b-2: Update search SDK README

Add a section covering blue-green index lifecycle management: what it is, how to use `createIndexLifecycleService`, and the `versionedIngest` / `rollback` / `validateAliases` API.

### 7b-3: Update root README — workspace summaries and feature callout

Restructure the root README to include:

- **One-line summary** per workspace in a table or list
- **A few lines** per `apps/` workspace describing purpose and key features:
  - `oak-curriculum-mcp-streamable-http` — main MCP server (Streamable HTTP transport)
  - `oak-curriculum-mcp-stdio` — **DEPRECATED**: mark as deprecated, to be replaced with stdio adapter in main MCP server
  - `oak-search-cli` — search CLI with admin, ingest, and blue-green lifecycle commands
- **A few lines** per `packages/sdks/` workspace:
  - `oak-curriculum-sdk` — curriculum API SDK
  - `oak-search-sdk` — search SDK with retrieval, admin, observability, and blue-green index lifecycle
  - `oak-sdk-codegen` — schema-driven type generation from OpenAPI + ES mappings
- Call out blue-green index swapping as a feature of the search SDK and CLI

---

## Phase 8: Quality Gates + Final Reviewer Pass

### 8a: Run full quality gates

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm format:root && pnpm markdownlint:root
```

### 8b: Invoke specialist reviewers

At minimum re-invoke:
- `code-reviewer` — verify C1–C7 resolved
- `test-reviewer` — verify T1–T4 resolved
- `elasticsearch-reviewer` — verify E1–E3 resolved

---

## Execution Order Notes

- **Phases 1–6** can be done in a single session. They are fixes to existing code and don't introduce new features.
- **Phase 7** (WS5) is the remaining feature work. It depends on C6 (factory export) being done first.
- **Phase 8** must be last.
- Within each phase, tasks are independent unless noted. Work top-to-bottom.
- After each phase, run `pnpm type-check && pnpm --filter @oaknational/oak-search-sdk lint:fix && pnpm vitest run packages/sdks/oak-search-sdk/src/admin/` to catch regressions early.

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

1. All phases 1–8 complete with quality gates green.
2. All 30+ reviewer findings addressed.
3. `alias-swap.sh` deleted from the codebase.
4. ADR-130 accurately reflects the implementation (no drift).
5. CLI commands `versioned-ingest`, `rollback`, `validate-aliases` registered and working.
6. Final reviewer pass produces no new critical or important findings.
