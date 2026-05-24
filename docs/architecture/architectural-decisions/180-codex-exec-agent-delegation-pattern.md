# ADR-180: Codex-Exec Agent Delegation Pattern

**Status**: Accepted 2026-05-12 (Lush Sprouting Thicket session, owner approval)
**Date**: 2026-05-12
**Related**:
[ADR-125](125-skill-canonicalisation-and-adapter-topology.md) — skill
canonicalisation; the `codex-helper` skill and its adapters are generated
under ADR-125 conventions;
[ADR-178](178-agent-tools-build-isolation.md) — agent-tools build isolation;
the `codex-exec` CLI topic follows the build/dist discipline established there.

## Context

The agentic engineering practice operates across multiple platforms (Claude
Code, Codex, Cursor). When a Claude Code session needs to delegate a
well-defined sub-task to a Codex agent, two invocation surfaces exist:

1. **MCP server** (`mcp__codex__codex`): request-response, returns a JSON
   envelope with `threadId` and `content`. Suitable for continuation threads.
   No streaming, no timeout control, no structured output extraction.

2. **`codex exec` CLI**: spawns a non-interactive Codex session.
   `--json` emits JSONL events to stdout as they happen. Supports
   `--output-last-message`, `--output-schema`, `--sandbox`, `--ephemeral`,
   and working-directory control via `-C`.

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
rather than the MCP server. The MCP server is reserved for interactive
continuation threads where `threadId` management is valuable.

### 2. A minimal `codex-exec` CLI topic in agent-tools ships now; richer surface deferred

`pnpm agent-tools:codex-exec` (topic `codex-exec` in the unified
`agent-tools` dispatcher) ships with one tested subcommand:

- **`last-message`** — reads JSONL from stdin and extracts the final
  `item.completed / agent_message` event text. Typed, tested, no `jq`
  dependency. Flags: `--strict`, `--format text|json`.

The topic lives at `agent-tools/src/codex-exec/` alongside `commit-queue`
and follows the same dispatcher/topic pattern established in ADR-178.

A richer surface (`run` subcommand wrapping `codex exec` with a built-in
timeout, sandbox flag forwarding, and JSONL progress streaming;
`extract`/`validate-brief` subcommands) was scoped but deferred during this
ADR's experiment. The implementation was structurally large enough to fight
the repo's complexity discipline (50-line function limit, 250-line file
limit, complexity ≤8) for a feature that has no second consumer yet.
The deeper design exploration lives in
[`codex-exec-cli-deep-dive.plan.md`](../../../.agent/plans/agentic-engineering-enhancements/future/codex-exec-cli-deep-dive.plan.md).
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

## Consequences

**Positive:**

- JSONL extraction and timeout handling are tested TypeScript rather than
  fragile shell one-liners.
- The default `read-only` sandbox enforces least-privilege; violations are
  explicit opt-ins.
- The peer-review loop produces better outputs than single-agent authoring
  for content where the reviewing agent has domain knowledge (e.g., Codex
  reviewing its own event format).

**Negative / trade-offs:**

- `codex exec` is a blocking subprocess; long tasks are a black box for the
  calling agent until the user cancels or the OS times out. Break briefs
  into sub-60 s units when possible. Cross-platform timeout discipline is
  the caller's responsibility until the deferred `run` subcommand ships.
- The JSONL event shape (`item.completed / agent_message / .item.text`) is
  not part of a public versioned API contract. The `last-message` extractor
  may need updating if the event shape changes; the skill documents this
  risk.
- macOS does not ship GNU `timeout`. The skill documents a
  `perl -e 'alarm N; exec @ARGV'` substitute as the cross-platform fallback
  until the deferred `run` subcommand provides a tested wrapper.

## Alternatives Considered

**Use only the MCP server**: rejected because it provides no streaming, no
timeout, and no cross-platform abstraction for JSONL extraction.

**Raw shell with `jq` and `timeout`**: rejected because `timeout` is absent
on macOS, `jq` field paths are fragile against API evolution, and shell logic
is not testable within the existing Vitest/TypeScript gate surface.

**Build a full async event-streaming abstraction**: deferred. The current
`run` subcommand collects events synchronously after spawn. A streaming
interface that yields events to callers is a future enhancement when a
concrete consumer requires it.
