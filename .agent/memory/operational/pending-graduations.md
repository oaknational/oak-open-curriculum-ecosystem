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

**Draining is decide-all-to-zero, and ordering does not cause starvation.** Each consolidation
decides *every* decidable item — graduate, reject, or confirm duplicate — toward an empty
register (`fitness_item_count_target: 0`, the target for every drainable buffer); an item stays
only when a named constraint genuinely blocks deciding it now. The anti-starvation guard is the
**dwell-time axis** (`fitness_item_dwell_*`, target 2 / soft 4 / hard 7 days): it surfaces the
*oldest* undecided item's age and escalates it, so a long-lingering candidate grows louder until
it forces attention — when a pass cannot reach everything, decide the oldest-and-loudest first.

**Homing categories** when deciding an item: a settled lesson (an *answer*)
graduates to doctrine (rule / PDR / ADR / pattern / governance doc); a tooling
gap routes to the frictions register; an open *question* (a design decision with
candidate options needing a decision session) graduates to an
exploration/research plan; otherwise reject with the reason. An item only remains
live decision-debt when it is genuinely un-actionable now AND has no such home —
a true rarity. If an item fits no category, that is a signal the category set is
incomplete, not licence to let it age here.

New capture appends below as inline-bracket entries — `- **<title>**` then a
backtick-wrapped inline `[…]` block (may wrap across lines) with pipe-separated
`captured / source / target / trigger / size / status` fields
(schema: `agent-tools/src/practice-fitness/item-count.ts`). The bracket must NOT be
fenced — a fenced or unwrapped block is silently uncounted (it raises a malformed finding).

*Register drained (2026-06-19 dedicated consolidation, Finch binds Halo). Every live
candidate was decided this pass per PDR-104 best-effort authority — the "owner-gated"
tags the prior pass attached were the over-caution fig-leaf PDR-104 §Enables names, not
real gates (`fabricated-gate-as-avoidance`, `over-caution-root-is-perfectionism`). The
substance reached its permanent home: the new-in-kind vessel doctrine and the
over-caution recurrence evidence are live in their homes, and the best-effort-safety
link is folded into PDR-104 itself. New capture appends below.*

- **Falsifiable-judgment quality gate (decompose the judgment against the source,
  don't trust a holistic verdict)**

  `[captured: 2026-06-21 | source: napkin (Saffron holds Sepal) + restructure-substance-specs.md
  Spec 1 | target: PDR with pdr_kind: pattern (falsifiable-judgment-gate) | trigger: SECOND
  instance of the shape in another gate/review → ready to synthesise the general form (one
  instance now: the substance-gate effectiveness arm) | size: small | status: pending]`

  A quality gate's judgment-heavy arm is its theater-risk locus: where
  conformance/traceability/no-loss have concrete mechanisms, a "does X plausibly achieve Y" arm
  can pass by hand-waving. Cure: decompose the judgment against a FIXED checklist of dimensions
  Y's source visibly contains, so under-decomposition is falsifiable by the source (not reviewer
  taste) and the verdict is unrenderable without the source-anchored coverage × soundness map.
  One instance so far (the effectiveness arm); needs a second to synthesise the PDR-pattern
  general form.

- **State-tier process-and-archive-move convention (extend ADR-199 rotation to
  non-comms collaboration state)**

  `[captured: 2026-06-21 | source: archive/README.md + .agent/state/collaboration/.gitignore +
  napkin (Saffron holds Sepal) | target: ADR-199 amendment (or a sibling ADR) generalising
  archive-move to conversations/sidebars/handoffs | trigger: SECOND state-archive-move pass, OR
  the memory-vs-state local-split lands → DUE | size: small | status: pending]`

  Owner doctrine (2026-06-21): stale collaboration state is PROCESSED (substance
  verified-conserved into canonical homes), then ARCHIVE-MOVED to an untracked archive, NEVER
  git-rm'd. This session built the convention for conversations/sidebars/handoffs (untracked
  `archive/`, tracked README, gitignored contents) mirroring ADR-199's comms-event rotation.
  Currently a one-instance local convention; graduate to an ADR (amendment or sibling) when a
  second pass or the planned memory-vs-state split makes it general.
