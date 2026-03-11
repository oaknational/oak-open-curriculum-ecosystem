# agent-tools workspace

This workspace is the TypeScript home for agent operational CLIs.

It provides two operator tools:

- `claude-agent-ops`: monitor background agents, inspect logs, diff worktrees, run preflight checks.
- `cursor-session-from-claude-session`: find/inspect Claude sessions and generate Cursor takeover bundles.

## Structure

```text
agent-tools/
├─ src/bin/      # CLI entrypoints
├─ src/core/     # Shared runtime/session helpers
└─ tests/        # Unit/integration/e2e coverage
```

## Commands

From repo root:

```bash
pnpm agent-tools:build
pnpm agent-tools:lint
pnpm agent-tools:test
pnpm agent-tools:claude-agent-ops status
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2
```

## `cursor-session-from-claude-session` quick reference

- `find` — list recent sessions, optionally ranked by `--file` relevance
- `inspect <session-id>` — show details for one session prefix
- `takeover <session-id> --output <file>` — write a takeover bundle

Examples:

```bash
pnpm agent-tools:cursor-session-from-claude-session help
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 4 --file "apps/oak-search-cli/src/cli/admin/index.ts"
pnpm agent-tools:cursor-session-from-claude-session inspect 143494d9
pnpm agent-tools:cursor-session-from-claude-session takeover 143494d9 --output .agent/prompts/takeover.md
```

## Repo gate status

`agent-tools` checks currently run via:

- `pnpm agent-tools:build`
- `pnpm agent-tools:lint`
- `pnpm agent-tools:test`
