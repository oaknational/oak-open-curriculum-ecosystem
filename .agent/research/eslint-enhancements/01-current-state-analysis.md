# Current State Analysis: ESLint Configuration

## Overview

The repository employs a **modern, flat configuration (`eslint.config.ts`)** architecture, leveraging ESLint v9 patterns. The configuration is hierarchical but distributed, with a central base configuration and workspace-specific extensions.

## Architecture

### 1. Base Configuration (`@oaknational/eslint-plugin-standards`)

- **Role**: Single Source of Truth (SSOT) for shared rules.
- **Core Stack**:
  - `typescript-eslint` (Strict + Stylistic type-checked)
  - `eslint-plugin-import-x` (Recommended + TypeScript)
  - `eslint-plugin-prettier`
- **Custom Rule Sets**: Exports `tsRules` and `testRules` objects, which are manually spread into configs.
- **Status**: Contains `TODO`s to move logic to a dedicated package.

### 2. Custom Rules (`packages/core/oak-eslint`)

- **Structure**: A local directory acting as a pseudo-package.
- **Key Components**:
  - `boundary-rules.ts`: Exports factory functions (`createLibBoundaryRules`) and objects (`appBoundaryRules`) to enforce the architectural model.
  - `no-export-trivial-type-aliases.ts`: A custom rule implementation (currently unused).
- **Usage**: Imported from the plugin package (`@oaknational/eslint-plugin-standards`) in workspace configs.

### 3. Workspace Configurations

- **Pattern**: `export default defineConfig(...baseConfig, { ...overrides })`
- **Project Service**: Most workspaces explicitly configure `parserOptions.project` to point to a local `tsconfig.lint.json`, bypassing the default project service for granular control.
- **Boilerplate**: High repetition of `fileURLToPath`, `dirname`, and `tsconfig` resolution logic.

## Architectural Enforcement

The system explicitly codifies the "Architectural Model" from `@principles.md` using `import-x/no-restricted-paths`:

| Scope             | Mechanism                | Intent                                                                                                                     |
| :---------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Core**          | `coreBoundaryRules`      | **Zero dependencies**. Cannot import from `libs` or `apps`.                                                                |
| **Libs**          | `createLibBoundaryRules` | **Independence**. Cannot import from other libs (unless specified) or apps. **No Globals**: Blocks `process`, `__dirname`. |
| **Apps**          | `appBoundaryRules`       | **Isolation**. Apps cannot import from other apps.                                                                         |
| **App Internals** | `appArchitectureRules`   | **Layering**. `integrations` cannot import `tools` directly (enforces DI).                                                 |

## Key Observations

- **Modernity**: The repo is ahead of the curve in adopting Flat Config.
- **Strictness**: Type-checking is enabled globally, which is excellent but resource-intensive.
- **Fragility**: Avoid direct relative imports; use the plugin package exports to keep configs stable.
