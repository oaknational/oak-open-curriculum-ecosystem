# Problems and Risks: ESLint Configuration

## 1. Unused Custom Rules

- **Issue**: The custom rule `no-export-trivial-type-aliases` is implemented in `packages/core/oak-eslint` but must be registered and enabled via the shared plugin configs.
- **Risk**: False sense of security; code quality checks that are believed to be active are not running.

## 2. Configuration Redundancy

- **Issue**: `apps/oak-search-cli/eslint.config.ts` re-declares complexity rules (`max-lines`, `max-depth`, etc.) that are already present in `baseConfig`.
- **Issue**: `packages/libs/transport/eslint.config.ts` manually re-declares `no-restricted-globals`, duplicating logic from `createLibBoundaryRules`.
- **Risk**: Configuration drift. Updates to the base config or boundary factories will not propagate to these workspaces, leading to inconsistent enforcement.

## 3. Boilerplate & Maintenance

- **Issue**: Every `eslint.config.ts` file repeats the same ~10 lines of code to set up `__dirname` and resolve `tsconfig.lint.json`.
- **Risk**: High friction for creating new packages. Copy-paste errors can lead to subtle linting failures (e.g., linting with the wrong tsconfig).

## 4. Inconsistent Strictness

- **Issue**: `packages/sdks/oak-curriculum-sdk` enforces a much stricter set of rules (banning `Object.keys`, `Reflect`, etc.) than the rest of the repository.
- **Risk**: "Strictness" is siloed. If these rules are valuable for the SDK (preventing type widening), they are likely valuable for the Core and Libs packages too, but they are not currently shared.

## 5. Type Incompatibilities

- **Issue**: `apps/oak-search-cli` uses `@ts-expect-error` to suppress type errors for `eslint-plugin-react-hooks` and `eslint-plugin-import-x`.
- **Risk**: brittle configuration that may break silently with dependency updates.

## 6. Missing Core Scope

- **Issue**: The `packages/core` directory exists but has no `package.json` or `eslint.config.ts`.
- **Risk**: If code is added here, it will be unlinted or fall back to a default that doesn't enforce the "Core = Zero Dependencies" rule.
