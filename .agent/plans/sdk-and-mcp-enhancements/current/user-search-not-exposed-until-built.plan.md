---
name: "User-search tools not exposed in tools/list until the MCP App experience is built"
overview: "The user-search MCP App tools (user-search + user-search-query) are registered unconditionally, so they appear in tools/list for an app experience that is not built yet. Gate both behind an opt-in feature flag (default OFF, EEF pattern) so neither is exposed until the feature ships."
todos:
  - id: cycle-1
    content: "Cycle 1: opt-in feature flag (default OFF) gating user-search tool registration. Flag-engine resolution unit test (test the engine, not the default posture) + gated registration so neither user-search tool registers when OFF. One commit. Tree green."
    status: pending
    depends_on: []
  - id: cycle-2
    content: "Cycle 2: e2e/absence proof — tools/list over the in-process server does NOT contain user-search or user-search-query when the flag is OFF (default), and DOES when ON. One commit. Tree green."
    status: pending
    depends_on: [cycle-1]
  - id: ws-docs
    content: "Docs: env var documented in env.ts JSDoc + README env table; note the three-stage flag lifecycle (pre-release OFF -> release ON kill-switch -> flag removed)."
    status: pending
    depends_on: [cycle-1, cycle-2]
isProject: false
---

# User-search tools not exposed until built

**Last Updated**: 2026-06-23
**Status**: 🟡 PLANNING (current/ — queued, not started)
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
- Neither registration is gated by a feature flag — they are registered
  **unconditionally** (`universal-tools/definitions.ts`). So in the public alpha,
  agents see user-search tools for an MCP App experience that **is not built
  yet**.

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

## Design Principles

1. **Reuse the flag engine** — add one opt-in flag (default OFF), e.g.
   `OAK_CURRICULUM_MCP_USER_SEARCH_ENABLED`, mirroring the EEF surface. No new
   mechanism.
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

### Cycle 1: opt-in flag gates user-search registration

**Test** (Red): a flag-engine resolution unit test asserting the gating function
includes the user-search tool definitions only when the resolved flag is ON, and
excludes them when OFF/unset — exercising the resolution engine, not the default
value. (If the registration list is assembled purely, test that assembler with
the flag value injected.)

**Product code** (Green): add the opt-in flag to `env.ts` + the runtime-config
resolver (opt-in posture, default OFF), and gate the user-search tool
registrations in `universal-tools/definitions.ts` (or wherever the registered
list is assembled) on the resolved flag.

**Acceptance**: flag OFF/unset -> user-search tools absent from the registered
set; flag ON -> present. Whole tree green; commit names cycle 1.

### Cycle 2: tools/list absence proof

**Test** (Red->Green): extend the in-process e2e suite
(`apps/oak-curriculum-mcp-streamable-http/e2e-tests/mcp-app-pipeline.e2e.test.ts`)
to assert `tools/list` does NOT contain `user-search` or `user-search-query` with
the flag at its default (OFF), and DOES when the flag is enabled.

**Acceptance**: e2e assertions pass; `pnpm test:e2e` exits 0; whole tree green.

---

## Proof Contract

| Acceptance id | Proof level | Proof |
|---|---|---|
| cycle-1 | unit | flag-engine gating test; `pnpm --filter @oaknational/curriculum-sdk test` (and the app env/runtime-config tests) |
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
