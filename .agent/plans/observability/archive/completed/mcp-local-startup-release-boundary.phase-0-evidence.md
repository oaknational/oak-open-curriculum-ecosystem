# MCP Local Startup Release Boundary — Phase 0 Evidence

**Date**: 2026-04-24  
**Plan**: [`mcp-local-startup-release-boundary.plan.md`](mcp-local-startup-release-boundary.plan.md)

## First-Principles Check

- **Shape**: the defect is an Oak-authored boundary error. Local gates are
  blocked by Sentry release resolution before they can prove smoke, UI, or a11y
  behaviour. Phase 1 tests should prove Oak composition contracts, not vendor
  behaviour or static script text.
- **Landing path**: new in-process tests must use Vitest and injected data.
  Browser and smoke gates remain separate-process proof surfaces.
- **Vendor literals**: ADR-163 still owns production and preview release
  identity. The local/off decision below does not change the production or
  preview release truth table.

## Ownership Matrix

### App Version And Runtime Metadata

- **Source of truth**:
  `packages/core/build-metadata/src/runtime-metadata.ts`,
  `packages/core/build-metadata/src/git-sha.ts`, and
  `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`.
- **Current contract**: `RuntimeConfig` has required `version` /
  `versionSource` and optional `gitSha` / `gitShaSource`.
- **Local-gate behaviour**: app runtime metadata is required, but deploy-only
  git SHA is optional.
- **Deploy behaviour**: app version remains required; git SHA remains available
  when Vercel supplies it.

### Sentry Release Identity

- **Source of truth**:
  `packages/core/build-metadata/src/release.ts` delegates to
  `packages/core/build-metadata/src/release-internals.ts`.
- **Runtime adapter**:
  `packages/libs/sentry-node/src/config-resolution.ts` delegates
  `resolveSentryRelease` to `resolveRelease`.
- **Current bug**: `packages/libs/sentry-node/src/config.ts` calls
  `resolveSentryRelease` before `createSentryConfig` branches on
  `SENTRY_MODE`, so `off` mode can fail with `missing_git_sha`.
- **Local-gate behaviour after this plan**: `SENTRY_MODE=off` should not
  require a Sentry release identity.
- **Deploy behaviour**: `SENTRY_MODE=sentry` remains strict and still requires
  the ADR-163 metadata for the selected environment.

### Sentry Delivery Mode

- **Source of truth**: `packages/libs/sentry-node/src/config.ts`.
- **Current contract**: `ParsedSentryConfig` is a discriminated union, but all
  variants require `release` and `releaseSource`.
- **Required type decision**: Phase 1 should force `SentryOffConfig` to stop
  requiring release identity, or otherwise split the internal input resolution
  so off mode can be constructed without one. This is a type-shape change in
  `@oaknational/sentry-node`, not an ADR-163 release-shape change.

### Gate Bootability

- **Source of truth**: root `package.json`, app `package.json`, `turbo.json`,
  `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts`, and smoke
  helpers under `apps/oak-curriculum-mcp-streamable-http/smoke-tests/`.
- **Local-gate behaviour after this plan**: `smoke:dev:stub`, `test:ui`, and
  `test:a11y` boot without fake `VERCEL_GIT_COMMIT_SHA`,
  `VERCEL_BRANCH_URL`, or `SENTRY_RELEASE_OVERRIDE`.
- **Deploy behaviour**: not applicable; deploy startup remains covered by the
  lazy Vercel entry and ADR-163 release semantics.

## Composition Root Contracts

- `apps/oak-curriculum-mcp-streamable-http/src/index.ts`: eager local Node
  listener. Reads `process.env` and `process.cwd()`, calls
  `loadRuntimeConfig`, then `createHttpObservability`, then
  `startConfiguredHttpServer`.
- `apps/oak-curriculum-mcp-streamable-http/src/server.ts`: lazy Vercel
  handler. Captures `process.env` and `process.cwd()` at module scope but
  defers `loadRuntimeConfig` and `createHttpObservability` until the first
  request.
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts`:
  smoke local server. Calls `loadRuntimeConfig` with live `process.env` and
  `process.cwd()` inside `createSmokeApp`, then creates observability and the
  production app.
- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev.ts`:
  launcher process. Builds a child-process execution plan from live
  `process.env`; the child server runs `src/index.ts`.
- `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts`: Playwright
  launcher. Starts `pnpm dev:observe:noauth` with explicit local env, but does
  not supply deploy release metadata.

## Local Gate Preconditions

- `smoke:dev:stub`: root script sets `LOG_LEVEL=debug` and Turbo runs the app
  script. The app script starts `smoke-tests/smoke-dev-stub.ts`, which prepares
  stub mode by mutating `process.env` and starts the smoke local server.
- `test:ui`: Turbo runs app `playwright test --grep-invert @a11y`. Playwright
  starts `pnpm dev:observe:noauth` on port `3334` with local auth and
  Elasticsearch fixtures, but no deploy release metadata.
- `test:a11y`: Turbo depends on `test:ui` and runs
  `playwright test --grep @a11y` with the same web-server startup contract.
- None of these gates should synthesise `VERCEL_GIT_COMMIT_SHA`,
  `VERCEL_BRANCH_URL`, or `SENTRY_RELEASE_OVERRIDE` to reach the app under
  test.

## Test Classification

- `packages/core/build-metadata/tests/release.unit.test.ts`: direct proof.
  It exercises `resolveRelease` through injected object inputs. No standards
  issue found for this plan.
- `packages/core/build-metadata/tests/git-sha.unit.test.ts`: mixed. The
  `resolveGitSha` examples are direct proof; the structural `readFileSync`
  source-read test is a wrong-level standards failure and must be removed or
  replaced before this plan closes.
- `packages/libs/sentry-node/src/config.unit.test.ts`: direct proof for
  `createSentryConfig`. It uses injected object inputs and no ambient env, but
  it does not currently prove `SENTRY_MODE=off` without release metadata.
- `packages/libs/sentry-node/src/config-resolution.unit.test.ts`: supporting
  proof for Sentry environment and registration policy. It is not the canonical
  proof for the off-mode release boundary.
- `packages/libs/sentry-node/src/runtime.unit.test.ts`: supporting proof with a
  simple injected Sentry SDK fake. Because it is named `*.unit.test.ts` while
  proving adapter/runtime integration with fakes, it should be renamed or
  explicitly justified if touched by this plan.
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`:
  direct proof for app observability wiring, but it uses injected Sentry SDK
  fakes and currently supplies `VERCEL_GIT_COMMIT_SHA`. It should carry the
  Phase 1 app-wiring RED, and its category naming should be fixed or justified
  if edited.
- `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts`:
  supporting proof for server lifecycle behaviour with fake server and
  observability collaborators. Category naming should be fixed or justified if
  edited.
- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.unit.test.ts`:
  supporting proof for launcher planning. It uses a public planning contract
  and inert `cwd` data, not live `process.cwd()`. It may host a launcher env
  contract proof if Phase 1 needs one.
- `apps/oak-curriculum-mcp-streamable-http/operations/development/run-http-dev-session.unit.test.ts`:
  supporting proof for the dev-session runner. The fake `spawn` method is an
  injected `ProcessRunner`, not `node:child_process`, but the file uses fakes
  under a unit-test name and should be renamed or justified if touched.
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts`:
  standards failure in this plan scope. It reads, writes, and restores
  `process.env`, calls `findRepoRoot(process.cwd())`, and loads env files with
  `dotenv`.
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts`:
  standards failure in this plan scope. It passes live `process.env` and
  `process.cwd()` into `loadRuntimeConfig` from an imported helper.
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub.ts`:
  standards failure in this plan scope. It mutates `process.env` to prepare
  the local stub mode before starting the smoke server.

## ADR-163 Decision

No ADR-163 amendment is required before Phase 1.

ADR-163 requires strict release identity for production and preview, and says
local development does not register Sentry releases or deploys by default. The
Phase 1 target is narrower: in `SENTRY_MODE=off`, local startup should not need
Sentry release identity at all. That is consistent with ADR-163 because no
Sentry delivery or registration occurs in off mode.

If Phase 2 changes production or preview release identifiers, or weakens
`SENTRY_MODE=sentry` fail-closed behaviour, that would require an ADR-163
amendment and reviewer escalation. The current Phase 1 target should not.

## Phase 1 RED Targets

1. Add a paired `@oaknational/sentry-node` test using the same missing-release
   input:
   `SENTRY_MODE=off` succeeds without `VERCEL_GIT_COMMIT_SHA`,
   `VERCEL_BRANCH_URL`, or `SENTRY_RELEASE_OVERRIDE`; `SENTRY_MODE=sentry`
   still fails with `missing_git_sha`.
2. Add an app observability wiring test proving `createHttpObservability` can
   construct off-mode observability from an explicit `RuntimeConfig` without
   deploy release metadata.
3. Add a local configuration composition seam test before calling
   `loadRuntimeConfig` from an in-process test. The seam should accept already
   validated or explicitly injected env data and reach `createHttpObservability`
   without filesystem/env-file IO.
4. Add a launcher or smoke-env preparation contract proof that local gates do
   not add fake deploy release metadata. Prefer a public env-preparation or
   launcher-planning function over assertions on script text.

## Closure Ownership For Standards Failures

The standards failures above are in scope for this active plan. They should be
fixed as part of Phase 1/2 rather than routed to a separate follow-up, because
the local startup defect and the global-env smoke helpers share the same
boundary problem.
