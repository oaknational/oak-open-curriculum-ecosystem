---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at [`napkin-2026-05-21.md`][archive-pass].
Prior rotations are [`napkin-2026-05-17.md`][previous-pass],
[`napkin-2026-05-14.md`][previous-previous-pass], and
[`napkin-2026-05-13.md`][previous-previous-previous-pass]. The 2026-05-21
rotation was the output of Gilded Ascending Orbit's consolidation pass over
the dense 2026-05-20 and 2026-05-21 multi-agent learning window. Behaviour-
changing entries were merged into [`distilled.md`](distilled.md) under
"Recently Distilled — 2026-05-21"; the full session-by-session capture lives
in the archived napkin.

[archive-pass]: archive/napkin-2026-05-21.md
[previous-pass]: archive/napkin-2026-05-17.md
[previous-previous-pass]: archive/napkin-2026-05-14.md
[previous-previous-previous-pass]: archive/napkin-2026-05-13.md

## 2026-05-21 — Gilded Ascending Orbit consolidation workflow / codex / GPT-5 / `019e4c`

### Surprise: same-prefix identity drift can appear inside one Codex session

- **Expected**: PDR-027 identity preflight would produce the same
  `agent_name` for the whole session prefix.
- **Actual**: live collaboration state contained a fresh `Prismatic Scattering
  Supernova / codex / GPT-5 / 019e4c` claim, while the current preflight
  resolved `019e4c` to `Gilded Ascending Orbit`.
- **Why expectation failed**: the wordlist or identity seed resolution can drift
  within the same platform session; the stable coordinate is the `(name,
  prefix)` pair, with the prefix carrying continuity evidence.
- **Behaviour change**: treat same-prefix/different-name as identity drift, not
  as a peer conflict. Preserve the older claim in the archive, open a fresh
  current-identity claim, and surface the reconciliation in comms before
  editing shared state.
  Source plane: `operational`.

### Consolidation observation: critical fitness pressure is multi-surface

`pnpm practice:fitness:informational` reported CRITICAL pressure in
`napkin.md`, `pending-graduations.md`, and `repo-continuity.md`, plus HARD
pressure in `distilled.md` and two directives. This pass rotated the napkin
first because it was the active capture surface and had a clean archive
lifecycle. The remaining critical surfaces need a follow-on drain rather than
reactive trimming.

Deferral honesty: pending-graduations and repo-continuity remain critical
because safely draining them requires entry-level classification and archive
mapping; doing that inside the same high-context directive-grounding pass would
increase the chance of lossy deletion. Falsifiability: the next consolidation
pass should either archive graduated pending-graduations entries and compact
repo-continuity history, or explicitly record why a higher-priority owner lane
pre-empted that drain.

## 2026-05-22 — Soaring Flying Gale / claude / claude-opus-4-7-1m / `ffa6ce`

### Surprise: long sessions accumulate stale grounding faster than expected

- **Expected**: a fresh `git log -8` + `git status` at session-open is durable
  across a multi-hour planning session.
- **Actual**: 4 commits landed on the same branch during my session window
  (HEAD jumped from `38b49645` to `ac893ca7`) via parallel Codex/Cursor work.
  My initial grounding was stale by the time I was ready to commit.
- **Why expectation failed**: the parallel-cohort model means the branch is
  multi-writer even during a "solo" session; grounding decays in real time.
- **Behaviour change**: re-run `git log -8` + `git status` immediately before
  staging on any session that exceeded ~1h between session-open and first
  commit attempt. The all-channels comms watcher would also surface the same
  drift if running; for plan-mode sessions where I deferred the watcher, the
  pre-commit re-ground is the substitute.
  Source plane: `operational`.

### Surprise: thread-record "Last refreshed" entry mutates mid-session

- **Expected**: reading the thread record at session-open gives a stable
  pointer-and-hypothesis for the session's duration.
- **Actual**: PR #108 hard-merge-blocker context was added to the thread
  record via a parallel commit (`1af47f9e`) DURING my plan-mode work. I only
  noticed when I went to write a Last refreshed entry of my own and saw a
  Feathered Circling Horizon entry that wasn't there at session-open.
- **Why expectation failed**: the Continuation Pointer Contract framing
  treats the thread record as a session-open pointer, but parallel-cohort
  operation makes it a live surface; pointer-snapshot semantics don't hold.
- **Behaviour change**: re-read the most-recent thread-record "Last refreshed"
  entry before writing my own — not as ceremony, as a freshness check.
  Discovered hard-gate context (like PR #108) reshapes the next-session entry
  shape and must be incorporated.
  Source plane: `operational`.

### Surprise: markdownlint MD018 treats `#108` at line start as ATX heading

- **Expected**: `PR #108` would be inert prose anywhere in a markdown body.
- **Actual**: paragraph-wrapping pushed `#108 gate is also a precondition.`
  to the start of a line. Markdownlint MD018 (no-missing-space-atx) treated
  the `#` as an ATX heading marker missing its required space.
- **Why expectation failed**: markdownlint scans line-start `#` regardless
  of whether the prior line continued the same paragraph; wrap position
  determines lint risk.
- **Behaviour change**: hyphenate as `PR-#108` (or rewrap so the `#` is
  mid-line) when issue/PR references appear in prose body text. The
  hyphenated form is still legible.
  Source plane: `operational`.

### Correction: agent-tools `claims close` uses `--closed` not `--archive`

- **Expected**: the flag matched the prose ("archive the claim with the
  resulting SHA") in the commit skill canonical text.
- **Actual**: `claims close --help` shows `--closed <path>` — the flag is
  named after the file's role at write time, not after the action.
- **Why expectation failed**: skill text used the action verb; CLI uses the
  destination noun. Mismatch.
- **Behaviour change**: read `--help` for any agent-tools CLI before first
  use in a session, even when the action feels obvious from a sister
  command's pattern. Cheap (~1s); cure for silent type confusion.
  Source plane: `operational`.
