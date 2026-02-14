# @oaknational/eslint-plugin-standards

Custom ESLint plugin for architectural boundary enforcement and code standards
across the Oak MCP Ecosystem monorepo.

## Purpose

This plugin provides:

1. **Custom ESLint rules** that enforce Oak-specific code quality constraints
2. **Boundary rules** that prevent architectural violations between workspaces
3. **Shared configs** that standardise linting across all workspaces

## Rules

### Custom Rules

| Rule                             | Description                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `no-export-trivial-type-aliases` | Disallows exporting trivial type aliases that only rename an imported type. Prefer re-exporting the original type directly. |

### Boundary Rules

Boundary rules use `eslint-plugin-import-x` and `@typescript-eslint` to enforce
layer separation:

| Rule Set                 | Scope             | Enforces                                                                  |
| ------------------------ | ----------------- | ------------------------------------------------------------------------- |
| `coreBoundaryRules`      | `packages/core/`  | No imports from libs or apps                                              |
| `createLibBoundaryRules` | `packages/libs/`  | No imports from other libs or apps; no `process`/`__dirname`/`__filename` |
| `appBoundaryRules`       | `apps/`           | No imports from other apps                                                |
| `appArchitectureRules`   | `apps/` internals | Integrations cannot import tools and vice versa                           |

## Configs

| Config        | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `recommended` | Base: ESLint recommended, TypeScript strict + stylistic, import-x, Prettier, TSDoc, Oak-specific rules |
| `strict`      | Extends `recommended`: restricts `Object.keys`/`values`/`entries`, `Reflect.*`, stronger type rules    |
| `react`       | React + React Hooks rules                                                                              |
| `next`        | Extends `react` with Next.js recommended and core-web-vitals                                           |

## Usage

This plugin is consumed internally by workspaces in this monorepo via
`eslint.config.js` files. It is not published to npm.

```javascript
import oakStandards from '@oaknational/eslint-plugin-standards';

export default [
  ...oakStandards.configs.recommended,
  // workspace-specific overrides
];
```

## Development

```bash
pnpm test        # Run rule tests
pnpm build       # Build the plugin
pnpm type-check  # Type-check
```
