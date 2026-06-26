# ADR-121: Quality Gate Surfaces

**Status**: Accepted
**Date**: 2026-02-25
**Updated**: 2026-06-26
**Related**: [ADR-013 (Husky and lint-staged)](013-husky-and-lint-staged.md), [ADR-043 (Type Generation in Build and CI)](043-codegen-in-build-and-ci.md), [ADR-111 (Secret Scanning Quality Gate)](111-secret-scanning-quality-gate.md), [ADR-147 (Browser Accessibility)](147-browser-accessibility-as-blocking-quality-gate.md), [ADR-161 (Network-Free PR Checks)](161-network-free-pr-check-ci-boundary.md), [ADR-174 (Dependency Vulnerability Scanning)](174-dependency-vulnerability-scanning-quality-gate.md), [ADR-204 (Merge-Gate Strategy)](204-merge-gate-strategy-require-up-to-date-not-merge-queue.md)

## Context

The repository enforces quality through multiple surfaces, each triggered at
a different point in the development lifecycle. The term "CI" has been used
loosely to refer to any of these, creating confusion about what runs where
and why. Reviewer findings in Phase 7 identified gaps where checks existed
in some surfaces but not others, with no documented rationale for the
differences.

The five surfaces are:

1. **Pre-commit hook** (`.husky/pre-commit`) — runs on every `git commit`.
   Must be fast (< 60s) to avoid disrupting flow.
2. **Commit-msg hook** (`.husky/commit-msg`) — validates commit message
   format and blocks accidental breaking changes.
3. **Pre-push hook** (`.husky/pre-push`) — runs before `git push`. Can be
   thorough (2-5 min) since pushes are less frequent.
4. **GitHub CI workflow** (`.github/workflows/ci.yml`) — runs on PRs and
   pushes to `main`. Canonical remote gate. Must be self-contained (no
   local tooling assumptions).
5. **Local commands** (`pnpm check`, `pnpm make`) — developer-initiated.
   `pnpm check` is the canonical aggregate gate and the most comprehensive;
   `pnpm make` is build-and-fix. The former `pnpm qg` verify-only surface was
   removed because it duplicated gate narratives and created onboarding drift.

## Decision

Each surface has a defined purpose and a specific set of checks. The
governing principle is: **pre-push and CI run the same check set**, so a
CI-only failure is immediately diagnostic — it indicates an environmental
or configuration issue, never a missing check.

### Coverage matrix

| Check             | pre-commit | pre-push | CI workflow | pnpm check              |
| ----------------- | ---------- | -------- | ----------- | ----------------------- |
| secrets:scan      | --         | Yes      | Yes         | Yes                     |
| clean             | --         | --       | --          | Yes                     |
| sdk-codegen       | via build  | Yes      | Yes         | Yes                     |
| build             | Yes        | Yes      | Yes         | Yes                     |
| format-check      | Yes        | Yes      | Yes         | Yes (format:root)       |
| markdownlint      | Staged     | Yes      | Yes         | Yes (markdownlint:root) |
| subagents:check   | --         | Yes      | Yes         | Yes                     |
| portability:check | --         | Yes      | Yes         | Yes                     |
| knip              | Yes        | Yes      | Yes         | Yes                     |
| depcruise         | Yes        | Yes      | Yes         | Yes                     |
| repo-validators   | Yes        | Yes      | Yes         | Yes                     |
| type-check        | Yes        | Yes      | Yes         | Yes                     |
| lint              | Yes        | Yes      | Yes         | Yes (lint:fix)          |
| lint:shell        | Yes        | Yes      | Yes         | Yes                     |
| test              | Yes        | Yes      | Yes         | Yes                     |
| test:widget       | --         | --       | --          | Yes                     |
| test:widget:ui    | --         | --       | --          | Yes                     |
| test:widget:a11y  | --         | --       | --          | Yes                     |
| test:e2e          | --         | Yes      | Yes         | Yes                     |
| test:ui           | --         | Yes      | Yes         | Yes                     |
| test:a11y         | --         | --       | --          | Yes                     |
| doc-gen           | --         | --       | --          | Yes                     |
| SonarCloud        | --         | --       | PR analysis | --                      |
| dependency-review | --         | --       | PR advisory | --                      |

### Rationale for exclusions

- **Pre-commit catches what it cheaply can; it excludes only the genuinely
  expensive or network-bound surfaces** (secret scanning, the heavier
  `test:e2e`/`test:ui`/widget/a11y tiers, `doc-gen`). The earlier "pre-commit
  excludes build/codegen — too slow" rule is **retired** (2026-06-05): Turbo
  caching makes `build` sub-second when warm (measured ~0.75s for the cached
  `build type-check lint test` step), and `type-check` requires built
  dependencies (`^build`), so build belongs at pre-commit rather than being
  deferred. `sdk-codegen` runs transitively as a `build` dependency for the SDK
  packages. `knip` (~1.7s) and `depcruise` (~1.9s) are cheap and catch
  unused-code and dependency-direction defects at the earliest gate; omitting
  them lets those classes slip to pre-push (the failure mode observed when
  tsx-spawned validator entry files reached `main` unregistered in
  `knip.config.ts`, caught only by `pnpm check`).
- **Pre-push and CI exclude test:widget, test:widget:ui, test:widget:a11y,
  and test:a11y**: widget tests and browser accessibility tests are not yet
  promoted to these surfaces. `pnpm check` covers them locally. Promotion
  is tracked in the quality gate hardening plan (item 0d); when promoted,
  they will be added to both pre-push and CI simultaneously to preserve
  equality.
- **Pre-push and CI exclude doc-gen**: documentation generation is a
  build-time convenience, not a correctness gate.
- **Pre-commit markdownlint is staged-only**: the repo still requires full
  markdownlint in pre-push, CI, and `pnpm check`, while pre-commit limits this
  one check to staged Markdown files to keep the hook proportional.
- **SonarCloud is a remote quality surface**: Sonar analysis runs outside local
  hooks and is governed by the Sonar disposition policy. It is not reproduced
  by pre-push today.
- **`pnpm check` includes clean**: the canonical aggregate gate
  intentionally proves clean rebuild readiness instead of relying on an
  already-built working tree.

### Verify vs Mutate

`pnpm check` is a developer workflow that produces a clean state then
verifies it. It uses fix-mode commands: `format:root` (writes),
`markdownlint:root` (writes), and `lint:fix` (writes). This is
**intentional** — the developer sees the changes and can commit them.

Pre-commit, pre-push, and CI use check/verify-only commands. They never
mutate files. This is also **intentional** — mutations in hooks are
disruptive, and mutations in CI are invisible and misleading.

The design rule: **developer aggregate surfaces may mutate; hook and
remote surfaces verify only.**

### Secret scanning scope

All routine gate surfaces use branch-scope scanning (`secrets:scan`),
which examines branch tips and tags. This catches new secrets introduced
by new commits.

Full-history scanning (`secrets:scan:all`) is retained as a bootstrap
and audit action. It is idempotent after the first clean run — unless
someone rewrites history (which is prohibited), re-scanning full history
adds no enforcement value. It is not part of any routine gate surface.

### Design principles

1. **Pre-push === CI is the target invariant** — pre-push and CI should run the same check set wherever the check is locally reproducible. A
   CI-only failure indicates an environmental or configuration issue,
   not a missing check. Current exceptions are SonarCloud and the
   dependency-review gate — both CI-only networked external analyses that
   cannot run locally (dependency-review needs the PR base/head diff and
   GitHub's dependency-graph API) — and must stay visible in this ADR until
   reconciled.
   (`lint:shell` was a former exception; it is now at pre-push === CI parity —
   `.husky/pre-push` and `.github/workflows/ci.yml` both run it — and is no
   longer an open exception.)
2. **Pre-commit is fast and catches what it cheaply can** — format, markdown,
   repo-validators, shell-lint, knip, depcruise, build, type-check, lint, and
   unit tests. Turbo caching, not the surface tier, bounds the cost: build is
   sub-second when warm and is required for type-check (`^build`). The
   speed budget (< 60s warm) is the constraint; within it, the goal is maximal
   defect-catch at the earliest gate.
3. **Pre-push is comprehensive** — secret scan, full build chain, all
   non-widget test suites, sub-agent and portability validation.
4. **`pnpm check` is exhaustive** — the only surface that runs every
   check including clean rebuild, doc-gen, widget tests, a11y tests,
   and fix-mode commands.
5. **No CI-only checks except the networked external analyses named in
   principle #1** — every other CI check is reproducible locally via pre-push,
   so a developer who passes pre-push knows CI will pass (assuming equivalent
   environment). The sole exceptions are SonarCloud and the dependency-review
   gate, which cannot run locally (see principle #1).
6. **Developer surfaces fix; hook and remote surfaces verify** — see
   §Verify vs Mutate above.

### Dependency vulnerability gate status

ADR-174 defines the dependency vulnerability policy. As of 2026-06-26 one
advisory slice of it is wired: the **dependency-review** gate
(`.github/workflows/dependency-review.yml`, `actions/dependency-review-action`),
which scans the **dependency diff a PR introduces** against the GitHub Advisory
Database and fails on `high`+ severity. ADR-161's third-party-vendor scope
permits it in the PR-check path (it calls GitHub's own dependency-graph API via
the run's `GITHUB_TOKEN`). It is **advisory** — not a required status check in
the `main` ruleset (ADR-204) — so it surfaces findings, and a PR comment on
failure, without blocking merge.

What remains future work: a **full dependency-tree audit** (the whole installed
graph, not only the PR diff) and any **blocking** disposition of high/critical
production-reachable findings per ADR-174. Until those land, do not claim a
blocking dependency-audit gate; the wired gate is the advisory PR-diff review
only. References to a full dependency audit in governance docs are policy
references, not evidence that CI runs one.

### Network-free PR-check boundary

ADR-161 remains binding: PR and push checks must not depend on live
**third-party-vendor** or schema network calls. Any schema drift check, full
dependency audit, or vendor CLI that reaches a third-party network belongs
outside PR/push checks unless this ADR and ADR-161 are amended together.

One such amendment is in force (2026-06-26, this ADR and ADR-161 amended in
lockstep): ADR-161's scope is stated as third-party-vendor networks, so the
dependency-review gate's call to GitHub's own dependency-graph API via the run's
`GITHUB_TOKEN` is permitted — it couples PR gating to no vendor beyond GitHub
itself, on which the Actions run already wholly depends. This is GitHub-first-party
only; a CI SonarCloud scanner or any other third-party call from the PR-check
path stays forbidden. See ADR-161 §Third-party-vendor scope: GitHub's own APIs.

## Consequences

### Positive

- Clear documentation of what runs where eliminates "CI" ambiguity.
- The coverage matrix makes gaps visible and auditable.
- Pre-push === CI means a CI failure is always a diagnostic signal
  (environment/config), never "you didn't run that check."
- The verify-vs-mutate distinction is explicit and intentional.

### Negative

- Pre-push is slower than it was when it ran a subset of CI. Mitigation:
  Turbo caching makes repeated runs fast, and pushes are less frequent
  than commits.
- test:widget, test:a11y, and widget browser tests remain pnpm-check-only
  until promoted. Mitigation: promotion is planned and will add them to
  both surfaces simultaneously.

## Implementation

- Pre-commit runs: `repo-check prettier-staged`, `repo-check
markdownlint-staged`, `repo-validators:check`, `lint:shell`, `knip`,
  `depcruise`, then Turbo: `build type-check lint test`.
- Pre-push runs: `secrets:scan`, `format-check:root`,
  `markdownlint-check:root`, `subagents:check`, `portability:check`,
  `knip`, `depcruise`, `repo-validators:check`, `lint:shell`, then Turbo:
  `sdk-codegen build type-check lint test test:e2e test:ui`.
- CI runs as parallel jobs gated by a `run-quality-gates` fan-in (the single
  required status check; it fails if any job failed or was cancelled, so each
  job blocks merge without a ruleset change): `secret-scan` (pinned, checksummed
  gitleaks binary — no Docker fallback), `install` (warms the pnpm store cache so
  downstream jobs install offline), `static-checks` (`format-check:root`,
  `markdownlint-check:root`, `lint:shell`, `subagents:check`, `portability:check`,
  `repo-validators:check`), `build` (`sdk-codegen` + `build`, warms the Turbo
  remote cache), `unit-tests` (`type-check`, `lint`, `test`), `knip-depcruise`,
  and `browser-tests` (the Playwright suites, with the browser download cached on
  the lockfile hash). The check set is unchanged from the prior single-job
  workflow — only the structure, caching, and gitleaks provisioning changed.
- `pnpm check` runs the broadest set with fix-mode and clean rebuild.
- Coverage matrix maintained in this ADR and referenced from
  `docs/engineering/build-system.md` and `docs/engineering/workflow.md`.
- ADR-043 updated to reflect the drift-check-based freshness verification
  approach (replacing the `--only` build isolation).

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-25 | Initial accepted version                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2026-04-02 | Added ADR-147 cross-reference, widget test rows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2026-04-11 | Reconciled matrix with actual gate implementations. Rewrote principle #4 (pre-push === CI). Added verify-vs-mutate section. Changed secret scanning from full-history to branch-scope. Added sdk-codegen to CI Turbo invocation. Added subagents:check, portability:check, test:root-scripts, test:ui, test:e2e, smoke:dev:stub to pre-push. Removed --only from pre-push test:e2e. Updated rationale, consequences, and implementation to match.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2026-04-11 | Promoted knip to all four gate surfaces (pre-commit, pre-push, CI, pnpm check). Added knip row to coverage matrix. Updated design principle #2 and implementation lists. Knip runs in ~2s so pre-commit speed is preserved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-04-12 | Promoted depcruise to all four gate surfaces. Added depcruise row to coverage matrix. 87 violations (44 circular deps, 43 orphans) resolved to 0. `no-orphans` promoted from `warn` to `error`. Depcruise runs in ~2s so pre-commit speed is preserved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-04-29 | **Pre-reconciliation findings preserved for audit** (graduated from `quality-gate-hardening.plan.md` body during 2026-04-29 deep consolidation pass). 2026-04-11 reconciliation resolved six matrix factual errors (CI included `test:e2e`/`smoke:dev:stub`/`test:ui` despite the ADR claiming exclusion; `pnpm check` used `secrets:scan` not `secrets:scan:all`; `markdownlint:root` and `lint:fix` were mutating, not check-only); prose drift in rationale/consequences/principle #4; ADR-147 contradiction on `test:a11y` (resolved by recording `test:a11y` as `pnpm check`-only with promotion in the quality-gate-hardening plan); and the verify-vs-mutate decision was codified as §Verify vs Mutate. Audit detail preserved at this Change Log entry; the plan-body restatement was retired in the same consolidation.                                                                                                                                                                       |
| 2026-05-04 | Removed `smoke:dev:stub` row from coverage matrix and pre-push/CI Turbo invocations. The smoke-tests directory, `smoke:*` scripts, and `vitest.smoke.config.ts` were retired. Coverage previously held by the dev-server-boot smoke check is now provided by the in-process invariant test (`apps/oak-curriculum-mcp-streamable-http/src/dev-boot-without-observability.integration.test.ts`); broader real-IO coverage moves to a frozen IO Inventory plus a `no-real-io-in-tests` ESLint rule.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-05-10 | Added visible rows/notes for `lint:shell`, SonarCloud, dependency vulnerability policy, and ADR-161 network-free PR-check interaction. This records current drift without over-claiming local gate parity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2026-06-05 | Owner-directed fresh speed/safety re-decision of the pre-commit surface (Lanternlit curation pass). Found the live `.husky/pre-commit` hook had drifted from this ADR: it omitted knip + depcruise (mandated here) while adding build + repo-validators + lint:shell. Added knip + depcruise to the hook (the omission let unused-code and dependency-direction defects slip to pre-push, as when tsx-spawned validator entries reached `main` unregistered in `knip.config.ts`). Corrected the matrix pre-commit cells for `build`/`repo-validators`/`lint:shell` (`--` to `Yes`) and `sdk-codegen` (to `via build`) to match the hook. Retired the "no builds at pre-commit" rule: Turbo caching makes build sub-second when warm (~0.75s cached for build+type-check+lint+test) and type-check requires `^build`; knip ~1.7s, depcruise ~1.9s. Updated design principle #2, the exclusion rationale, and the Implementation pre-commit list.                                                         |
| 2026-06-26 | Added the `dependency-review` row to the coverage matrix (CI-only, PR-advisory). Recorded the now-wired advisory dependency-review gate in §Dependency vulnerability gate status, and ADR-161's third-party-vendor scope refinement in §Network-free PR-check boundary (this ADR and ADR-161 amended in lockstep, as both require). Named dependency-review as a standing CI-only parity exception in design principle #1 alongside SonarCloud. The gate is advisory — not a required status check in the `main` ruleset (ADR-204). A full dependency-tree audit and blocking disposition per ADR-174 remain future work.                                                                                                                                                                                                                                                                                                                                                                               |
| 2026-06-26 | CI restructured from one serial `run-quality-gates` job into parallel jobs (`secret-scan`, `install`, `static-checks`, `build`, `unit-tests`, `knip-depcruise`, `browser-tests`) gated by a `run-quality-gates` fan-in aggregator that reuses the existing required-check context (no ruleset change; every job blocks merge transitively). Updated the §Implementation CI bullet to describe the structure. The check SET is unchanged. New caching: an `install` job warms the pnpm store cache so downstream jobs install offline (no cold-start network stampede); the `build` job warms the Turbo remote cache; Playwright browsers are cached on the lockfile hash; gitleaks moved from a per-run Docker pull to a version- and SHA-256-pinned binary. Not addressed here (pre-existing #230 drift): the matrix still shows `test:widget*`/`test:a11y` as `pnpm check`-only though CI has run them since #230, and pre-push does not run them — a pre-push≠CI parity gap to reconcile separately. |
