---
name: codex-helper
classification: active
description: >-
  Invoke Codex as a sub-agent for well-defined tasks using `codex exec`.
  Provides templates for brief one-shot tasks (no grounding) and longer
  repo-aware sessions (with oak-start-right-quick). Use when delegating
  a self-contained task to Codex from Claude Code or from a shell script.
---

# Codex Helper

Use `codex exec` to delegate well-defined tasks to a Codex agent.
The MCP server (`mcp__codex__codex`) is suitable for short continuation
threads; `codex exec` is preferred for direct invocations because it
exposes JSONL streaming, structured output, working-directory control,
and ephemeral mode.

## When to Use Each Template

| Template | Use when |
| --- | --- |
| **Brief / one-shot** | Task is self-contained, needs no repo memory, completes in under ~60 s |
| **Grounded session** | Task touches repo state, shared files, or active claims; grounding catches collisions before edits land |

## Brief Session Template (no grounding)

For atomic, self-contained tasks with no repo side-effects.

```bash
codex exec \
  --json \
  --ephemeral \
  --sandbox read-only \
  -C /path/to/repo \
  -m "codex-auto" \
  "Your precise, self-contained task brief here.

Include all context the agent needs inline — file paths, expected inputs,
exact output format. Do not rely on repo memory or prior session state."
```

**Flags:**

- `--json` — emit events as JSONL to stdout; parse with `jq` or stream directly
- `--ephemeral` — no session files written to disk; clean for one-shot tasks
- `--sandbox read-only` — least-privilege default for analysis and Q&A tasks; switch to `workspace-write` only when the task must write files
- `-C` — sets the agent's working root (repo root for most tasks)
- `-m` — override the model; `codex-auto` is the default routing model

**Additional flags worth knowing:**

- `--add-dir <dir>` — additional directories that should be writable alongside the primary workspace
- `--image <file>` — attach an image to the initial prompt
- `--profile <name>` — load a named configuration profile from `~/.codex/config.toml`
- `--config key=value` — override individual config values (dotted path, TOML-parsed)
- `--ignore-user-config` — skip `~/.codex/config.toml`; auth still uses `CODEX_HOME`
- `--skip-git-repo-check` — allow running outside a Git repository

**Capturing the final message only** (skip the event stream):

```bash
codex exec \
  --ephemeral \
  --sandbox read-only \
  -C /path/to/repo \
  --output-last-message /tmp/codex-result.txt \
  "Your brief."
cat /tmp/codex-result.txt
```

**Structured output** (constrain to a JSON Schema):

```bash
codex exec \
  --json \
  --ephemeral \
  --sandbox read-only \
  -C /path/to/repo \
  --output-schema /path/to/schema.json \
  "Return a JSON object matching the schema. Your brief."
```

**Reading a long brief from stdin** (avoids shell-escaping issues):

```bash
codex exec --json --ephemeral --sandbox read-only -C /path/to/repo - <<'BRIEF'
Your multi-line task brief here.
All context the agent needs inline.
BRIEF
```

## Grounded Session Template (with oak-start-right-quick)

For tasks that read or write repo state, touch shared claim surfaces, or
need the agent to understand current branch context before acting.

```bash
codex exec \
  --json \
  --sandbox workspace-write \
  -C /path/to/repo \
  - <<'BRIEF'
Before starting, run /oak-start-right-quick to ground yourself in this
repository's current state.

<task>
Your precise task brief here. Include:
- Target files or directories
- Expected output or observable behaviour
- Any constraints (no new dependencies, stay within workspace X, etc.)
</task>
BRIEF
```

**When to omit `--ephemeral`:** grounded sessions may write session files
that allow `codex exec resume --last` for follow-up. Omit `--ephemeral`
if you anticipate needing to continue the session.

**Commit co-authorship:** any commits the agent makes must carry the correct
co-author footer. Specify it explicitly in the brief body with the agent's
actual identity — do not hard-code a placeholder email.

**Approval policy for commit windows:** `--dangerously-bypass-approvals-and-sandbox`
removes sandboxing entirely and skips all confirmation prompts. Only use it inside
an externally sandboxed environment. Require explicit owner authorisation before
including this flag in any brief.

## Parsing JSONL Output

When `--json` is set, each line is a JSON event. The final assistant text is
carried on `type == "item.completed"` events where `.item.type == "agent_message"`,
with the string at `.item.text`. Session completion is signalled by
`type == "turn.completed"`. Multiple `item.completed` agent_message events can
appear; take the last one or use `--output-last-message` to capture only the
final message without parsing.

Extract the final assistant text with `jq`:

```bash
codex exec --json --ephemeral -C /path/to/repo "Your brief." \
  | jq -r 'select(.type=="item.completed" and .item.type=="agent_message") | .item.text' \
  | tail -n 1
```

For progress visibility while also capturing the last message:

```bash
codex exec --json --ephemeral -C /path/to/repo \
  --output-last-message /tmp/result.txt \
  "Your brief." \
  | jq -r 'if .type=="item.completed" then "\(.type): \(.item.type) \(.item.text // .item.message // "")" else .type end'
cat /tmp/result.txt
```

> **Note:** The `jq` filters above reflect the event shape observed as of
> 2026-05-12. The Codex event API is subject to change. If extractions produce
> empty output, inspect a raw `--json` run to verify current field names, or
> use `pnpm agent-tools:codex-exec -- last-message` (a tested TypeScript
> adapter for the same extraction — see below).

## Choosing a Sandbox Mode

| Mode | Meaning | Use for |
| --- | --- | --- |
| `read-only` | Agent can read but not write | Analysis, review, Q&A — **default** |
| `workspace-write` | Agent can write within the working root | Editing tasks |
| `danger-full-access` | No sandbox, no approvals | Only in externally sandboxed CI; requires owner authorisation |

Always start at `read-only`. Promote to `workspace-write` only when the task must
write files. `danger-full-access` requires explicit owner authorisation per invocation.

## agent-tools:codex-exec CLI

`pnpm agent-tools:codex-exec` exposes `last-message`, which extracts the
final assistant text from a JSONL stream.

A richer wrapper (a `run` subcommand with built-in timeout, sandbox flag
forwarding, and streaming progress) is under design in the
[codex-exec CLI deep-dive strategic plan](../../plans/agentic-engineering-enhancements/future/codex-exec-cli-deep-dive.plan.md).
Until that plan promotes, use raw `codex exec` for invocation and pipe the
output through `last-message` for extraction.

### last-message

Reads JSONL from stdin and extracts the final agent message:

```bash
codex exec --json --ephemeral -C /path/to/repo "Your brief." \
  | pnpm -w agent-tools:codex-exec -- last-message
```

With `--strict` (exit 1 if no message found) and `--format json`:

```bash
codex exec --json --ephemeral -C /path/to/repo "Your brief." \
  | pnpm -w agent-tools:codex-exec -- last-message --strict --format json
```

## Timeout and Long-Running Tasks

`codex exec` has no built-in timeout flag, and macOS does not ship `timeout`
(GNU coreutils). Options:

```bash
# macOS: use perl as a cross-platform substitute
perl -e 'alarm 120; exec @ARGV' -- \
  codex exec --json --ephemeral -C /path/to/repo "Your brief."

# Linux / CI: GNU timeout
timeout 120 codex exec --json --ephemeral -C /path/to/repo "Your brief."
```

Exit code `124` from `timeout` (or `perl alarm`) means the agent did not
complete within the limit. Treat this as a task-scope signal: break the
brief into smaller pieces rather than raising the timeout.

## Briefing Quality

A well-scoped brief prevents the agent from filling ambiguity with guesses:

- Name the exact file(s) to read or write.
- State the expected output format explicitly.
- Include all necessary context inline — the agent has no session memory.
- Keep grounded briefs to one coherent goal; multi-goal briefs drift.
- For repo-aware tasks, the grounding prompt (`/oak-start-right-quick`)
  handles claim-scanning, branch state, and comms-surface checks — do not
  duplicate that in the brief body.
