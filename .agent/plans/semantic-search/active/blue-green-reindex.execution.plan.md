---
name: "Blue/Green Reindex — First Live Run"
overview: >
  Stage versioned indexes using the new blue/green infrastructure (ADR-130),
  validate offline, then promote to live. This is the first use of the
  stage/promote workflow and will migrate the existing bare indexes to
  alias-backed indexes. All code prerequisites are complete and merged.
  Bulk data is already downloaded.
todos:
  - id: migration-fix
    content: "Add remove_index support to atomicAliasSwap for bare-index migration."
    status: completed
  - id: reviewer-fixes
    content: "Fix 2 remaining type errors from reviewer-mandated changes and run quality gates."
    status: completed
  - id: preflight
    content: "Verify environment, cluster health, and current index state."
    status: pending
  - id: stage
    content: "Stage versioned indexes (create, ingest, verify) without promoting."
    status: pending
  - id: validate
    content: "Inspect staged indexes before promoting."
    status: pending
  - id: promote
    content: "Promote staged version to live (atomic alias swap with migration)."
    status: pending
  - id: verify
    content: "Verify live service is healthy after promotion."
    status: pending
isProject: false
---

# Blue/Green Reindex — First Live Run

## Session Entry Point

This plan is standalone-ready. A new session should:

1. Run `/jc-start-right-quick` to ground
2. Read this plan
3. Begin at [Task 1: Preflight](#1-preflight)

All code prerequisites are complete — this session is purely operational
(CLI commands, validation, decision gates). No code changes expected.

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

- [ADR-130](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md) — Blue/green design
- [INDEXING.md](../../../../apps/oak-search-cli/docs/INDEXING.md) — Ingestion field expectations
- [high-level plan](../../high-level-plan.md) — Strategic context (step 2 of immediate intentions)

### Key Files

- `apps/oak-search-cli/` — CLI that runs stage/promote/rollback commands
- `packages/sdks/oak-search-sdk/src/admin/` — Lifecycle service, alias operations, swap builders
- `apps/oak-search-cli/bulk-downloads/` — Pre-downloaded bulk data

## Non-Goals

- Changing mappings or analysers (use existing SDK-generated mappings)
- Adding new indexes beyond the 6 curriculum indexes
- Modifying the ingestion pipeline code
- Running ground truth benchmarks (separate follow-up if needed)

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

### Deferred Follow-ups (not blocking)

- Verify `remove_index` works on Elastic Serverless before first live
  deployment (manual smoke test with throwaway index recommended)
- Consider narrowing `Client` to a typed sub-interface to eliminate
  `as unknown as Client` in tests (architectural boundary change, pre-existing)

---

## Tasks

### 1. Preflight

Verify the environment is ready.

```bash
cd apps/oak-search-cli

# Confirm required env vars are set
env | grep -E '^(ELASTICSEARCH_URL|ELASTICSEARCH_API_KEY|OAK_API_KEY)=' | wc -l
# Expected: 3

# Check cluster health
pnpm oaksearch admin status

# Check current alias state (expect bare indexes, no aliases yet)
pnpm oaksearch admin validate-aliases
```

**Expected state**: 6 bare concrete indexes, no aliases. `validate-aliases`
should report all unhealthy (bare indexes, not aliases).

**Decision gate**: If the cluster is unhealthy or unreachable, stop.

### 2. Stage Versioned Indexes

```bash
cd apps/oak-search-cli
pnpm oaksearch admin stage --bulk-dir ./bulk-downloads --verbose
```

This creates 6 new versioned indexes (e.g. `oak_lessons_v2026-03-08-...`),
ingests all bulk data, and verifies document counts — but does **not** touch
aliases or the live service. Reads continue to hit the existing bare indexes.

**Output**: A version string like `v2026-03-08-143022`. Note it — needed for
promote.

**No dry-run needed**: Stage itself is the safe pre-production step. It only
creates new versioned indexes (different names from the bare ones) and
populates them. The live service is completely untouched.

**Decision gate**: If staging fails (creation, ingest, or verification error),
diagnose and re-run. Staged indexes from failed runs are harmless — they'll be
cleaned up by the next successful promote.

### 3. Validate Staged Indexes

Before promoting, inspect the staged indexes.

```bash
pnpm oaksearch admin status
```

Eyeball the doc counts. They should be non-trivial across all 6 versioned
indexes. Compare against the current bare index doc counts.

**Decision gate**: If counts look wrong or any index is empty, investigate
before promoting. The staged indexes are offline — there's no rush.

### 4. Promote

```bash
cd apps/oak-search-cli
pnpm oaksearch admin promote --version <version>
```

This atomically:

1. Removes the 6 bare concrete indexes via `remove_index` (first-run only)
2. Creates 6 aliases pointing to the staged versioned indexes
3. Writes metadata to `oak_meta` (version + previous_version for rollback)
4. Cleans up old index generations (keeps current + previous)

All actions happen in a single `POST /_aliases` request — either all succeed
or none do.

### 5. Verify

```bash
# Aliases should now be healthy
pnpm oaksearch admin validate-aliases

# Cluster status should show versioned indexes behind aliases
pnpm oaksearch admin status
```

Smoke test the live service:

```bash
pnpm oaksearch search lessons "photosynthesis"
pnpm oaksearch search units "fractions"
```

If the MCP server is running, confirm it still resolves queries (it uses alias
names — no config change needed).

**Decision gate**: If search results are wrong or the service is degraded,
roll back immediately (`pnpm oaksearch admin rollback`).

---

## Done When

1. All 6 curriculum aliases point to versioned indexes
2. `validate-aliases` reports all healthy
3. Search queries return current results (stale data issues cleared)
4. `oak_meta` records the current version with a rollback target
5. Old bare indexes have been removed
