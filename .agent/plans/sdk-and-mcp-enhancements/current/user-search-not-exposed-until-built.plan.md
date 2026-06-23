---
name: "User-search tools not exposed in tools/list until the MCP App experience is built"
overview: "The user-search MCP App tools (user-search + user-search-query) are registered unconditionally, so they appear in tools/list for an app experience that is not built yet. Gate both behind an opt-in feature flag (default OFF, EEF pattern) so neither is exposed until the feature ships."
todos:
  - id: cycle-1
    content: "Cycle 1 (LANDED ac0a98c5b): opt-in flag OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED (default OFF) gating user-search tool registration in the APP layer (handlers.ts, mirroring EEF), not the SDK. Gate proven both ways via the registerTools spy integration test (test the gate, not the engine — the engine is already tested once in feature-flags.unit.test.ts). One commit. Tree green."
    status: completed
    depends_on: []
  - id: cycle-2
    content: "Cycle 2: e2e/absence proof — tools/list over the in-process server does NOT contain user-search or user-search-query when the flag is OFF, and DOES when ON. Touches e2e-tests/mcp-app-pipeline.e2e.test.ts + flips the e2e helper default in test-config.ts (currently userSearchEnabled:true to preserve pre-gating behaviour) and updates the user-search-referencing e2e tests. One commit. Tree green."
    status: completed
    depends_on: [cycle-1]
  - id: ws-docs
    content: "Docs (DONE via Cycle 1 ac0a98c5b): env var documented in env.ts JSDoc incl. the three-stage flag lifecycle. README env-table item dropped — no such table exists and the sibling EEF flag is not documented there either; env.ts JSDoc is the canonical home."
    status: completed
    depends_on: [cycle-1, cycle-2]
isProject: false
---

# User-search tools not exposed until built

**Last Updated**: 2026-06-23
**Status**: ✅ COMPLETE — Cycle 1 `ac0a98c5b`, Cycle 2 `906cca9b3`, plan
corrections `ff26bcf69`. Both user-search tools are gated OFF by default and
proven absent from `tools/list` at the default; docs satisfied by `env.ts`
JSDoc. Ready to archive per ADR-117. (Unpushed — owner controls push.)
Three first-hand corrections were applied to this plan before execution (see
§Execution Corrections): the gate lives in the **app** (`handlers.ts`), not the
SDK; the posture sibling is `useStubTools` (opt-in), not the EEF kill-switch;
and the new behaviour is tested at the **gate**, not the already-tested engine.
**Scope**: Stop the unbuilt user-search MCP App tools appearing in the
model-visible `tools/list`, by gating their registration behind an opt-in
feature flag (default OFF) until the MCP App user-search experience is built.

---

## Context

Surfaced by the owner during the `mcp-self-description-fidelity` session
(2026-06-23). First-hand findings:

- There is **one** user-search product with **two** registrations, by MCP Apps
  design: `USER_SEARCH_TOOL_DEF` (`user-search`, model + app visible widget
  tool) and `USER_SEARCH_QUERY_TOOL_DEF` (`user-search-query`, same handler/args,
  marked `_meta.ui.visibility: ['app']` — an app-only query helper). They live in
  `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`.
- `_meta.ui.visibility: ['app']` is a **host-side hint**. A generic MCP client
  (Claude Code; the oak-prod `tools/list` observed this session) does not honour
  it, so **both** tools appear in the model-visible tool list — hence "two
  user-search tools".
- The SDK *assembles* every tool definition into a static `AGGREGATED_TOOL_DEFS`
  const (`universal-tools/definitions.ts`) — including both user-search entries.
  The **app** then enumerates that list and *registers* each tool in
  `registerTools` (`apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`).
  Registration was **unconditional** for user-search — no flag — so in the
  public alpha agents see user-search tools for an MCP App experience that **is
  not built yet**. The gate therefore belongs in the **app's** `registerTools`
  (where `EEF_FLAG_GATED_TOOL_NAMES` already gates EEF), not the SDK: the SDK
  enumerator stays transport-agnostic and the app owns the flag.

### Problem Statement

Unbuilt tools are exposed in `tools/list`. An agent can discover and attempt to
call `user-search` / `user-search-query` for a UI experience that does not exist,
degrading the public-alpha tool surface.

### Existing Capabilities

- Feature-flag engine: `apps/oak-curriculum-mcp-streamable-http/src/feature-flags.ts`
  (opt-in default-OFF and kill-switch default-ON postures), env validation in
  `env.ts`, resolution in `runtime-config-from-validated-env.ts`, applied for the
  EEF surface (`OAK_CURRICULUM_MCP_EEF_ENABLED`). This plan reuses that engine.
- Three-stage flag lifecycle (pre-release OFF -> release ON with kill-switch ->
  flag removed) is the established convention.

---

## Execution Corrections (first-hand, 2026-06-23)

Verified against the code before executing; this plan as originally drafted was
wrong on three specifics (intent unchanged):

1. **Gate location** — the gate is the **app's** `registerTools`
   (`handlers.ts`), mirroring `EEF_FLAG_GATED_TOOL_NAMES`, **not** the SDK's
   `universal-tools/definitions.ts` (a static const with no runtime-config
   access; gating there would break the transport-agnostic-SDK invariant).
2. **Posture sibling** — EEF uses `resolveKillSwitchFlag` (default ON). The
   correct opt-in (default OFF) sibling is `useStubTools` (`resolveOptInFlag`).
   The flag *engine* is shared; the posture copied is `useStubTools`'s.
3. **Test shape** — the flag engine is already tested once
   (`feature-flags.unit.test.ts`); do not re-test it. The new behaviour is the
   gate, tested via the `registerTools` spy harness in
   `handlers-tool-registration.integration.test.ts` with the flag injected both
   ways. A **required-field ripple**: adding `userSearchEnabled` to the three
   runtime-config interfaces forces a one-line addition in every `RuntimeConfig`
   literal (several `src/` tests + two `e2e-tests/` helpers).

## Design Principles

1. **Reuse the flag engine** — add one opt-in flag (default OFF),
   `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED`, resolved with `resolveOptInFlag`
   (the `useStubTools` posture). No new mechanism. (EEF is the structural
   sibling for the gated-tool-name-set pattern, but its kill-switch posture is
   the opposite — see §Execution Corrections.)
2. **Gate registration, not just visibility** — while OFF, the tools must not be
   registered at all, so a generic client cannot see them regardless of whether
   it honours `_meta.ui.visibility`.
3. **Test the flag engine, not the configuration** — the unit test exercises the
   flag resolution/gating, never asserts a flag's default posture as the system
   under test.

**Non-Goals** (YAGNI):

- **Building the user-search MCP App experience** — out of scope; this only gates
  the existing definitions off.
- **Collapsing the two registrations to one** — the model-widget + app-only
  query-helper is the standard MCP Apps pattern; whether to keep both is a
  ship-time design decision, deferred. Gating OFF makes the "two tools in the
  list" symptom moot now.
- **Changing `_meta.ui.visibility` semantics** — host-side hint behaviour is not
  this plan's concern.

---

## Cycles

### Cycle 1: opt-in flag gates user-search registration — LANDED `ac0a98c5b`

**Test** (Red): the `registerTools` spy integration test
(`handlers-tool-registration.integration.test.ts`, `registerAndCapture`
harness) asserts `user-search` + `user-search-query` are absent from the
captured registrations when `userSearchEnabled` is false and present when true —
the flag value injected both ways. The flag engine is NOT re-tested here.

**Product code** (Green): `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED` added to
`env.ts`; `userSearchEnabled` added to the three runtime-config interfaces
(`runtime-config-support.ts`) and resolved with `resolveOptInFlag` in
`runtime-config-from-validated-env.ts`; gated in the **app's** `registerTools`
(`handlers.ts`) via `USER_SEARCH_FLAG_GATED_TOOL_NAMES`, mirroring the EEF guard.
Required-field ripple applied to the `src/` runtime-config literals and the mock
helper; the two `e2e-tests/` helper literals patched additively (owner-authorised
cross-claim edit).

**Acceptance** (met): flag OFF/unset -> both tools absent from the registered
set; ON -> present. 685 src + 143 e2e tests green; full pre-commit gate green.

### Cycle 2: tools/list absence proof — LANDED `906cca9b3`

**Test** (Red->Green): extend
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/mcp-app-pipeline.e2e.test.ts`
to assert `tools/list` does NOT contain `user-search` or `user-search-query` at
the flag's default (OFF), and DOES when enabled. Cycle 1 set the e2e helper
default `userSearchEnabled: true` to preserve pre-gating behaviour; Cycle 2 must
flip the default to false (production-honest), drive both postures explicitly,
and update the existing user-search-referencing e2e tests
(`mcp-app-pipeline`, `server`, `ws3-fallback-proof`).

**Acceptance**: e2e assertions pass; `pnpm test:e2e` exits 0; whole tree green.

**Coordination note**: `e2e-tests/**` is under an active claim by another
session (`Blazar rides Dawn`) as of 2026-06-23. Coordinate or take the claim
before starting Cycle 2.

---

## Proof Contract

| Acceptance id | Proof level | Proof |
|---|---|---|
| cycle-1 | integration | `registerTools` gating test; `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (the change is in the app, not the SDK) |
| cycle-2 | e2e | `tools/list` omits user-search tools at default; `pnpm test:e2e` |
| ws-docs | non-code | env var documented; lifecycle note recorded |

Completion requires every id proven. TDD evidence is test-first per cycle.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Gating misses one registration path | Cycle 2's `tools/list` e2e asserts both names are absent — catches any missed path. |
| Flag default wrong (exposed by mistake) | Opt-in posture (default OFF); cycle-1 test exercises the resolution; cycle-2 proves absence at default. |
| App genuinely needs the app-only tool while model is OFF | The MCP App is not built yet (premise); when it ships, the flag flips ON per the three-stage lifecycle, and the model-vs-app visibility design resumes. |

---

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) — the server's exposed
  surface reflects built capability; no unbuilt tools advertised.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — test the flag
  engine, not the configuration; test+product-code per cycle in one commit.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) —
  not central here; the change is registration gating, not schema-derived data.

### Plan-body first-principles check

> See [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

- **Vendor-literal clause**: not applicable — no third-party vendor integration.
- **Shape check**: the two user-search definitions, the `_meta.ui.visibility`
  hint behaviour, the unconditional registration, and the EEF flag-engine pattern
  were confirmed first-hand during the originating session; the executing agent
  re-confirms the registration assembly point before editing.
- **Landing path**: each cycle is one atomic commit; tree green at every commit.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: **bounded executable repo plan**, single arc. Touch points:
start-right at session open; an active-claim over the touched app/SDK files;
consolidation at close. No decision-thread expected — the approach is settled
(opt-in flag, default OFF); the keep-both-registrations question is deferred to
ship time and recorded as a non-goal here.

---

## Dependencies

**Blocking**: none. Runnable now against current `main`.

**Beneficial**: none. Independent of `mcp-self-description-fidelity`.

**Source**: owner observation during the 2026-06-23 `mcp-self-description-fidelity`
session; findings recorded in this plan's Context.
