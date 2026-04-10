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

- **Workstream**: KGs and Pedagogy analysis (completed this session).
  Widget crash fix push still pending from prior session.
- **Active plans**:
  - `.agent/plans/kgs-and-pedagogy/` (**NEW** — future strategic
    brief for evidence-grounded curriculum discovery)
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md`
    (**COMPLETE** — all phases executed, ADR-156 created)
  - `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`
    (**FUTURE** — four-tier architecture, function-level analysis)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (**QUEUED** — post-merge interactive user-search UI)
- **Current state**: Plan collection at `.agent/plans/kgs-and-pedagogy/`
  complete with strategic brief, technical comparison, and EEF data
  file. Coherence review completed — found structural coherence
  but identified that Levels 1-3 (EEF resources/tools/prompts) are
  independently deliverable without waiting for KG alignment audit.
  Four tightening edits applied: ADR-059 renamed to "Curriculum
  Concept Map" with terminology note distinguishing bulk-data
  derivations from the formal ontology; misconception graph plan
  updated with ontology relationship note; evidence integration
  levels made explicit about data sources and dependencies;
  promotion triggers split (Levels 1-3 ready now, 4/4b after audit).
  Attribution requirements documented (JR for EEF, MH for KG).
  Branch `feat/mcp_app_ui` still 4 commits ahead of origin.
- **Current objective**: Push `feat/mcp_app_ui` and verify the
  Vercel preview deployment no longer crashes; then the
  normalised reports and KGs-and-pedagogy plan collection can
  be committed.
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
- **Next safe step**: Commit the KGs-and-pedagogy plan collection
  and tightening edits on `feat/mcp_app_ui`, push, and verify
  the Vercel preview deployment. Then begin EEF Levels 1-3
  implementation on a demo branch.
- **Deep consolidation status**: not due — plan collection and
  tightening edits committed this session, but no architectural
  decisions or milestone closures. Napkin ~460 lines (below
  rotation threshold).

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
