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

## Tasks

1. Add RED tests for search submission and loading/error/empty/result states
2. Add RED tests for helper tool behaviour and selection-to-model-context sync
3. Implement `user-search` view using `app.callServerTool()`
4. Keep `user-search-query` app-only helper behaviour metadata-driven
5. Keep iframe data flow MCP-only (no direct iframe HTTP fetch for business data)
6. Validate result shape before render at component boundary

## Acceptance Evidence

1. Search runs through MCP tool calls only
2. Helper-tool visibility and invocation path remain canonical
3. Model context updates happen only when model needs explicit selection context
4. UI state remains local to React app with no compatibility bridge state model
