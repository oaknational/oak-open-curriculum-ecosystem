---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-12
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read `.agent/memory/distilled.md` and `.agent/memory/napkin.md`
3. Read the active plan for your workstream (see below)
4. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Future Strategic Watchlist

- Strategic only, not active for the current workstream:
  [cross-vendor-session-sidecars.plan.md](../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
  tracks a local-first, cross-vendor sidecar model for durable session
  metadata beyond vendor-native session titles.

## Live Continuity Contract

- **Workstream**: MCP Apps and tool metadata
  (`feat/gate_hardening_part1` branch).
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (PENDING — next workstream: build the interactive user search
    MCP App. Two new pre-phase blockers added 2026-04-12.)
  - `.agent/plans/sdk-and-mcp-enhancements/current/meta-oak-namespace-cleanup.plan.md`
    (NOT STARTED — replace `_meta.securitySchemes` with Oak-namespaced
    `oak-www` + `oak-guidance` fields; includes `buildToolMeta()`
    factory. Co-requisite for Phase 5.)
  - `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`
    (knip complete, depcruise complete; remaining: ESLint config
    standardisation, eslint-disable remediation — parked)
- **Current state**: Branch has uncommitted changes:
  `get-curriculum-model` definition updated with explicit
  `visibility: ['model', 'app']`. MCP Apps audit session complete.
  `meta-oak-namespace-cleanup.plan.md` created in `current/`.
  WS3 Phase 5 plan updated with 2 pre-phase blockers.
- **Current objective**: Build the interactive user search MCP App
  (WS3 Phase 5). First: resolve the pre-phase blockers (remove
  `search` tool's `_meta.ui`, consolidate to one user-facing
  search tool). Then implement the search view.
- **Hard invariants / non-goals**:
  - Never weaken gates to solve testing problems
  - No `unknown`, no `Record<string, unknown>`, no type erasure
  - Never edit generated files — edit the generators
  - `search` tool must NOT have `_meta.ui` — it is agent-only
- **Recent surprises / corrections** (2026-04-12):
  - `_meta.securitySchemes` is unused — no host reads it, no
    runtime code reads it. Top-level `securitySchemes` (used by
    `toolRequiresAuth()`) is the functional field. The `_meta`
    copy is dead weight.
  - `search` tool incorrectly claims widget UI via `_meta.ui` —
    should be agent-only. Only `user-search` should render the
    interactive widget.
  - Two user-facing search tools exist with `_meta.ui` when there
    should be only one (`user-search`).
  - `get-curriculum-model` lacked explicit `visibility` on
    `_meta.ui` — now set to `['model', 'app']`.
  - MCP Apps spec: `_meta.ui` for tools is just `resourceUri` +
    `visibility`. `securitySchemes` is non-standard.
- **Open questions / low-confidence areas**:
  - Why do both `search` and `user-search` have `_meta.ui`? Was
    `search` intended as a transitional widget tool?
  - Should `meta-oak-namespace-cleanup` be done before or during
    Phase 5? (Co-requisite — can interleave)
- **Next safe step**: Start the next session with
  `meta-oak-namespace-cleanup` Phase 0 (audit), then move to
  Phase 5 pre-phase blockers (remove `search` from widget
  allowlist, consolidate search tools).
- **Deep consolidation status**: due — napkin at 672+ lines
  (above 500 rotation threshold). Deferred to next session.

## Active Workstreams (2026-04-12)

### 1. Interactive User Search MCP App (WS3 Phase 5) — NEXT

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`

Build the user-facing interactive search widget. Two new pre-phase
blockers: (a) remove `search` tool's false `_meta.ui` claim,
(b) consolidate to single user-facing search tool.

### 2. `_meta` Namespace Cleanup — NOT STARTED (co-requisite)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/current/meta-oak-namespace-cleanup.plan.md`

Replace unused `_meta.securitySchemes` with Oak-namespaced `oak-www`
and `oak-guidance` fields. Includes `buildToolMeta()` factory.
Co-requisite for Phase 5 — both address `_meta` architecture.

### 3. Quality Gate Hardening — parked

**Plan**: `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`

Knip and depcruise complete. Remaining: ESLint config standardisation,
eslint-disable remediation. Parked while MCP Apps work takes priority.

### 4. Workspace Topology Exploration — FUTURE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`

Four-tier layered architecture. Lifecycle classification complete.
Phase 2 pending.

## Core Invariants

- Widget HTML is generated metadata — same codegen constant pattern
  as `WIDGET_URI`, tool descriptions, documentation content
- DI is always used — enables testing with trivial fakes (ADR-078)
- `principles.md` is the source of truth; rules operationalise it
- Separate framework from consumer in all new work
- Decompose at tensions rather than classifying around compromises
- Apps are thin interfaces over SDK/codegen capabilities

## Durable Guidance

- Run the required gates one at a time while iterating.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the canonical aggregate readiness gate before
  push/merge. It now includes `pnpm knip`. After depcruise Phase 4,
  it will also include `pnpm depcruise`.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
