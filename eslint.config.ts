/**
 * Root ESLint Configuration
 *
 * This file is only used when running eslint from the root.
 * Each workspace has its own eslint.config.js that extends eslint.config.base.js
 */

import { baseConfig } from './eslint.config.base';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const thisDir = dirname(fileURLToPath(import.meta.url));

const config = [
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: thisDir,
      },
    },
  },
];
export default config;
