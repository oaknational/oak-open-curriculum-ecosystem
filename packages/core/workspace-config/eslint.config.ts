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
    // Self-bootstrap ignores: this config cannot import the shared list, so the
    // one shared entry this package needs is restated. It excludes the transient
    // `tsup.config.bundled_<id>.mjs` that tsup generates and deletes while
    // bundling its config: `eslint .` enumerates it as a lint target during a
    // parallel turbo build and fails with ENOENT on the read (CI run 34459013126
    // on #116, 2026-09-10; the same class on #93, 2026-09-03). That generated
    // artefact is never lint input; the authored `tsup.config.ts` and the
    // `src/tsup.config.base.ts` module stay linted here, the same gate as the
    // shared list's since the broad tsup config patterns left that list (#125).
    ignores: ['dist', 'node_modules', '**/*.d.ts', '**/*.bundled_*.mjs'],
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
