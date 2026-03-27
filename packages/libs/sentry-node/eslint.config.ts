import { defineConfig } from 'eslint/config';
import {
  commonSettings,
  configs,
  createLibBoundaryRules,
  getOtherLibs,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const allowedLibs = new Set(['logger', 'observability']);

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
    rules: createLibBoundaryRules(
      'sentry-node',
      getOtherLibs('sentry-node').filter((lib) => !allowedLibs.has(lib)),
    ),
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
    rules: {
      ...testRules,
    },
  },
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
