---
name: "Quality Gate Hardening"
overview: "Unified plan for all pending quality gate enhancements: promote static analysis tools, harden ESLint enforcement, enable mutation testing across all workspaces, and remediate all findings."
todos:
  - id: forbidden-comment-test-exemption
    content: "Allow forbidden-comment patterns in files specifically testing their detection (hook + ESLint test infrastructure)."
    status: pending
  - id: oak-eslint-self-linting
    content: "Subject the oak-eslint workspace to the oak-eslint recommended/strict config, unless circular dependency prevents it."
    status: pending
  - id: eslint-config-standardisation
    content: "Audit and standardise ESLint flat-config composition, resolver wiring, and typed-lint project setup across all workspaces before further gate promotion, including honest handling of multi-project workspaces via tsconfig references or another standard pattern."
    status: pending
  - id: promote-no-eslint-disable
    content: "Promote @oaknational/no-eslint-disable from warn to error after Phase 3 remediation in the active CI plan completes."
    status: pending
  - id: enable-knip
    content: "Triage knip findings across unused files/exports and dependency hygiene, including undeclared workspace imports that currently escape blocking gates, then promote to blocking QG."
    status: pending
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
  - id: built-artifact-proof-lane
    content: "Add built-artifact startup proof coverage where dev loaders can mask production-runtime resolver or bootstrap defects."
    status: pending
  - id: enable-stryker-all-workspaces
    content: "Enable Stryker mutation testing in all workspaces with initial loose thresholds. Create incremental remediation plan."
    status: pending
---

# Quality Gate Hardening

**Last Updated**: 2026-04-09
**Status**: Strategic brief — first promotion candidate after the current improvement tranche
**Scope**: All pending quality gate promotions and enforcement hardenings, consolidated into a single plan with remediation work for each.

## Problem and Intent

The repository has several quality tools installed but not yet promoted to blocking gates, and several enforcement gaps where checks are weaker than the principles demand. Each tool surfaces genuine pre-existing issues that must be remediated before promotion.

This plan unifies all pending quality gate work into a single strategic brief to prevent fragmentation across multiple small plans.

Per the 2026-04-09 sequencing decision, this is the first plan to promote once
the current improvement tranche is complete.

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

## Domain Boundaries

### In Scope

1. **Forbidden-comment test infrastructure** — allow the content-blocking hook and ESLint rule test files to contain the patterns they test
2. **oak-eslint self-linting** — the ESLint plugin workspace should be subject to its own rules
3. **`@oaknational/no-eslint-disable` promotion** — warn to error after remediation
4. **knip** — triage findings, promote to blocking QG
5. **dependency-cruiser** — resolve findings, promote to blocking QG
6. **max-files-per-dir** — enable and remediate
7. **`consistent-type-assertions` in tests** — remove the warn exception, promote to error
8. **Built-artifact startup proof lane** — add production-path proof where dev loaders differ materially from deployed/runtime execution
9. **Stryker mutation testing** — enable in all workspaces with loose initial thresholds, then incrementally tighten

### Not in Scope

- Remediation of the ~64 remaining eslint-disable comments (tracked in `eslint-disable-remediation.plan.md`)
- CI workflow changes (completed in the CI consolidation plan)
- New Playwright tests for the replacement widget (tracked separately)

## Dependencies and Sequencing

| Enhancement | Depends on | Notes |
|------------|-----------|-------|
| Forbidden-comment test exemption | None | Can proceed immediately |
| oak-eslint self-linting | Forbidden-comment exemption (if self-linting catches test file patterns) | Investigate circular dependency risk first |
| `no-eslint-disable` promotion | `eslint-disable-remediation.plan.md` (extracted from CI plan) | Cannot promote until all comments are remediated |
| knip | None | First static-analysis promotion candidate. It is the current precise detector for undeclared workspace imports and stale manifest entries. |
| dependency-cruiser | None | Independent — but complementary. It covers graph shape, not package-manifest completeness. |
| max-files-per-dir | None | Independent — remediation may overlap with knip dead-code removal |
| `consistent-type-assertions` in tests | None | Large remediation (~218 warnings across 6 workspaces) |
| `no-child-process-in-tests` rule | None | Prevents future violations; sibling test-audit plan triages existing ones |
| Built-artifact startup proof lane | None | Most important for Node-entry workspaces whose dev path uses `tsx`, Vite, or another permissive loader |
| Stryker | Test audit (sibling plan) | Mutation testing is most valuable after the test suite is healthy. Run audit first to remove useless tests that would waste Stryker's budget. |

## Enhancement Details

### 1. Forbidden-Comment Test Infrastructure

**Problem**: The `check-blocked-content.mjs` hook blocks agents from writing the user-approval marker in files. But the ESLint rule's test file (`no-eslint-disable.unit.test.ts`) must contain test strings with that marker to verify the rule allows it.

**Fix**: Modify the hook to exempt files matching a specific pattern (e.g. `**/no-eslint-disable*.test.*`) from the content check. The hook already has the file path available in the tool payload.

**Remediation**: None — this is infrastructure-only.

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

### 9. Add a Built-Artifact Startup Proof Lane

**Problem**: Some workspaces run source through `tsx`, Vite, or other dev
loaders locally but ship built JavaScript under plain Node or another stricter
runtime. Dev success can therefore mask resolver or bootstrap defects in the
actual deployed artefacts.

**Confirmed example (9 April 2026)**:
- `apps/oak-curriculum-mcp-streamable-http` worked via `tsx src/index.ts`
- The first Vercel preview after CI crashed on startup
- Root cause: built code still contained extensionless
  `@modelcontextprotocol/sdk/*` subpath imports that Node ESM rejected
- The fix belonged in generator/runtime code plus a dedicated plain-Node import
  proof for `dist/application.js`

**Fix**: For entrypoint-bearing workspaces where dev/runtime loaders differ,
add a focused built-artifact proof that executes the shipped artefact under the
real runtime rules. Keep this separate from source-imported unit/integration
tests. Validate the build by running the build; validate the runtime by
executing the built artefact.

**Remediation**: Workspace-specific. Choose the narrowest importable or
startable seam that proves production startup without adding unnecessary
networked E2E complexity.

### 10. Enable Stryker Mutation Testing

**Problem**: Stryker is configured but not enabled as a gate. Existing plan at `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md`.

**Fix**: Enable `pnpm mutate` in all workspaces. Configure initial thresholds loose enough for current code to pass. Then create an incremental plan to tighten thresholds and improve test suite effectiveness.

**Remediation**: Per-workspace configuration and threshold tuning. New tests where mutation testing reveals uncovered behaviour.

## Success Signals (Justifying Promotion to Current)

- The current improvement tranche is complete and can hand off into a focused
  hardening sprint
- eslint-disable remediation complete (`eslint-disable-remediation.plan.md`)
- CI consolidation plan complete (Phases 0-6 done as of 2026-03-29)
- Targeted dependency-only `knip` sweeps are clean for generator/build-heavy
  workspaces before global promotion
- ESLint config composition and resolver strategy are standardised across all
  active workspaces, with documented exceptions only where genuinely required
- Multi-project workspaces no longer emit advisory ESLint project-selection
  warnings during root lint because their TS project model has been
  standardised honestly
- Critical Node-entry workspaces have an explicit built-artifact proof lane
  where dev and deployed runtimes differ materially
- Capacity for a focused sprint on quality gate work
- No higher-priority feature or bug work blocking

## Risks and Unknowns

- knip triage scope is large (626 unused exports) — may need phased approach
- Isolated-worktree verification can reveal missing manifest entries that are
  masked in nested worktrees by parent `node_modules` resolution
- Workspace-level ESLint config drift can create false unresolved-import
  failures or mask real ones if resolver strategy and typed-lint setup are not
  standardised
- If a source-imported test starts depending on build outputs, refactor the
  seam or move the proof to build/out-of-process coverage instead of teaching
  generic source tests to depend on `build`
- `tsx`, Vite, or similar dev loaders can mask built-runtime resolver defects;
  production-path proof must execute the built artefact under the real runtime
- oak-eslint self-linting may hit circular dependency — needs investigation
- Stryker thresholds need calibration per workspace — initial run needed
- `consistent-type-assertions` remediation in tests is labour-intensive (~218 warnings)

## Promotion Trigger

Promote to `current/` when:

1. The current improvement tranche is complete and the collection is ready to
   pivot from delivery work to hardening
2. The eslint-disable remediation plan is complete
3. Team has capacity for a quality-gate sprint

## Absorbed Plans

This plan supersedes and absorbs:
- `.agent/plans/architecture-and-infrastructure/static-analysis-tool-promotion.plan.md` (knip + depcruise)
- `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md` (Stryker)

When this plan is promoted to `current/`, archive those plans with a note pointing here.

## Sibling Plans

- `test-suite-audit-and-triage.plan.md` — deep audit of all tests
  (process spawning, implementation coupling, value assessment). Should
  run before Stryker enablement so mutation testing operates on a
  healthy suite.
