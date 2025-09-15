/**
 * ESLint Configuration for transport library
 *
 * STDIO transport for MCP servers
 */

import { config as tsEslintConfig, type ConfigArray } from 'typescript-eslint';
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

const config: ConfigArray = tsEslintConfig(
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
