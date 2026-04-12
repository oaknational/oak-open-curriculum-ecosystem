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
          // SDK and TypeDoc entry points consumed via tsup + typedoc.json
          'oak-curriculum-sdk/src/types/(schema-bridge|public-types)\\.ts$',
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
