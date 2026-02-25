/**
 * Centralized ESLint Boundary Rules for the standard architecture
 *
 * These rules enforce neutral, intent-revealing boundaries:
 * - Core: Pure abstractions with zero dependencies
 * - Libs: Reusable libraries that are independent of each other
 * - Apps: Application packages that compose core and libs
 */

import type { Linter } from 'eslint';

/**
 * Core boundary rules - Zero external dependencies
 * Apply these to all core packages (src files only)
 */
export const coreBoundaryRules: Partial<Linter.RulesRecord> = {
  // Prevent any imports from outside core
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './src/**',
          from: '../../../packages/libs/**',
          message:
            'Core cannot import from libraries. Core must remain pure with zero dependencies.',
        },
        {
          target: './src/**',
          from: '../../../apps/**',
          message: 'Core cannot import from apps. Core must remain pure with zero dependencies.',
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
  // Disallow workspace alias for inter-workspace imports – use @oaknational/* packages instead
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['@workspace/*'],
          message:
            'Do not import from @workspace/* in source. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
        },
      ],
    },
  ],
};

/**
 * Core test and config file rules
 * Allows dev dependencies in test and config files
 */
export const coreTestConfigRules: Partial<Linter.RulesRecord> = {
  // Turn off all import restrictions for test and config files
  'import-x/no-extraneous-dependencies': 'off',
  'import-x/no-restricted-paths': 'off',
  '@typescript-eslint/no-restricted-imports': 'off',
  'import-x/no-internal-modules': 'off',
};

/**
 * Generate library boundary rules for a specific library
 * Each library must be independent of other libraries
 *
 * @param libName - The name of the current library (e.g., 'logger')
 * @param otherLibs - Array of other library names to prevent imports from
 */
export function createLibBoundaryRules(
  libName: string,
  otherLibs: string[],
): Partial<Linter.RulesRecord> {
  const zones = [
    // Cannot import from other libraries
    ...otherLibs.map((otherLib) => ({
      target: './src/**' as const,
      from: `../${otherLib}/**` as const,
      message: `Library '${libName}' cannot depend on '${otherLib}'. Each library must be independently reusable.`,
    })),
    // Cannot import from apps
    {
      target: './src/**' as const,
      from: '../../../apps/**' as const,
      message:
        'Libraries cannot depend on apps. Libraries must remain reusable across applications.',
    },
  ];

  return {
    // Libraries must be independent and reusable
    'import-x/no-restricted-paths': ['error', { zones }],
    // Disallow @workspace/* imports in library source
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@workspace/*'],
            message:
              'Do not import from @workspace/* in source. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
          },
        ],
      },
    ],

    // Prevent direct access to Node.js globals - IO must be injected
    'no-restricted-globals': [
      'error',
      {
        name: 'process',
        message:
          'Libraries must not access process directly. IO interfaces must be injected as dependencies from the consuming application.',
      },
      {
        name: '__dirname',
        message:
          'Libraries must not access __dirname directly. File paths must be injected as dependencies.',
      },
      {
        name: '__filename',
        message:
          'Libraries must not access __filename directly. File paths must be injected as dependencies.',
      },
    ],
  };
}

/**
 * App boundary rules
 * Apps cannot import from other apps but can use core and libs
 */
export const appBoundaryRules: Partial<Linter.RulesRecord> = {
  // Apps cannot import from other apps
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        {
          target: './src/**',
          from: '../*/**',
          message: 'Apps cannot import from other apps. Each app is independent.',
        },
      ],
    },
  ],
};

/**
 * App internal architecture rules
 * Enforces internal module boundaries within an app
 */
export const appArchitectureRules: Partial<Linter.RulesRecord> = {
  'import-x/no-restricted-paths': [
    'error',
    {
      zones: [
        // New structure isolation – integrations cannot import tools, and vice versa
        {
          target: 'src/integrations/**',
          from: 'src/tools/**',
          message:
            'Integrations cannot import Tools directly. Use dependency injection via app layer.',
        },
        {
          target: 'src/tools/**',
          from: 'src/integrations/**',
          message:
            'Tools cannot import Integrations directly. Use dependency injection via app layer.',
        },
      ],
    },
  ],

  // Enforce package-only inter-workspace imports; allow intra-package relatives
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['@workspace/*'],
          message:
            'Do not import from @workspace/* in apps. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
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
 * SDK boundary rules for the generation/runtime workspace split.
 *
 * Enforces the one-way dependency direction defined in
 * {@link ../../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md | ADR-108}:
 *
 * - **generation** workspace has no knowledge of runtime concerns.
 *   It cannot import from `@oaknational/curriculum-sdk`.
 * - **runtime** workspace imports generation artefacts through barrel
 *   exports only (`@oaknational/sdk-codegen`), never via
 *   deep paths into generation internals.
 *
 * @param role - Whether the calling workspace is the generation or runtime SDK
 *
 * @example
 * ```typescript
 * // In generation workspace eslint.config.ts:
 * { files: ['src/**\/*.ts'], rules: { ...createSdkBoundaryRules('generation') } }
 *
 * // In runtime workspace eslint.config.ts:
 * { files: ['src/**\/*.ts'], rules: { ...createSdkBoundaryRules('runtime') } }
 * ```
 */
export function createSdkBoundaryRules(
  role: 'generation' | 'runtime',
): Partial<Linter.RulesRecord> {
  if (role === 'generation') {
    return {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@oaknational/curriculum-sdk', '@oaknational/curriculum-sdk/**'],
              message:
                'Generation cannot import from runtime SDK. Dependency is one-way: runtime depends on generation, not vice versa (ADR-108).',
            },
            {
              group: ['@workspace/*'],
              message:
                'Do not import from @workspace/* in source. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
            },
          ],
        },
      ],
    };
  }

  return {
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@oaknational/sdk-codegen/*/**'],
            message:
              'Runtime must import from @oaknational/sdk-codegen subpath exports only (e.g. /api-schema, /mcp-tools, /search), not deep internal paths (ADR-108).',
          },
          {
            group: ['@workspace/*'],
            message:
              'Do not import from @workspace/* in source. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
          },
        ],
      },
    ],
  };
}

/**
 * List of all libraries for reference
 * Update this list when adding new libraries
 */
export const LIB_PACKAGES = [
  'logger',
  'storage',
  'env',
  'transport',
  'openapi-zod-client-adapter',
  'type-helpers',
] as const;

/**
 * Get all other libraries (excluding the current one)
 * Used to prevent cross-library imports
 */
export function getOtherLibs(currentLib: string): string[] {
  return LIB_PACKAGES.filter((lib) => lib !== currentLib);
}
