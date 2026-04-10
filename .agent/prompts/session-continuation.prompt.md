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

- **Workstream**: Vercel widget crash fix (resolving preview
  server crash) + workspace topology exploration (strategic)
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md`
    (**COMPLETE** — all phases executed, ADR-156 created)
  - `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`
    (**FUTURE** — four-tier architecture, function-level analysis)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (**QUEUED** — post-merge interactive user-search UI)
- **Current state**: Widget crash fix (Phases 1-3) fully
  executed. All quality gates green: 590 unit/integration tests,
  15 widget tests, 157 E2E tests. ADR-156 created and indexed.
  `deployment-architecture.md`, `README.md`, and
  `dev-server-management.md` updated. Smoke-test helpers
  extracted to `server-lifecycle.ts`. Changes are local only —
  not yet committed or pushed.
- **Current objective**: Commit, push, and verify the Vercel
  preview deployment no longer crashes.
- **Hard invariants / non-goals**:
  - DI is always used — constant provides VALUE, DI provides
    TESTABILITY (ADR-078)
  - Widget HTML follows the same codegen pattern as all other
    generated metadata (same as `WIDGET_URI`, tool descriptions)
  - `principles.md` is the source of truth for all principles
  - Separate framework from consumer in all new work (ADR-154)
  - Decompose at tensions rather than classifying (ADR-155)
  - `static-content.ts` `process.cwd()` bug tracked separately
  - No compatibility shims, no invented optionality
- **Recent surprises / corrections**:
  - Wilma reviewer caught a smoke-test blind spot: `createApp`
    without `getWidgetHtml` in `smoke-tests/local-server.ts`
    (excluded from `tsconfig.lint.json` type-check). Fixed.
  - Template literal escaping in embed script works correctly
    for Vite-generated HTML (resolved open question).
  - `dist/index.js` grew from 122KB to 466KB (345KB embedded
    widget HTML constant). Acceptable for Node serverless.
- **Open questions / low-confidence areas**:
  - Whether `build:widget` should be a Turbo codegen task or
    standalone script (currently standalone, works well)
  - CI drift check for stale `widget-html-content.ts` (not yet
    implemented, tracked as follow-up)
  - Topology Plan B: physical directory structure decision
    deferred to after function-level analysis evidence
  - `static-content.ts` `process.cwd()` bug (non-crash)
- **Next safe step**: Commit and push the widget crash fix on
  `feat/mcp_app_ui`, then verify the Vercel preview deployment
  starts without crashing.
- **Deep consolidation status**: completed this handoff —
  ADR-156 created; docs updated; napkin updated; distilled.md
  reviewed (no graduation needed, all new learnings already
  present in permanent docs or distilled.md).

## Active Workstreams (2026-04-10)

### 1. Vercel Widget Crash Fix — COMPLETE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md`

All phases executed. Widget HTML is now a committed TypeScript
constant (`src/generated/widget-html-content.ts`), consumed via
DI (ADR-156). Filesystem-based code deleted. All quality gates
green. ADR-156 created and indexed. Changes are local — pending
commit and Vercel preview verification.

### 2. WS3 MCP App Rebuild — MERGE PENDING

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

Local gates green on `feat/mcp_app_ui`. Widget crash fix complete
locally. Next: commit, push, verify Vercel preview, then merge.
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
