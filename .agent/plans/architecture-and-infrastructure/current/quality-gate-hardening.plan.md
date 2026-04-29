---
name: "Quality Gate Hardening"
overview: "Unified plan for all pending quality gate enhancements: reconcile gate documentation with reality, standardise ESLint config foundation, promote static analysis tools, harden enforcement, enable mutation testing, and remediate all findings."
todos:
  - id: refresh-open-counts-and-drift
    content: "Tier 0: run promoted knip/depcruise drift checks, run pnpm audit, count eslint-disable and type-assertion warnings, measure coverage baselines."
    status: pending
  - id: reconcile-gate-docs
    content: "Reconcile ADR-121 (matrix + prose + principle #4), ADR-147, build-system.md, workflow.md, accessibility-practice.md — 5 factual errors, 2 verify-vs-mutate discrepancies, stale prose, falsified principle, inter-ADR contradiction."
    status: completed
  - id: pre-push-turbo-exit-propagation
    content: "Fix and prove pre-push exits non-zero when the main Turbo gate fails; required before relying on further hook-based gate promotion."
    status: pending
  - id: eslint-config-standardisation
    content: "Audit and standardise ESLint flat-config composition across all workspaces. Foundation — must precede all lint-rule promotions."
    status: pending
  - id: add-dependency-audit-gate
    content: "Add pnpm audit to CI workflow and pre-push hook with ADR-158 — dependency vulnerability scanning is currently absent from all gate surfaces."
    status: pending
  - id: add-coverage-thresholds
    content: "Add vitest coverage thresholds — currently configured for reporting only, no enforcement."
    status: pending
  - id: flaky-test-investigation
    content: "Investigate and resolve two known flaky E2E tests under Turbo concurrency (application-routing auth + get-curriculum-model)."
    status: pending
  - id: forbidden-comment-test-infrastructure
    content: "Ensure the no-eslint-disable rule can be tested without weakening any gate — use string construction or fixtures, not hook exemptions."
    status: pending
  - id: oak-eslint-self-linting
    content: "Subject the oak-eslint workspace to the oak-eslint recommended/strict config, unless circular dependency prevents it."
    status: pending
  - id: promote-no-eslint-disable
    content: "Promote @oaknational/no-eslint-disable from warn to error after eslint-disable-remediation.plan.md completes."
    status: pending
  - id: enable-knip
    content: "Completed: knip findings triaged and promoted to blocking QG. Child plan: knip-triage-and-remediation.plan.md"
    status: completed
  - id: enable-depcruise
    content: "Completed: dependency-cruiser findings resolved and promoted to blocking QG, with manifest/API enforcement kept separate."
    status: completed
  - id: enable-max-files-per-dir
    content: "Route max-files-per-dir through the ADR-166 directory-cardinality child plan before any repo-wide gate promotion."
    status: pending
  - id: promote-type-assertions-in-tests
    content: "Remove the testRules exception that makes consistent-type-assertions a warning rather than an error. Remediate all ~218 assertion warnings across 6 workspaces."
    status: pending
  - id: no-child-process-in-tests-rule
    content: "Create @oaknational/no-child-process-in-tests ESLint rule enforcing the testing-strategy.md prohibition on process spawning in test files."
    status: pending
  - id: built-artifact-proof-in-e2e
    content: "Mandate test:e2e boots dist/ artefacts under plain Node; fold built-artifact proof into E2E, not a separate lane."
    status: pending
  - id: enable-stryker-all-workspaces
    content: "Enable Stryker mutation testing in all workspaces with initial loose thresholds. Create incremental remediation plan."
    status: pending
  - id: promote-widget-a11y-to-ci
    content: "Add test:a11y, test:widget, test:widget:ui, test:widget:a11y to CI workflow — currently local-only gates with no remote enforcement."
    status: pending
---

# Quality Gate Hardening

**Last Updated**: 2026-04-29
**Status**: Current — owner decisions resolved 2026-04-11, ADR-121 reconciled; gate topology implemented except the known pre-push Turbo exit-propagation blocker
**Scope**: All pending quality gate promotions and enforcement hardenings, consolidated into a single plan with remediation work for each.

## Problem and Intent

The repository has some quality tools still awaiting promotion, enforcement
gaps where checks are weaker than the principles demand, and historical
documentation drift where gate documentation needed reconciliation. Knip and
dependency-cruiser are now completed gate foundations; remaining work must not
reopen those promotions unless a fresh drift check finds new issues.

This plan unifies all pending quality gate work into a single plan to prevent
fragmentation across multiple small plans.

Per the 2026-04-09 sequencing decision, this was the first plan to promote once
the current improvement tranche was complete. The TS2430 gate fix
(`feat/gate_hardening_part1`, commit `a03f3b32`) was the last blocker — all 88
quality gates now pass.

Targeted CI debugging on 9 April 2026 confirmed a concrete dependency-enforcement
gap behind PR #76. In an isolated Turbo run, `@oaknational/sdk-codegen#sdk-codegen`
failed with `ERR_MODULE_NOT_FOUND` for undeclared `@oaknational/observability`,
and targeted `knip` also flagged undeclared `@elastic/elasticsearch` usage plus
a stale `@modelcontextprotocol/ext-apps` dependency in the same workspace.
`dependency-cruiser` did not report that class of issue, and the blocking
`pnpm check` path never ran `knip`, so the defect escaped until CI-style
execution. The same isolated verification also exposed `@oaknational/logger`
missing `@types/express` for standalone type-check/build.

Commit-hook reproduction on the same date confirmed a separate quality-gate
hardening issue: source-imported tests can accidentally become build-aware when
runtime startup validation is hard-wired into app composition code. The
`@oaknational/oak-curriculum-mcp-streamable-http` test surface hit this because
`createApp()` failed fast when `dist/oak-banner.html` was missing. The correct
remediation was not to make generic source tests depend on `build`, but to keep
build artefact validation in `pnpm build` / built-system coverage and inject a
no-op validator into in-process tests.

Vercel preview debugging on the same date exposed a second, related gap: dev
loaders such as `tsx` can mask Node ESM resolver defects that only appear when
the built artefact is executed under plain Node. The HTTP app worked in local
dev but crashed on deployed startup because extensionless
`@modelcontextprotocol/sdk/*` subpath imports survived into built code. The
correct response was a focused built-artifact proof (`dist/application.js`
imported under plain Node), not weakening source tests or assuming dev success
proves production startup.

The same debugging work also exposed repo-wide ESLint config drift: some
workspaces still used legacy `import-x/resolver` wiring, some relied on
workspace-local resolver overrides, and parser-side typed-lint settings had
started to blur together with import-resolution settings. Before more lint or
static-analysis promotions, the repo needs an explicit audit and
standardisation pass across all workspace `eslint.config.ts` files so the
quality gates are trustworthy and mechanically consistent.

A full repo-root `pnpm lint` rerun after the resolver clean-up also surfaced an
advisory warning in `apps/oak-curriculum-mcp-streamable-http`: ESLint is
loading multiple TS projects for the combined server + widget workspace. That
warning should be treated as a real configuration-hardening task, not
suppressed away. The long-term fix is to standardise multi-project workspaces
on a single `tsconfig` with `references`, or another explicitly approved
pattern, so typed lint stays both truthful and predictable.

## Findings (2026-04-11 audit)

### Historical gate documentation drift before reconciliation

Before reconciliation, ADR-121 had **5 factual errors**,
**1 labelling ambiguity**, and **1 additional verify-vs-mutate discrepancy**
in its coverage matrix:

1. ADR said CI **excludes** `test:e2e` — CI **included** it
2. ADR said CI **excludes** `smoke:dev:stub` — CI **included** it
3. ADR said CI **excludes** `test:ui` — CI **included** it
4. ADR said `pnpm check` uses `secrets:scan:all` — it used
   `secrets:scan` (branch/tag scope, not full history)
5. *(labelling ambiguity)* ADR matrix cell for `pnpm check` format
   already annotated `(format:root)` but the row label misleadingly
   implies verify-only
6. ADR said `pnpm check` uses `markdownlint-check` — it used
   `markdownlint:root` (mutating fix mode)
7. ADR said `pnpm check` uses `lint` — it used `lint:fix`
   (same verify-vs-mutate class as points 5 and 6)

The verify-vs-mutate pattern (points 5-7) was systematic: `pnpm check`
used fix-mode commands (`format:root`, `markdownlint:root`, `lint:fix`)
while other surfaces used verify-only commands. The reconciliation captured
that as a deliberate decision with rationale.

**Beyond the matrix**, ADR-121's prose was also stale:

- **Rationale for exclusions** (lines 72-78): says "CI excludes
  `test:e2e`: E2E tests hit Elasticsearch" — this was false
- **Consequences** (lines 108-110): says `test:ui` and
  `smoke:dev:stub` are local-only — also false at the time
- **Design principle #4**: "CI runs a strict subset of what
  pre-push covers" — CI now includes `test:e2e`, `test:ui`, and
  `smoke:dev:stub`, none of which are in pre-push. CI is broader
  in some dimensions, not a strict subset. This principle must be
  either restored or revised.
- **ADR-147 contradiction**: ADR-147 states "Tests run in CI via
  test:a11y script" but ADR-121 explicitly marks `test:a11y` as
  excluded from CI. These two accepted ADRs contradicted each other.

Additional documentation drift:

- `docs/engineering/build-system.md`: matrix missing
  `test:widget:ui` and `test:widget:a11y` rows; inline `pnpm check`
  script shows sequential pnpm commands but actual is a single turbo
  invocation; `test:all` inline script also stale
- `docs/engineering/workflow.md` (line 114): falsely claims "E2E,
  UI, and smoke tests run locally only" — CI includes all three
- `docs/governance/accessibility-practice.md`: references quality
  gates that will change if `test:a11y` is promoted to CI

All of the above was corrected by the completed reconciliation before later
hardening decisions that relied on the coverage matrix.

### Missing gate: dependency vulnerability scanning

`pnpm audit` is not in any gate surface (pre-commit, pre-push, CI, or
`pnpm check`). `docs/governance/safety-and-security.md` mentions it as a
practice but it is not enforced. Known CVEs in transitive dependencies
would pass all gates undetected.

### Missing enforcement: coverage thresholds

`vitest.config.base.ts` configures v8 coverage with reporters (`text`,
`json`, `html`) but **no thresholds**. Coverage is report-only. A
workspace could drop to 0% coverage and all gates would still pass.

### Missing gate surface: test:a11y and test:widget in CI

ADR-147 makes browser accessibility a "blocking quality gate" but
`test:a11y`, `test:widget`, `test:widget:ui`, and `test:widget:a11y` only
run in `pnpm check` (local). They are absent from CI. A PR could regress
accessibility and merge if the author doesn't run `pnpm check` locally.

### Flaky E2E tests: unresolved, untracked

Two distinct flaky E2E tests have been observed across multiple sessions:

1. `application-routing.e2e.test.ts`: "returns HTTP 401 for tools/list
   with fake Bearer token" — failed during `pnpm check` (Turbo
   concurrency), passed on isolated `pnpm test:e2e` re-run
2. `get-curriculum-model.e2e.test.ts` — intermittent failure under Turbo
   concurrency (noted in sessions 2026-04-08e/09 and 2026-04-11)

No fix has been applied. No tracking file exists. The napkin referenced
`project_flaky-test-tracker.md` but the file was never created.

### Suppression counts (verified 2026-04-11)

- `@ts-ignore`: 0 real directives (only in ESLint rule test strings)
- `@ts-expect-error`: 1 real use (ESLint rule boundary test, intentional)
- `as any`: 0 in source
- `as unknown as` (double assertion): 2 instances (test fakes)
- ESLint disable comments: ~8 files with real suppressions, mostly
  `max-lines` on generated data and `consistent-type-assertions` in
  test fakes
- `@oaknational/no-eslint-disable`: at `warn`, TODO to promote to `error`

### Assumptions requiring validation

**Open counts (must refresh before committing to remaining execution):**

1. **Knip and depcruise drift checks are current** — both tools have completed
   promotion baselines. Re-run them as drift checks, not as fresh triage or
   promotion work.
2. **ESLint disable count (~64) is current** — from 2026-03-29. Some
   remediation may have occurred during subsequent work. Must re-count.
3. **`consistent-type-assertions` warning count (~218) is current** —
   not re-verified. Must re-count before estimating effort.

**Technical hypotheses:**

5. **Flaky tests are Turbo-concurrency-related** — this is the working
   hypothesis but not proven. Additional hypotheses to investigate:
   `createStubbedHttpApp` uses `process.cwd()` for `startDir` — under
   Turbo multi-task cwd semantics, ambient `.env` / filesystem discovery
   can produce non-deterministic config; Vitest intra-package parallelism
   vs Turbo cross-package concurrency should be tested separately;
   module-scope mutable state (caches, one-time init flags) in
   `createApp` imports; for the 401 case, log actual status + body on
   failure to distinguish auth bypass vs error vs redirect. Port
   conflicts are a weaker hypothesis since both tests use supertest
   against in-process Express (no fixed listen port).
6. **oak-eslint self-linting circular dependency risk** — assumed
   possible but not investigated. May not be a real issue.
7. **Built-artifact proof scope** — assumed only
   `oak-curriculum-mcp-streamable-http` needs this, but other workspaces
   using `tsx` in dev may have the same gap. A grep for `tsx` in dev
   scripts would validate this in 10 minutes.
8. **Coverage thresholds can be set without large remediation** — unknown
   what current coverage levels are across workspaces.

**Hidden assumptions (surfaced by reviewers):**

9. **eslint-disable remediation will complete in reasonable time** —
   the remediation plan (`eslint-disable-remediation.plan.md`) is marked
   "IN PROGRESS" but every single todo is `pending`. No work has
   started. This blocks item 3 (`no-eslint-disable` promotion)
   indefinitely. Must re-assess progress before scheduling item 3.
10. **`pnpm audit` can be added without large remediation** — transitive
    CVEs in a large monorepo can number in the dozens; some may require
    upstream fixes or overrides that take weeks. Must run `pnpm audit`
    first to assess.
11. **Playwright tests are deterministic in CI** — widget/a11y tests may
    behave differently under GitHub Actions (headless Chromium, different
    OS, resource constraints). Must define stability acceptance criteria
    (e.g. N consecutive green mainline runs) before making blocking.
12. **ESLint config standardisation effort is 1-2 days** — the plan
    describes drift involving legacy resolver wiring, workspace-local
    overrides, and blurred parser settings across 10+ workspaces. Each
    workspace may need individual attention. 2-3 days may be more
    realistic.

## Effort/Impact Classification

### Tier 0: Refresh Open Counts and Static-Analysis Drift

Before committing to tiered execution, re-run active open tools to update
counts. Completed static-analysis promotions are historical baselines, not
future work.

- `pnpm knip` — completed and promoted 2026-04-11; rerun only as drift check
- `pnpm depcruise` — completed and promoted 2026-04-12; rerun only as drift check
- Count eslint-disable comments — last counted 2026-03-29
- Count `consistent-type-assertions` warnings — never re-verified
- `pnpm audit` — never run as a gate, current findings unknown
- Run coverage across all workspaces — baselines unknown

### Tier 1: Foundations (< 1 day each, High impact)

These must complete before any tool promotion or rule hardening.

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Reconcile ADR-121 (matrix + prose + principle #4) + ADR-147 + build-system.md + workflow.md | 2-4 hrs | High | Wrong docs cause wrong hardening decisions; scope is larger than matrix alone |
| ESLint config standardisation | 2-3 days | High (foundation) | Prerequisite for trustworthy lint gates; must precede all lint-rule promotions |
| Investigate + fix flaky E2E tests | 1-2 hrs | High | Silent test erosion undermines all other gates |

### Tier 2: Gate additions (hours each, High impact)

New gates that fill genuine enforcement gaps.

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Add `pnpm audit` gate (new ADR-158, parallels ADR-111) | < 1 hr + triage | High | Zero vulnerability scanning today; must run audit first to assess findings |
| Static-analysis drift check | 1-2 hrs | Medium | Rerun promoted `knip` and `depcruise` to catch drift, not to reopen promotion |
| Built-artifact proof in E2E | 2-3 hrs | High | Mandate `test:e2e` boots `dist/` under plain Node, not a separate lane |
| Promote test:a11y + widget to CI | 1-2 hrs + stability validation | Medium-High | ADR-147 says blocking but CI doesn't enforce; need N consecutive green runs |
| Add coverage thresholds (ratchet model) | 2-4 hrs | Medium-High | Depends on baselines; pair with awareness of `passWithNoTests: true` |

### Tier 3: Rule promotions (1-2 days each, Medium impact)

Lint-rule and static-analysis promotions. All lint-rule items depend
on ESLint config standardisation (Tier 1) completing first.

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Depcruise drift follow-up | Routed to completed child | Medium | Baseline promotion complete; only new drift or config changes belong here |
| `consistent-type-assertions` promotion | 1-2 days | Medium | ~218 warnings; mechanical bulk but structural fakes may slip |
| `no-eslint-disable` promotion | Blocked by eslint-disable remediation | High | Remediation plan has zero progress; re-assess before scheduling |
| Forbidden-comment test infrastructure | 0.5 day | Medium | Must solve without weakening any gate |

### Tier 4: Long-tail (days each, Lower immediate impact)

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Knip drift follow-up | Routed to completed child | Medium | Baseline promotion complete; only new drift or config changes belong here |
| Package API / deep-import enforcement | ADR-166 enforcement layer | High (eventual) | Requires visibility baseline and deterministic failure mode |
| Stryker mutation testing | 2+ days | Medium | Needs healthy test suite first (test audit sibling plan) |
| `no-child-process-in-tests` rule | 1 day | Low-Medium | 2 existing violators |
| `max-files-per-dir` enablement | ADR-166 directory-cardinality child | Low now, higher after baseline | Estimate and dependencies live in the child plan |
| oak-eslint self-linting | 0.5 day | Low | Low external impact |

## Domain Boundaries

### In Scope

1. **Gate documentation reconciliation** — ADR-121 (matrix + prose +
   principle #4), ADR-147, build-system.md, workflow.md,
   accessibility-practice.md
2. **ESLint config standardisation** — foundation for all lint gates
3. **Dependency vulnerability scanning** — `pnpm audit` + ADR-158
4. **Flaky E2E test investigation and resolution**
5. **Coverage threshold enforcement** (ratchet model, per-workspace)
6. **Promote test:a11y + widget tests to CI** (with stability criteria)
7. **Built-artifact proof in E2E** (fold into `test:e2e`)
8. **Forbidden-comment test infrastructure** — solve without weakening
   any gate (no exemptions)
9. **oak-eslint self-linting**
10. **`@oaknational/no-eslint-disable` promotion** — warn to error
11. **knip/depcruise drift checks** — rerun promoted gates and route any new
    drift to the completed child plans
12. **max-files-per-dir** — route through ADR-166 directory-cardinality child
13. **`consistent-type-assertions` in tests** — promote to error
14. **Stryker mutation testing**
15. **`no-child-process-in-tests` ESLint rule**

### Not in Scope

- Remediation of the ~64 remaining eslint-disable comments (tracked in
  `eslint-disable-remediation.plan.md`)
- New Playwright tests for the replacement widget (tracked separately)

### CI feedback loop budget

Every gate addition increases CI duration. This plan must not degrade
the feedback loop without acknowledgement. Define maximum acceptable
execution time budgets for pre-push and CI. If new tools breach these
budgets, add explicit caching, parallelisation, or Turbo configuration
to compensate.

## Dependencies and Sequencing

| Enhancement | Depends on | Notes |
|------------|-----------|-------|
| Tier 0: Refresh open counts and drift | None | **Do before everything** — effort estimates depend on current data |
| ADR-121 + ADR-147 reconciliation | None | **Do first** — all other decisions depend on accurate gate docs |
| ESLint config standardisation | None | **Foundation** — must precede all lint-rule promotions |
| Flaky E2E investigation | None | Independent |
| `pnpm audit` gate | ADR reconciliation | Run `pnpm audit` first to assess findings; new ADR-158 |
| Static-analysis drift check | Completed promotion baselines | Rerun `knip` and `depcruise`; do not re-plan completed promotion |
| Built-artifact proof in E2E | None | Fold into `test:e2e`, not a separate lane |
| Promote a11y/widget to CI | ADR reconciliation | Must prove deterministic (N consecutive green runs) |
| Coverage thresholds | None | Must measure baselines first |
| Depcruise drift follow-up | Completed depcruise child plan | Only new drift or config changes belong here |
| `consistent-type-assertions` | **ESLint config standardisation** | Lint-rule promotion on trustworthy infrastructure |
| `no-eslint-disable` promotion | **ESLint config standardisation** + `eslint-disable-remediation.plan.md` | Remediation plan has zero progress; re-assess |
| `max-files-per-dir` | ADR-166 directory-cardinality child + ESLint config standardisation | Gate promotion waits for enforcement-layer preconditions |
| Forbidden-comment test infra | None | Must solve without gate weakening |
| Knip drift follow-up | Completed knip child plan | Only new drift or config changes belong here |
| Package API / deep-import enforcement | ADR-166 enforcement layer | Requires visibility baseline and deterministic failure mode |
| Stryker | Test audit (sibling plan) | Mutation testing most valuable after healthy suite |
| `no-child-process-in-tests` | None | Prevents future violations |
| oak-eslint self-linting | Forbidden-comment infra | Investigate circular dependency risk first |

## Enhancement Details

### 0a. Reconcile ADR-121, ADR-147, and downstream docs — COMPLETE

**Completed**: ADR-121 reconciliation is complete and the frontmatter todo is
marked done. This section remains as historical context for why gate-surface
documentation needed a reconciliation pass.

**Follow-up**: Any new gate-surface change must update ADR-121 and build-system
docs in the same landing as the actual check promotion. Do not reopen this
historical reconciliation as future work unless new drift is discovered.

Completed remediation covered the coverage matrix, exclusion rationale,
consequences, design-principle wording, verify-vs-mutate decision, secret-scan
surface, ADR-147 alignment, and downstream docs that were stale at the time.

**Remediation**: Complete. Future gate-surface drift should open a new dated
finding instead of reopening this historical reconciliation.

### 0b. Add Dependency Vulnerability Scanning (NEW)

**Problem**: `pnpm audit` is not in any gate surface. Known CVEs in
transitive dependencies pass all gates undetected.

**Fix**: Create ADR-158 (paralleling ADR-111 for secret scanning) to
document the decision, threshold choice, and override strategy. Add
`pnpm audit --audit-level=high` to CI workflow, pre-push hook, and
`pnpm check`. The `high` threshold blocks on high/critical CVEs only,
which balances security with the realities of the npm ecosystem's
transitive dependency chains.

**Remediation**: Triage any current audit findings. Likely some
`pnpm audit` failures exist today in transitive deps — need to assess
before deciding threshold.

**Assumption**: `pnpm audit` can be added without large remediation.
Must verify by running it first. Transitive CVEs in a large monorepo
can number in the dozens; some may require upstream fixes or overrides.

### 0c. Investigate and Resolve Flaky E2E Tests (NEW)

**Problem**: Two E2E tests fail intermittently under Turbo concurrency
but pass in isolation. No tracking, no investigation, no fix.

**Fix**: Reproduce under `pnpm check` concurrency. Apply systematic
debugging (reproduce, isolate, hypothesise, verify, fix, regression-test).

Hypotheses to test (prioritised by reviewer feedback):

1. **Ambient env / startDir**: `createStubbedHttpApp` uses
   `process.cwd()` for `startDir` — under Turbo multi-task cwd
   semantics, ambient `.env` / filesystem discovery can produce
   non-deterministic config. Pin `startDir` to a non-repo path and
   compare flake rate.
2. **Vitest intra-package parallelism**: run only
   `oak-curriculum-mcp-streamable-http` E2E with `fileParallelism:
   false` vs default; separate Vitest-level concurrency from
   Turbo cross-package concurrency.
3. **Module-scope mutable state**: grep `createApp` imports for
   module-level caches, one-time init flags, or singletons.
4. **Turbo resource pressure**: capture failure messages (401 vs 500
   vs timeout) to distinguish auth logic from resource starvation.
5. Port conflicts are a weaker hypothesis since both tests use
   supertest against in-process Express (no fixed listen port).

**Remediation**: Fix the root cause. If genuinely non-deterministic
under concurrency, the tests need isolation (unique ports, serialised
execution, or retry).

**Assumption**: Flakiness is Turbo-concurrency-related, not a genuine
product bug. This assumption is unverified.

### 0d. Promote test:a11y and Widget Tests to CI (NEW)

**Problem**: ADR-147 establishes browser accessibility as a "blocking
quality gate" but `test:a11y`, `test:widget`, `test:widget:ui`, and
`test:widget:a11y` only run in `pnpm check` (local). CI does not
enforce them. A PR can regress accessibility and merge.

**Fix**: Add these test suites to the CI workflow's Turbo invocation.
They require Playwright, which CI already installs (`pnpm exec playwright
install --with-deps chromium`).

**Acceptance criteria**: N consecutive green mainline runs (suggest 5)
before promoting to blocking. Define maximum acceptable CI time budget
increase — every gate addition increases the feedback loop duration.

**Remediation**: May reveal failures if the CI environment differs from
local. Must verify all 4 suites pass in CI before making them blocking.
Widget tests depend on the widget build step (`build:widget`).

**Assumption**: The Playwright tests are deterministic in CI. Widget
tests may depend on the widget build step. GitHub Actions headless
Chromium may behave differently from local.

### 0e. Add Coverage Thresholds (NEW)

**Problem**: `vitest.config.base.ts` configures v8 coverage for
reporting only. No thresholds. A workspace could drop to 0% coverage
and all gates would pass.

**Fix**: Run coverage across all workspaces to establish current
baselines. Set per-workspace thresholds at or slightly below current
levels (ratchet model — can only go up). Add `coverage.thresholds` to
per-workspace configs (not base, to avoid unfairly constraining thin
packages with the same threshold as hot packages).

**Additional concern**: `vitest.config.base.ts` sets
`passWithNoTests: true`, which means coverage thresholds alone do not
rescue from misconfigured include globs or empty suites. A workspace
could have zero meaningful tests if globs are wrong. Consider pairing
thresholds with a minimum test file count check or a CI assertion that
vitest actually ran expected suites.

**Remediation**: If current coverage is low in some workspaces, either
set thresholds low (accept current state) or improve coverage first.

**Assumption**: Current coverage levels are unknown. Must measure before
deciding thresholds.

### 1. Forbidden-Comment Test Infrastructure

**Problem**: The `check-blocked-content.mjs` hook blocks agents from
writing the user-approval marker in files. The ESLint rule's test file
(`no-eslint-disable.unit.test.ts`) must contain test strings with that
marker to verify the rule allows approved comments.

**Fix**: The test file must test the rule without weakening any gate.
Approaches: construct the forbidden pattern via string concatenation or
template literals in the test (so the literal pattern is never in the
file), or load test fixtures from a format the hook does not scan. The
hook must NOT be given exemptions for test files — the principle is
strictness, not convenience.

**Remediation**: Refactor test strings in
`no-eslint-disable.unit.test.ts` to avoid literal forbidden patterns.

### 2. oak-eslint Self-Linting

**Problem**: The oak-eslint workspace uses a minimal ESLint config (`tseslint.configs.strict` directly) rather than its own `configs.recommended`. This means the workspace that defines the rules doesn't follow them.

**Fix**: Update `packages/core/oak-eslint/eslint.config.ts` to use `configs.recommended` (or `configs.strict`). Investigate whether importing the config from the package's own source creates a circular dependency at build time. If it does, use the built `dist/` output.

**Remediation**: Fix any rule violations within the oak-eslint package that are revealed.

### 3. Promote `no-eslint-disable` from warn to error

**Problem**: Currently at `warn` to allow the active CI plan's Phase 3 remediation to proceed without blocking lint.

**Fix**: Change `'@oaknational/no-eslint-disable': 'warn'` to `'error'` in `recommended.ts` after all unapproved eslint-disable comments have been removed.

**Remediation**: None — all remediation happens in the active CI plan.

### 4. Enable knip as a Blocking Quality Gate — COMPLETE

**Completed**: 2026-04-11. All 904 knip findings triaged and remediated
across Phases 0-3 (child plan). Knip promoted to all four gate surfaces:
pre-commit, pre-push, CI, and `pnpm check`. ADR-121 coverage matrix
updated. See child plan
`knip-triage-and-remediation.plan.md` for full resolution details.

### 5. Enable dependency-cruiser as a Blocking Quality Gate — COMPLETE

**Completed**: 2026-04-12. The child plan
[depcruise-triage-and-remediation.plan.md](depcruise-triage-and-remediation.plan.md)
resolved the circular-dependency and orphan baseline, promoted strict
dependency-cruiser coverage, and left `.dependency-cruiser.mjs` plus
`pnpm depcruise` in the root quality-gate path.

Dependency-cruiser still does not police every package-manifest concern. That
is not a depcruise defect; package export and deep-import enforcement belongs
to the ADR-166 enforcement layer after visibility and remediation planning.

### 6. Enable max-files-per-dir via the Directory-Cardinality Child Plan

**Problem**: The `@oaknational/max-files-per-dir` ESLint rule exists but is
not registered or activated. The rule also depends on configured inventories,
so a careless activation can silently no-op.

**Fix**: Execute
[developer-experience/current/directory-complexity-enablement.execution.plan.md](../../developer-experience/current/directory-complexity-enablement.execution.plan.md)
as the directory-cardinality child of ADR-166. That plan owns the baseline
refresh, deterministic inventory contract, RED rule/config tests, pilot
calibration, and staged activation.

**Remediation**: Do not split directories mechanically. Each breach must route
to a structural response: cohesive intra-layer extraction, lower-layer move,
workspace split, dead-code deletion, or generated output.

**Gate note**: ADR-121 and build-system docs must change only when a
`max-files-per-dir` check actually runs on a gate surface.

### 7. Promote `consistent-type-assertions` in Tests to Error

**Problem**: `testRules` in `packages/core/oak-eslint/src/index.ts` sets `@typescript-eslint/consistent-type-assertions` to `warn` with `assertionStyle: 'never'`. This was an intermediate step (promoted from `off` to `warn`). The final state should be `error`.

**Fix**: Change to `error`. Fix all ~218 assertion warnings across 6 workspaces by narrowing fake interfaces, using DI, or constructing objects with the right shape directly.

**Remediation**: Large — each workspace's test fakes need individual attention. Parallel agents can handle independent workspaces.

### 8. No-Child-Process-in-Tests ESLint Rule

**Problem**: The testing strategy prohibits spawning child processes in test files, but enforcement is manual. Three E2E test files in `oak-search-cli` spawn `npx`/`pnpm` child processes; one (`cli-exit.e2e.test.ts`) was the sole CI failure on PR #70 and was deleted. The remaining two (`benchmark-cli.e2e.test.ts`, `bulk-retry-cli.e2e.test.ts`) have the same pattern. Without an automated rule, new violations will accumulate.

**Fix**: Create `@oaknational/no-child-process-in-tests` ESLint rule that bans `spawn`, `exec`, `execFile`, `execSync`, `spawnSync`, and `fork` imports from `child_process` / `node:child_process` in files matching `*.test.ts` and `*.spec.ts` patterns. The rule should suggest using vitest's in-process testing, or moving the test to a standalone script outside the test runner.

**Remediation**: Fix or delete the remaining two process-spawning E2E files. The test audit (sibling plan) will identify any others.

**Relationship to test audit**: The ESLint rule prevents future violations; the test audit triages existing ones.

### 9. Built-Artifact Proof in E2E Tests

**Problem**: Some workspaces run source through `tsx`, Vite, or other dev
loaders locally but ship built JavaScript under plain Node or another
stricter runtime. Dev success can therefore mask resolver or bootstrap
defects in the actual deployed artefacts.

**Confirmed example (9 April 2026)**:

- `apps/oak-curriculum-mcp-streamable-http` worked via `tsx src/index.ts`
- The first Vercel preview after CI crashed on startup
- Root cause: built code still contained extensionless
  `@modelcontextprotocol/sdk/*` subpath imports that Node ESM rejected
- The fix belonged in generator/runtime code plus a dedicated
  plain-Node import proof for `dist/application.js`

**Fix** (revised per architecture review): Do NOT create a separate
"startup proof lane". Instead, mandate that `test:e2e` boots the `dist/`
artefacts under plain Node. E2E tests that run against the dev loader
rather than the built artefact are integration tests providing false
confidence, not genuine E2E tests. If `test:e2e` already runs against
`dist/` and the crash still slipped through, the E2E suite is missing a
basic startup/health-check test — add one.

This is the correct architectural seam: source-imported tests validate
code; E2E tests validate the built, deployed system. Keep these
distinct.

**Remediation**: Workspace-specific. Verify which workspaces use `tsx`
in dev but ship built JS under plain Node (a grep for `tsx` in dev
scripts would enumerate them in 10 minutes).

### 10. Enable Stryker Mutation Testing

**Problem**: Stryker is configured but not enabled as a gate. Existing plan at `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md`.

**Fix**: Enable `pnpm mutate` in all workspaces. Configure initial thresholds loose enough for current code to pass. Then create an incremental plan to tighten thresholds and improve test suite effectiveness.

**Remediation**: Per-workspace configuration and threshold tuning. New tests where mutation testing reveals uncovered behaviour.

## Owner Decisions (Resolved 2026-04-11)

### Decision 1: Pre-push === CI (same check set)

Pre-push and CI run the same checks. A CI-only failure is immediately
diagnostic — it indicates an environmental or configuration issue, never
"a check you didn't run." Pre-commit remains the fast local gate.

ADR-121 principle #4 becomes: "Pre-push and CI run the same check set.
Pre-commit is the fast local gate."

Concrete changes: add `subagents:check`, `portability:check`,
`test:root-scripts`, `test:ui`, `smoke:dev:stub` to pre-push; remove
`--only` from `test:e2e`; add `sdk-codegen` to CI Turbo invocation.
When `test:a11y` and widget tests are promoted (item 0d), add to both
surfaces simultaneously.

### Decision 2: Developer surfaces fix then verify; remote surfaces verify only

`pnpm check` uses fix-mode commands (`format:root`, `markdownlint:root`,
`lint:fix`) — this is **intentional**. It is a developer workflow that
produces a clean state then verifies it. Pre-commit, pre-push, and CI
use check/verify-only commands — also intentional. Mutations in CI are
invisible and misleading; mutations in a developer workflow are useful
and immediate.

### Decision 3: Branch-scope secret scanning everywhere

Full-history scanning (`secrets:scan:all`) is idempotent after the first
clean run. Unless someone rewrites history (prohibited), re-scanning
full history is ceremony without enforcement value. All routine gate
surfaces use branch-scope scanning (`secrets:scan`).
`secrets:scan:all` is retained as a bootstrap/audit action, not a
per-push gate. Change pre-push and CI from `secrets:scan:all` to
`secrets:scan`.

## Risks and Unknowns

- **Open counts may be stale** — eslint-disable was last counted 2026-03-29
  and type-assertions have never been re-verified. Knip and depcruise are
  completed gate foundations; rerun them as drift checks only.
- Isolated-worktree verification can reveal missing manifest entries
  masked by parent `node_modules` resolution
- Workspace-level ESLint config drift can create false unresolved-import
  failures or mask real ones — this is why ESLint config standardisation
  must precede lint-rule promotions
- If a source-imported test depends on build outputs, refactor the seam
  or move the proof to E2E — don't teach source tests to depend on
  `build`
- `tsx`, Vite, or similar dev loaders can mask built-runtime resolver
  defects; E2E tests must boot the built artefact under plain Node
- oak-eslint self-linting may hit circular dependency — needs
  investigation
- Stryker thresholds need calibration per workspace — initial run needed
- `consistent-type-assertions` remediation is labour-intensive (~218
  warnings); mechanical bulk is realistic but structural fakes (shared
  test helpers, wide integration surfaces) may slip calendar estimates
- `pnpm audit` may surface findings requiring upstream fixes or
  overrides that take weeks
- Coverage thresholds: current levels unknown, may be low in some
  workspaces; `passWithNoTests: true` means thresholds alone don't
  protect against misconfigured include globs
- Flaky E2E tests: root cause unverified; `createStubbedHttpApp` uses
  `process.cwd()` which is non-deterministic under Turbo
- Widget/a11y tests in CI: may be non-deterministic in GitHub Actions;
  need N consecutive green runs before promoting to blocking
- **Feedback loop degradation**: every gate addition increases CI
  duration. Must define time budgets and compensate with caching /
  parallelisation if breached.
- `vitest.config.base.ts` documents widespread `process.env` mutation
  and uses `isolate: true` + `pool: 'forks'` as mitigation — this
  conflicts with testing-strategy.md ("NEVER mutate `process.env`").
  Long-term, flakes and mutation testing noise both get worse when
  tests depend on global env.
- eslint-disable remediation plan has zero completed todos — item 3
  (`no-eslint-disable` promotion) is blocked indefinitely until that
  plan progresses

## Absorbed Plans

This plan supersedes and absorbs:

- `.agent/plans/architecture-and-infrastructure/static-analysis-tool-promotion.plan.md` (knip + depcruise)
- `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md` (Stryker)

When this plan is promoted to `current/`, archive those plans with a
note pointing here. **TODO**: add a superseded-by pointer in each
absorbed plan's frontmatter.

## Sibling Plans

- `test-suite-audit-and-triage.plan.md` — deep audit of all tests
  (process spawning, implementation coupling, value assessment). Should
  run before Stryker enablement so mutation testing operates on a
  healthy suite.
