---
name: "CI Green for Merge"
overview: "Fix the immediate CI failures blocking PR #70 merge to main. Strictly within existing rules — no new workspaces, no compatibility layers."
todos:
  - id: turbo-cache-invalidation
    content: "Fix Turbo build cache: add package.json to build task inputs so subpath export changes invalidate the cache."
    status: pending
  - id: search-cli-type-errors
    content: "Fix search-cli type-check failures: missing sdk-codegen subpath modules (/search, /bulk, /synonyms, /api-schema)."
    status: pending
  - id: delete-process-spawning-e2e
    content: "Delete remaining process-spawning E2E tests (benchmark-cli.e2e.test.ts, bulk-retry-cli.e2e.test.ts) that violate testing-strategy.md."
    status: pending
  - id: verify-ci-green
    content: "Push and confirm CI passes on PR #70."
    status: pending
---

# CI Green for Merge

**Created**: 2026-03-30
**Status**: ACTIVE — blocking merge to main
**Scope**: Fix CI failures on PR #70 only. No new workspaces, no
architectural changes — those go in sibling plans.

## Current CI Failures (run #23738170829)

5 failing tasks, all trace to one root cause:

| Task | Failure |
|---|---|
| `search-cli#type-check` | Cannot find `@oaknational/sdk-codegen/search`, `/bulk`, `/synonyms` |
| `search-cli#lint` | Same missing modules |
| `search-cli#test` | Same |
| `search-cli#test:e2e` | `cli-exit.e2e.test.ts` (already deleted locally) |
| `streamable-http#smoke:dev:stub` | Stale `sdk-codegen/dist/api-schema.js` |

## Root Cause: Turbo Remote Cache Poisoning

Turbo remote cache restored stale `sdk-codegen` build outputs that
don't contain the current subpath exports. The `build` task's inputs
in `turbo.json` don't include `package.json`, so changes to the
exports map don't invalidate the cache.

## Fix 1: Turbo Cache Invalidation

Add `package.json` to the generic `build` task inputs in `turbo.json`.
This ensures any change to subpath exports, dependencies, or scripts
invalidates the build cache:

```json
"build": {
  "inputs": [
    "$TURBO_DEFAULT$",
    "$TURBO_ROOT$/tsconfig.base.json",
    "package.json",
    "tsconfig.json",
    ...
  ]
}
```

**Cache busting mechanism**: `$TURBO_DEFAULT$` includes `turbo.json`
itself. Editing `turbo.json` changes the cache key for every task,
which busts the stale remote cache on the next CI run. No separate
cache-clear step is needed.

## Fix 2: Search-CLI Type Errors

The type errors are a consequence of the stale cache — once Fix 1
busts the cache, `sdk-codegen` will rebuild fresh and produce the
correct `dist/` with all subpath exports. The search-cli errors
resolve automatically.

If the errors persist after cache bust, investigate whether
`search-cli` needs an explicit workspace dependency on `sdk-codegen`
in `pnpm-workspace.yaml` or a `turbo.json` override.

## Fix 3: Delete Process-Spawning E2E Tests

Two remaining files violate the testing-strategy.md rule against
process spawning in tests:

- `apps/oak-search-cli/e2e-tests/benchmark-cli.e2e.test.ts` — spawns
  `npx tsx` to test benchmark CLI output
- `apps/oak-search-cli/e2e-tests/bulk-retry-cli.e2e.test.ts` — spawns
  `pnpm exec tsx` to test admin CLI surface

Both test commander's `--help` output and argument parsing — behaviour
owned by commander, not our product code. Delete them.

## Acceptance Criteria

1. CI passes on PR #70
2. No process-spawning tests remain in the repo
3. `pnpm check` passes locally
4. No compatibility layers or workarounds introduced

## Next Session Entry Point

1. Edit `turbo.json`: add `"package.json"` to the `build` task's
   `inputs` array (after `"$TURBO_ROOT$/tsconfig.base.json"`).
2. Delete `apps/oak-search-cli/e2e-tests/benchmark-cli.e2e.test.ts`
   and `apps/oak-search-cli/e2e-tests/bulk-retry-cli.e2e.test.ts`.
3. Run `pnpm check` locally to verify all gates pass.
4. Commit, push, confirm CI green on PR #70.

## References

- `turbo.json` — task inputs
- `.agent/directives/testing-strategy.md` — no process spawning
- `.agent/directives/principles.md` — "Build up through scales"
- `build-tools-workspace-extraction.plan.md` — structural fix (later)
