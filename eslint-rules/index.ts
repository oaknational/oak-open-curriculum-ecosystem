/**
 * ESLint Custom Rules Index
 * 
 * Central export point for all custom ESLint rules and configurations
 * for the Moria/Histoi/Psycha biological architecture
 */

export {
  moriaBoundaryRules,
  moriaTestConfigRules,
  createHistoiBoundaryRules,
  psychaBoundaryRules,
  psychonArchitectureRules,
  HISTOI_TISSUES,
  getOtherTissues,
} from './boundary-rules.js';

// Re-export common settings for convenience
export const commonSettings = {
  'import-x/resolver': {
    typescript: {
      alwaysTryTypes: true,
    },
  },
} as const;