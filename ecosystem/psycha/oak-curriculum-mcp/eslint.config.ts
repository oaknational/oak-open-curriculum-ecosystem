/**
 * ESLint Configuration for oak-curriculum-mcp
 *
 * The Curriculum phenotype - enforces biological architecture pattern
 */

import { config as tsEslintConfig } from 'typescript-eslint';
import { baseConfig } from '../../../eslint.config.base';
import {
  psychaBoundaryRules,
  psychonArchitectureRules,
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
    ignores: ['dist/**', '*.log', '.turbo/**', '.logs/**'],
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
    rules: {
      // Enforce module boundaries
      'import-x/no-relative-parent-imports': 'off',
      ...psychaBoundaryRules,
      ...psychonArchitectureRules,
      '@typescript-eslint/no-restricted-types': [
        // temp disable until we have allow in error handling
        'off',
        {
          types: {
            unknown: {
              message:
                'Avoid `unknown`. Prefer a specific union, a domain model, or a generic parameter (e.g. <T>), so callers/implementations have a concrete type. The only exception is incoming data from network requests, or data read from files, which should be validated.',
            },
          },
        },
      ],
    },
  },
  // Organa modules - Allow imports within the same organ
  {
    files: ['src/organa/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Psychon (legacy) & App (new) layer can import from any organ
  // Transitional duplication per Part 1 mechanical normalisation (no behavioural change)
  {
    files: ['src/index.ts', 'src/psychon/**/*.ts', 'src/app/**/*.ts'],
    rules: {
      'import-x/no-restricted-paths': 'off',
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-internal-modules': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Entry point can import psychon
  {
    files: ['src/index.ts'], // remains same; index already whitelisted above for app/psychon access
    rules: {
      'import-x/no-internal-modules': 'off',
    },
  },
  // Test files can break boundaries but should maintain type safety
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
    },
  },
  // Config files (TS)
  {
    files: ['**/*.config.ts', 'eslint.config.ts', 'eslint.config.base.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
