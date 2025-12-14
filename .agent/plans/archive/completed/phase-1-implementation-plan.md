# Phase 1 Implementation Plan - COMPLETE

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
**Command**: `pnpm add -D typescript @types/node tsx tsup vitest @vitest/coverage-v8 supertest @types/supertest eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin husky lint-staged @commitlint/cli @commitlint/config-conventional semantic-release @semantic-release/git @semantic-release/changelog`
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
    "module": "ESNext",
    "moduleResolution": "bundler",
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

**Task**: Set up ESLint 9 with flat config for TypeScript and Prettier
**File**: `eslint.config.js`
**Content**:

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '**/*.d.ts',
      '.eslintrc.js',
      'commitlint.config.js',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
    },
  },
  {
    files: ['**/*.config.js', '**/*.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
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
    include: ['**/*.unit.test.ts', '**/*.integration.test.ts', '**/*.api.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'e2e-tests/**'],
    watchExclude: ['node_modules', 'dist', 'coverage'],
  },
});
```

**Verification**: `pnpm vitest run` executes (no tests yet)

**Note**: The vitest config follows the test naming conventions:

- Unit tests: `*.unit.test.ts` (no IO, no mocks, pure functions only)
- Integration tests: `*.integration.test.ts` (no IO, simple mocks allowed)
- API tests: `*.api.test.ts` (no IO, mocks allowed, uses Supertest)
- E2E tests: `*.e2e.test.ts` (in `e2e-tests/` directory, real IO allowed)

### 5. Configure Build Tool

#### 5.1 Create tsup Configuration

**Task**: Configure tsup for building
**File**: `tsup.config.ts`
**Content**:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // ESM only as requested
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // Keep readable for development
  target: 'es2022', // Match our tsconfig target
  platform: 'node',
  tsconfig: './tsconfig.json',
  shims: false, // No CJS shims needed for ESM-only
  external: [
    // Don't bundle these dependencies
    '@modelcontextprotocol/sdk',
    '@notionhq/client',
    'dotenv',
    'zod',
  ],
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

echo "🔍 Running pre-commit checks..."

echo "🔤 Running type checks..."
pnpm type-check

echo "📝 Formatting and linting staged files..."
pnpm exec lint-staged

echo "🧪 Running tests on changed files..."
pnpm test:changed

echo "✅ Pre-commit checks completed!"
```

**Verification**: File is executable

#### 6.3 Configure Pre-push Hook

**Task**: Set up comprehensive pre-push validation
**File**: `.husky/pre-push`
**Content**:

```bash
#!/usr/bin/env sh

echo "🚀 Running pre-push checks..."

# Check formatting (don't modify files)
echo "📝 Checking formatting..."
if ! pnpm format:check; then
  echo "❌ Formatting issues found!"
  echo "💡 Run 'pnpm format' to fix formatting issues, then commit the changes"
  exit 1
fi

# Run full lint (without --fix to avoid modifications)
echo "🔍 Running full lint..."
pnpm lint

# Run full type-check
echo "🔤 Running full type-check..."
pnpm type-check

# Run full (in-process) test suite
echo "🧪 Running full test suite..."
pnpm test

echo "✅ All pre-push checks passed!"
```

**Verification**: File is executable

#### 6.4 Configure Commit Message Hook

**Task**: Enforce conventional commits
**File**: `.husky/commit-msg`
**Content**:

```bash
pnpm dlx commitlint --edit $1
```

**Verification**: File is executable

#### 6.5 Create lint-staged Configuration

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

#### 6.6 Create commitlint Configuration

**Task**: Configure conventional commit rules
**File**: `commitlint.config.js`
**Content**:

```javascript
export default {
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
    "test:changed": "vitest run --changed",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky"
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

// Pure function - no side effects, returns the same result for same input
export function createServer(): Server {
  const server = new Server(
    {
      name: 'oak-notion-mcp',
      version: '0.0.0-development',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    },
  );

  return server;
}

export async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}
```

**Verification**: `pnpm type-check` passes

#### 8.2 Create Initial Unit Test

**Task**: Write first unit test
**File**: `src/index.unit.test.ts`
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

  it('should create a server with MCP capabilities', () => {
    const server = createServer();

    expect(server.serverInfo.capabilities).toHaveProperty('resources');
    expect(server.serverInfo.capabilities).toHaveProperty('tools');
    expect(server.serverInfo.capabilities).toHaveProperty('prompts');
  });
});
```

**Verification**: `pnpm test:run` shows 2 passing tests

#### 8.3 Create E2E Test Configuration

**Task**: Set up separate Vitest config for E2E tests
**File**: `vitest.e2e.config.ts`
**Content**:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['e2e-tests/**/*.e2e.test.ts'],
    testTimeout: 30000, // E2E tests may take longer
    hookTimeout: 30000,
  },
});
```

**Verification**: Configuration file exists

#### 8.4 Create E2E Tests Directory

**Task**: Create directory structure for E2E tests
**Commands**:

```bash
mkdir -p e2e-tests
echo "# E2E Tests\n\nEnd-to-end tests that use real IO operations." > e2e-tests/README.md
```

**Verification**: `e2e-tests/` directory exists

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

# Optional: MCP Server Configuration
# MCP_TIMEOUT=30000
# MCP_LOG_LEVEL=info
```

**Verification**: File exists

#### 9.3 Update package.json metadata

**Task**: Add proper package metadata for npm publishing
**Update**: `package.json`
**Additional fields to add**:

```json
{
  "name": "oak-notion-mcp",
  "version": "0.0.0-development",
  "description": "Model Context Protocol server for Notion integration",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "bin": {
    "oak-notion-mcp": "./dist/index.js"
  },
  "files": ["dist"],
  "keywords": ["mcp", "notion", "ai", "llm", "claude"],
  "repository": {
    "type": "git",
    "url": "https://github.com/oaknational/oak-notion-mcp.git"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

**Verification**: Package metadata is complete

#### 9.4 Create semantic-release configuration

**Task**: Configure automated releases
**File**: `.releaserc.json`
**Content**:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "npmPublish": false
      }
    ],
    "@semantic-release/git",
    "@semantic-release/github"
  ]
}
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

### 12. GitHub Actions Setup

#### 12.1 Create CI Workflow

**Task**: Set up continuous integration
**File**: `.github/workflows/ci.yml`
**Purpose**: Run quality gates on every push and pull request

#### 12.2 Create Release Workflow

**Task**: Set up automated releases
**File**: `.github/workflows/release.yml`
**Purpose**: Run semantic-release on push to main branch

## Completion Checklist

- [x] All dependencies installed via pnpm
- [x] TypeScript configured with strict mode (ESM-only)
- [x] ESLint 9 flat config and Prettier configured and working
- [x] Vitest configured for all test types (E2E tests separated)
- [x] Build tool (tsup) configured with ESM-only output
- [x] Git hooks preventing non-compliant commits
- [x] All quality gate scripts working
- [x] Initial MCP server skeleton with stdio transport
- [x] Server capabilities for resources, tools, and prompts
- [x] First unit tests passing
- [x] Project builds successfully
- [x] Package.json ready for npm publishing
- [x] Documentation updated
- [x] GitHub Actions for CI/CD

## Next Steps

Once Phase 1 is complete:

1. Confirm all quality gates pass
2. Make initial commit with conventional message
3. Begin Phase 2: Core MCP Implementation using TDD

## Testing Philosophy Reminder

As per our testing strategy:

- **Always use TDD and BDD in parallel**
- **Prefer pure functions** - Design code to minimize side effects
- **Test hierarchy**: Unit > Integration > API > E2E
- **No IO in tests** except E2E tests
- **No mocks in unit tests** - Unit tests verify pure functions only
- **Co-locate tests** with the code they test (except E2E)

Remember: Write tests FIRST, then write the minimal code to make them pass.
