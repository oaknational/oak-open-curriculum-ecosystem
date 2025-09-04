/**
 * ESLint Configuration for mcp-histos-logger
 *
 * Logger tissue for multi-runtime support
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import {
  createHistoiBoundaryRules,
  getOtherTissues,
  commonSettings,
} from '../../../eslint-rules/index.js';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootTsProject = fileURLToPath(new URL('../../../tsconfig.lint.root.json', import.meta.url));
const repoRootDir = dirname(rootTsProject);

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: rootTsProject,
        tsconfigRootDir: repoRootDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: rootTsProject,
        },
      },
    },
    rules: createHistoiBoundaryRules('histos-logger', getOtherTissues('histos-logger')),
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
