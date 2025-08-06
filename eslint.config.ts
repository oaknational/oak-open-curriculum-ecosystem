/**
 * Root ESLint Configuration
 *
 * This file is only used when running eslint from the root.
 * Each workspace has its own eslint.config.js that extends eslint.config.base.js
 */

import { baseConfig } from './eslint.config.base.js';

export default baseConfig;
