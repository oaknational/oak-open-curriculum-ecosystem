import path from 'node:path';
import { fileURLToPath } from 'node:url';

import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import { configs as eslintPluginNextConfigs } from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier/flat';
import { importX } from 'eslint-plugin-import-x';
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import globals from 'globals';
import { configs as tseslintConfigs, parser as tseslintParser } from 'typescript-eslint';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const importXRecommended = importX.flatConfigs.recommended;
const importXTypescript = importX.flatConfigs.typescript;

const baseIgnores = [
  './reference-repos/**',
  '**/dist/**',
  '**/node_modules/**',
  '**/.next/**',
  '**/out/**',
  '**/build/**',
  '**/.turbo/**',
  '**/coverage/**',
  'playwright-report/**',
  '.agent/**',
  '**/*.d.ts',
  '**/*.typegen.ts',
  'public/**/*.js',
  'public/**/*.mjs',
  '**/*.md',
  '**/*.json',
  '**/*.jsonc',
  '**/*.yaml',
  '**/*.yml',
  '**/.prettierignore',
  '**/.eslintignore',
  '**/.vscode/**',
  '**/.DS_Store',
];

const testGlobs = [
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/test-*.ts',
  '**/__tests__/**',
  '**/tests-snapshot/**/*.ts',
  '**/characterisation/**/*.ts',
];

const baseRules: Linter.RulesRecord = {
  'no-console': 'error',
  'no-debugger': 'error',
  'no-empty': 'error',
  'no-empty-function': 'error',
  'no-constant-condition': 'error',
  'prefer-const': 'error',
  'no-var': 'error',
};

const untypedTsRules: Linter.RulesRecord = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', {}],
  '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/no-restricted-types': [
    'error',
    {
      types: {
        'Record<string, unknown>': {
          message:
            'Avoid Record<string, unknown>. It destroys type information. Refactor or use a defined type.',
        },
      },
    },
  ],
  complexity: ['error', 8],
  'sonarjs/cognitive-complexity': ['error', 8],
  'max-lines': ['error', { max: 220, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 45, skipBlankLines: true, skipComments: true }],
  'max-statements': ['error', 20],
  'max-depth': ['error', 3],
  curly: 'error',
};

const typedTsRules: Linter.RulesRecord = {
  'import-x/no-namespace': 'error',
  'import-x/no-cycle': 'error',
  'import-x/no-self-import': 'error',
  'import-x/no-useless-path-segments': 'error',
  'import-x/no-named-as-default': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-deprecated': 'error',
  '@typescript-eslint/consistent-return': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    },
  ],
};

const testRules: Linter.RulesRecord = {
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
  'max-lines': ['error', 1000],
  'max-lines-per-function': ['error', 500],
  'max-statements': ['error', 50],
  'max-depth': ['error', 5],
  'no-console': 'off',
};

const reactStrictRules: Linter.RulesRecord = {
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-uses-react': 'off',
  'react/prop-types': 'off',
  'react/no-direct-mutation-state': 'error',
  'react/no-array-index-key': 'error',
  'react/jsx-key': 'error',
  'react/jsx-no-bind': ['error', { allowArrowFunctions: true, allowBind: false }],
  'react/no-children-prop': 'error',
  'react/no-danger-with-children': 'error',
  'react/no-deprecated': 'error',
  'react/no-unescaped-entities': 'error',
  'react/self-closing-comp': 'error',
};

export default defineConfig(
  { ignores: baseIgnores },

  eslint.configs.recommended,
  // Temporary type incompatibility, remove when fixed in Import X
  // @ts-expect-error - type incompatibility
  importXRecommended,
  importXTypescript,
  sonarjsConfigs.recommended,
  prettierConfig,
  ...tseslintConfigs.strict,
  ...tseslintConfigs.stylistic,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.node,
      },
    },
    rules: baseRules,
  },

  eslintPluginNextConfigs.recommended,
  eslintPluginNextConfigs['core-web-vitals'],

  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    settings: {
      next: {
        rootDir: projectRoot,
      },
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    rules: untypedTsRules,
  },

  {
    files: ['src/**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: projectRoot,
      },
    },
    rules: {
      ...typedTsRules,
      ...reactStrictRules,
      // No use of process.env outside of the config management lib. Prevents hard to track bugs.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'MemberExpression[object.property.name="process"][property.name="env"], MemberExpression[object.name="process"][property.name="env"]',
          message:
            'Avoid using process.env directly. In product code use the runtime config provided by the src/lib/config library instead. In test code pass simple values directly via DI.',
        },
      ],
    },
  },

  {
    files: testGlobs,
    rules: testRules,
  },

  {
    files: ['**/*.config.{ts,js,mjs,cjs}', 'scripts/**/*.{ts,js,mts,mjs}'],
    rules: {
      'no-console': 'off',
    },
  },
);
