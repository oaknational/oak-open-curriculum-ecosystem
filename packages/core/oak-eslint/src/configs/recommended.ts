import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import sonarjs from 'eslint-plugin-sonarjs';
import tsdocPlugin from 'eslint-plugin-tsdoc';

import { oakPlugin } from '../plugin.js';

/**
 * Shared plugin registration for the `@oaknational` namespace.
 *
 * This wires the same plugin definition that `src/index.ts` exports so the
 * packaged rule inventory and the rules available through
 * `configs.recommended` cannot drift apart.
 *
 * `require-observability-emission` is registered here (rule available)
 * but not activated in the recommended rule set. Per ADR-162 Phase 5
 * acceptance, each `apps/*` and `packages/sdks/*` workspace enables the
 * rule at `warn` in its own flat config. Preset-level activation is
 * deliberately avoided so the rule never fires outside its intended scope.
 */
/**
 * Restricted types shared between recommended and strict configs.
 *
 * Strict config spreads this and adds FORBIDDEN-prefixed overrides
 * plus strict-only additions. Adding a type here automatically
 * includes it in strict — no duplication needed.
 */
export const RECOMMENDED_RESTRICTED_TYPES = {
  'Record<string, unknown>': {
    message:
      'Avoid Record<string, unknown>. Use an existing internal or library type where possible.',
  },
  'Record<string, undefined>': {
    message:
      'Avoid Record<string, undefined>. Use an existing internal or library type where possible. If keys are optional, prefer Partial.',
  },
  'Readonly<Record<string, undefined>>': {
    message:
      'Avoid Readonly<Record<string, undefined>>. Use an existing internal or library type where possible.',
  },
  'Record<PropertyKey, undefined>': {
    message:
      'Avoid Record<PropertyKey, undefined>. Use an existing internal or library type where possible.',
  },
} as const;

export const recommended = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  // sonarjs plugin is registered but no rules are currently activated.
  // Full `sonarjs.configs.recommended` activation is tracked by the
  // sonarjs-activation-and-sonarcloud-backlog plan in
  // .agent/plans/architecture-and-infrastructure/current/ — flip the
  // entry below back to `sonarjs.configs.recommended` when the plan is
  // in its GREEN phase.
  { plugins: { sonarjs } },
  prettierConfig,
  {
    plugins: {
      tsdoc: tsdocPlugin,
      '@oaknational': oakPlugin,
    },
    rules: {
      // Types
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
      curly: 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'never',
        },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-restricted-types': [
        'error',
        {
          types: RECOMMENDED_RESTRICTED_TYPES,
        },
      ],

      // Type imports and exports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',

      // Complexity
      complexity: ['error', { max: 8 }],
      'max-depth': ['error', 3],
      'max-statements': ['error', 20],
      'max-lines-per-function': ['error', 50],
      'max-lines': ['error', 250],

      // General good practices
      'no-console': 'error',
      'no-debugger': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-constant-condition': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/consistent-return': 'error',

      // Import rules
      'import-x/no-namespace': 'error',
      'import-x/no-cycle': ['error'],
      'import-x/no-useless-path-segments': ['error'],
      'import-x/no-named-as-default': 'error',

      '@oaknational/no-eslint-disable': 'error',
      '@oaknational/no-dynamic-import': 'error',

      // TSDoc
      'tsdoc/syntax': 'error',

      // Prevent export *
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message:
            'Avoid export * from "module" syntax to improve tree shaking. Use named exports instead.',
        },
      ],
    },
  },
);
