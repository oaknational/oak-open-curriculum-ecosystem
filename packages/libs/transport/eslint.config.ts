/**
 * ESLint Configuration for transport library
 *
 * STDIO transport for MCP servers
 */

import { defineConfig } from 'eslint/config';
import {
  configs,
  createLibBoundaryRules,
  getOtherLibs,
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
    rules: {
      ...createLibBoundaryRules('transport', getOtherLibs('transport')),
      // No type assertions allowed - must use type predicates or proper typing
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      // Libraries must not access Node.js globals directly
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message:
            'Libraries must not access process directly. IO interfaces must be injected as dependencies from the consuming application.',
        },
        {
          name: '__dirname',
          message:
            'Libraries must not access __dirname directly. File paths must be injected as dependencies.',
        },
        {
          name: '__filename',
          message:
            'Libraries must not access __filename directly. File paths must be injected as dependencies.',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: {
      ...testRules,
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
