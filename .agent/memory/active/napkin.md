---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

## 2026-05-26 - Thermal Swooping Wing critical curation pass / codex / GPT-5 / `019e63`

### What Was Done

- Archived the processed active napkin source window intact at
  `archive/napkin-2026-05-26-thermal-critical-curation.md`.
- Replaced the active napkin with this fresh session surface after routing the
  dense n=2 closeout substance through the active pending-graduations shard.
- Preserved the standing comms-retention direction: no comms files were moved
  or deleted during this curation pass.

### Processing Disposition

- Feathered's unauthorised Cycle 1 / Cycle 2 framing mistake is already homed in
  the plan revision, repo-continuity, the archived source window, and per-user
  memory `feedback_no_unauthorised_scope_invention_in_plans`.
- Torrid and Feathered n=2 bundle learnings are routed through
  `pending-graduations/2026-05-26-feathered-torrid-n2-cycle-1-candidates.md`.
- Open decision residue is routed through `open-questions.md`; the full source
  window is archived at
  `../operational/archive/open-questions-archive-2026-05-26-thermal-critical-curation.md`.

### Mistakes Made

- Owner corrected my resumed curation framing: we never trim or chase status
  changes; fitness status is a signal for prioritising work. Behaviour change:
  move important knowledge to the correct, discoverable, useful home; if no
  clear home exists, surface that as a discussion instead of compressing,
  trimming, or quietly changing status.
- I first looked for `distilled.md` at `.agent/memory/distilled.md`; the live
  file is `.agent/memory/active/distilled.md`. Behaviour change: trust the
  current repo index and frontmatter paths, not memory of older locations.
- My first heartbeat attempt used `--body` with `--tag heartbeat`; A1 now
  correctly rejects that shape. Behaviour change: heartbeat-tagged comms events
  must pass typed state args: `--claim-id`, `--intent-id`, `--branch`, and
  `--current-cycle-label`.
- On continuation I tried stale CLI shapes: `comms tail` and
  `commit-queue list --json`. Behaviour change: refresh `--help` for
  collaboration-state and commit-queue subcommands before relying on remembered
  flags.
- I repeated the zsh backtick trap while scanning pending-graduations due
  items: a double-quoted search pattern containing `` `due` `` attempted
  command substitution. Behaviour change: single-quote `rg` patterns that
  contain markdown code ticks.
- I tried to tag a normal comms narrative event with `--tag progress`; the CLI
  correctly rejected the non-canonical ADR-183 namespace. Behaviour change:
  narrative progress events usually need no tag; reserve `--tag` for canonical
  namespaces such as `failure-mode`, `behaviour-note`, and `heartbeat`.
- On the resumed curation turn I guessed a standalone commit-queue registry
  path at `.agent/state/collaboration/commit-queue.json`; the live queue is
  embedded in `active-claims.json` unless a registry is explicitly configured.
  Behaviour change: run `pnpm agent-tools:commit-queue -- list --help` before
  naming a registry path from memory.
- I also guessed a `comms inbox --since` flag during closeout; the live inbox
  shape takes `--comms-dir`, `--seen-file`, `--platform`, `--model`, and
  optional `--session-prefix`. Behaviour change: use the command's emitted
  usage line after any argv rejection instead of layering remembered filters.

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state comms append`
- **Signal**: friction
- **Observation**: `comms append --help` still advertises `--body` for all
  append events; the heartbeat typed-args exception appears only after a
  rejection.
- **Behaviour change / candidate follow-up**: update help text to name the
  heartbeat typed-args special case, or provide a heartbeat-specific help line.
