# agent-tools workspace

This workspace is the TypeScript home for agent operational CLIs.

## Commands

From repo root:

```bash
pnpm agent-tools:build
pnpm agent-tools:lint
pnpm agent-tools:test
pnpm agent-tools:claude-agent-ops status
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2
```

## Repo gate status

`agent-tools` checks currently run via:

- `pnpm agent-tools:build`
- `pnpm agent-tools:lint`
- `pnpm agent-tools:test`
