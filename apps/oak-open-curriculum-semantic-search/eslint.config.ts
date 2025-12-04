/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 *
 * Next.js 16: Using canonical eslint-config-next pattern with STRICT React Hooks rules
 * See: https://nextjs.org/docs/app/api-reference/config/eslint
 */

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { defineConfig, globalIgnores } from 'eslint/config';
import { parser as tseslintParser } from 'typescript-eslint';
import { configs, ignores, testRules } from '@oaknational/eslint-plugin-standards';

const thisDir = dirname(fileURLToPath(import.meta.url));

const eslintConfig = defineConfig(
  // Override default ignores of eslint-config-next
  globalIgnores([...ignores, '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // Use the recommended config from our standards plugin (includes TS, Prettier, Import-X)
  ...configs.strict,

  // Use the Next.js config from our standards plugin (includes React, React Hooks, Next.js)
  ...configs.next,

  // React and TypeScript rules for source files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      next: {
        rootDir: thisDir,
      },
    },
    rules: {
      // ============================================================
      // STRICT REACT HOOKS RULES
      // ============================================================
      'react-hooks/exhaustive-deps': 'error', // Enforces exhaustive dependency arrays

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
);

export default eslintConfig;
