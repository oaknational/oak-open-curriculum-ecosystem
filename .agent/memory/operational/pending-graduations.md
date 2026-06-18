---
fitness_line_target: 1100
fitness_line_limit: 1467
fitness_char_limit: 200000
fitness_line_length: 100
fitness_item_count: required
fitness_item_count_target: 0
fitness_item_count_soft: 2
fitness_item_count_hard: 3
fitness_item_dwell_target: 2
fitness_item_dwell_soft: 4
fitness_item_dwell_hard: 7
lifecycle_model: >-
  canonical pending-graduations register — every live item is decision-debt
  (status pending/due/overdue) until it is graduated, rejected, or marked
  duplicate. Provenance and adaptation are the safety net for a wrong call.
access_pattern: >-
  consolidation-pass-only — read at consolidations and drain sessions; not
  loaded every session by every agent
drain_strategy: >-
  Drain by DECIDING: graduate or reject each item, recording the disposition in
  its permanent home, to PDRs/ADRs/rules/permanent docs. An item that is an open
  QUESTION (a design decision with candidate options needing a decision session)
  graduates to an exploration/research plan, not to doctrine and not to register
  decision-debt. The decision-debt count falls only through a recorded terminal
  disposition — never by deleting an undecided item and never by raising a limit.
  Do not split, shard, or hide buffer depth.
fitness_rationale: >-
  The primary health signal for this buffer is the decision-debt count
  (fitness_item_count, target 0) — a flow-rate reading of whether graduation is
  keeping pace with capture. The line and character limits are a secondary
  structural signal: drain-cadence back-pressure for a consolidation-pass-only
  buffer, not a size cap. Recalibrated 2026-06-08: line hard 2200 -> 1467, target
  1500 -> 1100, so line-critical (hard x 1.5, the global ADR-144 ratio) lands at
  ~2200. Both signals are reported and acted on, never chased: substance is never
  trimmed to clear a zone (knowledge-preservation), and the register is drained
  down by deciding items, not by tombstone-removal. Prior note: recalibrated
  2026-05-27 to collapse legacy pseudo-shards back into this one canonical
  register; fitness is routing evidence, not permission to create sidecar buffer
  files.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

This is the canonical pending-graduations register. Do not create dated,
windowed, backlog, split, or shard-like pending-graduation files. New capture and
unresolved pending-graduation decisions belong here until they graduate, are
rejected, or become duplicate — every live item is decision-debt to decide.

**Every live item is decision-debt** (status pending/due/overdue), drained by
graduation or rejection; provenance and adaptation are the safety net for a
wrong call.

**Homing categories** when deciding an item: a settled lesson (an *answer*)
graduates to doctrine (rule / PDR / ADR / pattern / governance doc); a tooling
gap routes to the frictions register; an open *question* (a design decision with
candidate options needing a decision session) graduates to an
exploration/research plan; otherwise reject with the reason. An item only remains
live decision-debt when it is genuinely un-actionable now AND has no such home —
a true rarity. If an item fits no category, that is a signal the category set is
incomplete, not licence to let it age here.

*No live decision-debt: the register is drained (2026-06-18). Every captured
candidate reached a terminal disposition. New capture appends below as
inline-bracket entries — `- **<title>**` then a fenced bracket with pipe-separated
`captured / source / target / trigger / size / status` fields (schema:
`agent-tools/src/practice-fitness/item-count.ts`).*
