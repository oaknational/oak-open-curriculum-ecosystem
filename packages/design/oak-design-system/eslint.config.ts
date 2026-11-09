import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  configs,
  createImportResolverSettings,
  createDesignBoundaryRules,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfigArray(
  {
    ignores: [
      ...globalIgnores,
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // Non-production studio material (ADR-213; .dependency-cruiser.mjs and
      // .prettierignore fence the same tree): vendored reveal.js under its own
      // upstream licence, plus the byte-preserved MCP-137 capture tiers.
      'studio-source/**',
      // Committed build output of src/oak-theme.ts (its source is linted).
      'oak-theme.js',
      // design-sync derived entries (gitignored, regenerated on demand).
      'oak-flat.generated.css',
      '_ds_bundle.generated.css',
      '.sync-staging/**',
    ],
  },
  configs.strict,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { projectService: false, project: wsTsProject, tsconfigRootDir: thisDir },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: createDesignBoundaryRules('oak-design-system'),
  },
  // The runtime is a browser classic script whose public contract IS
  // window.oakTheme: the file's Window augmentation types that property, and
  // a script file cannot carry the same augmentation on `typeof globalThis`
  // (declare global is module-only), so the rule's environment-agnostic
  // preference cannot apply to this one surface. Scoped configuration for a
  // legitimate design, not a blanket disable (configure-checks-not-blindly-obey).
  {
    files: ['src/oak-theme.ts'],
    rules: {
      'unicorn/prefer-global-this': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '*.config.ts', '*.config.mts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
      parserOptions: { projectService: false, project: wsTsProject, tsconfigRootDir: thisDir },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: { ...testRules },
  },
  // These integration suites' system under test IS the emitted
  // dist/oak-theme.js on disk — reading it (and the committed root copy)
  // is constitutive of what they prove; a no-IO seam would test the
  // source instead of the shipped bytes. The hermetic-test IO restriction
  // therefore does not apply to them. Value composition on top of the
  // testRules block above — never replacement.
  {
    files: ['**/*.integration.test.ts'],
    rules: {
      '@oaknational/no-real-io-in-tests': 'off',
      // The storage fakes must model the REAL browser API's failure shape —
      // localStorage THROWS on denial/quota — because the runtime's
      // try/catch over that boundary is the behaviour under test. ADR-088's
      // Result translation belongs in product code at the boundary, never
      // inside a fake standing in for the browser itself.
      '@oaknational/no-throw-statement': 'off',
    },
  },
  {
    files: ['eslint.config.ts', 'vitest.config.mts'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json', tsconfigRootDir: thisDir },
    },
    rules: {
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
