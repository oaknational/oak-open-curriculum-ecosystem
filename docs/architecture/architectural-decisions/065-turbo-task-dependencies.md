# ADR 065: Turbo Task Dependencies and Caching Strategy

**Status**: Accepted  
**Date**: 2025-12-04  
**Context**: Build system reliability and performance

## Context

The monorepo uses Turborepo to orchestrate tasks across workspaces. Several issues were identified:

1. **Intermittent test failures**: Tests importing from `@oaknational/oak-curriculum-sdk` occasionally failed with `Cannot find module '/@fs/...'` errors - a Vite module resolution issue caused by the SDK being rebuilt while tests were running.

2. **Slow repeated runs**: The `build` task had `cache: false`, meaning every task depending on `^build` would trigger full rebuilds even when nothing changed.

3. **Inconsistent lint flags**: The `--fix` flag was passed via `pnpm lint -- --fix`, which worked but prevented batching lint with other tasks in a single turbo run.

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

**Rationale**: Tests, type-checking, and linting all import from workspace dependencies. They need the built `.d.ts` declaration files from dependencies like `@oaknational/mcp-logger` and `@oaknational/oak-curriculum-sdk`. By declaring these dependencies explicitly, turbo ensures all workspace dependencies are fully built before any verification task starts.

Without this dependency, ESLint's `import-x/no-unresolved` rule fails with "Unable to resolve path to module" errors because the SDK hasn't been built yet.

### 2. Build caching enabled

```json
"build": {
  "dependsOn": ["^build", "type-gen"],
  "cache": true,
  "outputs": ["dist/**", ".tsup/**", ".next/**"],
  ...
}
```

**Rationale**: Build outputs are deterministic based on inputs. The `outputs` array already tracks all build artifacts. Enabling caching dramatically improves repeated run performance - builds only run when inputs actually change.

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

## Consequences

### Positive

- **Reliability**: No more intermittent test failures from race conditions
- **Performance**: Cached builds make `pnpm test` and `pnpm qg` significantly faster on repeated runs
- **Clarity**: Explicit `lint:fix` vs `lint` makes intent clear

### Negative

- **Initial build**: First run after changes may be slightly slower due to build dependency chain
- **Workspace boilerplate**: Each workspace needs both `lint` and `lint:fix` scripts

## Task Dependency Graph

```text
┌─────────────┐
│ build-adapter│  (cache: true)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  type-gen   │  (cache: true, dependsOn: [^type-gen, ^build-adapter])
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    build    │  (cache: true, dependsOn: [^build, type-gen])
└──────┬──────┘
       │
       ├────────────────┬────────────────┬────────────────┬────────────────┐
       ▼                ▼                ▼                ▼                ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    test     │  │test:e2e:built│  │ type-check  │  │    lint     │  │  lint:fix   │
│(dependsOn:  │  │(dependsOn:   │  │(dependsOn:  │  │(dependsOn:  │  │(dependsOn:  │
│  [^build])  │  │  [^build])   │  │  [^build])  │  │  [^build])  │  │  [^build])  │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
  (cache: true)   (cache: false)    (cache: true)   (cache: true)   (cache: false)

Independent tasks (no build dependency):
- test:e2e (cache: true)
- test:ui (cache: true)
- doc-gen (cache: true, dependsOn: [^doc-gen])
```

## Related

- ADR 010: tsup for bundling
- ADR 011: vitest for testing
- ADR 012: pnpm package manager
