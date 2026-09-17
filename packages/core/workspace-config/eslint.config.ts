/**
 * Self-bootstrap lint config.
 *
 * This package cannot consume `@oaknational/eslint-plugin-standards`: the
 * standards package's own tsup/vitest configs consume THIS package, so a
 * devDependency back onto the standards package closes a workspace cycle
 * that hard-fails every `turbo run` (measured on turbo 2.10.6). It is the
 * estate's second standards-package exemption; the first is
 * `packages/core/oak-eslint/eslint.config.ts`, hand-rolled for the same
 * self-bootstrap reason. Registration in the disabled-checks census is
 * pending — the census mechanism is item 4 of the isolation plan.
 */

import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules', '**/*.d.ts'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          defaultProject: 'tsconfig.lint.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/no-deprecated': ['error'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
    },
  },
);
