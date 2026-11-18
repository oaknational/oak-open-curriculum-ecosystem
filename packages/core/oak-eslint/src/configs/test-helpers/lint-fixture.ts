/**
 * Lints an in-memory fixture under one of the package's configs, for the
 * tests that prove a config refuses a named pathogen. Shared by the strict
 * and recommended config tests.
 */
import { Linter } from '@typescript-eslint/utils/ts-eslint';
import type { TSESLint } from '@typescript-eslint/utils';

export const linter = new Linter({ configType: 'flat' });

/**
 * Type-information-requiring rules that the strict config inherits from
 * `tseslint.configs.strict` and the recommended config. Linting an
 * in-memory fixture cannot supply parser services without spawning a
 * TypeScript project, which the testing-strategy directive forbids in
 * unit tests (`testing-strategy.md` § No process spawning in in-process
 * tests). The override below disables only those typed rules so the
 * parser-free run still produces faithful coverage of the syntactic
 * rules under test.
 */
const TYPED_RULES_OFF = {
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-deprecated': 'off',
  '@typescript-eslint/consistent-return': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  'sonarjs/no-alphabetical-sort': 'off',
  'sonarjs/void-use': 'off',
  '@typescript-eslint/prefer-optional-chain': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/no-base-to-string': 'off',
  '@typescript-eslint/no-redundant-type-constituents': 'off',
  'sonarjs/concise-regex': 'off',
  'sonarjs/prefer-regexp-exec': 'off',
  'sonarjs/no-redundant-optional': 'off',
  'sonarjs/no-selector-parameter': 'off',
  'sonarjs/regex-complexity': 'off',
  'sonarjs/no-misleading-array-reverse': 'off',
  // Not a typed rule: it resolves the fixture's path against the package on
  // disk to find the test framework, which an in-memory fixture path cannot
  // satisfy.
  'sonarjs/prefer-specific-assertions': 'off',
} as const;

export const TYPED_RULES_OVERRIDE: TSESLint.FlatConfig.Config = {
  rules: TYPED_RULES_OFF,
};

export interface LintResult {
  readonly ruleIds: readonly string[];
  readonly messages: readonly TSESLint.Linter.LintMessage[];
}

export function lintFixture(
  base: TSESLint.FlatConfig.ConfigArray,
  code: string,
  filename: string,
): LintResult {
  const config: TSESLint.FlatConfig.ConfigArray = [...base, TYPED_RULES_OVERRIDE];
  const messages = linter.verify(code, config, {
    filename,
  });

  const ruleIds = messages
    .map((message) => message.ruleId)
    .filter((value): value is string => value !== null && value !== undefined);

  return { ruleIds, messages };
}
