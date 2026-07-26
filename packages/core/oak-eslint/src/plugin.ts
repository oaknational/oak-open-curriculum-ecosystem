import type { TSESLint } from '@typescript-eslint/utils';

import { noAgentSubstrateAccessRule } from './rules/no-agent-substrate-access.js';
import { noDynamicImportRule } from './rules/no-dynamic-import.js';
import { noEslintDisableRule } from './rules/no-eslint-disable.js';
import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
import { noPostHogVendorImportsRule } from './rules/no-posthog-vendor-imports.js';
import { noRealIoInTestsRule } from './rules/no-real-io-in-tests.js';
import { noThrowStatementRule } from './rules/no-throw-statement.js';
import { requireObservabilityEmissionRule } from './rules/require-observability-emission.js';

export const oakRuleModules = {
  'no-agent-substrate-access': noAgentSubstrateAccessRule,
  'no-dynamic-import': noDynamicImportRule,
  'no-eslint-disable': noEslintDisableRule,
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  'no-posthog-vendor-imports': noPostHogVendorImportsRule,
  'no-real-io-in-tests': noRealIoInTestsRule,
  'no-throw-statement': noThrowStatementRule,
  'require-observability-emission': requireObservabilityEmissionRule,
} satisfies NonNullable<TSESLint.FlatConfig.Plugin['rules']>;

export const oakPlugin = {
  rules: oakRuleModules,
} satisfies TSESLint.FlatConfig.Plugin;
