import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Root-level configuration
  ignore: [
    '.agent/**',
    '.cursor/**',
    '.claude/**',
    '.vscode/**',
    '.husky/**',
    'docs/**',
    '**/dist/**',
    '**/node_modules/**',
  ],
  ignoreFiles: ['**/src/types/generated/**'],
  ignoreDependencies: [
    // Peer dependencies and optional deps that appear unused at root
    '@semantic-release/changelog',
    '@semantic-release/git',
    'semantic-release',
    // Stryker mutation testing (invoked via CLI, not imports)
    '@stryker-mutator/core',
    '@stryker-mutator/typescript-checker',
    '@stryker-mutator/vitest-runner',
    // Transitive dep of @stryker-mutator/core, used for type import in stryker.config.base.ts
    '@stryker-mutator/api',
    // Used in CI or scripts, not directly imported
    'cloc',
    'shellcheck',
    // Husky is wired via `prepare` script
    'husky',
    // Commitlint is wired via husky hooks, not direct import
    '@commitlint/cli',
    '@commitlint/config-conventional',
    // ESLint ecosystem: consumed transitively via typescript-eslint flat config
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    // globals is imported in eslint.config.ts files across workspaces
    'globals',
    // supertest and ts-morph used in scripts/
    'supertest',
    'ts-morph',
    // Sub-path imports from transitive deps
    '@elastic/transport',
    '@clerk/shared',
  ],
  ignoreBinaries: [
    // External tools not installed via npm
    'gitleaks',
    'playwright',
    // System binaries used in package.json scripts for port/process checks
    'lsof',
    'ps',
  ],

  // Plugin configuration
  eslint: true,
  vitest: true,
  typescript: true,

  // Workspace definitions
  workspaces: {
    '.': {
      entry: [
        'scripts/**/*.{ts,mjs}',
        'vitest.field-integrity.config.ts',
        'stryker.config.base.ts',
      ],
      project: [
        'scripts/**/*.{ts,mjs}',
        'vitest.field-integrity.config.ts',
        'stryker.config.base.ts',
      ],
    },
    'agent-tools': {
      entry: ['src/cli/**/*.ts', 'src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'apps/oak-curriculum-mcp-streamable-http': {
      entry: ['src/index.ts', 'widget/src/main.tsx', 'smoke-tests/**/*.ts'],
      project: [
        'src/**/*.ts',
        'e2e-tests/**/*.ts',
        'tests/**/*.ts',
        'smoke-tests/**/*.ts',
        'widget/src/**/*.{ts,tsx,css}',
      ],
      ignoreDependencies: [
        // Used via Clerk middleware, not direct imports
        '@clerk/backend',
        // prettier is needed for eslint-plugin-prettier
        'prettier',
        // TypeScript module augmentation: declare module 'express-serve-static-core'
        // in src/auth/mcp-auth/mcp-auth.ts and src/correlation/middleware.ts.
        // Knip cannot detect module augmentation as dependency usage.
        '@types/express-serve-static-core',
        // Consumed via CSS @import in widget/src/index.css, not a TS/JS import.
        // Knip cannot detect CSS @import as dependency usage.
        '@oaknational/oak-design-tokens',
      ],
    },
    'apps/oak-search-cli': {
      entry: [
        'bin/oaksearch.ts',
        'scripts/**/*.ts',
        'evaluation/**/*.ts',
        'ground-truths/generation/**/*.ts',
      ],
      project: [
        'src/**/*.ts',
        'e2e-tests/**/*.ts',
        'ground-truths/**/*.ts',
        'scripts/**/*.ts',
        'evaluation/**/*.ts',
      ],
      ignoreDependencies: [
        // Used via CLI tooling, not direct imports
        '@asteasolutions/zod-to-openapi',
        'typedoc-plugin-markdown',
        'vite-tsconfig-paths',
        // prettier is needed for eslint-plugin-prettier
        'prettier',
      ],
    },
    'packages/core/oak-eslint': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // ESLint plugins are peer dependencies used at runtime
        'eslint-plugin-import-x',
        'eslint-plugin-prettier',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'eslint-plugin-sonarjs',
        'eslint-plugin-tsdoc',
        'globals',
      ],
    },
    'packages/core/openapi-zod-client-adapter': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/core/env': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/core/result': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/core/type-helpers': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/libs/env-resolution': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/libs/logger': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/libs/search-contracts': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/sdks/oak-curriculum-sdk': {
      entry: ['src/index.ts', 'src/mcp-tools.ts'],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // @zod/core is a transitive dep of zod, required at runtime
        '@zod/core',
      ],
    },
    'packages/sdks/oak-sdk-codegen': {
      entry: ['src/index.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      project: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      ignoreDependencies: ['@zod/core'],
    },
    'packages/libs/sentry-mcp': {
      entry: ['src/index.ts', 'tests/**/*.typecheck.ts'],
      project: ['src/**/*.ts', 'tests/**/*.ts'],
    },
    'packages/sdks/oak-search-sdk': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
  },
};

export default config;
