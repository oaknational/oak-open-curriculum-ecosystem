# agent-tools workspace

This workspace is the TypeScript home for agent operational CLIs.
AGENT.md links here for the CLI catalogue instead of repeating the commands.

It provides four operator tools:

- `agent-identity`: derive deterministic agent display names from explicit stable seeds.
- `claude-agent-ops`: monitor background agents, inspect logs, diff worktrees, run preflight checks, and run a summary-first health probe for agent infrastructure drift.
- `cursor-session-from-claude-session`: find/inspect Claude sessions and generate Cursor takeover bundles with an explicit reintegration contract.
- `codex-reviewer-resolve`: resolve a repo-local Codex reviewer adapter to the exact `.codex` and canonical `.agent` files that should ground a review.

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
pnpm agent-tools:test:e2e
pnpm agent-tools:agent-identity --seed example-session-id-001 --format display
pnpm agent-tools:claude-agent-ops status
pnpm agent-tools:claude-agent-ops health
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2
pnpm agent-tools:codex-reviewer-resolve code-reviewer
```

## `agent-identity` quick reference

- `--seed <seed>` — explicit stable seed. If omitted, the CLI reads
  `CLAUDE_SESSION_ID`, then `CODEX_THREAD_ID`, then `OAK_AGENT_SEED`.
- `--format kebab|display|json` — output slug, display name, or full result.
- `OAK_AGENT_IDENTITY_OVERRIDE` — bypasses wordlist derivation with a
  type-total override result.

There is no `git config user.email` fallback. Platform wrappers or harness
environments must pass an explicit session seed, and current
Claude/Codex/Cursor wrapper status is documented in
[docs/agent-identity.md](docs/agent-identity.md).

Examples:

```bash
pnpm agent-tools:agent-identity --seed example-session-id-001 --format display
pnpm agent-tools:build
node agent-tools/dist/src/bin/agent-identity.js --seed example-session-id-001 --format json
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" pnpm agent-tools:agent-identity --seed any --format display
```

## `claude-agent-ops` quick reference

- `status [--watch]` — list known background agents and their current phase
- `health` — run the summary-first agent-infrastructure health probe
- `worktrees` — list active Claude agent worktrees and their branch/change counts
- `log <id>` — show phase plus recent tool activity for one agent
- `diff [id]` — diff the main repo or one agent worktree
- `commit-ready` — count changed files in the main tree and each agent worktree
- `preflight` — run quick cleanliness plus non-mutating infrastructure checks
  (`pnpm portability:check`, `pnpm test:root-scripts`)
- `cleanup` — remove clean leftover agent worktrees

The `health` command is intentionally content-free by default. It reports
structural drift across command adapters, reviewer registrations, hook Policy
Spine coherence, practice-box state, and continuity-prompt freshness.

Examples:

```bash
pnpm agent-tools:claude-agent-ops help
pnpm agent-tools:claude-agent-ops status --watch
pnpm agent-tools:claude-agent-ops health
pnpm agent-tools:claude-agent-ops diff 143494d9
```

## `cursor-session-from-claude-session` quick reference

- `find` — list recent sessions, optionally ranked by `--file` relevance
- `inspect <session-id>` — show details for one session prefix
- `takeover <session-id> --output <file>` — write a takeover bundle with a reintegration contract for the parent lane

Examples:

```bash
pnpm agent-tools:cursor-session-from-claude-session help
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 4 --file "apps/oak-search-cli/src/cli/admin/index.ts"
pnpm agent-tools:cursor-session-from-claude-session inspect 143494d9
pnpm agent-tools:cursor-session-from-claude-session takeover 143494d9 --output .agent/prompts/takeover.md
```

## `codex-reviewer-resolve` quick reference

- `<agent-name>` — print the repo-local Codex adapter path plus the canonical `.agent` files that the reviewer must load first
- `--json` — emit the same data as JSON for automation or audit logs

The resolver expects the live repo pattern: a central `.codex/config.toml`
registration plus a self-describing `.codex/agents/*.toml` adapter whose
`name` and `description` match the registry entry.

Examples:

```bash
pnpm agent-tools:codex-reviewer-resolve sentry-reviewer
pnpm agent-tools:codex-reviewer-resolve architecture-reviewer-fred --json
```

## Repo gate status

`agent-tools` checks currently run via:

- `pnpm agent-tools:build`
- `pnpm agent-tools:lint`
- `pnpm agent-tools:test`
- `pnpm agent-tools:test:e2e`
