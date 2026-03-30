---
name: "WS3 Phase 1: Delete Legacy Widget Framework"
overview: "Remove dead OpenAI-era widget framework files and references after replacement contract tests are in place."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: replacement-tests
    content: "Ensure replacement tests are RED then GREEN before deleting legacy tests."
    status: pending
  - id: delete-legacy-files
    content: "Delete legacy widget runtime, renderers, and preview emulation surfaces."
    status: pending
  - id: delete-legacy-guidance
    content: "Remove active-path docs/comments that still describe deleted runtime as current."
    status: pending
---

# WS3 Phase 1: Delete Legacy Widget Framework

## Tasks

1. Confirm replacement tests for new MCP App contract are non-vacuous and green
2. Delete legacy widget framework files listed in WS3 parent Phase 1
3. Remove preview shim/emulation files whose sole purpose is preserving dead runtime
4. Delete legacy tests only after equivalent-or-stronger replacement coverage exists
5. Remove active comments/docs that still present legacy runtime as live

## Acceptance Evidence

1. No active product code depends on `window.openai` or `text/html+skybridge`
2. No legacy widget resource/script remains reachable as runtime fallback
3. Deletion sequence preserved test safety (replacement tests prove coverage)
