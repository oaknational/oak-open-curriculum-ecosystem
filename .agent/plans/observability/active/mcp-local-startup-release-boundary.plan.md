---
name: "MCP Local Startup Release Boundary"
overview: >
  Decouple local MCP app startup and quality gates from deploy-only Sentry
  release metadata while preserving ADR-163 release attribution correctness.
todos:
  - id: phase-0-boundary-inventory
    content: "Phase 0: Inventory composition roots, release identity inputs, gate contracts, and current failure evidence."
    status: completed
  - id: phase-1-red-tests
    content: "Phase 1: Add failing tests that prove SENTRY_MODE=off, full local startup, and gate-boundary contracts through injected env with no in-process IO or process.env access."
    status: completed
  - id: quality-gate-recovery
    content: "Quality gate recovery: classify current pnpm check failures, restore non-test gates, and add cadence guard before Phase 2 GREEN."
    status: completed
  - id: phase-2-boundary-implementation
    content: "Phase 2: Refactor observability/release/startup boundaries, eliminate in-scope standards failures, and keep production release attribution strict."
    status: completed
  - id: phase-3-docs-and-gates
    content: "Phase 3: Update ADR/docs/plan references, run reviewer checks, prove no in-process IO/global-env regressions, then run pnpm check."
    status: completed
---

# MCP Local Startup Release Boundary

**Last Updated**: 2026-04-25  
**Status**: 🟢 REVIEWER FINDING REINTEGRATION COMPLETE — focused tests,
`pnpm type-check`, `pnpm lint`, `pnpm knip`, `pnpm test`, `pnpm build`,
targeted markdownlint, `pnpm portability:check`, and `git diff --check` pass.
`pnpm markdownlint-check:root` also passes after the MD040 sidecar rule fix.
Full `pnpm check` was not rerun after handoff-only doc updates.
**Scope**: HTTP MCP app startup, Sentry release resolution, local
smoke/UI/a11y gate contracts, and the tests/docs that govern those
boundaries.

---

## Context

The AGENT homing and hard-fitness follow-through reached the repo closure
gate and found a focused blocker: `pnpm check` failed only inside
`@oaknational/oak-curriculum-mcp-streamable-http` on `smoke:dev:stub`,
`test:a11y`, and `test:ui`. The shared symptom was local app startup
failing before those gates could test their own surfaces because Sentry
release resolution required `VERCEL_GIT_COMMIT_SHA` when neither a
Vercel branch URL nor an explicit release override was present.

The runtime app config is not the direct source of the hard requirement.
`apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts` treats git
SHA as optional runtime metadata. The failure emerges later, when the MCP
local/server/smoke composition paths initialise observability and
`@oaknational/sentry-node` resolves a release before the chosen Sentry mode
has established whether release metadata is even needed.

This is a design-boundary issue, not an env-var convenience issue.
Sprinkling `VERCEL_GIT_COMMIT_SHA` into local gates would make them pass
while preserving the muddle: deployment identity, Sentry event
configuration, local bootability, smoke/UI/a11y gate intent, and test
fixtures would remain coupled through accidental startup preconditions.

## Problem Statement

### Issue 1: `SENTRY_MODE=off` still behaves as release-dependent startup

Current evidence indicates `createSentryConfig` resolves the Sentry release
before mode-specific semantics can short-circuit. As a result, "off" is not
fully off for local startup: a machine without `VERCEL_BRANCH_URL`,
`VERCEL_GIT_COMMIT_SHA`, or `SENTRY_RELEASE_OVERRIDE` can fail before the app
has a chance to run without Sentry delivery.

### Issue 2: Local gates prove the wrong precondition first

`smoke:dev:stub`, `test:ui`, and `test:a11y` are supposed to prove local
stubbed MCP behaviour, browser interaction, and accessibility surfaces.
They currently prove a deploy-release metadata precondition before reaching
those surfaces. That makes gate failures noisy and makes release-identity
policy an accidental blocker for unrelated quality signals.

### Issue 3: Composition roots encode different startup contracts

The Vercel handler path is lazy enough that module import does not
immediately construct config and observability, while the local Node entry
and smoke local server construct them eagerly. That difference may be
legitimate, but it is currently implicit. The plan must name the startup
contract each composition root owns and remove any duplicate or hidden source
of truth.

### Issue 4: Test support risks becoming a parallel system

The fix must not create a fake MCP application, fake release policy, or fake
observability system just to satisfy tests. Tests may use explicit boundary
test doubles, injected env objects, and no-op observability adapters, but the
production app factory and release resolver must remain the source of truth
for the behaviour being proved.

### Issue 5: Existing test surfaces include critical standards failures

The current suite contains tests and smoke helpers that violate the repository
testing standard. This is not background debt or optional cleanup. It is a
critical failure of standards that must shape this plan's implementation:

- in-process tests must not perform IO of any kind, whether named unit or
  integration;
- in-process tests must not read or mutate `process.env`, ambient env files, or
  `process.cwd()`;
- tests must prove product behaviour through public contracts, not source-file
  structure, import strings, or launcher configuration collections;
- existing tests that rely on fakes while named `*.unit.test.ts` must not be
  copied as examples for new Phase 1 tests.

Known examples from the review include the `git-sha` structural source-read
test and smoke helpers that read or mutate `process.env`. Phase 0 must classify
these as standards failures and decide whether this plan fixes them directly or
records a named, blocking follow-up before closure.

## Existing Authorities

- ADR-163 owns Sentry release identity and Vercel production attribution.
  This plan must preserve its production/preview release truth table unless
  Phase 0 proves the ADR itself must be amended before implementation.
- `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`
  owns the single release resolver and Sentry release identifier collapse.
  This plan is a boundary follow-through, not a competing release-shape
  redesign.
- ADR-121 and `docs/engineering/build-system.md` own quality-gate surfaces.
  They must say what `smoke:dev:stub`, `test:ui`, and `test:a11y` prove
  after this plan lands.
- `.agent/directives/testing-strategy.md` and
  `.agent/rules/no-global-state-in-tests.md` prohibit tests from reading or
  mutating global env state. New regression tests must inject env through
  typed composition seams, not inspect `process.env`.

## Design Intent

1. Preserve strict deploy release attribution. Real Sentry delivery modes
   still require the metadata ADR-163 says they require.
2. Make local bootability explicit. Local dev, smoke, UI, and a11y gates
   should boot without Vercel deploy metadata when they are not proving
   release registration.
3. Keep one release resolver. If release policy changes, change the
   canonical resolver/adapter path and its ADR-backed tests, not each gate.
4. Make "off" semantics honest. `SENTRY_MODE=off` means no Sentry delivery and
   no Sentry release registration requirement. It does **not** mean the app has
   no version or runtime identity. App version/runtime metadata and Sentry
   release identity are separate concerns and must stay separately named.
5. Use dependency injection to satisfy test constraints. If a public startup
   helper currently reaches the filesystem, ambient env files, or `process.cwd()`,
   extract an injected env-source or pure validated-env seam rather than testing
   through the IO path. No test reads or writes `process.env`, no in-process
   test performs IO, and no test-only app duplicates production composition.
6. Keep observability always on. Disabling Sentry means disabling the external
   Sentry sink adapter only; it must not disable stdout logging, OTel-shaped log
   records, local spans, correlation context, or app-level observability helpers.
7. Extract app build identity into its own boundary. Build identity is not
   created by observability and is not owned by Sentry release resolution.
   Observability, HTML pages, API responses, and Sentry adapters are consumers
   of that identity.

**Could it be simpler?** Yes: the simplest healthy shape is one release
identity authority, one app build identity authority, one app
factory/composition contract, and gate-specific tests that inject
env/observability at the boundary they actually own.

## Build Identity Boundary

This plan now owns an explicit build-identity extraction before GREEN
implementation proceeds.

### Requirements

- Every app build has a build/version identity, including local dev, local
  smoke, Vercel preview, Vercel production on `main`, and production builds
  from non-`main` branches used for user testing.
- The identity value is determined by target environment (`development`,
  `preview`, `production`), build context (`local`, `vercel`), and branch
  (`main` or other). Production builds from non-`main` branches must keep their
  distinct deploy identity rather than being forced into the `main` production
  identity.
- Build identity is orthogonal to Sentry and is the canonical build/release
  fact for the app. `resolveRelease` becomes a Sentry-specific projection from
  that build identity plus Sentry context; it is not a second source of app
  identity. Build identity may be sent to Sentry as separate observability
  metadata, but the Sentry `release` field remains the ADR-163 projection and
  is never a fallback invented inside the Sentry adapter.
- Runtime code consumes a typed identity value. It must not recalculate it via
  Sentry config, ambient env reads, or deployment-only fallbacks.
- Missing or unknown identity must fail fast with a helpful error at the
  identity boundary, not later inside observability or the Sentry adapter.

### Candidate Shape

The GREEN implementation should consider an app-owned generated module such as
`apps/oak-curriculum-mcp-streamable-http/src/.app-version.ts`:

- the checked-in default exports an explicit unknown/unset sentinel;
- build/dev startup tooling overwrites it with a generated identity for the
  current context;
- runtime imports the generated value through a small build-identity adapter;
- the adapter throws or returns a typed `Result` with a helpful error if the
  sentinel reaches a runtime path that requires a real identity.

If the final home is a separate workspace, prefer extending
`@oaknational/build-metadata` or creating a narrowly named build-identity
workspace over adding app-local release logic to observability or Sentry
packages.

### Consumers

- `RuntimeConfig.version` / future `RuntimeConfig.buildIdentity` fields.
- `createHttpLogger` OTel `Resource['service.version']`.
- `x-app-version` on API responses.
- `<meta name="app-version" ...>` on HTML pages.
- Sentry external sink adapter metadata such as an `app.version` tag, context,
  or OTel resource attribute only when Sentry is enabled.
- `resolveRelease(buildIdentity, sentryContext)` as the Sentry `release`
  projection when Sentry is enabled. This projection remains governed by
  ADR-163 and must not recalculate or replace build identity.

## Non-Goals

- Do not broaden into the full
  `observability/future/mcp-http-runtime-canonicalisation.plan.md` runtime
  simplification.
- Do not add global fake Vercel env vars to `pnpm check`, Playwright, or
  smoke setup as the primary fix.
- Do not weaken production or preview Sentry release correctness.
- Do not create a parallel test-only MCP server or duplicate release
  resolver.
- Do not make PR checks network-capable; ADR-161 still governs network-free
  PR-check CI boundaries.

## Phase 0: Boundary Inventory

**Goal**: turn the diagnosis into an ownership matrix before changing code.

**Evidence**:
[`mcp-local-startup-release-boundary.phase-0-evidence.md`](mcp-local-startup-release-boundary.phase-0-evidence.md)
records the completed ownership matrix, local gate preconditions, test
classification, ADR-163 decision, and Phase 1 RED target list.

### Tasks

1. Enumerate every release and observability consumer:

   ```bash
   rg -n "createSentryConfig|resolveSentryRelease|resolveRelease|resolveGitSha|VERCEL_GIT_COMMIT_SHA|VERCEL_BRANCH_URL|SENTRY_RELEASE_OVERRIDE|SENTRY_MODE" \
     packages apps docs .agent
   ```

2. Enumerate HTTP MCP composition roots and local gate launchers:

   ```bash
   rg -n "createHttpObservability|loadRuntimeConfig|createApp|smoke:dev:stub|test:ui|test:a11y|webServer|tsx src/index" \
     apps/oak-curriculum-mcp-streamable-http package.json turbo.json .github docs .agent
   ```

3. Produce a short ownership matrix in execution notes or plan evidence:

   | Concern | Source of truth | Local-gate behaviour | Deploy behaviour |
   |---|---|---|---|
   | App version/runtime metadata | TBD in Phase 0 | Required, no deploy-only precondition | Required |
   | Sentry release identity | ADR-163 resolver path | Not required in off mode | Strict |
   | Sentry delivery mode | `@oaknational/sentry-node` config | Off/fixture explicit | Strict |
   | Gate bootability | package scripts + ADR-121 docs | No deploy metadata | N/A |

4. Decide whether ADR-163 needs an amendment before implementation. If the
   desired local/off semantics contradict accepted ADR text, stop and amend
   the ADR first.
5. Name the current public contracts for app version/runtime metadata and
   Sentry release identity. If current types conflate them, record the required
   split before writing RED tests. Do not satisfy off mode by inventing a fake
   Sentry release value when the product behaviour is actually "no Sentry
   release required".
6. Inventory relevant existing tests and classify each one:

   - **direct proof** — proves a product behaviour required by this plan;
   - **supporting proof** — protects a neighbouring invariant but is not the
     canonical proof for this plan;
   - **wrong-level or standards failure** — constrains implementation, proves
     configuration/source structure, performs in-process IO, touches ambient
     state, or uses a test category that does not match the file name.

   The classification must explicitly cover:

   - `packages/core/build-metadata/tests/release.unit.test.ts`
   - `packages/core/build-metadata/tests/git-sha.unit.test.ts`
   - `packages/libs/sentry-node/src/config.unit.test.ts`
   - `packages/libs/sentry-node/src/config-resolution.unit.test.ts`
   - `packages/libs/sentry-node/src/runtime.unit.test.ts`
   - `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`
   - `apps/oak-curriculum-mcp-streamable-http/src/server-runtime.unit.test.ts`
   - `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.unit.test.ts`
   - `apps/oak-curriculum-mcp-streamable-http/operations/development/run-http-dev-session.unit.test.ts`
   - `apps/oak-curriculum-mcp-streamable-http/smoke-tests/environment.ts`
   - `apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-server.ts`
   - `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub.ts`

### Acceptance Criteria

- Every composition root has a named startup contract.
- Every local gate has a named precondition set.
- The plan executor can state which layer owns app version/runtime metadata,
  Sentry release identity, Sentry mode, and gate bootability.
- The plan executor can state whether any type/interface change is needed to
  keep app version separate from Sentry release in off mode.
- Existing tests relevant to the plan are classified by proof value and
  standards compliance before new tests are added.
- Any existing standards failure in this plan's scope is fixed, removed, or
  moved to a named blocking follow-up that must close before this plan is
  considered complete. It is not described as acceptable debt.
- No implementation begins until any ADR contradiction is resolved.

## Phase 1: RED Tests

**Goal**: lock the desired boundary before refactoring.

**Evidence**:
[`mcp-local-startup-release-boundary.phase-1-red-evidence.md`](mcp-local-startup-release-boundary.phase-1-red-evidence.md)
records the failing RED tests, focused commands, reviewer gates, and GREEN
entry criteria.

### Required failing tests

1. `@oaknational/sentry-node`: paired mode-boundary proof using the same
   missing-release input:

   - `SENTRY_MODE=off` can construct config without
     `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, or
     `SENTRY_RELEASE_OVERRIDE`;
   - `SENTRY_MODE=sentry` still fails when ADR-163-required release metadata is
     absent.

   This is the primary RED for the architectural bug: release resolution must
   not run before off-mode semantics can take effect, but live delivery remains
   strict.
2. `@oaknational/sentry-node` or `@oaknational/build-metadata`: existing
   production and preview truth-table tests still fail closed when
   ADR-163-required release metadata is absent. Do not duplicate the whole
   truth table; add only the row needed to prove the off-mode exception does
   not weaken real delivery modes.
3. HTTP MCP full-chain local composition: prove the path from explicit local
   env data to runtime config to `createHttpObservability` without importing an
   IO path into the test. If the current public helper is
   `loadRuntimeConfig({ processEnv, startDir })` and it can reach filesystem
   env loading, the implementation must first expose a DI seam: either an
   injected env source/filesystem adapter or a pure validated-env to
   `RuntimeConfig` function. The RED test then calls that seam with deploy
   metadata omitted.
4. HTTP MCP observability mapping: app observability composition can construct
   off-mode observability from an explicit `RuntimeConfig` that omits
   `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, and
   `SENTRY_RELEASE_OVERRIDE`. This is a wiring guard for the app-to-Sentry
   config mapping, not a substitute for the full-chain proof above.
5. Gate contract regression: smoke/UI/a11y launcher setup does not synthesize
   a fake `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, or
   `SENTRY_RELEASE_OVERRIDE` to reach the app under test.
6. Smoke helper seam: add a RED against a pure env-preparation/composition seam
   or spawned-child env contract for local smoke startup. Do not add tests
   around the current global `process.env` mutation path as if that path were
   acceptable. The only way not to add this RED is for Phase 0 to move the smoke
   helper standards failure into a named blocking follow-up that must close
   before this plan is considered complete.

### Test discipline

- Tests must pass env as typed data into the resolver, config, or app
  composition function under test.
- Tests must not read or mutate `process.env`.
- All tests that import code into the test process must not perform filesystem
  IO, network IO, child-process spawning, ambient env-file loading, or
  `process.cwd()` reads. The ban applies regardless of filename or category:
  unit, integration, in-process E2E, component-style harnesses, and any other
  imported-code test all obey the same rule. Only separate-process E2E and
  smoke boundaries may perform their explicitly allowed IO under
  `.agent/directives/testing-strategy.md`.
- In-process tests must prove product behaviour through public functions and
  explicit injected dependencies. They must not assert on source-file text,
  import strings, static configuration collections, package script strings, or
  command-list structure. Launcher and gate tests must call a public
  env-preparation or launcher-planning contract and assert its returned child
  env/config behaviour.
- Test doubles are allowed only at explicit boundaries: Sentry SDK,
  observability sink, clock/timer, network, or filesystem where already
  locally patterned.
- Any `*.unit.test.ts` using fakes, spies, or injected collaborators must be
  renamed or refactored unless Phase 0 records why the test still qualifies as
  a pure unit proof under the strategy. New tests must not reproduce the
  misclassification.

### Acceptance Criteria

- Each new test fails for the current architectural reason, not because of
  missing fixtures or unrelated setup.
- The failure messages name release/startup boundary behaviour.
- Build identity RED tests prove the generated identity boundary exists,
  fails fast for the unknown sentinel, and supports local development without
  Sentry metadata.
- Existing release truth-table tests still cover production and preview
  attribution.
- At least one RED test proves the full local env-data to runtime-config to
  observability chain using injected data with deploy metadata omitted. It must
  not call a helper that performs filesystem/env-file IO unless that IO is
  injected and faked through a simple boundary fake.
- No new in-process test performs IO, reads `process.env`, mutates
  `process.env`, reads ambient env files, or calls `process.cwd()`.
- Phase 1 records the disposition of any standards-failing existing test it
  touches: fixed now, removed because it does not prove product behaviour, or
  moved to a named blocking follow-up that must close before this plan is
  considered complete.

## Phase 2: Boundary Implementation

**Goal**: make the tests pass by fixing ownership, not by hiding the symptom.

**Precondition**:
[`gate-recovery-cadence.plan.md`](gate-recovery-cadence.plan.md) must run
before Phase 2 GREEN implementation continues. The current RED slice introduced
missing-symbol and non-test gate failures; those must be converted into
typed, buildable seams or otherwise classified in the gate ledger before
implementation claims resume.

**Precondition status (2026-04-25)**:
[`gate-recovery-cadence.plan.md`](gate-recovery-cadence.plan.md) is complete
for the current branch state. Missing-symbol REDs have typed seams, focused
startup-boundary tests pass, and the non-test gates below pass:

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
pnpm build
pnpm depcruise
```

Post-resume gate recovery on 2026-04-25 fixed the WS3 lint/markdown residuals
that were blocking root gates, then repaired the remaining root `pnpm test`
residual in the search CLI observability contract. The refreshed focused and
root non-mutating gates below now pass:

```bash
pnpm lint
pnpm markdownlint-check:root
pnpm type-check
pnpm test
pnpm knip
pnpm depcruise
pnpm build
pnpm --filter @oaknational/sentry-node test
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:a11y
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub
```

Full repo gate confirmation now includes `pnpm check`, which passed after the
Phase 2 GREEN plan update and formatting/fix tail.

### Phase 2 GREEN state (2026-04-25)

Implemented and validated in the working tree:

- `@oaknational/sentry-node` off mode branches before Sentry release/Git SHA
  resolution; `SentryOffConfig` no longer carries `release` or `releaseSource`.
- HTTP and search CLI observability tolerate off-mode config without a Sentry
  release field while keeping stdout/app observability intact.
- Express Sentry error-handler registration is gated on explicit live
  `SENTRY_MODE=sentry`, not raw `SENTRY_MODE !== 'off'`.
- `resolveRelease` accepts canonical app build identity as Sentry projection
  input, validates the projected value as Sentry-safe, and uses Sentry context
  for the effective release environment.
- HTTP app version consumers are wired: response header middleware emits
  `x-app-version`, and the landing page meta tag consumes `RuntimeConfig.version`.
- Local dev and local stub env planning strip inherited deploy release metadata
  and production-branch labels (`VERCEL_ENV`, `VERCEL_GIT_COMMIT_REF`,
  `VERCEL_GIT_COMMIT_SHA`, `VERCEL_BRANCH_URL`, `SENTRY_RELEASE_OVERRIDE`).
- Pure seams now exist for app build identity, local-stub env preparation,
  app-version headers, and validated-env-to-runtime-config construction.
- Local no-auth/browser gates and local-stub smoke explicitly set
  `SENTRY_MODE=off` at their launch/env-preparation boundary. This keeps local
  gate startup from requiring deploy-only Sentry release metadata while
  preserving live `SENTRY_MODE=sentry` strictness.
- Playwright UI/a11y package scripts clear inherited `NO_COLOR` before
  launching Playwright, avoiding the Node `NO_COLOR`/`FORCE_COLOR` warning
  without changing product runtime configuration.
- Search CLI observability tests now match the separated contract: off mode
  exposes service/environment without a Sentry release; live Sentry mode
  exposes the validated Sentry release projection.
- Lane B implementation landed as commit `9ea3ccd8`
  (`fix(observability): decouple local startup from sentry release`). The
  parallel WS3 release-cancellation chunk landed separately as commit
  `2822e525` (`fix(mcp): relocate production cancellation gate`).

Remaining non-code follow-through:

- `RuntimeConfig` still carries `version` / `versionSource` rather than a
  first-class `AppBuildIdentity`. For the smallest gate-green slice, this is an
  intentional deferral: build identity remains the canonical app fact, Sentry
  remains a projection consumer, and replacing the public runtime config shape
  should happen only when the next architectural slice needs that stronger
  type.
- Reviewer dispatch was initially not claimed because the active tool policy
  only permits sub-agents when the owner explicitly authorises delegation. The
  owner has now authorised it; sentry, test, config, code, architecture, and
  docs/ADR reviewers have reported findings. This reintegration pass accepts
  the concrete blockers and either fixes them here or routes them below.
- Full `pnpm check` passed on 2026-04-25 before reviewer reintegration.
  After reintegration, the broad code gates listed in Phase 3 pass; aggregate
  `pnpm check` has not been rerun after the final handoff-only doc updates.
  The MD040 blocker was fixed via a platform-agnostic rule sidecar; root
  `pnpm markdownlint-check:root` now passes.

Reviewer-finding routing after owner authorization:

- Fixed in this pass: HTTP runtime env now includes `VERCEL_GIT_COMMIT_REF`;
  build-time Sentry env projection resolves `APP_VERSION` from
  `APP_VERSION_OVERRIDE` / root package version rather than trusting raw
  `process.env.APP_VERSION`; local no-auth launchers strip inherited
  `VERCEL_ENV` and `VERCEL_GIT_COMMIT_REF`; widget Playwright scripts clear
  `NO_COLOR`; the Search CLI ingest-harness test is no longer excluded.
- Proved in this pass: explicit env → `createRuntimeConfigFromValidatedEnv` →
  `createHttpObservability` production/main live Sentry chain; `/` app-version
  header + meta behavior through `createApp`.
- Routed to
  [`mcp-http-runtime-canonicalisation.plan.md`](../future/mcp-http-runtime-canonicalisation.plan.md):
  replacing `RuntimeConfig.version` / `versionSource` with first-class
  `RuntimeConfig.buildIdentity`, removing or renaming the public
  `HttpObservability.release` field, and replacing remaining smoke composition
  roots that necessarily mutate `process.env` before spawning.
- Routed as a standards follow-up before final branch closeout: remove the
  source-read assertion in
  `packages/core/build-metadata/tests/git-sha.unit.test.ts` or replace it with
  a behavioural test. It was not introduced by this slice, but reviewer
  coverage correctly identified it as a plan-scoped standards gap.

### Candidate implementation moves

The executor should choose the smallest code change that satisfies Phase 0
and Phase 1 evidence. Expected options include:

1. Move release resolution below the Sentry mode branch so off mode does not
   require Sentry release identity. Preserve app version/runtime metadata as a
   separate input and output concern.
2. Split runtime metadata from Sentry release identity if a shared shape is
   currently forcing optional runtime fields to behave like deploy
   preconditions.
3. Extract or reuse a local startup composition seam that accepts an explicit
   env object or injected env source and constructs runtime config plus
   observability without global env access or test-time IO. The seam must be
   production-owned; tests may call it with injected data or simple boundary
   fakes, but must not create a parallel app.
4. Route local smoke/UI/a11y startup through the same production app factory
   with explicit injected no-op or off-mode observability, rather than a
   bespoke test server.
5. If live or fixture Sentry modes need a local-development Sentry release
   value, centralise that value in the canonical release/observability package,
   with tests and docs, rather than per-gate env shims. Off mode must not use
   this as a hidden release requirement.
6. Replace smoke helper `process.env` mutation with explicit prepared env data
   or spawned process environment where the smoke boundary truly requires a
   process. Do not preserve the mutation path with compatibility wrappers.
7. Extract build identity resolution before finalising observability GREEN.
   The implementation may use an app-generated `.app-version.ts` module or a
   dedicated build-identity workspace, but the result must be a typed app
   identity consumed by runtime config. `resolveRelease` should consume that
   identity as input for Sentry's `release` projection rather than calculating
   app identity independently.
8. Propagate app build identity from runtime config to non-observability
   consumers: `x-app-version` response headers and HTML app-version metadata.
9. Remove or rename `HttpObservability.release`. If the observability public
   surface exposes identity, it must be named as app build identity and sourced
   from the build-identity boundary. It must not expose a mode-dependent value
   that sometimes means Sentry release and sometimes means app version.

### Acceptance Criteria

- `SENTRY_MODE=off` bootability matches the decision recorded in Phase 0.
- App version/runtime metadata remains available in local/off mode without
  forcing Sentry release identity or deploy-only metadata.
- Local smoke/UI/a11y startup does not require `VERCEL_GIT_COMMIT_SHA`.
- Production and preview Sentry release identifiers remain unchanged for
  ADR-163 truth-table rows.
- App version/build identity has one source of truth for this slice and is
  consumed by observability, HTML, API headers, and Sentry sink adapters without
  being owned by any of them. First-class `RuntimeConfig.buildIdentity` remains
  deliberately deferred to the future canonicalisation plan named above.
- Off-mode `HttpObservability` no longer exposes a release field. Live/fixture
  observability still expose the Sentry release for compatibility; removing or
  renaming that public field is deliberately deferred to the future
  canonicalisation plan named above.
- Observability remains always on: stdout OTel logging, local spans,
  correlation context, and app observability helpers still work when Sentry is
  disabled or unavailable.
- No new `process.env` reads or mutations appear in tests.
- No new IO appears in in-process tests.
- Existing relevant standards failures are fixed or have explicit closure
  ownership in a blocking follow-up. They are not normalised as test debt.
- No new duplicate release resolver or test-only MCP app composition is
  introduced.

## Phase 3: Documentation, Review, and Gates

**Goal**: ensure the repo's written contracts and executable gates agree.

### Documentation propagation

Update whichever surfaces Phase 0/2 prove are impacted:

- `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
- `docs/architecture/architectural-decisions/121-quality-gate-surfaces.md`
- `docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md`
- `docs/engineering/build-system.md`
- `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
- `docs/operations/sentry-deployment-runbook.md`
- `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md`
- `.agent/plans/observability/future/mcp-http-runtime-canonicalisation.plan.md`

Record a no-change rationale for any listed surface that is inspected but not
edited.

### Reviewer Scheduling

Owner authorization for sub-agent dispatch was granted after the initial
gate-green state. Findings are treated as Phase 3 reintegration inputs:

- `sentry-reviewer` — accepted the live-mode strictness shape but blocked on
  missing runtime `VERCEL_GIT_COMMIT_REF`.
- `test-reviewer` — required a full env → runtime config → observability proof
  and surfaced remaining standards follow-ups.
- `config-reviewer` — required removing the Search CLI ingest-harness test
  exclusion and clearing `NO_COLOR` for widget Playwright scripts.
- `architecture-reviewer-fred` — accepted `RuntimeConfig.buildIdentity`
  deferral for this slice, but required build-time Sentry env projection to use
  canonical app-version resolution.
- `docs-adr-reviewer` — required ADR/plan/continuity refresh and commit-hash
  placeholder consumption.
- `code-reviewer` — required local no-auth startup to strip inherited
  production branch metadata.

### Quality Gates

Run focused gates first:

```bash
pnpm --filter @oaknational/sentry-node test
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:a11y
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:stub
```

Also run targeted text checks after Phase 1/2 edits:

```bash
rg -n "process\\.env|readFileSync|writeFileSync|process\\.cwd\\(|spawn\\(|exec\\(|fork\\(" \
  packages/core/build-metadata packages/libs/sentry-node apps/oak-curriculum-mcp-streamable-http \
  --glob "*.test.ts" --glob "smoke-tests/**/*.ts"
```

Any hit must be classified as an allowed E2E/smoke boundary, removed, or
escalated as a standards failure. Do not treat the search as a substitute for
reading the tests.

Then run repo gates:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm markdownlint:root
pnpm check
```

If `pnpm check` fails for unrelated existing or parallel-track work, stop and
record the exact failing gate, evidence, and residual risk.

Reviewer reintegration validation completed on 2026-04-25:

- Focused HTTP/Sentry/build-metadata/search tests passed, including the new
  build-time Sentry projection proof and app-version header/meta proof.
- `pnpm type-check`, `pnpm lint`, `pnpm knip`, `pnpm test`, and `pnpm build`
  all passed.
- Targeted markdownlint over the changed observability/operator docs passed.
- `pnpm portability:check` passed after adding the sidecar
  markdown-code-block rule and platform adapters.
- `git diff --check` passed.
- `pnpm markdownlint-check:root` passed after the MD040 sidecar fix.
- Aggregate `pnpm check` is intentionally not claimed green because it was not
  rerun after the final handoff-only doc updates.

## Risk Register

| Risk | Mitigation |
|---|---|
| Weakening deploy release attribution while fixing local bootability | Keep ADR-163 truth-table tests green and require Sentry reviewer coverage. |
| Replacing one hidden source of truth with another | Phase 0 ownership matrix must name one source per concern before implementation. |
| Adding fake systems for tests | Allow only injected boundary doubles; forbid duplicate app composition and duplicate release resolvers. |
| Fixing gates by adding env shims | Non-goal explicitly forbids global fake Vercel SHA as the primary fix. |
| New tests pass while real local startup still fails | Add the full-chain injected-data proof from local env data to runtime config to `createHttpObservability`, then run smoke/UI/a11y gates. |
| Existing standards failures get normalised as legacy debt | Phase 0 classifies them as critical standards failures and Phase 2/3 require fix or named closure ownership. |
| In-process tests perform IO while still passing locally | Phase 1 bans IO in every imported-code test regardless of filename, and the targeted text check must be dispositioned before closure. |
| Documentation drift after code fix | Phase 3 requires ADR/docs inspection with edit or no-change rationale. |

## Learning Loop

After completion, run the documentation consolidation workflow or record a
deliberate no-change rationale. Any generalised pattern should be promoted to
`.agent/memory/active/patterns/`, especially if the resolution clarifies
"observability off means no deploy metadata", "local gate preconditions", or
"production composition reused with injected boundaries".
