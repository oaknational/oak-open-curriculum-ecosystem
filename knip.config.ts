import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: [
    // Stryker mutation testing (invoked via CLI, not imports)
    '@stryker-mutator/core',
    '@stryker-mutator/typescript-checker',
    '@stryker-mutator/vitest-runner',
    // Used in CI or scripts, not directly imported
    'cloc',
    // Commitlint is wired via husky hooks, not direct import
    '@commitlint/cli',
    // ESLint ecosystem: consumed transitively via typescript-eslint flat config
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    // supertest and ts-morph used in scripts/
    'supertest',
    'ts-morph',
  ],
  ignoreBinaries: [
    // External tools not installed via npm
    'gitleaks',
    // System binaries used in package.json scripts for port/process checks
    'lsof',
    'ps',
  ],

  eslint: true,
  vitest: true,
  typescript: true,

  workspaces: {
    '.': {
      entry: ['scripts/**/*.{ts,mjs}'],
      project: ['scripts/**/*.{ts,mjs}'],
    },
    'agent-tools': {
      entry: ['src/bin/**/*.ts'],
      project: ['src/**/*.ts'],
    },
    'apps/oak-curriculum-mcp-streamable-http': {
      entry: ['widget/src/main.tsx', 'smoke-tests/**/*.ts', 'e2e-tests/**/*.ts'],
      project: [
        'src/**/*.ts',
        'e2e-tests/**/*.ts',
        'tests/**/*.ts',
        'smoke-tests/**/*.ts',
        'widget/src/**/*.{ts,tsx,css}',
      ],
      ignoreDependencies: [
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
        'scripts/**/*.ts',
        'evaluation/**/*.ts',
        'ground-truths/generation/**/*.ts',
        // TypeDoc entry points (typedoc.json) — types re-exported for API documentation
        'src/lib/elastic-http.ts',
        'src/adapters/oak-adapter.ts',
        'src/adapters/oak-adapter-types.ts',
        'src/adapters/sdk-guards.ts',
      ],
      project: ['src/**/*.ts', 'ground-truths/**/*.ts', 'scripts/**/*.ts', 'evaluation/**/*.ts'],
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
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // ESLint plugins are peer dependencies used at runtime
        'eslint-plugin-prettier',
        'eslint-plugin-sonarjs',
        'globals',
      ],
    },
    'packages/core/openapi-zod-client-adapter': {
      project: ['src/**/*.ts'],
    },
    'packages/core/env': {
      project: ['src/**/*.ts'],
    },
    'packages/core/result': {
      project: ['src/**/*.ts'],
    },
    'packages/core/type-helpers': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/env-resolution': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/logger': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/search-contracts': {
      project: ['src/**/*.ts'],
    },
    'packages/sdks/oak-curriculum-sdk': {
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // @zod/core is a transitive dep of zod, required at runtime
        '@zod/core',
      ],
    },
    'packages/sdks/oak-sdk-codegen': {
      entry: ['code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      project: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      ignoreDependencies: ['@zod/core'],
    },
    'packages/libs/sentry-mcp': {
      entry: ['tests/**/*.typecheck.ts'],
      project: ['src/**/*.ts', 'tests/**/*.ts'],
    },
    'packages/sdks/oak-search-sdk': {
      project: ['src/**/*.ts'],
    },
  },
};

export default config;
