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
- `protocol-conformance`: recompute the estate's collaboration-protocol tier from artefacts and gates and compare it against the declared floor.
- `mcp-conformance`: run MCPJam conformance suites (lockfile-installed `@mcpjam/cli`) against a deployed MCP surface — verdicts BY NAME against committed baselines (default), capture observation seeds for authoring baselines via `--seed`, or drive every advertised tool once with its advertised example inputs and render the reviewer walkthrough pack via `--drive` (root alias `pnpm -s mcp:conformance` — the `-s` keeps stdout pure JSON on failing runs).

## Structure

```text
agent-tools/
├─ src/bin/        # CLI entrypoints
├─ src/core/       # Shared runtime/session helpers
├─ src/refounding/ # Plan-corpus refounding instrument (run-scoped; owned by
│                  # the plan-corpus-refounding plan + G1 packet; invoked via
│                  # package scripts, no root aliases)
├─ tests/          # Shared test fakes and existing co-located coverage
├─ e2e-tests/      # E2E suites
└─ smoke-tests/    # Local running-command smoke checks
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

## CLI Norms

Every agent-tools CLI command — top-level `agent-tools`, every topic
subcommand (`agent-identity`, `collaboration-state`, `commit-queue`,
`branch-touched-files`, `context-cost`, `claude-agent-ops`, etc.), and
every action within those topics — MUST satisfy the following help
contract. This is a hard requirement.

Authoring note for new tsx-invoked entry points: register each new entry
file in `knip.config.ts`'s agent-tools entry list AT AUTHORING TIME, or the
entry reads as unused and its imports cascade into false unused-export
findings. Then un-export whatever nothing imports — an un-exported unused
type alias trips `noUnusedLocals`, so delete it rather than de-export
(cost of learning this late: one commit bounce, 2026-07-06).

- **`--help` accepts no value** and prints the full usage block for the
  command at hand: command name, all required flags marked clearly
  (asterisk, `REQUIRED` tag, or grouping header), all optional flags
  with defaults, expected value formats (uuid, ISO-8601, glob, enum with
  allowed values), and at least one example invocation.
- **On invalid flags, missing required flags, or unsupported enum values,
  print the error line AND the same full help block, then exit non-zero.**
  A single-line error response (`missing required option --xyz`;
  `unsupported area kind: foo`; `Exit status 2` with no detail) is
  insufficient.
- **Enum-shaped flags (`--area-kind`, `--platform`, `--phase`, similar)
  must list allowed values on validation failure**, not just say
  `unsupported`. The error message names the offered value, the allowed
  set, and the flag.
- **`--help` is wired at every subcommand depth**, not just at the top
  level: `pnpm agent-tools collaboration-state claims open --help` MUST
  print the `claims open` usage block, not the `collaboration-state`
  overview.

The norm exists because source-grep is an unreliable fallback under
in-flight refactors (see [`use-built-agent-tools-cli.md`](../.agent/rules/use-built-agent-tools-cli.md)):
the source structure can change between agent invocations, so the CLI
help text must be the canonical discovery surface. Owner direction
2026-05-05 after the 7-agent coordination session. Source: Claude
per-user memory `feedback_agent_tool_help_on_invalid_flags`.

In resumed, compacted, or multi-agent sessions, read the topic-specific
`--help` before relying on remembered flag shapes. Flag names can differ even
inside one topic. When searching or passing literal shell text that contains
backticks or other shell-active characters, use single quotes so the shell does
not rewrite the pattern before the CLI or `rg` receives it.

### Comms body input: `--body` vs `--body-file`

`collaboration-state comms append / send / direct / reply` accept the
event body via either `--body <inline-string>` or
`--body-file <path>`. The two flags are mutually exclusive.

Use `--body-file` when:

- the body contains backticks `` ` `` (markdown code fences,
  identifier references like `` `field_name` ``);
- the body contains dollar signs `$` that should NOT be expanded as
  variables;
- the body contains shell history-expansion characters like `!`;
- the body contains unmatched single quotes that would break single-
  quoted shell strings;
- you want the body composition entirely outside the shell argv
  layer (programmatic or template-generated content).

Use `--body` (inline) when:

- the body is short and plain-text;
- the body's content is known to be free of shell-special characters
  AND the caller controls outer quoting (e.g. inline strings without
  backticks or unescaped dollars).

The hazard: a double-quoted `--body "..."` argument allows the shell
to evaluate backtick-wrapped spans as command substitution and
dollar-prefixed tokens as variable expansion BEFORE the CLI receives
them. The body that the CLI then writes is silently corrupted. This
failure mode was observed at least three times across separate
agent sessions (see `.agent/memory/operational/pending-graduations.md`
entry "CLI body backtick-shell-substitution cure pattern" for the
cross-session trace).

`--body-file` is the cure: the shell parses only the file path; the
file contents are read literally by the CLI without any shell
interpretation. Typical usage:

```bash
# Write body to a tmp file (any heredoc / printf / editor-generated file works)
cat > tmp/event-body.txt <<'EOF'
Body with backticks like `agent-tools` and dollars like $HOME survive intact.
Multi-line content is fine.
EOF

# Pass the path; shell only parses the path, not the content
pnpm agent-tools:collaboration-state comms direct \
  --comms-dir .agent/state/collaboration/comms \
  --to-agent-name 'Other Agent' \
  --to-id 1bb4df59-58e8-5b71-b41b-eebd1f587dda \
  --to-platform claude \
  --to-model claude-opus-4-7 \
  --to-session-prefix d4aad7 \
  --kind directed \
  --subject 'A subject' \
  --body-file tmp/event-body.txt \
  --platform claude --model claude-opus-4-7 \
  --active .agent/state/collaboration/active-claims.json
```

For directed messages (`comms direct` / `comms reply`), the body
(whether inline or from file) must contain at least one non-
whitespace character after trimming; an empty file is rejected as
"--body (or --body-file contents) must not be empty".

Further hardening of comms body input (event-spec JSON file mode,
write-time body sanitisation) is tracked in
[`frictions-register.md`](../.agent/memory/operational/frictions-register.md)
entry F-32.

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
  --output .agent/state/collaboration/shared-comms-log.md
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
  `PRACTICE_AGENT_SESSION_ID_GEMINI`, then
  `PRACTICE_AGENT_SESSION_ID_CODEX`, then `CODEX_THREAD_ID`, then
  Antigravity's stable `conversationId` surfaces.
- `--format kebab|display|json` — output slug, display name, or full result.
- `OAK_AGENT_IDENTITY_OVERRIDE` — bypasses wordlist derivation with a
  type-total override result.

There is no `git config user.email` fallback. Platform wrappers or harness
environments must pass an explicit session seed. Current wrapper status,
including the difference between derived identity, Claude's statusline, and
manual `/rename` title changes, plus the current-state Codex statusline item
allowlist note, is documented in
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
- `comms watch` / `comms inbox` / `comms list` headings and summary lines,
  `comms peer-liveness` identity labels, commit-queue entries and guard
  messages, and active-agent routing summaries show the prefix as the
  **visual-disambiguator token** — a display-only render-time derivation
  with a bare-prefix fallback for id-less blocks. Never type the token into
  a flag or an authored `session_id_prefix` cell; the join key stays the
  bare prefix. Derivation, doctrine, the statusline hold-out, and a
  drift-tested example: [docs/agent-identity.md](docs/agent-identity.md).
- `comms append` / `comms send` / `comms render` — append immutable
  communication events and render `shared-comms-log.md`. Use `send` for the
  low-boilerplate append-and-render path. `send` prints JSON with `event_id`,
  `event_path`, and `shared_log_path` so agents can verify the write target.
  Comms writes check the active-claims registry and refuse live collisions on
  the canonical PDR-076a `sameAgentRoutingKey` (the stable `id`); a matching
  route with a different `sameIdentity` result (currently `id` plus `model`)
  is rejected as a collision.
- `comms validate` — parse and schema-check the true-JSON collaboration-state
  estate, including active claims, closed claims, comms events, conversations,
  and escalations. Malformed or schema-nonconforming files fail loudly with the
  offending path named.
- `comms inbox` / `comms watch` / `comms direct` / `comms reply` — read the
  canonical comms event stream, keep a long-lived watcher open, author
  first-strike directed messages, and reply to an existing directed message
  without hand-writing JSON. On `direct`, `--to-session-prefix` is optional
  when `--to-id` resolves to a fresh CLAIM row in the live registry — the
  prefix derives from that row; `comms direct --help` carries the full
  arm-by-arm contract (derivation source and provenance, exact-match where
  derived, disagreement, queue-only, unresolvable). The worked examples
  below supply the flag because their example ids resolve nowhere. **`inbox` and `watch` default to all-channels
  behaviour**: every event relevant to the agent — broadcast narrative,
  narrative whose `audience` includes the agent, narrative `addressed_to` the
  agent, directed-kind messages to the agent, and lifecycle moments — is
  surfaced with self-exclusion only (through the canonical ID-keyed routing
  identity comparator). Each emitted event is tagged `[BROADCAST]`, `[GROUP]`,
  `[DIRECTED]`, `[OBSERVED]`, or `[LIFECYCLE]` on its first line so the agent
  knows the channel at a glance. Identity
  defaults to the platform-derived Practice session id (matching `comms send`
  / `comms direct`); explicit `--agent-name` + a REQUIRED non-empty
  `--session-prefix` is available for admin/test overrides (a supplied
  `--session-prefix` is trimmed and must be non-empty on any path). `watch` uses `fs.watch` with polling
  fallback and records seen event ids in a durable cursor. Omit
  `--comms-dir` and `--seen-file` together to resolve the PRIMARY coordination
  home and derive `comms-seen/<exact display name>.json`; `--repo-root`
  overrides that derived home. Resolution precedence is explicit
  `--repo-root`, then a validated `PRACTICE_COORDINATION_HOME`, then the
  git-native primary checkout. The two path flags form an atomic override pair
  and, when both are supplied, are preserved verbatim. `watch` creates the
  comms directory and seen-file parent in either mode. Its strict `0.2.0`
  heartbeat records the lexically absolute comms source actually drained;
  `assert-watcher-live` and the `claims open` F-95 gate accept it only when
  that source matches the canonical coordination-home comms directory.
  `reply` swaps the source `from` / `to` identities and defaults the subject
  to `re: <source subject>` unless `--subject` is supplied.
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
  --comms-dir .agent/state/collaboration/comms \
  --to-agent-name "Coastal Cresting Prow" \
  --to-id 1bb4df59-58e8-5b71-b41b-eebd1f587dda \
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
  --comms-dir .agent/state/collaboration/comms \
  --to-event-id 11111111-1111-4111-8111-111111111111 \
  --kind coordination-ack \
  --body "Acknowledged." \
  --platform codex \
  --model GPT-5
cd <repo-root> || exit 1
pnpm agent-tools collaboration-state comms watch \
  --platform codex \
  --model GPT-5 \
  --supervisor-pid "$PPID" \
  --step-timeout-ms 120000 \
  --max-events-per-drain 100
pnpm agent-tools collaboration-state comms validate
# watch emits all channels — broadcast, group, directed, observed, lifecycle
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
  --id 6f1a2c3d-4e5f-5a6b-8c7d-9e0f1a2b3c4d \
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

## Claude statusline quick reference

The Claude Code statusline is rendered by the built adapter
`dist/src/claude/statusline-identity.js`, invoked via the project shim
`.claude/scripts/statusline-identity.mjs` (configured in
`.claude/settings.json` `statusLine`). It reads the JSON payload Claude
Code passes on stdin and renders identity, coordination glyphs, model,
context/usage percentages, and git location. Environment controls:

- `OAK_STATUSLINE_LOGO` — logo style: `braille-sharp` (default),
  `braille-sharp-compact`, `braille`, `quad`, `sextant`, or `none`
  (hides the logo column; every present row still renders).
- `OAK_STATUSLINE_MOTION` — set to `off`, `static`, `none`, or
  `reduce` (case-insensitive) to disable the logo animation cycle;
  other values leave motion on.
- `OAK_STATUSLINE_LOG_FILE` — diagnosis logging: set to a path ending
  `.log` and the adapter appends one timestamped line per invocation
  carrying the stdin payload as received — terminal line breaks
  stripped, interior line breaks collapsed to spaces, every other
  byte preserved (malformed and noop payloads included); unset or
  blank means no logging; any other non-`.log` value renders a loud
  statusline warning, including on payloads that otherwise render
  nothing. The
  destination is a boundary: symlinks refuse to open, non-regular files
  never receive a write, and a pre-existing file is retightened to
  owner-only before each append. Write refusals are swallowed — the
  statusline never breaks for its own
  diagnostics. The log grows unbounded and carries session ids and
  paths: delete it after the diagnosis.
  Set it per-machine in `.claude/settings.local.json` under `env` (e.g.
  `".logs/statusline.log"` — the repo's gitignored log directory) and
  restart the session; usage-segment diagnosis walkthrough:
  [troubleshooting §Statusline segments missing](../docs/operations/troubleshooting.md#statusline-segments-missing-or-payload-diagnosis).

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
