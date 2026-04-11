/**
 * Centralized ESLint Boundary Rules for the standard architecture
 *
 * These rules enforce neutral, intent-revealing boundaries:
 * - Core: Foundational packages with no monorepo dependencies outside `core`
 *   and only minimal provider-neutral external dependencies
 * - Libs: Reusable libraries split into foundation and adapter tiers
 * - Apps: Application packages that compose core and libs
 */

import type { Linter } from 'eslint';

export const LIB_PACKAGE_IMPORTS = [
  '@oaknational/env-resolution',
  '@oaknational/logger',
  '@oaknational/search-contracts',
  '@oaknational/sentry-node',
  '@oaknational/sentry-mcp',
] as const;

export const DESIGN_PACKAGE_IMPORTS = [
  '@oaknational/design-tokens-core',
  '@oaknational/oak-design-tokens',
] as const;

export const SDK_PACKAGE_IMPORTS = [
  '@oaknational/curriculum-sdk',
  '@oaknational/sdk-codegen',
  '@oaknational/oak-search-sdk',
] as const;

export const APP_PACKAGE_IMPORTS = [
  '@oaknational/oak-curriculum-mcp-streamable-http',
  '@oaknational/search-cli',
] as const;

export const TOOLING_PACKAGE_IMPORTS = ['@oaknational/agent-tools'] as const;

const APP_BOUNDARY_MESSAGE = 'Apps cannot import from other apps. Each app is independent.';
const TOOLING_BOUNDARY_MESSAGE =
  'Runtime workspaces cannot import from tooling packages. Tooling stays in development and operations layers, not shipped runtime code.';

const WORKSPACE_ALIAS_IMPORT_PATTERN = {
  group: ['@workspace/*', '@workspace/**'],
  message:
    'Do not import from @workspace/* in source. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
} as const;

function createPackageSpecifierPatterns(
  packageNames: readonly string[],
  message: string,
): { readonly group: readonly [string, string, string]; readonly message: string }[] {
  return packageNames.map((packageName) => ({
    group: [packageName, `${packageName}/*`, `${packageName}/**`],
    message,
  }));
}

function createDeepSubpathSpecifierPatterns(
  packageNames: readonly string[],
  message: string,
): { readonly group: readonly [string, string]; readonly message: string }[] {
  return packageNames.map((packageName) => ({
    group: [`${packageName}/*/*`, `${packageName}/*/*/**`],
    message,
  }));
}

/**
 * Core boundary rules
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
            'Core cannot import from libraries. Core packages may depend only on other core packages and explicitly declared provider-neutral external primitives.',
        },
        {
          target: './src/**',
          from: '../../../apps/**',
          message:
            'Core cannot import from apps. Core packages may depend only on other core packages and explicitly declared provider-neutral external primitives.',
        },
        {
          target: './src/**',
          from: '../../../packages/sdks/**',
          message:
            'Core cannot import from SDKs. Core packages must remain domain-agnostic and free of cross-workspace dependencies.',
        },
        {
          target: './src/**',
          from: '../../../agent-tools/**',
          message:
            'Core cannot import from tooling workspaces. Core packages must remain reusable runtime primitives.',
        },
      ],
    },
  ],

  // Allow package specifier imports; the restricted-import patterns below define
  // which workspace package specifiers are legal in core.
  'import-x/no-internal-modules': 'off', // Allow internal module imports
  'import-x/no-relative-packages': 'error', // Disallow cross-package relative imports

  // Enforce manifest-complete imports everywhere.
  'import-x/no-extraneous-dependencies': [
    'error',
    {
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
          ...WORKSPACE_ALIAS_IMPORT_PATTERN,
        },
        ...createPackageSpecifierPatterns(
          LIB_PACKAGE_IMPORTS,
          'Core cannot import from libraries. Core packages may depend only on other core packages and explicitly declared provider-neutral external primitives.',
        ),
        ...createPackageSpecifierPatterns(
          SDK_PACKAGE_IMPORTS,
          'Core cannot import from SDKs. Core packages must remain domain-agnostic and free of cross-workspace dependencies.',
        ),
        ...createPackageSpecifierPatterns(
          APP_PACKAGE_IMPORTS,
          'Core cannot import from apps. Core packages may depend only on other core packages and explicitly declared provider-neutral external primitives.',
        ),
        ...createPackageSpecifierPatterns(
          TOOLING_PACKAGE_IMPORTS,
          'Core cannot import from tooling workspaces. Core packages must remain reusable runtime primitives.',
        ),
      ],
    },
  ],
};

/**
 * Foundation libraries may not depend on any other libraries.
 */
export const FOUNDATION_LIB_PACKAGES = ['env-resolution', 'logger', 'search-contracts'] as const;

/**
 * Adapter libraries may depend on foundation libraries only.
 */
export const ADAPTER_LIB_PACKAGES = ['sentry-node', 'sentry-mcp'] as const;

/**
 * List of all libraries for reference.
 * Update this list when adding or re-tiering libraries.
 */
export const LIB_PACKAGES = [...FOUNDATION_LIB_PACKAGES, ...ADAPTER_LIB_PACKAGES] as const;

export type LibPackage = (typeof LIB_PACKAGES)[number];
export type DesignPackage = 'design-tokens-core' | 'oak-design-tokens';
const SEARCH_CONTRACTS_LIB = 'search-contracts' as const;
const LIB_SDK_BOUNDARY_MESSAGE =
  'Libraries cannot depend on SDKs unless ADR-041 documents an approved generated-surface exception.';
const SEARCH_CONTRACTS_SDK_EXCEPTION_MESSAGE =
  'Foundation library search-contracts may consume approved @oaknational/sdk-codegen subpath exports only; it must not depend on other SDK packages, the root sdk-codegen package, or deep internal SDK paths.';

function isLibPackage(libName: string): libName is LibPackage {
  return LIB_PACKAGES.some((knownLibName) => knownLibName === libName);
}

function isFoundationLibPackage(libName: LibPackage): boolean {
  return FOUNDATION_LIB_PACKAGES.some((foundationLibName) => foundationLibName === libName);
}

/**
 * Generate library boundary rules for a specific library.
 *
 * Foundation libraries must remain independent of all other libraries.
 * Adapter libraries may depend on foundation libraries only.
 *
 * @param libName - The name of the current library (e.g. `logger`)
 */
export function createLibBoundaryRules(libName: LibPackage): Partial<Linter.RulesRecord> {
  if (!isLibPackage(libName)) {
    throw new Error(`Unknown library package '${libName}'. Update LIB_PACKAGES in boundary.ts.`);
  }

  const foundationLib = isFoundationLibPackage(libName);
  const restrictedLibs = foundationLib
    ? LIB_PACKAGES.filter((otherLib) => otherLib !== libName)
    : ADAPTER_LIB_PACKAGES.filter((otherLib) => otherLib !== libName);
  const searchContractsSdkException = libName === SEARCH_CONTRACTS_LIB;
  const createRestrictionMessage = (otherLib: LibPackage): string =>
    foundationLib
      ? `Foundation library '${libName}' cannot depend on '${otherLib}'. Foundation libraries must remain independently reusable.`
      : `Adapter library '${libName}' cannot depend on adapter library '${otherLib}'. Adapter libraries may depend on foundation libraries only.`;

  const zones = [
    ...restrictedLibs.map((otherLib) => ({
      target: './src/**' as const,
      from: `../${otherLib}/**` as const,
      message: createRestrictionMessage(otherLib),
    })),
    {
      target: './src/**' as const,
      from: '../../../apps/**' as const,
      message:
        'Libraries cannot depend on apps. Libraries must remain reusable across applications.',
    },
    {
      target: './src/**' as const,
      from: '../../../agent-tools/**' as const,
      message: TOOLING_BOUNDARY_MESSAGE,
    },
  ];
  const restrictedImportPatterns = restrictedLibs.map((otherLib) => ({
    group: [
      `@oaknational/${otherLib}`,
      `@oaknational/${otherLib}/*`,
      `@oaknational/${otherLib}/**`,
    ],
    message: createRestrictionMessage(otherLib),
  }));
  const restrictedSdkImportPatterns = searchContractsSdkException
    ? [
        ...createDeepSubpathSpecifierPatterns(
          ['@oaknational/sdk-codegen'],
          SEARCH_CONTRACTS_SDK_EXCEPTION_MESSAGE,
        ),
        ...createPackageSpecifierPatterns(
          ['@oaknational/curriculum-sdk', '@oaknational/oak-search-sdk'],
          SEARCH_CONTRACTS_SDK_EXCEPTION_MESSAGE,
        ),
      ]
    : createPackageSpecifierPatterns(SDK_PACKAGE_IMPORTS, LIB_SDK_BOUNDARY_MESSAGE);
  const restrictedSdkImportPaths = searchContractsSdkException
    ? [
        {
          name: '@oaknational/sdk-codegen',
          message: SEARCH_CONTRACTS_SDK_EXCEPTION_MESSAGE,
        },
      ]
    : [];

  return {
    // Libraries must be independent and reusable
    'import-x/no-restricted-paths': ['error', { zones }],
    'import-x/no-relative-packages': 'error',
    // Disallow @workspace/* imports in library source
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        paths: restrictedSdkImportPaths,
        patterns: [
          {
            ...WORKSPACE_ALIAS_IMPORT_PATTERN,
          },
          ...restrictedImportPatterns,
          ...restrictedSdkImportPatterns,
          ...createPackageSpecifierPatterns(
            APP_PACKAGE_IMPORTS,
            'Libraries cannot depend on apps. Libraries must remain reusable across applications.',
          ),
          ...createPackageSpecifierPatterns(TOOLING_PACKAGE_IMPORTS, TOOLING_BOUNDARY_MESSAGE),
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
 * Generate boundary rules for design-token workspaces.
 *
 * Design workspaces may depend on core and library packages. The Oak token set
 * may also depend on the shared design-token core workspace. Neither design
 * workspace may depend on apps, SDKs, or tooling packages.
 *
 * @param designName - The current design workspace name
 */
export function createDesignBoundaryRules(designName: DesignPackage): Partial<Linter.RulesRecord> {
  const createDesignRestrictionMessage = (
    otherDesignPackage: (typeof DESIGN_PACKAGE_IMPORTS)[number],
  ) =>
    `Design workspace '${designName}' cannot depend on '${otherDesignPackage}'. Follow ADR-041's packages/design dependency direction.`;

  const restrictedDesignImportPatterns =
    designName === 'design-tokens-core'
      ? createPackageSpecifierPatterns(
          ['@oaknational/oak-design-tokens'],
          createDesignRestrictionMessage('@oaknational/oak-design-tokens'),
        )
      : [];
  const restrictedDesignPathZones =
    designName === 'design-tokens-core'
      ? [
          {
            target: './src/**' as const,
            from: '../oak-design-tokens/**' as const,
            message: createDesignRestrictionMessage('@oaknational/oak-design-tokens'),
          },
        ]
      : [];

  return {
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [
          ...restrictedDesignPathZones,
          {
            target: './src/**' as const,
            from: '../../../apps/**' as const,
            message:
              'Design workspaces cannot depend on apps. Tokens must remain reusable CSS artefact producers.',
          },
          {
            target: './src/**' as const,
            from: '../../../packages/sdks/**' as const,
            message:
              'Design workspaces cannot depend on SDKs. Tokens must stay outside schema/runtime application layers.',
          },
          {
            target: './src/**' as const,
            from: '../../../agent-tools/**' as const,
            message: TOOLING_BOUNDARY_MESSAGE,
          },
          {
            target: './src/**' as const,
            from: '../../../packages/libs/**' as const,
            message:
              'Design workspaces cannot depend on libs. Tokens are CSS artefact producers with no runtime lib dependencies (ADR-148).',
          },
        ],
      },
    ],
    'import-x/no-relative-packages': 'error',
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            ...WORKSPACE_ALIAS_IMPORT_PATTERN,
          },
          ...restrictedDesignImportPatterns,
          ...createPackageSpecifierPatterns(
            SDK_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on SDKs. Tokens must stay outside schema/runtime application layers.',
          ),
          ...createPackageSpecifierPatterns(
            APP_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on apps. Tokens must remain reusable CSS artefact producers.',
          ),
          ...createPackageSpecifierPatterns(TOOLING_PACKAGE_IMPORTS, TOOLING_BOUNDARY_MESSAGE),
          ...createPackageSpecifierPatterns(
            LIB_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on libs. Tokens are CSS artefact producers with no runtime lib dependencies (ADR-148).',
          ),
        ],
      },
    ],
  };
}

/**
 * App boundary rules
 * Apps cannot import from other apps but can use core and libs
 */
export const appBoundaryRules: Partial<Linter.RulesRecord> = {
  // Relative imports must stay within the current app package.
  'import-x/no-relative-packages': 'error',
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      patterns: [
        ...createPackageSpecifierPatterns(APP_PACKAGE_IMPORTS, APP_BOUNDARY_MESSAGE),
        ...createPackageSpecifierPatterns(TOOLING_PACKAGE_IMPORTS, TOOLING_BOUNDARY_MESSAGE),
        {
          ...WORKSPACE_ALIAS_IMPORT_PATTERN,
          message:
            'Do not import from @workspace/* in apps. Use @oaknational/* package imports for inter-workspace dependencies or relative paths within the same package.',
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
  'import-x/no-relative-packages': 'error',
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
        ...createPackageSpecifierPatterns(APP_PACKAGE_IMPORTS, APP_BOUNDARY_MESSAGE),
        ...createPackageSpecifierPatterns(TOOLING_PACKAGE_IMPORTS, TOOLING_BOUNDARY_MESSAGE),
        {
          ...WORKSPACE_ALIAS_IMPORT_PATTERN,
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
 * - **runtime** workspace imports generation artefacts through
 *   `@oaknational/sdk-codegen` package surfaces only, never via
 *   deep paths into generation internals.
 * - **search** workspace consumes generated search surfaces from
 *   `@oaknational/sdk-codegen` package surfaces and must not depend directly on
 *   `@oaknational/curriculum-sdk`.
 *
 * @param role - Whether the calling workspace is the generation, runtime, or search SDK
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
  role: 'generation' | 'runtime' | 'search',
): Partial<Linter.RulesRecord> {
  const searchSdkImportPatterns = createPackageSpecifierPatterns(
    ['@oaknational/oak-search-sdk'],
    'Runtime and generation SDK workspaces must not import from @oaknational/oak-search-sdk directly. Shared domain artefacts flow through @oaknational/sdk-codegen and the SDKs meet at the application layer (ADR-108).',
  );
  const appSpecifierPatterns = createPackageSpecifierPatterns(
    APP_PACKAGE_IMPORTS,
    'SDKs cannot import from apps. SDKs must remain reusable across applications.',
  );
  const toolingSpecifierPatterns = createPackageSpecifierPatterns(
    TOOLING_PACKAGE_IMPORTS,
    TOOLING_BOUNDARY_MESSAGE,
  );
  const appPathZone = {
    target: './src/**' as const,
    from: '../../../apps/**' as const,
    message: 'SDKs cannot import from apps. SDKs must remain reusable across applications.',
  };
  const toolingPathZone = {
    target: './src/**' as const,
    from: '../../../agent-tools/**' as const,
    message: TOOLING_BOUNDARY_MESSAGE,
  };

  if (role === 'generation') {
    return {
      'import-x/no-relative-packages': 'error',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            ...createPackageSpecifierPatterns(
              ['@oaknational/curriculum-sdk'],
              'Generation cannot import from runtime SDK. Dependency is one-way: runtime depends on generation, not vice versa (ADR-108).',
            ),
            ...searchSdkImportPatterns,
            ...appSpecifierPatterns,
            ...toolingSpecifierPatterns,
            {
              ...WORKSPACE_ALIAS_IMPORT_PATTERN,
            },
          ],
        },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/**',
              from: '../oak-curriculum-sdk/**',
              message:
                'Generation cannot import from runtime SDK via relative paths. Dependency is one-way: runtime depends on generation, not vice versa (ADR-108).',
            },
            {
              target: './src/**',
              from: '../oak-search-sdk/**',
              message:
                'Generation must not import from oak-search-sdk via relative paths. Shared SDK coupling flows through @oaknational/sdk-codegen and the application layer (ADR-108).',
            },
            appPathZone,
            toolingPathZone,
          ],
        },
      ],
    };
  }

  if (role === 'search') {
    return {
      'import-x/no-relative-packages': 'error',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@oaknational/curriculum-sdk',
              message:
                'Search SDK must not import from @oaknational/curriculum-sdk. Use @oaknational/sdk-codegen subpath exports instead (ADR-108).',
            },
          ],
          patterns: [
            {
              group: ['@oaknational/curriculum-sdk/**'],
              message:
                'Search SDK must not import from @oaknational/curriculum-sdk (any subpath). Use @oaknational/sdk-codegen subpath exports instead (ADR-108).',
            },
            ...createDeepSubpathSpecifierPatterns(
              ['@oaknational/sdk-codegen'],
              'Search SDK must import from @oaknational/sdk-codegen subpath exports only (e.g. /search, /observability), not deep internal paths (ADR-108).',
            ),
            ...appSpecifierPatterns,
            ...toolingSpecifierPatterns,
            {
              ...WORKSPACE_ALIAS_IMPORT_PATTERN,
            },
          ],
        },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/**',
              from: '../oak-curriculum-sdk/**',
              message:
                'Search SDK must not import from curriculum-sdk via relative paths. Use @oaknational/sdk-codegen subpath exports instead (ADR-108).',
            },
            // no-restricted-paths resolves package specifiers to workspace files,
            // so oak-sdk-codegen public surfaces are enforced via package patterns
            // plus no-relative-packages rather than a path zone here.
            appPathZone,
            toolingPathZone,
          ],
        },
      ],
    };
  }

  return {
    'import-x/no-relative-packages': 'error',
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          ...searchSdkImportPatterns,
          ...createDeepSubpathSpecifierPatterns(
            ['@oaknational/sdk-codegen'],
            'Runtime must import from @oaknational/sdk-codegen subpath exports only (e.g. /api-schema, /mcp-tools, /search), not deep internal paths (ADR-108).',
          ),
          ...appSpecifierPatterns,
          ...toolingSpecifierPatterns,
          {
            ...WORKSPACE_ALIAS_IMPORT_PATTERN,
          },
        ],
      },
    ],
    'import-x/no-restricted-paths': [
      'error',
      {
        zones: [
          // no-restricted-paths resolves package specifiers to workspace files,
          // so oak-sdk-codegen public surfaces are enforced via package patterns
          // plus no-relative-packages rather than a path zone here.
          {
            target: './src/**',
            from: '../oak-search-sdk/**',
            message:
              'Runtime must not import from oak-search-sdk via relative paths. Shared SDK coupling flows through @oaknational/sdk-codegen and the application layer (ADR-108).',
          },
          appPathZone,
          toolingPathZone,
        ],
      },
    ],
  };
}
