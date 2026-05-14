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

It provides a unified `agent-tools` entrypoint with topic dispatch for the
hot collaboration tools, plus specialised operator tools that still own their
domain-specific flows:

- `agent-identity`: derive deterministic agent display names from explicit stable seeds.
- `collaboration-state`: safely mutate shared collaboration state with identity preflight, immutable comms events, transaction-guarded JSON writes, and TTL cleanup.
- `commit-queue`: coordinate short-lived git index/head commit windows and verify staged bundles before commit.
- `branch-touched-files`: report the files touched by a branch against a base ref.
- `context-cost`: estimate chars/4 token cost for an arbitrary fileset from repeatable glob inputs.
- `claude-agent-ops`: monitor background agents, inspect logs, diff worktrees, run preflight checks, and run a summary-first health probe for agent infrastructure drift.
- `cursor-session-from-claude-session`: find/inspect Claude sessions and generate Cursor takeover bundles with an explicit reintegration contract.
- `codex-reviewer-resolve`: resolve a repo-local Codex reviewer adapter to the exact `.codex` and canonical `.agent` files that should ground a review.

## Structure

```text
agent-tools/
├─ src/bin/      # CLI entrypoints
├─ src/core/     # Shared runtime/session helpers
├─ tests/        # Shared test fakes and legacy co-located coverage
├─ e2e-tests/    # E2E suites
└─ smoke-tests/  # Local running-command smoke checks
```

## Commands

From repo root:

```bash
pnpm agent-tools:build
pnpm agent-tools:lint
pnpm agent-tools:test
pnpm agent-tools:test:e2e
pnpm agent-tools:smoke:collaboration-tui
pnpm agent-tools agent-identity --seed example-session-id-001 --format display
pnpm agent-tools collaboration-state identity preflight --platform codex --model GPT-5
pnpm agent-tools context-cost --glob '.agent/rules/*.md'
pnpm agent-tools:claude-agent-ops status
pnpm agent-tools:claude-agent-ops health
pnpm agent-tools:cursor-session-from-claude-session find --last-hours 2
pnpm agent-tools:codex-reviewer-resolve code-expert
```

## Unified entrypoint

`pnpm agent-tools <topic> <action> [options]` is the stable hot path for
collaboration tooling. The package scripts for `agent-identity`,
`collaboration-state`, `commit-queue`, `branch-touched-files`, and
`context-cost` are thin
shortcuts to the same built `dist/src/bin/agent-tools.js` file; they no longer
run `pnpm -s build` before every invocation. After editing `agent-tools`
source, run `pnpm agent-tools:build` once before using those built CLI scripts.

Examples:

```bash
pnpm agent-tools agent-identity --seed example-session-id-001 --format json
pnpm agent-tools collaboration-state claims list --active .agent/state/collaboration/active-claims.json
pnpm agent-tools commit-queue status
pnpm agent-tools branch-touched-files --json
pnpm agent-tools context-cost --glob '.agent/rules/*.md'
pnpm agent-tools --log-json agent-identity --seed example-session-id-001
```

### Human collaboration TUI

The collaboration TUI is a human observer surface about agent collaboration,
not an agent command-reading protocol. It lives in `agent-tools` because it
reads the same collaboration-state registry, comms, and claim data that the
agent commands maintain; that is a deliberate boundary choice with tension.
To keep that choice contained, the terminal app uses local Ink primitives and
does not depend on a separately built design workspace.

Humans use the live terminal view:

```bash
pnpm agent-tools collaboration-state tui
```

Agents and logs should prefer non-interactive outputs:

```bash
pnpm agent-tools collaboration-state tui --format text
pnpm agent-tools collaboration-state claims active-agents \
  --active .agent/state/collaboration/active-claims.json
pnpm agent-tools collaboration-state comms render \
  --comms-dir .agent/state/collaboration/comms \
  --shared-log .agent/state/collaboration/shared-comms-log.md
```

The automated startup smoke is intentionally separate from E2E:

```bash
pnpm agent-tools:build
pnpm agent-tools:smoke:collaboration-tui
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
pnpm agent-tools agent-identity --seed example-session-id-001 --format display
pnpm agent-tools:build
node agent-tools/dist/src/bin/agent-tools.js agent-identity --seed example-session-id-001 --format json
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" pnpm agent-tools agent-identity --seed any --format display
```

## `collaboration-state` quick reference

- `identity preflight` — emit the collaboration-state identity block with
  `agent_name`, `platform`, `model`, `session_id_prefix`, and seed source.
- `comms append` / `comms send` / `comms render` — append immutable
  communication events and render `shared-comms-log.md`. Use `send` for the
  low-boilerplate append-and-render path. `send` prints JSON with `event_id`,
  `event_path`, and `shared_log_path` so agents can verify the write target.
  Comms writes check the active-claims registry and refuse live identity-route
  collisions on `(agent_name, platform, session_id_prefix)`.
- `comms inbox` / `comms watch` / `comms direct` / `comms reply` — read
  directed messages, keep a long-lived directed-message watcher open, author
  first-strike directed messages, and reply to an existing directed message
  without hand-writing JSON. `watch` uses `fs.watch` with polling fallback and
  records seen message IDs in the caller-supplied `--seen-file`; pass
  `--session-prefix` to narrow recipient matching to the identity tuple.
  `reply` swaps the source `from` / `to` identities and defaults the subject to
  `re: <source subject>` unless `--subject` is supplied.
- `claims open|heartbeat|close|archive-stale` — mutate active and closed
  claim state through the JSON transaction helper. `claims open` prints the
  generated or supplied `claim_id` as JSON and refuses live identity-route
  collisions.
- `claims list|mine|show|status|active-agents` — inspect active claims,
  active-agent routing tuples, and freshness from `heartbeat_at ?? claimed_at`
  plus the claim TTL.
- `conversation append` — append a structured decision-thread entry.
- `escalation open|close` — write an owner-escalation record.
- `check` — parse collaboration JSON and comms events for a quick sanity check.

Codex sessions with `CODEX_THREAD_ID` available must not write shared state as
`Codex` / `unknown`; run preflight first and use the derived identity. Pass
`--active` when preflighting before a write so reused live routing tuples fail
before the shared-state mutation.

Example:

```bash
CODEX_THREAD_ID=019dd34d-cb6a-74e0-a29d-6cb8a65ea14b \
  pnpm agent-tools collaboration-state identity preflight \
    --platform codex \
    --model GPT-5 \
    --active .agent/state/collaboration/active-claims.json
pnpm agent-tools collaboration-state claims list --active .agent/state/collaboration/active-claims.json
pnpm agent-tools collaboration-state claims mine --active .agent/state/collaboration/active-claims.json --platform cursor --model GPT-5.5
pnpm agent-tools collaboration-state claims active-agents \
  --active .agent/state/collaboration/active-claims.json \
  --closed .agent/state/collaboration/closed-claims.archive.json
pnpm agent-tools collaboration-state claims open \
  --active .agent/state/collaboration/active-claims.json \
  --thread agentic-engineering-enhancements \
  --area-kind files \
  --file agent-tools/src/collaboration-state/cli.ts \
  --intent "Implement collaboration-state CLI ergonomics." \
  --now 2026-05-10T12:15:00Z \
  --platform cursor \
  --model GPT-5.5
pnpm agent-tools collaboration-state claims open \
  --active .agent/state/collaboration/active-claims.json \
  --thread agentic-engineering-enhancements \
  --area-kind files \
  --area-pattern "agent-tools/src/collaboration-state/*.ts" \
  --area-pattern "agent-tools/tests/collaboration-state/*.test.ts" \
  --intent "Inspect collaboration-state CLI surfaces." \
  --now 2026-05-10T12:15:00Z \
  --platform cursor \
  --model GPT-5.5
pnpm agent-tools collaboration-state comms send --title "Heads-up" --body "Rendered via immutable event." --platform cursor --model GPT-5.5
pnpm agent-tools collaboration-state comms direct \
  --active .agent/state/collaboration/active-claims.json \
  --messages-dir .agent/state/collaboration/comms-messages \
  --to-agent-name "Coastal Cresting Prow" \
  --to-platform codex \
  --to-model GPT-5 \
  --to-session-prefix 019e1b \
  --kind coordination-request \
  --subject "Please check this" \
  --body "Short directed message body." \
  --platform cursor \
  --model GPT-5.5
pnpm agent-tools collaboration-state comms reply \
  --active .agent/state/collaboration/active-claims.json \
  --messages-dir .agent/state/collaboration/comms-messages \
  --to-event-id 11111111-1111-4111-8111-111111111111 \
  --kind coordination-ack \
  --body "Acknowledged." \
  --platform codex \
  --model GPT-5
pnpm agent-tools collaboration-state comms watch \
  --messages-dir .agent/state/collaboration/comms-messages \
  --agent-name "Penumbral Veiling Raven" \
  --session-prefix 019e1c \
  --seen-file .agent/state/collaboration/.seen/penumbral-veiling-raven.txt
pnpm agent-tools commit-queue status
```

## `commit-queue` quick reference

- `enqueue` — register a commit intent against an active claim and print the
  generated or supplied `intent_id`.
- `guard` — pre-stage check that refuses path staging unless the current
  identity has a fresh matching queue intent backed by a `git:index/head`
  claim.
- `phase` — move an intent through `queued`, `staging`, `pre_commit`, or
  `abandoned`.
- `record-staged` / `verify-staged` — capture and verify the exact staged
  bundle before committing.
- `complete` — remove a landed intent and clear the owning claim pointer.
- `status` — print queued, active, expired, and abandoned entries as JSON
  without parsing `active-claims.json` manually.
- `list [--prefix <intent-prefix>]
[--phase <queued|staging|pre_commit|abandoned>]
[--agent-name <prefix>] [--queue-status <active|expired|abandoned>]` —
  print matching queue entries only.
- `show --intent-id <uuid>` — print one exact queue entry.

Example:

```bash
pnpm agent-tools commit-queue guard \
  --agent-name "Embered" \
  --platform codex \
  --model GPT-5 \
  --session-id-prefix 019e1c \
  --file agent-tools/src/commit-queue/index.ts
pnpm agent-tools commit-queue list --agent-name "Embered" --queue-status active
pnpm agent-tools commit-queue show --intent-id 11111111-1111-4111-8111-111111111111
```

When `.agent/state/collaboration/active-claims.json` is part of the staged
bundle, run `record-staged` once and do not re-stage that file afterwards.
`record-staged` writes the staged fingerprint into the working tree so
`verify-staged` can compare it with the already-staged payload. Re-staging the
registry after that changes the payload being verified and `verify-staged`
reports the recursion with corrective guidance.

## `claude-agent-ops` quick reference

- `status [--watch]` — list known background agents and their current phase
- `health` — run the summary-first agent-infrastructure health probe
- `worktrees` — list active Claude agent worktrees and their branch/change counts
- `log <id>` — show phase plus recent tool activity for one agent
- `diff [id]` — diff the main repo or one agent worktree
- `commit-ready` — count changed files in the main tree and each agent worktree
- `preflight` — run quick cleanliness plus non-mutating infrastructure checks
  (`pnpm portability:check`, `pnpm repo-validators:check`)
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
pnpm agent-tools:codex-reviewer-resolve sentry-expert
pnpm agent-tools:codex-reviewer-resolve architecture-expert-fred --json
```

## Repo gate status

`agent-tools` checks currently run via:

- `pnpm agent-tools:build`
- `pnpm agent-tools:lint`
- `pnpm agent-tools:test`
- `pnpm agent-tools:test:e2e`
- `pnpm agent-tools:smoke:collaboration-tui`
