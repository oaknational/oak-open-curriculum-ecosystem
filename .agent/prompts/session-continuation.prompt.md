---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-02
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

## Live Continuity Contract

- **Workstream**: MCP App migration (WS3 widget rebuild), with continuity
  adoption running alongside
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
  - `.agent/plans/agentic-engineering-enhancements/current/continuity-and-surprise-practice-adoption.plan.md`
- **Completed plans** (this session):
  - `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md` — COMPLETE
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md` — COMPLETE
- **Current state**: WS3 Phase 3 canonical contracts are COMPLETE, including
  the non-UI host fallback proof. The merge-main plan is archived as COMPLETE
  at
  `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md`.
  Phases 4-6 are still pending, and the next queued prerequisite is
  `.agent/plans/sdk-and-mcp-enhancements/current/ws3-design-token-prerequisite.plan.md`.
  The frontend practice plan is archived as COMPLETE, so the specialist agents
  are available for widget UI work. Continuity adoption evidence now includes a
  real WS3 resumption, a `GO` session entry, and a second deep-consolidation
  entry. Targeted Vitest slices and `pnpm markdownlint:root` are green; full
  `pnpm qg` / `pnpm check` remain pending.
- **Current objective**: Execute the queued design-token prerequisite so WS3
  Phase 4 and Phase 5 can start with canonical package CSS instead of
  permanent app-local brand values.
- **Hard invariants / non-goals**:
  - Clean-break replacement of the out-of-date OpenAI-era app integration
  - Keep `search` as the model-facing, agent-facing search interface
  - Add `user-search` as the UI-first MCP App tool
  - Do not introduce custom tool-discovery, visibility, or presentation shims
  - Treat continuity as repo practice, not consciousness language
- **Recent surprises / corrections**:
  - Frontend practice plan scope clarification: design token infrastructure
    was never in scope — the plan delivers enabling expertise (agents, ADRs,
    governance), not implementation infrastructure
  - Practice evolution is not linear; incoming practice material must be
    compared bidirectionally, not dismissed as stale
  - WAI-ARIA 1.3 Editor's Draft is the preferred working reference (user
    confirmed 2026-04-02). The previous correction (1.3 → 1.2) was over-
    conservative. Reversion completed: governance doc, template, skill,
    and plan all reference 1.3 Editor's Draft (https://w3c.github.io/aria/).
  - axe-core WCAG 2.1 rules have their own tag family (`wcag21a`, `wcag21aa`)
- **Open questions / low-confidence areas**:
  - Whether the minimal v1 token set for the curriculum-model and user-search
    views is sufficient without forcing an immediate follow-on expansion
  - Whether token-package build/test wiring exposes any Turbo or workspace
    cache assumptions that need a small config follow-up
- **Next safe step**: Start
  `.agent/plans/sdk-and-mcp-enhancements/current/ws3-design-token-prerequisite.plan.md`
  with RED tests for CSS emission, tier enforcement, workspace wiring, and
  widget CSS consumption.
- **Deep consolidation status**: complete — the WS3 Phase 3/security-closure
  batch has been consolidated, the merge-main plan archived, and the second
  deep-consolidation evidence entry recorded. The broader evidence window
  remains open until the resumption and `GO` thresholds are met.

## Active Workstreams (2026-04-02)

### 1. WS3 MCP App Rebuild — ACTIVE (Phase 3 complete, token prerequisite queued)

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0 (baseline/RED specs), Phase 2 (scaffold),
Phase 3 (canonical contracts + fallback proof).
**Merge plan**:
`.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md`
— archived as complete on 2 April 2026.
**Queued prerequisite**:
`.agent/plans/sdk-and-mcp-enhancements/current/ws3-design-token-prerequisite.plan.md`
— required before Phase 4 and Phase 5 start.
**Pending**: Phase 4 (curriculum view), Phase 5 (search view), Phase 6
(docs/gates/review). These need design token infrastructure as a
prerequisite.

**Next action**: Execute the queued design-token prerequisite and then start
Phase 4 widget UI work.

### 2. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 3. Continuity Adoption — WAVE 1 INSTALLED

**Plan**: `.agent/plans/agentic-engineering-enhancements/current/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 surfaces landed. Evidence capture now includes two
deep-consolidation entries, but the evidence window is not yet complete
because the resumption and `GO` quotas are still open.

### 4. Assumptions Reviewer — COMPLETE

ADR-146 accepted, triplet deployed, platform adapters created.

### 5. URL Naming Collision Remediation — COMPLETE

Completed 2026-04-01.

## Core Invariant (WS3)

This workstream is a clean-break replacement:

- replace the out-of-date OpenAI-era app integration with a brand-new MCP App
- keep `search` as the model-facing, agent-facing search interface
- add `user-search` as a UI-first, user-first MCP App tool
- do not introduce custom tool-discovery, visibility, or presentation shims

## Durable Guidance

- Run `pnpm qg` as the canonical non-mutating readiness gate before each commit.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the full scrub before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
