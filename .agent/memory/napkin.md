## Session 2026-03-29 — E2E failure analysis (`feat/mcp_app`)

### What was verified

- Applied `start-right-quick`; Practice Box is empty (`.agent/practice-core/incoming/` contains only `.gitkeep`).
- Current local repro: `pnpm test:e2e` passes on `feat/mcp_app` (20/20 Turbo tasks successful).
- Current branch CI status: latest `CI` run for `origin/feat/mcp_app` (`18e050dd`) is green.

### Key finding

- The recent failed CI runs on `feat/mcp_app` (`13e44690`, `c54707a5`, `7d3e2f8b`, `31d69461`, `87717762`, `07e2e14b`) did **not** fail in E2E; they failed in the lint step before tests ran.
- The concrete E2E regression signal in this branch history is commit `4761550c` (`fix: e2e overrides must use SDK executor, not bypass it`).
- Root cause: some E2E overrides returned raw MCP `content` directly, which bypassed `createUniversalToolExecutor` and therefore skipped `mapExecutionResult()` / `formatToolResponse()`.
- Consequence: tests expecting the SDK-formatted tool response contract (summary text + structured JSON payload) would see the wrong shape.
- Current correct pattern in the tests is to build overrides on top of `createUniversalToolExecutor`, preserving the same formatting pipeline used by production handlers.

## Session 2026-03-29 — CI consolidation, eslint-disable enforcement, widget test cleanup

### CI/Turbo analysis

- CI runs 4 separate Turbo invocations (97 resolved tasks, 36 redundant cache lookups)
- `pnpm qg` already batches into 1 invocation — CI should do the same
- 5 gates missing from CI vs local: `test:e2e`, `test:ui`, `smoke:dev:stub`, `test:root-scripts`, `portability:check`
- Turbo `--summarize` writes `.turbo/runs/*.json` with per-task exit codes — drives GitHub Step Summary reporting

### Playwright test audit (deep, multi-reviewer)

- 16 widget Playwright tests testing dead `window.openai` ChatGPT integration being replaced
- `eslint-disable` for `any` masked stale `window.openai` references — exact failure mode the ban exists to prevent
- 4 landing page tests are valuable and independent — keep
- Deleted: 7 widget Playwright files + 4 renderer integration tests + widget test infra
- Reverted agent-introduced eslint config override (`no-restricted-syntax: 'off'`) — disabling checks is banned absolutely
- Hardcoded Playwright baseURL instead of `process.env` access

### eslint-disable enforcement

- Created `@oaknational/no-eslint-disable` custom ESLint rule (TDD, 15 tests)
- Detects all `eslint-disable` comments; allows user-approved exceptions (JC prefix convention)
- Also detects `@ts-ignore` and `@ts-expect-error` (no exceptions)
- Registered in oak-eslint plugin, activated in recommended config
- Created `check-blocked-content.mjs` PreToolUse hook — blocks agents from writing the JC approval marker

### Key finding: 106 eslint-disable directives in repo

- Ban existed in documentation but had zero automated enforcement
- `type-helpers` (7 instances) and user-approved comments are exceptions
- Phase 3 (remediation of remaining ~101) is next session's primary work
- Remediation categories: generated data files (refactor generators), generator code (split modules), logger (WeakSet<object>), test fakes (narrow interfaces), authored code (extract functions)

### Agent behaviour pattern observed

- Subagent implementer defaulted to "disable the check" (`no-restricted-syntax: 'off'` in eslint config) rather than "fix the code" — demonstrates why automated enforcement is essential
- Every proposed "override" or "config-level exception" is the same pattern: moving the suppression rather than fixing the root cause

---

## Session 2026-03-25 (cont.) — Prod search assessment complete

### Production MCP server verified

- **Deployment**: `dpl_EqsgwygzHhZjGbNwQXVBA4JMDEva` on Vercel,
  commit `0ecbb901` (merge of PR #68), state READY.
- **F1 (threadSlug)**: PASS — 10 lessons returned for
  `fraction`+`number-fractions`, all with correct thread_slugs.
- **F2 (category) negative**: PASS — `nonexistentzzz` returns
  `total: 0`, empty array. Filter correctly active.
- **F2 (category) positive**: PASS — `Biology` returns 2 sequences
  (Primary + Secondary) with matching category_titles.
- **Spot-checks**: all 5 passed (lessons with highlight, units,
  threads queryless, sequences with phaseSlug, suggest with subject).
- **All CI checks green**: test (5m57s), CodeQL, Bugbot, Vercel.
- **Release workflow**: completed successfully.

---

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

## Session 2026-03-26 — Practice scaffolding gap

### Observation: The Practice does not yet support scaffolding a new repo

The Practice is designed to make existing repos excellent — principles,
reviewers, quality gates, memory, experience. But it has no mechanism
for creating a new repo from scratch. This is reasonable: the Practice
is about *how*, not *what*. However, a scaffolding framework could
combine: **mission statement** (what the repo exists to do) + **the
Practice** (how it should be done). That pairing might be sufficient to
generate a well-structured repo from first principles.

Potential shape: a `practice-scaffold` command that takes a mission
description, selects relevant practice-core rules, generates the
directory structure and initial configurations, and wires up the
quality gates. The Practice's plasmid exchange mechanism already handles
*importing* into an existing repo — scaffolding would be the *genesis*
equivalent.
