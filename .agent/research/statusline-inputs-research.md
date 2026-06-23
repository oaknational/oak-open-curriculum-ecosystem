---
title: "Claude Code status line — the complete stdin contract and what is possible"
date: 2026-06-14
status: research-findings (source-cited, cross-referenced against official docs)
author: Avocet guards Drift (claude / claude-opus-4-8 / 7898d8)
source: https://code.claude.com/docs/en/statusline (fetched 2026-06-14; verified against Claude Code v2.1.177)
context: >
  A teammate asked, via /statusline, what arguments and environment variables a
  status line script can see, "to get an idea for what is possible". This is the
  grounded answer: every field on the stdin JSON, the environment variables Claude
  Code actually sets, the settings that shape execution, and the output channels a
  script can drive. Every claim is taken from the official documentation and the
  field names are quoted verbatim from it.
corrects: >
  An earlier verbal answer in the same session (produced from model memory, not the
  docs) stated "there is no cost or duration data in the JSON" and "there are no
  dedicated CLAUDE_* / environment variables for the status line". Both are wrong.
  See "Corrections to common misconceptions" below.
---

# Claude Code status line — the complete stdin contract and what is possible

## Why this exists

The status line is a configurable bar at the bottom of Claude Code that runs **any
shell command you point it at** and displays whatever that command prints. The
command is handed a single JSON object on **stdin** describing the live session,
and its **stdout** is rendered as the bar. That is the whole contract: read JSON in,
print text out.

This document is the grounded reference for that contract. The narrow questions it
answers:

> What data does the script receive, how does it receive it, what environment
> variables are set, and what can the output actually do?

Everything below is sourced from the official documentation
(`https://code.claude.com/docs/en/statusline`) and verified against the locally
installed Claude Code **v2.1.177**. Field names are quoted exactly as the docs
write them.

## How the data flows

- **Transport is stdin, not argv.** Claude Code serialises the session state to a
  single JSON object and pipes it to the command's standard input. The script
  receives nothing meaningful on the argument vector — it must read stdin (e.g.
  `input=$(cat)` in Bash, `json.load(sys.stdin)` in Python).
- **The command runs in a shell.** It can be a script path
  (`~/.claude/statusline.sh`) or an inline command (the docs show an inline `jq`
  one-liner). Because it runs a shell command, it is gated by the **same workspace
  trust acceptance as hooks**; if `disableAllHooks` is `true`, the status line is
  disabled too.
- **stdout is the display.** Each line printed becomes a row. stderr is not shown.
- **When it re-runs (event-driven):** after each new assistant message, after
  `/compact` finishes, when the permission mode changes, and when vim mode toggles.
  Updates are **debounced at 300ms**. If a new trigger fires while the script is
  still running, the in-flight run is **cancelled**. Editing the script does not
  take effect until the next triggering interaction.
- **Optional timer:** the `refreshInterval` setting (minimum `1` second) re-runs the
  command on a fixed timer in addition to the events above. This is the fix for
  segments that go stale while the main session is idle — a clock, or git state
  changed by background subagents while the coordinator waits.
- **No API cost.** The status line runs locally and consumes no API tokens. It is
  temporarily hidden during autocomplete, the help menu, and permission prompts.

## The complete field reference

Grouped by object. Types and example values are from the docs' "Full JSON schema"
and field table. Optionality is captured in the next section.

### Top-level scalars

| Field | Type | Notes |
| --- | --- | --- |
| `cwd` | string | Current working directory. Same value as `workspace.current_dir`. |
| `session_id` | string | Unique session identifier. **Stable for the session's lifetime** — use it (not `$$`/PID) to key per-session cache files. |
| `session_name` | string | Custom name set via `--name` or `/rename`. **Absent** if none set. |
| `transcript_path` | string | Path to the conversation transcript `.jsonl`. |
| `version` | string | Claude Code version, e.g. `"2.1.90"`. |
| `exceeds_200k_tokens` | boolean | Whether combined input + cache + output tokens from the most recent response exceed **200k**. A fixed threshold, independent of the actual context-window size. |

### `model`

| Field | Type | Example |
| --- | --- | --- |
| `model.id` | string | `"claude-opus-4-8"` |
| `model.display_name` | string | `"Opus"` |

### `workspace`

| Field | Type | Notes |
| --- | --- | --- |
| `workspace.current_dir` | string | Current working directory. **Preferred** over `cwd` for consistency with `project_dir`. |
| `workspace.project_dir` | string | Directory where Claude Code was launched. May differ from `current_dir` if the working dir changes mid-session. |
| `workspace.added_dirs` | string[] | Directories added via `/add-dir` or `--add-dir`. Empty array if none. |
| `workspace.git_worktree` | string | Worktree name when `cwd` is inside a linked worktree created with `git worktree add`. **Absent** in the main tree. Populated for **any** git worktree (broader than `worktree.*`, which is `--worktree`-only). |
| `workspace.repo.host` | string | e.g. `"github.com"` — parsed from the `origin` remote. |
| `workspace.repo.owner` | string | e.g. `"anthropics"`. |
| `workspace.repo.name` | string | e.g. `"claude-code"`. |

`workspace.repo` is parsed from the `origin` remote URL — it is **not** a live
network call, so reading it every tick is free.

### `cost`

| Field | Type | Notes |
| --- | --- | --- |
| `cost.total_cost_usd` | number | Estimated session cost in USD, computed client-side. May differ from the actual bill. |
| `cost.total_duration_ms` | number | Total wall-clock time since the session started, in ms. |
| `cost.total_api_duration_ms` | number | Time spent waiting for API responses, in ms. |
| `cost.total_lines_added` | number | Lines of code added this session. |
| `cost.total_lines_removed` | number | Lines of code removed this session. |

### `context_window`

| Field | Type | Notes |
| --- | --- | --- |
| `context_window.total_input_tokens` | number | Tokens currently in context (input). Sum of `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`. `0` before the first response. **As of v2.1.132 this is current usage, not a cumulative session total.** |
| `context_window.total_output_tokens` | number | Output tokens from the most recent response. `0` before the first response. |
| `context_window.context_window_size` | number | Max window size. `200000` by default, `1000000` for extended-context models. |
| `context_window.used_percentage` | number | Pre-calculated percent used. Computed from **input only** (`input_tokens + cache_creation_input_tokens + cache_read_input_tokens`); excludes output. |
| `context_window.remaining_percentage` | number | Pre-calculated percent remaining. |
| `context_window.current_usage` | object \| null | Per-component breakdown (below). **`null`** before the first API call and again after `/compact` until the next call. |
| `context_window.current_usage.input_tokens` | number | Input tokens in current context. |
| `context_window.current_usage.output_tokens` | number | Output tokens generated. |
| `context_window.current_usage.cache_creation_input_tokens` | number | Tokens written to cache. |
| `context_window.current_usage.cache_read_input_tokens` | number | Tokens read from cache. |

If you compute the percentage yourself, use the same **input-only** formula to
match `used_percentage`.

### `effort` (optional)

| Field | Type | Notes |
| --- | --- | --- |
| `effort.level` | string | One of `low`, `medium`, `high`, `xhigh`, `max`. Reflects the live value including mid-session `/effort` changes. **Ultracode is not a distinct level — it reports as `xhigh`.** Absent when the model does not support the effort parameter. |

### `thinking`

| Field | Type | Notes |
| --- | --- | --- |
| `thinking.enabled` | boolean | Whether extended thinking is enabled. |

### `rate_limits` (optional — Claude.ai Pro/Max only)

| Field | Type | Notes |
| --- | --- | --- |
| `rate_limits.five_hour.used_percentage` | number | 0–100, percent of the 5-hour window consumed. |
| `rate_limits.five_hour.resets_at` | number | Unix epoch **seconds** when the 5-hour window resets. |
| `rate_limits.seven_day.used_percentage` | number | 0–100, percent of the 7-day window consumed. |
| `rate_limits.seven_day.resets_at` | number | Unix epoch **seconds** when the 7-day window resets. |

Present only for Claude.ai subscribers, and only **after the first API response**.
Each window (`five_hour`, `seven_day`) may be independently absent.

### `vim` (optional)

| Field | Type | Notes |
| --- | --- | --- |
| `vim.mode` | string | `NORMAL`, `INSERT`, `VISUAL`, or `VISUAL LINE`. Present only when vim mode is enabled. |

### `agent` (optional)

| Field | Type | Notes |
| --- | --- | --- |
| `agent.name` | string | Agent name when running with `--agent` or agent settings configured. |

The official field table documents only `agent.name` under the `agent` object. No
`agent.type` field is documented — do not rely on one.

### `pr` (optional)

| Field | Type | Notes |
| --- | --- | --- |
| `pr.number` | number | Open PR for the current branch. Mirrors the PR badge in the bottom bar. |
| `pr.url` | string | PR URL. |
| `pr.review_state` | string | `approved`, `pending`, `changes_requested`, or `draft`. **May be absent even when `pr` is present.** |

The whole `pr` object is absent until a PR is found, outside a git repo, and once
the PR merges or closes.

### `output_style`

| Field | Type | Notes |
| --- | --- | --- |
| `output_style.name` | string | Name of the current output style, e.g. `"default"`. |

### `worktree` (optional — `--worktree` sessions only)

| Field | Type | Notes |
| --- | --- | --- |
| `worktree.name` | string | Active worktree name. |
| `worktree.path` | string | Absolute path to the worktree directory. |
| `worktree.branch` | string | Branch for the worktree, e.g. `"worktree-my-feature"`. **Absent for hook-based worktrees.** |
| `worktree.original_cwd` | string | Directory before entering the worktree. |
| `worktree.original_branch` | string | Branch checked out before entering the worktree. **Absent for hook-based worktrees.** |

Note the distinction from `workspace.git_worktree`: `worktree.*` is populated only
during `--worktree` sessions, whereas `workspace.git_worktree` is populated for
**any** linked git worktree.

## Full JSON example (from the docs)

```json
{
  "cwd": "/current/working/directory",
  "session_id": "abc123...",
  "session_name": "my-session",
  "transcript_path": "/path/to/transcript.jsonl",
  "model": {
    "id": "claude-opus-4-8",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/working/directory",
    "project_dir": "/original/project/directory",
    "added_dirs": [],
    "git_worktree": "feature-xyz",
    "repo": {
      "host": "github.com",
      "owner": "anthropics",
      "name": "claude-code"
    }
  },
  "version": "2.1.90",
  "output_style": {
    "name": "default"
  },
  "cost": {
    "total_cost_usd": 0.01234,
    "total_duration_ms": 45000,
    "total_api_duration_ms": 2300,
    "total_lines_added": 156,
    "total_lines_removed": 23
  },
  "context_window": {
    "total_input_tokens": 15500,
    "total_output_tokens": 1200,
    "context_window_size": 200000,
    "used_percentage": 8,
    "remaining_percentage": 92,
    "current_usage": {
      "input_tokens": 8500,
      "output_tokens": 1200,
      "cache_creation_input_tokens": 5000,
      "cache_read_input_tokens": 2000
    }
  },
  "exceeds_200k_tokens": false,
  "effort": {
    "level": "high"
  },
  "thinking": {
    "enabled": true
  },
  "rate_limits": {
    "five_hour": {
      "used_percentage": 23.5,
      "resets_at": 1738425600
    },
    "seven_day": {
      "used_percentage": 41.2,
      "resets_at": 1738857600
    }
  },
  "vim": {
    "mode": "NORMAL"
  },
  "agent": {
    "name": "security-reviewer"
  },
  "pr": {
    "number": 1234,
    "url": "https://github.com/anthropics/claude-code/pull/1234",
    "review_state": "pending"
  },
  "worktree": {
    "name": "my-feature",
    "path": "/path/to/.claude/worktrees/my-feature",
    "branch": "worktree-my-feature",
    "original_cwd": "/path/to/project",
    "original_branch": "main"
  }
}
```

## Absent vs null — handle both

These are two different failure modes and need different guards.

**Fields that may be entirely absent** (the key is not in the JSON):

- `session_name` — only when a custom name is set.
- `workspace.git_worktree` — only inside a linked git worktree.
- `workspace.repo` — only inside a git repo with an `origin` remote.
- `effort` — only when the model supports the effort parameter.
- `vim` — only when vim mode is enabled.
- `agent` — only with `--agent` or agent settings.
- `pr` — only while an open PR exists; `pr.review_state` may be independently absent.
- `worktree` — only during `--worktree` sessions; `branch`/`original_branch` may be
  absent for hook-based worktrees.
- `rate_limits` — only for Claude.ai Pro/Max after the first API response; each
  window may be independently absent.

**Fields that may be `null`** (present but valueless):

- `context_window.current_usage` — `null` before the first API call, and again after
  `/compact` until the next call repopulates it.
- `context_window.used_percentage` / `remaining_percentage` — may be `null` early in
  the session.

Practical guards: in `jq`, use `// 0` for nulls and `// empty` for absent-or-null
when you want to emit nothing; in Python use `.get(...)` chains with `or 0`; in
Node use optional chaining `?.` with `|| 0`.

## Environment variables Claude Code sets and reads

This is the part the earlier verbal answer got wrong. There **are** relevant
environment variables — they are just not named `CLAUDE_*`:

- **`COLUMNS` and `LINES`** — Claude Code captures the script's output rather than
  attaching it to the terminal, so `tput cols` and language-level width detection
  **cannot** read the terminal size from inside the script. Claude Code sets
  `COLUMNS` and `LINES` to the current terminal dimensions before running the
  command. **Read these to size your output.** Requires **v2.1.153 or later**.
- **`FORCE_HYPERLINK`** — set this in the environment *before launching* Claude Code
  (`FORCE_HYPERLINK=1 claude`) to force OSC 8 clickable-link support on terminals
  Claude Code does not auto-detect (e.g. Windows Terminal). This is an input to
  Claude Code, consumed before the status line runs.

Beyond those, the command inherits the normal shell environment of the Claude Code
process (`HOME`, `PATH`, `USER`, `TERM`, and anything exported in the shell
profile), so it can freely invoke other CLI tools (`git`, `jq`, `date`) on `PATH`.

## The settings that shape execution

Configured under `statusLine` in `~/.claude/settings.json` (or project settings):

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2,
    "refreshInterval": 5,
    "hideVimModeIndicator": true
  }
}
```

- `type` — `"command"`.
- `command` — script path or inline shell command.
- `padding` — extra horizontal spacing in characters (default `0`); relative
  indentation on top of the built-in spacing.
- `refreshInterval` — re-run on a timer every N seconds (minimum `1`), in addition
  to event triggers. Use for clocks or idle-period git refresh.
- `hideVimModeIndicator` — suppress the built-in `-- INSERT --` text; set `true`
  when your script renders `vim.mode` itself to avoid double display.

## What the output can do (the "what is possible" answer)

The script's stdout is the only display channel, but it is richer than plain text:

- **Multiple lines** — each `echo`/`print` is a separate row. Lets you split, say,
  git context on row one and a coloured context-usage bar on row two.
- **Colours** — ANSI escape codes (`\033[32m` green, `\033[31m` red, `\033[0m`
  reset). Useful for threshold-based context bars (green < 70%, yellow 70–89%,
  red 90%+).
- **Clickable links** — OSC 8 escape sequences make text a hyperlink
  (Cmd/Ctrl+click). Needs a supporting terminal (iTerm2, Kitty, WezTerm; not
  Terminal.app). Prefer `printf '%b'` over `echo -e` for reliable escape handling.
- **Arbitrary shell** — because it is a shell command with a full environment, you
  can call `git`, hit a local cache file, read `COLUMNS` for responsive width, etc.

Concrete capability sketches the docs ship working examples for:

- Model + directory + context-usage progress bar.
- Git branch with colour-coded staged/modified counts.
- Session cost (`cost.total_cost_usd`) and elapsed time (`cost.total_duration_ms`).
- Multi-line: git info on line 1, coloured context bar + cost + duration on line 2.
- Clickable GitHub repo link from the `origin` remote.
- Claude.ai rate-limit usage (`rate_limits.*`).
- Cached git lookups keyed by `session_id` to avoid per-tick `git status` lag.

A minimal, robust Bash skeleton:

```bash
#!/bin/bash
input=$(cat)

model=$(echo "$input" | jq -r '.model.display_name')
dir=$(echo "$input" | jq -r '.workspace.current_dir')
pct=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# git branch without forking when not in a repo
branch=""
git -C "$dir" rev-parse --git-dir >/dev/null 2>&1 \
  && branch=" | 🌿 $(git -C "$dir" branch --show-current 2>/dev/null)"

printf '[%s] 📁 %s%s | ctx %s%% | 💰 $%.2f\n' \
  "$model" "${dir##*/}" "$branch" "$pct" "$cost"
```

Test any script with mock input without launching a session:

```bash
echo '{"model":{"display_name":"Opus"},"workspace":{"current_dir":"/home/user/project"},"context_window":{"used_percentage":25},"session_id":"test-session-abc"}' | ./statusline.sh
```

## Subagent status lines

A separate but related setting, `subagentStatusLine`, overrides the per-row body of
each subagent in the agent panel below the prompt (default row is
`name · description · token count`):

```json
{
  "subagentStatusLine": {
    "type": "command",
    "command": "~/.claude/subagent-statusline.sh"
  }
}
```

It runs once per refresh tick with **all** visible subagent rows in a single JSON
object on stdin. The input is the **base hook fields** plus `columns` (usable row
width) and a `tasks` array, where each task has: `id`, `name`, `type`, `status`,
`description`, `label`, `startTime`, `tokenCount`, `tokenSamples`, and `cwd`. Write
one JSON line to stdout per row to override, of the form
`{"id": "<task id>", "content": "<row body>"}`. `content` renders as-is (ANSI + OSC
8). Omit a task's `id` to keep its default rendering; emit empty `content` to hide
it. The same trust and `disableAllHooks` gates apply.

## Corrections to common misconceptions

Recorded so the next agent does not inherit them (these were stated in an earlier
verbal answer produced from model memory, before this cross-reference):

1. **"There is no cost or duration data in the JSON."** — **Wrong.** The entire
   `cost` object exists: `total_cost_usd`, `total_duration_ms`,
   `total_api_duration_ms`, `total_lines_added`, `total_lines_removed`.
2. **"There are no environment variables / no `CLAUDE_*` vars for the status
   line."** — **Misleading.** There are no `CLAUDE_*` vars, but Claude Code **sets
   `COLUMNS` and `LINES`** (v2.1.153+) for width detection and **reads
   `FORCE_HYPERLINK`** for link support. The width point matters because terminal
   size cannot be read any other way from inside the script.
3. **`exceeds_200k_tokens` was omitted.** It is a real top-level boolean.
4. **`agent.type` was asserted as a field.** The official field table documents only
   `agent.name`; no `agent.type` is documented.

## Provenance and freshness

- **Source:** `https://code.claude.com/docs/en/statusline` (the
  `docs.claude.com/en/docs/claude-code/statusline` URL 301-redirects here), fetched
  2026-06-14.
- **Verified against:** locally installed Claude Code **v2.1.177**.
- **Version-sensitive facts to re-check on upgrade:** the `context_window` token
  fields became current-usage (not cumulative) in **v2.1.132**; `COLUMNS`/`LINES`
  injection requires **v2.1.153+**. Field names and shapes are otherwise stable as
  of the fetch date.

## Session notes (buffered here for re-homing — not part of the reference)

These notes are **Practice lessons**, not status-line facts. They live in this
document only because it was the single valid communication surface for the
session that produced it (2026-06-14). They are buffered here deliberately, and a
later session should **graduate them to their proper homes** — agent memory or a
Practice pattern, linked to the repo's `verify-dont-trust` rule — and then
**remove this section** so the document returns to its single responsibility as a
status-line reference.

### Grounded, not remembered

The first answer to the originating question was produced from model memory, and
was wrong in three concrete ways (see "Corrections to common misconceptions"
above). The durable lesson: **answer questions about Claude Code and LLM
behaviour from the canonical documentation (`code.claude.com/docs`), never from
model memory.** The field names, the entire `cost` object, and the environment
variables were all things the model "knew" incorrectly. A source-cited reference
artefact is the structural cure — it stops the next agent re-inheriting the error,
rather than correcting one instance of it.

### Verification methods that caught the errors

Two cheap checks did the real work and are worth reusing:

- **Cross-reference a confident answer against the primary source.** The errors
  stayed invisible until each claimed field was checked against the docs' field
  table. Confidence is not evidence.
- **Negative-control a validator before trusting a green result.** The
  commit-message checker was run on a deliberately bad message first (it had to
  fail) before its pass on the real message was trusted — guarding against a
  checker that exits `0` without actually checking anything.
