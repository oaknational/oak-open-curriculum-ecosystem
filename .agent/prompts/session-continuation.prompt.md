---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-01
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read the active planning stack relevant to your work:
   - **Frontend/Practice work**: `.agent/plans/agentic-engineering-enhancements/active/frontend-practice-integration-and-specialist-agents.plan.md`
   - **URL remediation work**: `.agent/plans/sdk-and-mcp-enhancements/current/url-naming-collision-remediation.plan.md`
   - **WS3 widget work**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` and its phase children
3. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Active Workstreams (2026-04-01)

### 1. Frontend Practice Integration (NEW — blocking WS3 Phases 4-5)

Research complete. The plan at
`.agent/plans/agentic-engineering-enhancements/active/frontend-practice-integration-and-specialist-agents.plan.md`
has 6 phases:

- Phase 0: Render plan decision-complete (resolve 6 open questions)
- Phase 1: Practice integration (adopt Core Proposals + transferable patterns)
- Phase 2: Create specialist agents (accessibility, design-system, react-component)
- Phase 3: Agents review Practice integration output
- Phase 4: Design token infrastructure (BLOCKS widget UI work)
- Phase 5-6: Provenance UUIDs + tandem improvement (ongoing)

The practice box (`.agent/practice-core/incoming/`) has files; integration
is planned for Phase 1 of this plan. Do not clear them yet.

### 2. URL Naming Collision Remediation

Plan at `.agent/plans/sdk-and-mcp-enhancements/current/url-naming-collision-remediation.plan.md`.
Rename `canonicalUrl` → `oakUrl` to align with upstream, fix decorator
behaviour, update ADRs.

### 3. WS3 Phase 3 Closure (mostly complete)

WS3 Phase 3 truth-repair is green. C8 auth closure is complete. The
broader Phase 3 plan carries one deferred item (non-UI host fallback
evidence). WS3 Phases 4-5 (widget UI) are now blocked by the frontend
Practice integration plan (token infrastructure must exist first).

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
