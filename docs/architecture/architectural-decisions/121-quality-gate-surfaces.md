# ADR-121: Quality Gate Surfaces

**Status**: Accepted
**Date**: 2026-02-25
**Updated**: 2026-05-10
**Related**: [ADR-013 (Husky and lint-staged)](013-husky-and-lint-staged.md), [ADR-043 (Type Generation in Build and CI)](043-codegen-in-build-and-ci.md), [ADR-111 (Secret Scanning Quality Gate)](111-secret-scanning-quality-gate.md), [ADR-147 (Browser Accessibility)](147-browser-accessibility-as-blocking-quality-gate.md), [ADR-161 (Network-Free PR Checks)](161-network-free-pr-check-ci-boundary.md), [ADR-174 (Dependency Vulnerability Scanning)](174-dependency-vulnerability-scanning-quality-gate.md)

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
| sdk-codegen       | --         | Yes      | Yes         | Yes                     |
| build             | --         | Yes      | Yes         | Yes                     |
| format-check      | Yes        | Yes      | Yes         | Yes (format:root)       |
| markdownlint      | Yes        | Yes      | Yes         | Yes (markdownlint:root) |
| subagents:check   | --         | Yes      | Yes         | Yes                     |
| portability:check | --         | Yes      | Yes         | Yes                     |
| knip              | Yes        | Yes      | Yes         | Yes                     |
| depcruise         | Yes        | Yes      | Yes         | Yes                     |
| test:root-scripts | --         | Yes      | Yes         | Yes                     |
| type-check        | Yes        | Yes      | Yes         | Yes                     |
| lint              | Yes        | Yes      | Yes         | Yes (lint:fix)          |
| lint:shell        | --         | --       | Yes         | Yes                     |
| test              | Yes        | Yes      | Yes         | Yes                     |
| test:widget       | --         | --       | --          | Yes                     |
| test:widget:ui    | --         | --       | --          | Yes                     |
| test:widget:a11y  | --         | --       | --          | Yes                     |
| test:e2e          | --         | Yes      | Yes         | Yes                     |
| test:ui           | --         | Yes      | Yes         | Yes                     |
| test:a11y         | --         | --       | --          | Yes                     |
| doc-gen           | --         | --       | --          | Yes                     |
| SonarCloud        | --         | --       | PR analysis | --                      |

### Rationale for exclusions

- **Pre-commit excludes build/codegen/secrets**: too slow for every commit.
  These run on pre-push instead.
- **Pre-push and CI exclude test:widget, test:widget:ui, test:widget:a11y,
  and test:a11y**: widget tests and browser accessibility tests are not yet
  promoted to these surfaces. `pnpm check` covers them locally. Promotion
  is tracked in the quality gate hardening plan (item 0d); when promoted,
  they will be added to both pre-push and CI simultaneously to preserve
  equality.
- **Pre-push and CI exclude doc-gen**: documentation generation is a
  build-time convenience, not a correctness gate.
- **`lint:shell` is currently CI and `pnpm check` only**: this is documented
  drift from the original pre-push === CI principle. The accepted steady state
  is either to promote it to pre-push or explicitly retain it as a CI/root
  surface exception in a later reconciliation.
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
   not a missing check. Current exceptions (`lint:shell`, SonarCloud, and any
   networked external analysis) must stay visible in this ADR until reconciled.
2. **Pre-commit is fast** — format, markdown, knip, depcruise, type-check,
   lint, and unit tests only. No builds or codegen.
3. **Pre-push is comprehensive** — secret scan, full build chain, all
   non-widget test suites, sub-agent and portability validation.
4. **`pnpm check` is exhaustive** — the only surface that runs every
   check including clean rebuild, doc-gen, widget tests, a11y tests,
   and fix-mode commands.
5. **No CI-only checks** — every CI check is reproducible locally via
   pre-push. A developer who passes pre-push knows CI will pass
   (assuming equivalent environment).
6. **Developer surfaces fix; hook and remote surfaces verify** — see
   §Verify vs Mutate above.

### Dependency vulnerability gate status

ADR-174 defines the dependency vulnerability policy, but this ADR does not yet
claim a dependency-audit gate in pre-push, CI, or `pnpm check`. Add that row
only after the gate is implemented. Until then, references to dependency
vulnerability scanning in governance docs are policy references, not evidence
that CI already runs a dependency audit.

### Network-free PR-check boundary

ADR-161 remains binding: PR and push checks must not depend on live vendor or
schema network calls. Any schema drift check, dependency audit, or vendor CLI
that reaches the network belongs outside PR/push checks unless this ADR and
ADR-161 are amended together.

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

- Pre-push runs: `secrets:scan`, `format-check:root`,
  `markdownlint-check:root`, `subagents:check`, `portability:check`,
  `knip`, `depcruise`, `test:root-scripts`, then Turbo: `sdk-codegen
build type-check lint test test:e2e test:ui`.
- CI runs: `secrets:scan` (with Docker gitleaks fallback),
  `format-check:root`, `markdownlint-check:root`, `subagents:check`,
  `portability:check`, `knip`, `depcruise`, `test:root-scripts`,
  Playwright install, then Turbo: `sdk-codegen build type-check lint
test test:e2e test:ui`.
- `pnpm check` runs the broadest set with fix-mode and clean rebuild.
- Coverage matrix maintained in this ADR and referenced from
  `docs/engineering/build-system.md` and `docs/engineering/workflow.md`.
- ADR-043 updated to reflect the drift-check-based freshness verification
  approach (replacing the `--only` build isolation).

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-02-25 | Initial accepted version                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2026-04-02 | Added ADR-147 cross-reference, widget test rows                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-04-11 | Reconciled matrix with actual gate implementations. Rewrote principle #4 (pre-push === CI). Added verify-vs-mutate section. Changed secret scanning from full-history to branch-scope. Added sdk-codegen to CI Turbo invocation. Added subagents:check, portability:check, test:root-scripts, test:ui, test:e2e, smoke:dev:stub to pre-push. Removed --only from pre-push test:e2e. Updated rationale, consequences, and implementation to match.                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-04-11 | Promoted knip to all four gate surfaces (pre-commit, pre-push, CI, pnpm check). Added knip row to coverage matrix. Updated design principle #2 and implementation lists. Knip runs in ~2s so pre-commit speed is preserved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2026-04-12 | Promoted depcruise to all four gate surfaces. Added depcruise row to coverage matrix. 87 violations (44 circular deps, 43 orphans) resolved to 0. `no-orphans` promoted from `warn` to `error`. Depcruise runs in ~2s so pre-commit speed is preserved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2026-04-29 | **Pre-reconciliation findings preserved for audit** (graduated from `quality-gate-hardening.plan.md` body during 2026-04-29 deep consolidation pass). 2026-04-11 reconciliation resolved six matrix factual errors (CI included `test:e2e`/`smoke:dev:stub`/`test:ui` despite the ADR claiming exclusion; `pnpm check` used `secrets:scan` not `secrets:scan:all`; `markdownlint:root` and `lint:fix` were mutating, not check-only); prose drift in rationale/consequences/principle #4; ADR-147 contradiction on `test:a11y` (resolved by recording `test:a11y` as `pnpm check`-only with promotion in the quality-gate-hardening plan); and the verify-vs-mutate decision was codified as §Verify vs Mutate. Audit detail preserved at this Change Log entry; the plan-body restatement was retired in the same consolidation. |
| 2026-05-04 | Removed `smoke:dev:stub` row from coverage matrix and pre-push/CI Turbo invocations. The smoke-tests directory, `smoke:*` scripts, and `vitest.smoke.config.ts` were retired. Coverage previously held by the dev-server-boot smoke check is now provided by the in-process invariant test (`apps/oak-curriculum-mcp-streamable-http/src/dev-boot-without-observability.integration.test.ts`); broader real-IO coverage moves to a frozen IO Inventory plus a `no-real-io-in-tests` ESLint rule.                                                                                                                                                                                                                                                                                                                                  |
| 2026-05-10 | Added visible rows/notes for `lint:shell`, SonarCloud, dependency vulnerability policy, and ADR-161 network-free PR-check interaction. This records current drift without over-claiming local gate parity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
