---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-11
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

- **Workstream**: Gate hardening on `feat/gate_hardening_part1`.
  The TS2430 gate failure is **FIXED** — `ToolDescriptor` now uses
  `extends Omit<Tool, '_meta'>` instead of `extends Tool`, keeping
  the library type while preventing `unknown` leaking from the
  SDK's `Tool._meta`. `pnpm check` 88/88. Ready to commit.
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-protocol-types-interface-to-type-fix.plan.md`
    (**COMPLETE** — fix applied via `Omit<Tool, '_meta'>`, not the
    original `interface→type` approach which was wrong)
  - `.agent/plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md`
    (**PARENT** — WS-0/1/2 done, namespace + type extraction done,
    WS-3 next)
  - `.agent/plans/sdk-and-mcp-enhancements/active/eef-evidence-mcp-surface.plan.md`
    (**WS-3** — recommendation tool + R1-R8, all 12 findings resolved,
    ready for implementation)
  - `.agent/plans/sdk-and-mcp-enhancements/active/nc-knowledge-taxonomy-surface.plan.md`
    (**WS-4** — smallest KG integration, ontology-derived)
  - `.agent/plans/sdk-and-mcp-enhancements/active/agent-guidance-consolidation.plan.md`
    (**WS-5** — consolidate after all surfaces)
- **Completed Cursor plans**: deleted (delivered in prior sessions)
- **Current state**: Branch `feat/gate_hardening_part1` at `779ab475`.
  All type extraction, namespace, and gate-fix work is staged +
  modified. `pnpm check` 88/88 clean. Ready to commit.
- **Current objective**: Commit the gate fix, then classify quality
  gate hardening options by effort and impact. Pick a small number
  of low-effort, high-impact interventions.
- **Hard invariants / non-goals**:
  - Use library types (`Tool`) — never reinvent SDK types
  - `Omit<Tool, '_meta'>` is the pattern for removing `unknown`
    from SDK types while keeping the library relationship
  - Spread at boundary (`{ ...tool._meta }`) when passing our
    `ToolMeta` to SDK's `Record<string, unknown>` expectation
  - No `unknown`, no `Record<string, unknown>`, no type erasure
  - Non-API-derived types live in `mcp-protocol-types.ts`
  - Namespace: no prefix (bulk API), `oak-kg-*` (ontology),
    `eef-*` (EEF), no `nc-*` (ADR-157)
  - Separate framework from consumer (ADR-154)
- **Recent surprises / corrections** (2026-04-11f):
  - **`interface→type` was the wrong fix**: three sessions attempted
    it; the linter converts `type` back to `interface`. The real
    problem was `unknown` leaking via `extends Tool`. The fix is
    `extends Omit<Tool, '_meta'>` in the generator.
  - **Verify edits survive the full pipeline**: edits can be
    reverted by `lint:fix`. Always verify the edited file AFTER
    `pnpm check`, not just after `type-check`.
  - Boundary spread pattern: `{ ...tool._meta }` creates a fresh
    object literal that TypeScript can verify against index sigs.
- **Open questions / low-confidence areas**:
  - Whether WS-5 (guidance consolidation) should be a catalogue
    abstraction or simpler validation test approach
- **Tracked follow-ups** (not blocking current work):
  - Consolidate `security-types.ts` with `mcp-protocol-types.ts`
  - Note contract re-export surface change for semver
- **Next safe step**: Classify gate hardening options by effort
  and impact. Pick low-effort, high-impact interventions.
- **Flaky test tracker**: see `project_flaky-test-tracker.md`.
- **Deep consolidation status**: partially completed this handoff —
  pattern extracted (`omit-unknown-from-library-types.md`), completed
  plan archived, stale Cursor plans deleted. Napkin rotation deferred
  (523 lines, over 500 threshold) — next session should rotate.

## Active Workstreams (2026-04-11f)

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
