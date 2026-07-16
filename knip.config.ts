import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreDependencies: [
    // MCPJam CLI: invoked as a stdio MCP server from .mcp.json, not imported.
    // Pinned (not the documented `pnpm dlx @latest`) with a scoped pnpm override
    // because @latest floats a broken `@modelcontextprotocol/server` alpha — see
    // README MCPJam prereq. Revert to dlx once upstream is fixed.
    '@mcpjam/cli',
    // Stryker mutation testing (invoked via CLI, not imports)
    '@stryker-mutator/core',
    '@stryker-mutator/typescript-checker',
    '@stryker-mutator/vitest-runner',
    // ESLint ecosystem: consumed transitively via typescript-eslint flat config
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    // supertest used in scripts/
    'supertest',
    // tsup at root provides type resolution for tsup.config.base.ts
    // (workspace configs import factory functions from the base config)
    'tsup',
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
        // Compiled build entry invoked by the build:codex-hook-review package
        // script after tsc has emitted it into dist/.
        'src/codex-hook-review/build-hook-bundle.ts',
        'src/claude/**/*.ts',
        'src/cursor/**/*.ts',
        'src/hook-policy/check-blocked-patterns.ts',
        'src/hook-policy/check-blocked-content.ts',
        'src/repo-check/repo-check.ts',
        'src/commit-advisories/check-commit-message.ts',
        'src/commit-advisories/check-commit-skill-advisories.ts',
        'src/secret-scan/run-push-secret-scan.ts',
        'src/version-guard/prevent-accidental-major-version.ts',
        'src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts',
        'src/validators/collaboration-state/validate-collaboration-state.ts',
        'src/validators/stale-script-invocations/validate-no-stale-script-invocations.ts',
        'src/validators/lifecycle-scripts/validate-lifecycle-scripts.ts',
        'src/validators/markdown-links/validate-markdown-links.ts',
        'src/validators/pretooluse-guard-routing/validate-pretooluse-guard-routing.ts',
        'src/validators/policy-reappraisal/validate-policy-reappraisal.ts',
        'src/validators/reference-direction/validate-reference-direction.ts',
        'src/validators/machine-local-paths/validate-no-machine-local-paths.ts',
        'src/validators/patterns-index/validate-patterns-index.ts',
        'src/validators/ratified-lists/validate-ratified-lists.ts',
        'src/validators/portability/validate-portability.ts',
        'src/validators/subagents/validate-subagents.ts',
        'src/practice-fitness/validate-practice-fitness.ts',
        'src/ci/ci-schema-drift-check.ts',
        'src/ci/ci-turbo-report.ts',
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
        // Plan-state recomputation CLI (plan-corpus-refounding R0b):
        // invoked via `pnpm exec tsx` package scripts, not imported.
        'src/plan-state/plan-state.ts',
        // Corpus-analysis workflow stage entries: consumed by esbuild as string
        // entry points in workflows/build/workflow-builder.ts (bundled into
        // self-contained harness artefacts), which knip cannot trace as imports.
        'src/corpus-analysis/workflows/*.workflow.ts',
      ],
      project: ['src/**/*.{ts,tsx}'],
    },
    'apps/oak-curriculum-mcp-streamable-http': {
      entry: [
        'src/index.ts',
        'src/application.ts',
        'src/server.ts',
        'build-scripts/**/*.ts',
        'operations/**/*.ts',
        'scripts/**/*.ts',
        'runtime-only-scripts/**/*.mjs',
        'widget/src/main.tsx',
        'widget/src/vite-env.d.ts',
        'e2e-tests/**/*.ts',
      ],
      project: [
        'src/**/*.ts',
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
        '@asteasolutions/zod-to-openapi',
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
    'packages/design/oak-design-tokens': {
      // Source entry behind the dist-pointing `./terminal-theme` export
      // (see oak-eslint note on the removed `development` condition).
      entry: ['src/terminal-theme.ts'],
      project: ['src/**/*.ts'],
    },
    'packages/libs/env-resolution': {
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
  },
};

export default config;
