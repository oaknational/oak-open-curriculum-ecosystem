# agent-tools workspace

This workspace is the TypeScript home for agent operational CLIs.
AGENT.md links here for the CLI catalogue instead of repeating the commands.

## Boundary

`agent-tools` is a host-local implementation surface, not the Practice
itself. It operationalises capabilities that a hydrated Practice may need,
but the portable contract lives in `.agent/` doctrine, rules, skills, and
commands. Another repo could provide equivalent capabilities in Python,
Rust, Java, shell, CI jobs, editor extensions, MCP tools, or no local tool
at all when the capability is unnecessary there.

Keep this workspace's TypeScript-specific state thin. Behaviour that should
travel between repos belongs in the Practice or in an ecosystem-agnostic
capability description; TypeScript implementation details stay here.
In particular, agent collaboration, coordination, work management,
direction, lifecycle, identity, claims, handoff, review routing, and
adjacent mechanisms are Practice substance by default per
[PDR-035](../.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md).
This repository's local implementation boundary is recorded in
[ADR-165](../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md).

It provides five operator tools:

- `agent-identity`: derive deterministic agent display names from explicit stable seeds.
- `collaboration-state`: safely mutate shared collaboration state with identity preflight, immutable comms events, transaction-guarded JSON writes, and TTL cleanup.
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
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
pnpm agent-tools:claude-agent-ops status
pnpm agent-tools:claude-agent-ops health
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2
pnpm agent-tools:codex-reviewer-resolve code-reviewer
```

## `agent-identity` quick reference

- `--seed <seed>` — explicit stable seed. If omitted, the CLI reads
  `PRACTICE_AGENT_SESSION_ID_CLAUDE`, then
  `PRACTICE_AGENT_SESSION_ID_CURSOR`, then
  `PRACTICE_AGENT_SESSION_ID_CODEX`, then `CODEX_THREAD_ID`.
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

## `collaboration-state` quick reference

- `identity preflight` — emit the collaboration-state identity block with
  `agent_name`, `platform`, `model`, `session_id_prefix`, and seed source.
- `comms append` / `comms render` — append immutable communication events and
  render `shared-comms-log.md`.
- `claims open|heartbeat|close|archive-stale` — mutate active and closed
  claim state through the JSON transaction helper.
- `conversation append` — append a structured decision-thread entry.
- `escalation open|close` — write an owner-escalation record.
- `check` — parse collaboration JSON and comms events for a quick sanity check.

Codex sessions with `CODEX_THREAD_ID` available must not write shared state as
`Codex` / `unknown`; run preflight first and use the derived identity.

Example:

```bash
CODEX_THREAD_ID=019dd34d-cb6a-74e0-a29d-6cb8a65ea14b \
  pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
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
