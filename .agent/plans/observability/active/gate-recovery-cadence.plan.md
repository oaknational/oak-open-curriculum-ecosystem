---
name: Gate Recovery Cadence
overview: >
  Recover the current failing quality gates and add a cadence guard so full-gate
  drift is detected earlier. The plan separates legitimate RED test failures
  from non-negotiable build/type/lint/static-analysis failures, then routes the
  startup-boundary work through a greenable sequence.
todos:
  - id: gate-ledger
    content: Create a failure ledger for the current `pnpm check` failures, separating intentional RED tests, parallel WS3 failures, and unexpected quality-gate regressions.
    status: completed
  - id: non-test-green
    content: Restore build/type/lint/static-analysis health by replacing missing-symbol REDs with typed seams that fail behaviourally.
    status: completed
  - id: startup-boundary-red-shape
    content: Reshape startup-boundary RED tests around build identity, Sentry projection, stdout OTel logging, and local gate env stripping without breaking non-test gates.
    status: completed
  - id: cadence-guard
    content: Add explicit gate cadence checkpoints to the active plan so non-test gates are run after RED batches and before GREEN claims.
    status: completed
  - id: review-and-full-gate
    content: Run required reviewers, then focused gates and `pnpm check`, recording any residual failures in the ledger.
    status: completed
---

# Quality Gate Recovery And Cadence

## Intent

Restore the invariant that build, type-check, lint, format, markdown,
depcruise, knip, and static checks stay green even during TDD. RED is allowed
only as intentional failing behavioural tests, not as missing imports, broken
types, lint warnings, or build failures.

This plan applies to the active startup-boundary work in
[`mcp-local-startup-release-boundary.plan.md`](mcp-local-startup-release-boundary.plan.md),
while leaving the parallel WS3 lane isolated.

**Status (2026-04-25)**: complete for the current branch state. The remaining
lint and markdownlint failures are isolated to the staged WS3 lane and are not
owned by this plan. Startup-boundary focused tests and the non-test gates listed
in the ledger are green.

## Diagnosis

The current RED slice has crossed a line: tests that import non-existent
modules such as `build-identity.js`, `local-stub-env.js`, and
`app-version-header.js` are useful design pressure, but they also make
build/type-check fail. That means they are not just RED tests; they are
whole-repo gate failures.

The process root cause is cadence drift: agents have been relying on targeted
test runs and reviewer passes, while the full non-test gate surfaces were not
checked often enough after adding new files and imports.

## Recovery Sequence

1. **Freeze scope and collect evidence**
   - Do not add more RED tests or GREEN implementation until the current
     `pnpm check` failures are classified.
   - Run `pnpm check` or inspect the latest complete output and produce a
     failure ledger with each failing gate, owning lane, and whether it is
     intentional RED, parallel WS3, or an unexpected quality failure.

2. **Make non-test gates green first**
   - For startup-boundary REDs, replace missing-symbol failures with typed
     minimal seams that compile and fail behaviourally.
   - The seams can return explicit `Result` errors or inert values that keep
     build/type/lint green while the tests still fail on the intended
     behaviour.
   - Do not treat import errors, type errors, lint warnings, or build errors as
     acceptable RED.

3. **Isolate parallel WS3 failures**
   - Keep build-script/cancellation failures owned by the parallel WS3 session
     unless they block shared root gates.
   - If shared root gates are blocked, coordinate with the owner before editing
     WS3 files.

4. **Repair the startup-boundary RED shape**
   - Build identity: add a typed build-identity boundary that compiles, fails
     fast for the unknown sentinel, and makes `resolveRelease` consume canonical
     build identity as Sentry projection input.
   - Observability: keep stdout OTel logging always on; remove/rename
     ambiguous `HttpObservability.release` without disabling observability.
   - App identity consumers: add greenable seams for `x-app-version` and HTML
     meta tag without booting `createApp()` in tests.
   - Local gates: strip inherited deploy release metadata from local
     dev/UI/a11y/smoke env planning.

5. **Gate cadence guard**
   - Add a plan rule/checkpoint: after every RED-file batch, run non-mutating
     gates that must always stay green: `pnpm type-check`, `pnpm lint`,
     `pnpm markdownlint-check:root`, and focused build where relevant.
   - Before any GREEN implementation claim, run focused package tests plus the
     full non-test gate set.
   - Before closure, run `pnpm check`; if it fails, update the failure ledger
     rather than continuing implementation.

## Validation

- Immediate validation target: build/type/lint/static-analysis green with only
  intentional test assertions failing.
- Startup-boundary targeted RED tests should fail on assertions about behaviour,
  not missing modules or type errors.
- Final validation target remains `pnpm check`, but only after current failing
  gates are classified and non-test gates are restored.

## Failure Ledger — 2026-04-25

### Non-Test Gates

| Gate | Current result | Classification | Evidence |
|---|---|---|---|
| `pnpm build` | Passes | Green | Re-run after typed seams and reviewer fixes; build completed successfully. |
| `pnpm type-check` | Passes | Green after startup-boundary seam repair | Missing symbols replaced with typed production-owned seams; Sentry off-mode type fallout fixed across HTTP and search CLI consumers. |
| `pnpm knip` | Passes | Green after startup-boundary export cleanup | Speculative exported types removed from new seams. |
| `pnpm depcruise` | Passes | Green | 1967 modules / 4253 dependencies / 0 violations. |
| `pnpm lint` | Fails only in staged WS3 file | Parallel WS3 lane | `build-scripts/vercel-ignore-production-non-release-build.mjs` has one TSDoc error and three `semver` named-export warnings. Do not edit under this startup-boundary lane. |
| `pnpm markdownlint-check:root` | Fails only in WS3 plan text | Parallel WS3 lane | `current/sentry-release-identifier-single-source-of-truth.plan.md` has MD004/MD032 around a quoted `+ @types/semver` line. Do not edit under this startup-boundary lane. |

### Behavioural RED Tests

| Focus | Current result | Classification | Evidence |
|---|---|---|---|
| `@oaknational/sentry-node` off-mode config | Passes | GREEN after reviewer follow-up | Off mode no longer resolves or exposes Sentry release fields and remains green without deploy metadata. |
| `@oaknational/build-metadata` release projection | Passes | GREEN after reviewer follow-up | `resolveRelease` validates build identity as a Sentry-safe release value and uses Sentry context for effective environment. |
| HTTP dev launcher env | Passes | GREEN | Local UI/a11y child env strips deploy release metadata. |
| HTTP observability off mode | Passes | GREEN | Off-mode observability constructs without deploy metadata and keeps stdout OTel logging with app version. |

### Repaired RED Shape

The targeted streamable-http RED command now has no missing-module or missing-export
failures. The missing-symbol failures were converted to buildable seams:

- `src/build-identity.ts`
- `src/app/app-version-header.ts`
- `src/runtime-config-from-validated-env.ts`
- `smoke-tests/modes/local-stub-env.ts`

Code-review follow-up tightened the build-identity Sentry projection seam:
`resolveRelease` now validates build identity values against the Sentry release
name denylist and uses the resolver's effective Sentry environment instead of
trusting `buildIdentity.targetEnvironment`.

Test and Sentry review follow-up wired the previously helper-only seams into
production paths where the change was direct: app-version headers and landing-page
metadata consume `RuntimeConfig.version`, local stub smoke preparation uses the
deploy-metadata-stripping env seam, and Sentry Express error-handler registration
requires explicit live Sentry mode instead of raw `SENTRY_MODE !== 'off'`.

## Cadence Guard

Before adding or changing any further RED tests in
[`mcp-local-startup-release-boundary.plan.md`](mcp-local-startup-release-boundary.plan.md),
run the always-green non-test subset one gate at a time:

```bash
pnpm type-check
pnpm knip
pnpm depcruise
pnpm build
```

If lint or markdownlint fail only on the staged WS3 lane, classify the residual
failure in this ledger and do not edit WS3 files without explicit owner direction.
If any startup-boundary file fails lint or markdownlint, fix that before adding
more RED or claiming GREEN.

Before any Phase 2 GREEN claim, run:

```bash
pnpm --filter @oaknational/sentry-node test
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http exec vitest run \
  src/observability/http-observability.integration.test.ts \
  src/runtime-config.integration.test.ts \
  src/build-identity.unit.test.ts \
  src/app/app-version-header.unit.test.ts \
  src/landing-page/render-landing-page.unit.test.ts \
  smoke-tests/modes/local-stub-env.unit.test.ts \
  operations/development/http-dev-contract.unit.test.ts
pnpm type-check
pnpm knip
pnpm depcruise
pnpm build
```

Only after those pass should `pnpm check` be used as the aggregate closure gate;
any residual aggregate failure must be added to the ledger before implementation
continues.

## Cross-references

- [`.agent/rules/dont-break-build-without-fix-plan.md`](../../../rules/dont-break-build-without-fix-plan.md)
  — operationalises this plan's `## Intent` and `## Recovery Sequence` point 2
  for the cross-agent context introduced by
  [`.agent/directives/agent-collaboration.md`](../../../directives/agent-collaboration.md).
  The bidirectional reference (rule cites plan; plan cites rule) is validated
  at consolidation time per the audit step in
  [`.agent/commands/consolidate-docs.md`](../../../commands/consolidate-docs.md).

## Handoff Notes

- This plan restored the cadence invariant for the startup-boundary lane and
  allowed Phase 2 GREEN to begin.
- The implementation went beyond compile-only seams where reviewers found
  test-only risk: the off-mode Sentry branch, app-version header/meta consumers,
  and local dev/smoke env stripping are now wired into production paths.
- Do not mark root `pnpm check` healthy yet. The aggregate command is expected
  to remain blocked by staged WS3 lint/markdownlint residuals until the WS3 lane
  is resumed or explicitly isolated by owner direction.
- After context compression, resume in
  [`mcp-local-startup-release-boundary.plan.md`](mcp-local-startup-release-boundary.plan.md)
  Phase 2, starting from the partial GREEN state recorded there.

## Reviewer Routing

- `test-reviewer`: confirm RED tests fail for behaviour and do not break
  non-test gates.
- `config-reviewer`: if package scripts, turbo config, or gate cadence docs
  change.
- `architecture-reviewer-fred`: if build identity moves into a new workspace or
  changes ADR-owned release boundaries.
- `sentry-reviewer`: before changing `resolveRelease` or Sentry sink metadata
  semantics.
