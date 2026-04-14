---
name: "Build Tooling Composability"
overview: >
  Add composable tsup base config and clean up tsconfig $schema
  annotations. Extracted from non-repo plan
  (~/.claude/plans/cuddly-swinging-ocean.md Track 1) into this
  repo plan for discoverability and durability.
parent_plan: "sentry-otel-integration.execution.plan.md"
source_decision: "ADR-010 revision (2026-04-14)"
branch: "feat/otel_sentry_enhancements"
todos:
  - id: create-base-config
    content: "Create tsup.config.base.ts at repo root with 3 factory functions (createLibConfig, createSdkConfig, createAppConfig)"
    status: done
    note: "Implemented 2026-04-14c. Shared defaults with `as const satisfies Partial<Options>`. ensure-js-extensions plugin inline in createSdkConfig. tsup added as root devDependency for type resolution."
  - id: migrate-simple-libs
    content: "Migrate simple libs (result, env, type-helpers, search-contracts, design-tokens-core) to createLibConfig()"
    status: done
    note: "Implemented 2026-04-14c. 5 configs, pnpm build verified."
  - id: migrate-libs-with-overrides
    content: "Migrate libs with overrides (sentry-node, sentry-mcp, logger, env-resolution, observability, eslint-plugin, openapi-zod-client-adapter) to createLibConfig({ external })"
    status: done
    note: "Implemented 2026-04-14c. 7 configs including oak-eslint (dts: true). pnpm build verified."
  - id: migrate-sdks
    content: "Migrate SDKs (curriculum-sdk, oak-search-sdk, sdk-codegen) to createSdkConfig(entries)"
    status: done
    note: "Implemented 2026-04-14c. 3 configs. pnpm build verified."
  - id: migrate-apps
    content: "Migrate apps (streamable-http, search-cli) to createAppConfig(entries)"
    status: done
    note: "Implemented 2026-04-14c. 2 configs. CLI with shebang banner + node22 target. pnpm build verified."
  - id: turbo-inputs
    content: "Add $TURBO_ROOT$/tsup.config.base.ts to the 3 tsup-based build task input arrays in turbo.json (excludes oak-design-tokens which uses a different build path)"
    status: done
    note: "Implemented 2026-04-14c. All 3 tsup-based build tasks updated. design-tokens excluded (different build path, no tsup.config.ts)."
  - id: tsconfig-schema
    content: "Add $schema to ~37 workspace tsconfig files (tsconfig.json + tsconfig.build.json)"
    status: done
    note: "Implemented 2026-04-14c. 37 files modified. agent-tools already had it. Root tsconfig.json included."
---

# Build Tooling Composability

**Branch**: `feat/otel_sentry_enhancements` (same PR as Sentry work)
**ADR**: [010-tsup-for-bundling.md](../../../docs/architecture/architectural-decisions/010-tsup-for-bundling.md) (revised 2026-04-14)

## Motivation

17 workspace `tsup.config.ts` files duplicate shared defaults.
Adding or changing a default requires editing all 17 files. The
composable base config eliminates this duplication.

## Design

See ADR-010 revision for the full decision record. Summary:

- `tsup.config.base.ts` at repo root with 3 factory functions
- Each workspace config becomes 2-5 lines
- Turbo cache inputs updated for all build task variants

### Shared Defaults (currently repeated 17 times)

- `format: ['esm']`, `sourcemap: true`, `clean: true`
- `minify: false`, `treeshake: true`, `splitting: false`, `dts: false`
- `tsconfig: './tsconfig.build.json'`
- `ignoreWatch: ['**/*.test.ts', '**/*.spec.ts']`
- `outDir: 'dist'`

**`target` is factory-specific** (config-reviewer): libs/apps default
to `es2022`, SDKs use `node22`. Not shared — document in each factory.

**Migrated files stay named `tsup.config.ts`** (config-reviewer):
turbo.json inputs match on `tsup.config.ts` — renaming would break
cache invalidation.

### Migration Batches

1. Simple libs (5 pkgs) — `createLibConfig()`
2. Libs with overrides (7 pkgs) — `createLibConfig({ external })`
3. SDKs (3 pkgs) — `createSdkConfig(entries)`
4. Apps (2 pkgs) — `createAppConfig(entries)`

Verify `pnpm build` after each batch.

### tsconfig `$schema` Cleanup

`"$schema": "https://json.schemastore.org/tsconfig"` is a JSON
annotation for IDE intellisense — NOT inherited via `extends`.
Currently only `agent-tools/` has it. All other workspace tsconfig
files need it added.

## Verification

- `pnpm build` succeeds (all workspaces)
- `pnpm check` green
- Turbo cache invalidation: change base config, verify rebuild
- Each workspace config is 2-5 lines importing from base

## Review Attribution

Decision shaped by Betty, Barney, Fred, and assumptions-reviewer.
See ADR-010 revision for details.
