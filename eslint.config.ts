/**
 * Root ESLint Configuration
 *
 * This file is only used when running eslint from the root.
 * Each workspace has its own eslint.config.js that extends eslint.config.base.js
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
