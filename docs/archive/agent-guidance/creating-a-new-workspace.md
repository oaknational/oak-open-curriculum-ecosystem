# Creating a New Workspace

This comprehensive guide explains how to create new workspaces in the oak-mcp-ecosystem monorepo, following the Moria/Histoi/Psycha architecture. This guide was created based on the experience of implementing Phase 6 (Oak Curriculum API) workspaces.

## Workspace Types

### 1. Psycha Organisms (`ecosystem/psycha/`)

Complete MCP server applications that follow the biological architecture pattern.

### 2. Histoi Tissues (`ecosystem/histoi/`)

Adaptive runtime tissues that bind organisms together.

### 3. Moria Abstractions (`ecosystem/moria/`)

Pure abstractions with zero dependencies.

### 4. Standard Packages (`packages/`)

Conventional packages (SDKs, utilities) that don't follow biological architecture.

## Step-by-Step Guide

### Step 1: Determine Workspace Type

Ask yourself:

- **Is it a complete MCP server?** � Psycha organism
- **Is it runtime-adaptive infrastructure?** � Histoi tissue
- **Is it a pure abstraction?** � Moria abstraction
- **Is it a reusable SDK/library?** � Standard package

### Step 2: Create Directory Structure

#### For Psycha Organisms:

```bash
mkdir -p ecosystem/psycha/[name]/src/{chora/{morphai,stroma,aither,phaneron,eidola},organa,psychon}
```

#### For Histoi Tissues:

```bash
mkdir -p ecosystem/histoi/[name]/src
```

#### For Standard Packages:

```bash
mkdir -p packages/[name]/src
```

### Step 3: Create Essential Configuration Files

Every workspace needs these files:

#### 1. `package.json`

```json
{
  "name": "@oaknational/[workspace-name]",
  "version": "0.0.1",
  "description": "[Description]",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "engines": {
    "node": ">=22.0.0"
  },
  "scripts": {
    "dev": "tsx src/index.ts", // Only for MCP servers, not SDKs
    "build": "tsup && tsc --emitDeclarationOnly",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:e2e": "vitest run --config vitest.e2e.config.ts",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    // Add workspace and external dependencies
  },
  "devDependencies": {
    "@types/node": "^22",
    "tsx": "^4.20.5", // Only for MCP servers with dev scripts
    "tsup": "^8.5.0",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4",
    "eslint": "^9.35.0"
  }
}
```

#### 2. `tsconfig.json`

```json
{
  "extends": "[relative-path-to]/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.spec.ts"]
}
```

#### 3. `tsconfig.lint.json`

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts", "**/*.config.ts", "**/*.test.ts", "**/*.spec.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 4. `tsconfig.build.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts", "node_modules", "dist", "**/*.config.ts"]
}
```

#### 5. `eslint.config.ts`

For **Psycha organisms**, use biological architecture rules:

```typescript
import { ConfigArray, config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import {
  psychaBoundaryRules,
  psychonArchitectureRules,
  commonSettings,
} from '../../../eslint-rules/index.js';
// ... (see oak-notion-mcp for full example)
```

For **standard packages**, use simple configuration:

```typescript
import { ConfigArray, config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base';
import { commonSettings } from '../../eslint-rules/index.js';
// ... (see oak-curriculum-sdk for example)
```

#### 6. `tsup.config.ts`

For **MCP servers** (bundle dependencies):

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: true,
  platform: 'neutral',
  noExternal: ['@modelcontextprotocol/sdk', 'zod'],
  external: ['node:*', '@oaknational/mcp-*', '@oaknational/oak-*'],
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
```

For **SDKs/libraries** (don't bundle):

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: false,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
```

#### 7. `vitest.config.ts`

```typescript
import { baseTestConfig } from '../../../vitest.config.base';

export default baseTestConfig;
```

### Step 4: Update Monorepo Configuration

#### 1. Add to `pnpm-workspace.yaml`:

```yaml
packages:
  - ecosystem/psycha/[new-workspace]
  # or
  - packages/[new-workspace]
```

#### 2. Add TypeScript paths to `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@oaknational/[workspace-name]": ["./path/to/workspace/src"],
      "@oaknational/[workspace-name]/*": ["./path/to/workspace/src/*"]
    }
  }
}
```

### Step 5: Create Initial Source Files

#### For Psycha organisms:

```typescript
// src/index.ts
export async function main() {
  console.log('[Workspace Name] - Placeholder');
  // TODO: Implement server initialization
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
```

#### For libraries/SDKs:

```typescript
// src/index.ts
export * from './types/index.js';
// Export main functionality
```

### Step 6: Install Dependencies and Verify

```bash
# Install dependencies
pnpm install

# Run quality gates
pnpm format
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

## Common Pitfalls to Avoid

1. **Missing configuration files**: All 7 config files are required
2. **Incorrect TypeScript paths**: Must be added to `tsconfig.base.json`
3. **Wrong bundle strategy**: MCP servers bundle, libraries don't
4. **Missing workspace registration**: Must add to `pnpm-workspace.yaml`
5. **Incorrect ESLint rules**: Psycha uses biological rules, packages don't
6. **Wrong chora naming**: Use singular `chora/` not plural `chorai/`
7. **Missing morphai category**: Don't forget the morphai chora for abstract patterns
8. **Test configuration**: Always use baseTestConfig, don't define standalone config

## Architecture-Specific Considerations

### For Psycha Organisms

- Must follow biological architecture (chora/organa/psychon)
- External service connectors are organs that process data
- Use dependency injection at the psychon level
- Chora categories include:
  - **morphai**: Hidden forms, Platonic patterns, abstract shapes
  - **stroma**: Core types and interfaces
  - **aither**: Logging abstractions
  - **phaneron**: Configuration handling
  - **eidola**: Environment interfaces

### For Standard Packages

- Use conventional naming (no Greek terms)
- Keep simple, focused APIs
- Document with clear examples
- Don't need `dev` script or `tsx` dependency
- Use non-bundling tsup configuration

## Testing Your New Workspace

After creation, always verify:

1. `pnpm install` succeeds
2. `pnpm lint` passes
3. `pnpm type-check` passes
4. `pnpm build` creates output in `dist/`
5. Package can be imported by other workspaces

### Test File Naming Conventions

- **Unit tests**: Must end in `*.unit.test.ts`
- **Integration tests**: Must end in `*.integration.test.ts`
- **E2E tests**: Must end in `*.e2e.test.ts` and live in `e2e-tests/` directory

### Test Execution

- Unit and integration tests run with `pnpm test`
- E2E tests are manual only - run with `pnpm test:e2e` when needed
- E2E tests may have side effects and costs, so they're excluded from regular runs

## Example: Creating an MCP Server

```bash
# 1. Create structure with all chora categories
mkdir -p ecosystem/psycha/my-service-mcp/src/{chora/{morphai,stroma,aither,phaneron,eidola},organa,psychon}

# 2. Copy configuration files from oak-curriculum-mcp-stdio
cp apps/oak-curriculum-mcp-stdio/*.{json,ts} apps/my-service-mcp/

# 3. Update package.json name and description
# 4. Add to pnpm-workspace.yaml
# 5. Add to tsconfig.base.json paths
# 6. Run pnpm install
# 7. Run quality gates: pnpm format && pnpm lint && pnpm type-check
```

## Getting Help

- Review existing workspaces for examples:
  - `apps/oak-notion-mcp` - Complete MCP server with biological architecture
  - `packages/oak-curriculum-sdk` - Standard SDK package
  - `ecosystem/histoi/histos-logger` - Adaptive tissue example
- Use sub-agents for verification:
  - `config-auditor` for configuration issues
  - `architecture-reviewer` for biological architecture
  - `code-reviewer` for general code quality
  - `test-auditor` for testing structure and patterns

## Complete Configuration Examples

### Essential Files for All Workspaces

Based on Phase 6 implementation, every workspace needs these exact files:

#### 1. package.json

Include all standard scripts for quality gates:

- `build`: Uses tsup and TypeScript for building
- `test`: Runs vitest
- `lint`: Runs ESLint
- `type-check`: TypeScript validation
- `format`: Prettier formatting

#### 2. tsconfig.json

Must include `*.config.ts` in the include array to avoid TypeScript project service errors:

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "**/*.test.ts", "*.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. tsconfig.build.json

Separates build configuration from development:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts", "tests/**/*"]
}
```

#### 4. tsconfig.lint.json

Includes all files for linting:

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts", "tests/**/*.ts", "**/*.config.ts", "**/*.test.ts", "**/*.spec.ts"],
  "exclude": ["node_modules", "dist"]
}
```

#### 5. eslint.config.ts

Must properly import and extend base configuration. For Psycha organisms:

```typescript
import { ConfigArray, config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import {
  psychaBoundaryRules,
  psychonArchitectureRules,
  commonSettings,
} from '../../../eslint-rules/index.js';

export default tsEslintConfig(
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: commonSettings.languageOptions,
    rules: {
      ...commonSettings.rules,
      ...psychaBoundaryRules,
      ...psychonArchitectureRules,
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.ts'],
  },
);
```

#### 6. tsup.config.ts

Build configuration:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: false,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
```

#### 7. vitest.config.ts

Test configuration using base config:

```typescript
import { baseTestConfig } from '../../../vitest.config.base';

export default baseTestConfig;
```

## Lessons Learned from Phase 6

### Common Configuration Issues and Fixes

1. **ESLint "Unexpected key '0' found" Error**
   - Cause: Missing or incorrect eslint.config.ts
   - Fix: Create proper ESLint configuration file with correct imports

2. **TypeScript "not found by project service" Error**
   - Cause: Config files not included in tsconfig.json
   - Fix: Add `"*.config.ts"` to the include array

3. **Unused Parameter Warnings**
   - Temporary fix: Add `void paramName;` statements
   - Proper fix: Implement the functionality or use underscore prefix

4. **Test Failures for Placeholder Packages**
   - Expected behaviour for new packages without tests
   - Add placeholder tests or skip in CI initially

### Quality Gate Sequence

Always run quality gates in this order to catch issues early:

1. `pnpm format` - Fix formatting issues
2. `pnpm lint` - Fix linting errors
3. `pnpm type-check` - Fix TypeScript errors
4. `pnpm test` - Run tests (may fail for new packages)
5. `pnpm test:e2e` - Run e2e tests if applicable

### Monorepo Integration Checklist

- [ ] Package added to pnpm-workspace.yaml
- [ ] TypeScript paths added to tsconfig.base.json
- [ ] All 7 configuration files created
- [ ] Package.json has correct name and scripts
- [ ] ESLint configuration uses correct base and rules
- [ ] Quality gates pass (except tests for placeholders)
- [ ] Package can be imported by other workspaces
- [ ] Correct dependencies (tsx only for MCP servers)
- [ ] Test naming conventions followed
- [ ] E2E tests in separate directory if applicable

## Sub-Agent Review Process

After creating a new workspace, invoke these sub-agents:

1. **config-auditor**: Validates all configuration files
2. **architecture-reviewer**: Checks biological architecture compliance (Psycha only)
3. **code-reviewer**: Reviews code quality and patterns
4. **test-auditor**: Evaluates test structure and approach

## Quick Reference: File Paths by Workspace Type

### Psycha Organism

```text
ecosystem/psycha/[name]/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.lint.json
├── eslint.config.ts
├── tsup.config.ts
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── chora/
    ├── organa/
    └── psychon/
```

### Standard Package

```text
packages/[name]/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.lint.json
├── eslint.config.ts
├── tsup.config.ts
├── vitest.config.ts
└── src/
    └── index.ts
```
