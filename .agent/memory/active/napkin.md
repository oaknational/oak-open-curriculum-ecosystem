---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-25 — Breezy Flowing Dock / codex / GPT-5 / `019e5f`

### Processing Disposition

- Rotated the outgoing active napkin to
  `archive/napkin-2026-05-25-breezy-critical-hard-curation.md`
  only after routing live queue substance. This is a napkin rotation, not a
  comms retention action; the owner direction preserving all comms files for
  research remains binding.
- Fresh Briny/Hushed planning, role-emission, template, and multi-agent
  auto-fix candidates now live in
  `pending-graduations/2026-05-25-planning-and-autofix-candidates.md`.
  The main pending-graduations register now carries a pointer to that active
  shard rather than duplicating the full bodies.
- Misty Director-session candidates were already routed to
  `pending-graduations/2026-05-25-misty-director-session-candidates.md`.
  The outgoing napkin archive remains the source-window evidence.
- The hardening-arc standing direction on comms-file retention is preserved in
  `repo-continuity.md`, the thread record, and the outgoing napkin archive:
  do not move or delete `.agent/state/collaboration/comms/` files while the
  comms research plan remains active.

### Mistakes Made

- I repeated the known zsh quoting hazard by putting backticks inside a
  double-quoted `rg` pattern; zsh attempted command substitution on
  `` `comms watch` `` before `rg` ran. Behaviour change: use single-quoted
  literal patterns whenever searching for text containing backticks.
- During handoff I attempted to append a comms event with a `lifecycle` tag.
  The live tool only accepts the ADR-183 tag namespace (`failure-mode`,
  `behaviour-note`, `heartbeat`). Behaviour change: omit tags for generic
  closeout broadcasts unless using one of those canonical values.

### What Worked

- Manual UAT against `oak-preview-1` (education-evidence preview, 2026-05-25):
  checklist sections A–H all pass; 29 MCP tool calls; same non-blocking quirks
  as prior passes (empty suggest `url`, thread unit `oakUrl: null`).

- The useful response to the current critical/hard fitness map was structural:
  preserve the source window in an archive, route live candidates into active
  shards, and leave comms retention untouched. No substance was trimmed to make
  the fitness output greener.
