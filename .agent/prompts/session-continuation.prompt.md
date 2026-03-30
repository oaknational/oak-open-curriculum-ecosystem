---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-30
---

# Session Continuation

## Ground First

1. Read and internalise `.agent/directives/AGENT.md` and
   `.agent/directives/principles.md` — these are authoritative and
   override any conflicting detail in this prompt.
2. Find the current active plans:
   - Parent: `mcp-app-extension-migration.plan.md`
   - **Active child**: `ws3-widget-clean-break-rebuild.plan.md` — reviewed
     by 10 specialists, ready for implementation. Start at Phase 0.
3. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -5
```

## This Prompt's Role

- This file is the operational entry point only.
- The active plan is authoritative for scope, sequencing, acceptance
  criteria, and detailed validation.

## Active Work

### WS3: Widget Clean-Break Rebuild

**Status**: Child plan complete and reviewed by 10 specialists. Ready
for implementation.

**Child plan**: `ws3-widget-clean-break-rebuild.plan.md` (in
`.agent/plans/sdk-and-mcp-enhancements/active/`)

**What must happen next session**: Implement the WS3 child plan starting
at Phase 0 (selective commit of uncommitted changes, quality gate
baseline).

**Key decisions** (settled during plan review):

1. **Single MCP App** with internal routing on tool name (not two apps)
2. **Only 2 tools get UI**: `get-curriculum-model` + `user-search` (NEW)
3. **Official canonical stack**: React 19 + Vite 6 + `vite-plugin-singlefile`
4. **Existing codegen model preserved** — one URI, populate `WIDGET_TOOL_NAMES`
5. **Oak brand primary** — Lexend, green palette, host light/dark respected
6. **19 uncommitted files** on `feat/mcp_app_ui` — Phase 0 triages these
7. **~35 markdown files** still reference `window.openai` — cleaned in Phase 6

## Scope Boundaries (do NOT)

- Do not introduce shims, compatibility layers, or workarounds of
  any kind (principle in `principles.md`).
- Do not refactor `apps/oak-curriculum-mcp-stdio`.

## Durable Guidance

- **Run `pnpm check` before every push.**
- `pnpm qg` before every commit (quick read-only check).
- `pnpm fix` auto-fixes format, markdownlint, lint.
- Turbo task-specific overrides (`@package#task`) REPLACE generic
  tasks entirely. Always verify with `turbo run <task> --dry=json`.

## Quality Gates

Full verification: `pnpm check`
Read-only check: `pnpm qg`
Auto-fix: `pnpm fix`
