# ADR-180: Codex-Exec Agent Delegation Pattern

**Status**: Accepted 2026-05-12 (Lush Sprouting Thicket session, owner approval)
**Date**: 2026-05-12
**Amended**: 2026-07-25 — current official Codex documentation now treats
`codex exec` JSONL and structured output as documented interfaces and exposes
additional composition boundaries: the Codex SDK, the `codex mcp-server`
command with its experimental protocol, and experimental App Server. The
preference for `codex exec` as the smallest scripted boundary remains.
**Amended**: 2026-09-23, owner-ratified that day — the Codex CLI removed `codex mcp-server`
(observed absent at codex-cli 0.156.1; §2.2 of the dated [research note](../../../.agent/research/agentic-engineering/codex-support-concept-exploration-2026-09-23.md)). The vendor
names App Server as the migration target for integrations built on it (the
[official-docs follow-up](../../../.agent/research/agentic-engineering/codex-official-docs-follow-up-2026-09-23.md)). The topic gains the Codex dialogues' call binding, a
single-consumer surface with a fixed authority envelope (§6), whose evidence is §2.8 of the
research note. The owner ruled that the binding carries the owner's model and effort and
nothing else from the owner's configuration, and that the version tested is recorded while
dialogues always run against the latest CLI.
**Related**:
[ADR-125](125-agent-artefact-portability.md) — agent artefact portability;
the `codex-helper` skill and its adapters follow ADR-125 conventions;
[ADR-178](178-agent-tools-build-isolation.md) — agent-tools build isolation;
the `codex-exec` CLI topic follows the build/dist discipline established there.
**Amended**: 2026-09-25, for the test doctrine intake (owner, 2026-09-24): the designed-sentinel carve-out is retired, so a test that pins a value by a sentinel is a defect under `test-immediate-fails` item 14 and belongs to the recovery lane; the decision this record makes stands, and the value it names is guaranteed by construction or a validator, never by a pinned test.
**Amended**: 2026-09-26 — §2 gains a second tested subcommand, `command-records`,
the seat-rollout command-record reader, by which a Codex seat's landing path is
judged from the harness's own records rather than the model's text; the `run`
deferral stands.

## Context

The agentic engineering practice operates across multiple platforms (Claude
Code, Codex, Cursor). When a Claude Code session needs to delegate a
well-defined sub-task to a Codex agent, these invocation surfaces exist:

1. **`codex exec` CLI**: spawns a non-interactive Codex session.
   `--json` emits JSONL events to stdout as they happen. Supports
   `--output-last-message`, `--output-schema`, `--sandbox`, `--ephemeral`,
   and working-directory control via `-C`. `codex exec resume` continues a
   thread by its id.

2. **Codex SDK**: a TypeScript library that wraps `codex exec` over JSONL and
   provides programmatic thread control.

3. **App Server**: an experimental JSON-RPC protocol with threads, turns,
   approvals, history, streaming, steering, and interruption for rich
   clients.

The external surface as tested on 2026-07-25 is recorded in the
[Codex CLI capability catalogue](../../../.agent/reports/agentic-engineering/codex-cli-agentic-capability-catalogue-2026-07-25.md);
the 2026-09-23 amendment records what has changed since.

A live experiment (2026-05-12) validated this delegation loop:

- Claude Code invoked `mcp__codex__codex` to ask Codex its model identity
  after grounding with `/oak-start-right-quick`. Codex reported GPT-5 with
  full session-identity registration.
- Claude Code then delegated a skill-review task to Codex via `codex exec
--json --sandbox read-only` with a grounded brief. Codex reviewed the
  `codex-helper` skill and produced actionable findings (wrong JSONL field
  names, wrong default sandbox, macOS `timeout` gap, missing flags). These
  were applied back to the skill by Claude Code.
- This peer-review loop — Claude writes, Codex audits, Claude applies —
  improved content quality beyond what either agent achieves alone.

The experiment also identified that raw `jq` one-liners for JSONL extraction
and GNU `timeout` for bounded execution are fragile shell primitives: the `jq`
field paths can silently return empty output if the Codex event API evolves,
and macOS does not ship `timeout`. Both concerns are better addressed in
tested TypeScript inside `agent-tools`.

## Decision

### 1. `codex exec` is the preferred invocation surface for scripted delegation

For programmatic delegation from Claude Code or shell scripts, use `codex exec`
rather than adding a richer protocol by default. Use the SDK when an
application needs richer thread control and no fixed authority envelope; use
App Server only when its experimental protocol is an intentional dependency.
The Codex dialogues need both multi-turn threads and a fixed envelope, so they
use `codex exec` and `codex exec resume` (§6).

### 2. A minimal `codex-exec` CLI topic in agent-tools ships now; richer surface deferred

`pnpm agent-tools:codex-exec` (topic `codex-exec` in the unified
`agent-tools` dispatcher) ships with two tested subcommands for reading what
`codex exec` wrote:

- **`last-message`** — reads JSONL from stdin and extracts the final
  `item.completed / agent_message` event text. Typed, tested, no `jq`
  dependency. Flags: `--strict`, `--format text|json`.
- **`command-records`** (amended 2026-09-26) — reads a seat's whole rollout
  from stdin and summarises what the harness itself recorded: the commands it
  ran per turn, every exec call accounted, refused by the exec policy or left
  unaccounted, and every command that carried a forbidden shape of
  `.codex/rules/seat-landing.rules`, rendered by allowlist so the summary
  never carries the command history. Only a code-mode wrapper the harness
  completed accounts a call; a function-tool output (`exec_command` on a TUI
  seat) that is no refusal reads as unaccounted, so the reader judges
  code-mode seats. `--strict` exits 1 when no turn started, a forbidden shape
  ran, a call is unaccounted, or the evidence could not be read; a refusal
  alone passes. It is the instrument by which a Codex seat's landing path is
  judged from the harness's own records rather than the model's text.

The topic lives at `agent-tools/src/codex-exec/` alongside `commit-queue`
and follows the same dispatcher/topic pattern established in ADR-178.

A richer surface (`run` subcommand wrapping `codex exec` with a built-in
timeout, sandbox flag forwarding, and JSONL progress streaming;
`extract`/`validate-brief` subcommands) was scoped but deferred during this
ADR's experiment. The implementation was structurally large enough to fight
the repo's complexity discipline (50-line function limit, 250-line file
limit, complexity ≤8) for a feature that has no second consumer yet.
The deeper design exploration lives in
`codex-exec-cli-deep-dive.plan.md`.
Promotion of that plan is the trigger for adding `run`/`extract`/
`validate-brief`.

### 3. `read-only` is the default sandbox; escalation requires justification

`codex exec` supports three sandbox modes. `read-only` is the default for
analysis and review tasks. `workspace-write` requires the task to write
files. `danger-full-access` requires explicit owner authorisation per
invocation and is only appropriate inside an externally sandboxed environment.

### 4. A `codex-helper` skill documents the patterns

The `oak-codex-helper` skill (`classification: active`) provides templates for
brief/one-shot tasks and grounded sessions. The skill references the
`agent-tools:codex-exec` CLI as the preferred extraction and execution surface.
It is generated as a cross-tool adapter under ADR-125.

### 5. Peer-review loop is a first-class collaboration pattern

Delegating a review of Claude-authored content to Codex — and applying the
findings back — is a valid, documented collaboration mode. The loop is
asymmetric by design: each platform's strengths compensate for the other's
blind spots. This ADR endorses the pattern; the `codex-helper` skill provides
the templates.

### 6. The dialogue instrument's call envelope is fixed in code

The Codex dialogues call Codex as a read-only interlocutor through two subcommands
of this topic, `dialogue-turn` and `dialogue-probe`. The outcome the binding must
reach:

- **The interlocutor reads and reasons, and does nothing else on its own
  initiative.** It writes nothing, and it reaches no network, from its shell or
  through web search. It loads no extension, rule, memory or shell environment of
  the owner's, and no project instructions or configuration from where it runs.
  It takes the owner's model choice and nothing else from the owner's
  configuration.
- **Authority is fixed where it is enforced.** The call's authority-bearing
  flags, settings and environment names come from one module, and no caller
  argument can add to or alter them. The only values that enter are the
  instrument's paths, a UUID-validated thread id and the validated model pins. A
  change to the envelope is a change to this decision, and it is re-adjudicated
  here before the module's designed-sentinel tests change.
- **The read-only sandbox is not the whole envelope.** The user configuration,
  exec-policy rules, the shell snapshot and memories each reach past it, so the
  envelope closes each one, and the instrument runs in homes of its own.
- **Evidence follows the runtime.** A dialogue opens only on a Codex executable
  this machine has probed with the current envelope. No version is pinned in the
  repository.
- **Reads are not bounded.** Anything the owner's account can read can reach the
  vendor. The [dialogue packet](../../../.agent/skills/the-codex-dialogues/SKILL-CANONICAL.md#the-dialogue-packet),
  the frame a seat composes for each exchange, is the minimisation rule.

This binding is not the deferred `run` subcommand of §2: it has one consumer and
passes no flag through, so §2's deferral stands.

## Consequences

**Positive:**

- JSONL extraction and timeout handling are tested TypeScript rather than
  fragile shell one-liners.
- The upstream JSONL event stream and output-schema flag are now documented
  public CLI behaviour; the local extractor still protects consumers from raw
  event plumbing.
- The default `read-only` sandbox enforces least-privilege; violations are
  explicit opt-ins.
- The peer-review loop produces better outputs than single-agent authoring
  for content where the reviewing agent has domain knowledge (e.g., Codex
  reviewing its own event format).

**Negative / trade-offs:**

- `codex exec` is a blocking subprocess in the caller's control flow. It is
  not an observation black box: ordinary mode streams progress to stderr and
  `--json` streams events to stdout. Break briefs into reviewable units.
  For ad hoc delegation, cross-platform timeout discipline remains the
  caller's responsibility until the deferred `run` subcommand ships;
  `dialogue-turn` owns its own timeout.
- The dialogue envelope (§6) has running costs: the probe must pass again
  after every CLI update before dialogues resume, the model pins tie each call
  to the owner's configuration, and the instrument's own Codex home needs a
  one-time login by the owner.
- JSONL is documented, but individual event fields can still evolve across
  CLI releases. The `last-message` extractor remains version-sensitive and
  must be verified against the installed CLI.
- macOS does not ship GNU `timeout`. The skill documents a
  `perl -e 'alarm N; exec @ARGV'` substitute as the cross-platform fallback
  until the deferred `run` subcommand provides a tested wrapper.

## Alternatives Considered

**The Codex SDK for the dialogues**: rejected. No SDK option emits
`--ignore-user-config`, and the SDK copies the parent environment wholesale,
so it cannot hold the §6 envelope. It also declares an exact-version
dependency on its own CLI package. Re-evaluate if the SDK gains control of the
flags and the environment.

**App Server for the dialogues**: rejected, though the vendor names it as the
migration target for integrations built on the removed MCP server. It is a
long-lived JSON-RPC protocol whose command and WebSocket transport the vendor
documents as experimental and unsupported for production, and a seat's turns
arrive as separate tool calls, so a daemon would add lifecycle machinery for
no gain.

**Raw shell with `jq` and `timeout`**: rejected because `timeout` is absent
on macOS, `jq` field paths are fragile against API evolution, and shell logic
is not testable within the existing Vitest/TypeScript gate surface.

**Build a full async event-streaming abstraction**: deferred. A streaming
interface that yields events to callers is a future enhancement when a
concrete consumer requires it.
