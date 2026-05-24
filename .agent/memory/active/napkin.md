---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Hushed Fading Hush / codex / GPT-5 / `019e5a`

Fresh active napkin after the processed
[post-M1 cleanup window][post-m1-window] was archived.

### What Was Done

- Re-grounded under `start-right-team` and `consolidate-docs`.
- Ran the live fitness report and found the current critical item:
  active-napkin prose line width.
- Reflowed the overlong Seaworthy Window 2 capture without removing substance.
- Archived the processed active window only after every entry in it had an
  explicit processing disposition or live route.

### Patterns to Remember

- `comms watch` with a fresh seen-file can replay a large historical backlog.
  Seed or expect the backlog explicitly before treating watcher quietness as
  current-state evidence.
- Fitness critical-by-line-width can be fixed by faithful reflow first. If that
  exposes hard line-count pressure on already-processed capture, archive the
  processed napkin window instead of trimming substance.
- Same `session_id_prefix` continuity can still show generated display-name
  drift in comms and active claims after compaction or resumed goal turns.
  Treat the prefix plus live claim evidence as the stronger continuity signal,
  then name the drift in closeout instead of opening a competing claim.
- Repo-continuity soft-tier consolidation worked by preserving the outgoing
  live-index snapshot in archive, then replacing duplicated historical routing
  with pointers to thread records and active plans. Validate with targeted
  markdownlint, `git diff --check`, and both practice fitness modes.
- `claims open` uses `--ttl-seconds`, not `--freshness-seconds`. The rendered
  claim still stores `freshness_seconds`, but the CLI flag is the TTL form.
- For active pending-graduations shards, a low-risk soft-tier drain is to find
  entries already marked `status: graduated`, verify their durable home still
  carries the substance, archive the full body, and remove only that processed
  body from the shard.
- I repeated the pipe-in-evidence mistake while locating the commit queue path.
  If a filter feels useful, run the broad producer and the narrow search as
  separate readable evidence steps.

[post-m1-window]: archive/napkin-2026-05-24-post-m1-cleanups-window.md
