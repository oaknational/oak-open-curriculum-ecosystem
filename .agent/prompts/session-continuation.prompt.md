---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-31-d
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read the merge plan only as supporting historical evidence:
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-merge-main-into-branch.plan.md`
   - Focus on the **Execution Record** section at the bottom for what actually happened
   - Do not treat the merge plan as the current execution driver
3. Read the live MCP Apps planning stack in this order:
   - `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-3-canonical-contracts-and-runtime.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-3-execution.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/current/README.md`
4. If the closure work is active, also read:
   - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-3-schema-fallout-closure.plan.md`
5. Read the auth closure gate plans that previously blocked migration closure:
   - `.agent/plans/sdk-and-mcp-enhancements/current/auth-safety-correction.plan.md`
   - `.agent/plans/sdk-and-mcp-enhancements/current/auth-boundary-type-safety.plan.md`
6. Reconfirm the WS3 non-negotiable invariant from the child plan:
   - complete replacement of the legacy OpenAI-era widget stack
   - no conversion, no compatibility bridge, no renamed globals
   - one brand-new MCP App built on `@modelcontextprotocol/ext-apps`
7. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

8. Run the canonical WS3 runtime contamination check command from the child
   plan before and after substantive changes.
9. Reconfirm `Canonical Compliance Checklist` in the WS3 child plan before
   changing runtime behaviour, metadata visibility, resource identity, or auth.
10. Before treating WS3/WS4 as complete, verify C8 closure gates are complete.

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Active Work

### Current Closure State (2026-03-31, late evening)

The WS3 Phase 3 truth-repair and two-stage closure batch is green in the
working tree.

- Stage 1 closure is complete: widget resource registration now takes
  `ResourceRegistrationOptions.getWidgetHtml`, production reads
  `dist/mcp-app.html` through the injected provider, and the resource
  integration tests use deterministic inline HTML instead of a build artefact.
- Stage 2 closure is complete: lesson-summary fixtures in
  `curriculum-sdk` and `oak-search-cli` now satisfy the generated
  `canonicalUrl` / `oakUrl` requirements, with shared helper centralisation and
  explicit negative coverage.
- Validation is green: the targeted workspace gates, `pnpm check`, and
  `pnpm qg` all pass on the current tree.
- Reviewer state is complete for this closure batch: `type-reviewer`,
  `test-reviewer`, and `code-reviewer` findings were addressed;
  `security-reviewer` and `architecture-reviewer-fred` returned no findings;
  `mcp-reviewer` hung twice and produced no findings.
- C8 auth closure is complete (`auth-safety-correction.plan.md` and
  `auth-boundary-type-safety.plan.md`), so it no longer blocks WS3 closure.
- The queued `current/canonical-url-enforcement.plan.md` remains separate from
  this closure work.
- The broader parent Phase 3 plan still carries one deferred item:
  explicit non-UI host fallback evidence. That is no longer the blocker for
  this closure batch and remains tracked in the parent plan.

If you are continuing this exact branch state, the next concrete action is to
commit the relevant WS3 Phase 3 closure changes.

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
