---
name: "Fix dev-boot release resolution: missing Vercel attribution falls through to local-dev placeholder"
overview: >
  In development environment, when both VERCEL_BRANCH_URL and
  VERCEL_GIT_COMMIT_SHA are absent, resolveDevelopmentRelease currently
  returns err({kind:'missing_git_sha'}); this propagates up through
  createSentryConfig and kills `pnpm dev`. Cure: in dev, fall through to
  ok with a stable placeholder release identifier ('local-dev') instead
  of erroring. Production and preview behaviour unchanged.
status: current
isProject: false
todos:
  - id: cycle-1-resolveDevelopmentRelease-fallthrough
    content: "ONE COMMIT (test+code together): edit packages/core/build-metadata/src/release-internals.ts resolveDevelopmentRelease — when both VERCEL_BRANCH_URL absent and VERCEL_GIT_COMMIT_SHA absent, return ok({value:'local-dev', source:RELEASE_SOURCES.localDev, environment:'development'}) instead of err. Add RELEASE_SOURCES.localDev='local-dev' entry. Pair with new unit test cases in packages/core/build-metadata/tests/release.unit.test.ts proving: empty ReleaseInput in development → ok local-dev; VERCEL_BRANCH_URL present still wins; VERCEL_GIT_COMMIT_SHA present still wins; preview/production with no SHA still err (regression-guarded)."
    status: pending
---

# Fix Dev-Boot Release Resolution

**Last Updated**: 2026-05-03
**Status**: 🔴 NOT STARTED

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

The `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
regression-guard is currently RED for this exact reason (verified
2026-05-03).

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

## Cycle

### Cycle 1 — `resolveDevelopmentRelease` falls through to `local-dev`

**Atomic, parallel-safe**: yes (single function, single test file, no
dependency on any other plan).

**Changes**:

1. Add `localDev: 'local-dev'` entry to `RELEASE_SOURCES` in
   `packages/core/build-metadata/src/release-types.ts`. Naming note:
   existing entries use `snake_case` keys with matching `snake_case`
   values; the new entry uses `camelCase` key `localDev` with kebab-case
   value `local-dev` per owner direction. (Mixed-case keys is an
   acknowledged inconsistency; retroactive normalisation is out of
   scope for this plan.)
2. Edit `resolveDevelopmentRelease` in
   `packages/core/build-metadata/src/release-internals.ts:185-220`:
   replace the `if (!sha) return err({...missing_git_sha...})` branch
   with `if (!sha) return ok({value: 'local-dev', source:
   RELEASE_SOURCES.localDev, environment:
   RELEASE_ENVIRONMENTS.development})`.
3. Pair with new unit test cases in
   `packages/core/build-metadata/tests/release.unit.test.ts` (or the
   adjacent `release-internals.unit.test.ts` if that's the test home):
   - Empty `ReleaseInput` in development → `ok({value:'local-dev', source:'local-dev', environment:'development'})`.
   - `VERCEL_BRANCH_URL` present in development still wins (existing
     coverage continues to pass).
   - `VERCEL_GIT_COMMIT_SHA` present in development still wins
     (existing coverage continues to pass; produces `dev-<shortSha>`).
   - **Preview environment with no SHA**: still errs (regression-guard
     proving the fall-through is dev-only).
   - **Production environment with no SHA**: still errs (regression-guard).
4. The existing `RELEASE_ERROR_KINDS.missing_git_sha` entry stays —
   preview and production still raise it. Only the dev path stops
   raising it.

**Acceptance criteria**:

- `pnpm test --filter @oaknational/build-metadata` exit 0. The new unit
  cases (empty `ReleaseInput` in dev → `local-dev`; preview/production
  with no SHA still err) are the load-bearing proof that the bug is
  fixed.
- `pnpm dev` invoked from `apps/oak-curriculum-mcp-streamable-http/`
  with `SENTRY_MODE=sentry` and no Vercel env vars boots cleanly to
  "server listening" (manual verification — no spawn-based automated
  test is wired up; the unit-level proof above is sufficient).
- `grep -rn "missing_git_sha" packages/core/build-metadata/` continues
  to find the error kind (not deleted; only the dev-path consumer
  stopped raising it).

The previous spawning regression-guard at
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
was deleted as a damaged-plan artefact in a separate commit. Plan 3
cycle 1c lands a replacement unit/integration test on
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
- **NOT** normalising existing `RELEASE_SOURCES` entries from snake_case
  to camelCase. The new entry uses camelCase per owner direction; the
  rest stay as-is until a separate normalisation decision is made.
- **NOT** touching `RELEASE_ERROR_KINDS.missing_git_sha`. Production
  and preview still raise it.
- **NOT** changing `.env.local` defaults or committed `.env*` files.

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Sentry release attribution in dev becomes meaningless ("local-dev" pollutes Sentry) | Low | Low | Dev-environment Sentry events are already non-load-bearing; if Sentry is configured locally, all events tag as `local-dev`, easy to filter |
| Preview/production accidentally falls through to `local-dev` | Mitigated | High | The fall-through is gated on `environment === 'development'` (returned by `deriveEnvironment`); preview and production take different code paths and are regression-guarded by the new test cases |

## Reviewer Dispatch

- **`type-reviewer`** (Result-typed function, discriminated unions, no `as`/`!`/`unknown`)
- **`test-reviewer`** (TDD-as-pairs cycle correctness; the regression-guard cases prove the dev fall-through is environment-bounded)
- **`code-reviewer`** gateway

## Plan Exit

- Cycle 1 commit landed on `feat/eef_exploration`.
- `pnpm test:e2e` regression-guard passes.
- `pnpm dev` boots locally.

## Consolidation

After plan close, run `/jc-consolidate-docs`.

## Independence

This plan is independent of plan 2 (config-system replacement) and plan
3 (smoke-test retirement). It can run in parallel with both. It does not
touch any of their files.
