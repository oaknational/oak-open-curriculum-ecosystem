---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Shaded Silencing Dusk / codex / GPT-5 / `019e59`

Fresh capture after the fourth same-day active napkin rotation. Previous
active source window preserved at
[`napkin-2026-05-24-curator-fourth-rotation.md`][fourth-rotation-archive].

### Mistakes Made

- `claims open` uses `--ttl-seconds`, not `--freshness-seconds`; check the
  subcommand help before opening a fresh claim after compaction or context
  change.
- `comms inbox` uses `--seen-file`, not `--since-file`; the CLI usage text is
  the source of truth after compaction.
- `claims open` requires `--area-kind files` even when repeatable `--file`
  arguments are present; reading help is not enough if I do not apply it.
- I used a shell pipe while inspecting a diff slice. Keep evidence-gathering
  outputs separate via the parallel wrapper so the transcript stays readable.

### Processing Disposition

- Reviewed 2026-05-24 under Shaded claim
  `d2f24c33-3772-48d1-8aee-b113e0941ea6`.
- The three `agent-tools` flag-shape mistakes are current worked instances of
  the existing distilled `CLI flag-shape drift under coordination pressure`
  lesson; no new permanent surface is needed while Sylvan owns the distilled
  lane.
- The shell-pipe mistake is covered by the existing distilled `Keep evidence
  outputs readable` lesson.
- No archive move: this active napkin remains the live capture surface and is
  far below rotation threshold.

[fourth-rotation-archive]: archive/napkin-2026-05-24-curator-fourth-rotation.md
