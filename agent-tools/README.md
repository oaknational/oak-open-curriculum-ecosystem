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
- `arc-metrics`: measure an arc from the vendor's session transcripts — active hours against a named gap threshold, model calls and tokens counted once per API message id, median context per call (per session only), compactions, usage-limit stalls, and owner messages read from the transcript's own attribution (the owner's turns, and the messages a running turn absorbed) with the excluded count reported beside them. It measures the main sessions' transcripts; the sub-agent transcripts the vendor nests under each session are not counted.
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
└─ smoke-tests/    # Running-command smoke checks; test:e2e runs every *.smoke.ts
```

## Commands

From repo root:

```bash
pnpm agent-tools:build
pnpm agent-tools:lint
pnpm agent-tools:test
pnpm agent-tools:test:e2e
pnpm agent-tools agent-identity --seed example-session-id-001 --format display
pnpm agent-tools collaboration-state identity preflight --platform codex --model GPT-5
pnpm agent-tools context-cost --glob '.agent/rules/*.md'
pnpm agent-tools arc-metrics --vendor claude --json
pnpm agent-tools merge-bot pull-request comment --pr 42 --body-file /tmp/reply.md
pnpm agent-tools merge-bot pull-request dispatch-workflow --workflow upstream-carrier.yml
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

The CLI owns its own mechanics: `--now` defaults to the wall clock, the sender identity derives from
the platform session seed, and on `comms send`, `comms watch` and `comms validate` the registry and
stream paths resolve to the primary coordination home, so an agent never copies timestamps, ids or
registry paths between commands. On those commands the explicit flags stay for deterministic tests,
recovery and replay, never as the normal path (OCE friction F-19, settled 2026-06-28). `comms
direct` and `comms reply` still take `--active` and `--comms-dir` explicitly.

To capture a command's output in a script, run the shortcut silently (`pnpm -s agent-tools:<topic>
-- <command>`) or call `node agent-tools/dist/src/bin/agent-tools.js` directly; without `-s` the
pnpm wrapper prints its script preamble ahead of the command's stdout and the captured value is
polluted (OCE friction F-36, settled 2026-08-14).

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

The TUI's startup smoke runs in the [smoke suite](#the-smoke-suite); to run it alone:

```bash
pnpm agent-tools:build
cd agent-tools && node --import tsx smoke-tests/collaboration-tui-start.smoke.ts
```

## `agent-identity` quick reference

- `--seed <seed>` — explicit stable seed. If omitted, `--platform <label>` is
  required and the CLI reads `PRACTICE_AGENT_SESSION_ID_CLAUDE`, then
  `PRACTICE_AGENT_SESSION_ID_CURSOR`, then
  `PRACTICE_AGENT_SESSION_ID_GEMINI`, then
  `PRACTICE_AGENT_SESSION_ID_CODEX`, then `CLAUDE_CODE_REMOTE_SESSION_ID`,
  then `CLAUDE_CODE_SESSION_ID`, then `CODEX_THREAD_ID`, then Antigravity's
  stable `conversationId` surfaces.
- `--platform <label>` — the seat's platform (`claude-code`, `cursor`, `codex`
  or `gemini`). The three Claude seeds count only on a Claude platform, so a
  seat opened from a Claude shell keeps its own identity.
- `--format kebab|display|json` — output slug, display name, or full result.
- `PRACTICE_AGENT_IDENTITY_OVERRIDE` — bypasses wordlist derivation with a
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
PRACTICE_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" pnpm agent-tools agent-identity --seed any --format display
```

## `collaboration-state` quick reference

- **Every entry point that reads the claims file is a migration trigger.**
  `claims`, `comms append` / `comms send`, and the audits all read the
  active-claims file through the migrating reader, so the first such call
  after a rebuild that ships a newer registry schema runs the one-time
  migration — and the migration archives nothing by design (the operator
  conserves the blob). A comms broadcast is therefore a transactional touch,
  not a read: on 2026-09-04 the 1.3.0 → 1.4.0 queue split ran under a
  merge-landed broadcast seconds after the primary's dist was rebuilt and
  before the planned by-hand archive copy, so no pre-migration copy of that
  day's file exists. When a landing changes a state-file schema, sequence it
  as archive copy → rebuild → first write, and use absolute paths in every
  shell call on this repo (the shell's working directory persists between
  calls; one `cd` into a subdirectory made later relative paths read as
  "file missing").
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
  communication events; every write renders `shared-comms-log.md` beside the
  comms directory as part of the write, and `render` re-renders it on demand.
  Use `send` for the low-boilerplate path with canonical paths resolved. `send` prints JSON with `event_id`,
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
  `--session-prefix` is trimmed and must be non-empty on any path). `watch` polls the comms
  directory every `--poll-ms` and records seen event ids in a durable cursor. Omit
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

## `coordination` quick reference

- `successor-name [--base <ref>]` — prints the next coordination branch name,
  `coordination/<UTC date>-<sha6>`, from the FULL sha the base ref resolves to;
  read-only, never cuts the branch (the `cut-coordination-branch` skill does).
- `fold-clock --pr <n> [--repo <owner>/<repo>] [--successor <sha>] [--gh <path>] [--json]` —
  prints a fold's measured clock as one line for the review-cost ledger row: the
  ready-mark (the last `ready_for_review`, else the opening), checks green on the
  base branch's REQUIRED contexts (the merge door's own definition for the records
  class; a vendor's review runs as a check-run and never counts; each context is
  judged by its latest run, check-runs and commit statuses alike), each Bot review
  round (a request answered by that Bot's next review; a newer request supersedes
  an open one at once), the merge, and with
  `--successor` the successor tip's first check-run start. Every interval is minutes
  from the ready-mark. Read-only on the session's own `gh` login through the
  keyring-pinned read executor (no ambient token). Exit 0 on success, 2 on any
  error with stdout empty. The `coordination-fold` skill's step 10 pastes the line
  into the ledger row's Notes.

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
- `complete` — remove a landed intent.
- `status` — print the live entries as JSON from the per-intent store,
  counted as active or abandoned (a TTL-expired file reads as absent, so it
  never appears in any view).
- `list [--prefix <intent-prefix>]
[--phase <queued|staging|pre_commit|abandoned>]
[--agent-name <prefix>] [--queue-status <active|abandoned>]` —
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

- `PRACTICE_STATUSLINE_LOGO` — logo style: `braille-sharp` (default),
  `braille-sharp-compact`, `braille`, `quad`, `sextant`, or `none`
  (hides the logo column; every present row still renders).
- `PRACTICE_STATUSLINE_MOTION` — set to `off`, `static`, `none`, or
  `reduce` (case-insensitive) to disable the logo animation cycle;
  other values leave motion on.
- `PRACTICE_STATUSLINE_LOG_FILE` — diagnosis logging: set to a path ending
  `.log` and the adapter appends one timestamped line per invocation
  carrying the stdin payload as received — terminal line breaks
  stripped, interior line breaks collapsed to spaces, every other
  byte preserved (malformed and noop payloads included); unset or
  blank means no logging; any other non-`.log` value renders a loud
  statusline warning, including on payloads that otherwise render
  nothing. The
  destination is a boundary: symlinks refuse to open, non-regular files
  never receive a write, a pre-existing file is retightened to
  owner-only before each append, and native Windows, where file modes
  cannot make a file owner-only, gets no log. Write refusals are swallowed — the
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

## `skill-evals` quick reference

Runs a canonical skill's declared evals (`<skill>/evals/evals.json`, the cases; `evals/trigger-validation.json`, the
trigger examples) through the host eval runner, `claude plugin eval`, and retains the evidence in the repository.

- `run --skill <canonical dir> --host-skill <name>` — project the fixtures into a temporary plugin whose skill is the
  host adapter's frontmatter over the canonical body (references carried beside; a link into a sibling skill's
  references is pointed at `references/<sibling>/` under the skill and the linked file is projected there from its
  canonical source, transitively, so the projected skill reads what the canonical links; a link to a sibling's
  `SKILL-CANONICAL.md` is left as written, the sibling being reached as a skill, via `--also`), run the cases with
  the with-without ablation and the trigger examples without one, and retain the runner's result, every run's trace
  and final answer, and a manifest (blob ids of every carried skill's canonical and adapter files and of the sibling
  references projected under it, the repository head, the runner configuration, the cases asked for and the cases
  that ran) under `<canonical dir>/evals/results/<started-at>/`, every machine-local path scrubbed
- `--also <canonical dir>=<name>` (repeatable) — carry another skill in the plugin, so a case that declares
  `skills_expected` (canonical names) can exercise a handoff to it; each expected skill gets its own fired indicator
- `project --skill <canonical dir> --host-skill <name> --out <dir>` — write the same projection for inspection; nothing
  runs
- `--suite all|cases|triggers`, `--case <glob>` (narrows within each suite; an emptied suite is not invoked),
  `--ablation with-without|none`, `--runs <n>`, `--max-cost-usd <usd>` (the runner's ceiling; a run cut by it is
  recorded PARTIAL), `--judge-model <m>`, `--model <m>`, `--max-turns <n>`, `--trigger-max-turns <n>`,
  `--timeout-seconds <n>`, `--keep-plugin`, `--json`
- Exit 0 done; exit 1 a named operational refusal (the kept plugin directory is named); exit 2 usage

Four facts of the runner shape the projection, read first-hand from its traces and its binary on 2026-09-27. The agent
under test runs in an empty temporary workspace and may read nothing outside it except the plugin's own files, so the
method reaches it through the plugin's skill file alone and nothing is placed in the workspace: the without-arm, which
has no plugin, has no route to the method (a workspace copy would have given the baseline the text, which the first
form of this tool did). A `tool_used` grader counts the call, not its outcome, so the skill-fired indicator is paired
with a trace check that no read under the plugin's `skills/` was refused. Its `input_match` is a regular expression
over the serialised input, and the Skill tool names a plugin skill `<plugin>:<skill>`, so the indicator is anchored
with a negative lookahead: `oak-specify` never counts `oak-specify-connection`. And the judge reads only the rubric,
which carries the expected outcome and the numbered assertions and says when the method's absence is correct. The
runner's default score threshold would exit 1 on any case below 1.0; the tool passes `--threshold 0` and reads pass,
fail and score from the result, which is the evidence.

Examples:

```bash
pnpm agent-tools:skill-evals run --skill .agent/skills/planning/user-value --host-skill oak-user-value --max-cost-usd 40 --judge-model sonnet
pnpm agent-tools:skill-evals run --skill .agent/skills/planning/user-value --host-skill oak-user-value --suite triggers
pnpm agent-tools:skill-evals run --skill .agent/skills/planning/plan --host-skill oak-plan --also .agent/skills/planning/user-value=oak-user-value --case case-04 --max-turns 40
pnpm agent-tools:skill-evals project --skill .agent/skills/planning/user-value --host-skill oak-user-value --out ../inspect
```

The runner is a per-user install resolved by name on the operator's PATH: the run already loads the repository's own
skills into an agent under `--trust-plugin`, so PATH resolution adds no trust boundary the run does not already cross;
only suites the repository authored are run.

## `codex-exec` quick reference

- `last-message [--format text|json] [--strict]` — read a `codex exec` JSONL stream from stdin and print the final assistant text
- `command-records [--format text|json] [--strict]` — read a seat's whole rollout from stdin and summarise what the harness recorded: the commands it ran per turn, every exec call accounted, refused or unaccounted, and every command carrying a forbidden shape of `.codex/rules/seat-landing.rules`, rendered by allowlist; `--strict` exits 1 on a shape that ran, an unaccounted call or unreadable evidence

Both read the harness's own records, never the model's text (ADR-180 §2).

## Repo gate status

`agent-tools` checks currently run via:

- `pnpm agent-tools:build`
- `pnpm agent-tools:lint`
- `pnpm agent-tools:test`
- `pnpm agent-tools:test:e2e` (the E2E suites, the contract validators and every smoke)

### The smoke suite

`test:e2e` runs the E2E suites, the two contract validators, a build, and then the smoke suite:
every `smoke-tests/*.smoke.ts`, discovered from the directory by
`dist/src/bin/run-smoke-tests.js` rather than listed, so a new smoke file is gated as soon as it
exists. Each smoke runs as `node --import tsx <file>` from the package root, as the runner's direct
child, in UTF-16 code-unit order (code-point order for ASCII names). Every smoke runs even after a failure, and the suite fails when any
smoke fails or is killed by a signal, or when none is found. The runner takes no arguments;
`--help` prints its usage.

Every smoke in the directory is on the PR-check path, since CI runs `test:e2e`, so no smoke may
reach the network
([ADR-161](../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)).

One smoke runs alone after a build, from `agent-tools/`:

```bash
pnpm agent-tools:build
cd agent-tools && node --import tsx smoke-tests/<name>.smoke.ts
```
