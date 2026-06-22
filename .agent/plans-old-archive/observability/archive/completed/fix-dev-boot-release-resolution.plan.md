---
name: "Fix dev-boot release resolution: missing Vercel attribution falls through to local-dev placeholder"
overview: >
  In development environment, when both VERCEL_BRANCH_URL and
  VERCEL_GIT_COMMIT_SHA are absent, resolveDevelopmentRelease currently
  returns err({kind:'missing_git_sha'}); this propagates up through
  createSentryConfig and kills `pnpm dev`. Cure: in dev, fall through to
  ok with a stable placeholder release identifier ('local-dev') instead
  of erroring. Production and preview behaviour unchanged.
status: completed
isProject: false
todos:
  - id: cycle-1-resolveDevelopmentRelease-fallthrough
    content: "ONE COMMIT (test+code together): (1) edit packages/core/build-metadata/src/release-internals.ts resolveDevelopmentRelease — when no usable release identifier remains in development (no branch URL or branch URL malformed, AND no VERCEL_GIT_COMMIT_SHA), return ok({value:'local-dev', source:RELEASE_SOURCES.local_dev, environment:'development'}) instead of err. (2) Add RELEASE_SOURCES.local_dev='local-dev' entry (snake_case key, consistent with existing entries). (3) Invert the existing test in packages/core/build-metadata/tests/release.unit.test.ts:478-486 to expect ok local-dev. Add new test cases: empty ReleaseInput in development → ok local-dev; malformed VERCEL_BRANCH_URL with no SHA in development → ok local-dev. Existing tests at lines 205-219 and 299-313 act as the environment-boundedness regression-guards (preview→missing_branch_url_in_preview; production→missing_application_version). (4) STRUCTURAL: rename packages/libs/sentry-node/src/config.unit.test.ts → config.integration.test.ts (createSentryConfig is a composition root; tests through it are integration by directive definition). (5) In the renamed file, invert the two cases that depend on the new behaviour — 'keeps live mode strict when deploy release metadata is absent' and 'fails closed in development when no git SHA is available' — both now assert ok local-dev. (6) DEAD-CODE DELETION: remove RELEASE_ERROR_KINDS.missing_git_sha entry and all consumers (sentry-node config-resolution.ts switch case, runtime-error.ts switch case, types.ts union member) — no producer remains after step 1. (7) DELETE THE NONSENSE: delete packages/libs/sentry-node/src/runtime-fixture-tee-redaction.unit.test.ts and config-from-registry.unit.test.ts entirely (skipped/todo placeholders); strip describe.skip blocks from run-smoke.unit.test.ts, run-smoke.integration.test.ts, http-observability.unit.test.ts, cli-observability.unit.test.ts; fix inaccurate documentation that referenced the deleted artefacts (napkin, threads, plans, pending-graduations, repo-continuity)."
    status: completed
---

# Fix Dev-Boot Release Resolution

**Last Updated**: 2026-05-04 (archived as completed)
**Status**: ✅ COMPLETED — Cycle 1 landed on `feat/eef_exploration`. Verified by Fronded Climbing Thicket boot probe: `pnpm dev` with `SENTRY_MODE=sentry` and no Vercel env vars reaches "Oak Curriculum MCP Server listening on port 3333" in ~142ms; `missing_git_sha` no longer raised in `build-metadata`.

## Context

`pnpm dev` fails to boot in local development when the developer's
`.env.local` (or any committed `.env*`) sets `SENTRY_MODE=sentry`. The
failure path: `createSentryConfig` → `resolveSentryRelease` →
`resolveDevelopmentRelease` (in `packages/core/build-metadata/src/release-internals.ts`)
→ both `VERCEL_BRANCH_URL` and `VERCEL_GIT_COMMIT_SHA` are absent →
returns `err({kind: RELEASE_ERROR_KINDS.missing_git_sha})` → boot
aborts.

The error message itself anticipates this case: *"Set
VERCEL_GIT_COMMIT_SHA or use SENTRY_RELEASE_OVERRIDE for ad-hoc
rehearsals."* That is friction-as-cure; the architectural-correct shape
is for development environment to provide its own stable placeholder
when no Vercel attribution is available, since release attribution is
meaningless locally.

The previous regression-guard at
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
was deleted as a damaged-plan artefact (it spawned `pnpm dev` from a
test, which is brittle). The bug is currently unguarded; this plan's
unit-level cases are the replacement proof.

## Foundation Alignment

- **principles.md §Strict and Complete**: production and preview keep
  their hard-fail on missing SHA — that is correct strict behaviour for
  deployed environments. Development is the only environment where the
  attribution genuinely cannot exist; the fall-through is environment-
  bounded, not a general softening.
- **principles.md §First Question**: simpler than the multi-sink rename
  for fixing this specific bug. Surgical change in the consumer.
- **testing-strategy.md §TDD-as-pairs**: test and product code land
  together in one commit.
- **testing-strategy.md §Test Types**: tests through a composition
  root (multiple units imported and called together) are integration
  tests by definition, not unit tests. The pre-existing
  mislabelling of `config.unit.test.ts` is corrected as part of this
  cycle — the cross-package cascade exposed by this change is
  evidence of the misclassification, and the structural cure (rename
  to `config.integration.test.ts`) is the right response, not silent
  absorption of cross-package test coupling in a file claiming to be
  unit-level.

## Cycle

### Cycle 1 — `resolveDevelopmentRelease` falls through to `local-dev`

**Atomic, parallel-safe**: yes — touches `packages/core/build-metadata/`
(constant, function, unit tests) and `packages/libs/sentry-node/`
(structural rename + two cascading test inversions). No dependency
on any other plan.

**Changes**:

1. Add `local_dev: 'local-dev'` entry to `RELEASE_SOURCES` in
   `packages/core/build-metadata/src/release-types.ts`. The key is
   `snake_case` to match the existing entries (`sentry_release_override`,
   `application_version`, `vercel_branch_url`, `development_short_sha`,
   `build_identity`); the value is `'local-dev'` (kebab-case literal) —
   this is the same string already used as the established placeholder
   in `release.unit.test.ts:23,35` for the build-identity dev case.
2. Edit `resolveDevelopmentRelease` in
   `packages/core/build-metadata/src/release-internals.ts:185-220`:
   replace the `if (!sha) return err({...missing_git_sha...})` branch
   with `if (!sha) return ok({value: 'local-dev', source:
   RELEASE_SOURCES.local_dev, environment:
   RELEASE_ENVIRONMENTS.development})`. The malformed-branch-url +
   no-SHA path also reaches this branch (via the existing fall-through
   at `release-internals.ts:199-201`) and inherits the new behaviour
   automatically.
3. Modify the **existing** test at
   `packages/core/build-metadata/tests/release.unit.test.ts:478-486`
   (`'returns missing_git_sha when neither VERCEL_GIT_COMMIT_SHA nor
   branch URL are usable'`): under the new behaviour the case is
   inverted — it now asserts `ok({value:'local-dev',
   source:'local-dev', environment:'development'})`. Rename the
   `it(...)` description to reflect the inverted semantics.
4. Add new unit test cases in the same file:
   - Empty `ReleaseInput` (unset `VERCEL_ENV`) → `ok({value:'local-dev', source:'local-dev', environment:'development'})`.
   - Malformed `VERCEL_BRANCH_URL` + no SHA in development → `ok local-dev` (proves the malformed-fall-through path inherits the new behaviour; complements the existing case at lines 448-461 which has SHA present and so still resolves to `dev-<shortSha>`).
5. Existing tests that continue to pass and act as the regression-guards
   proving the dev fall-through is environment-bounded:
   - Lines 402-418, 420-429: `VERCEL_GIT_COMMIT_SHA` present in development still produces `dev-<shortSha>` (dev-with-SHA path unchanged).
   - Lines 431-446: well-formed `VERCEL_BRANCH_URL` in development still wins over SHA.
   - Line 205-219: `missing_application_version` when `VERCEL_ENV=production`, `ref=main`, and `APP_VERSION` absent — proves the dispatcher routes production to `resolveProductionRelease`, not the dev fall-through.
   - Line 299-313: `missing_branch_url_in_preview` when `VERCEL_ENV=preview` and `VERCEL_BRANCH_URL` absent — proves the dispatcher routes preview to `resolvePreviewRelease`, not the dev fall-through.
6. **Structural cure in `packages/libs/sentry-node/`** — the existing
   `config.unit.test.ts` is mislabelled. `createSentryConfig` is a
   composition root that imports `parseMode`, `parseBooleanFlags`,
   `validateDsn`, `parseTracesSampleRate`, `resolveSentryEnvironment`,
   `resolveGitSha`, and `resolveSentryRelease` (which calls into
   `@oaknational/build-metadata`'s `resolveRelease`). Tests through
   `createSentryConfig` exercise the composition of multiple units —
   that is integration-level by the testing-strategy directive's
   definition (§Test Types §In-process tests: integration tests
   verify "a collection of units working together as code"). The
   reason this rename is forced into the same commit as the
   build-metadata change: leaving the file as `*.unit.test.ts` and
   only inverting two tests would silently absorb the cross-package
   coupling — exactly the failure mode the directive warns against.
   - **Action**: `git mv packages/libs/sentry-node/src/config.unit.test.ts → config.integration.test.ts`. All 16 tests in the file call the composition root and are correctly classified as integration tests.
   - **Two cascading test inversions** (now in their proper integration-test home):
     - The case `'keeps live mode strict when deploy release metadata is absent'` (was line 134) becomes `'permits live mode in development with the local-dev placeholder when deploy release metadata is absent'`, asserting `ok` with `mode:'sentry'`, `environment:'development'`, `release:'local-dev'`, `releaseSource:'local-dev'`. Inputs unchanged.
     - The case `'fails closed in development when no git SHA is available'` (was line 270) becomes `'falls through to local-dev in development when no git SHA is available'`, asserting `ok` with the same shape. Inputs unchanged.
   - **Dead-code deletion (was non-goal, now in scope per owner direction)**: `RELEASE_ERROR_KINDS.missing_git_sha` and its sentry-node consumers (`config-resolution.ts:184-185` switch case, `runtime-error.ts:73` switch case, `types.ts:170` union member) are deleted. After step 1 no producer raises this kind; the branches were unreachable; the union member was orphaned. Binary lens: not relevant to current work, delete.

7. **Skipped/todo test deletion (was non-goal, now in scope per owner direction)**:
   - **Whole files deleted**: `packages/libs/sentry-node/src/runtime-fixture-tee-redaction.unit.test.ts` (entirely a `describe.skip`) and `packages/libs/sentry-node/src/config-from-registry.unit.test.ts` (entirely `it.todo` placeholders).
   - **Block deletions**: `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.unit.test.ts` (`SKIP-UNTIL-A2`/`A3` `describe.skip` blocks), `apps/oak-curriculum-mcp-streamable-http/smoke-tests/harness/run-smoke.integration.test.ts` (one `SKIP-UNTIL-A2` block), `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts` (WS4 SinkRegistry RED block + jsdoc + comment), `apps/oak-search-cli/src/observability/cli-observability.unit.test.ts` (WS5 SinkRegistry RED block + jsdoc + comment).
   - **Inaccurate documentation fixed**: napkin §RED-arc skip register, observability-sentry-otel.next-session.md, pending-graduations.md, repo-continuity.md, replace-sentry-mode-with-observability-sinks.plan.md, n-agent-collaboration-experiments.plan.md — all updated to remove references to deleted artefacts. Re-spec for WS1/WS2/WS4/WS5/A2/A3 obligations will happen as proper test+code TDD pairs at the time the work is actually undertaken, per `testing-strategy.md` line 75-81.
7. The existing `RELEASE_ERROR_KINDS.missing_git_sha` entry stays —
   no consumer raises it after this change, but the entry remains
   exported as part of the public discriminated union surface. Removal
   is out of scope.

**Acceptance criteria**:

- `pnpm test --filter @oaknational/build-metadata` exit 0. The
  load-bearing proofs of the new behaviour are: (1) the inverted case
  at `release.unit.test.ts:478-486` now asserts `ok local-dev`; (2)
  empty `ReleaseInput` → `ok local-dev`; (3) malformed branch URL +
  no SHA in dev → `ok local-dev`. The environment-boundedness proofs
  are existing tests that continue to pass: (4)
  `missing_branch_url_in_preview` at line 299-313 proves the
  dispatcher still routes preview to `resolvePreviewRelease`; (5)
  `missing_application_version` at line 205-219 proves the dispatcher
  still routes production to `resolveProductionRelease`.
- `pnpm dev` invoked from `apps/oak-curriculum-mcp-streamable-http/`
  with `SENTRY_MODE=sentry` and no Vercel env vars boots cleanly to
  "server listening" (manual hermetic-env probe per §Validation; no
  spawn-based automated test is wired up — unit-level proof above is
  sufficient).
- `grep -rn "missing_git_sha" packages/core/build-metadata/` finds
  exactly one occurrence (the `RELEASE_ERROR_KINDS` declaration in
  `release-types.ts`); the previous producer in `release-internals.ts`
  has been replaced.

Plan 3 cycle 1c lands a replacement unit/integration test on
`loadRuntimeConfig` + `createApp` — that is the proper test home for
the broader "minimal-env boot succeeds" invariant; it is not a
prerequisite for plan 1.

**Validation**:

```bash
pnpm test --filter @oaknational/build-metadata
cd apps/oak-curriculum-mcp-streamable-http
# Manual hermetic-env boot probe (one-shot; not an automated test).
# `env -u` is portable; `unset $(env | grep ...)` is shell-fragile.
env -u VERCEL_ENV -u VERCEL_BRANCH_URL -u VERCEL_GIT_COMMIT_SHA \
    -u VERCEL_GIT_COMMIT_REF -u SENTRY_RELEASE_OVERRIDE \
    SENTRY_MODE=sentry timeout 15 pnpm dev | head -5
# expect "server listening"
```

## Quality Gates

After cycle close (per `.agent/plans/templates/components/quality-gates.md`):

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm test
pnpm test:e2e
```

All exit 0.

## Non-Goals

- **NOT** fixing the multi-sink rename. That is plan 2.
- **NOT** retiring smoke tests. That is plan 3.
- **NOT** removing `RELEASE_ERROR_KINDS.missing_git_sha` from the
  discriminated union. After this change no producer raises it, but
  removing the entry is a breaking change to the public union surface
  and is out of scope. External consumers with exhaustive switch
  handlers continue to compile.
- **NOT** changing `.env.local` defaults or committed `.env*` files.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Sentry release attribution in dev becomes meaningless ("local-dev" pollutes Sentry) | Low | Low | Dev-environment Sentry events are already non-load-bearing; if Sentry is configured locally, all events tag as `local-dev`, easy to filter |
| Preview/production accidentally falls through to `local-dev` | Mitigated | High | The fall-through is gated on `environment === 'development'` (returned by `deriveEnvironment`); preview and production take different code paths (`resolvePreviewRelease`, `resolveProductionRelease`) and are regression-guarded by the new test cases |
| `missing_git_sha` becomes orphaned in the discriminated union | Mitigated | Low | The entry stays exported; no in-tree producer raises it after this change, but the type surface is unchanged so external consumers with exhaustive switches continue to compile (see §Non-Goals) |

## Reviewer Dispatch

- **`type-reviewer`** (Result-typed function, discriminated unions, no `as`/`!`/`unknown`)
- **`test-reviewer`** (TDD-as-pairs cycle correctness; the regression-guard cases prove the dev fall-through is environment-bounded)
- **`code-reviewer`** gateway

## Plan Exit

- Cycle 1 commit landed on `feat/eef_exploration`.
- `pnpm test --filter @oaknational/build-metadata` exit 0 (the
  inverted + new unit cases are the load-bearing proof).
- `pnpm dev` from `apps/oak-curriculum-mcp-streamable-http/` with
  `SENTRY_MODE=sentry` and no Vercel env vars boots cleanly to
  "server listening" (manual hermetic-env probe per §Validation).
- Note: no `pnpm test:e2e` regression-guard exists for this path —
  the previous spawning e2e was deleted as a damaged-plan artefact;
  unit-level proof is sufficient.

## Consolidation

After plan close, run `/jc-consolidate-docs`.

## Independence

This plan is independent of plan 2 (config-system replacement) and plan
3 (smoke-test retirement). It can run in parallel with both. It does not
touch any of their files.
