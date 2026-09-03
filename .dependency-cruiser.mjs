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
          // Type declaration files (the .d.mts flavour is the committed
          // form — the repo root gitignore excludes every **/*.d.ts)
          '\\.d\\.ts$',
          '\\.d\\.mts$',
          // Generated files
          'src/types/generated/',
          // Ground truths (data files)
          'ground-truths/',
          // Intentional off-graph analysis documentation
          'bucket-c-analysis\\.ts',
          // Test files are standalone entry points (Vitest + Playwright)
          '\\.(test|spec)\\.(ts|js)$',
          // Browser-loaded entry script of the design system (ADR-213) and
          // its TypeScript source: shipped via <script src>, imports
          // nothing — an entry point, not dead code.
          'packages/design/oak-design-system/(src/)?oak-theme\\.(ts|js)$',
          // Browser-served static copies under the MCP app's public/ —
          // `public/oak-ds/` (the design system, from copy-oak-ds.ts) and
          // `public/oak-assets/` (brand artwork). Generated, gitignored, and
          // reached only over HTTP, so nothing imports them by construction —
          // but CI's knip-depcruise job restores build outputs, so the crawler
          // sees them and would report orphans.
          'apps/oak-curriculum-mcp-streamable-http/public/',
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
          // Closed PostHog adapter entry point consumed via package.json "exports"
          'posthog-node/src/index\\.ts$',
          // workspace-config subpath-export module consumed via package.json
          // "exports" (./vitest-e2e). Its moved-in siblings are already
          // covered by the vitest.config/tsup.config/.setup. patterns above;
          // this is the one filename those patterns miss.
          'workspace-config/src/vitest\\.e2e\\.config\\.base\\.ts$',
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
      comment:
        'Libs packages must not import from SDK packages. One recorded pre-existing exception: ' +
        'search-contracts/src/field-inventory.ts imports @oaknational/sdk-codegen/search (a ' +
        'declared workspace dep that was invisible to this rule while dist paths were excluded ' +
        'from the graph; surfaced 2026-08-10 when the exclusion lifted). Its cure — inverting ' +
        'the dependency or re-homing the contract — is Director-routed, not silently absorbed; ' +
        'the exemption dies with that cure.',
      from: {
        path: '^packages/libs/',
        pathNot: ['^packages/libs/search-contracts/src/field-inventory\\.ts$'],
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
      name: 'no-hook-policy-core-to-hosts',
      severity: 'error',
      comment:
        'Hook-policy canonical core (evaluate, policy-snapshot) is platform-free: host adapters, renderers, and the dispatcher depend on it, never the reverse (MCP-150 unified dispatcher structure).',
      from: {
        path: '^agent-tools/src/hook-policy/(evaluate|policy-snapshot)\\.ts$',
      },
      to: {
        path: '^agent-tools/src/hook-policy/(dispatcher|claude-adapter|claude-renderer|content-deny-response|pre-tool-use-dispatch)\\.ts$',
      },
    },
    {
      name: 'no-hook-policy-dispatcher-to-hosts',
      severity: 'error',
      comment:
        'The generic dispatcher owns arbitration only: routes and renderers are injected at the composition root (pre-tool-use-dispatch), never imported (MCP-150 unified dispatcher structure).',
      from: {
        path: '^agent-tools/src/hook-policy/dispatcher\\.ts$',
      },
      to: {
        path: '^agent-tools/src/hook-policy/(claude-adapter|claude-renderer|content-deny-response)\\.ts$',
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
    {
      name: 'no-import-from-agent-substrate',
      severity: 'error',
      comment:
        'No code may import from the `.agent/` knowledge substrate. `.agent/` is the agent operating substrate (plans, memory, rules, sub-agents, state, docs) — shared, mutable, relocatable knowledge, NOT a code module surface, and outside every workspace dependency boundary. agent-tools may READ it as data via fs (the sanctioned operator), but no code anywhere takes a module dependency on it. Owner doctrine 2026-06-22, absolute (no exemption). The companion runtime-read boundary is the ESLint rule @oaknational/no-agent-substrate-access.',
      from: {},
      to: {
        path: '(^|/)\\.agent/',
      },
    },
    {
      name: 'workspace-config-containment',
      severity: 'error',
      comment:
        'Workspaces must never import from outside of themselves except via explicit ' +
        'package.json dependencies (owner rule, workspace-config-isolation plan). A workspace ' +
        'tooling config file reaching another workspace or a repo-root file by relative path is ' +
        'the violation class that hid for months behind lint ignores; shared config lives in ' +
        "@oaknational/workspace-config. The $1 backreference scopes the rule to each file's own " +
        'workspace (probe-verified on dependency-cruiser 18.1.0, 2026-08-10). npm/core targets ' +
        'are exempt here — they are the sanctioned declared-dependency path, and undeclared ones ' +
        "are the next rule's finding, never a second containment hit.",
      from: {
        path: '^(packages/[^/]+/[^/]+|apps/[^/]+|demos/[^/]+|agent-tools)/(?:vitest|tsup|eslint|stryker)[.\\w-]*\\.config\\.(?:ts|mts|cts|js|mjs|cjs)$',
      },
      to: {
        pathNot: ['^$1/'],
        dependencyTypesNot: [
          'core',
          'npm',
          'npm-dev',
          'npm-peer',
          'npm-optional',
          'npm-bundled',
          // Sanctioned workspace:* imports resolve through pnpm's symlink to
          // the real packages/*/dist path and classify as `undetermined`
          // (measured 2026-08-10); unresolvable/undeclared specifiers are the
          // phantom rule's finding, not a second containment hit.
          'undetermined',
          'unknown',
          'npm-no-pkg',
          'npm-unknown',
        ],
      },
    },
    {
      name: 'workspace-config-no-phantom-deps',
      severity: 'error',
      comment:
        'A config file may only import packages its own workspace declares: an unresolvable or ' +
        'undeclared specifier means a copied config without its workspace:* line, which dies on ' +
        'clean installs and inside per-workspace tool sandboxes (the Stryker instance that ' +
        'motivated the isolation plan).',
      from: {
        path: '^(?:packages/[^/]+/[^/]+|apps/[^/]+|demos/[^/]+|agent-tools)/(?:vitest|tsup|eslint|stryker)[.\\w-]*\\.config\\.(?:ts|mts|cts|js|mjs|cjs)$',
      },
      to: {
        // `undetermined` is deliberately absent: sanctioned workspace:*
        // imports classify as `undetermined` under pnpm real-path
        // resolution (measured 2026-08-10). A copied config without its
        // dependency line resolves through the root node_modules as
        // `npm-no-pkg`, or nowhere as `unknown` — those are the finding.
        dependencyTypes: ['unknown', 'npm-no-pkg', 'npm-unknown'],
      },
    },
    {
      name: 'no-commonjs-require',
      severity: 'error',
      comment:
        'Owner ruling 2026-08-09: zero require statements in this strictly-ESM repo — presence ' +
        'is the finding, no containment analysis applies. Covers require() calls (however the ' +
        'binding was obtained), AMD require, and TS import-equals. `exotic-require` types would ' +
        'need options.exoticRequireStrings and are deliberately not listed while that option ' +
        'is unset.',
      from: {},
      to: {
        dependencyTypes: ['require', 'amd-require', 'import-equals'],
      },
    },
    {
      name: 'no-dynamic-import',
      severity: 'error',
      comment:
        'Owner ruling 2026-08-09: dynamic imports are strongly discouraged — error severity, ' +
        'with a narrow named per-site exemption set (each site added to from.pathNot with its ' +
        'warrant; the set is empty today). The syntactic estate bar for LINTED files is the ' +
        'live @oaknational/no-dynamic-import ESLint rule (error, literal and non-literal ' +
        'alike); this rule adds resolution-level coverage, notably for config files the lint ' +
        'surface does not reach yet (isolation plan todo 2). Probe-verified limitation: a ' +
        'non-literal import(expr) produces no edge here — config files get the bespoke ' +
        'refusal channel in validate-workspace-config-isolation.',
      from: {},
      to: {
        dependencyTypes: ['dynamic-import'],
      },
    },
    /* Cross-package src/ imports are enforced by the ESLint boundary rules
       in @oaknational/eslint-plugin-standards. Depcruise DOES support the
       $1 backreference such a rule would need (probe-verified on 18.1.0,
       2026-08-10 — an earlier note here claimed otherwise); the src rule
       stays at the ESLint layer because it already enforces there, and
       migrating it is its own decision, not a by-product of this one. */
  ],
  options: {
    doNotFollow: {
      // `.agent/` is kept visible (not excluded) so the
      // `no-import-from-agent-substrate` forbidden rule can see an import edge
      // into the substrate, but its internals are never followed/analysed.
      path: ['node_modules', 'dist', '.turbo', '\\.agent/'],
    },
    exclude: {
      path: [
        // Next.js build output — same build-output class as `dist` (owner-ratified 2026-07-02)
        '\\.next/',
        '\\.turbo',
        'src/types/generated/',
        '\\.cursor/',
        '\\.claude/',
        // TypeDoc-generated JS assets (not source code)
        'docs/api/assets/',
        // TypeDoc source shims (generated, not authored)
        'docs/_typedoc_src/',
        // Non-workspace stale residue (no package.json)
        'packages/docs/',
        // Untracked vendor reference data — the Claude Design canonical export the
        // demo visual-matches; outside git and outside the analysis corpus
        // (owner-ratified 2026-07-02; see demos/oak-curriculum-hub/.gitignore)
        'demos/oak-curriculum-hub/claude-design-canonical-export/',
        // Design-system STUDIO SOURCE MATERIAL only (ADR-213; owner ruling
        // 2026-07-19: production code gets no analysis exceptions — the
        // consumable workspace root stays cruised; studio-source/ is the
        // explicitly-separated non-production material, see its README).
        'packages/design/oak-design-system/studio-source/',
        // The hub's tracked copy of the kit's theme runtime, consumed by
        // readFileSync in app/layout.tsx (no import edge to see; byte-parity
        // with the package is test-enforced) — same served-asset class.
        'demos/oak-curriculum-hub/public/oak-theme\\.js$',
        // The showcase's tracked copy of the same theme runtime under public/,
        // served statically and never imported (byte-parity with the package
        // is validator-enforced) — same served-asset class as the hub's copy.
        'demos/oak-design-showcase/public/oak-theme\\.js$',
        // Untracked import staging for the same system (root .gitignore) —
        // outside git and outside the analysis corpus.
        'packages/design/design-import/',
        // The owner's raw studio export (untracked, machine-local; the
        // MCP-137 S0 source) — record material, never analysed.
        'packages/design/oak-open-curriculum-design-system-tna-24072026-1141/',
        // Copilot agent worktrees (owner ruling 2026-07-24: excluded from
        // all tools).
        '\\.github/copilot-worktrees/',
      ],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      // Resolution config only — adds the demo's `@/*` alias (the repo's sole
      // alias user, verified) so aliased imports resolve and no-orphans judges
      // real reachability.
      fileName: 'tsconfig.depcruise.json',
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
