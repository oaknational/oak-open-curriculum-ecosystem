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

## Slow lane (PDR-130 — constitutional-class concepts, decided at their review date)

Rows here are live deliverables under a named review gate, NOT decision-debt:
each carries a prediction, a falsifier, and a review date, and is decided
(promote / kill-with-reasoning) AT that date. A dedicated consolidation passes
these by unless a review date has arrived. **Bootstrap exception: a row tracking an
ALREADY-ACCEPTED record is decided retain vs retire-by-its-own-falsifier at
review — promote/kill applies only to not-yet-minted concepts.**

| Concept | Prediction (by review) | Falsifier | Review |
| --- | --- | --- | --- |
| A signal is not the fact it stands for (candidate principle; consolidation 2026-09-13, PR #143; n = 1 seat-day — seven instances at one seat on 2026-09-12/13, so an observation by `one-instance-is-an-observation`): before a seat acts on an instrument's verdict, a reviewer's finding, a single instance or a fit to the data at hand, or writes one into a durable record, it states what the signal stands for, why it is present, against what it is compared, and what would show it wrong. Foundations: `.agent/research/cognitive-systems/structured-thinking/` (experimental-design-foundations, statistical-rigour-foundations), cited never restated. The always-loaded forms landed fast-lane with PR #143: the rule, the `verify-dont-trust` instrument clause, the `reason` warrant sentence, the pattern `signal-read-as-fact`. Routed here at PR #143's round one (PDR-130 §§2/4: a directive-tier line importing research frames is constitutional-class) | By review: at least one instance of the class, recorded in the pattern's filings or the review-cost ledger, arises in a signal kind the rule and the clause do not name — evidence the general framing is needed at the directive tier; then promote the line into `principles.md` Two instances logged 2026-10-14 (one seat): a context meter reading carried across an automatic compaction and acted on as current; a judge's default verdict returned on absent input. Both are kinds the fast-lane forms already name (an instrument's reading, a verdict with no evidence); no new kind yet. | Every instance recorded by review is one the named fast-lane forms already cover, or none is recorded — the line is redundant with its fast-lane forms; kill the entry with this reasoning | 2026-12-15 (first consolidation on/after) |
| Clocked obligations starve unclocked jobs (retrospective 2026-09-20, proposal 3): when a standing rule with a deadline (a DUE branch fold) will consume the budget of the owner's stated job, the seat puts that one collision to the owner at its first occurrence, as a question about which gives way, and does not resolve it by obeying whichever obligation is due. Provenance: `.agent/reports/agentic-engineering/why-the-register-stayed-at-twelve-for-three-days-2026-09-20.md` §The causal stack (four folds in sixty-six hours, zero register entries moved; the owner's one sentence removed the collision and the register emptied in forty minutes of directive work). The operational forms landed fast-lane in `consolidate-until-done` step 7 (price the pass, reserve the last step; 2026-09-20) and `user-collaboration.md` (report the job's measure first; 2026-09-19). Routed here because a line ranking an owner's job above standing rules is constitutional-class (PDR-130 §§2/4) | By review: the next dedicated consolidation that meets a DUE fold surfaces the collision in its first context and moves its measure in that context Evidence logged 2026-10-14: the third dedicated consolidation met a DUE fold (the coordination branch at day four); the owner ranked the job above the fold in his seating word, the seats recorded the fold as late by his ranking, and the register moved from thirty-five to zero across both estates. The prediction held in its first instance; the concept's directive line is proposed to the owner with this stage's report. | It surfaces the collision and the measure still does not move; or no such collision occurs by review and the row is killed as untested | 2026-12-20 (first consolidation on/after) |
