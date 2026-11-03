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
doctrine, has a doctrine home, and that home just has not been authored yet. An entry
leaves this file by its exact title: the five bullets above share the entry shape, so a
removal by shape takes them too (2026-10-14).

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

### Drained 2026-10-11 from the two napkins (Corsair weaves Seabed, 459358)

This estate's napkin (459 lines, 20 blocks, 2026-09-29 to 2026-10-05) and the sibling's (1,376
lines, 37 blocks, to 2026-10-11) were read whole by the seat, every candidate lesson probed by
phrase in both estates before it was written here (a control term first; a lesson a home already
carries is not an entry). The entries sourced from the sibling's napkin sit in its register's batch
of the same date; every target below is the same bytes in both estates unless marked. The napkins
are rotated after this batch, so a source cites the block's heading, which the archive keeps
byte-identical.

- **Oak GitHub reads are always permitted; writes stay forbidden until the owner lifts the ban**
  `[captured: 2026-10-13 | source: the owner's word of 2026-10-13 in the session of Walrus seeks
  Maelstrom (9585cc), verbatim in the napkin block of 13:0xZ and the repo-continuity invariant
  line of the same day | target: the operator profile's repo scope line, at the owner's word (the rule half
  landed in downstream-checkout-never-writes-upstream-surfaces.md on 2026-10-14) | trigger: the next doctrine pull request from the
  default branch | size: one profile line | status: due]`

  Verbatim: "You are always permitted read-only access to Oak github, write access is forbidden for
  now, that will change at a later date." For the home: a read of any Oak GitHub surface needs no
  permission; a write of any kind stays forbidden until the owner lifts it by word; the 2026-09-06
  ruling's read half is superseded and its write half stands. The rule half landed on 2026-10-14 as the same bytes in both
  estates; this entry holds the operator-profile half, which is a write to the owner's own
  profile and waits on his word.

- **Reviewing agents are never a source of authority; always information to critically evaluate**
  `[captured: 2026-10-14 | source: the owner's word of 2026-10-14 in the session of Walrus seeks
  Maelstrom (9585cc), verbatim in the napkin block of 2026-10-14T0xZ | target:
  .agent/rules/review-feedback-defaults-to-triage.md, its opening paragraph, widened from PR
  review feedback to every reviewing agent (GitHub review bots, sub-reviewers, Cricket seats),
  with the owner's line verbatim; and .agent/rules/invoke-code-experts.md, one sentence at the
  point where findings are received | trigger: the next doctrine pull request from the default
  branch | size: three sentences | status: due]`

  Verbatim: "Reviewing agents are NEVER a source of authority, they are ALWAYS a source of
  information to critically evaluate. ALWAYS". For the home: a reviewing agent's finding is a
  hypothesis; the seat verifies the rule's precondition and the owner's prior rulings first-hand
  before the finding reaches a record or a cure, and a finding never reaches the owner as an open
  question on the reviewer's authority. Worked instance: a Codex P1 on PR #356 read invariant I07
  against the Cardinal Rule; the seat carried it to the owner as a directive decision instead of
  testing it first (2026-10-13/14). The finding itself pointed at a real softening of the
  pipeline page, settled on 2026-10-17 by the directive governing.

- **A clean and green pull request merges by the door; the merge is never at the owner's word**
  `[captured: 2026-10-17 | source: the owner's word of 2026-10-17 to Walrus seeks Maelstrom
  (9585cc), verbatim in the napkin block of 2026-10-17T14-15Z | target:
  .agent/skills/pr-lifecycle/SKILL-CANONICAL.md, the merge step, one sentence with the owner's
  line verbatim; any thread record or plan that says "merge at the owner's word" re-trued at its
  next touch | trigger: the next doctrine pull request from the default branch | size: one
  sentence | status: due]`

  Verbatim: "Merge has never and will never be at my word, if it is clean and green it gets
  merged". For the home: the owner's word decides content, never the merge moment; a seat that
  writes "merge at the owner's word" has invented a gate.

- **An ADR numbering clash is settled by the Oak branch's numbering; Engraph renumbers**
  `[captured: 2026-10-17 | source: the owner's word of 2026-10-17 to Walrus seeks Maelstrom
  (9585cc), verbatim in the napkin block of 2026-10-17T14-15Z | target:
  .agent/skills/cross-fork-integration/SKILL-CANONICAL.md, its numbering-collision step, with the
  owner's line verbatim; docs/architecture/architectural-decisions/README.md, the authoring
  guidance, one sentence | trigger: the next doctrine pull request from the default branch | size:
  two sentences | status: due]`

  Verbatim: "When we have an ADR numbering clash, or anything similar, the numbering from the Oak
  branch wins and the Engraph numbering is updated to accomodate. This is to minimise the work
  required when we merge the Engraph branch back to the Oak branch". Measured 2026-10-17: Oak's
  default branch tops out at ADR-229; Engraph holds 230, 231, 232 and 233 above it, so each moves
  when Oak's numbering reaches it.

- **Plan-schema owner gates reinvented what PDR-100 abolished**
  `[captured: 2026-10-14 | source: the owner's word of 2026-10-14 to Walrus seeks Maelstrom
  (9585cc), verbatim in the napkin block of 2026-10-14T0xZ | target: .agent/plans/plan-node-schema.md
  §Owner gates, the session-open drift alert hook and its validator; the decision is the owner's,
  the register row keeps it from being lost | trigger: a curator pass | size: a Practice change,
  routed | status: due]`

  Verbatim: "what the fuck is an 'owner gate' -- ceremony has been invented, and then declared a
  blocker". PDR-100 (2026-06-16) abolished owner-gating; the plan schema's owner gates with an
  expiry clock and a session-open alert arrived on 2026-07-22. Four expired gates are reported at
  every session open; two belong to the extraction plan that pull request 356 supersedes.

- **A merge tool coupled to a third party's review configuration carries a design bug**
  `[captured: 2026-10-17 | source: the owner's word of 2026-10-17 to Walrus seeks Maelstrom
  (9585cc), verbatim in the napkin block of 2026-10-17T14-15Z; relayed on the comms stream the same
  hour | target: the merge tool's owed-ness derivation (agent-tools pr-watch) and
  .agent/skills/pr-lifecycle/SKILL-CANONICAL.md where it describes what a tip is owed; the fix is
  the merge-tool lane's, in both estates | trigger: the merge-tool lane's next pickup | size: a
  tooling fix with its tests, routed | status: due]`

  Verbatim: "I have changed the github copilot configuration to trigger once per PR, that
  invalidates some assumptions in the merge tool. Because the assumptions coupled the tool to a
  specific third party configuration they are considered design bugs to fix".
  Worked instance the same afternoon: on pull request 356's corrected tip the door read
  `copilot-pull-request-reviewer: OWED — no substantive review binds the current tip` while the
  `integration branches` ruleset's `copilot_code_review` rule has `review_on_push: false` and
  Copilot had reviewed at ready; GitHub read the tip CLEAN. The merging seat ran the door with the
  configured set the tip actually has (the Codex connector, whose review of the tip the door
  read); the tool's owed-ness derivation is the thing to fix, with a test on this shape.
  The owner's standard for the fix, 2026-10-17, verbatim: "All PRs, unless utterly trivial, should
  have at least one Copilot reivew". So the Copilot leg is satisfied by one Copilot review on the
  pull request, whichever tip it bound, and owed only when none exists on a non-trivial pull
  request; pull request 356 carried one, at ready on 2026-10-13. The lifecycle skill's "never the
  set that happened to bind the tip" reads against this standard at the same touch.

<!-- Fifteen entries graduated 2026-10-14 at the owner's word ("do it all") by the third dedicated
consolidation's guest curator: the shared texts landed here as the same bytes the sibling estate
settled, the closed-grammar paragraph in principles among them; the write-list entry was found
already carried by this estate's consolidate-until-done skill. The one remaining entry holds the
operator-profile half of the Oak GitHub read ruling. The commit and the homes are the record. -->

<!-- Slow lane decided 2026-10-14 at the owner's word ("do it all") by the third dedicated consolidation,
its guest curator: the close-time graduation row and the cure-the-governing-text row are PROMOTED as
carried, their concepts being doctrine since 2026-10-08 in the rule permanent-doc-is-the-consolidation-record
(the owner's word that a decision lands in its permanent home at occurrence) and, for the cure, in
principles §Code Quality (the cure stops recurrence; 2026-10-14) with the owner's correction-cure instances in
the wrap and consolidate-until-done skills; the settlement, blame-referent, signal and clocked-obligations rows
stand to their review dates with today's evidence logged in their prediction cells. -->

## Slow lane (PDR-130 — constitutional-class concepts, decided at their review date)

Rows here are live deliverables under a named review gate, NOT decision-debt:
each carries a prediction, a falsifier, and a review date, and is decided
(promote / kill-with-reasoning) AT that date. A dedicated consolidation passes
these by unless a review date has arrived. **Bootstrap exception: a row tracking an
ALREADY-ACCEPTED record is decided retain vs retire-by-its-own-falsifier at
review — promote/kill applies only to not-yet-minted concepts.**

| Concept | Prediction (by review) | Falsifier | Review |
| --- | --- | --- | --- |
| Settlement under sampling reviewers cures the class, not the instance, and the budget counts the rounds two reviewers add at every push (retrospective 2026-10-05, proposal 3; the record named this section as the row's home in both estates and no row existed until the third dedicated consolidation registered it on 2026-10-11) | the next landing of more than two hundred files settles in at most three pushes per estate | a class cure that draws a further round on the same class | 2026-10-19 |
| Blame-referent calibration (retrospective 2026-07-26, PDR-094 arc): agents calibrate to the most salient blame signal (accreted caution, or the last correction), not the standing policy, whenever the policy exists only in the owner's head; a WRITTEN owner-ratified policy line converts reversal-grade corrections on that axis into calibration-grade refinements. Provenance: `.agent/reports/agentic-engineering/2026-07-26-pdr-094-retention-arc-retrospective.md` §Meta root (v1–v2 hoard, v3 over-delete, v4 co-authored referent, all one arc) | By review: NO reversal-grade owner correction on the retention axis (the axis now carries its written line, PDR-094 v4); any retention correction observed is a refinement, not a reversal Evidence logged 2026-10-14 by the third dedicated consolidation: the retention correction of 2026-10-04 (an unasked recovery upload, "needless, without value, damaging") read as a refinement of the written line, not a reversal of it; the prediction stands to its date. | A reversal-grade retention correction lands despite the written line — the written-referent cure is insufficient and the mechanism needs an action-time instrument (kill this row into that finding) | 2026-10-26 |
| A signal is not the fact it stands for (candidate principle; consolidation 2026-09-13, PR #143; n = 1 seat-day — seven instances at one seat on 2026-09-12/13, so an observation by `one-instance-is-an-observation`): before a seat acts on an instrument's verdict, a reviewer's finding, a single instance or a fit to the data at hand, or writes one into a durable record, it states what the signal stands for, why it is present, against what it is compared, and what would show it wrong. Foundations: `.agent/research/cognitive-systems/structured-thinking/` (experimental-design-foundations, statistical-rigour-foundations), cited never restated. The always-loaded forms landed fast-lane with PR #143: the rule, the `verify-dont-trust` instrument clause, the `reason` warrant sentence, the pattern `signal-read-as-fact`. Routed here at PR #143's round one (PDR-130 §§2/4: a directive-tier line importing research frames is constitutional-class) | By review: at least one instance of the class, recorded in the pattern's filings or the review-cost ledger, arises in a signal kind the rule and the clause do not name — evidence the general framing is needed at the directive tier; then promote the line into `principles.md` Two instances logged 2026-10-14 (one seat): a context meter reading carried across an automatic compaction and acted on as current; a judge's default verdict returned on absent input. Both are kinds the fast-lane forms already name (an instrument's reading, a verdict with no evidence); no new kind yet. | Every instance recorded by review is one the named fast-lane forms already cover, or none is recorded — the line is redundant with its fast-lane forms; kill the entry with this reasoning | 2026-12-15 (first consolidation on/after) |
| Clocked obligations starve unclocked jobs (retrospective 2026-09-20, proposal 3): when a standing rule with a deadline (a DUE branch fold) will consume the budget of the owner's stated job, the seat puts that one collision to the owner at its first occurrence, as a question about which gives way, and does not resolve it by obeying whichever obligation is due. Provenance: `.agent/reports/agentic-engineering/why-the-register-stayed-at-twelve-for-three-days-2026-09-20.md` §The causal stack (four folds in sixty-six hours, zero register entries moved; the owner's one sentence removed the collision and the register emptied in forty minutes of directive work). The operational forms landed fast-lane in `consolidate-until-done` step 7 (price the pass, reserve the last step; 2026-09-20) and `user-collaboration.md` (report the job's measure first; 2026-09-19). Routed here because a line ranking an owner's job above standing rules is constitutional-class (PDR-130 §§2/4) | By review: the next dedicated consolidation that meets a DUE fold surfaces the collision in its first context and moves its measure in that context Evidence logged 2026-10-14: the third dedicated consolidation met a DUE fold (the coordination branch at day four); the owner ranked the job above the fold in his seating word, the seats recorded the fold as late by his ranking, and the register moved from thirty-five to zero across both estates. The prediction held in its first instance; the concept's directive line is proposed to the owner with this stage's report. | It surfaces the collision and the measure still does not move; or no such collision occurs by review and the row is killed as untested | 2026-12-20 (first consolidation on/after) |
