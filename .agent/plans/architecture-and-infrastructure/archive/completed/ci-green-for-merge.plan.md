---
name: "CI Green for Merge"
overview: "Fix the immediate CI failures blocking PR #70 merge to main. Strictly within existing rules — no new workspaces, no compatibility layers."
todos:
  - id: turbo-override-outputs
    content: "Fix Turbo task-specific overrides: sdk-codegen overrides were missing outputs/inputs, causing empty cache restoration."
    status: done
  - id: delete-process-spawning-e2e
    content: "Delete remaining process-spawning E2E tests (benchmark-cli.e2e.test.ts, bulk-retry-cli.e2e.test.ts) that violate testing-strategy.md."
    status: done
  - id: fix-portability
    content: "Fix portability:check failure: create GO skill SKILL.md and platform adapters."
    status: done
  - id: remove-symlinks
    content: "Remove 14 Clerk skill symlinks and replace with real adapter files. Create no-symlinks rule."
    status: done
  - id: verify-ci-green
    content: "Push and confirm CI passes on PR #70."
    status: pending
---

# CI Green for Merge

**Created**: 2026-03-30
**Status**: ACTIVE — blocking merge to main
**Scope**: Fix CI failures on PR #70 only. No new workspaces, no
architectural changes — those go in sibling plans.

## Root Cause: Turbo Task-Specific Overrides Strip Inherited Fields

### The Problem

Turbo task-specific overrides (e.g. `@oaknational/sdk-codegen#build`)
**replace** the generic task definition rather than merging with it.
The sdk-codegen overrides only specified `dependsOn`, so all other
fields (`outputs`, `inputs`, `cache`) defaulted to empty/default values.

Critically, `sdk-codegen#build` had `outputs: []`. This means:

1. When `sdk-codegen:build` ran fresh (cache miss), it produced
   `dist/**` files correctly, but Turbo cached nothing (no outputs to
   cache).
2. When `sdk-codegen:build` was a cache hit, Turbo "restored" zero
   files — `dist/` remained empty.
3. Downstream tasks (`search-cli:type-check`, `search-cli:lint`) that
   depend on `sdk-codegen:build` via `^build` could not resolve
   `@oaknational/sdk-codegen/search` because `dist/search.d.ts` did
   not exist.

### Evidence

| Run | `sdk-codegen:build` | `search-cli:type-check` | Outcome |
|-----|---------------------|-------------------------|---------|
| #23736874276 | cache **miss** `d8d4555e90c018bd` | cache miss | PASS |
| #23738170829 | cache **hit** `d8d4555e90c018bd` | cache miss | FAIL: TS2307 Cannot find module |

Verified with `turbo run build --filter=@oaknational/sdk-codegen --dry=json`:

```json
// BEFORE fix
resolvedTaskDefinition: { "outputs": [], "inputs": [], "cache": true }

# AFTER fix
resolvedTaskDefinition: { "outputs": [".tsup/**", "dist/**"], "inputs": [...8 entries...], "cache": true }
```

Comparison with a package without an override (`curriculum-sdk#build`)
showed correct inherited fields: `outputs: [".tsup/**", "dist/**"]`,
`inputs: [...8 entries...]`.

### Previous Misdiagnosis

The prior session diagnosed this as "cache invalidation — add
`package.json` to build inputs". This was wrong on two counts:

1. `$TURBO_DEFAULT$` already includes `package.json` in build inputs.
2. The problem was not cache invalidation (the hash was correct) but
   cache restoration (the outputs spec was empty).

### The Fix

All 5 sdk-codegen task-specific overrides now explicitly include the
full `outputs`, `inputs`, and `cache` fields from their generic parent
tasks, in addition to the `sdk-codegen` dependency in `dependsOn`:

- `sdk-codegen#build`: `outputs: ["dist/**", ".tsup/**"]`, 8 inputs
- `sdk-codegen#test`: `outputs: []`, 5 inputs (matches generic `test`)
- `sdk-codegen#type-check`: `outputs: []`, 6 inputs (matches generic
  `type-check`)
- `sdk-codegen#lint`: `outputs: []`, 6 inputs, `cache: true`
- `sdk-codegen#lint:fix`: `outputs: []`, 6 inputs, `cache: false`

### Why `search-cli:build` Appeared to Succeed

`search-cli`'s tsup config uses `external: [/node_modules/]`, which
marks all workspace dependencies as external. tsup never actually
resolves `@oaknational/sdk-codegen/search` — it passes the import
through as-is. So `search-cli:build` "succeeds" regardless of whether
`sdk-codegen/dist/` exists. Only TypeScript module resolution (used by
`type-check` and `lint`) actually follows the exports map to
`dist/search.d.ts`.

## Other Fixes in This Session

### Process-Spawning E2E Tests (DONE)

Deleted `benchmark-cli.e2e.test.ts`, `bulk-retry-cli.e2e.test.ts`, and
the orphaned `benchmark-test-harness.ts`. These spawned child processes
via `node:child_process.spawn`, violating the testing strategy. The
useful behaviour they tested is already covered by existing unit and
integration tests. Also deleted the dead `childProcessEnv` function.

7 more process-spawning test files remain elsewhere — tracked in the
test audit plan at
`architecture-and-infrastructure/future/test-suite-audit-and-triage.plan.md`.

### Portability: GO Skill (DONE)

Created `.agent/skills/go/SKILL.md` and `.cursor/skills/go/SKILL.md`.

### 14 Clerk Skill Symlinks (DONE)

Replaced all symlinks in `.cursor/skills/` and `.claude/skills/` with
real adapter files. Created no-symlinks rule, platform adapters, and
principle.

## Acceptance Criteria

1. CI passes on PR #70
2. No process-spawning tests remain in `apps/oak-search-cli/`
3. `pnpm check` passes locally — **VERIFIED (64/64 tasks)**
4. `pnpm portability:check` passes — **VERIFIED**
5. No symlinks remain in the repo — **VERIFIED**
6. No compatibility layers or workarounds introduced

## Next Step

Push and confirm CI green on PR #70.

## Architectural Note for Future

Turbo task-specific overrides are a footgun. Any time a
`@package#task` override is added to `turbo.json`, ALL fields from the
generic task MUST be explicitly included. There is no inheritance. This
should be documented or enforced (e.g. a lint rule or validator that
checks task-specific overrides include `outputs` and `inputs`).
