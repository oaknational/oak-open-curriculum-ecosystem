import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: [
    // MCPJam CLI: invoked as a stdio MCP server from .mcp.json and spawned by
    // `agent-tools mcp-conformance` via createRequire resolution, not imported.
    // Compatible range (never `pnpm dlx @latest`): runs must reproduce from the
    // lockfile, and behaviour is pinned by the mcp-conformance baselines (novel
    // or vanished check ids fail loudly), not by an exact version. The earlier
    // exact pin guarded a broken `@modelcontextprotocol/server` alpha that
    // @latest once floated; 3.15.2 pins that dep exactly (2.0.0-beta.4), and
    // the "scoped pnpm override" a prior comment cited no longer exists.
    '@mcpjam/cli',
    // Stryker mutation testing: core and vitest-runner are now referenced by
    // packages/core/type-helpers/stryker.config.mjs (knip's stryker plugin
    // resolves them), so only the checker — installed for future typed
    // mutation runs, referenced by no config yet — still needs the ignore.
    '@stryker-mutator/typescript-checker',
    // ESLint ecosystem: consumed transitively via typescript-eslint flat config
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    // supertest used in scripts/
    'supertest',
  ],
  ignoreBinaries: [
    // External tools not installed via npm
    'gitleaks',
    // System binaries used in package.json scripts for port/process checks
    'lsof',
    'ps',
  ],
  ignoreIssues: {
    // Deploy boundary intentionally exposes the same handler as both a named
    // export and the Vercel-required default export.
    'apps/oak-curriculum-mcp-streamable-http/src/server.ts': ['duplicates'],
  },
  ignore: [
    // The design system's vanilla-JS theme runtime, tracked as a served asset:
    // the hub layout inlines it via readFileSync('public/oak-theme.js') — a
    // string path knip's module graph cannot see. Byte-parity with the
    // workspace package is enforced by the showcase's validate-kit-assets
    // gate, whose manifest carries this copy alongside the showcase's own.
    'demos/oak-curriculum-hub/public/oak-theme.js',
    // The showcase's tracked copies of kit-authored served assets: the theme
    // runtime (inlined by the same string-path readFileSync shape) and the
    // white-label brand CSS the identity switcher swaps by href. Byte-parity
    // and closure completeness are enforced by its validate-kit-assets gate.
    'demos/oak-design-showcase/public/oak-theme.js',
    'demos/oak-design-showcase/public/brands/**',
  ],

  eslint: true,
  vitest: true,
  typescript: true,
  compilers: {
    // Surface CSS @import statements as import declarations so knip sees
    // CSS-first dependency consumption (e.g. Tailwind v4's
    // `@import 'tailwindcss'` in globals.css); everything else in the file
    // is not dependency-bearing and is dropped.
    css: (text: string) =>
      [...text.matchAll(/@import\s+['"]([^'"]+)['"]/g)]
        .map(([, specifier]) => `import '${String(specifier)}';`)
        .join('\n'),
  },

  workspaces: {
    '.': {
      // The repo root intentionally has no source scripts; logic belongs in
      // workspaces. Keep the root workspace narrow so Knip does not treat
      // operational notes and platform shims as default source.
      entry: ['package.json'],
      project: [],
    },
    'agent-tools': {
      // Platform adapters (src/claude/, future src/codex/, src/cursor/) are
      // entry points: the built JS is invoked via spawn from the platform's
      // own thin shim (e.g. `.claude/hooks/practice-session-identity.mjs`),
      // which knip cannot trace as a TS import.
      //
      // The remaining entries are the tsx-invoked executables wired into
      // `package.json` scripts (and, for the hook guards, invoked directly with
      // `node` on the built dist from `.claude/settings.json`). Promoted out of
      // the former `scripts/` directory into `src/` under ADR-168 §5a, each is
      // listed explicitly so knip traces the dependency graph from the real
      // entry rather than reporting the whole chain as unused.
      entry: [
        'src/bin/**/*.ts',
        'src/claude/**/*.ts',
        'src/cursor/**/*.ts',
        'src/hook-policy/pre-tool-use-dispatch.ts',
        'src/repo-check/repo-check.ts',
        'src/commit-advisories/check-commit-message.ts',
        'src/commit-advisories/check-commit-skill-advisories.ts',
        'src/workspace-census/cli.ts',
        'src/secret-scan/run-push-secret-scan.ts',
        'src/version-guard/prevent-accidental-major-version.ts',
        'src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts',
        'src/validators/collaboration-state/validate-collaboration-state.ts',
        'src/validators/protocol-wire/validate-protocol-wire-contract.ts',
        'src/validators/stale-script-invocations/validate-no-stale-script-invocations.ts',
        'src/validators/lifecycle-scripts/validate-lifecycle-scripts.ts',
        'src/validators/markdown-links/validate-markdown-links.ts',
        'src/validators/pretooluse-guard-routing/validate-pretooluse-guard-routing.ts',
        'src/validators/policy-reappraisal/validate-policy-reappraisal.ts',
        'src/validators/claim-freshness/validate-claim-freshness.ts',
        'src/validators/identity-naming/validate-identity-naming.ts',
        'src/validators/check-ci-parity/validate-check-ci-parity.ts',
        'src/validators/plan-schema/validate-plan-corpus.ts',
        'src/validators/plan-schema/check-plan-gate-drift.ts',
        'src/validators/workspace-config-isolation/validate-workspace-config-isolation.ts',
        'src/validators/notion-fence/validate-notion-fence.ts',
        'src/validators/reference-direction/validate-reference-direction.ts',
        'src/validators/machine-local-paths/validate-no-machine-local-paths.ts',
        'src/validators/patterns-index/validate-patterns-index.ts',
        'src/validators/ratified-lists/validate-ratified-lists.ts',
        'src/validators/portability/validate-portability.ts',
        'src/validators/subagents/validate-subagents.ts',
        'src/practice-fitness/validate-practice-fitness.ts',
        'src/ci/ci-schema-drift-check.ts',
        'src/ci/ci-turbo-report.ts',
        'src/mcp-content-current-source/validate-current-source.ts',
        // PDR-131 throughput register CLI: invoked via the
        // `agent-tools:pr-throughput` package script (`pnpm exec tsx`), not
        // imported.
        'src/pr-throughput/cli.ts',
        // Refounding mechanical-instrument CLIs (plan-corpus-refounding R0a):
        // invoked via `pnpm exec tsx` package scripts, not imported.
        'src/refounding/refound-freeze.ts',
        'src/refounding/refound-verify-freeze.ts',
        'src/refounding/refound-inventory.ts',
        'src/refounding/refound-residue.ts',
        'src/refounding/refound-sweep.ts',
        'src/refounding/refound-plant-orphan.ts',
        'src/refounding/refound-plant-challenge-canary.ts',
        'src/refounding/refound-merge-recheck.ts',
        'src/refounding/refound-tile.ts',
        'src/refounding/refound-default-ledger.ts',
        'src/refounding/refound-claim-census.ts',
        'src/refounding/refound-batch-status.ts',
        'src/refounding/refound-window-sample.ts',
        // Plan-state recomputation CLI (plan-corpus-refounding R0b):
        // invoked via `pnpm exec tsx` package scripts, not imported.
        'src/plan-state/plan-state.ts',
        // Corpus-analysis workflow stage entries: consumed by esbuild as string
        // entry points in workflows/build/workflow-builder.ts (bundled into
        // self-contained harness artefacts), which knip cannot trace as imports.
        'src/corpus-analysis/workflows/*.workflow.ts',
        // Restatement-audit workflow stage entries: same string-entry-point
        // pattern as corpus-analysis above.
        'src/restatement-audit/workflows/*.workflow.ts',
      ],
      // tests/ is inside the project so tests-only dependencies are traced
      // (the depcruise red-proof helper imports dependency-cruiser from
      // tests/test-helpers/ — widened 2026-08-10; test files are entries via
      // the vitest plugin).
      project: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'],
      // TypeScript-estate review instrument (owner-ratified plan
      // typescript-estate-consolidation-review, staged contract): the module's
      // exported surface is contract-anchored for slices that are
      // deliberately HELD (delivery, graph/ownership, candidate assembly,
      // raw-document composition, CLI wiring), so knip's dead-code model
      // false-positives on it until those consumers land. Its two real
      // smokes are invoked through dist by package scripts, which knip
      // cannot trace. REMOVAL CONDITION: delete this ignore when the estate
      // run lands (plan §Todos step 8-9); knip then audits the module in
      // full. Scoped-and-dated per configure-checks-not-blindly-obey; the
      // module's own tsc/eslint/vitest gates remain fully live.
      ignore: ['src/typescript-estate/**'],
    },
    'apps/oak-curriculum-mcp-streamable-http': {
      entry: [
        'src/index.ts',
        'src/application.ts',
        'src/server.ts',
        'src/registration-proof/current-source-registration-proof.ts',
        'build-scripts/**/*.ts',
        'operations/**/*.ts',
        'scripts/**/*.ts',
        'runtime-only-scripts/**/*.mjs',
        'widget/src/main.tsx',
        'widget/src/vite-env.d.ts',
        'e2e-tests/**/*.ts',
      ],
      project: [
        // .tsx alongside .ts: the MCP App widget is React, so a .ts-only
        // glob leaves every component outside knip's graph — and anything
        // they alone consume reads as an unused export.
        'src/**/*.{ts,tsx}',
        'build-scripts/**/*.ts',
        'e2e-tests/**/*.ts',
        'operations/**/*.ts',
        'scripts/**/*.ts',
        'runtime-only-scripts/**/*.mjs',
        'tests/**/*.ts',
        'widget/src/**/*.{ts,tsx,css}',
      ],
      ignoreDependencies: [
        // prettier is needed for eslint-plugin-prettier
        'prettier',
        // TypeScript module augmentation: declare module 'express-serve-static-core'
        // in src/auth/mcp-auth/mcp-auth.ts and src/correlation/middleware.ts.
        // Knip cannot detect module augmentation as dependency usage.
        '@types/express-serve-static-core',
      ],
      vite: {
        config: 'widget/vite.config.ts',
      },
    },
    'apps/oak-search-cli': {
      entry: [
        'bin/**/*.ts',
        'operations/**/*.ts',
        'scripts/**/*.ts',
        'evaluation/**/*.ts',
        'ground-truths/generation/**/*.ts',
      ],
      project: [
        'bin/**/*.ts',
        'src/**/*.ts',
        'ground-truths/**/*.ts',
        'operations/**/*.ts',
        'scripts/**/*.ts',
        'evaluation/**/*.ts',
      ],
      ignoreDependencies: [
        // Used via CLI tooling, not direct imports
        'vite-tsconfig-paths',
        // prettier is needed for eslint-plugin-prettier
        'prettier',
      ],
    },
    'packages/core/oak-eslint': {
      // Compiled package: the exports map points at dist/, so the source entry
      // behind it is declared explicitly (exports-map auto-detection resolved
      // the former `development` condition, removed with the built-code-only
      // ruling). src/index.ts reaches the plugin, configs, and shared graph.
      entry: ['src/index.ts', 'scripts/**/*.ts'],
      project: ['src/**/*.ts', 'scripts/**/*.ts'],
      ignoreDependencies: [
        // ESLint plugins are peer dependencies used at runtime
        'eslint-plugin-prettier',
      ],
    },
    'packages/core/openapi-zod-client-adapter': {
      project: ['src/**/*.ts'],
    },
    'packages/core/workspace-config': {
      // Compiled config package: knip's exports-map auto-detection resolves
      // each subpath export (there is no barrel by design — a barrel would
      // drag tsup into every vitest config's module graph), so no explicit
      // entry list is needed; scoping project to src keeps the package's
      // own config files out of the unused-file surface.
      project: ['src/**/*.ts'],
    },
    'packages/core/observability': {
      project: ['src/**/*.ts'],
    },
    'packages/core/env': {
      project: ['src/**/*.ts'],
    },
    'packages/core/graph-core': {
      project: ['src/**/*.ts'],
    },
    'packages/core/result': {
      project: ['src/**/*.ts'],
    },
    'packages/core/type-helpers': {
      project: ['src/**/*.ts'],
    },
    'packages/design/oak-design-system': {
      // The consumable surface stays analysed (owner ruling 2026-07-19:
      // production code gets no analysis exceptions). src/oak-theme.ts is
      // the TypeScript source of the browser-loaded entry script — no
      // importer exists by design, so it is declared as an entry rather
      // than reported unused. The committed root oak-theme.js is its build
      // output, kept in `project` because it is the file consumers actually
      // load. studio-source/ is the explicitly separated non-production
      // studio material (see its README) and is the only part out of scope.
      entry: ['src/oak-theme.ts'],
      project: ['src/**/*.ts', '*.js'],
    },
    'packages/design/oak-design-tokens': {
      // Source entry behind the dist-pointing `./terminal-theme` export
      // (see oak-eslint note on the removed `development` condition), plus
      // the repo-validator script chained into `repo-validators:check`.
      entry: ['src/terminal-theme.ts', 'scripts/validate-design-system-consistency.ts'],
      project: ['src/**/*.ts', 'scripts/**/*.ts'],
    },
    'packages/libs/env-resolution': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/fidelity-review': {
      // No src/index.ts barrel by design (per-module subpath exports);
      // knip resolves the dist-pointing subpath exports back to their
      // sources unaided, so no explicit entries are needed.
      project: ['src/**/*.ts'],
    },
    'packages/libs/graph-ingest': {
      // Source entries behind the dist-pointing exports map (see oak-eslint
      // note on the removed `development` condition). Only the subpaths not
      // already reachable from knip's default entries need declaring.
      entry: ['src/turtle/index.ts', 'src/source-path/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/libs/graph-project': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/logger': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/search-contracts': {
      project: ['src/**/*.ts'],
    },
    'packages/libs/sentry-node': {
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // Readiness-only devDep: `@sentry/cli` lets maintainers run
        // `pnpm exec sentry-cli` inside this package without touching
        // user-global state. Not imported at runtime. See
        // docs/operations/sentry-cli-usage.md.
        '@sentry/cli',
      ],
    },
    'packages/sdks/graph-corpus-sdk': {
      // Source entries behind the dist-pointing exports map, one per subpath
      // (see oak-eslint note on the removed `development` condition — the
      // former exports-map auto-detection resolved that condition to src).
      entry: ['src/index.ts', 'src/eef-strands/index.ts', 'src/curriculum/index.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/sdks/oak-curriculum-sdk': {
      // Knip cannot resolve entries through createSdkConfig() factory.
      // Explicit entries match the tsup.config.ts entry patterns.
      entry: [
        'src/*.ts',
        'src/client/**/*.ts',
        'src/config/**/*.ts',
        'src/types/**/*.ts',
        'src/public/**/*.ts',
        'src/mcp/**/*.ts',
        'src/validation/**/*.ts',
      ],
      project: ['src/**/*.ts'],
      ignoreDependencies: [
        // @zod/core is a transitive dep of zod, required at runtime
        '@zod/core',
      ],
    },
    'packages/sdks/oak-sdk-codegen': {
      // Knip cannot resolve entries through createSdkConfig() factory.
      entry: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      project: ['src/**/*.ts', 'code-generation/**/*.ts', 'vocab-gen/**/*.ts'],
      ignoreDependencies: ['@zod/core'],
    },
    'packages/sdks/oak-search-sdk': {
      // Knip cannot resolve entries through createSdkConfig() factory.
      // src/index|read|admin are the source entries behind the dist-pointing
      // exports map (see oak-eslint note on the removed `development` condition).
      entry: [
        'src/index.ts',
        'src/read.ts',
        'src/admin.ts',
        'src/create-search-sdk.ts',
        'src/create-search-retrieval.ts',
        'src/types/**/*.ts',
        'src/retrieval/**/*.ts',
        'src/admin/**/*.ts',
        'src/observability/**/*.ts',
        'src/internal/**/*.ts',
      ],
      project: ['src/**/*.ts'],
    },
    // Imported research-evidence tooling (ADR-215). CLI-driven: the scripts are
    // tsx-invoked entry points and the tests are the other entries; lib is
    // import-reachable. fixtures/ is illustrative source data, not project code.
    'research/web-app-deconstruction/packages/research-evidence': {
      // lib/ is the recomputable-evidence API surface (its exported analysis
      // functions and result types are the reusable public interface, not all
      // consumed by this package's own scripts); scripts are the CLI entries and
      // tests are the other entries.
      entry: ['lib/**/*.ts', 'scripts/**/*.ts', 'tests/**/*.test.ts', '*.config.ts'],
      project: ['lib/**/*.ts', 'scripts/**/*.ts', 'tests/**/*.ts'],
    },
  },
};

export default config;
