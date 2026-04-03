# ADR 065: Turbo Task Dependencies and Caching Strategy

**Status**: Accepted  
**Date**: 2025-12-04 (updated 2026-03-24)  
**Context**: Build system reliability and performance

## Context

The monorepo uses Turborepo to orchestrate tasks across workspaces. Several issues were identified:

1. **Intermittent test failures**: Tests importing from `@oaknational/curriculum-sdk` occasionally failed with `Cannot find module '/@fs/...'` errors - a Vite module resolution issue caused by the SDK being rebuilt while tests were running.

2. **Slow repeated runs**: The `build` task had `cache: false`, meaning every task depending on `^build` would trigger full rebuilds even when nothing changed.

3. **Inconsistent lint flags**: The `--fix` flag was passed via `pnpm lint -- --fix`, which worked but prevented batching lint with other tasks in a single turbo run.

4. **Cache invalidation from directory inputs** (fixed 2025-12-18): Task inputs included bare directory paths like `$TURBO_ROOT$/packages/libs/logger` which caused Turbo to hash entire directories including build outputs, creating circular cache invalidation.

5. **Redundant env configuration** (fixed 2025-12-18): Tasks specified both `env` and `passThroughEnv` for the same variables, causing env var values to affect cache hashes unnecessarily.

6. **Phantom task explosion** (fixed 2026-03-24): Same-package `sdk-codegen` dependencies in `build`, `lint`, `type-check`, and other tasks created `<NONEXISTENT>` phantom tasks for all 13 packages without an `sdk-codegen` script. Each phantom participated in graph resolution and cache key computation. Combined with `OAK_API_KEY` in `build.passThroughEnv`, this caused unnecessary cache key divergence between local and CI environments. The `build` dry run showed 30 tasks (13 phantom); `lint` showed 45 (13 phantom). The CI pipeline resolved 153 total tasks across 4 separate turbo invocations — 52 of which were phantoms.

7. **Cascading `^` prefixed dependencies on single-package tasks** (fixed 2026-03-24): Tasks like `smoke:dev:stub` (1 package) used `dependsOn: ["^smoke:dev:stub", ...]` which propagated phantom smoke tasks to all upstream packages. Combined with same-package `test:e2e` dependencies, this created 60 tasks for a single smoke test (37 phantom, 62%).

## Decision

### 1. Test, type-check, lint, and lint:fix depend on build

```json
"test": {
  "dependsOn": ["^build"],
  "cache": true,
  ...
}

"type-check": {
  "dependsOn": ["^build"],
  "cache": true,
  ...
}

"lint": {
  "dependsOn": ["^build"],
  "cache": true,
  ...
}

"lint:fix": {
  "dependsOn": ["^build"],
  "cache": false,
  ...
}
```

**Rationale**: Tests, type-checking, and linting all import from workspace dependencies. They need the built `.d.ts` declaration files from dependencies like `@oaknational/logger` and `@oaknational/curriculum-sdk`. By declaring these dependencies explicitly, turbo ensures all workspace dependencies are fully built before any verification task starts.

Without this dependency, ESLint's `import-x/no-unresolved` rule fails with "Unable to resolve path to module" errors because the SDK hasn't been built yet.

### 2. Build caching enabled, sdk-codegen scoped to one package

```json
"build": {
  "dependsOn": ["^build"],
  "cache": true,
  "outputs": ["dist/**", ".tsup/**"],
  ...
}

"@oaknational/sdk-codegen#build": {
  "dependsOn": ["^build", "sdk-codegen"]
}
```

**Rationale**: Build outputs are deterministic based on inputs. The `outputs` array already tracks all build artifacts. Enabling caching dramatically improves repeated run performance — builds only run when inputs actually change.

Only `@oaknational/sdk-codegen` has a real `sdk-codegen` script. Using a package-specific override confines the `sdk-codegen` dependency to the one package that needs it, eliminating 13 phantom `<NONEXISTENT>` tasks that were previously created for every other package's build. Generated code is committed, so other packages build from committed source without regeneration.

`OAK_API_KEY` is only in `passThroughEnv` on the `sdk-codegen` task (which uses it for online schema fetching), not on `build` (which never reads it). This prevents cache key divergence between local (key set) and CI (key absent) environments when build outputs are identical.

**Risk mitigation**: The `inputs` array comprehensively tracks all files that affect build output. If stale build issues occur, run `pnpm clean` to clear the cache.

### 3. Explicit lint:fix task

```json
"lint:fix": {
  "cache": false,
  "outputs": [],
  "inputs": [/* same as lint */]
}
```

Each workspace has:

```json
"lint": "eslint .",
"lint:fix": "eslint --fix ."
```

**Rationale**:

- `lint` (cache: true) - verification only, cacheable
- `lint:fix` (cache: false) - modifies files, not cacheable

This enables batching in single turbo runs:

```bash
# Before: two turbo invocations
turbo run build type-check doc-gen && pnpm lint -- --fix

# After: single turbo invocation
turbo run build type-check doc-gen lint:fix
```

### 4. Inputs use file globs, not directory paths

**Problem**: Including bare directory paths as inputs (e.g. `$TURBO_ROOT$/packages/libs/logger`) causes Turbo to hash the entire directory recursively, including:

- Build outputs (`dist/`, `.next/`)
- Hidden files (`.DS_Store`)
- All nested files

This creates circular cache invalidation: `build` produces outputs → outputs change directory hash → downstream tasks see changed inputs → cache miss.

**Solution**: Remove directory paths from inputs. Cross-package dependencies are already handled by `dependsOn: ["^build"]`.

```json
// ❌ Wrong - directory path causes cache invalidation
"inputs": [
  "$TURBO_ROOT$/packages/libs/logger",
  "src/**/*.ts"
]

// ✅ Correct - only file globs, dependencies handled by ^build
"inputs": [
  "$TURBO_ROOT$/tsconfig.base.json",
  "src/**/*.ts"
]
```

### 5. Use `passThroughEnv` not `env` for secrets

**Problem**: Using `env` includes the environment variable's **value** in the cache hash. If `OAK_API_KEY` differs between runs (different terminals, CI vs local), the cache is invalidated.

**Solution**: Use `passThroughEnv` to pass variables to tasks without affecting the cache hash.

```json
// ❌ Wrong - API key value affects cache
"env": ["OAK_API_KEY"],
"passThroughEnv": ["OAK_API_KEY"]

// ✅ Correct - API key passed through but doesn't affect cache
"passThroughEnv": ["OAK_API_KEY"]
```

**When to use `env`**: Only when the env var value should legitimately invalidate the cache (e.g. a feature flag that changes build output).

## Consequences

### Positive

- **Reliability**: No more intermittent test failures from race conditions
- **Performance**: Cached builds make `pnpm test` and `pnpm check` significantly faster on repeated runs
- **Clarity**: Explicit `lint:fix` vs `lint` makes intent clear

### Negative

- **Initial build**: First run after changes may be slightly slower due to build dependency chain
- **Workspace boilerplate**: Each workspace needs both `lint` and `lint:fix` scripts

## Task Dependency Graph

```text
┌─────────────────────────┐
│      sdk-codegen        │  (cache: true, dependsOn: [^build])
│  Only @oaknational/     │  Only runs in packages with the script.
│  sdk-codegen has this   │  OAK_API_KEY in passThroughEnv (online fetching).
└───────────┬─────────────┘
            │ sdk-codegen#build override
            ▼
┌─────────────────────────┐
│         build           │  (cache: true, dependsOn: [^build])
│  Generic: no sdk-codegen│  sdk-codegen#build adds sdk-codegen dep
│  dependency             │  via package-specific override.
└───────────┬─────────────┘
            │ ^build
  ┌─────────┼──────────┬──────────────┐
  ▼         ▼          ▼              ▼
┌──────┐ ┌────────┐ ┌──────┐ ┌─────────┐
│ test │ │type-   │ │ lint │ │lint:fix │
│      │ │check   │ │      │ │         │
│[^bld]│ │[^bld]  │ │[^bld]│ │[^bld]   │
└──────┘ └────────┘ └──────┘ └─────────┘
 cached    cached    cached   uncached

Same-package build dependency (for out-of-process tests):
- test:e2e (cache: true, dependsOn: [build])
- test:ui  (cache: true, dependsOn: [build])

Same-package build + test:e2e dependency:
- smoke:dev:stub (uncached, dependsOn: [build, test:e2e])

Build-only dependency:
- doc-gen  (cache: true, dependsOn: [^build])
- smoke:*  (uncached, dependsOn: [build])
```

### Design principles for task dependencies

1. **Use `^build` for verification tasks** (lint, type-check, test): they need upstream
   packages' `.d.ts` files but not same-package build output.
2. **Use `build` (same-package) for out-of-process tests** (test:e2e, test:ui, smoke):
   they test a built artefact and need the same package compiled.
3. **Never use same-package `sdk-codegen`** in generic task definitions: only one package
   has the script; same-package references create phantom tasks in all other packages.
   Use a package-specific override instead.
4. **Never use `^task` for single-package tasks** (smoke:dev:stub, doc-gen): the `^` prefix
   propagates phantom tasks to all upstream packages when no upstream package has the script.

## Related

- ADR 010: tsup for bundling
- ADR 011: vitest for testing
- ADR 012: pnpm package manager
