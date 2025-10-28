/**
 * ESLint Custom Rules Index
 *
 * Central export point for all custom ESLint rules and configurations
 * for the standardised architecture (core, libs, apps)
 */

import { noExportTrivialTypeAliasesRule } from './no-export-trivial-type-aliases.js';

export {
  coreBoundaryRules,
  coreTestConfigRules,
  createLibBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
  LIB_PACKAGES,
  getOtherLibs,
} from './boundary-rules.js';
export { noExportTrivialTypeAliasesRule };

// Re-export common settings for convenience
export const commonSettings = {
  'import-x/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
} as const;

export const oakCustomRulesPlugin = {
  rules: {
    'no-export-trivial-type-aliases': noExportTrivialTypeAliasesRule,
  },
};
