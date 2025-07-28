# Phase 1 Implementation Plan

## Objective

Set up a complete development environment with all quality gates operational, enabling TDD/BDD development for the oak-notion-mcp project.

## Success Criteria

- All quality gate commands execute successfully
- Pre-commit hooks prevent non-compliant code
- Initial MCP server skeleton has passing tests
- Project is ready for TDD implementation of features

## Detailed Implementation Steps

### 1. Initialize Project Dependencies

#### 1.1 Install Core Dependencies

**Task**: Install runtime dependencies
**Command**: `pnpm add @modelcontextprotocol/sdk @notionhq/client dotenv zod`
**Verification**:

- `package.json` contains all dependencies
- `pnpm-lock.yaml` file exists
- `node_modules/` directory populated

#### 1.2 Install Development Dependencies

**Task**: Install all development tools
**Command**: `pnpm add -D typescript @types/node tsx tsup vitest @vitest/coverage-v8 supertest @types/supertest eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin husky lint-staged @commitlint/cli @commitlint/config-conventional`
**Verification**:

- All dev dependencies listed in `package.json`
- No peer dependency warnings

### 2. Configure TypeScript

#### 2.1 Create tsconfig.json

**Task**: Set up TypeScript with strict configuration
**File**: `tsconfig.json`
**Content**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

**Verification**: `pnpm tsc --noEmit` runs without errors

### 3. Configure Code Quality Tools

#### 3.1 Create ESLint Configuration

**Task**: Set up ESLint with TypeScript and Prettier
**File**: `.eslintrc.js`
**Content**:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
  },
  ignorePatterns: ['dist', 'coverage', 'node_modules', '.eslintrc.js'],
};
```

**Verification**: `pnpm eslint src` runs (may have errors initially)

#### 3.2 Create Prettier Configuration

**Task**: Configure Prettier for consistent formatting
**File**: `.prettierrc.json`
**Content**:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**File**: `.prettierignore`
**Content**:

```text
node_modules
dist
coverage
pnpm-lock.yaml
```

**Verification**: `pnpm prettier --check .` runs

### 4. Configure Testing Framework

#### 4.1 Create Vitest Configuration

**Task**: Set up Vitest for all test types
**File**: `vitest.config.ts`
**Content**:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/*.e2e.test.*', 'e2e-tests/**'],
    watchExclude: ['node_modules', 'dist', 'coverage'],
  },
});
```

**Verification**: `pnpm vitest run` executes (no tests yet)

**Note**: The default vitest config excludes E2E tests. E2E tests require manual execution with `pnpm test:e2e` because they:
- Trigger real IO operations
- May incur API costs
- Have side effects
- Should not run in CI/CD pipelines

### 5. Configure Build Tool

#### 5.1 Create tsup Configuration

**Task**: Configure tsup for building
**File**: `tsup.config.ts`
**Content**:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
});
```

**Verification**: Configuration file exists

### 6. Set Up Git Hooks

#### 6.1 Initialize Husky

**Task**: Set up git hooks
**Command**: `pnpm dlx husky-init && pnpm install`
**Verification**:

- `.husky` directory exists
- `prepare` script added to package.json

#### 6.2 Configure Pre-commit Hook

**Task**: Set up pre-commit quality gates
**File**: `.husky/pre-commit`
**Content**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**Verification**: File is executable

#### 6.3 Configure Commit Message Hook

**Task**: Enforce conventional commits
**File**: `.husky/commit-msg`
**Content**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm commitlint --edit $1
```

**Command**: `chmod +x .husky/commit-msg`
**Verification**: File is executable

#### 6.4 Create lint-staged Configuration

**Task**: Configure files to check on commit
**File**: `.lintstagedrc.json`
**Content**:

```json
{
  "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

**Verification**: Configuration file exists

#### 6.5 Create commitlint Configuration

**Task**: Configure conventional commit rules
**File**: `commitlint.config.js`
**Content**:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

**Verification**: Configuration file exists

### 7. Update Package Scripts

#### 7.1 Add All Required Scripts

**Task**: Update package.json with quality gate scripts
**File**: `package.json` (scripts section)
**Content**:

```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky install"
  }
}
```

**Verification**: All scripts execute without errors

### 8. Create Initial MCP Server Skeleton

#### 8.1 Create Main Entry Point

**Task**: Create minimal MCP server
**File**: `src/index.ts`
**Content**:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export function createServer(): Server {
  const server = new Server(
    {
      name: 'oak-notion-mcp',
      version: '0.0.0-development',
    },
    {
      capabilities: {},
    },
  );

  return server;
}

export async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}
```

**Verification**: `pnpm type-check` passes

#### 8.2 Create Initial Unit Test

**Task**: Write first unit test
**File**: `src/index.test.ts`
**Content**:

```typescript
import { describe, it, expect } from 'vitest';
import { createServer } from './index';

describe('createServer', () => {
  it('should create a server with correct name and version', () => {
    const server = createServer();
    
    expect(server).toBeDefined();
    expect(server.serverInfo.name).toBe('oak-notion-mcp');
    expect(server.serverInfo.version).toBe('0.0.0-development');
  });

  it('should create a server with empty capabilities', () => {
    const server = createServer();
    
    expect(server.serverInfo.capabilities).toEqual({});
  });
});
```

**Verification**: `pnpm test:run` shows 2 passing tests

### 9. Create Project Configuration Files

#### 9.1 Create .gitignore

**Task**: Set up git ignore rules
**File**: `.gitignore`
**Content**:

```text
# Dependencies
node_modules/

# Build output
dist/
*.tsbuildinfo

# Test coverage
coverage/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Temporary files
*.tmp
*.temp
```

**Verification**: File exists

#### 9.2 Create .env.example

**Task**: Document required environment variables
**File**: `.env.example`
**Content**:

```text
# Notion API Configuration
NOTION_API_KEY=your_notion_api_key_here
```

**Verification**: File exists

### 10. Verification and Quality Gates

#### 10.1 Run All Quality Gates

**Task**: Verify all tools work correctly
**Commands**:

```bash
pnpm format
pnpm type-check
pnpm lint
pnpm test:run
pnpm build
```

**Verification**: All commands execute successfully

#### 10.2 Test Pre-commit Hooks

**Task**: Verify git hooks work
**Commands**:

```bash
git add .
git commit -m "feat: initial project setup with quality gates"
```

**Verification**:

- Hooks run automatically
- Commit succeeds only if all checks pass

### 11. Documentation Updates

#### 11.1 Update README

**Task**: Add development instructions to README
**Action**: Append development section with:

- How to install dependencies
- How to run quality gates
- How to run tests
- How to build the project

#### 11.2 Create CHANGELOG

**Task**: Initialize changelog
**File**: `CHANGELOG.md`
**Content**:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with TypeScript
- Quality gates configuration (ESLint, Prettier, TypeScript)
- Testing framework setup (Vitest)
- Build configuration (tsup)
- Git hooks with Husky and lint-staged
- Conventional commits with commitlint
- Basic MCP server skeleton
```

**Verification**: File exists

## Completion Checklist

- [ ] All dependencies installed via pnpm
- [ ] TypeScript configured with strict mode
- [ ] ESLint and Prettier configured and working
- [ ] Vitest configured for all test types
- [ ] Build tool (tsup) configured
- [ ] Git hooks preventing non-compliant commits
- [ ] All quality gate scripts working
- [ ] Initial MCP server skeleton created
- [ ] First unit tests passing
- [ ] Project builds successfully
- [ ] Documentation updated

## Next Steps

Once Phase 1 is complete:

1. Confirm all quality gates pass
2. Make initial commit with conventional message
3. Begin Phase 2: Core MCP Implementation using TDD
