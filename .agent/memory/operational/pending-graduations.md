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
  Drain by DECIDING: graduate (write the doctrine into its rule/PDR/ADR/pattern/
  governance-doc home, then remove the entry) or reject (decided not worth a
  home, with the reason). The decision-debt count falls only through a recorded
  terminal disposition — never by deleting an undecided item and never by raising
  a limit. Do not split, shard, or hide buffer depth.
fitness_rationale: >-
  The primary health signal for this buffer is the decision-debt count
  (fitness_item_count, target 0) — a flow-rate reading of whether graduation is
  keeping pace with capture. The line and character limits are a secondary
  structural signal: drain-cadence back-pressure for a consolidation-pass-only
  buffer, not a size cap. Recalibrated 2026-06-08: line hard 2200 -> 1467, target
  1500 -> 1100, so line-critical (hard x 1.5, the global ADR-144 ratio) lands at
  ~2200. Both signals are reported and acted on, never chased: substance is never
  trimmed to clear a zone (knowledge-preservation), and the register is drained
  down by deciding items, not by tombstone-removal.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

# Pending Graduations

The canonical register of **learned doctrine awaiting its permanent home** —
a lesson, pattern, or decision that is *already settled* and simply not yet
written into the rule / PDR / ADR / pattern file / governance doc where it will
live and fire. Every live entry is decision-debt (`status: pending/due/overdue`),
drained by **graduating** it (write it into its home, verify, then remove the
entry) or **rejecting** it (decided not worth a home, with the reason). The
target is empty (`fitness_item_count_target: 0`); provenance and adaptation are
the safety net for a wrong call.

## What belongs here — and what does not

An entry belongs ONLY if all three hold:

1. **It is learned doctrine** — a settled lesson, pattern, or decision, validated
   by implementation, by surviving at least one later session uncorrected, or by
   an owner correction. Not a hypothesis, not a proposal, not a question.
2. **Its home is a doctrine surface** — a rule, PDR, ADR, `patterns/` file, or
   governance doc. (If the natural home is a *plan* or a *report*, the item is
   future work or a proposal, not a graduation — see below.)
3. **It is not yet written there** — the only outstanding act is authoring it
   into that home.

**Belongs** (worked shapes):

- *"The prove-the-checker-with-a-negative-control lesson is stable across three
  instances and has no pattern file yet."* → graduates to a `patterns/` file.
- *"The decision-locus doctrine (product scope is the owner's; engineering is
  collaborative) is settled and uncorrected, but lives only in the napkin."* →
  graduates to a `user-collaboration.md` section.

**Does NOT belong** — route via the destinations table in
[`ephemeral-to-permanent-homing.md`](ephemeral-to-permanent-homing.md):

- **Future work / a build to do later** (*"author the portable Core PDR when a
  second repo adopts X"; "build the IDE plugin once the owner approves"*) → a
  `plans/` entry (in `future/` with a promotion trigger). The underlying doctrine
  may already be homed; the *doing-it-later* is a plan, not a graduation.
- **A proposal or feasibility finding** (*"here is a design for an IDE
  integration plane"*) → a `reports/` or `research/` artefact, promoted to a plan
  on owner GO.
- **An open question** (*"what liveness primitive should the operating model
  carry?"*) → [`open-questions.md`](open-questions.md) if strategic, or an
  exploration plan if it is a design decision needing a session.
- **An operational what-next or owner decision** (*"should we re-establish the
  Director seat?"*) → [`repo-continuity.md`](repo-continuity.md) (Next Safe Steps
  / Open Owner-Decision Items) or the owning thread record.
- **A tooling gap** → the frictions register.

The test: if you cannot name the *exact* rule / PDR / ADR / pattern / doc section
the entry will be written into, it is probably not a graduation — find its real
home above. An item only remains live decision-debt when it is genuinely settled
doctrine, has a doctrine home, and that home just has not been authored yet.

## Draining and dwell

Each consolidation decides *every* decidable item — graduate or reject — toward
an empty register. An item stays only when a named constraint genuinely blocks
authoring its home now. The anti-starvation guard is the **dwell-time axis**
(`fitness_item_dwell_*`, target 2 / soft 4 / hard 7 days): it surfaces the
*oldest* undecided item's age and escalates it. The dwell reading is **age, not
a hedge** — a short dwell is never licence to leave a decidable item undecided.

New capture appends below as inline-bracket entries — `- **<title>**` then a
backtick-wrapped inline `[…]` block (may wrap across lines) with pipe-separated
`captured / source / target / trigger / size / status` fields (schema:
`agent-tools/src/practice-fitness/item-count.ts`). Every field name carries a
colon (`captured: …`, `trigger: …`). The bracket must NOT be fenced — a fenced
or unwrapped block is silently uncounted (it raises a malformed finding).
`target` must name a doctrine surface (rule / PDR / ADR / pattern / governance
doc); if it names a plan or report, the item belongs elsewhere. **After ANY
append, run the parser's own readout** (`pnpm practice:fitness:informational`,
the Live decision-debt line) **and verify the count MOVED** — colon-less
fields once left four items reading as a clean register (vacuous-green in a
debt register, 2026-07-08).

<!-- New pending-graduation capture appends below as inline-bracket entries. -->

<!-- Register drained to empty at the 2026-08-14 dedicated consolidation (Quasar
wakes Nadir, the fresh directive-headroom seat all five rows were gated on):
ends-before-means graduated to principles.md §Ends Before Means, Front of Chain
First; the generality-depth articulation to principles.md §Context Specificity
Gradient; owner-channel-answer-first to user-collaboration.md §Working Model
(bullet); the goal-hook pacing clause to metacognition.md §Fluency (standing
goal-hook paragraph); the file-emitting-watcher clause to
use-monitor-for-event-driven-wake §A File-Emitting Watcher Is Half-Armed
Without a Read Path, cross-referenced from comms-all-channels-watcher §Related
Surfaces. Homes verified live at drain. The commits and the homes are the
record. -->

<!-- Register drained to empty at the 2026-08-07 curator pass (Gull lifts Nimbus, fresh
seat clearing the directive-file-context-budget gate both rows were held on): the
constraint-surface sentence (Badger, 2026-08-02) graduated to principles.md §Separate
Framework from Consumer as the licence-map paragraph; the sentinel-taxonomy row (Birch,
2026-08-03) was found ALREADY LANDED in testing-strategy.md §Prove-behaviour as the
designed-sentinel admissibility clause (commit 92defb609, owner doctrine 2026-08-03,
MCP-462 trigger artefact named in place) — home verified live first-hand, row removed as
already-graduated. The commits and the homes are the record. -->

<!-- Register drained to empty at the 2026-07-20 dedicated consolidation (Siren lifts
Trench): the F-92 heartbeat-loop item was already terminal (duplicate of F-92, whose cure
now also lives in the liveness-heartbeat-cron rule's canonical-invocation clause); the
no-risk-of-loss absoluteness clause graduated to never-use-git-to-remove-work §A Safety
Proof Never Licenses the Class; the "nothing is mine" ruling graduated to the PDR-117
2026-07-20 amendment; derived-output conservation graduated to the
derived-output-conservation pattern; the cut-branch roll-up practice graduated to
no-parallel-long-lived-branches and the verification-methods candidate to the
verification-method-must-answer-the-question pattern; the no-escape-hatches ruling
graduated to principles.md §Strict and Complete. All homes verified live before this
drain. The commits and the homes are the record. -->

## Slow lane (PDR-130 — constitutional-class concepts, decided at their review date)

Rows here are live deliverables under a named review gate, NOT decision-debt:
each carries a prediction, a falsifier, and a review date, and is decided
(promote / kill-with-reasoning) AT that date. A dedicated consolidation passes
these by unless a review date has arrived. **Bootstrap exception (the row
below): a row tracking an ALREADY-ACCEPTED record is decided retain vs
retire-by-its-own-falsifier at review — promote/kill applies only to
not-yet-minted concepts.**

| Concept | Prediction (by review) | Falsifier | Review |
| --- | --- | --- | --- |
| Two-speed learning itself (PDR-130) | ≥3 fast-lane graduations carry prediction lines; ≥1 slow entry promoted or killed BY its review | Register untouched at review — the lane is theatre; retire the PDR by its own rule | 2026-10-01 (first consolidation on/after) |
| Close-time single-lesson graduation (retrospective 2026-07-20 proposal 1): a captured lesson that is single-instance sufficient (PDR-100), has a nameable doctrine home, and needs no cross-seat synthesis graduates AT session close; the frozen-corpus constraint gates rotation and cross-seat synthesis only. Promotion target: `session-handoff` step 6b, landed under the PDR-101 quorum. Provenance: authored FAST-enacted in the retrospective, reclassified slow-lane at PR #450 review (PDR-130 §§2/4; Director-ratified 2026-07-20) | Pre-promotion observable, accrued in this row during the quarter: each clause-eligible lesson that recurs between capture and its homing is logged here as it occurs — the measured cost of batching while the clause stays unenacted (worked warrant: a June-documented class re-surfaced 2026-07-17 and re-bit three seats before homing, ~3 days from that re-surfacing). At review: promote if at least one recurrence class accrued; the post-promotion prediction (recurrence drops to ~zero) binds only after enactment | No recurrence accrues by review (the batching frame carries no measured cost — the entry is killed), or the accrual log itself goes untouched (the row is theatre; kill it by the register's own rule) | 2026-10-20 |
| Blame-referent calibration (retrospective 2026-07-26, PDR-094 arc): agents calibrate to the most salient blame signal (accreted caution, or the last correction), not the standing policy, whenever the policy exists only in the owner's head; a WRITTEN owner-ratified policy line converts reversal-grade corrections on that axis into calibration-grade refinements. Provenance: `.agent/reports/agentic-engineering/2026-07-26-pdr-094-retention-arc-retrospective.md` §Meta root (v1–v2 hoard, v3 over-delete, v4 co-authored referent, all one arc) | By review: NO reversal-grade owner correction on the retention axis (the axis now carries its written line, PDR-094 v4); any retention correction observed is a refinement, not a reversal | A reversal-grade retention correction lands despite the written line — the written-referent cure is insufficient and the mechanism needs an action-time instrument (kill this row into that finding) | 2026-10-26 |

- **PDR-117 missing axes: role-scoped value lens and seat-deliverable framing**
  `[captured: 2026-08-14 | source: owner corrections 2026-08-10 (Director fold cascade) and
  2026-08-14 (curator self-executed merge-back; archive/napkin-2026-08-14.md 06:08Z entry) |
  target: PDR-117 amendment — the value lens runs role-scoped BEFORE the licensing/safety
  lens on self-initiated work; a seat's deliverable is its role's output, never legible
  effort; shared-git-state operations route to the warden/Director from non-warden seats |
  trigger: owner ratification (amendment authored at next consolidation or Director PDR
  pass; two owner-correction instances already recorded) | size: S | status: pending]`

- **Codex review leg as a standing member of significant-PR review rounds**
  `[captured: 2026-08-14 | source: owner rating 2026-08-09 (high-value; "route through the
  rules process, not assumed") | target: rule — review-round composition (pr-lifecycle
  Phase 4 round membership or a dedicated rule per new-rule-vs-pdr-clause) | trigger: run
  the rules process with the owner; until then the leg is selective, never assumed |
  size: S | status: pending]`
