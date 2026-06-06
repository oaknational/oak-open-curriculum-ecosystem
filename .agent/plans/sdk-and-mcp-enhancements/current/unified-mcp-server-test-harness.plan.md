---
name: "Unified MCP Server Test Estate — built-server smoke harness + e2e rebalance"
overview: >
  ONE plan that replaces the fragmented MCP-server test estate. Headline value:
  a smoke harness that spawns the BUILT server (dist) and drives it with a real MCP
  SDK client over real streamable-HTTP transport, exercising REAL tools (real Oak
  API, real Elasticsearch, real EEF corpus) to prove "does the built server actually
  work" — auth off (non-prod), Sentry sink off by default (configurable), telemetry
  validated post-release from live data. It is the vehicle for EEF D7. The plan also
  REPLACES the superseded manual harness scripts (server-harness.ts / run-requests.ts
  / prod:harness — half-baked: source-not-built, hand-rolled-not-SDK-client) and
  SUBSUMES http-mcp-test-suite-improvements.plan.md (the network-free e2e-suite
  rebalance to lowest faithful level). Two internally-independent tracks — smoke
  (real IO, on-demand) and e2e rebalance (network-free, CI) — under one consolidated
  plan, per the "replace the myriad half-plans with a single plan" brief.
status: planning
supersedes:
  - .agent/plans/sdk-and-mcp-enhancements/current/http-mcp-test-suite-improvements.plan.md
todos:
  - id: ws0-smoke-harness-foundation
    content: >
      WS0 (Track A — smoke): build the smoke harness module + a vitest smoke config
      that spawns the BUILT server through its real entry (start-server.sh shape:
      node --import @sentry/node/preload dist/index.js) once, with REAL tools (no
      stub flag), auth off (DANGEROUSLY_DISABLE_AUTH=true, valid non-prod), the real
      workspace .env.local credentials, Sentry sink off by default but CONFIGURABLE,
      and a pre-selected free port (bind :0 / read address().port / close / pass
      PORT=n — server-runtime.ts logs the configured port, so PORT=0 is undiscoverable
      across the spawn). The smoke config must NOT load the no-network E2E setup
      (smoke wants real network). Expose a real MCP SDK Client
      (StreamableHTTPClientTransport) + a raw-HTTP surface. RED: first smoke test —
      built server boots → initialize → listTools returns the real tool surface.
    status: pending
    depends_on: []
  - id: ws1-eef-d7-round-trip
    content: >
      WS1 (Track A — = EEF D7): the teacher-value round trip on the smoke harness,
      per the EEF master plan §D7. EEF flag on, Sentry off, real tools: drive the
      real Oak curriculum tools to surface a pedagogical signal, query the real EEF
      tool, assert the known strand's exact corpus values (caveat/strength/cost/
      impact) appear VERBATIM in structuredContent (independent ground truth via the
      typed raw/graph-native chain), assert non-claim language and graceful collapse
      on a floor-only/Insufficient strand. Telemetry NOT asserted here — validated
      post-release from live Sentry data. depends_on: WS0 + EEF D6 (surface must
      exist); WS0 itself is EEF-independent and parallelises with EEF D6.
    status: pending
    depends_on: [ws0-smoke-harness-foundation]
  - id: ws2-delete-superseded-manual-harness
    content: >
      WS2 (Track A — replace-don't-bridge): delete scripts/server-harness.ts,
      scripts/run-requests.ts and the prod:harness / prod:requests / prod:diagnostics
      package scripts — the half-baked manual harness the smoke harness replaces (it
      ran SOURCE not built, and hand-rolled JSON-RPC instead of the SDK client).
      Verify no references remain (rg "prod:harness|run-requests|server-harness").
      Eliminate any diagnostic concept that existed only for those scripts.
    status: pending
    depends_on: [ws0-smoke-harness-foundation]
  - id: ws3-rebalance-existing-e2e-suite
    content: >
      WS3 (Track B — network-free e2e, CI; subsumes http-mcp-test-suite-improvements):
      rebalance the existing 19-file e2e suite to its lowest faithful level per the
      Disposition Ledger — push auth-enforcement/bypass per-route detail, Zod
      validation, and correlation-header proofs down to integration/unit; consolidate
      the near-identical live-executor formatting tests; keep one composition e2e per
      auth side. Consolidate the four spin-up flavours (createStubbedHttpApp /
      createLiveHttpApp / inline createApp / app.listen(0)) into one in-process
      bring-up helper. Each migration is refactoring-TDD (existing tests are the
      safety net; delete the old test in the same commit its lower replacement
      greens). Network-free; stays in pnpm check. Independent of WS0–WS2.
    status: pending
    depends_on: []
  - id: ws4-docs-target-and-directive
    content: >
      WS4 (docs): wire the smoke target as an on-demand script (package.json smoke:*),
      explicitly NOT in pnpm check (real IO is smoke, not network-free CI per
      ADR-161); document local + preview runs; update the e2e-tests/workspace README
      (describe both tracks; correct the phantom header-redaction.e2e.test.ts entry);
      correct the stale testing-strategy.md System definition (line 149: "stdio
      transport" — ADR-128 retired the stdio workspace; the system under test is the
      HTTP MCP server).
    status: pending
    depends_on: [ws2-delete-superseded-manual-harness, ws3-rebalance-existing-e2e-suite]
---

# Unified MCP Server Test Estate

**Last Updated**: 2026-06-06
**Status**: 🟡 PLANNING (execution gated — see Execution Preconditions)
**Collection**: `sdk-and-mcp-enhancements`
**Workspace**: `apps/oak-curriculum-mcp-streamable-http`
**Supersedes**: `http-mcp-test-suite-improvements.plan.md` (absorbs its e2e-rebalance
cycles into Track B); **replaces** the manual `prod:harness` scripts (WS2)

## End Goal (User Impact)

One consolidated test estate for the MCP server, replacing the myriad half-plans and
the half-baked manual scripts. Its headline value is a **smoke harness** that proves
the **built artifact actually works** with **real behaviour** — real tools, real
downstream, real MCP client over real transport — the enhanced value proof that does
not exist today. It is the vehicle for **EEF D7**. The existing network-free e2e
suite is rebalanced to its lowest faithful level in the same plan, and the
superseded manual scripts are deleted.

## Mechanism (Why the Named Means Produce the Outcome)

1. **One plan replaces the fragments.** The brief is consolidation: the smoke
   harness, the script deletion, and the e2e rebalance are one estate, owned by one
   plan (`replace-don't-bridge`, "no legacy surfaces"). Two *internally-independent
   tracks* keep execution un-coupled without fragmenting the estate.
2. **Real behaviour = smoke.** Validating the built server with real tools is a
   SMOKE test by the taxonomy (testing-strategy: smoke = running system, all IO, no
   mocks). Stubs would prove plumbing, not behaviour. Smoke is on-demand, NOT the
   network-free CI path (ADR-161) — so no E2E-boundary amendment is needed.
3. **The old harness is replaced, not preserved.** `server-harness.ts` (ran source,
   not built) + `run-requests.ts` (hand-rolled JSON-RPC) are a half-baked smoke
   harness; the real SDK-client-on-built-server harness supersedes them, so they are
   deleted (`replace-don't-bridge`, "delete dead code").
4. **Each proof once, at the lowest faithful level.** The existing e2e suite over-
   proves at e2e level; Track B pushes those proofs down (the subsumed
   http-mcp-test-suite-improvements work). The smoke proof is irreducible (cannot be
   done lower — it needs the built artifact + real deps).

## Grounded Current State (2026-06-06)

- **Smoke is the correct category** (testing-strategy:202-204): running system, all
  IO, no mocks; "smoke composition roots only" may read ambient env (real creds).
  E2E (network-free, CI) and integration (DI fakes) are the other levels.
- **The server is streamable-HTTP only**; no stdio. SDK-client precedent:
  `e2e-tests/mcp-app-composition.e2e.test.ts` (in-process, stubbed — a network-free
  e2e, a different level from the smoke harness).
- **19 e2e files, all in-process against source** (network-free). The four spin-up
  flavours (`createStubbedHttpApp`, `createLiveHttpApp`, inline `createApp`,
  `app.listen(0)`) are consolidation targets (Track B).
- **The half-baked manual harness exists**: `scripts/server-harness.ts` (docstring:
  "rather than dynamically loading the built deploy bundle" — runs SOURCE),
  `scripts/run-requests.ts` (hand-rolled JSON-RPC, 3 scenarios), `prod:harness` /
  `prod:requests` / `prod:diagnostics`. Superseded by the smoke harness → deleted
  (WS2).
- **Auth-off + real tools are flags**: `dangerouslyDisableAuth` (hard-fails in prod,
  `env.ts:77-89`; valid non-prod); `useStubTools` left OFF (real tools). The built
  server reads the real `.env.local` at startup (`runtime-config.ts:37`) — correct
  for a smoke run.
- **`PORT=0` is undiscoverable across the spawn** (`server-runtime.ts:38` logs the
  configured port; no `address()` exposed) → globalSetup pre-selects a free port.
- **Telemetry is Sentry-coupled today** (`http-observability.ts:152-154`); EEF
  telemetry is validated post-release from live Sentry data, not in the harness.
  The vendor-neutral decoupling is a separate, NON-blocking plan
  ([`observability-sinks-decoupling.plan.md`](../../observability/current/observability-sinks-decoupling.plan.md)).
- **EEF D7 is already specified as an MCP-client SDK e2e flow** (EEF master plan
  §D7) — this harness is that flow's vehicle.
- **`test:e2e` is already in `pnpm check`** (`dependsOn build`) — the network-free
  rebalance track stays there; the smoke track does not.

## Disposition Ledger (every e2e file + script gets a recorded decision)

Thoroughness = every item has a recorded decision (not every item a cycle).
Re-derive at execution (concurrent changes move lines).

| Artifact | Disposition | Track / WS |
|----------|-------------|-----------|
| `scripts/server-harness.ts` | **Delete** — superseded (ran source, not built) | A / WS2 |
| `scripts/run-requests.ts` | **Delete** — superseded (hand-rolled JSON-RPC) | A / WS2 |
| `prod:harness` / `prod:requests` / `prod:diagnostics` | **Delete** from `package.json` | A / WS2 |
| `mcp-app-composition.e2e.test.ts` | Keep as network-free composition e2e (rebalance only if a proof duplicates a lower level) | B / WS3 |
| `auth-enforcement.e2e.test.ts` | Keep ONE auth-ON composition e2e; per-tool 401 repeats → middleware integration | B / WS3 |
| `auth-bypass.e2e.test.ts` / `application-routing.e2e.test.ts` | Keep one composition proof per side; per-route 401 + correlation-header → integration | B / WS3 |
| `enum-validation-failure` / `validation-failure` / `string-args-normalisation` (rejections) | Push to validator integration/unit | B / WS3 |
| `live-mode` / `tool-call-success` / `string-args` success | Consolidate into ONE in-process live-executor test (protocol-level assert) | B / WS3 |
| `server.e2e` / `stub-mode` / `prompts` / `documentation-resources` / `multi-request-session` / `ws3-fallback-proof` / `mcp-app-pipeline` | Keep at network-free e2e; rebalance any duplicated proof down | B / WS3 |
| `web-security-selective.e2e.test.ts` | CORS/DNS-rebind/Helmet at the faithful level; fix its createApp-under-e2e-name mismatch | B / WS3 |
| `built-server.e2e.test.ts` | **Delete** — misnamed in-process; its intent is realised by the real smoke harness | B / WS3 |
| `vercel-ignore-runtime.e2e.test.ts` | **Keep as-is** — git-capability test, out of scope | — |
| `helpers/create-stubbed-http-app.ts` / `create-live-http-app.ts` | Consolidate into one in-process bring-up helper | B / WS3 |
| EEF real-behaviour round trip | **New** smoke test on the harness (= EEF D7) | A / WS1 |
| Built-server-boots real-tool surface | **New** smoke test | A / WS0 |

No item dropped without a named home. Cycle rule: delete an old test only in the
same commit its replacement greens.

## Workstreams

Two independent tracks under one plan. **Track A (smoke)**: WS0 → WS1, plus WS2
(delete old scripts). **Track B (e2e rebalance, network-free)**: WS3. WS4 docs.
Tracks A and B do not block each other.

- **WS0 — smoke harness foundation** (Track A). Spawn the built server (real entry,
  real tools, auth-off, real creds, Sentry off-configurable, pre-selected port);
  smoke vitest config WITHOUT the no-network setup; SDK client + raw-HTTP surfaces.
  **First-principles check**: spawn the real built entry, interact only over the
  socket — not re-assembled via `createApp` (that tests modules through a rig).
- **WS1 (= EEF D7)** (Track A). The round trip on the smoke harness; behaviour
  assertions only (verbatim corpus values, structuredContent, non-claim, graceful
  collapse, multi-signal); telemetry post-release. Depends on EEF D6.
- **WS2 — delete the superseded manual harness** (Track A). `replace-don't-bridge`.
- **WS3 — rebalance the existing e2e suite** (Track B). Per the ledger; refactoring-
  TDD; network-free; subsumes http-mcp-test-suite-improvements.
- **WS4 — docs + directive**. Smoke target wiring (NOT in `pnpm check`); README;
  correct the stale `testing-strategy.md` System definition.

## Non-Goals (YAGNI)

- ❌ Running the **smoke** track in network-free CI `pnpm check` (real IO is smoke,
  ADR-161). It is on-demand / local / preview.
- ❌ Stub tools in the smoke harness. Real behaviour only.
- ❌ In-harness telemetry assertion. EEF telemetry is validated post-release from
  live Sentry data; the vendor-neutral capture path is a separate, non-blocking plan.
- ❌ Any E2E-boundary (ADR-161) amendment. Smoke is already permitted.
- ❌ Deleting the network-free e2e suite. It is a valid level (DI fakes per
  testing-strategy); it is rebalanced, not removed.
- ❌ Vercel-runtime fidelity (local-built ≠ Vercel edge entry). A preview-deploy
  smoke is a future follow-on.

## Quality Gate Strategy

Per [`components/quality-gates.md`](../../templates/components/quality-gates.md).
Per cycle: workspace `type-check` + `lint` + the relevant suite. Track B stays in
`pnpm check` (`test:e2e`). The smoke target is on-demand (NOT in `pnpm check`).
Final: `pnpm check` green + a successful on-demand smoke run.

## Proof Contract for Completion Claims

| Workstream | Acceptance id | Proof level | Proof |
|------------|---------------|-------------|-------|
| WS0 | built-server-boots-real | smoke | smoke run: built server boots, initialize + real listTools; one spawned PID; clean teardown |
| WS1 | eef-d7-round-trip | smoke (value-proxy) | EEF flag on, Sentry off: verbatim corpus values in structuredContent vs independent ground truth; non-claim + graceful-collapse |
| WS2 | manual-harness-deleted | non-code | `rg "prod:harness\|run-requests\|server-harness"` clean; `pnpm check` green |
| WS3 | e2e-rebalanced | integration/unit + e2e | each pushed-down proof green at its lower level; e2e duplicates deleted in the same commit; suite green |
| WS4 | docs-target-directive | non-code | `smoke:*` not in `pnpm check`; README + System-def diffs; markdownlint/format green |

Telemetry is proven post-release (live Sentry), not by an acceptance id here.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Smoke flakiness from real downstream | Medium | Medium | On-demand (not CI-gating); bounded health-check; retries at the runner only |
| Coverage lost during Track B rebalance | Low | High | Disposition ledger + delete-only-after-replacement-green |
| EEF D7 (WS1) depends on EEF D6 | Known | Medium | WS1 `depends_on` D6; WS0 EEF-independent + parallel with D6 |
| Local-built ≠ Vercel | Known | Medium | Explicit Non-Goal; preview-deploy smoke is a follow-on |
| Supersession races parallel planning (Charcoal Searing Ember note in old plan) | Medium | Low | Comms check before activating; old plan is `current/`, not `active/` |

## Foundation Alignment

- **principles.md** — `replace-don't-bridge` (delete the old scripts; one plan
  replaces the fragments); "no legacy surfaces"; "delete dead code"; First Question
  (simpler without compromising value).
- **testing-strategy.md / ADR-161** — smoke = full IO, on-demand, NOT PR-check;
  e2e/integration network-free in CI; each proof once at the lowest faithful level.
- **schema-first-execution.md** — SDK-client typed surface; EEF structuredContent
  asserted against the typed corpus chain.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):

- **WS0 (landing-path/vendor-literal)**: the harness spawns the real `dist` entry,
  talks only over the socket; verify MCP SDK client call shapes against installed
  `@modelcontextprotocol/sdk ^1.29.0`.
- **WS1 (shape)**: D7 asserts a system state (verbatim teacher-facing values);
  telemetry explicitly out of in-harness scope.
- **WS3 (shape)**: each pushdown confirms the lower level genuinely proves the
  subject; if not, the e2e variant is the right level and the row stays.

## Readiness Reviewers (before DECISION-COMPLETE)

- **assumptions-expert** — proportionality + that the consolidation is clean (one
  plan, independent tracks, old surfaces deleted not lingering).
- **mcp-expert** — SDK client usage + protocol surface.
- **test-expert** — Track B refactoring-TDD + delete-after-green; the smoke vs
  network-free level boundaries.
- **code-expert / config-expert** — the harness module + the smoke vitest config
  (no no-network setup; not wired to `pnpm check`).
- **security-expert** — auth-off spawn ships no production bypass (prod guard at
  `env.ts:77-89` holds); real-cred handling in a smoke run.

## Execution Preconditions

Execution starts when the owner schedules it. WS0/WS2/WS3 are EEF-independent
(WS0/WS3 may start now; WS3 stays network-free in CI). WS1 (= D7) depends on EEF D6
landing. Before moving to `active/`, comms-check for claims on the old plan / the
test tree (the old plan flagged parallel planning by Charcoal Searing Ember).

## Lifecycle Triggers

Per [`components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
register active areas before edits (the test tree, `scripts/`, `package.json`); run
lifecycle touch points at each cycle land.

## Learning Loop

On completion/milestone/archival run `oak-consolidate-docs`: mine the smoke-spawn
pattern + the port-discovery and real-cred gotchas into a pattern/ADR if they
recur; archive this plan and the subsumed http-mcp-test-suite-improvements per
ADR-117; update the completed-plans index.

## Supersession

- **`http-mcp-test-suite-improvements.plan.md`** — subsumed into Track B (its
  e2e-rebalance cycles 2–7 become the WS3 ledger; cycle-1 built-server file is
  deleted in WS3; the appId concept is a separate observability decision, NOT
  carried — see that plan's own scope). Archive to `archive/superseded/` on
  activation with a reference back here.
- **`architecture-and-infrastructure/future/stdio-http-server-alignment.md`** —
  independently stale via **ADR-128** (retired the stdio workspace), surfaced by the
  supersession sweep; archive with ADR-128 provenance (a separate cleanup, not this
  plan's doing).

## Connection to EEF D7 and the Sinks-Decoupling Plan

- **EEF D7**: WS1 IS D7; this harness is its vehicle. WS0 is EEF-independent and
  parallelises with EEF D6; they converge at WS1.
- **Sinks decoupling**
  ([`observability-sinks-decoupling.plan.md`](../../observability/current/observability-sinks-decoupling.plan.md))
  is **not** a prerequisite for this harness or EEF. EEF telemetry is validated
  post-release from live Sentry data. The decoupling independently lets a future
  smoke run assert span telemetry on the stdout baseline with Sentry off — a
  benefit, not a gate. **Ship-independent, coordinate-dependent.**

## First Question

**Could it be simpler without compromising quality or value?**

The simplification is dropping the stub-tools / hermetic-E2E / ADR-161-boundary
scaffolding I had over-built, AND not fragmenting into separate plans (which would
leave half-plans and a half-baked harness lingering, against the brief). One plan,
one harness, real behaviour, the old surfaces deleted, the existing suite rebalanced
— that is the minimum that delivers the value proof and honours `replace-don't-bridge`.
