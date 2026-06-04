/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Circular dependencies make the codebase harder to reason about and can cause runtime issues.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment: 'Orphan modules are not reachable from any entry point. They may be dead code.',
      from: {
        orphan: true,
        pathNot: [
          // Config files are standalone by design
          '\\.(config|setup)\\.(ts|js|mjs)$',
          '\\.eslintrc',
          'eslint\\.config\\.ts$',
          'vitest\\.config',
          'tsup\\.config',
          // Test helpers may only be imported by tests
          'test-helpers/',
          'fakes\\.',
          // Type declaration files
          '\\.d\\.ts$',
          // Generated files
          'src/types/generated/',
          // Ground truths (data files)
          'ground-truths/',
          // Intentional off-graph analysis documentation
          'bucket-c-analysis\\.ts',
          // Test files are standalone entry points (Vitest + Playwright)
          '\\.(test|spec)\\.(ts|js)$',
          // Standalone scripts invoked directly via tsx
          'scripts/',
          'operations/utilities/',
          // SDK subpath-export barrels consumed via package.json "exports"
          'oak-sdk-codegen/src/(admin|zod|query-parser|observability)\\.ts$',
          // graph-core subpath-export barrels consumed via package.json "exports"
          'graph-core/src/index\\.ts$',
          'graph-core/src/(term|data-factory|dataset|jsonld|canon|vocab|graph-view)/index\\.ts$',
          // graph-ingest subpath-export barrels consumed via package.json "exports"
          'graph-ingest/src/index\\.ts$',
          'graph-ingest/src/(strict-jsonld|jsonld-compatible|plain-json-tree|records|node-edge-list|custom-mapping|turtle|source-path)/index\\.ts$',
          // graph-project subpath-export barrels consumed via package.json "exports"
          'graph-project/src/index\\.ts$',
          'graph-project/src/(property-graph|projection|adjacency)/index\\.ts$',
          // graph-corpus-sdk subpath-export barrels consumed via package.json "exports"
          'graph-corpus-sdk/src/index\\.ts$',
          'graph-corpus-sdk/src/(eef-strands|threads)/index\\.ts$',
          // SDK and TypeDoc entry points consumed via tsup + typedoc.json
          'oak-curriculum-sdk/src/types/(schema-bridge|public-types)\\.ts$',
          // school-data-search package entry points consumed via package.json exports
          'school-data-search/packages/(contracts|sdk|client)/src/index\\.ts$',
          'school-data-search/apps/api/src/index\\.ts$',
        ],
      },
      to: {},
    },
    {
      name: 'no-deprecated-node',
      severity: 'warn',
      comment: 'Do not use deprecated Node.js core modules.',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-core-to-libs',
      severity: 'error',
      comment:
        'Core packages must not import from libs packages. Dependency direction: core ← libs ← apps.',
      from: {
        path: '^packages/core/',
      },
      to: {
        path: '^packages/libs/',
      },
    },
    {
      name: 'no-core-to-sdks',
      severity: 'error',
      comment:
        'Core packages must not import from SDK packages. Dependency direction: core ← libs ← apps.',
      from: {
        path: '^packages/core/',
      },
      to: {
        path: '^packages/sdks/',
      },
    },
    {
      name: 'no-core-to-apps',
      severity: 'error',
      comment: 'Core packages must not import from apps. Dependency direction: core ← libs ← apps.',
      from: {
        path: '^packages/core/',
      },
      to: {
        path: '^apps/',
      },
    },
    {
      name: 'no-libs-to-apps',
      severity: 'error',
      comment: 'Libs packages must not import from apps. Dependency direction: core ← libs ← apps.',
      from: {
        path: '^packages/libs/',
      },
      to: {
        path: '^apps/',
      },
    },
    {
      name: 'no-libs-to-sdks',
      severity: 'error',
      comment: 'Libs packages must not import from SDK packages.',
      from: {
        path: '^packages/libs/',
      },
      to: {
        path: '^packages/sdks/',
      },
    },
    {
      name: 'no-sdks-to-apps',
      severity: 'error',
      comment: 'SDK packages must not import from apps.',
      from: {
        path: '^packages/sdks/',
      },
      to: {
        path: '^apps/',
      },
    },
    {
      name: 'no-outside-to-school-data-search',
      severity: 'error',
      comment:
        'School-data-search is an isolated POC tier; no existing tier imports it until an owner go/no-go widens consumption.',
      from: {
        path: '^(apps|packages|agent-tools|agent-graphs)/',
      },
      to: {
        path: '^school-data-search/',
      },
    },
    {
      name: 'no-school-data-search-to-existing-apps',
      severity: 'error',
      comment: 'School-data-search workspaces must not import from existing root apps.',
      from: {
        path: '^school-data-search/',
      },
      to: {
        path: '^apps/',
      },
    },
    {
      name: 'no-school-data-search-to-existing-sdks',
      severity: 'error',
      comment:
        'School-data-search owns its own POC sdk/client tier and must not import existing SDKs.',
      from: {
        path: '^school-data-search/',
      },
      to: {
        path: '^packages/sdks/',
      },
    },
    {
      name: 'no-school-data-search-to-adapter-libs',
      severity: 'error',
      comment:
        'School-data-search may consume foundation libraries, not adapter libs, during the POC.',
      from: {
        path: '^school-data-search/',
      },
      to: {
        path: '^packages/libs/sentry-node/',
      },
    },
    {
      name: 'no-school-data-search-contracts-to-runtime',
      severity: 'error',
      comment:
        'Contracts are DB-free and runtime-free; sdk/client/api depend on contracts, not the reverse.',
      from: {
        path: '^school-data-search/packages/contracts/',
      },
      to: {
        path: '^school-data-search/(packages/(sdk|client)|apps/api)/',
      },
    },
    {
      name: 'no-school-data-search-contracts-to-drizzle',
      severity: 'error',
      comment:
        'Contracts must stay DB-free; database mapping belongs in sdk ingestion/storage modules.',
      from: {
        path: '^school-data-search/packages/contracts/',
      },
      to: {
        path: '(^|/)drizzle-orm(/|$)',
      },
    },
    {
      name: 'no-school-data-search-sdk-to-client-or-api',
      severity: 'error',
      comment: 'School-data-search sdk may import contracts only; client/api are consumers.',
      from: {
        path: '^school-data-search/packages/sdk/',
      },
      to: {
        path: '^school-data-search/(packages/client|apps/api)/',
      },
    },
    {
      name: 'no-school-data-search-client-to-sdk-or-api',
      severity: 'error',
      comment: 'Generated client may import contracts only; sdk/api are not client dependencies.',
      from: {
        path: '^school-data-search/packages/client/',
      },
      to: {
        path: '^school-data-search/(packages/sdk|apps/api)/',
      },
    },
    {
      name: 'no-graph-corpus-sdk-to-curriculum-sdk',
      severity: 'error',
      comment:
        'graph-corpus-sdk is consumer-agnostic graph substrate (ADR-179): the dependency direction is oak-curriculum-sdk → graph-corpus-sdk, never the reverse. The corpus substrate must not import from the MCP-surfacing curriculum SDK; surfacing concerns belong above the substrate, not inside it.',
      from: {
        path: '^packages/sdks/graph-corpus-sdk/',
      },
      to: {
        path: '^packages/sdks/oak-curriculum-sdk/',
      },
    },
    /* Cross-package src/ imports are already enforced by the ESLint
       boundary rules in @oaknational/eslint-plugin-standards. Depcruise
       regex does not support backreferences needed for same-package
       exclusion, so this rule is deferred to the ESLint layer. */
  ],
  options: {
    doNotFollow: {
      path: ['node_modules', 'dist', '.turbo'],
    },
    exclude: {
      path: [
        'node_modules',
        'dist',
        '\\.turbo',
        'src/types/generated/',
        '\\.agent/',
        '\\.cursor/',
        '\\.claude/',
        // TypeDoc-generated JS assets (not source code)
        'docs/api/assets/',
        // TypeDoc source shims (generated, not authored)
        'docs/_typedoc_src/',
        // Non-workspace stale residue (no package.json)
        'packages/docs/',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.base.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
    },
    progress: {
      type: 'cli-feedback',
    },
  },
};
