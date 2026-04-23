# Operational diagnostics

Long-term diagnostic traces for agents working in this repo.
Files in this directory carry **append-only operational traces**
of behaviours that warrant pattern-tracking across sessions and
across machines.

## Files

- `commit-attempts.log` — TSV log of `git commit` attempts,
  recording timestamp, outcome, elapsed seconds, sha, invocation
  mode, subject, and note. Appended by
  [`scripts/log-commit-attempt.sh`](../../../../scripts/log-commit-attempt.sh)
  after each commit attempt. Used to diagnose hook timing,
  output-truncation, and environment quirks over time, across
  sessions and across machines.

## Convention

After every `git commit` attempt — successful or otherwise —
append a row:

```bash
scripts/log-commit-attempt.sh OUTCOME ELAPSED SHA MODE "SUBJECT" ["NOTE"]
```

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

## Why tracked in git?

Cross-machine and cross-agent visibility is the whole point: a
pattern is only diagnosable if every agent in every session can
see what other agents have seen. Pattern extraction (turning a
log signal into a napkin observation, or a stable pattern entry)
still happens in the napkin / pattern library; the log is the
raw substrate that pattern-extraction reasons over.
