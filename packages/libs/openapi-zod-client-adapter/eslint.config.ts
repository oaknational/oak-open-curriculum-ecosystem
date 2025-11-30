/**
 * ESLint Configuration for openapi-zod-client-adapter library
 *
 * Adapter for openapi-zod-client that enforces Zod v3/v4 boundary
 */

import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../../eslint.config.base';
import {
  createLibBoundaryRules,
  getOtherLibs,
  commonSettings,
} from '../../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
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
    rules: createLibBoundaryRules(
      'openapi-zod-client-adapter',
      getOtherLibs('openapi-zod-client-adapter'),
    ),
  },
  // Enforce Zod v4 usage, we don't want to allow Zod 3 code or types to propagate outside of this workspace.
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'zod',
              message:
                "Import from 'zod/v4' instead. Only the type-gen adapter around openapi-zod-client may import from 'zod' directly.",
            },
          ],
        },
      ],
    },
  },
  // Config files
  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
  },
);

export default config;
