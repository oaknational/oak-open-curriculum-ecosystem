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

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 5 section and target
   architecture section 3 (data/state model)
2. Phase 3 acceptance evidence — `user-search` and `user-search-query`
   descriptors and visibility metadata must be in place
3. Phase 4 acceptance evidence — shared app shell and routing must be working

## Tasks

1. Add RED tests for search submission and loading/error/empty/result states
2. Add RED tests for helper tool behaviour and selection-to-model-context sync
3. Implement `user-search` view using `app.callServerTool()`
4. Keep `user-search-query` app-only helper behaviour metadata-driven
5. Keep iframe data flow MCP-only (no direct iframe HTTP fetch for business data)
6. Validate result shape before render at component boundary
7. Handle MCP data flow resilience:
   - graceful error states if `app.callServerTool()` rejects or times out
   - cancellation handling on app teardown (pending tool calls should not leave
     the UI in an inconsistent state)
   - result size awareness: if search results are large, paginate or truncate
     before rendering (MCP message size is host-dependent)
8. Run `pnpm check` to verify

## Acceptance Evidence

1. Search runs through MCP tool calls only
2. Helper-tool visibility and invocation path remain canonical
3. Model context updates happen only when model needs explicit selection context
4. UI state remains local to React app with no compatibility bridge state model
5. Error, timeout, and teardown states are tested and produce user-visible
   feedback (not silent failures)
6. `pnpm check` passes
