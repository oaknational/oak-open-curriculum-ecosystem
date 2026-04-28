import {
  configs,
  coreBoundaryRules,
  createImportResolverSettings,
  defineConfigArray,
  ignores as globalIgnores,
  testRules,
} from '@oaknational/eslint-plugin-standards';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));
const javaScriptRuleOverrides: Record<string, 'off'> = {};

for (const config of configs.strict) {
  for (const ruleName in config.rules ?? {}) {
    if (ruleName.startsWith('@typescript-eslint/')) {
      javaScriptRuleOverrides[ruleName] = 'off';
    }
  }
}

const config = defineConfigArray(
  {
    ignores: [...globalIgnores, 'dist/**', 'coverage/**', '*.log', '.turbo/**'],
  },
  configs.strict,
  {
    files: ['src/**/*.ts'],
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
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: coreBoundaryRules,
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**/*.ts'],
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
    settings: createImportResolverSettings({ project: wsTsProject }),
    rules: testRules,
  },
  {
    files: ['build-scripts/**/*.js', 'build-scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        program: null,
        project: false,
        projectService: false,
      },
    },
    rules: {
      ...javaScriptRuleOverrides,
      complexity: 'off',
      'import-x/no-relative-parent-imports': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['*.config.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      'import-x/no-relative-packages': 'off',
      'import-x/no-relative-parent-imports': 'off',
    },
  },
);

export default config;
