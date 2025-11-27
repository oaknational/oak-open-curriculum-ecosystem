import { defineConfig } from 'eslint/config';
import { baseConfig } from '../../eslint.config.base';
import {
  appBoundaryRules,
  appArchitectureRules,
  commonSettings,
} from '../../eslint-rules/index.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import globals from 'globals';
import eslint from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';

const thisDir = dirname(fileURLToPath(import.meta.url));
// const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = defineConfig(
  // JavaScript files configuration - separate from TypeScript config
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...importX.flatConfigs.recommended.rules,
    },
  },
  // TypeScript configuration - exclude JS files
  ...defineConfig(
    ...baseConfig,
    {
      ignores: [
        'dist/**',
        '*.log',
        '.turbo/**',
        '.logs/**',
        'vitest.config.ts',
        '**/*.js',
        'temp-secrets/**',
        'smoke-tests/auth/**',
        '../../.agent/reference-docs/**',
      ],
    },
    // no special ignores for vitest.e2e.config.ts; treat as config file below
    {
      files: ['**/*.ts'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          // project: wsTsProject,
          tsconfigRootDir: thisDir,
          // Allow files not explicitly included in the project to still be linted
          // allowDefaultProject: true,
        },
      },
      settings: {
        ...commonSettings,
        'import-x/resolver': {
          ...commonSettings['import-x/resolver'],
          typescript: {
            ...commonSettings['import-x/resolver'].typescript,
            // project: wsTsProject,
            projectService: true,
          },
        },
      },
      rules: {
        'import-x/no-relative-parent-imports': 'off',
        ...appBoundaryRules,
        ...appArchitectureRules,
        'max-lines-per-function': ['error', { max: 50, skipComments: true, skipBlankLines: true }],
      },
    },
    {
      files: ['**/*.ts'],
      /** @todo remove once we start .agent/plans/quality-and-maintainability/di-architecture-consistency.md */
      ignores: ['**/*.test.ts', '**/*.spec.ts', 'smoke-tests/**', 'e2e-tests/**'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector:
              'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
            message:
              'Avoid using process.env directly. In product code use the runtime config provided by the env library instead. In test code pass simple values directly via DI.',
          },
        ],
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'import-x/no-relative-parent-imports': 'off',
        'import-x/no-restricted-paths': 'off',
        '@typescript-eslint/no-restricted-imports': 'off',
        'max-lines-per-function': ['error', { max: 220, skipComments: true, skipBlankLines: true }],
      },
    },
    {
      files: [
        '**/*.config.ts',
        'eslint.config.ts',
        'eslint.config.base.ts',
        'vitest.config.ts',
        'vitest.e2e.config.ts',
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
          // project: './tsconfig.json',
          tsconfigRootDir: thisDir,
        },
      },
      rules: {
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-array-delete': 'off',
        '@typescript-eslint/no-restricted-imports': 'off',
        'import-x/no-relative-parent-imports': 'off',
        'max-lines-per-function': ['error', { max: 200, skipComments: true, skipBlankLines: true }],
      },
    },
  ),
);

export default config;
