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
**Last Updated**: 2026-04-09

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
