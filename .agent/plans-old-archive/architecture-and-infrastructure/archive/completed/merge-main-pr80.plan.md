# Merge Plan: main (PR #80) into feat/otel_sentry_enhancements

## Context

Branch `feat/otel_sentry_enhancements` must integrate `main` which
received PR #80 (`c59af2cd` — quality gate hardening: knip and
depcruise to blocking). PR #80 is a large change (MCP protocol type
extraction, 49 dead file deletions in search-cli via knip,
dependency-cruiser enforcement, ground-truth pipeline changes).

Our branch has Search CLI observability adoption + Sentry canonical
alignment plan. 7 merge conflicts identified via `git merge-tree`.

## Divergence Scale (Phase 1)

- Merge base: `f0046db9`
- Commits on main since fork: **1** (`c59af2cd`)
- Commits ahead of main: **19**
- Files changed on both sides: **22** (intersection)
- ADR/plan number collisions: **none**
- Deleted files on main (search-cli): **49**
- Deleted-file import cascade from our branch: **none** (verified
  all 49 — no surviving imports from our modified files)

## Conflict Analysis

| # | File | Cause | Risk | Resolution |
|---|------|-------|------|------------|
| 1 | `apps/oak-search-cli/src/lib/logger.ts` | Main deleted `setLogLevel`, `getLogLevel`, `enableFileSink`, `getFileSinkPath`, `suggestLogger` (knip dead code). Our branch added `registerAdditionalSink`, `clearAdditionalSinks`, `additionalSinks`, `LogSink` import. | **Medium** — must rebase our additions onto main's slimmer version | Take main's deletions + apply our additions. Verify `LogSink` import, `additionalSinks` state, and `getLoggers()` sink array change survive. |
| 2 | `.agent/memory/napkin.md` | Both branches added entries | **Low** | Concatenate both sets of entries |
| 3 | `.agent/prompts/session-continuation.prompt.md` | Both updated contract | **Low** | Take ours (more current) then verify no PR #80 workstream info lost |
| 4 | `.cursor/hooks/state/continual-learning-index.json` | Cursor state | **None** | Take main |
| 5 | `.cursor/hooks/state/continual-learning.json` | Cursor state | **None** | Take main |
| 6 | `AGENTS.md` | Both added content | **Low** | Merge text — both additions are independent |
| 7 | `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/index.ts` | PR #80 refactored | **Low** | Our branch didn't modify this file; take main |

## Hazard Analysis

### Deleted-file import cascades

PR #80 deleted files our branch still has on disk:

- `apps/oak-search-cli/src/lib/elasticsearch/setup/cli.ts` — imports
  `setLogLevel` from `logger.ts` (deleted on main)
- `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest.ts` — imports
  `setLogLevel`, `enableFileSink` from `logger.ts` (deleted on main)

**Risk**: None. These files were deleted by knip on main. After merge
they'll be gone. Our branch doesn't import from them.

### Signature mismatches

Our `logger.ts` changes add new exports (`registerAdditionalSink`,
`clearAdditionalSinks`) and a new import (`type LogSink`). Main's
version doesn't have these. After conflict resolution, we need to
verify:

- `oaksearch.ts` imports `registerAdditionalSink`, `clearAdditionalSinks`
  from `logger.ts` — must still resolve
- `logger.integration.test.ts` imports the same — must still resolve
- `LogSink` type import from `@oaknational/logger` — must exist

### knip compliance

Our new files must pass knip. New exports that are only used internally
(test helpers, barrel re-exports) could trigger knip violations.

Files to check:

- `src/observability/index.ts` — barrel, all exports must be consumed
- `src/observability/cli-observability.ts` — all exports must be consumed
- `src/observability/cli-observability-error.ts` — consumed via barrel
- `src/lib/logger.ts` — new exports must be consumed

### dependency-cruiser compliance

PR #80 added dependency-cruiser as blocking. Our new `src/observability/`
directory introduces new import paths. Verify no circular deps or
boundary violations.

## Execution Steps

### Step 1 — Merge main into branch

```bash
git merge origin/main --no-edit
```

Expect 7 conflicts. Do NOT use `--no-commit` — let Git auto-merge what
it can, then resolve the 7 conflicts manually.

### Step 2 — Resolve conflicts (ordered by risk)

**2a. `logger.ts` (medium risk)**

Start from main's version. Re-apply our 4 changes:

1. Add `type LogSink` to the `@oaknational/logger` import
2. Add `let additionalSinks: readonly LogSink[] = []` after
   `activeFileSink`
3. Spread `...additionalSinks` into the `sinks` array in `getLoggers()`
4. Add `registerAdditionalSink()` and `clearAdditionalSinks()` functions

Main removed `suggestLogger` — do NOT re-add it (knip found it dead).
Main made `currentLevel` a `const` — keep it const.
Main removed `setLogLevel`, `getLogLevel`, `enableFileSink`,
`getFileSinkPath` — do NOT re-add them.

**2b. `oauth-proxy/index.ts` (low risk)**

Take main's version entirely. Our branch never touched this file.

**2c. `AGENTS.md` (low risk)**

Merge both additions. Check for duplicate sections.

**2d. `napkin.md` (low risk)**

Keep both sets of entries. Main's entries go before ours
chronologically.

**2e. `session-continuation.prompt.md` (low risk)**

Take our version (more current). Check if PR #80 added any workstream
info that should be preserved.

**2f. Cursor state files (no risk)**

Take main's versions for both `.cursor/hooks/state/` files.

### Step 3 — Immediate post-merge verification

```bash
pnpm install                    # lockfile may have changed
pnpm --filter @oaknational/search-cli type-check
pnpm --filter @oaknational/search-cli test
pnpm --filter @oaknational/search-cli lint:fix
```

This catches silent breaks: deleted imports, signature mismatches,
missing exports.

### Step 4 — knip and depcruise compliance

```bash
pnpm knip                       # new from PR #80
pnpm depcruise                  # new from PR #80
```

Fix any violations from our new files before proceeding.

### Step 5 — Full monorepo gate

```bash
pnpm check
```

Must pass 88/88 (or whatever the new count is after PR #80).

### Step 6 — Commit

If `pnpm check` passes, the merge commit is already created (from
step 1). If fixes were needed, commit them separately.

## Acceptance Criteria

- [ ] All 7 conflicts resolved
- [ ] `logger.ts` has main's deletions + our additions
- [ ] `suggestLogger` NOT re-added (knip dead)
- [ ] `pnpm type-check` passes for search-cli
- [ ] `pnpm test` passes for search-cli (count may differ from 999 due to knip deletions)
- [ ] `pnpm knip` passes (no unused exports)
- [ ] `pnpm depcruise` passes (no boundary violations)
- [ ] `pnpm check` passes (full monorepo gate)
- [ ] No files from our branch import deleted modules
