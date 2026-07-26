import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { createNodeResolver } from 'eslint-plugin-import-x';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules', '**/*.d.ts'],
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
          patterns: [
            {
              group: ['posthog-node', 'posthog-node/*', 'posthog-node/**'],
              message: 'Only packages/libs/posthog-node may import PostHog vendor SDKs.',
            },
            {
              group: ['@posthog/mcp', '@posthog/mcp/*', '@posthog/mcp/**'],
              message: 'Only packages/libs/posthog-node may import PostHog vendor SDKs.',
            },
          ],
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
