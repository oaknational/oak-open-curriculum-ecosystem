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

export const POSTHOG_VENDOR_PACKAGES = ['posthog-node', '@posthog/mcp'] as const;
const POSTHOG_ADAPTER_PATH = '/packages/libs/posthog-node/';

export function isPostHogAdapterFile(filename: string): boolean {
  const normalisedFilename = `/${filename.replaceAll('\\', '/')}`;
  return normalisedFilename.includes(POSTHOG_ADAPTER_PATH);
}

export const VERCEL_FUNCTIONS_PACKAGE = '@vercel/functions';
const VERCEL_FUNCTIONS_COMPOSE_MODULE_PATH =
  '/apps/oak-curriculum-mcp-streamable-http/src/compose-product-analytics-runtime.ts';

/**
 * The one file the MCP-241 ruling permits to import `@vercel/functions`: the
 * product-analytics composition root. Matched on the full path suffix so a
 * sibling such as `compose-product-analytics-runtime.integration.test.ts`
 * never inherits the exemption.
 */
export function isVercelFunctionsComposeFile(filename: string): boolean {
  const normalisedFilename = `/${filename.replaceAll('\\', '/')}`;
  return normalisedFilename.endsWith(VERCEL_FUNCTIONS_COMPOSE_MODULE_PATH);
}

const LIB_PACKAGE_IMPORTS = [
  '@oaknational/env-resolution',
  '@oaknational/logger',
  '@oaknational/posthog-node',
  '@oaknational/search-contracts',
  '@oaknational/sentry-node',
] as const;

/**
 * The full packages/design workspace inventory — every design-tier package
 * specifier, including members that build no lint rules of their own
 * (oak-design-assets ships assets only, with no source or eslint config).
 * Exported as a runtime tuple so validate-boundaries.ts can compare it
 * against the live workspace inventory, exactly like LIB_PACKAGES.
 */
export const DESIGN_PACKAGE_IMPORTS = [
  '@oaknational/design-tokens-core',
  '@oaknational/oak-design-assets',
  '@oaknational/oak-design-ink',
  '@oaknational/oak-design-react',
  '@oaknational/oak-design-system',
  '@oaknational/oak-design-tokens',
] as const;
type DesignPackageImport = (typeof DESIGN_PACKAGE_IMPORTS)[number];

export const SDK_PACKAGE_IMPORTS = [
  '@oaknational/curriculum-sdk',
  '@oaknational/graph-corpus-sdk',
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

const POSTHOG_VENDOR_BOUNDARY_MESSAGE =
  'Only packages/libs/posthog-node may import PostHog vendor SDKs. Other workspaces must consume Oak provider-neutral product-analytics contracts.';

/**
 * Vendor-SDK fence with the Oak adapter excepted.
 *
 * @remarks
 * `no-restricted-imports` groups are gitignore-style, and a slashless
 * pattern matches at any path depth — so the bare `posthog-node` group
 * also matches the Oak adapter specifier `@oaknational/posthog-node`.
 * The negations except the adapter from the vendor fence only: where
 * ADR-041's dependency matrix permits adapter-library imports at all
 * (apps and SDKs; first consumed by the app in MCP-240), the sanctioned
 * consumption surface is the adapter, never the vendor SDKs. Independent
 * tier boundaries still govern consumption — core, foundation libs, and
 * the other restricted tiers cannot import the adapter on their own
 * terms — and the vendor SDKs stay fenced to the adapter package.
 */
const OAK_ADAPTER_EXCEPTIONS = [
  '!@oaknational/posthog-node',
  '!@oaknational/posthog-node/*',
  '!@oaknational/posthog-node/**',
] as const;

export const POSTHOG_VENDOR_IMPORT_PATTERNS = POSTHOG_VENDOR_PACKAGES.map((packageName) => ({
  group: [packageName, `${packageName}/*`, `${packageName}/**`, ...OAK_ADAPTER_EXCEPTIONS],
  message: POSTHOG_VENDOR_BOUNDARY_MESSAGE,
}));

export const vendorBoundaryRules = {
  '@oaknational/no-posthog-vendor-imports': 'error',
  '@oaknational/no-vercel-functions-imports': 'error',
} satisfies Partial<Linter.RulesRecord>;

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
        ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
export const FOUNDATION_LIB_PACKAGES = [
  'env-resolution',
  'fidelity-review',
  'graph-ingest',
  'graph-project',
  'logger',
  'search-contracts',
] as const;

/**
 * Adapter libraries may depend on foundation libraries only.
 */
export const ADAPTER_LIB_PACKAGES = ['posthog-node', 'sentry-node'] as const;

/**
 * List of all libraries for reference.
 * Update this list when adding or re-tiering libraries.
 */
export const LIB_PACKAGES = [...FOUNDATION_LIB_PACKAGES, ...ADAPTER_LIB_PACKAGES] as const;

type LibPackage = (typeof LIB_PACKAGES)[number];
const FOUNDATION_LIB_PACKAGE_SET: ReadonlySet<LibPackage> = new Set(FOUNDATION_LIB_PACKAGES);
type DesignPackage =
  | 'design-tokens-core'
  | 'oak-design-ink'
  | 'oak-design-react'
  | 'oak-design-system'
  | 'oak-design-tokens';
const SEARCH_CONTRACTS_LIB = 'search-contracts' as const;
const LIB_SDK_BOUNDARY_MESSAGE =
  'Libraries cannot depend on SDKs unless ADR-041 documents an approved generated-surface exception.';
const SEARCH_CONTRACTS_SDK_EXCEPTION_MESSAGE =
  'Foundation library search-contracts may consume approved @oaknational/sdk-codegen subpath exports only; it must not depend on other SDK packages, the root sdk-codegen package, or deep internal SDK paths.';

/**
 * Exhaustiveness backstop for the design-boundary builders: a DesignPackage
 * member added without its explicit branch must fail compilation AND throw at
 * runtime, never fall through to an empty (vacuously green) rule set — the
 * silent-no-op failure mode this file previously carried.
 */
function assertNever(value: never): never {
  throw new Error(
    `Unhandled DesignPackage '${String(value)}'. Add its explicit branch in boundary.ts.`,
  );
}

function isLibPackage(libName: string): libName is LibPackage {
  // Equality-form membership per ADR-153 §Membership Without Widening: a
  // `value is X` guard must not widen its tuple to string (Set or array view).
  return LIB_PACKAGES.some((knownLibName) => knownLibName === libName);
}

function isFoundationLibPackage(libName: LibPackage): boolean {
  return FOUNDATION_LIB_PACKAGE_SET.has(libName);
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
      // The demos→libs direction became load-bearing when fidelity-review
      // landed as the first lib whose consumers are demos (ADR-041 dated
      // amendment 2026-08-09); this zone guards the reverse edge.
      target: './src/**' as const,
      from: '../../../demos/**' as const,
      message:
        'Libraries cannot depend on demos. Demos consume workspace package surfaces, never the reverse (ADR-041).',
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
          ...(libName === 'posthog-node' ? [] : POSTHOG_VENDOR_IMPORT_PATTERNS),
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
 * Design workspaces may depend on core packages and upstream design workspaces
 * only when the dependency direction stays within the design container. No
 * design workspace may depend on apps, SDKs, libs, or tooling packages.
 *
 * @param designName - The current design workspace name
 */
export function createDesignBoundaryRules(designName: DesignPackage): Partial<Linter.RulesRecord> {
  const createDesignRestrictionMessage = (otherDesignPackage: DesignPackageImport) =>
    `Design workspace '${designName}' cannot depend on '${otherDesignPackage}'. Follow ADR-041's packages/design dependency direction.`;

  const buildRestrictedDesignImportPatterns = () => {
    if (designName === 'design-tokens-core') {
      return createPackageSpecifierPatterns(
        [
          '@oaknational/oak-design-assets',
          '@oaknational/oak-design-ink',
          '@oaknational/oak-design-react',
          '@oaknational/oak-design-system',
          '@oaknational/oak-design-tokens',
        ],
        `Design workspace '${designName}' cannot depend on '@oaknational/oak-design-assets', '@oaknational/oak-design-ink', '@oaknational/oak-design-react', '@oaknational/oak-design-system', or '@oaknational/oak-design-tokens'. Follow ADR-041's packages/design dependency direction.`,
      );
    }
    if (designName === 'oak-design-tokens') {
      // The deliberate absence of an '@oaknational/oak-design-system'
      // restriction declares the one legitimate edge: oak-design-tokens
      // consumes the design system's dtcg export as validator input
      // (ADR-041 §2026-07-19 amendment; ADR-213 §4).
      return createPackageSpecifierPatterns(
        [
          '@oaknational/oak-design-assets',
          '@oaknational/oak-design-ink',
          '@oaknational/oak-design-react',
        ],
        `Design workspace '${designName}' can depend on '@oaknational/design-tokens-core' and the design system's dtcg export only. Follow ADR-041's packages/design dependency direction.`,
      );
    }
    if (designName === 'oak-design-ink') {
      // Ink reaches design tokens through the projection layer
      // (oak-design-tokens), never the design system directly
      // (ADR-041 §2026-07-19 amendment; ADR-213 §4).
      return createPackageSpecifierPatterns(
        [
          '@oaknational/oak-design-assets',
          '@oaknational/oak-design-react',
          '@oaknational/oak-design-system',
        ],
        `Design workspace '${designName}' can depend on '@oaknational/oak-design-tokens' and '@oaknational/design-tokens-core' only. Follow ADR-041's packages/design dependency direction.`,
      );
    }
    if (designName === 'oak-design-react') {
      // The React binding tier (ADR-213 §3). The deliberate absence of an
      // '@oaknational/oak-design-system' restriction declares the §4 map
      // edge (oak-design-system → tier package); today the tier's only kit
      // edge is contract-only (a re-declared runtime interface), and the
      // package import materialises with the first component.
      return createPackageSpecifierPatterns(
        [
          '@oaknational/design-tokens-core',
          '@oaknational/oak-design-assets',
          '@oaknational/oak-design-ink',
          '@oaknational/oak-design-tokens',
        ],
        `Design workspace '${designName}' can depend on '@oaknational/oak-design-system' only (the ADR-213 §4 tier edge). Follow ADR-041's packages/design dependency direction.`,
      );
    }
    if (designName === 'oak-design-system') {
      // The neutral trunk imports NOTHING from the design tier (ADR-041's
      // design row; ADR-213 §4 "zero runtime monorepo dependencies") — and,
      // unlike every other design workspace, nothing from core either: the
      // shared design rules permit core packages, so the kit's zero-runtime
      // contract needs its own explicit core restriction (both specifier and
      // path forms; the path zone covers future core packages by construction).
      return [
        ...createPackageSpecifierPatterns(
          [
            '@oaknational/design-tokens-core',
            '@oaknational/oak-design-assets',
            '@oaknational/oak-design-ink',
            '@oaknational/oak-design-react',
            '@oaknational/oak-design-tokens',
          ],
          `Design workspace '${designName}' cannot depend on any design-tier sibling. The kit is the neutral trunk (ADR-213 §4): it imports nothing from the monorepo at runtime.`,
        ),
        ...createPackageSpecifierPatterns(
          [
            '@oaknational/build-metadata',
            '@oaknational/env',
            '@oaknational/eslint-plugin-standards',
            '@oaknational/graph-core',
            '@oaknational/observability',
            '@oaknational/openapi-zod-client-adapter',
            '@oaknational/result',
            '@oaknational/safe-path',
            '@oaknational/type-helpers',
          ],
          `Design workspace '${designName}' cannot depend on core packages. The kit is the neutral trunk (ADR-213 §4): it imports nothing from the monorepo at runtime.`,
        ),
      ];
    }
    // Exhaustive: a new DesignPackage member without its branch must fail
    // loudly here, never lint as an empty (vacuously green) rule set.
    return assertNever(designName);
  };
  const restrictedDesignImportPatterns = buildRestrictedDesignImportPatterns();
  const buildRestrictedDesignPathZones = () => {
    // Path-zone twin of the specifier branches above. Each zone derives its
    // path and message from the sibling's package specifier (every design
    // directory is the specifier without its scope), so a zone's path cannot
    // drift from its own specifier. Membership stays hand-enumerated per
    // member in BOTH builders; the pairwise design-boundary test enforces
    // that parity.
    const createDesignSiblingZones = (siblings: readonly DesignPackageImport[]) =>
      siblings.map((sibling) => ({
        target: './src/**' as const,
        from: `../${sibling.slice('@oaknational/'.length)}/**`,
        message: createDesignRestrictionMessage(sibling),
      }));
    if (designName === 'design-tokens-core') {
      return createDesignSiblingZones([
        '@oaknational/oak-design-tokens',
        '@oaknational/oak-design-ink',
        '@oaknational/oak-design-system',
        '@oaknational/oak-design-react',
        '@oaknational/oak-design-assets',
      ]);
    }
    if (designName === 'oak-design-tokens') {
      return createDesignSiblingZones([
        '@oaknational/oak-design-ink',
        '@oaknational/oak-design-react',
        '@oaknational/oak-design-assets',
      ]);
    }
    if (designName === 'oak-design-ink') {
      return createDesignSiblingZones([
        '@oaknational/oak-design-system',
        '@oaknational/oak-design-react',
        '@oaknational/oak-design-assets',
      ]);
    }
    if (designName === 'oak-design-react') {
      // No '../oak-design-system/**' zone: the §4 tier edge — see the
      // specifier branch above.
      return createDesignSiblingZones([
        '@oaknational/design-tokens-core',
        '@oaknational/oak-design-ink',
        '@oaknational/oak-design-tokens',
        '@oaknational/oak-design-assets',
      ]);
    }
    if (designName === 'oak-design-system') {
      return [
        ...createDesignSiblingZones([
          '@oaknational/design-tokens-core',
          '@oaknational/oak-design-ink',
          '@oaknational/oak-design-tokens',
          '@oaknational/oak-design-react',
          '@oaknational/oak-design-assets',
        ]),
        {
          target: './src/**' as const,
          from: '../../core/**' as const,
          message:
            "Design workspace 'oak-design-system' cannot depend on core packages. The kit is the neutral trunk (ADR-213 §4): it imports nothing from the monorepo at runtime.",
        },
      ];
    }
    // Exhaustive: see buildRestrictedDesignImportPatterns.
    return assertNever(designName);
  };
  const restrictedDesignPathZones = buildRestrictedDesignPathZones();

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
              'Design workspaces cannot depend on apps. Design primitives must remain reusable package surfaces.',
          },
          {
            target: './src/**' as const,
            from: '../../../packages/sdks/**' as const,
            message:
              'Design workspaces cannot depend on SDKs. Design primitives must stay outside schema/runtime application layers.',
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
              'Design workspaces cannot depend on libs. Design primitives must not depend on runtime library layers.',
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
          ...POSTHOG_VENDOR_IMPORT_PATTERNS,
          ...restrictedDesignImportPatterns,
          ...createPackageSpecifierPatterns(
            SDK_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on SDKs. Tokens must stay outside schema/runtime application layers.',
          ),
          ...createPackageSpecifierPatterns(
            APP_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on apps. Design primitives must remain reusable package surfaces.',
          ),
          ...createPackageSpecifierPatterns(TOOLING_PACKAGE_IMPORTS, TOOLING_BOUNDARY_MESSAGE),
          ...createPackageSpecifierPatterns(
            LIB_PACKAGE_IMPORTS,
            'Design workspaces cannot depend on libs. Design primitives must not depend on runtime library layers.',
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
        ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
        ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
            ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
            ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
          ...POSTHOG_VENDOR_IMPORT_PATTERNS,
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
