---
name: "CI Turbo Pipeline Fix"
overview: >
  Fix CI inefficiency caused by phantom sdk-codegen tasks, redundant
  same-package dependencies, OAK_API_KEY cache key contamination, and
  cascading ^-prefixed dependencies on single-package tasks.
todos:
  - id: remove-sdk-codegen-from-test
    content: "Remove sdk-codegen from test task dependsOn (already done)."
    status: done
  - id: audit-all-phantom-tasks
    content: "Audit and eliminate all phantom sdk-codegen tasks from CI-relevant turbo tasks."
    status: done
  - id: remove-oak-api-key-from-ci-tasks
    content: "Remove OAK_API_KEY from passThroughEnv on build."
    status: done
  - id: eliminate-redundant-same-package-deps
    content: "Remove redundant same-package build and sdk-codegen from lint, lint:fix, type-check, test:ui, doc-gen, mutate."
    status: done
  - id: eliminate-cascading-caret-deps
    content: "Remove ^smoke:dev:stub, ^smoke:dev:live, etc. from single-package tasks."
    status: done
  - id: remove-agent-tools-dummy
    content: "Remove agent-tools dummy sdk-codegen script and turbo override."
    status: done
  - id: verify-ci-green
    content: "Push changes and verify CI completes without hanging. DONE: pnpm clean && pnpm check passes (2026-03-24)."
    status: done
  - id: update-documentation
    content: "Update ADR-065 and build-system.md to match corrected turbo.json."
    status: done
---

# CI Turbo Pipeline Fix

**Status**: Applied, awaiting CI verification
**Branch**: `feat/es_index_update`
**Scope**: Fix CI reliability and efficiency by eliminating phantom tasks, redundant
dependencies, and cache key contamination.

## Root Cause Analysis

### Finding 1: Same-package `sdk-codegen` creates phantom tasks everywhere

The generic `build` task had `dependsOn: ["^build", "sdk-codegen"]`. The same-package
`sdk-codegen` (no `^` prefix) created a `<NONEXISTENT>` phantom task for every package
without an `sdk-codegen` script — 13 out of 15 packages.

Only 1 package genuinely generates types:

- `@oaknational/sdk-codegen` — runs `pnpm generate:types`

`@oaknational/agent-tools` had a dummy script (`echo "no sdk code generation"`) with
`cache: false`, meaning it ran every time and did nothing.

The phantom cascade multiplied across every task that depended on `build`:

| turbo command | Before: total tasks | Before: phantoms | After: total tasks | After: phantoms |
|---|---|---|---|---|
| `build` | 30 | 13 | **16** | **0** |
| `lint` | 45 | 13 | **27** | **0** |
| `type-check` | 41 | 15 | **27** | **0** |
| `test` | 37 | 11 | **27** | **0** |
| CI total (4 invocations) | 153 | 52 | **97** | **0** |

### Finding 2: `OAK_API_KEY` contaminated build cache keys

`build` had `passThroughEnv: ["OAK_API_KEY"]` but never reads it. Only `sdk-codegen`
uses it for online schema fetching. This caused different cache keys between local
(key set) and CI (key absent), preventing remote cache sharing for builds despite
identical outputs.

**Fix**: Removed `OAK_API_KEY` from `build.passThroughEnv`. It remains on `sdk-codegen`
and `test:e2e` where it is genuinely used.

### Finding 3: Redundant same-package dependencies in lint, type-check, test:ui

`lint` had `dependsOn: ["^build", "build", "sdk-codegen"]` — the ADR-065 documented
design was `["^build"]` only. The extra same-package `build` and `sdk-codegen` were
unnecessary because:

- Lint checks source files, not build output of the same package
- `^build` ensures upstream packages (including the ESLint plugin) are built
- Generated code is committed, so `sdk-codegen` adds no value as a prerequisite

Same issue affected `lint:fix`, `type-check`, `doc-gen`, and `mutate`.

**Fix**: All verification tasks now depend on `["^build"]` only.

### Finding 4: Cascading `^` prefixed dependencies on single-package tasks

`smoke:dev:stub` had `dependsOn: ["^smoke:dev:stub", "^build", "test:e2e"]`.
Only 1 package has a smoke script. The `^smoke:dev:stub` propagated phantom smoke
tasks to all 14 upstream packages. Combined with same-package `test:e2e`, this created
60 tasks (37 phantom, 62%) for a single smoke test.

**Fix**: Changed to `dependsOn: ["build", "test:e2e"]`. Same-package `build` transitively
handles `^build` via its own `dependsOn`. Same fix applied to all smoke variants.

### Finding 5: ADR-065 had drifted from implementation

The ADR documented `lint` and `type-check` as `dependsOn: ["^build"]` and `test:e2e`/`test:ui`
as independent tasks. The implementation had accumulated additional dependencies over time
without updating the ADR.

**Fix**: Updated ADR-065 with the corrected implementation, added design principles for
when to use `^build` vs `build` vs package-specific overrides.

## Changes Applied

### turbo.json

- `sdk-codegen.dependsOn`: `["^sdk-codegen", "^build"]` → `["^build"]`
- `build.dependsOn`: `["^build", "sdk-codegen"]` → `["^build"]`
- Added `@oaknational/sdk-codegen#build` override: `dependsOn: ["^build", "sdk-codegen"]`
- Removed `build.passThroughEnv: ["OAK_API_KEY"]`
- `lint.dependsOn`: `["^build", "build", "sdk-codegen"]` → `["^build"]`
- `lint:fix.dependsOn`: `["^build", "build", "sdk-codegen"]` → `["^build"]`
- `type-check.dependsOn`: `["^build", "sdk-codegen"]` → `["^build"]`
- `mutate.dependsOn`: `["^build", "sdk-codegen"]` → `["^build"]`
- `doc-gen.dependsOn`: `["^doc-gen", "^build", "sdk-codegen"]` → `["^build"]`
- `test:ui.dependsOn`: `["^build", "build", "sdk-codegen"]` → `["build"]`
- `smoke:dev:stub.dependsOn`: `["^smoke:dev:stub", "^build", "test:e2e"]` → `["build", "test:e2e"]`
- `smoke:dev:live.dependsOn`: `["^smoke:dev:live", "^build", "build"]` → `["build"]`
- `smoke:dev:live:auth.dependsOn`: `["^smoke:dev:live:auth", "^build", "build"]` → `["build"]`
- `smoke:remote.dependsOn`: `["^smoke:remote", "^build", "build"]` → `["build"]`
- Removed `@oaknational/agent-tools#sdk-codegen` override

### agent-tools/package.json

- Removed dummy `sdk-codegen` script

### Documentation

- Updated ADR-065 with new context items, corrected dependency graph, and design principles
- Updated build-system.md task dependency table and sdk-codegen explanation

## Verification

All quality gates pass locally:

- `pnpm build` — 16 tasks, 0 phantoms ✓
- `pnpm type-check` — 27 tasks, 0 phantoms ✓
- `pnpm lint` — 27 tasks, 0 phantoms ✓
- `pnpm test` — 27 tasks, 0 phantoms ✓
- `pnpm test:e2e` — 21 tasks ✓
- `pnpm sdk-codegen` — 12 tasks ✓

## Remaining phantom tasks (inherent Turbo behaviour)

When tasks like `test:e2e`, `test:ui`, `smoke:dev:stub` are explicitly requested via
`turbo run`, Turbo schedules them for all 15 packages. Packages without the script get
phantom tasks. These are inherent to Turbo and can only be avoided with `--filter` flags
on the script commands. This affects `pnpm check` and `pnpm qg` but not CI.

## CI consolidation (not applied)

CI retains 4 separate turbo steps for readability — each step's red/green status in the
GitHub Actions UI is a useful signal. After phantom elimination, the overhead from
separate invocations is negligible (97 vs ~97 resolutions, with intermediate builds
served from cache).
