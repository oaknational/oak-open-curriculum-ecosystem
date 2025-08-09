/**
 * Centralized ESLint Boundary Rules for Moria/Histoi/Psycha Architecture
 * 
 * These rules enforce the biological architecture pattern:
 * - Moria: Pure abstractions with zero dependencies
 * - Histoi: Transplantable tissues that are independent of each other
 * - Psycha: Complete organisms that can use Moria and Histoi
 */

import type { Linter } from 'eslint';

/**
 * Moria boundary rules - Zero external dependencies
 * Apply these to all Moria packages (src files only)
 */
export const moriaBoundaryRules: Partial<Linter.RulesRecord> = {
  // Prevent any imports from outside Moria
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './src/**',
          from: '../../../ecosystem/histoi/**',
          message: 'Moria cannot import from Histoi tissues. Moria must remain pure with zero dependencies.',
        },
        {
          target: './src/**',
          from: '../../../ecosystem/psycha/**',
          message: 'Moria cannot import from Psycha organisms. Moria must remain pure with zero dependencies.',
        },
      ],
    },
  ],
  
  // Block any non-relative imports (package imports)
  'import-x/no-internal-modules': 'off', // Allow internal module imports
  'import-x/no-relative-packages': 'off', // Allow relative imports
  
  // Ensure no external dependencies in production code
  'import-x/no-extraneous-dependencies': [
    'error',
    {
      // Allow dev dependencies only in test and config files
      devDependencies: false,
      optionalDependencies: false,
      peerDependencies: false,
      includeTypes: false,
    },
  ],
};

/**
 * Moria test and config file rules
 * Allows dev dependencies in test and config files
 */
export const moriaTestConfigRules: Partial<Linter.RulesRecord> = {
  // Turn off all import restrictions for test and config files
  'import-x/no-extraneous-dependencies': 'off',
  'import-x/no-restricted-paths': 'off',
  '@typescript-eslint/no-restricted-imports': 'off',
  'import-x/no-internal-modules': 'off',
};

/**
 * Generate Histoi boundary rules for a specific tissue
 * Each tissue must be independent of other tissues
 * 
 * @param tissueName - The name of the current tissue (e.g., 'histos-logger')
 * @param otherTissues - Array of other tissue names to prevent imports from
 */
export function createHistoiBoundaryRules(
  _tissueName: string,
  otherTissues: string[]
): Partial<Linter.RulesRecord> {
  const zones = [
    // Cannot import from other Histoi tissues
    ...otherTissues.map(otherTissue => ({
      target: './src/**' as const,
      from: `../${otherTissue}/**` as const,
      message: 'Histoi tissues cannot depend on each other. Each tissue must be independently transplantable.',
    })),
    // Cannot import from Psycha organisms
    {
      target: './src/**' as const,
      from: '../../../ecosystem/psycha/**' as const,
      message: 'Histoi tissues cannot depend on Psycha organisms. Tissues must be transplantable to any organism.',
    },
  ];

  return {
    // Histoi tissues must be independent and transplantable
    'import-x/no-restricted-paths': ['error', { zones }],
    
    // Only allow imports from Moria and necessary runtime dependencies
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../histos-*/**'],
            message: 'Cannot import from other Histoi tissues. Each tissue must be independent.',
          },
          {
            group: ['../../psycha/**'],
            message: 'Cannot import from Psycha layer. Tissues must be transplantable.',
          },
        ],
      },
    ],
    
    // Prevent direct access to Node.js globals - IO must be injected
    'no-restricted-globals': [
      'error',
      {
        name: 'process',
        message: 'Histoi tissues must not access process directly. IO interfaces must be injected as dependencies from the consuming organism.',
      },
      {
        name: '__dirname',
        message: 'Histoi tissues must not access __dirname directly. File paths must be injected as dependencies.',
      },
      {
        name: '__filename', 
        message: 'Histoi tissues must not access __filename directly. File paths must be injected as dependencies.',
      },
    ],
  };
}

/**
 * Psycha organism boundary rules
 * Organisms cannot import from other organisms but can use Moria and Histoi
 */
export const psychaBoundaryRules: Partial<Linter.RulesRecord> = {
  // Organisms cannot import from other organisms
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './src/**',
          from: '../!(oak-notion-mcp)/**',
          message: 'Organisms cannot import from other organisms. Each organism is independent.',
        },
      ],
    },
  ],
};

/**
 * Psychon internal architecture rules (within an organism)
 * Enforces the chorai/organa/psychon separation
 */
export const psychonArchitectureRules: Partial<Linter.RulesRecord> = {
  // Biological Architecture Enforcement
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        // Organa isolation - organs cannot import from other organs
        {
          target: 'src/organa/notion/**',
          from: 'src/organa/mcp/**',
          message: 'Organs cannot import from other organs. Use dependency injection via psychon.',
        },
        {
          target: 'src/organa/mcp/**',
          from: 'src/organa/notion/**',
          message: 'Organs cannot import from other organs. Use dependency injection via psychon.',
        },
      ],
    },
  ],

  // Force use of path aliases for cross-boundary imports
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['../../*'],
          message: 'Use path aliases for cross-boundary imports (e.g., @organa/mcp instead of ../../mcp).',
        },
        {
          group: ['**/internal/**', '**/internals/**', '**/private/**'],
          message: 'Cannot import from internal/private modules.',
        },
      ],
    },
  ],
};

/**
 * List of all Histoi tissues for reference
 * Update this list when adding new tissues
 */
export const HISTOI_TISSUES = [
  'histos-logger',
  'histos-storage',
  'histos-env',
  'histos-transport',
  // Add new tissues here as they are created
] as const;

/**
 * Get all other Histoi tissues (excluding the current one)
 * Used to prevent cross-tissue imports
 */
export function getOtherTissues(currentTissue: string): string[] {
  return HISTOI_TISSUES.filter(tissue => tissue !== currentTissue);
}

