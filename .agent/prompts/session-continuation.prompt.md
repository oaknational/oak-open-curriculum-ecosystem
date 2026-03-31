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
3. Read the auth closure gate plans that block migration closure:
   - `.agent/plans/sdk-and-mcp-enhancements/current/auth-safety-correction.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/current/auth-boundary-type-safety.plan.md`
4. Reconfirm the WS3 non-negotiable invariant from the child plan:
   - complete replacement of the legacy OpenAI-era widget stack
   - no conversion, no compatibility bridge, no renamed globals
   - one brand-new MCP App built on `@modelcontextprotocol/ext-apps`
5. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -5
```

6. Run the canonical WS3 runtime contamination check command from the child
   plan before and after substantive changes.
7. Reconfirm `Canonical Compliance Checklist` in the WS3 child plan before
   changing runtime behaviour, metadata visibility, resource identity, or auth.
8. Before treating WS3/WS4 as complete, verify C8 closure gates are complete
   (or explicitly superseded by accepted architecture).

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

**Immediate priority**: execute the WS3 child plan from the next pending phase.

**Phase execution detail**: each WS3 phase has a companion child plan linked in
the WS3 child plan's `Phase Companion Plans` section. Phase 0 is complete.
Continue with the next pending phase:

- `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-1-delete-legacy-widget-framework.plan.md`

**Closure gate note**: WS3/WS4 implementation can progress, but migration closure
is blocked until C8 auth hardening plans in `current/` are complete (or
explicitly superseded by accepted architecture).

**Reviewer-validated findings (2026-03-30)**: The Phase 3 companion plan
(`.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-3-canonical-contracts-and-runtime.plan.md`)
contains a `Reviewer-Validated Findings` section with 6 binding constraints
confirmed by MCP, architecture, and resilience reviewers. These are pre-resolved
decisions — do not re-open them without new evidence:

1. B3 Hybrid (`tools-list-override.ts`) must be retained
2. B3 Hybrid adaptation must precede `registerAppTool` adoption
3. C8 auth hardening is a merge prerequisite for Phase 3 task 9
4. `_meta.ui.visibility` is an array (`["app"]` for app-only helpers)
5. Aggregated tool pattern is an accepted cardinal-rule exception
6. `ontoolinputpartial` is a required lifecycle handler

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

- Run `pnpm qg` as the canonical non-mutating readiness gate before each commit.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the full scrub before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
