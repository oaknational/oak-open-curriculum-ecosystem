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
  ],

  // Root workspace
  entry: ['scripts/**/*.{ts,mjs}'],
  project: ['scripts/**/*.{ts,mjs}'],

  // Plugin configuration
  eslint: true,
  vitest: true,
  typescript: true,

  // Workspace definitions
  workspaces: {
    'agent-tools': {
      entry: ['src/cli/**/*.ts', 'src/index.ts'],
      project: ['src/**/*.ts'],
    },
    'apps/oak-curriculum-mcp-stdio': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts', 'e2e-tests/**/*.ts'],
    },
    'apps/oak-curriculum-mcp-streamable-http': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts', 'e2e-tests/**/*.ts', 'tests/**/*.ts', 'smoke-tests/**/*.ts'],
      ignoreDependencies: [
        // Used via Clerk middleware, not direct imports
        '@clerk/backend',
        // prettier is needed for eslint-plugin-prettier
        'prettier',
      ],
    },
    'apps/oak-search-cli': {
      entry: ['src/bin/oaksearch.ts'],
      project: ['src/**/*.ts', 'e2e-tests/**/*.ts', 'ground-truths/**/*.ts'],
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
    'packages/sdks/oak-search-sdk': {
      entry: ['src/index.ts'],
      project: ['src/**/*.ts'],
    },
  },
};

export default config;
