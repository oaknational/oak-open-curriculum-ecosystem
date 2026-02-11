# Deviance Report: ESLint Configuration

This report details deviations from the standard "Base + Boundary" configuration pattern across the repository.

## 1. `apps/oak-search-cli`

**Deviation Level: High**

- **Framework Specifics**: Uses `eslint-config-next` directly.
- **Redundancy**: Re-defines complexity rules (`max-lines`, `max-depth`) locally, duplicating `baseConfig`.
- **Overrides**: Extensive manual overrides for `react/*` rules.
- **Type Safety**: Uses `@ts-expect-error` for plugins.
- **Recommendation**: Replace with a shared `next` config from the proposed plugin.

## 2. `packages/sdks/oak-curriculum-sdk`

**Deviation Level: Medium**

- **Strictness**: Implements a "Hyper-Strict" set of `no-restricted-properties` rules (banning `Object.keys`, `Reflect.*`) that is unique to this package.
- **Overrides**: Disables complexity and strict type rules for `type-gen` and `generated` directories.
- **Config Pattern**: Uses `projectService: true` directly, unlike the `tsconfig.lint.json` pattern used in `libs`.
- **Recommendation**: Extract the strict rules into a shared `strict` config; standardize the project service configuration.

## 3. `apps/oak-notion-mcp`

**Deviation Level: Low**

- **Relaxed Boundaries**: Disables `import-x/no-relative-parent-imports` and `import-x/no-internal-modules` globally.
- **Recommendation**: Acceptable for an app, but could be formalized into an `app-loose` config if this pattern spreads.

## 4. `packages/libs/transport`

**Deviation Level: Low**

- **Redundancy**: Manually re-defines `no-restricted-globals`, which is already handled by `createLibBoundaryRules`.
- **Recommendation**: Remove the manual rule definition.

## 5. `packages/core`

**Deviation Level: Critical (Missing)**

- **Status**: Directory exists but contains no `package.json` or `eslint.config.ts`.
- **Recommendation**: If this directory is active, it needs initialization. If deprecated, it should be removed. (User note: "I have deleted core/")
