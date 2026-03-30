---
name: "WS3 Phase 2: Scaffold Fresh MCP App Infrastructure"
overview: "Create the new React MCP App build/test/tooling foundation and make it first-class in workspace pipelines."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: red-build-tests
    content: "Write RED tests for widget build output and shell markers."
    status: pending
  - id: scaffold-widget
    content: "Create widget build target and baseline React shell files."
    status: pending
  - id: tooling-integration
    content: "Wire Turbo, ESLint, type-check, and widget Vitest config."
    status: pending
---

# WS3 Phase 2: Scaffold Fresh MCP App Infrastructure

## Tasks

1. Write RED tests for build output, shell render markers, and tooling coverage
2. Scaffold nested `widget/` target (`mcp-app.html`, Vite config, TS config, entrypoint, CSS)
3. Add required React/Vite/testing dependencies from WS3 parent plan
4. Integrate tooling:
   - Turbo inputs include widget source files
   - ESLint includes `.tsx`
   - type-check includes `.tsx`
   - dedicated DOM-capable Vitest config for widget tests
5. Keep local verification on upstream `basic-host`; do not add preview shim

## Acceptance Evidence

1. Build outputs self-contained `dist/mcp-app.html`
2. Turbo invalidates on widget `ts`, `tsx`, `css`, and `html`
3. Lint/type-check/test pipelines include widget source set
