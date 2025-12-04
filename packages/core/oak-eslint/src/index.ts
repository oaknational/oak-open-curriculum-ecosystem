import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
// import { boundaryRules } from './rules/boundary.js'; // We will need to wrap the boundary logic in a rule or config export

// For now, we are exporting the raw logic as we did in eslint-rules
// But we should aim to expose them as proper configs or rules
export {
  coreBoundaryRules,
  coreTestConfigRules,
  createLibBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
  LIB_PACKAGES,
  getOtherLibs,
} from './rules/boundary.js';

export const rules = {
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
};

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

import type { Linter } from 'eslint';

export const configs: Record<string, Linter.Config[]> = {
  recommended: Array.isArray(recommended) ? recommended : [recommended],
  strict: Array.isArray(strict) ? strict : [strict],
  react: Array.isArray(react) ? react : [react],
  next: Array.isArray(next) ? next : [next],
};

import type { ESLint } from 'eslint';

const plugin: ESLint.Plugin = {
  rules: rules as any,
  configs: configs,
};

/**
 * Common settings shared across all ESLint configurations.
 * Includes import resolver settings for TypeScript.
 */
export const commonSettings = {
  'import-x/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
} as const;

/**
 * Global ignore patterns for ESLint.
 * Includes build artifacts, test results, and documentation.
 */
export const ignores = [
  'dist/',
  'node_modules/',
  '**/*.d.ts',
  'commitlint.config.js',
  '**/tsup.config.ts',
  'reference/',
  'research/',
  // Ignore ephemeral bundled config artifacts (e.g., tsup.config.bundled_*.mjs)
  '**/tsup.config.*',
  '**/*.bundled_*.mjs',
  // Generated TSDoc files
  '**/docs/_typedoc_src/**',
  '**/docs/api/',
  '**/docs/api-md/',
  // Test results
  '**/test-results/',
  '**/coverage/',
];

/**
 * Common rules for test files.
 * Loosens some strictness for testing contexts (e.g., assertions, magic numbers).
 */
export const testRules: Linter.RulesRecord = {
  'max-lines': ['error', 700],
  'max-lines-per-function': ['error', 1000],
  '@typescript-eslint/consistent-type-assertions': [
    'off',
    {
      assertionStyle: 'as',
    },
  ],
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/consistent-type-definitions': 'off',
  '@typescript-eslint/no-restricted-types': 'off',
  '@typescript-eslint/unbound-method': 'off',
  'import-x/no-named-as-default-member': 'off',
};

export default plugin;
