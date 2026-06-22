---
name: "Index Lifecycle Management"
overview: >
  Close five gaps in the blue/green index lifecycle (ADR-130): add
  operator-facing CLI commands for orphan detection and targeted deletion,
  make generation cleanup alias-aware so it never deletes the rollback
  target, handle process-interruption orphans, enforce lease TTL, and
  harden the renewal loop against transient ES errors.
todos:
  - id: lease-renewal-resilience
    content: "Commit uncommitted fixes: startRenewalLoop transient recovery, withLifecycleLease execution-result preservation, renewalInFlight guard."
    status: complete
  - id: cli-delete-version
    content: "Add `admin delete-version <version>` CLI command exposing cleanupOrphanedIndexes."
    status: complete
  - id: cli-list-orphans
    content: "Add `admin list-orphans` CLI command that identifies indexes not pointed to by any alias and not the metadata previous_version."
    status: complete
  - id: cli-cleanup-orphans
    content: "Add `admin cleanup-orphans` CLI command that lists then deletes orphaned indexes (with --dry-run default)."
    status: complete
  - id: alias-aware-cleanup
    content: "Make cleanupOldGenerations alias-aware: skip deletion of the metadata previous_version."
    status: complete
  - id: stage-interruption-safety
    content: "Add pre-stage orphan check: before creating new indexes, detect and warn about existing staged-but-unpromoted versions."
    status: complete
  - id: lease-ttl-enforcement
    content: "Make acquireLease check expires_at before failing with 409; add admin release-lease CLI command."
    status: complete
  - id: tests
    content: "TDD for all new SDK functions and CLI commands."
    status: complete
  - id: docs-and-adr
    content: "Update ADR-130, INDEXING.md, and CLI README with new commands and lifecycle semantics."
    status: complete
---

# Index Lifecycle Management

**Status**: Complete (all phases implemented and tested)
**Scope**: CLI commands and SDK fixes for cohesive index lifecycle management
**Branch**: `feat/es_index_update`
**Priority**: P0 for Phase 6a (blocks reliable ingest), P1 for remaining phases

## Problem Statement

The blue/green index lifecycle (ADR-130) handles the happy path well:
`stage` creates versioned indexes, `promote` swaps aliases and cleans up
old generations, `rollback` reverts using metadata. However, five gaps
were discovered during the 2026-03-23 and 2026-03-24 incidents:

### Gap 1: No operator command for targeted index deletion

The SDK has `cleanupOrphanedIndexes(deps, version)` and
`deleteVersionedIndex(indexName)` internally, but neither is exposed via
CLI. The only deletion commands are:

- `setup --reset` — nuclear, deletes all curriculum indexes plus `oak_meta`
- Implicit cleanup inside `promote` and `versioned-ingest`

When a `stage` is interrupted by process termination, operators have no
CLI command to delete the partial indexes. The 2026-03-23 incident
required a one-off script using the raw ES client.

### Gap 2: Generation cleanup is not alias-aware

`cleanupOldGenerations` sorts all versioned index names lexicographically
and keeps the newest `MAX_GENERATIONS` (2). It does not consult metadata
or alias state. This creates a hazard when orphaned indexes exist:

```
Cluster state:  v2026-03-15 (rollback), v2026-03-21 (live), v2026-03-23 (orphan)
After staging:  + v2026-03-24
After promote cleanup:
  sorted = [v15, v21, v23, v24]
  keep newest 2 = [v23, v24]
  DELETE = [v15, v21]  ← v21 is live/rollback target!
```

The orphan (`v23`) makes cleanup delete the actual rollback target (`v21`)
while preserving the broken orphan. Rollback would then fail because the
target indexes no longer exist.

### Gap 3: Process interruption leaves untracked orphans

`cleanupOrphanedIndexes` runs on `stage` **failure** (within the same
process). If the process is killed externally (SIGKILL, network drop,
terminal closed, laptop sleep), the partial indexes persist with no
record that they need cleanup. Nothing detects or reports them.

### Gap 4: Lifecycle lease TTL is decorative — RESOLVED

> **Status**: Fixed and committed on `feat/es_index_update`.

The `acquireLease` function stored an `expires_at` timestamp but never
checked it. The 2026-03-23 incident left a lease that "expired" at 12:52
but still blocked new operations 20+ hours later.

**Fixes committed**:

- `acquireLease` now reads the existing document on 409 and supersedes
  expired leases via `supersedeExpiredLease` (OCC-safe)
- `renewLease` retries on OCC 409 via `retryRenewalAfterOccConflict`
  (handles ES Serverless shard relocations)
- `forceReleaseLease` and `inspectLease` SDK functions added
- `admin release-lease` and `admin inspect-lease` CLI commands added

### Gap 5: Renewal loop is fragile during long operations — PARTIALLY RESOLVED

> **Status**: Fix written and tested but **uncommitted** on `feat/es_index_update`.

The `startRenewalLoop` in `lifecycle-lease.ts` had three defects:

1. **Latching failure flag**: Once a renewal failed (even transiently),
   `failure` was set and never cleared on subsequent successful renewals.
   Over a 36-minute ingest with 60-second renewal intervals, a single
   transient 503 permanently poisoned the renewal state.

2. **Interval stopped on first failure**: `clearInterval(interval)` was
   called on any renewal failure, preventing recovery even if the next
   renewal would have succeeded.

3. **No concurrent-renewal guard**: Without a `renewalInFlight` flag,
   overlapping renewal attempts could cause self-inflicted OCC conflicts.

Additionally, `withLifecycleLease` discarded successful execution results
when a renewal failure was detected — a 36-minute stage could complete
all 16,443 documents and be reported as "failed" because of a transient
503 during a renewal.

**Fixes written (uncommitted)**:

- `startRenewalLoop`: added `renewalInFlight` guard, removed
  `clearInterval` on failure, added `failure = null` on successful
  renewal
- `withLifecycleLease`: returns execution result when execution succeeds
  regardless of renewal failure state
- `forceReleaseLease` / `inspectLease` re-exported from SDK surface
- 3 new/updated integration tests (21 total, all passing)

**Files** (uncommitted, 8 files, ~420 lines):

- `packages/sdks/oak-search-sdk/src/admin/lifecycle-lease.ts`
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-lease.integration.test.ts`
- `packages/sdks/oak-search-sdk/src/admin/index.ts`
- `packages/sdks/oak-search-sdk/src/admin.ts`
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-alias-commands.ts`
- `apps/oak-search-cli/src/cli/admin/index.ts`
- `apps/oak-search-cli/README.md`

## Existing Infrastructure

| Layer | What exists | File |
|-------|------------|------|
| SDK cleanup | `cleanupOldGenerations`, `cleanupOrphanedIndexes` | `lifecycle-cleanup.ts` |
| SDK deps | `listVersionedIndexes`, `deleteVersionedIndex` | `build-lifecycle-deps.ts` |
| SDK lifecycle | `stage`, `promote`, `rollback`, `validateAliases` | `index-lifecycle-service.ts`, `lifecycle-promote.ts` |
| SDK meta | `readIndexMeta`, `writeIndexMeta` | wired through deps |
| SDK lease | `acquireLease` (with TTL supersession), `renewLease` (with OCC retry), `releaseLease`, `forceReleaseLease`, `inspectLease` | `lifecycle-lease-infra.ts` |
| SDK lease wrapper | `withLifecycleLease`, `startRenewalLoop` | `lifecycle-lease.ts` |
| CLI | `admin stage`, `promote`, `rollback`, `validate-aliases`, `count`, `meta`, `setup --reset`, `inspect-lease`, `release-lease` | `admin-lifecycle-*.ts` |

The SDK has all the building blocks. The remaining work is: committing
the renewal-loop fix, exposing deletion commands via CLI, fixing the
cleanup logic, and adding orphan detection.

## Execution Phases

### Phase 1: CLI `admin delete-version` (SDK exists, expose via CLI)

**RED**: Write integration test asserting the CLI command deletes all 6
indexes for a given version and reports success/failure per index.

**GREEN**: Register `admin delete-version <version>` command that:
1. Creates ES client from validated env
2. Calls `cleanupOrphanedIndexes(deps, version)` (already exists in SDK)
3. Reports per-index success/failure
4. Exits non-zero if any deletion fails

**REFACTOR**: Extract shared `withEsClientAndDeps` pattern used by other
lifecycle commands.

**Files**:
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` (register)
- Test file alongside existing lifecycle command tests

### Phase 2: SDK orphan detection + CLI `admin list-orphans`

**RED**: Write unit test for `identifyOrphanedVersions(aliasTargets,
metaPreviousVersion, allVersionedIndexes)` — must return versions that
are not alias targets and not the metadata `previous_version`.

**GREEN**: Implement `identifyOrphanedVersions` as a pure function in
`lifecycle-cleanup.ts`. Wire into CLI as `admin list-orphans`:
1. Resolve current alias targets
2. Read metadata for `previous_version`
3. List all versioned indexes
4. Report orphaned versions with their doc counts

**Files**:
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts` (new function)
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts` (register)
- Unit + integration tests

### Phase 3: CLI `admin cleanup-orphans`

**RED**: Write test asserting `cleanup-orphans --dry-run` lists but does
not delete, and without `--dry-run` it deletes all orphaned versions.

**GREEN**: Register `admin cleanup-orphans` command that:
1. Calls `identifyOrphanedVersions` from Phase 2
2. With `--dry-run` (default): prints what would be deleted, exits 0
3. With `--confirm`: deletes orphaned versions, reports results

**Files**:
- `apps/oak-search-cli/src/cli/admin/admin-lifecycle-commands.ts`
- Tests

### Phase 4: Make `cleanupOldGenerations` alias-aware

**RED**: Write test where 4 versions exist (including an orphan newer
than the rollback target). Assert cleanup does NOT delete the metadata
`previous_version`, even though it is not in the newest N.

**GREEN**: Modify `cleanupOldGenerations` to:
1. Accept `protectedVersion: string | null` parameter (metadata
   `previous_version`)
2. Filter `toDelete` to exclude the protected version
3. Optionally also exclude versions that are current alias targets

**REFACTOR**: Update all callers (`versionedIngest`, `promote`) to pass
the protected version from metadata.

**Files**:
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-cleanup.ts`
- `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts`
- `packages/sdks/oak-search-sdk/src/admin/lifecycle-promote.ts`
- Unit + integration tests

### Phase 5: Pre-stage orphan warning

**RED**: Write test asserting that `stage` warns (but does not block)
when existing staged-but-unpromoted versions are detected.

**GREEN**: Before creating new versioned indexes, `stage` calls
`identifyOrphanedVersions`. If orphans exist, log a warning with the
orphaned version strings and their doc counts. Do not block — the
operator may intend to replace them.

**Files**:
- `packages/sdks/oak-search-sdk/src/admin/index-lifecycle-service.ts`
- Tests

### Phase 6: Lease TTL enforcement and release command — COMPLETE

All items delivered and committed on `feat/es_index_update`:

- `supersedeExpiredLease` in `lifecycle-lease-infra.ts`: reads existing
  document on 409, checks `expires_at`, atomically replaces via OCC
- `retryRenewalAfterOccConflict`: reads document on renewal 409,
  verifies `run_id` ownership, retries with fresh seq_no/primary_term
- `forceReleaseLease`, `inspectLease` SDK functions
- `admin release-lease`, `admin inspect-lease` CLI commands
- 10 unit tests in `lifecycle-lease-infra.unit.test.ts`

### Phase 6a: Renewal loop resilience — UNCOMMITTED

The 2026-03-24 re-ingest exposed that Phase 6's infra-layer fixes are
necessary but not sufficient. The wrapper layer (`lifecycle-lease.ts`)
has its own defects that must be committed.

**What's done** (code written, 21 tests passing, uncommitted):

1. `startRenewalLoop`: `renewalInFlight` guard prevents concurrent
   renewals; interval not stopped on failure (allows retry); `failure`
   cleared on successful renewal (transient recovery)
2. `withLifecycleLease`: execution success takes priority over renewal
   failure — stale lease cleaned up by TTL enforcement on next operation
3. Re-exports of `forceReleaseLease`, `inspectLease`, `LeaseStatus`
   from SDK admin surface

**What remains**: commit these changes.

### Phase 7: Documentation

1. Update ADR-130 with:
   - Orphan detection and cleanup semantics
   - Protected-version policy in generation cleanup
   - New CLI commands
2. Update `apps/oak-search-cli/docs/INDEXING.md` with:
   - Orphan cleanup operator instructions
   - Interrupted-stage recovery procedure
3. Update `apps/oak-search-cli/README.md` command table

## Quality Gates

Per-task: `pnpm type-check && pnpm lint:fix && pnpm test`

Per-phase:
```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

## Reviewer Gates

After Phase 4 (SDK changes):
- `architecture-reviewer-barney` (boundary implications)
- `test-reviewer` (TDD compliance)
- `code-reviewer` (gateway)

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| `admin delete-version` used accidentally on live version | Validate against current alias targets before deletion; refuse if the version is currently live |
| `cleanupOldGenerations` change breaks existing promote flow | TDD — existing tests must continue to pass with the new parameter defaulting to `null` |
| Orphan detection false positives during active stage | Detection uses alias + metadata state; an active stage that hasn't promoted is correctly identified as "staged but unpromoted", not an error |

## Incident Context

### Incident 1: 2026-03-23 — interrupted stage, stale lease

Three generations of physical indexes existed: `v2026-03-15-134856`
(old stale), `v2026-03-21-175903` (live via aliases), and
`v2026-03-23-122323` (interrupted stage — 8,551/12,746 lessons, 0
threads, 0 sequences, 0 facets). The orphaned v2026-03-23 indexes were
deleted via a one-off script before re-staging.

The interrupted stage left a stale lifecycle lease in
`oak_lifecycle_leases` (acquired 2026-03-23T12:50, expired 12:52,
holder PID 22785). Despite the `expires_at` being 20+ hours in the
past, the next `admin stage` attempt on 2026-03-24 was blocked because
`acquireLease` did not check `expires_at`. The lease was manually
released via ES API delete.

**Resolution**: Orphaned indexes deleted by one-off script. Stale lease
deleted manually. Phase 6 fixes (committed) prevent recurrence of the
lease issue. Phases 1-3 (pending) will provide proper CLI commands for
orphan management.

### Incident 2: 2026-03-24 — successful stage falsely reported as failed

After clearing the stale lease and orphaned indexes, `admin stage` ran
successfully: 16,443 documents uploaded across all 6 index kinds
(12,391 lessons, 1,634 units, 1,634 rollups, 30 sequences, 57 facets,
164 threads), duration 2,171 seconds (~36 minutes). The stage function
logged "Stage complete — indexes ready for promotion" and returned
`ok(stageResult)`.

However, `withLifecycleLease` reported the operation as **failed** with
"es_error: Lifecycle lease renewal failed. Halting operation." The root
cause was a transient non-409 error during one of the ~36 lease renewal
attempts. The `startRenewalLoop` latched the failure permanently
(never cleared on subsequent successful renewals, stopped the interval
on first failure), and `withLifecycleLease` discarded the successful
execution result in favour of the renewal error.

The stale lease was cleared manually a second time. The staged indexes
were verified as complete and promoted to live via `admin promote
--target-version v2026-03-24-091112`. All aliases now point to the
new version with 15,910 total documents.

**Resolution**: Lease cleared manually, promotion completed. Phase 6a
fixes (written, tested, uncommitted) prevent recurrence by making the
renewal loop resilient to transient failures and preserving successful
execution results.

### Summary of manual interventions required

| Action | How it was done | What should exist |
|--------|----------------|-------------------|
| Delete orphaned `v2026-03-23` indexes (6) | One-off `tsx` script | `admin delete-version` (Phase 1) |
| Release stale lease (twice) | One-off `tsx` script / ES API | `admin release-lease` (Phase 6 — done) |
| Verify staged data completeness | Direct ES count queries | `admin count` (exists) |
| Promote after false failure | `admin promote` (exists) | Would not be needed after Phase 6a |
