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

**Status**: PENDING — blocked on `../current/ws3-contrast-validation-prerequisite.plan.md`
**Last Updated**: 2026-04-03

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 4 section and target
   architecture sections 2 (React + ext-apps/react) and 3 (data/state model)
2. `mcp-apps-support.research.md` — canonical React UI model
3. `../current/ws3-design-token-prerequisite.plan.md` — token package delivery
   path, canonical `useApp(...)` shell replacement, and widget CSS import must
   land before Phase 4 starts; Phase 4 must treat package CSS as the only
   permitted styling source
4. Phase 3 acceptance evidence — resource identity and tool descriptors must be
   in place before building views that consume them

## Tasks

1. Add RED tests for routed rendering, empty state, and error state
2. Build the `get-curriculum-model` route inside the live prerequisite shell
3. Implement curriculum renderer and Oak visual identity via
   `@oaknational/oak-design-tokens`
4. Ensure external links route through `app.openLink()`
5. Exercise app lifecycle handling (`ontoolinput`, `ontoolinputpartial`,
   `ontoolresult`, `ontoolcancelled`, `onteardown`, `onhostcontextchanged`,
   `onerror`)
6. Run `pnpm check` to verify

## Acceptance Evidence

1. Curriculum model renders in fresh MCP App shell
2. The shared shell consumes `@oaknational/oak-design-tokens` CSS rather than
   permanent app-local brand values or any surviving scaffold fallback
3. Lifecycle handling is wired through MCP Apps SDK primitives (including
   `ontoolinputpartial` for streaming partial arguments)
4. Local verification succeeds in upstream `basic-host`
5. `pnpm check` passes
