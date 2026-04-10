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

- **Workstream**: Open Education Knowledge Surfaces (WS-0 → WS-6).
  Parent plan created, coordinating graph factory, 4 graph surfaces,
  agent guidance consolidation, and ADR/README narrative.
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md`
    (**PARENT** — WS-0 through WS-6 coordination)
  - `.agent/plans/sdk-and-mcp-enhancements/active/graph-resource-factory.plan.md`
    (**WS-1** — prerequisite, extract shared infrastructure)
  - `.agent/plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md`
    (**WS-2** — first factory consumer)
  - `.agent/plans/sdk-and-mcp-enhancements/active/eef-evidence-mcp-surface.plan.md`
    (**WS-3** — recommendation tool + R1-R8)
  - `.agent/plans/sdk-and-mcp-enhancements/active/nc-knowledge-taxonomy-surface.plan.md`
    (**WS-4** — smallest KG integration, ontology-derived)
  - `.agent/plans/sdk-and-mcp-enhancements/active/agent-guidance-consolidation.plan.md`
    (**WS-5** — consolidate after all surfaces)
  - `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`
    (**CURRENT** — four-tier architecture analysis)
  - `.agent/plans/kgs-and-pedagogy/` (**FUTURE** — deeper KG
    integration, Levels 4/4b, after alignment audit)
- **Current state**: Full plan family created across a long planning
  session. Parent plan with 7 work stages, graph factory prerequisite,
  NC knowledge taxonomy plan (smallest KG integration), plus earlier
  EEF evidence and guidance consolidation plans. 4 completed plans
  archived, 7 session plans cleaned. ADR-059 renamed to "Curriculum
  Concept Map". Branch `planning/kg_eef_integration`.
- **Current objective**: Next session begins with specialist reviewer
  sweep of the entire plan family (architecture-reviewer-betty,
  architecture-reviewer-barney, mcp-reviewer, code-reviewer), then
  executes WS-0 (ADR + README + authors), WS-1 (graph factory),
  WS-2 (misconception graph).
- **Hard invariants / non-goals**:
  - DI is always used — constant provides VALUE, DI provides
    TESTABILITY (ADR-078)
  - `principles.md` is the source of truth for all principles
  - Separate framework from consumer in all new work (ADR-154)
  - Decompose at tensions rather than classifying (ADR-155)
  - No compatibility shims, no invented optionality
  - KGs-and-pedagogy Levels 1-3 ready now; Levels 4/4b after
    KG alignment audit
  - Bulk-data derivations (ADR-059 concept map, misconception graph)
    are NOT knowledge graphs — the formal ontology is
- **Recent surprises / corrections**:
  - KG repo has a single primary author (Mark Hodierne, 170/180
    commits) — important for attribution on integration.
  - EEF roadmap v0.5 explicitly targets "Oak Layer 2 schema"
    alignment — the KG repo IS that schema. Convergence is
    architecturally mapped, not aspirational.
  - The repo's bulk-data derivations (ADR-059 concept map,
    misconception graph, prerequisite graph) and the formal
    ontology are different orders of thing. ADR-059 renamed
    to "Curriculum Concept Map" to disambiguate.
  - Levels 1-3 of EEF integration don't need the ontology at
    all — they work from EEF JSON + bulk data. This decouples
    the demo/value path from the KG alignment audit.
- **Open questions / low-confidence areas**:
  - Whether `build:widget` should be a Turbo codegen task or
    standalone script (currently standalone, works well)
  - CI drift check for stale `widget-html-content.ts` (not yet
    implemented, tracked as follow-up)
  - Topology Plan B: physical directory structure decision
    deferred to after function-level analysis evidence
  - `static-content.ts` `process.cwd()` bug (non-crash)
  - Curriculum-evidence crosswalk quality: which EEF strand
    mappings are natural vs require expert pedagogical judgement?
- **Next safe step**: Start next session with specialist reviewer
  sweep of the full plan family, then execute WS-0 (ADR, README,
  authors: Cresswell, Hodierne, Roberts alphabetically), WS-1
  (graph factory), WS-2 (misconception graph).
- **Deep consolidation status**: completed this handoff —
  4 plans archived, 7 session plans cleaned, active README
  updated, parent plan created, napkin updated. Napkin ~500
  lines (at rotation threshold — rotate next consolidation).

## Active Workstreams (2026-04-10)

### 1. Vercel Widget Crash Fix — COMPLETE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md`

All phases executed. Widget HTML is now a committed TypeScript
constant (`src/generated/widget-html-content.ts`), consumed via
DI (ADR-156). Filesystem-based code deleted. All quality gates
green. ADR-156 created and indexed. The branch is 4 commits ahead
of origin locally; next step is push plus Vercel preview
verification.

### 2. WS3 MCP App Rebuild — MERGE PENDING

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

Local gates green on `feat/mcp_app_ui`. Widget crash fix complete
locally and committed. Next: push, verify Vercel preview, then
merge.
Phase 5 (interactive user search view) queued post-merge.

### 3. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 4. Continuity Adoption — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 closed with an explicit `promote` decision on 3 April 2026. The
outgoing continuity note landed and the same-day Practice Core promotion is
recorded separately in `.agent/practice-core/*`.

### 5. Assumptions Reviewer — COMPLETE

ADR-146 accepted, triplet deployed, platform adapters created.

### 6. URL Naming Collision Remediation — COMPLETE

Completed 2026-04-01.

### 7. Workspace Topology Exploration — FUTURE

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
