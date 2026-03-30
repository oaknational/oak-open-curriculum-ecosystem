---
name: "WS3 Phase 4: Curriculum Model View"
overview: "Deliver first routed view in the new MCP App shell for get-curriculum-model."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: red-view-tests
    content: "Write RED tests for routed curriculum-model rendering and empty/error states."
    status: pending
  - id: build-curriculum-view
    content: "Implement shell routing and curriculum renderer in React app."
    status: pending
  - id: host-events
    content: "Handle tool and host lifecycle events via MCP Apps SDK integration."
    status: pending
---

# WS3 Phase 4: Curriculum Model View

## Tasks

1. Add RED tests for routed rendering, empty state, and error state
2. Build shared app shell and route for `get-curriculum-model`
3. Implement curriculum renderer and Oak visual identity via CSS variables
4. Ensure external links route through `app.openLink()`
5. Exercise app lifecycle handling (`ontoolinput`, `ontoolresult`, `ontoolcancelled`, `onteardown`, `onhostcontextchanged`, `onerror`)

## Acceptance Evidence

1. Curriculum model renders in fresh MCP App shell
2. Lifecycle handling is wired through MCP Apps SDK primitives
3. Local verification succeeds in upstream `basic-host`
