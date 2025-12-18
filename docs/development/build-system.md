# Build System

This document describes the monorepo build system, quality gate commands, and their design rationale.

## Overview

The build system uses:

- **pnpm** - Package manager and workspace orchestration
- **Turborepo** - Task runner with caching and dependency management
- **tsup** - TypeScript bundler for libraries
- **Next.js** - Framework for web apps

## Build Order

All packages use a unified `build` script. Turbo's `^build` dependency ensures packages build in the correct order based on the workspace dependency graph:

```text
┌─────────────┐
│  oak-eslint │  ← leaf, builds first (no workspace deps)
└──────┬──────┘
       │ devDep
       ▼
┌──────────────────────────────┐
│ openapi-zod-client-adapter   │  ← builds after oak-eslint
└──────────────┬───────────────┘
               │ dep
               ▼
┌──────────────────────────────┐
│    oak-curriculum-sdk        │  ← type-gen, then build
└──────────────┬───────────────┘
               │ dep
               ▼
┌──────────────────────────────┐
│          apps/*              │  ← build last
└──────────────────────────────┘
```

### Why This Works

- **`^build`** means "run `build` in dependency packages first"
- **`type-gen`** (no `^`) means "run `type-gen` in this package first"

Core packages (`oak-eslint`, `openapi-zod-client-adapter`) are leaf nodes with no workspace dependencies, so they build first. Other packages depend on them via `devDependencies` or `dependencies`, ensuring the correct build order without manual configuration.

## Quality Gate Commands

### `pnpm make` - Build and fix

Prepares the codebase by building, checking, and auto-fixing issues:

```bash
pnpm i && turbo run build type-check doc-gen lint:fix && pnpm markdownlint:root && pnpm format:root
```

**Flow**:

1. Install dependencies
2. Single turbo run:
   - `build` - compile all workspaces (triggers `type-gen` first)
   - `type-check` - TypeScript validation
   - `doc-gen` - generate documentation
   - `lint:fix` - auto-fix linting issues
3. Root-only fixes:
   - `markdownlint:root` - fix markdown in root
   - `format:root` - format root files

### `pnpm qg` - Quality gates (verification)

Verifies the codebase passes all checks without modifications:

```bash
pnpm format-check:root && pnpm markdownlint-check:root && turbo run type-check lint test test:ui test:e2e test:e2e:built smoke:dev:stub
```

**Flow**:

1. Root-only checks (no fixes):
   - `format-check:root` - verify formatting
   - `markdownlint-check:root` - verify markdown
2. Single turbo run:
   - `type-check` - TypeScript validation
   - `lint` - ESLint (verify only, no --fix)
   - `test` - unit and integration tests
   - `test:ui` - Playwright UI tests
   - `test:e2e` - E2E tests
   - `test:e2e:built` - E2E tests on built artifacts
   - `smoke:dev:stub` - smoke tests with stubs

### `pnpm check` - Full clean build and verify

Complete clean rebuild and verification:

```bash
pnpm clean && pnpm lint:clean && pnpm make && pnpm qg
```

### `pnpm test:all` - All test suites

Runs all test types in a single turbo invocation:

```bash
turbo run test test:e2e test:e2e:built test:ui smoke:dev:stub
```

### `pnpm fix` - Auto-fix only

Quick fix without full build:

```bash
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix
```

## Task Dependencies

See [ADR 065: Turbo Task Dependencies](../architecture/architectural-decisions/065-turbo-task-dependencies.md) for full details.

### Key relationships

```text
type-gen → build → test
                 ↘ test:e2e:built
                 ↘ type-check
                 ↘ lint / lint:fix
```

All task dependencies use `^build`:

| Task                | Depends On           | Why                                                   |
| ------------------- | -------------------- | ----------------------------------------------------- |
| `type-gen`          | `^build`             | Core adapter must be built before SDK type generation |
| `build`             | `^build`, `type-gen` | Dependencies build first, then local type generation  |
| `type-check`        | `^build`, `type-gen` | Declaration files must exist for type checking        |
| `lint` / `lint:fix` | `^build`, `type-gen` | ESLint plugin must be built before linting            |
| `test`              | `^build`             | SDK must be built before tests run                    |
| `doc-gen`           | `^build`             | Source must be built before doc generation            |

### Independent tasks

These run in parallel with no build dependency:

- `test:e2e`
- `test:ui`

## Caching

### Cached tasks (fast on repeat runs)

| Task         | Cached | Notes                                 |
| ------------ | ------ | ------------------------------------- |
| `build`      | ✅     | Rebuilds only when inputs change      |
| `type-gen`   | ✅     | Regenerates only when schema changes  |
| `type-check` | ✅     | Re-checks only when source changes    |
| `lint`       | ✅     | Re-lints only when source changes     |
| `test`       | ✅     | Re-runs only when source/tests change |
| `test:e2e`   | ✅     | Re-runs only when e2e tests change    |
| `test:ui`    | ✅     | Re-runs only when UI tests change     |
| `doc-gen`    | ✅     | Regenerates only when source changes  |

### Uncached tasks (always run)

| Task             | Cached | Reason                                      |
| ---------------- | ------ | ------------------------------------------- |
| `lint:fix`       | ❌     | Modifies source files                       |
| `test:e2e:built` | ❌     | Tests built artifacts, should always verify |
| `smoke:*`        | ❌     | External system tests, non-deterministic    |
| `clean`          | ❌     | Destructive operation                       |
| `dev`            | ❌     | Persistent process                          |

## Mixing pnpm and turbo

### Use turbo for

- Workspace tasks that benefit from caching
- Tasks with cross-workspace dependencies
- Parallel execution of independent tasks

### Use pnpm for

- Root-only operations (`format:root`, `markdownlint:root`)
- Operations without workspace equivalents
- Simple utility commands

### Why not make root tasks turbo tasks?

Root doesn't have a package.json workspace entry. Making root operations turbo tasks would require special configuration. The current approach is simpler and correct.

## Troubleshooting

### Stale build artifacts

```bash
pnpm clean
pnpm make
```

### Test failures with `/@fs/` errors

This was caused by a race condition where tests ran before SDK build completed. Fixed by adding `dependsOn: ["^build"]` to the `test` task. If you see this error:

1. Verify `turbo.json` has `"test": { "dependsOn": ["^build"], ... }`
2. Run `pnpm clean && pnpm make`

### Type-check fails with "Cannot find module '@oaknational/eslint-plugin-standards'"

This indicates core packages weren't built before type-check ran. Ensure:

1. `oak-eslint` has a `build` script (not `build-linting`)
2. `turbo.json` `type-check` depends on `["^build", "type-gen"]`
3. Run `pnpm clean && pnpm build`

### Slow repeated runs

Ensure `build` has `cache: true` in `turbo.json`. Run `turbo run build --dry-run` to check if caching is working.

### Cache misses on every run

Common causes:

1. **Directory paths in inputs** - Using bare directory paths like `$TURBO_ROOT$/packages/libs/logger` causes Turbo to hash entire directories including build outputs. Use file globs instead, or rely on `dependsOn: ["^build"]` for cross-package dependencies.

2. **Both `env` and `passThroughEnv` for same variable** - Using both causes the env var value to affect the cache hash. Use `passThroughEnv` for secrets that shouldn't affect caching.

3. **Unstable generated outputs** - If type-gen produces files with timestamps or random ordering, cache will miss. Ensure generators produce deterministic output.

To debug cache misses:

```bash
# Check what Turbo sees as inputs
turbo run build --dry=json | jq '.tasks[0].inputs'

# Compare hashes between runs
turbo run build --dry=json | jq '.tasks[] | {task: .taskId, hash: .hash}'
```

## Related Documentation

- [ADR 065: Turbo Task Dependencies](../architecture/architectural-decisions/065-turbo-task-dependencies.md)
- [ADR 010: tsup for bundling](../architecture/architectural-decisions/010-tsup-for-bundling.md)
- [ADR 012: pnpm package manager](../architecture/architectural-decisions/012-pnpm-package-manager.md)
- [Tooling](./tooling.md)
