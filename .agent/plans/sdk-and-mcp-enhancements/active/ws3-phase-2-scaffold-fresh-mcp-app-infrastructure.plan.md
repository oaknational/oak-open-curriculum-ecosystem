---
name: "WS3 Phase 2: Scaffold Fresh MCP App Infrastructure"
overview: "Create the new React MCP App build/test/tooling foundation and make it first-class in workspace pipelines."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: red-build-tests
    content: "Write RED tests for widget build output and shell markers."
    status: completed
  - id: scaffold-widget
    content: "Create widget build target and baseline React shell files."
    status: completed
  - id: tooling-integration
    content: "Wire Turbo, ESLint, type-check, and widget Vitest config."
    status: completed
---

# WS3 Phase 2: Scaffold Fresh MCP App Infrastructure

**Status**: COMPLETE
**Last Updated**: 2026-03-31

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 2 section lists specific
   files to create, dependencies to add, and tooling corrections
2. `mcp-apps-support.research.md` — canonical React UI model and build
   implications
3. Phase 1 acceptance evidence — Phase 2 must not start until Phase 1 is
   complete (see Phase 1 ordering constraint)

## Tasks

1. Write RED tests for build output, shell render markers, and tooling coverage
2. Scaffold nested `widget/` target (`mcp-app.html`, Vite config, TS config, entrypoint, CSS)
3. Add required React/Vite/testing dependencies from WS3 parent plan
4. Integrate tooling:
   - Turbo inputs include widget source files
   - ESLint includes `.tsx`
   - type-check includes `.tsx`
   - dedicated DOM-capable Vitest config for widget tests
5. Keep local verification on upstream `basic-host` (from
   `@modelcontextprotocol/ext-apps` — see its examples/ directory or npm
   scripts); do not add a custom preview shim
6. Run `pnpm check` to verify full pipeline integration

## Acceptance Evidence

1. Build outputs self-contained `dist/mcp-app.html`
2. Turbo invalidates on widget `ts`, `tsx`, `css`, and `html`
3. Lint/type-check/test pipelines include widget source set
4. Widget-specific lint and type-check config is scoped to `widget/` paths
   only — React/DOM rules do not bleed into server-side lint. This is the
   structural investment that makes future extraction to a separate package
   cheap if a second consumer ever appears. (Source: Betty review.)
5. `pnpm check` passes with the new widget build integrated
