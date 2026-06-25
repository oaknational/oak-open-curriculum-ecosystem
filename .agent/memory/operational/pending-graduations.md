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

*Register empty (2026-06-23 dedicated consolidation, Narwhal tracks Lagoon). The two live
candidates were decided this pass per owner direction: the falsifiable-judgment-gate candidate
graduated to PDR-116; the state-tier process-and-archive-move convention graduated to ADR-203.
New capture appends below.*

- **Assurance-regime portable PDR (test / evaluate / assure + 3 harm-keyed tiers)**

  `[captured: 2026-06-24 | source: napkin (Magnolia spins Mulch), archived in
  napkin-2026-06-23-narwhal-consolidation.md | target: Core PDR (pdr_kind governance) so the
  assurance regime travels with Practice Core | trigger: a SECOND Practice-bearing repo faces the
  assurance-regime decision (plasmid exchange) AND the regime is stable across >=1 later session |
  size: small | status: pending]`

  The assurance regime (test/evaluate/assure; three harm-keyed tiers; in-repo eval home; closing
  against a real-world value signal) is already homed as host directives (principles.md §Agentic
  Quality + validation-strategy.md). Only the PORTABLE generalisation — authoring it as a Core PDR
  so it travels to other repos — awaits a second Practice-bearing repo facing the same decision;
  genuinely external-gated, not agent-drivable now. Owner kept-gated 2026-06-24. Homed here (from
  the archived napkin) so a future consolidation pass that walks this register sees the candidate
  when the trigger fires.

- **Liveness during a model-availability outage — external staleness-reaper / dead-man's-switch primitive**

  `[captured: 2026-06-25 | source: worktree-pilot-consolidation-and-model-verdict.plan.md §Risk
  Assessment + open-questions Q-011 (Thyme lifts Compost, session c2b721) | target: PDR
  (operating-model governance) — a structural external-reaping liveness primitive | trigger: owner
  takes the Q-011 architectural decision OR a second false-"active"-after-outage incident recurs |
  size: small | status: pending]`

  "Stop your heartbeat at stand-down" cures only the graceful case; an outage kills a session's
  Monitors so it cannot stop its own heartbeat, leaving a stale-but-"active" signal (~8h observed in
  the worktree-pilot outage). The cure is an *external* staleness-reaper / dead-man's-switch that
  reaps from outside the dead session, not self-stop. Owner-decision-gated (architectural primitive,
  not agent-drivable). Full analysis lives in the plan §Risk Assessment and Q-011 — not restated here.

- **Practice↔IDE integration plane — bounded-capability, local-install-only IDE plugin**

  `[captured: 2026-06-25 | source: report practice-ide-integration-plane-feasibility-2026-06-25.md
  (Panther hunts Reverie, cursor 7e4510) | target: PDR (portable capability concept — "the Practice
  may cause effects in the IDE only through a closed, adversarially-vetted template registry; blast
  radius bounded by construction") + host ADR (the practice-ide-plugin workspace + agent-tools
  practice-ide commands + workspace file-drop transport) | trigger: owner greenlights the build (the
  report §11 owner decisions resolved) AND the first vetted capability lands | size: medium | status:
  pending]`

  Both halves are Practice substance (PDR-035 / ADR-165). The concept is a proposal under owner
  decision (report §11: first template, no-shell vs interactive-shell, workspace/command names,
  kill-switch default, which agents constitute the comprehensive review, the deep-docs-read gate),
  not yet built or stable — so it is captured here so a future consolidation pass surfaces it when
  the owner decides, rather than graduated now. The security argument (bounded blast radius via a
  closed template registry; no URI surface; per-template parameter→shell-flow adversarial analysis)
  and the architecture live in the report — not restated here.
