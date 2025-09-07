/**
 * ESLint Custom Rules Index
 *
 * Central export point for all custom ESLint rules and configurations
 * for the standardised architecture (core, libs, apps)
 */

export {
  coreBoundaryRules,
  coreTestConfigRules,
  createLibBoundaryRules,
  appBoundaryRules,
  appArchitectureRules,
  LIB_PACKAGES,
  getOtherLibs,
} from './boundary-rules.js';

// Re-export common settings for convenience
export const commonSettings = {
  'import-x/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
} as const;
