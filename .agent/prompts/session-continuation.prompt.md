---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-10
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

- **Workstream**: Vercel widget crash fix (preview server crash)
  + workspace topology exploration (strategic)
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/embed-widget-html-at-build-time.plan.md`
    (**ACTIVE** — Phase 0 complete, Phases 1-3 pending execution)
  - `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`
    (**FUTURE** — four-tier architecture, function-level analysis)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (**QUEUED** — post-merge interactive user-search UI)
- **Current state**: Rules consolidation tidy-up complete (16
  portability failures fixed, `pnpm check` green). ADR-154
  (Separate Framework from Consumer), ADR-155 (Decompose at the
  Tension) created and accepted. ADR-125 updated with many-to-one
  consolidation pattern. Two clean commits on `feat/mcp_app_ui`.
  Widget crash plan is final and reviewed, ready for execution.
- **Current objective**: Execute widget crash fix (Plan A) —
  resolve the preview server crash by embedding widget HTML as a
  committed TypeScript constant.
- **Hard invariants / non-goals**:
  - DI is always used — constant provides VALUE, DI provides
    TESTABILITY (ADR-078)
  - Widget HTML follows the same codegen pattern as all other
    generated metadata (same as `WIDGET_URI`, tool descriptions)
  - `principles.md` is the source of truth for all principles;
    `.agent/rules/` and `.cursor/rules/` are operationalisation
    mechanisms, not the definitions
  - Separate framework from consumer in all new work (ADR-154)
  - Decompose at tensions rather than classifying around them
    (ADR-155)
  - `static-content.ts` `process.cwd()` bug tracked separately
  - No compatibility shims, no invented optionality
- **Recent surprises / corrections**:
  - Portability validator only accepts `.agent/rules/` and
    `.agent/skills/` references — cursor rules referencing
    `.agent/directives/` directly fail the check. Maintain the
    indirection layer (cursor rule → canonical rule → directive).
- **Open questions / low-confidence areas**:
  - Template literal escaping in the embed script (backticks,
    `${` in Vite-built HTML) — needs testing
  - Whether `build:widget` should be a Turbo codegen task or
    standalone script
  - Topology Plan B: physical directory structure decision
    deferred to after function-level analysis evidence
  - `static-content.ts` `process.cwd()` bug (non-crash, tracked
    separately)
- **Next safe step**: Execute Phase 1 of the widget crash plan —
  change Vite output dir, create embed script, produce committed
  TypeScript constant, decouple from runtime build.
- **Deep consolidation status**: completed this handoff — ADR-154,
  ADR-155 created; ADR-125 updated; rules tidy-up committed;
  distilled.md reviewed (no graduation needed).

## Active Workstreams (2026-04-10)

### 1. Vercel Widget Crash Fix — ACTIVE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/embed-widget-html-at-build-time.plan.md`

Vercel preview deployments crash because widget HTML is read from
the filesystem at runtime. Fix: generate widget HTML as a committed
TypeScript constant at codegen time (same pattern as `WIDGET_URI`
and other tool metadata), consumed via DI. Phase 0 (debug cleanup)
complete. Phases 1-3 pending execution.

### 2. WS3 MCP App Rebuild — MERGE PENDING

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

Local gates green on `feat/mcp_app_ui`. Vercel crash blocks merge.
Once the widget crash fix lands, commit/push and verify preview.
Phase 5 (interactive user search view) queued post-merge.

### 2. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 3. Continuity Adoption — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 closed with an explicit `promote` decision on 3 April 2026. The
outgoing continuity note landed and the same-day Practice Core promotion is
recorded separately in `.agent/practice-core/*`.

### 4. Assumptions Reviewer — COMPLETE

ADR-146 accepted, triplet deployed, platform adapters created.

### 5. URL Naming Collision Remediation — COMPLETE

Completed 2026-04-01.

### 6. Workspace Topology Exploration — FUTURE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`

Four-tier layered architecture (primitives, infrastructure, codegen-time,
runtime). Lifecycle classification of all workspaces complete. Phase 2
(function-level analysis with knip + dependency-cruiser) pending.
Informed by the Oak Surface Isolation Programme
(`.agent/plans/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md`).

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
- Run `pnpm check` as the canonical aggregate readiness gate before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
