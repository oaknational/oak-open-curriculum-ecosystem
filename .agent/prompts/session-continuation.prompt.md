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

- **Workstream**: Open Education Knowledge Surfaces — WS-0/1/2 DONE,
  WS-3 (EEF evidence) is next.
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md`
    (**PARENT** — WS-0/1/2 done, WS-3 next)
  - `.agent/plans/sdk-and-mcp-enhancements/active/eef-evidence-mcp-surface.plan.md`
    (**WS-3** — recommendation tool + R1-R8, 12 pre-implementation
    findings to resolve before coding)
  - `.agent/plans/sdk-and-mcp-enhancements/active/nc-knowledge-taxonomy-surface.plan.md`
    (**WS-4** — smallest KG integration, ontology-derived)
  - `.agent/plans/sdk-and-mcp-enhancements/active/agent-guidance-consolidation.plan.md`
    (**WS-5** — consolidate after all surfaces)
- **Current state**: WS-0 (narrative), WS-1 (factory), WS-2
  (misconception surface) are implemented and all reviewer findings
  addressed. `pnpm check` passes except E2E (fixed, re-running).
  All changes are uncommitted on `planning/kg_eef_integration`.
  Graph resource factory is live. Misconception graph (12,858 nodes)
  is registered as resource + tool. ADR-157, LICENCE-DATA, README
  all updated for multi-source narrative.
- **Current objective**: Commit WS-0/1/2, then implement WS-3 (EEF
  evidence surface). The EEF plan has 12 pre-implementation findings
  that must be resolved before coding — they are recorded at the top
  of the EEF plan file.
- **Hard invariants / non-goals**:
  - Only `get-curriculum-model` is a prerequisite tool. All graph
    tools are supplementary, loaded as needed — no prerequisite
    guidance injected by the factory.
  - Graph factory is SDK-internal, not publicly exported
  - Registration lives in app layer (needs observability)
  - URI scheme: all `curriculum://` with source-identifying segments
  - EEF data is NOT generated from OpenAPI — lives in SDK, not codegen
  - Separate framework from consumer (ADR-154) — factory is framework
  - No `unknown`, no `Record<string, unknown>`, no type aliases
  - Future graph sub-setting feature tracked in memory
- **Recent surprises / corrections**:
  - `git stash` during diagnostic reverted working tree — recovery
    required careful stash pop with conflict resolution. Lesson:
    never stash as a diagnostic shortcut without understanding the
    full tree state.
  - Pre-existing lint errors in `documentation-resources.unit.test.ts`
    (unsafe assignment) — not caused by our changes but surfaced by
    the turbo cache miss. Pre-existing, not blocking.
  - Another agent was working in the repo concurrently — their changes
    to `.agent/memory/distilled.md`, napkin, semantic-search plans,
    and cursor hooks state needed to be preserved during recovery.
- **Open questions / low-confidence areas**:
  - EEF `focus` enum alignment with JSON field names
  - EEF `uk_context` and `school_context_schema` exact typing
  - Whether WS-5 (guidance consolidation) should be a catalogue
    abstraction or simpler validation test approach (barney
    recommended the simpler path)
  - E2E test coverage for `curriculum://misconception-graph`
    resource read (tracked but not yet added — test-reviewer
    finding)
- **Next safe step**: Commit all WS-0/1/2 changes on
  `planning/kg_eef_integration`, then begin WS-3 with
  pre-implementation review finding resolution.
- **Deep consolidation status**: due — WS-1 and WS-2 plans closed,
  significant new napkin entries (prerequisite guidance scope, git
  stash recovery, fragile test patterns, prerequisite graph rename).
  Not bounded for this closeout. Next session MUST run
  `/jc-consolidate-docs` before starting WS-3.

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
