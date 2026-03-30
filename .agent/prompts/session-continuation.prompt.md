---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-30
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read the live MCP Apps planning stack in this order:
   - `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/current/README.md`
3. Reconfirm the WS3 non-negotiable invariant from the child plan:
   - complete replacement of the legacy OpenAI-era widget stack
   - no conversion, no compatibility bridge, no renamed globals
   - one brand-new MCP App built on `@modelcontextprotocol/ext-apps`
4. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -5
```

5. Run the canonical WS3 runtime contamination check command from the child
   plan before and after substantive changes.
6. Reconfirm `Canonical Compliance Checklist` in the WS3 child plan before
   changing runtime behaviour, metadata visibility, resource identity, or auth.

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Active Work

### WS3: Fresh React MCP App Rebuild

**Status**: Active implementation track.

**Child plan**:
`.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

**Immediate priority**: execute the WS3 child plan from Phase 0.

## Core Invariant

This workstream is a clean-break replacement:

- replace the out-of-date OpenAI-era app integration with a brand-new MCP App
- keep `search` as the model-facing, agent-facing search interface
- add `user-search` as a UI-first, user-first MCP App tool built alongside the
  other aggregated tools
- keep `user-search-query` app-only via canonical metadata visibility
  (`_meta.ui.visibility`) when still justified by the active plan
- do not introduce custom tool-discovery, visibility, or presentation shims in
  the HTTP app

## Durable Guidance

- Run `pnpm check` before every push.
- Run `pnpm qg` before every commit.
- Run `pnpm fix` to apply auto-fixes.
- Keep this prompt concise and operational; do not duplicate plan authority.
