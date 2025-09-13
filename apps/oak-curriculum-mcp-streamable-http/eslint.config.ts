import { config as tsEslintConfig, type ConfigArray } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base';
import {
  appBoundaryRules,
  appArchitectureRules,
  commonSettings,
} from '../../eslint-rules/index.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config: ConfigArray = tsEslintConfig(
  ...baseConfig,
  {
    ignores: ['dist/**', '*.log', '.turbo/**', '.logs/**', 'vitest.config.ts'],
  },
  // no special ignores for vitest.e2e.config.ts; treat as config file below
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
      'import-x/no-relative-parent-imports': 'off',
      ...appBoundaryRules,
      ...appArchitectureRules,
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-restricted-paths': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
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
        projectService: false,
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-array-delete': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
