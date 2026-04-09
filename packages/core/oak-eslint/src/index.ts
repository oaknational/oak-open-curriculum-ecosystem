import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
import { noEslintDisableRule } from './rules/no-eslint-disable.js';
// import { boundaryRules } from './rules/boundary.js'; // We will need to wrap the boundary logic in a rule or config export

/**
 * Re-exports boundary rules and helpers from the boundary module.
 *
 * @remarks
 * TODO: For now, we are exporting the raw logic as we did in eslint-rules.
 * We should aim to expose them as proper configs or rules.
 */
export {
  coreBoundaryRules,
  createDesignBoundaryRules,
  createLibBoundaryRules,
  createSdkBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
} from './rules/boundary.js';

export const rules = {
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  'no-eslint-disable': noEslintDisableRule,
};

import { recommended } from './configs/recommended.js';
import { strict } from './configs/strict.js';
import { react } from './configs/react.js';
import { next } from './configs/next.js';

import type { Linter } from 'eslint';
import type { TSESLint } from '@typescript-eslint/utils';

export const configs: Record<string, Linter.Config[]> = {
  recommended: Array.isArray(recommended) ? recommended : [recommended],
  strict: Array.isArray(strict) ? strict : [strict],
  react: Array.isArray(react) ? react : [react],
  next: Array.isArray(next) ? next : [next],
};

/**
 * ESLint plugin for Oak National Academy standards.
 *
 * Typed as `FlatConfig.Plugin` from typescript-eslint rather than core
 * `ESLint.Plugin` because the latter's `rules` expects `Rule.RuleModule`
 * which is structurally incompatible with typescript-eslint's `RuleModule`.
 * `FlatConfig.Plugin` uses `LooseRuleDefinition` which bridges this gap.
 */
const plugin: TSESLint.FlatConfig.Plugin = {
  rules: rules,
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
  'tmp/',
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
  // Generated TypeDoc output
  '**/docs/api/',
  '**/docs/api-md/',
  // Test results
  '**/test-results/',
  '**/coverage/',
];

/**
 * Common rules for test files.
 *
 * Structural limits (max-lines, max-lines-per-function) are relaxed for
 * test files because describe blocks legitimately grow.
 *
 * Tests may import workspace-local devDependencies, but they still must
 * declare those packages in the workspace manifest rather than relying on
 * the repo root toolchain.
 *
 * Type-safety and global-state rules are set to 'warn' pending promotion
 * to 'error'. See e2e-vi-mock-clerk-removal.plan.md for the phased
 * promotion schedule.
 *
 * @see ADR-078 for the dependency injection rationale behind the vi.mock ban
 * @see principles.md "No type shortcuts" — applies to test code equally
 */
export const testRules = {
  'max-lines': ['error', 700],
  'max-lines-per-function': ['error', 1000],
  '@typescript-eslint/consistent-type-assertions': [
    'warn',
    {
      assertionStyle: 'never',
    },
  ],
  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/consistent-type-definitions': 'off',
  '@typescript-eslint/no-restricted-types': 'off',
  '@typescript-eslint/unbound-method': 'off',
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: false,
      includeTypes: false,
    },
  ],
  'import-x/no-named-as-default-member': 'off',
} as const satisfies Linter.RulesRecord;

export default plugin;
