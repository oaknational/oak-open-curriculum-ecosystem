---
name: "Quality Gate Hardening"
overview: "Unified plan for all pending quality gate enhancements: reconcile gate documentation with reality, standardise ESLint config foundation, promote static analysis tools, harden enforcement, enable mutation testing, and remediate all findings."
todos:
  - id: refresh-stale-counts
    content: "Tier 0: re-run pnpm knip, pnpm depcruise, pnpm audit, count eslint-disable and type-assertion warnings, measure coverage baselines."
    status: pending
  - id: reconcile-gate-docs
    content: "Reconcile ADR-121 (matrix + prose + principle #4), ADR-147, build-system.md, workflow.md, accessibility-practice.md — 5 factual errors, 2 verify-vs-mutate discrepancies, stale prose, falsified principle, inter-ADR contradiction."
    status: completed
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
    content: "Triage knip findings across unused files/exports and dependency hygiene, including undeclared workspace imports that currently escape blocking gates, then promote to blocking QG. Child plan: knip-triage-and-remediation.plan.md"
    status: in_progress
  - id: enable-depcruise
    content: "Resolve dependency-cruiser findings (circular deps, orphans) and promote to blocking QG, while keeping manifest-completeness enforcement separate."
    status: pending
  - id: enable-max-files-per-dir
    content: "Enable the max-files-per-dir ESLint rule across all workspaces and remediate violations."
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

**Last Updated**: 2026-04-11
**Status**: Current — owner decisions resolved 2026-04-11, gate topology implemented, ADR-121 reconciled
**Scope**: All pending quality gate promotions and enforcement hardenings, consolidated into a single plan with remediation work for each.

## Problem and Intent

The repository has several quality tools installed but not yet promoted to
blocking gates, enforcement gaps where checks are weaker than the principles
demand, and documentation drift where the gate documentation no longer matches
the actual gate implementations. Each tool surfaces genuine pre-existing issues
that must be remediated before promotion.

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

### Gate documentation drift (ADR-121 vs reality)

ADR-121 has **5 factual errors**, **1 labelling ambiguity**, and
**1 additional verify-vs-mutate discrepancy** in its coverage matrix:

1. ADR says CI **excludes** `test:e2e` — CI **includes** it
2. ADR says CI **excludes** `smoke:dev:stub` — CI **includes** it
3. ADR says CI **excludes** `test:ui` — CI **includes** it
4. ADR says `pnpm check` uses `secrets:scan:all` — it uses
   `secrets:scan` (branch/tag scope, not full history)
5. *(labelling ambiguity)* ADR matrix cell for `pnpm check` format
   already annotates `(format:root)` but the row label misleadingly
   implies verify-only
6. ADR says `pnpm check` uses `markdownlint-check` — it uses
   `markdownlint:root` (mutating fix mode)
7. ADR says `pnpm check` uses `lint` — it uses `lint:fix`
   (same verify-vs-mutate class as points 5 and 6)

The verify-vs-mutate pattern (points 5-7) is systematic: `pnpm check`
consistently uses fix-mode commands (`format:root`, `markdownlint:root`,
`lint:fix`) while other surfaces use verify-only commands. This should be
captured as a deliberate design decision with a rationale, not left as
per-row annotations.

**Beyond the matrix**, ADR-121's prose is also stale:

- **Rationale for exclusions** (lines 72-78): says "CI excludes
  `test:e2e`: E2E tests hit Elasticsearch" — this is now false
- **Consequences** (lines 108-110): says `test:ui` and
  `smoke:dev:stub` are local-only — also false
- **Design principle #4**: "CI runs a strict subset of what
  pre-push covers" — CI now includes `test:e2e`, `test:ui`, and
  `smoke:dev:stub`, none of which are in pre-push. CI is broader
  in some dimensions, not a strict subset. This principle must be
  either restored (add missing checks to pre-push) or revised.
- **ADR-147 contradiction**: ADR-147 states "Tests run in CI via
  test:a11y script" but ADR-121 explicitly marks `test:a11y` as
  excluded from CI. These two accepted ADRs contradict each other.

Additional documentation drift:

- `docs/engineering/build-system.md`: matrix missing
  `test:widget:ui` and `test:widget:a11y` rows; inline `pnpm check`
  script shows sequential pnpm commands but actual is a single turbo
  invocation; `test:all` inline script also stale
- `docs/engineering/workflow.md` (line 114): falsely claims "E2E,
  UI, and smoke tests run locally only" — CI includes all three
- `docs/governance/accessibility-practice.md`: references quality
  gates that will change if `test:a11y` is promoted to CI

All of the above must be corrected before any hardening decisions
that rely on the coverage matrix.

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

**Stale counts (must refresh before committing to tiered execution):**

1. **Knip finding counts are current** — the 728-issue count (94 unused
   files, 626 unused exports, 14 dependency issues) is from 2026-03-26.
   New work since then (WS-0/1/2, type extraction, namespace work) may
   have changed the counts in either direction. Must re-run `pnpm knip`
   before triaging.
2. **Depcruise finding counts are current** — the 88-violation count (39
   circular, 49 orphans) is from 2026-03-26. Same staleness risk.
3. **ESLint disable count (~64) is current** — from 2026-03-29. Some
   remediation may have occurred during subsequent work. Must re-count.
4. **`consistent-type-assertions` warning count (~218) is current** —
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

### Tier 0: Refresh stale counts (prerequisite for execution)

Before committing to tiered execution, re-run all tools to update
counts. All effort estimates below depend on these being current.

- `pnpm knip` — last run 2026-03-26
- `pnpm depcruise` — last run 2026-03-26
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
| Targeted knip: dependency fixes only | 2-3 hrs | High | Undeclared deps caused real CI failures (PR #76) |
| Built-artifact proof in E2E | 2-3 hrs | High | Mandate `test:e2e` boots `dist/` under plain Node, not a separate lane |
| Promote test:a11y + widget to CI | 1-2 hrs + stability validation | Medium-High | ADR-147 says blocking but CI doesn't enforce; need N consecutive green runs |
| Add coverage thresholds (ratchet model) | 2-4 hrs | Medium-High | Depends on baselines; pair with awareness of `passWithNoTests: true` |

### Tier 3: Rule promotions (1-2 days each, Medium impact)

Lint-rule and static-analysis promotions. All lint-rule items depend
on ESLint config standardisation (Tier 1) completing first.

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Depcruise: resolve circular deps | 1 day | Medium | 5 distinct cycles, 39 errors (count may be stale) |
| `consistent-type-assertions` promotion | 1-2 days | Medium | ~218 warnings; mechanical bulk but structural fakes may slip |
| `no-eslint-disable` promotion | Blocked by eslint-disable remediation | High | Remediation plan has zero progress; re-assess before scheduling |
| Forbidden-comment test infrastructure | 0.5 day | Medium | Must solve without weakening any gate |

### Tier 4: Long-tail (days each, Lower immediate impact)

| Item | Effort | Impact | Notes |
|------|--------|--------|-------|
| Full knip remediation (unused exports) | 2-3 days | Medium | Largest scope, phased approach |
| Knip + depcruise promotion to `pnpm check` | After remediation | High (eventual) | Requires clean baseline |
| Stryker mutation testing | 2+ days | Medium | Needs healthy test suite first (test audit sibling plan) |
| `no-child-process-in-tests` rule | 1 day | Low-Medium | 2 existing violators |
| `max-files-per-dir` enablement | 1 day | Low | Scope unknown |
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
11. **knip** — triage findings, promote to blocking QG
12. **dependency-cruiser** — resolve findings, promote to blocking QG
13. **max-files-per-dir** — enable and remediate
14. **`consistent-type-assertions` in tests** — promote to error
15. **Stryker mutation testing**
16. **`no-child-process-in-tests` ESLint rule**

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
| Tier 0: Refresh stale counts | None | **Do before everything** — effort estimates depend on current data |
| ADR-121 + ADR-147 reconciliation | None | **Do first** — all other decisions depend on accurate gate docs |
| ESLint config standardisation | None | **Foundation** — must precede all lint-rule promotions |
| Flaky E2E investigation | None | Independent |
| `pnpm audit` gate | ADR reconciliation | Run `pnpm audit` first to assess findings; new ADR-158 |
| Targeted knip: dependency fixes | None | First static-analysis candidate |
| Built-artifact proof in E2E | None | Fold into `test:e2e`, not a separate lane |
| Promote a11y/widget to CI | ADR reconciliation | Must prove deterministic (N consecutive green runs) |
| Coverage thresholds | None | Must measure baselines first |
| Depcruise: resolve circular deps | None | Independent but complementary to knip |
| `consistent-type-assertions` | **ESLint config standardisation** | Lint-rule promotion on trustworthy infrastructure |
| `no-eslint-disable` promotion | **ESLint config standardisation** + `eslint-disable-remediation.plan.md` | Remediation plan has zero progress; re-assess |
| `max-files-per-dir` | **ESLint config standardisation** | Lint-rule promotion on trustworthy infrastructure |
| Forbidden-comment test infra | None | Must solve without gate weakening |
| Full knip remediation | Targeted knip | Phased after dependency-only fixes |
| Knip + depcruise promotion | Full remediation of both | Requires clean baseline |
| Stryker | Test audit (sibling plan) | Mutation testing most valuable after healthy suite |
| `no-child-process-in-tests` | None | Prevents future violations |
| oak-eslint self-linting | Forbidden-comment infra | Investigate circular dependency risk first |

## Enhancement Details

### 0a. Reconcile ADR-121, ADR-147, and downstream docs (NEW)

**Problem**: ADR-121's coverage matrix has 5 factual errors and 2
verify-vs-mutate discrepancies (see Findings above). The Rationale,
Consequences, and Design Principles prose sections are also stale.
ADR-147 contradicts ADR-121 about `test:a11y` in CI. Downstream docs
(`build-system.md`, `workflow.md`, `accessibility-practice.md`) have
corresponding drift.

**Fix**: Amend ADR-121 (the decision model is sound; only content is
stale):

1. Update the coverage matrix to match actual `ci.yml`, `package.json`,
   and husky hooks
2. Rewrite the "Rationale for exclusions" to match current reality
3. Update the Consequences section
4. Either restore design principle #4 ("CI is a strict subset of
   pre-push") by adding missing checks to pre-push, or revise the
   principle to reflect the current reality — **owner decision required**
5. Decide whether `pnpm check`'s verify-vs-mutate pattern is intentional
   (auto-fix then continue) or an oversight (should be verify-only
   like CI) — **owner decision required**
6. Decide whether `pnpm check` should use `secrets:scan:all` (matching
   pre-push) to honour "most comprehensive" — **owner decision required**
7. Add a Change Log section for auditability

Update ADR-147 to be consistent with ADR-121's corrected matrix.

Update downstream docs: `build-system.md` (matrix, inline scripts),
`workflow.md` (stale "local-only" claims), `accessibility-practice.md`
(if `test:a11y` moves to CI).

**Remediation**: Documentation-only. No code changes. Three owner
decisions required (items 4-6 above).

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

### 4. Enable knip as a Blocking `pnpm check` Gate

**Problem**: knip surfaces a large backlog of unused files, unused exports,
and dependency-hygiene issues. It is also the current precise detector for
undeclared direct/transitive workspace imports. Because it is not blocking,
runtime and generator tasks can fail in CI before the underlying manifest issue
is diagnosed cleanly.

**Confirmed example (9 April 2026)**:
- PR #76 isolated Turbo reproduction failed in `@oaknational/sdk-codegen#sdk-codegen`
  because `@oaknational/observability` was imported but undeclared
- Targeted `knip` for `packages/sdks/oak-sdk-codegen` also flagged
  undeclared `@elastic/elasticsearch`
- The same workspace still carried unused `@modelcontextprotocol/ext-apps`
  until explicitly removed

**Fix**: Triage all findings. Treat `unlisted` dependency findings as hard
blockers. Delete genuine dead code. Adjust `knip.config.ts` for false
positives. Add `pnpm knip` to the `pnpm check` script and then to pre-push /
pre-commit once the baseline is clean.

**Remediation**: Significant — see `.agent/plans/architecture-and-infrastructure/static-analysis-tool-promotion.plan.md` for initial triage plan.

### 5. Enable dependency-cruiser as a Blocking `pnpm check` Gate

**Problem**: dependency-cruiser finds circular dependencies and orphan modules.
These need resolution before promotion. It does not currently police package
manifests, so it cannot be relied on to catch undeclared direct dependencies or
missing type-only devDependencies.

**Fix**: Resolve circular deps (refactor or mark as intentional). Exclude genuinely external orphans. Add `pnpm depcruise` to the `pnpm check` script.

**Remediation**: See static-analysis-tool-promotion.plan.md.

### 6. Enable max-files-per-dir

**Problem**: The `@oaknational/max-files-per-dir` ESLint rule exists but is not activated in any config.

**Fix**: Add the rule to `configs.recommended` or `configs.strict`. Remediate any directories that exceed the threshold by splitting into subdirectories.

**Remediation**: Audit all directories, split where needed.

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

- **All counts are stale** — knip (2026-03-26), depcruise (2026-03-26),
  eslint-disable (2026-03-29), type-assertions (never re-verified).
  Tier 0 refresh is mandatory before committing to execution.
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
