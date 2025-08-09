/**
 * ESLint Configuration for histos-transport
 *
 * STDIO transport tissue for MCP servers
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

const config = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: './tsconfig.lint.json',
        },
      },
    },
    rules: {
      ...createHistoiBoundaryRules('histos-transport', getOtherTissues('histos-transport')),
      // No type assertions allowed - must use type predicates or proper typing
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      // Histoi tissues must not access Node.js globals directly
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message:
            'Histoi tissues must not access process directly. IO interfaces must be injected as dependencies from the consuming organism.',
        },
        {
          name: '__dirname',
          message:
            'Histoi tissues must not access __dirname directly. File paths must be injected as dependencies.',
        },
        {
          name: '__filename',
          message:
            'Histoi tissues must not access __filename directly. File paths must be injected as dependencies.',
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
