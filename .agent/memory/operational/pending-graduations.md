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

New capture appends below as inline-bracket entries — `- **<title>**` then a fenced
bracket with pipe-separated `captured / source / target / trigger / size / status`
fields (schema: `agent-tools/src/practice-fitness/item-count.ts`). The two live
candidates below were conserved from the napkin at the 2026-06-18 Sandpiper
consolidation; both are owner-decision-gated (surfaced to the owner this pass).

- **New-vessel-for-new-kind: "don't fragment" never means "fold everything in"**
  `[captured: 2026-06-17 | source: napkin (Phobos turns Singularity) |
  target: pattern or rule clause refining consolidate-estate / no-plan-fragmentation
  doctrine | trigger: a 2nd instance across sessions, OR the owner judges the single
  instance stable enough to graduate now | size: S | status: pending]`
  When the "consolidate the estate / don't fragment the plan estate" reflex points at
  folding new work into an existing plan, the situational check is whether the work
  differs in *kind* — if it does, a new bounded vessel with an explicit declared
  boundary (depend, don't merge) is the non-fragmenting shape. One clean owner-corrected
  instance; a doctrine-by-analogy cure not fully covered by
  `scope-from-goal-before-approach` or `consolidate-estate-decouple-execution`. Holds as
  decision-debt until a second instance confirms stability or the owner rules.

- **Best-effort consolidation is only as safe as the check that follows (PDR-104 ↔ PDR-098)**
  `[captured: 2026-06-18 |
  source: napkin (Wisteria spins Bark, "Last insights before handoff") |
  target: amendment linking PDR-104 and PDR-098 (and the PDR-089 conservation-reflex
  external-check) | trigger: owner ratifies the link this consolidation, OR the next
  consolidation-safety / autonomy design pass | size: S | status: due]`
  PDR-104 (best-effort doctrine authoring in dedicated consolidation) is only as safe as
  the check that follows it. The 2026-06-18 session's four owner-corrections show that for
  an *owner-present* pass the flow self-corrects via the owner; for an *owner-absent*
  autonomous consolidation the correction must be **mechanical** (the PDR-098
  recurrence-capture step, the proposed fitness-report-self-framing cure, the F-69
  session-open sweep). So PDR-104 and the PDR-098 family are complementary: a solo
  autonomous dedicated-consolidation, before those mechanisms exist, is higher-risk than
  PDR-104 alone implies. Doctrine-shaping — surfaced for owner ratification before authoring.
