---
name: "HTTP MCP Test Suite Improvements"
overview: >
  Follow-on quality improvements to the @oaknational/oak-curriculum-mcp-streamable-http
  test suite, identified during the 2026-05-21 header-redaction.e2e deletion +
  HTTP parser flake investigation. Excludes the three architectural fixes
  already landed in that session.
todos:
  - id: cycle-1-built-server-immediate-fail-assertions
    content: >
      Cycle 1: Replace built-server.e2e.test.ts toBeLessThan(400) /
      toBeLessThan(500) immediate-fail assertions with concrete status +
      SSE envelope checks. One commit, tree green.
    status: pending
  - id: cycle-2-auth-enforcement-audit-shaped-duplicates
    content: >
      Cycle 2: Delete duplicate 401-without-auth tests in
      auth-enforcement.e2e.test.ts §"All Tools Require HTTP Auth". The
      Discovery Methods block already proves the contract; per-tool
      repeats are audit-shaped duplicates. One commit, tree green.
    status: pending
  - id: cycle-3-correlation-header-pushdown
    content: >
      Cycle 3: Move correlation-header E2E coverage down to
      middleware-level integration tests in
      src/correlation/middleware.integration.test.ts. Delete the redundant
      e2e assertions that survive only because supertest was the closest
      tool to hand. One commit, tree green.
    status: pending
  - id: cycle-4-validation-failure-pushdown
    content: >
      Cycle 4: Move enum-validation and validation-failure subjects from
      e2e to integration tests at the validation layer. Zod schemas are
      pure; the proof level is the validator, not the wired Express
      stack. One commit, tree green.
    status: pending
  - id: cycle-5-auth-bypass-and-enforcement-pushdown
    content: >
      Cycle 5: Move auth-bypass and auth-enforcement core assertions to
      middleware-level integration tests. Keep one full-app e2e per side
      to prove composition; everything else is middleware integration.
      One commit, tree green.
    status: pending
  - id: cycle-6-out-of-process-e2e-shape-decision
    content: >
      Cycle 6: Decide whether a genuine out-of-process E2E is needed for
      the HTTP MCP server (spawn built binary, drive over HTTP). Output
      is either an out-of-process e2e cycle landing in this plan or a
      recorded "no — supertest in-process is the right level for this
      server" verdict with rationale. Plan-text-only or one commit
      depending on verdict.
    status: pending
  - id: cycle-7-eliminate-appid-from-product-code
    content: >
      Cycle 7: Eliminate the diagnostic appId concept from product code
      entirely. It exists only because tests create multiple apps;
      production never does. Replace with correlation-id-only diagnostics
      and remove the module-encapsulated counter introduced as a stopgap
      on 2026-05-21. One commit, tree green.
    status: pending
  - id: phase-final-security-confirmation
    content: >
      Phase final: security-expert confirmation pass on repeated
      wrapMcpServerWithSentry invocations under SENTRY_MODE=off. Goal is
      a recorded verdict that no global Sentry handler-ref accumulates
      across the per-request McpServer construction path. No code
      change expected; if a defect is found, open a separate cycle.
    status: pending
---

# HTTP MCP Test Suite Improvements

**Last Updated**: 2026-05-21
**Status**: 🟡 PLANNING
**Scope**: Test-quality follow-ons in `apps/oak-curriculum-mcp-streamable-http`
after the 2026-05-21 header-redaction.e2e deletion and parser-flake investigation.

## Context

On 2026-05-21 (session: Sunlit Weaving Aurora) we deleted
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/header-redaction.e2e.test.ts`
because its per-test comments admitted it could not verify redaction; the
real proof was already at unit level (`src/logging/header-redaction.unit.test.ts`,
503 lines). The deletion exposed an intermittent
`Parse Error: Expected HTTP/, RTSP/ or ICE/` under aggregate `pnpm check` load.
That investigation identified three architectural defects which landed in
the same session and are NOT in scope for this plan:

1. Dead `createMcpReadinessMiddleware` racing a leaked `setTimeout` against
   a `Promise.resolve()` — deleted.
2. Module-level `let appCounter = 0` in `application.ts` — encapsulated as
   private counter in `bootstrap-helpers.ts`.
3. `rateLimiterFactory` optional injection in `CreateAppOptions` — made
   required; production and test callsites updated to inject explicitly.

This plan covers the remaining findings from that session's `test-expert`
and `code-expert` reviews, none of which were architectural defects but
each of which improves the test suite's signal-to-noise ratio and
disproportionality.

### Issue 1: Immediate-fail assertions in built-server.e2e.test.ts

`toBeLessThan(400)` and `toBeLessThan(500)` constrain nothing operationally
useful — a 399 redirect passes, a 299 partial-content passes. The test
named protocol acceptance but asserts on the lower half of a 100-range.
**Root cause**: assertions written to make the test pass once, not to
describe a system state.

### Issue 2: Audit-shaped 401 duplicates in auth-enforcement.e2e.test.ts

§"All Tools Require HTTP Auth" repeats the same 401-without-auth
assertion across multiple per-tool variants. The Discovery Methods
describe block already proves the contract at the routing layer; the
repeats derive mechanically and survive a refactor in lockstep with the
behaviour they ratify. **Root cause**: audit-shaped tests added to bump
coverage of a contract that is already proven once at the right level.

### Issue 3: Disproportionate full-app cost for middleware-level subjects

Several e2e files mount the entire Express composition (Clerk no-op,
rate limiter factory, observability, OAuth proxy, MCP routes, asset
download proxy) to assert on a single middleware's behaviour:

- correlation-header presence (a single middleware in
  `src/correlation/middleware.ts`)
- validation-failure paths (a Zod schema applied at the boundary)
- auth-bypass / auth-enforcement (a small middleware chain)

Each costs a full `createApp` per test. The directive's right level for
single-middleware behaviour is integration (mounted on a minimal Express
stack) or unit (called directly with fake req/res), not full-app e2e.
**Root cause**: the e2e shape was the closest tool to hand when the
tests were authored; nothing forces the proportional level today.

### Issue 4: Possibly missing genuine out-of-process E2E

The directive's E2E definition (`testing-strategy.md`) allows
in-process supertest as a valid runner harness for HTTP-transport
systems: *"the runner harness boots the system"*. So the existing
supertest-based `*.e2e.test.ts` files ARE correctly classified. But
that leaves a separate question: is there value in an additional
out-of-process E2E that spawns the built binary and drives it over
real HTTP from a separate process? The answer may be no (CI cost,
duplicate coverage) but the question deserves an explicit verdict.

### Issue 5: appId concept is a test-shape artefact

The diagnostic `appId` flows through ~15 product-code call sites as a
typed parameter. In production the counter is always 1; the concept
exists only because tests construct multiple apps per worker. The
2026-05-21 fix encapsulated the counter inside `bootstrap-helpers.ts`
but did not address the underlying observation: **product code is
shaped around a test-only concern**. The cleaner architectural shape
is to remove the concept entirely from product code and rely on the
correlation-id for per-request diagnostic identity.

### Issue 6: Repeated wrapMcpServerWithSentry under SENTRY_MODE=off

`core-endpoints.ts:98` calls `wrapMcpServerWithSentry(server)` on
every MCP request. The SDK comment claims it is inert when
`Sentry.init()` was never called. Under aggregate test load with
`SENTRY_MODE: 'off'` this means thousands of inert wrap calls per
test process. Code-expert flagged this for `security-expert`
confirmation that no global Sentry state accumulates.

---

## Quality Gate Strategy

Each cycle runs the focused command set during work, then the
workspace gate at landing, then `pnpm check` from repo root at plan
close. See [`components/quality-gates.md`](../../templates/components/quality-gates.md).

### After each cycle

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

### Final aggregate gate

```bash
pnpm check
```

---

## Solution Architecture

### Principle

From `.agent/directives/testing-strategy.md`:

> "Each test must prove something useful about the product code. If a
> test is only testing the test or mocks, delete it." (§Rules)
>
> "Each proof should happen ONCE — repeated proofs are fragile and
> waste resources." (§Philosophy)
>
> "Prefer unit tests over integration tests. Prefer integration tests
> over E2E tests." (§Philosophy)

### Key Insight

The supertest pattern is a valid e2e runner harness for HTTP transport
per the directive's behaviour-shape rule. The question is not
*classification* (it is correctly classified) but *proportionality* —
how many subjects deserve the full-app cost when the proof level is
lower.

### Strategy

Push each subject to the lowest level that proves it. Where multiple
subjects collapse into a single integration test (e.g. middleware
composition validation), do so. Delete tests that ratify what another
test already proves at the right level. Keep one well-shaped e2e per
composition-level concern (OAuth proxy / self-origin, MCP tools/list
parity assembled from the SDK contract); push everything else down.

**Non-Goals (YAGNI)**

- ❌ Reclassifying existing `*.e2e.test.ts` files as
  `*.integration.test.ts`. The classification is correct; the shape
  some of them carry is not.
- ❌ Hoisting `createApp` to `beforeAll` to reduce churn. The
  architectural defects driving churn were already cured in the
  2026-05-21 session; pushing subjects down removes the churn at root.
- ❌ Disabling rules, retries, or pool/concurrency narrowing.
- ❌ Adding `*.supertest.test.ts` or any new test category.
- ❌ Building a comprehensive "test pyramid" rebalance across the
  whole workspace; this plan is scoped to subjects identified in the
  2026-05-21 review.

---

## Cycles

### Cycle 1: built-server immediate-fail assertions

**Subject**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/built-server.e2e.test.ts`

Replace `toBeLessThan(400)` and `toBeLessThan(500)` with the concrete
status the route is contracted to return (200 with SSE envelope for the
`/mcp` initialise call) plus a payload-shape assertion. The test should
fail if the route returns 201 or 204 too; "less than 400" is not the
contract.

**Acceptance**: assertions name a single status and an envelope-shape
predicate. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e`
green.

### Cycle 2: auth-enforcement audit-shaped 401 duplicates

**Subject**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`
§"All Tools Require HTTP Auth" (≈lines 466–505 at 2026-05-21).

Delete the per-tool 401 repetitions. The Discovery Methods block
proves "the auth middleware fires for protected routes" once; tooling
this against `get-changelog` and `get-rate-limit` separately is audit
shape. If concern remains that some tool is silently exempt, add a
single integration assertion that the middleware is mounted on every
`/mcp` POST path.

**Acceptance**: file shrinks; remaining tests describe a system state
each; suite green.

### Cycle 3: correlation-header pushdown

**Subject**: correlation header coverage currently spread across e2e
files.

Add the missing assertions to
`src/correlation/middleware.integration.test.ts` (one mounted middleware
on a thin Express app, supertest against it). Remove the duplicate
assertions from full-app e2e files where they survive only because
supertest was convenient at authoring time.

**Acceptance**: integration tests prove the X-Correlation-ID header
behaviour at the middleware level; full-app e2e files lose the
duplicates; suite green.

### Cycle 4: validation-failure pushdown

**Subject**: `validation-failure.e2e.test.ts`,
`enum-validation-failure.e2e.test.ts`, `string-args-normalisation.e2e.test.ts`.

Validation logic is a pure Zod schema applied to input at the request
boundary. The proof level is the validator itself or the validator
mounted on a thin route — not the whole composition. Move the
behavioural proofs down. Delete the full-app variants once the lower
level holds the proof.

**Acceptance**: validation proofs live at the lowest level where they
can be expressed faithfully; suite green.

### Cycle 5: auth-bypass / auth-enforcement core pushdown

**Subject**: `auth-bypass.e2e.test.ts`, `auth-enforcement.e2e.test.ts`.

Keep one e2e on each side that proves "the composition wires the auth
middleware correctly with `dangerouslyDisableAuth` vs without."
Everything else (per-route 401 behaviour, response shape, Clerk
no-op interaction) moves to middleware-level integration tests.

**Acceptance**: the composition proof remains; middleware proofs move
down; suite green.

### Cycle 6: out-of-process E2E shape decision

**Subject**: Plan-level decision, possibly producing a new test file.

Decide whether a genuine out-of-process E2E for the HTTP MCP server is
worth adding. Inputs:

- Existing in-process e2e suite already exchanges real HTTP framing
  via supertest's ephemeral listener.
- Adding an out-of-process e2e means spawning `dist/index.js`, waiting
  for the listener, driving over HTTP, and tearing down. CI cost.
- The directive's MCP STDIO emphasis suggests out-of-process is the
  canonical shape, but HTTP MCP's natural harness is the same-process
  `app.listen()`.

Output: either a new minimal out-of-process E2E (the runner harness
spawns the binary, the test drives one round-trip) or a recorded
verdict "no — supertest is the right level for this server" with
rationale in this plan.

**Acceptance**: explicit verdict recorded; if landing a test, suite
green.

### Cycle 7: eliminate appId from product code

**Subject**: `apps/oak-curriculum-mcp-streamable-http/src/` —
~15 product-code call sites carrying `appId: number`.

The 2026-05-21 fix encapsulated the counter in `bootstrap-helpers.ts`
as a stopgap. The proper architectural cure is to remove the concept
entirely. The correlation-id provides per-request identity in logs;
diagnostic spans can use it instead of `appId`. Tests that construct
multiple apps can carry their own diagnostic identity if they need to
disambiguate (a test concern, not product code's).

Steps:

1. Remove `appId` parameter from `runBootstrapPhase`,
   `runAsyncBootstrapPhase`, `logBootstrapComplete`, `logRegisteredRoutes`,
   `initializeAppInstance`, security/orchestration phase signatures, and
   `ExpressWithAppId`.
2. Remove `let appInstanceCounter` from `bootstrap-helpers.ts`.
3. Replace any log context fields and OTel attributes (`oak.bootstrap.app_id`)
   with the correlation id or remove if redundant.

**Acceptance**: no module-level mutable counter remains; bootstrap logs
still distinguish concurrent app constructions in tests (via test-owned
diagnostic ids); suite green.

### Phase final: security-expert confirmation

**Subject**: `wrapMcpServerWithSentry` call shape under SENTRY_MODE=off.

`core-endpoints.ts:98` wraps every per-request `McpServer` construction.
Confirm with `security-expert` that the SDK does not accumulate global
state when `Sentry.init()` was never called. If a defect is found,
open a separate cycle; otherwise record the verdict.

**Acceptance**: recorded verdict in this plan or a new defect-fix
cycle opened.

---

## Build-vs-Buy Attestation

Not applicable — purely internal test-quality work.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution per cycle**: assumptions-expert for proportionality
  ratification on cycles 3–5 (pushdown decisions).
- **During each cycle**: test-expert and code-expert reviewers per
  the `invoke-code-experts` rule.
- **Cycle 7 specifically**: type-expert and architecture-expert (one
  of barney/betty/fred — touches structural boundaries).
- **Phase final**: security-expert for the Sentry wrap confirmation;
  docs-adr-expert if any ADR drift surfaces from cycle 7.

---

## Foundation Document Commitment

Before beginning work and at the start of each cycle:

1. Re-read `.agent/directives/principles.md`.
2. Re-read `.agent/directives/testing-strategy.md`.
3. Re-read `.agent/directives/schema-first-execution.md`.
4. Ask: "Does this deliver system-level value, not just fix the test?"
5. Verify: no compatibility layers, no type shortcuts, no disabled
   checks.

---

## Plan-Body First-Principles Check

Fires before each cycle per `.agent/rules/plan-body-first-principles-check.md`.
For cycles 3–5 (pushdown), the check must ratify that the lower level
genuinely proves the subject — if it does not, the e2e variant is the
right level after all and the cycle does not land. For cycle 7,
the check must ratify that removing `appId` does not erase a
production diagnostic signal (it does not — production has one app
per process and the counter is always 1).

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pushdown loses a real composition signal | Low | Medium | Keep one e2e per composition concern in cycles 3–5 |
| Cycle 7 removes a diagnostic that proves useful in prod debugging | Low | Low | Correlation-id is the per-request diagnostic; appId in prod was always 1 |
| Out-of-process E2E in cycle 6 introduces a CI flake | Medium | Low | Cycle 6 explicitly may resolve with a "no" verdict |
| Cycles overlap with Charcoal Searing Ember's parallel planning work | Medium | Low | Coordinate via comms before promoting to active/ |

---

## Lifecycle Trigger Commitment

Per `lifecycle-triggers.md`: each cycle is a non-trivial multi-file
change; register active areas before edits, close own claims at
session-handoff, and run lifecycle touch points at cycle land.

---

## Documentation Propagation Commitment

Each cycle examines whether ADR-119, ADR-124, or
`practice.md` are impacted. Cycle 7 specifically may need an ADR
note that diagnostic per-app identity is provided by correlation-id
rather than a separate counter.

---

## Source Material

- Deletion commit: `ab0dac3f` `test(http-mcp): delete header-redaction e2e - proves nothing about redaction`
- Investigation cycle commit (this session, after this plan): the
  three architectural fixes already-landed.
- Test-expert review: agentId `a7b66b32ca44df2e8`, session
  2026-05-21 Sunlit Weaving Aurora.
- Code-expert review: agentId `a2245c63224d1fbe5`, session
  2026-05-21 Sunlit Weaving Aurora.
- Prior flake evidence:
  `.agent/plans/agent-tooling/current/cost-of-collaboration.flaky-tests.md`
  (now obsolete for the parser-error row; the root cause is cured in
  this session's commits).

---

## First Question

**Could it be simpler?**

Yes — the simpler shape is "delete the disproportionate tests; move
what they were trying to prove to the right level." That is exactly
the plan. There is no compatibility shim, no parallel test category,
no concurrency knob. Each cycle removes more than it adds.
