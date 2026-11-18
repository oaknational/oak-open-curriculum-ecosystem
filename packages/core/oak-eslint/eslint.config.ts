import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';

import { POSTHOG_VENDOR_IMPORT_PATTERNS } from './src/rules/boundary.js';

export default defineConfig(
  {
    // Self-bootstrap ignores: this config cannot import the shared list, so the
    // one shared entry this package needs is restated. It excludes the transient
    // `tsup.config.bundled_<id>.mjs` that tsup generates and deletes while
    // bundling its config: `eslint .` enumerates it as a lint target during a
    // parallel turbo build and fails with ENOENT on the read (CI run 34459013126
    // on #116, 2026-09-10; the same class on #93, 2026-09-03). That generated
    // artefact is never lint input; the authored `tsup.config.ts` stays linted
    // here, the same gate as the shared list's since the broad tsup config
    // patterns left that list (#125).
    ignores: ['dist', 'node_modules', '**/*.d.ts', '**/*.bundled_*.mjs'],
  },
  {
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: import.meta.dirname,
        }),
        createNodeResolver(),
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          defaultProject: 'tsconfig.eslint.json',
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
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: POSTHOG_VENDOR_IMPORT_PATTERNS,
        },
      ],
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
