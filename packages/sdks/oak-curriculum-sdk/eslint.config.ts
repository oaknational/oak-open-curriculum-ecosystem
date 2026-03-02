/**
 * ESLint Configuration for oak-curriculum-sdk
 *
 * Applies strict Oak standards plus SDK boundary rules that prevent
 * deep imports into the generation workspace (ADR-108).
 */

import { defineConfig } from 'eslint/config';
import oakStandards, {
  ignores,
  testRules,
  commonSettings,
  createSdkBoundaryRules,
} from '@oaknational/eslint-plugin-standards';
import type { Linter } from 'eslint';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfig(
  {
    ignores: [
      ...ignores,
      'dist/**',
      'coverage/**',
      '*.log',
      '.turbo/**',
      // Local entry shims (JS)
      'code-generation/*.mjs',
      // Examples
      'examples/**',

      // E2E script snippets not part of the TS project
      'e2e-tests/scripts/**',
      'test-cache/**',
      // Documentation
      'docs/**',
    ],
  },

  // Use recommended and strict configs from standards plugin
  ...(oakStandards.configs!.strict as Linter.Config[]),

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          projectService: true,
        },
      },
    },
  },
  // SDK boundary rules: prevent deep imports into generation workspace (ADR-108)
  {
    files: ['src/**/*.ts'],
    rules: {
      ...createSdkBoundaryRules('runtime'),
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
  // Config files
  {
    files: ['eslint.config.ts', 'vitest.config.ts', 'vitest.e2e.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: thisDir,
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
);

export default config;
