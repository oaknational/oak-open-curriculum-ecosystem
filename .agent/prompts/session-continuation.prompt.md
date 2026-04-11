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
    (**WS-3** — recommendation tool + R1-R8, all 12 findings resolved,
    ready for implementation)
  - `.agent/plans/sdk-and-mcp-enhancements/active/nc-knowledge-taxonomy-surface.plan.md`
    (**WS-4** — smallest KG integration, ontology-derived)
  - `.agent/plans/sdk-and-mcp-enhancements/active/agent-guidance-consolidation.plan.md`
    (**WS-5** — consolidate after all surfaces)
- **Current state**: WS-0/1/2 committed (`1eb302e8`) on
  `planning/kg_eef_integration`. Prior knowledge graph renamed
  (was "prerequisite graph"), 6 fragile tests deleted,
  misconception-graph E2E assertions added. All 12 EEF plan
  findings resolved with precise Zod schemas. `pnpm check` passes.
- **Current objective**: Implement WS-3 (EEF evidence surface).
  The EEF plan is fully resolved — ready for implementation.
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
- **Recent surprises / corrections** (2026-04-11):
  - Flaky E2E test `returns HTTP 401 for tools/list with fake Bearer
    token` in `application-routing.e2e.test.ts` — fails during full
    `pnpm check` concurrency, passes on isolated re-run. Tracked in
    `project_flaky-test-tracker.md`.
  - `replace_all` on lowercase `prerequisite` in a code-template file
    corrupted `prerequisiteFor` and `prerequisiteGraph` camelCase
    strings. Lesson: never use blanket `replace_all` on partial words
    in files that contain code templates with mixed casing.
- **Open questions / low-confidence areas**:
  - Whether WS-5 (guidance consolidation) should be a catalogue
    abstraction or simpler validation test approach (barney
    recommended the simpler path)
- **Next safe step**: Implement WS-3 per the resolved EEF plan.
  T1 (data loader, Zod), T2-T5 (resources, tool, guidance),
  T6-T10 (registration, prompt), T11-T12 (ADR, E2E).
- **Flaky test tracker**: see memory note
  `project_flaky-test-tracker.md`. Two failures observed (auth
  routing E2E, curriculum-model E2E). Suspected: turbo concurrency
  or test coupling.
- **Deep consolidation status**: completed this handoff —
  deduplicated distilled.md (removed Vercel section, ADR-065
  pointer, npm scope fact, duplicate "lead with narrative"),
  promoted "pre-implementation plan review" to pattern file,
  fixed stale MEMORY.md entries (widget, mcpjam reference),
  updated all plan statuses with commit refs, fixed stale
  file path in future plan.

## Active Workstreams (2026-04-11)

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
