/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 *
 * Next.js 16: Using canonical eslint-config-next pattern with STRICT React Hooks rules
 * See: https://nextjs.org/docs/app/api-reference/config/eslint
 *
 * BACKUP: eslint.config.ts.backup-20251109-145702
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';

// Next.js 16 canonical imports
import { configs as eslintNextConfigs } from '@next/eslint-plugin-next';

// React plugins for strict hooks enforcement
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

import { configs as tseslintConfigs, parser as tseslintParser } from 'typescript-eslint';
import prettier from 'eslint-config-prettier/flat';
import { flatConfigs as importXFlatConfigs } from 'eslint-plugin-import-x';

import { ignores, testRules } from '../../eslint.config.base.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig([
  // Load base TypeScript rules first
  tseslintConfigs.strict,
  tseslintConfigs.stylistic,

  // Next.js 16 config
  eslintNextConfigs.recommended,
  eslintNextConfigs['core-web-vitals'],

  {
    plugins: {
      react: reactPlugin,
      // @ts-expect-error - temp type incompatibility
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      next: {
        rootDir: thisDir,
      },
      react: {
        version: 'detect',
      },
    },
  },

  // Temporary type incompatibility, remove when fixed
  // @ts-expect-error - type incompatibility
  importXFlatConfigs.recommended,
  // @ts-expect-error - type incompatibility
  importXFlatConfigs.typescript,

  // Prettier must come after other configs to override formatting rules
  prettier,

  // Override default ignores of eslint-config-next
  globalIgnores([...ignores, '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // React and TypeScript rules for source files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        // project: './tsconfig.lint.json',
        tsconfigRootDir: thisDir,
      },
    },

    rules: {
      // ============================================================
      // STRICT REACT HOOKS RULES
      // ============================================================
      'react-hooks/rules-of-hooks': 'error', // Enforces Rules of Hooks (no conditionals, loops, etc.)
      'react-hooks/exhaustive-deps': 'error', // Enforces exhaustive dependency arrays (STRICT - error not error)

      // ============================================================
      // REACT RULES - Next.js 16 Compatible
      // ============================================================
      'react/react-in-jsx-scope': 'off', // Not needed with automatic JSX transform
      'react/jsx-uses-react': 'off', // Not needed with automatic JSX transform
      'react/prop-types': 'off', // Using TypeScript for prop validation

      // Additional strict React rules
      'react/no-direct-mutation-state': 'error',
      'react/no-array-index-key': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-bind': ['error', { allowArrowFunctions: true, allowBind: false }],
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-unescaped-entities': 'error',
      'react/self-closing-comp': 'error',

      // ============================================================
      // COMPLEXITY RULES
      // ============================================================
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],
    },
  },

  // Test file rules
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-*.ts',
      '**/__tests__/**',
    ],
    rules: {
      ...testRules,
    },
  },
]);

export default eslintConfig;
