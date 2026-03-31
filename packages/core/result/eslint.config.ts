/**
 * ESLint Configuration for result library
 *
 * `Result\<T, E\>` type for explicit error handling
 */

import { defineConfig } from 'eslint/config';
import {
  configs,
  coreBoundaryRules,
  coreTestConfigRules,
  commonSettings,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  ...configs.strict,
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
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: wsTsProject,
        },
      },
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: coreBoundaryRules,
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: {
      ...testRules,
      ...coreTestConfigRules,
    },
  },
  {
    files: ['eslint.config.ts', 'vitest.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      ...coreTestConfigRules,
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
