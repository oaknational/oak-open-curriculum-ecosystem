# Operational diagnostics

Long-term diagnostic traces for agents working in this repo.
Files in this directory carry **append-only operational traces**
of behaviours that warrant pattern-tracking across sessions and
across machines.

## Files

- `commit-attempts.log` — TSV log of `git commit` attempts,
  recording timestamp, outcome, elapsed seconds, sha, invocation
  mode, subject, and note. Historically appended by
  [`scripts/log-commit-attempt.sh`](../../../../scripts/log-commit-attempt.sh)
  after each commit attempt. Collection is currently paused; the
  file is retained as historical data and the script is dormant.

## Convention

Do not append new rows while commit-attempt logging is paused.
`commit-attempts.log` remains in the repo as a historical trace from
the period when cross-session commit diagnostics were being collected.

Fields:

- **OUTCOME** — `ok` (commit landed) | `fail` (hook genuinely
  failed) | `truncated` (tool reports rc != 0 but no commit
  landed AND hook output was visibly cut off; a Shell-tool /
  stream-handover artefact, not a hook-substance failure) |
  `interrupted` (user or tool interrupted before completion).
- **ELAPSED** — integer seconds (or `-`).
- **SHA** — short commit sha (or `-`).
- **MODE** — short free-form string for invocation pattern, e.g.
  `heredoc-stream`, `heredoc-fileout`, `-m-stream`, `-m-fileout`.
  Helps correlate truncation with invocation shape.
- **SUBJECT** — commit subject (truncated to 80 chars).
- **NOTE** — optional free-form short note (e.g. machine
  identifier, node/pnpm version, Shell-tool variant — anything
  that helps correlate cross-machine differences later).

## Why kept in git?

The file remains tracked because it is part of the repo's recent
operational history and may be reactivated soon if commit diagnostics
become necessary again. While paused, it should be treated as
historical data rather than an active append-only workflow.
