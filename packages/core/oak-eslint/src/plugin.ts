import type { TSESLint } from '@typescript-eslint/utils';

import { noDynamicImportRule } from './rules/no-dynamic-import.js';
import { noEslintDisableRule } from './rules/no-eslint-disable.js';
import { noExportTrivialTypeAliasesRule } from './rules/no-export-trivial-type-aliases.js';
import { requireObservabilityEmissionRule } from './rules/require-observability-emission.js';

export const oakRuleModules = {
  'no-dynamic-import': noDynamicImportRule,
  'no-eslint-disable': noEslintDisableRule,
  'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  'require-observability-emission': requireObservabilityEmissionRule,
} satisfies NonNullable<TSESLint.FlatConfig.Plugin['rules']>;

export const oakPlugin = {
  rules: oakRuleModules,
} satisfies TSESLint.FlatConfig.Plugin;
