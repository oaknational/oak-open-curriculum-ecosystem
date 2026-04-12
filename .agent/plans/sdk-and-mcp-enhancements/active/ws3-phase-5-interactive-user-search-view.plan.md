---
name: "WS3 Phase 5: Interactive User Search View"
overview: "Deliver user-search MCP App view and helper-tool flow without violating app/SDK boundaries."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: red-search-tests
    content: "Write RED tests for search flow, states, helper-tool behaviour, and model-context sync."
    status: pending
  - id: build-user-search
    content: "Implement user-search UI interactions using app.callServerTool."
    status: pending
  - id: helper-tool-policy
    content: "Validate app-only helper behaviour for user-search-query under canonical visibility metadata."
    status: pending
---

# WS3 Phase 5: Interactive User Search View

**Status**: PENDING — blocked on PR #76 merge; Phase 4.5 prerequisite is complete
**Last Updated**: 2026-04-12

## Pre-Phase Blockers (from 2026-04-12 MCP Apps audit)

These items must be resolved before or during Phase 5 implementation:

1. **Remove `search` tool's `_meta.ui` claim.** The agent-facing `search`
   tool currently declares `_meta.ui.resourceUri` (widget UI), but ordinary
   search should NOT be a widget tool. Only `user-search` should render the
   interactive search UI. Remove `search` from the `WIDGET_TOOL_NAMES`
   allowlist and from its aggregated definition's `_meta.ui`. Cross-ref:
   `meta-oak-namespace-cleanup.plan.md` (same `_meta` architecture scope).

2. **Consolidate to a single user-facing search tool.** The server currently
   registers both `user-search` and `search` as model-visible tools with
   widget UI. There should be only ONE user-facing search tool (`user-search`)
   that renders the interactive widget. `search` should remain as an
   agent-only tool (no `_meta.ui`). Investigate why both exist with UI
   metadata and unify.

See also: `.agent/plans/sdk-and-mcp-enhancements/current/meta-oak-namespace-cleanup.plan.md`
for the broader `_meta` architecture cleanup that is a prerequisite or
co-requisite for this work.

## Required Inputs

1. `../archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md` —
   completed prerequisite. The live React MCP App foundation and SDK-ready tool
   metadata are already in place for Phase 5 to build on after merge.
2. `ws3-widget-clean-break-rebuild.plan.md` — Phase 5 section and target
   architecture section 3 (data/state model)
3. Phase 3 acceptance evidence — `user-search` and `user-search-query`
   descriptors and visibility metadata must be in place
4. `../archive/completed/ws3-design-token-prerequisite.plan.md` — shared token
   package and canonical shell replacement are already available; Phase 5 must
   reuse package CSS rather than adding a second styling layer
5. Phase 4 + 4.5 acceptance evidence — live React app shell must be working

## Tasks

1. Add RED tests for search submission and loading/error/empty/result states
2. Add RED tests for helper tool behaviour and selection-to-model-context sync
3. Implement `user-search` view using `app.callServerTool()`
4. Keep `user-search-query` app-only helper behaviour metadata-driven
5. Consume the shared token package from Phase 4 rather than introducing a
   second local styling layer or reviving scaffold-era CSS
6. Keep iframe data flow MCP-only (no direct iframe HTTP fetch for business data)
7. Validate result shape before render at component boundary
8. Handle MCP data flow resilience:
   - graceful error states if `app.callServerTool()` rejects or times out
   - cancellation handling on app teardown (pending tool calls should not leave
     the UI in an inconsistent state)
   - result size awareness: if search results are large, paginate or truncate
     before rendering (MCP message size is host-dependent)
9. Run `pnpm check` to verify

## Acceptance Evidence

1. Search runs through MCP tool calls only
2. Helper-tool visibility and invocation path remain canonical
3. Model context updates happen only when model needs explicit selection context
4. UI state remains local to React app with no compatibility bridge state model
5. Shared token-package styling is reused rather than forked inside Phase 5
6. The prerequisite shell remains the only shell; Phase 5 does not reintroduce
   scaffold copy or local brand fallback CSS
7. Error, timeout, and teardown states are tested and produce user-visible
   feedback (not silent failures)
8. `pnpm check` passes
