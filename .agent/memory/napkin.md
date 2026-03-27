## Session 2026-03-25 (cont.) — Canonical vitest config enforcement

### Vitest config adulteration — root cause and fix

- **Symptom**: `agent-tools` CLI smoke E2E tests timing out at
  5000ms in CI under `pnpm test`, but passing locally.
- **Root cause**: `agent-tools/vitest.config.ts` had
  `include: ['tests/**/*.test.ts']` with NO `**/*.e2e.test.ts`
  exclusion. The base config (`vitest.config.base.ts`) excludes
  E2E tests, but agent-tools didn't extend it. The broad glob
  captured `cli-smoke.e2e.test.ts` into the unit/integration
  pipeline. In CI (2 CPUs, 7GB RAM), `pnpm tsx` child process
  spawning exceeded the 5s default timeout.
- **Fix**:
  - `agent-tools/vitest.config.ts` now extends `baseTestConfig`
  - New `agent-tools/vitest.e2e.config.ts` with 60s timeout for
    CLI smoke tests, plus `test:e2e` script in package.json
  - `packages/core/oak-eslint/vitest.config.ts` also migrated
    from minimal custom config to `baseTestConfig`
- **Prevention**:
  - Added "Canonical Vitest Configuration" section to
    `testing-strategy.md` defining two patterns (extend base
    preferred, custom with mandatory E2E exclusion)
  - Added "Canonical Configuration" mandate to `principles.md`
  - Updated `config-reviewer.md` with reading requirements for
    base vitest configs, canonical pattern enforcement, and
    E2E config checklist items
- **Key learning**: workspace vitest configs that don't extend
  the base config and use broad `*.test.ts` globs without
  `**/*.e2e.test.ts` exclusion silently leak E2E tests into
  the unit/integration pipeline. This only manifests in CI
  where resource constraints cause timeouts.

---

## Session 2026-03-25 (cont.) — CI lint cache poisoning + turbo inputs fix

### Turbo cache poisoning — root cause and fix

- **Symptom**: CI lint step failed with 1091 `import-x/no-unresolved`
  errors for `@oaknational/search-cli`, but lint passed locally with
  `--force`. Same commit (`0abc01b4`).
- **Root cause**: ALL 27 lint tasks in CI were **remote cache hits**.
  The errors were replayed from a stale remote cache entry, not from
  a fresh lint run. The cache was poisoned by a previous CI run where
  `@oaknational/sdk-codegen` subpath exports (`/search`, `/zod`)
  weren't available at lint time.
- **Why it persisted**: `turbo.json` lint inputs enumerated specific
  directories (`src/`, `tests/`, `smoke-tests/`) — so changes to
  `evaluation/`, `operations/`, and root-level `.ts` files didn't
  invalidate the cache. The poisoned entry kept being replayed.
- **Fix**: replaced directory-specific patterns with `**/*.ts` for
  lint, lint:fix, test, mutate, test:ui, and type-check tasks.
  Turbo respects `.gitignore` so `dist/` and `node_modules/` are
  automatically excluded. This invalidated all stale cache entries.
- **Graph comparison** (`pnpm check` vs CI): dependency ordering is
  identical — Turbo correctly pulls `sdk-codegen` as transitive dep
  of `build`. The issue was cache, not graph structure.
- **Key learning**: when Turbo remote cache produces different results
  from local, check cache hit/miss status first (`--dry=json` or
  CI logs for "cache hit, replaying logs"). ALL hits = stale cache.
  Incomplete `inputs` patterns are a common cause.

### Agent-tools test timeout (remaining CI failure)

- `@oaknational/agent-tools#test`: 4 tests timing out at 5000ms in CI.
- Unrelated to search work or turbo config changes.
- Needs investigation as a separate issue.

---

## Session 2026-03-25 — CI hang blocker + docs consolidation

### CI hang blocker — root cause identified

- **GitHub CI hanging** on `feat/es_index_update` branch — job never
  completes. Previous turbo daemon / concurrency fixes reverted as they
  were symptom-level.
- **Root cause identified**: `@oaknational/search-cli:test` is the
  single workspace that never completes. From cancelled CI run logs
  (23537232656): 14 of 15 workspace test suites complete successfully,
  `search-cli:test` never even produces its turbo group header.
  Turbo buffers output for running tasks, so the absence of output
  means the vitest process started but never finished.
- **Key evidence**:
  - search-cli: 101 test files, `pool: 'forks'`, `isolate: true`,
    `NODE_OPTIONS='--max-old-space-size=6144'` (6GB heap per process)
  - CI runner: 7GB RAM, 2 CPUs
  - Already has 1 test excluded for OOM (`ingest-harness.unit.test.ts`)
  - Orphan processes at cleanup: turbo, esbuild, 5x MainThread, 2x sh
- **Hypotheses** (ranked):
  - H1: OOM kill of vitest fork worker → vitest hangs waiting for dead child
  - H2: esbuild service process leak after abnormal fork exit
  - H3: Import-time side effect blocking in CI
  - H4: NODE_OPTIONS inheritance causing fork startup failure
- **Instrumentation added**:
  - CI workflow: split search-cli tests into isolated step with
    verbose reporter, memory monitoring (10s interval), OOM kill
    detection (dmesg), 5-minute timeout
  - test.setup.ts: process-level diagnostics on CI (heap/RSS on load,
    exit, SIGTERM, SIGINT, memory warnings)
- **Next step**: push to CI, read diagnostic output, confirm/reject
  hypotheses.

### CONTRIBUTING.md improvement

- Added `pnpm check` as the canonical all-in-one quality gate command
  in the "Run Quality Gates" section. Individual commands reframed as
  fallback for isolating failures.

### Second consolidate-docs pass

- **2 stale cross-refs fixed**:
  - `.cursor/plans/field-integrity-framework-plan`: 6 `active/` paths
    updated to `archive/completed/` (comprehensive-field-integrity,
    field-gap-ledger, evidence files).
  - ADR-138: `active/field-integrity-test-manifest.json` →
    `archive/completed/`.
- **Active README status** updated to "Blocked — CI hanging".
- **Prompt** `last_updated` and date header updated to 2026-03-25.
- **Fitness check**: all 13 tracked files pass.
- **Practice box**: empty.
- **No new code patterns, experience extractions, or distillation needed.**

### First consolidate-docs pass (earlier this session)

- **build-system.md drift fixed**: troubleshooting section implied
  generic `type-check` depends on `sdk-codegen`; corrected to clarify
  only `@oaknational/sdk-codegen` has the override (per ADR-065).
- **4 stale cross-refs fixed**:
  - `high-level-plan.md`: `active/kg-alignment-audit` → `current/`
  - `search-sdk-github-release-asset-distribution`: `active/search-sdk-args-extraction` → `current/`
  - `bulk-canonical-merge` + `search-ingestion-sdk-extraction` in `future/`:
    `./f2-closure-and-p0-ingestion` → `../archive/completed/`
- **distilled.md compressed** 200 → 194/200: graduated turbo build
  system entries to ADR-065 pointer; compressed turbo overrides
  reference in decomposition entry.
- **Fitness check**: all 13 tracked files pass.
- **Practice box**: empty.
- **Experience files**: reflective, no technical content to extract.
- **Code patterns**: no new patterns from turbo/B2 work (domain-specific
  or standard refactoring — doesn't meet the barrier).
- **Doc extraction from completed plans**:
  - `error-response-classification.plan.md`: TSDoc on
    `classify-error-response.ts` already adequate — archived to
    `archive/completed/`.
  - `codegen-schema-error-response-adaptation.plan.md`: added module-level
    TSDoc to `build-response-map.ts` (wildcard consolidation, component
    name sanitisation, downstream consumers). Added response-map mention
    to sdk-codegen README. Archived to `archive/completed/`.
  - Updated `current/README.md`, `prompts/README.md`, and 2 prompt files
    with archive paths.

---

## Session 2026-03-24 — Turbo boundary triage + plan consolidation

### What Was Done

- Distilled napkin (549 lines → archive/napkin-2026-03-24.md).
- Graduated commitlint troubleshooting to CONTRIBUTING.md, vitest v4
  entry to troubleshooting.md.
- Added turbo build system insights to distilled.md (concurrency masks,
  workspace boundary as dependency declaration).
- Compressed response augmentation entry to free space (200/200 ceiling).
- Added turbo-and-codegen-boundary-fix plan to active README index.
- Cross-referenced turbo plan with existing strategic decomposition plan
  at `.agent/plans/architecture-and-infrastructure/codegen/`.

### Turbo Boundary Triage

- **B2 extractions done**: `reader-utils.ts` (extractSubjectPhase),
  `vocab-gen-config.ts` (PipelineConfig/Result + createPipelineConfig).
- **B2 reassessment**: 3 of 5 B2 tests had type-only or no generated-type
  deps — `import type` is erased at compile time. No extraction needed.
- **Turbo overrides extended**: added `#type-check`, `#lint`, `#lint:fix`
  for sdk-codegen (same pattern as `#build`, `#test`).
- **agent-tools bug fixed**: missing `devDependencies` for
  `@oaknational/eslint-plugin-standards` — exposed by removing
  `--concurrency=2`. All other workspaces had it declared.
- **`pnpm clean && pnpm check` passes** with all fixes.
- **B1 deferred**: 4 tests that import generated code directly. Proper
  fix is workspace decomposition (separate workspaces make `^build`
  provide the ordering). Documented in decomposition plan's acceptance
  criteria.
- **Decomposition plan discoverability improved**: direct links from
  architecture README, distilled.md, and turbo plan.

### Semantic Search Plan Consolidation

- **Active/ reduced** from 5 plans + findings register to README + 1 plan.
- **Archived**: turbo-and-codegen-boundary-fix, f2-closure-and-p0-ingestion,
  search-tool-prod-validation-findings.
- **Moved to future/**: bulk-canonical-merge, search-ingestion-sdk-extraction.
- **Single active plan**: `prod-search-assessment.execution.plan.md` — assess
  prod search via MCP server after PR merge and deployment.
- **Cross-ref sweep**: 11 files updated to point at archive/completed/ or
  future/ paths. Archive files left untouched (historical records).
- **Prompt simplified**: semantic-search.prompt.md now reflects single action.
- **Fitness check**: all 13 tracked files pass.

### Learnings

- `import type` is erased by esbuild/SWC — vitest does NOT resolve
  the target module for type-only imports. This means tests with
  `import type { Foo } from './heavy-module.js'` do NOT create a
  runtime dependency on that module's transitive imports.
- When turbo's `--concurrency=N` is removed, ALL undeclared workspace
  dependencies become visible. Check `devDependencies` in every
  workspace that uses shared ESLint plugins, tsconfig bases, etc.
- Turbo `^build` only sees declared `dependencies`/`devDependencies`
  in `package.json`. If a workspace imports another workspace's
  package at ESLint config load time but doesn't declare the dep,
  turbo won't order them correctly.

## Session 2026-03-27 — Sentry/OTel plan location

### What Was Done

- Located the authoritative execution plan for bringing the
  `starter-app-spike` observability patterns into this repo and then
  promoted it into the correct `active/` lane:
  `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
- Created the dedicated handover prompt:
  `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
- Updated the architecture collection indexes so the active plan, current
  queue, and prompt discovery all point at the live execution source.
- Confirmed the older
  `observability/logger-sentry-otel-integration-plan.md` name survives
  only in archived historical docs; the file does not exist in the
  current plans tree.

### Patterns to Remember

- For Sentry/OTel work, distinguish between two things:
  ADR-051 covers the already-complete OpenTelemetry-compliant JSON log
  format in `@oaknational/logger`; the current migration plan is about
  porting the runtime Sentry sink, error tracking adapter, fixture mode,
  MCP wrapping, and deployment wiring from `starter-app-spike`.
- The user made one crucial scope correction: update the HTTP MCP server
  and the Search CLI, but do not adopt this foundation in the deprecated
  standalone STDIO MCP server.
- Authority split for this work must be explicit:
  1. the active execution plan owns implementation facts and acceptance criteria
  2. the review checkpoint owns handover-review state
  3. the prompt is a thin restart surface only
  4. this napkin entry records learnings and caveats, not duplicate facts

### Current Execution Snapshot

- Governance work already landed:
  ADR-141, Sentry reviewer capability surfaces, workflow/reviewer docs,
  milestone/public-alpha/strategy alignment.
- Verified codebase findings already recorded on disk:
  logger still uses `stdoutSink` + `fileSink`;
  env lacks `SentryEnvSchema`;
  HTTP MCP server has per-request `mcpFactory` but no MCP monitoring
  wrapper yet;
  Search CLI still relies on mutable logger globals;

### Review-state note (2026-03-27)

- Historical reviewer findings were received during the bundle rewrite, but the
  authoritative handover-review state now lives in:
  `.agent/plans/architecture-and-infrastructure/active/sentry-otel-foundation.review-checkpoint-2026-03-27.md`
- The refreshed reviewer matrix later cleared the rewritten bundle; consult the
  checkpoint for the authoritative verdict rather than this napkin entry.
- Local documentation validation after the rewrite:
  `pnpm practice:fitness` passes;
  `pnpm markdownlint:root` is currently not runnable in this workspace because
  the `markdownlint` CLI dependency is unavailable locally.
- Immediate next execution order remains:
  create shared observability packages, rewrite the logger around
  `LogSink[]`, add shared Sentry env/config handling, then adopt the
  foundation in the HTTP server and Search CLI.
- `@sentry/node` and direct `@opentelemetry/api` declarations are still runtime
  implementation work; they are not yet in workspace manifests.

### Config re-review note (2026-03-27)

- The refreshed active plan now records deterministic environment resolution
  (`SENTRY_ENVIRONMENT -> VERCEL_ENV -> NODE_ENV -> development`), total release
  resolution (`SENTRY_RELEASE -> VERCEL_GIT_COMMIT_SHA -> GITHUB_SHA ->
  COMMIT_SHA -> SOURCE_VERSION -> npm_package_version -> development-local`),
  and an error union that no longer lets missing release env vars block
  `SENTRY_MODE=off`.
- The authoritative review outcome still belongs in the checkpoint file, not in
  this napkin entry.
