/**
 * ESLint Configuration for type-helpers
 *
 * Typed Object.* wrappers that preserve key and value types.
 */

import {
  configs,
  coreBoundaryRules,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const javaScriptRuleOverrides: Record<string, 'off'> = {};

for (const strictConfig of configs.strict) {
  for (const ruleName in strictConfig.rules ?? {}) {
    if (ruleName.startsWith('@typescript-eslint/')) {
      javaScriptRuleOverrides[ruleName] = 'off';
    }
  }
}

const config = defineConfigArray(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  configs.strict,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: false,
        project: wsTsProject,
        tsconfigRootDir: thisDir,
      },
    },
    settings: createImportResolverSettings({ project: wsTsProject }),
  },
  {
    files: ['src/**/*.ts'],
    rules: coreBoundaryRules,
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: testRules,
  },
  {
    files: ['*.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
  {
    // Stryker's config must be `.mjs` (auto-discovery — see its docstring),
    // so it belongs to no tsconfig and typed linting cannot serve it.
    // Untyped parse with the typed rules off, per the build-metadata
    // precedent for plain-JS files; every non-TS rule still applies.
    files: ['stryker.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        program: null,
        project: false,
        projectService: false,
      },
    },
    rules: {
      ...javaScriptRuleOverrides,
      // JSDoc `@type {import(...)}` is the typing mechanism for a plain-JS
      // config; TSDoc grammar defines no typing tags, so its syntax rule
      // cannot apply to this file.
      'tsdoc/syntax': 'off',
    },
  },
);

export default config;
