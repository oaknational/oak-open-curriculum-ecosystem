<!-- Rapidly become a standard file for AI Agent config-ish instructions. -->
<!-- Also the default file for Codex agent instructions -->

# AGENTS.md

Read [AGENT.md](.agent/directives/AGENT.md)

## Agent Tool Discovery

Primary agent workflow CLIs live in `agent-tools/` and are invoked from repo root:

- `pnpm agent-tools:claude-agent-ops status`
- `pnpm agent-tools:claude-agent-ops health`
- `pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2`
- `pnpm agent-tools:codex-reviewer-resolve code-reviewer`

## Learned User Preferences

- For long or multi-phase work (including GO-style cadence), invoke specialist reviewers (code-reviewer, architecture reviewers, and other relevant reviewers) repeatedly during the work, not only at the end.

## Learned Workspace Facts

- In `apps/oak-curriculum-mcp-streamable-http`, MCP App widget HTML is produced by `pnpm build:widget` (Vite writes to `.widget-build/`, then `scripts/embed-widget-html.js` generates committed `src/generated/widget-html-content.ts`); production serves it by wrapping `createApp` in `src/index.ts` with `getWidgetHtml: () => WIDGET_HTML_CONTENT`, not by reading HTML from `dist/` at runtime.
