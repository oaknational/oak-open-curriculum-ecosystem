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

- `.env.local` files must mirror the structure of `.env.example` (same section headers, ordering, documentation comments)
- Scope changes precisely — when asked for "only config, no code", respect that boundary strictly

## Learned Workspace Facts

- Sentry org: `oak-national-academy`, MCP server project: `oak-open-curriculum-mcp`, region: `de.sentry.io` (EU)
- Sentry MCP server (`sentry-ooc-mcp`) is project-scoped via URL path to `oak-national-academy/oak-open-curriculum-mcp`
- Vercel project for MCP HTTP server: `poc-oak-open-curriculum-mcp` at `vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp`
- Sentry DSN is public (not a secret per Sentry docs); safe as regular (non-sensitive) Vercel env vars
- On Vercel, `SENTRY_RELEASE` and `SENTRY_ENVIRONMENT` auto-resolve from `VERCEL_GIT_COMMIT_SHA` and `VERCEL_ENV`
