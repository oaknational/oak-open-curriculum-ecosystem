/**
 * Root ESLint Configuration
 *
 * This file is only used when running eslint from the root.
 * Workspaces define their own eslint.config.ts and consume shared standards
 * from @oaknational/eslint-plugin-standards.
 */

import { defineConfig } from 'eslint/config';
import { configs, ignores } from '@oaknational/eslint-plugin-standards';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = defineConfig(
  {
    ignores,
  },
  ...configs.strict,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: thisDir,
      },
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);
export default config;
