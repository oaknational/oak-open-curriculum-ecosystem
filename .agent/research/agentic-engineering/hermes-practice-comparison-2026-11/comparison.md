# Hermes Agent and the Practice: how each learns, and what decides that a lesson stays

A comparison of the learning loop of Hermes Agent v0.23.0 with the learning loop of the
Practice, written to answer one question from [`brief.md`](brief.md): which single feedback
loop in the Practice should get an effect measure first, or whether none should. Written
12 November 2026 by the seat Swift holds Aether (Claude Code cloud session `01Duocji`, solo)
for the owner. This is the third draft. A challenge pass refuted the first draft's
recommendation; the owner's response to the second named the weakness the comparison should
have been organised around. Section 8 records both.

In brief. On whether to add an effect measure: no. The Practice already keeps six records of
whether its lessons worked, which is six more than Hermes's runtime keeps. Each is written;
four of them have had no decision taken from them since mid-October, because the workflow that reads them,
the dedicated consolidation, last ran on 15 October and has been recorded as due since.

The reason it has not run is the weakness the owner named on reading the second draft: "that
lack of loop automation is the biggest weakness in the Practice as it stands today … almost
all if it requires the user to instigate the refinement and learning process". The record
agrees (section 2.5). Every refinement step in the Practice starts at the owner's word or at an
agent's recall. Nothing in the repository starts one by clock, counter or event, although the
same repository starts its upstream synchronisation by schedule four times a day.

This is where Hermes bears on the Practice most directly. Hermes starts its refinement in
code: a counter starts a review after the reply, and a timer with an idle test starts the
curator. Its record also shows what unattended refinement needed once it ran: destructive
writes staged for approval, archiving in place of deletion, a narrow tool list, a snapshot
before each run. And it shows the cost: what the automation writes is not measured. The
recommendation in section 6 is one bounded trial of the half Hermes has and the Practice lacks,
a scheduled seat that runs the consolidation's deciding step and stages its result as a draft
pull request, with the decisions already owed as its first job.

One further comparison is worth having. The loop the owner asked about, Hermes's offline
scoring of a skill's text, has a held-out comparison and no path to a decision. The Practice's
counterpart, skill evaluation suites, has a path to a decision and, on its one recorded use, a
baseline that could discriminate nothing. Each has the half the other lacks.

**Corrected on 12 November 2026 by the
[review of the collection](../doing-and-dreaming-2026-11/review-of-the-collection.md).** This
document said that 20 of 78 skills carry an evaluation suite and that the suites had one
recorded use, on 27 October. Both were wrong. Sixteen canonical skills carry a suite. The
repository also holds nineteen recorded runs from 27 and 28 September across five skills, each
with a written reading, which this comparison did not find. In the two readings opened for the
review, some cases passed with the skill and failed without it. So "on its one recorded use, a
baseline that could discriminate nothing" describes the October run only, and the contrast
with Hermes drawn from it in sections 5 and 6.3 is weaker than written. The two counts are
corrected in sections 2.2 and 6.3. The argument of sections 2.3, 5 and 6.3 is left as it was
written and is to be read with this note.

## 0. Method

**Frame.** The brief's verdict stands as written: goal, scope and exclusions are in
[`brief.md`](brief.md) under "The verdict". The frame rests on one inference the owner has not
stated, that this research strand serves the ratified node
`outcome-informed-practice-learning`. The challenge pass was asked to test that first. Its
verdict, that the frame was imposed and shaped the first draft's answer, is in section 8.

**Depth.** Parallax Core: one charter (the brief), one seat reading first-hand, no fleet,
measured checks where the Practice's own tooling could answer, one challenge pass by a
reviewer that wrote neither account, and return conditions.

**Sources and their unequal standing.**

| Side | What was read | What was observed running | Pin |
| --- | --- | --- | --- |
| Hermes | The merged study in `../hermes-agent-v0.23.0-2026-11/`: `synthesis.md` whole; `memory-learning-architecture.md` sections 5 (L1 to L8) and L10 | Nothing by this seat: the study ran no Hermes code and neither did this session, and the study's status is `provisional`. The owner states that Hermes code was run in prior sessions (section 8). No record of those runs was found in this repository or on the two forks' remote branches, so nothing here draws on them. | `hermes-agent` `2bd378ed`, `hermes-agent-self-evolution` `0a929e3a` |
| The Practice | The mechanisms named in section 2, each read first-hand at the cited lines | Its own tooling, run in this session: `pnpm practice:fitness:informational`, and read-only `git log` queries | This repository's `engraph` at `495c82f45`, merged into the work branch at `d2e5aa15c` |

A "does" cell for Hermes means "the code at the tag reads this way". A "does" cell for the
Practice means "this command returned this on 12 November 2026".

**Unequal boundary, corrected in this draft.** The first draft set the Practice's whole loop,
people and agents changing the repository, against Hermes's installed runtime alone. The
Hermes study also records Hermes's maintainers changing its code after named failures. This
draft compares like with like where it can and says where it cannot (section 4.1).

**Three frames, held apart.** Section 3 uses the Hermes study's categories for breadth.
Section 4.1 re-reads both systems in the Practice's own terms (capture, distil, graduate,
enforce). Section 4.2 re-reads both in terms that belong to neither, from the
adaptive-capacities research record (`.agent/research/agent-capacities-2026-09-09/report.md`).

**Citation discipline.** Practice citations are repository paths with line numbers at the pin.
Each quoted phrase was checked mechanically at its cited lines; the rows are in
[`quotation-check-rows.tsv`](quotation-check-rows.tsv) and the result is in section 7. Hermes
claims cite the study's sections and verdict ids, where the permalinks are.

**Out of scope, as the brief set it.** Hermes's repository architecture; ranking the two;
adopting Hermes code; advice to Hermes's maintainers; any change to a Practice rule, skill,
plan or register. Section 6 holds proposals only.

## 1. Hermes, on the slice

From the study, in its terms. The mechanism detail is in `memory-learning-architecture.md`
sections 3 and 5.

- **What is kept.** Two bounded memory files, a tree of skills, and a session database, with
  sidecar records for pending writes, skill usage, a mutation ledger and the curator's state
  (L1).
- **What writes it.** The acting model's own tool calls during a turn, and a second agent that
  reviews the conversation after the reply when a counter reaches its interval (L2 and L3;
  V-3). The review prompt instructs it to be active: "most sessions produce at least one skill
  update" (`synthesis.md` section 5.1).
- **What decides that an item is kept, changed or retired.** For memory entries, the model's
  judgement inside a turn or a person's edit; "No time, usage or score input exists in code"
  (L6). For skills marked agent-created, elapsed time since the latest recorded activity,
  against thresholds of 14 and 30 days, moves a skill from active to stale to archived (L6;
  V-7). Other skills have no automatic retention decision. The curator never deletes.
- **Whether anything records an item's effect.** Use is recorded: per-skill counts,
  timestamps, and whether a skill was used again after its latest patch (L7). Effect is not:
  the study found no record of which memory entry was used in a turn, no comparison of an
  outcome with and without an item, and no score on any item, by a sweep with a known positive
  (L7).
- **The scored loop.** A separate repository scores one skill's text on a held-out set with a
  word-overlap measure. One run is documented, from March 2026, with a different optimiser
  from the one named. The script runs when a person starts it, and no code carries its result
  to the runtime (L8; V-9, V-12; `synthesis.md` section 2.3).
- **What the maintainers changed after a named failure.** The study's L10 table records
  several: an action removed because it "wiped the other facts in multi-fact entries"; a
  default switched off after "57 gone in one startup tick"; unattended deletes staged for
  approval; a review whitelist widened after "a per-review denial storm". These are changes to
  the product between releases, a scale the study noted and did not study (`synthesis.md`
  section 5.2).

The study's own summary: "One runs automatically in every installation and measures nothing.
The other defines a measure and runs only when a person starts a script, with no code path
back to the runtime" (`synthesis.md` section 2.3).

## 2. The Practice, on the slice

What the Practice says, from its own documents; then what it does, from its tooling and
history; with a falsifier on each row.

### 2.1 What the Practice says it is

The Practice names its learning path as four stages, "capture → distil → **graduate →
enforce**" (`.agent/skills/knowledge/consolidate-docs/SKILL-CANONICAL.md:676`), and one
workflow, consolidation, as the place where they meet: "Without consolidation, the loop stalls
at refinement"
(`docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md:65`).

- **Capture.** Every session writes mistakes, corrections and surprises to one file, the
  napkin; "`start-right` loads it whole into every session"
  (`.agent/skills/knowledge/napkin/SKILL-CANONICAL.md:158`). Capture is never withheld for
  size: "Capture is sacred; fitness is a signal that consolidation or graduation is overdue"
  (same file, lines 78 to 79).
- **Distil and graduate.** "When the napkin exceeds ~500 lines" it is rotated (same file, line
  232). A settled lesson is written into a permanent home: a rule, a decision record, a pattern
  file, a directive or a skill. The staging file says "**Promote on the first instance.** We do
  not hold a lesson here waiting for a second sighting; we promote it and trust the Practice to
  invalidate a wrong promotion through experience"
  (`.agent/memory/active/distilled.md:25-27`).
- **Who decides.** The agent running the consolidation; "This is **not an owner gate.**"
  (`.agent/practice-core/decision-records/PDR-101-graduation-requires-quorum.md:56`). A
  graduation that mints always-loaded doctrine is to pass a review quorum first, and "The
  deciding vote stays with the primary" (same file, lines 48 to 49).
- **Enforce.** Some lessons become code: a lint rule, a hook, a gate, a validator. The rest are
  text an agent must recall. The Practice's own record of the difference is PDR-098: "Authoring
  a rule installs *text*, not a *tripwire*"
  (`.agent/practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md:30-31`).
- **Predictions.** Since 20 July 2026, "every graduation at either speed carries a prediction"
  (`.agent/practice-core/decision-records/PDR-130-two-speed-learning.md:53-54`). On the fast
  lane this is one sentence stating the expected effect and its falsifier, with no date.
  Changes to how the estate learns go to a slow-lane register, each row with a review date,
  "the gate at which it MUST be decided" (same file, lines 69 to 70). The record expects that
  "after a few quarters the estate can answer 'which of our own changes worked?' from records
  rather than recall" (lines 96 to 98).
- **What it claims about effect.** Little, and it says so. The ratified node: "This node does
  not claim that the learning loop is already observable"
  (`.agent/plans/strategic/outcome-informed-practice-learning.plan.md:132`).

### 2.2 The records the Practice keeps of whether a lesson worked

The first draft found three. The challenge pass found three more, and each was then read
first-hand. This table is the centre of the document.

| Record | What writes it | Last written | What has been decided from it |
| --- | --- | --- | --- |
| **Slow-lane predictions**: a concept, a prediction, a falsifier and a review date per row (`.agent/memory/operational/pending-graduations.md:258-272`) | A consolidation, or a retrospective routed through one | Evidence logged on 2026-10-14 | Decisions on 2026-10-01 and 2026-10-14 (PDR-130, lines 115 to 122; register lines 232 to 238). Four rows live. Two carry bare dates of 2026-10-19 and 2026-10-26, now past; the other two say "first consolidation on/after" |
| **Fast-lane prediction sentences**, in the graduated file | The agent that graduates a lesson | Three rule files and two skill files carry the string "Prediction (PDR-130)", with two pattern files and the decision record itself (recounted 2026-11-12; this row first said four skill files) | Nothing. PDR-130's own falsifier for this fell due on 2026-10-20 and "nobody has counted" (lines 123 to 124). Counted here: section 2.4 |
| **The recurrence ledger**: lessons that recurred after they had a home, routed at each dedicated consolidation by a skill step (`consolidate-docs`, lines 271 to 282) into a design-space plan | A dedicated consolidation | Four blocks, dated 2026-07-06, 07-30, 09-02 and 09-16 | The plan's six todos are all `pending`; its last commit is dated 2026-09-25. One instrument was built outside the plan on the same evidence (section 2.3) |
| **Archive synthesis**: recurrence counted across napkin archives by a staged engine | An owner-launched consolidation | 2026-09-02; eight napkin archives are dated after it | PDR-098 gained an evidence section; one pattern file graduated |
| **The review-cost ledger**: one row per pull request with the cost gate's verdict beside a seat's judgement of where the review loop should have stopped (`.agent/memory/operational/review-cost-ledger.md:19-21`) | Each session's wrap | 2026-11-10 | The gate's weights "change only against this ledger". Its weight-changes table holds one row, the initial policy of 2026-09-12 |
| **Skill evaluation suites**: behavioural cases run with and without the skill's text (`agent-tools/src/skill-evals/`) | Whoever runs the suite; 16 of 78 canonical skills carry one | Nineteen runs kept beside five skills, 2026-09-27 and 09-28; one more recorded in the napkin, 2026-10-27 | One pull request closed on the October run (section 2.3). What the September runs decided was not read |

Hermes's runtime has no row to set beside any of these. Its offline repository has one, and
section 5 sets it beside the last.

### 2.3 What those records have found

- **Recurrence after a home.** The synthesis of 2026-09-02: "Sixteen of nineteen prior-kept
  mechanisms recurred within four weeks of the run that kept them"
  (`.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-09-02.md:114-115`).
  The figure is narrower than it sounds, in three ways the first draft did not state. The
  nineteen are the prior run's keeps that reappeared as candidates in the new window, out of
  35 keeps in all (lines 73 to 79), so the denominator is selected on recurrence; the plain
  reading is that at least 16 of 35 showed a later instance. "Recurred" means one instance or
  more, with no baseline rate and no count of opportunities. And it shows a lesson did not
  extinguish its class; it cannot show whether the lesson reduced it. The synthesis states the
  last limit itself: "A cured class leaves no entry when it stops firing, so no pass over
  napkins can show a cure worked" (lines 280 to 282).
- **What moved a rate.** A retrospective quotes the earlier synthesis, "Prose cures do not move
  recurrence; only interface changes do"
  (`.agent/reports/agentic-engineering/why-written-lessons-kept-needing-the-owner-2026-09-16.md:52-53`),
  and adds one case it marks observational: a review-tally clause in doctrine from 2026-08-31
  went unbuilt on at least seven pull requests; the tally builder and cost gate landed on
  2026-09-12 and the next loop settled in two rounds (lines 299 to 317). It also marks the case
  "weaker after 2026-09-12", since the estate was one seat by then. The earlier synthesis was
  not read in this session.
- **A scored comparison that decided something.** On 2026-10-27 a draft skill's suite was run
  with and without the skill: "0 of 8 behavioural cases passed, with the skill and without it,
  delta 0. The suite settled the land-or-close question the prose read could not"
  (`.agent/memory/active/napkin.md:1029-1030`). The same day brought a correction: with the
  no-skill arm failing every case "the suite cannot distinguish a weak skill from over-strict
  fixtures or judge", and "a null result needs a baseline that passes something" (lines 1038
  to 1044). The pull request stayed closed on narrower ground.

So the Practice is not a system that measures nothing. Nor, as the first draft had it, is it
one whose measures go unread because nobody remembers them.

### 2.4 Says and does

| Id | The Practice says | The Practice does (observed 2026-11-12 unless dated) | Would be shown wrong by |
| --- | --- | --- | --- |
| P-1 | The napkin rotates at about 500 lines (napkin skill, line 232) | 1,795 lines on the work branch; the newest rotation marker is dated 2026-09-29; the fitness tool reads it `critical`. Its content to 2026-10-05 was read whole and drained on 2026-10-11 (`pending-graduations.md:121-129`), so unrotated is not unprocessed | A later rotation marker or archive file |
| P-2 | The pending-graduations register targets zero items and a dwell of two days, hard at seven (`pending-graduations.md:7-12`) | "Live decision-debt: 6", all `due`; "Oldest undecided: 30d"; one entry the parser cannot classify | A re-run of the fitness tool at the pin giving other figures |
| P-3 | These signals are seen | They are. A seat recorded on 2026-10-19: "**The consolidation gate**: due — a lane closed with 356, the napkin is at critical and its rotation is unblocked, the register holds six due entries. Not bounded for this close; a curator seat's, after the partial plans by the owner's ordering" (`napkin.md:852-854`). No commit since 2026-10-15 names a consolidation or a rotation | A dedicated consolidation after 2026-10-15 under another commit wording |
| P-4 | A slow-lane row is decided at its review date (PDR-130, lines 69 to 74); "a dedicated consolidation passes it by unless its date has arrived" (lines 85 to 86) | The two rows with bare dates are unchanged since 2026-10-14. On the fairer reading, the one two sibling rows spell out, they await the first consolidation after their date, and none has run. The first row's prediction waits on a landing of more than two hundred files; none occurred before its date, and one has since (pull request 375, `review-cost-ledger.md:229`) | A decision for either row recorded anywhere; a search for each concept's name found the register and its source reports only |
| P-5 | The tooling reports when the pipeline falls behind | For fast-lane items it does. Slow-lane review dates have no reader: a search for `slow lane`, `slow-lane` and `review date` over `agent-tools/src/practice-fitness` returned nothing, and the consolidation skill has no step that reads the slow lane. A reader of a different expiry date does exist and is instructive: section 6.5 | A reader of slow-lane dates under another name |
| P-6 | Every graduation carries a prediction and a falsifier (PDR-130, lines 56 to 62) | Of 30 rule files added since 2026-07-20 and still present, a term search finds a prediction or falsifier word in 6, and two of those use it for another purpose. Ten of the other 24 were read by hand by the reviewer: none carries the sentence, though several state the failure they prevent. The remaining 14 were scanned for wider wording and none was found. Not every added rule is a graduation: two of the ten came from the sibling estate by exchange, and most open on an owner ruling | A hand read of the 14 finding the sentence; a count over skills, which was not made |
| P-7 | A wrong promotion is invalidated "through experience" (`distilled.md:26-27`) | Experience does write against promoted lessons, as a class: the recurrence ledger. Nothing was found that writes against one named promoted item, and no retirement was found whose stated reason is that the lesson was tried and failed. By commit subject since 2026-07-20: 15 rule files deleted (4 moved into directives, 10 folded into one text, 1 retired on a changed fact), 1 pattern file, no decision record; against 32, 39 and 15 added | A retirement citing a failed lesson |
| P-8 | Whether a cure worked needs "a designed surface-signature census per window, never an absence read" (`consolidate-docs`, lines 620 to 621) | No census has been run. The design-space plan already names the instrument, a census of each class's literal signature "run over the archive" (`.agent/plans-backlog-2026-07/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md:871-874`), which needs no new collection | A census result anywhere in the repository |
| P-9 | The cost gate's weights are "an experiment, not a constant" (`review-cost-ledger.md`, lines 15 to 16) | Two months of rows; one weights row, the initial one | A later row in the weight-changes table |

### 2.5 What starts each step

Added in the third draft, after the owner's word. "Starts" means the first cause of the step
running at all, not what the step reads once it runs.

| Step | What the Practice's records say starts it | Started by code? |
| --- | --- | --- |
| Capture to the napkin | The agent's recall of an always-on instruction (napkin skill, line 18) | No |
| Session wrap | The owner's word, or an agent recognising a session's end. The repository configures hooks for four events: session start, before a tool call, prompt submission and before compaction. None is a session-end event | No |
| Retrospective | "The owner commissions a retrospective on a completed arc" (`.agent/skills/cognition/retrospective/SKILL-CANONICAL.md:37`) | No |
| Dedicated consolidation | A checklist of conditions an agent or the owner must notice (`consolidate-docs`, lines 63 to 79). Those of 2026-09-02, 09-16 and 10-14 are each recorded as at the owner's word; the seat that saw it due on 2026-10-19 left it to "a curator seat", which exists only when someone launches one | No |
| Archive synthesis | "the owner requests historical synthesis" (same checklist) | No |
| Slow-lane review | The first consolidation on or after the row's date | No |
| Skill evaluation | Whoever runs the suite | No |
| Fitness readout | An agent runs the command, or runs `pnpm make`, which includes it | No. It reports when run, and nothing acts on the report |
| Plan-gate expiry alert | A session-start hook | Yes. It tells the opening seat; it does no work |
| Upstream mirror and carrier | Scheduled workflows, four slots a day on weekdays (`.github/workflows/upstream-carrier.yml`) | Yes. This is delivery plumbing, not learning |

Hermes, from the study's L2 and L3 table:

| Step | What starts it | Default |
| --- | --- | --- |
| Review of the conversation for memory | A user-turn counter reaching its interval | 10 turns |
| Review of the conversation for skills | A tool-iteration counter reaching its interval | 10 iterations |
| Curator transitions (active, stale, archived) | An interval and an idle test, checked at session start, gateway housekeeping or a maintenance timer | 168 hours; 2 hours idle |
| Curator consolidation by a model | The same, when switched on | Off |
| Offline scoring | A person runs a script | — |

The two tables are mirror images. Hermes automates the start of refinement and leaves
measurement to a person. The Practice has people start refinement and, once it runs, measures
more than Hermes does. The one automatic start the Practice has on its learning side is an
alert to a seat that is busy with something else. It reports expired owner gates on plans, and
the owner's word on those gates, when a seat carried them as blockers, was "ceremony has been
invented, and then declared a blocker" (`pending-graduations.md:198-199`). That the alert
itself fails is this seat's reading and not the owner's verdict. An alert asks for work.
Hermes's counters start a separate agent whose only job is the work.

Three delivery nodes the owner ratified on 2026-09-08 already hold a position on this ground,
and the first three drafts of this document did not find them. `consolidation-signal` computes
when a consolidation is due and is "a noticer, never a nag". `consolidation-induction` makes a
consolidation "a single agent-inducible action". Both put automatic starting out of scope, the
second in these words: "a signal never starts a session by itself — owner/Director word does"
(`.agent/plans/delivery/consolidation-induction.plan.md:60-61`). So the estate has planned the
signal and the worker, and deliberately left the start with a person. The owner's word of
2026-11-12 keeps that position in general and permits an exception inside the experiment;
section 8 records it.

## 3. Breadth: the learning loop side by side

"Code" means the mechanism runs without a model's or a person's decision to start it.

| Question | Hermes v0.23.0 (read, not observed) | The Practice (read and observed) |
| --- | --- | --- |
| What is stored | Memory entries in two character-bounded files; skills; sessions | A capture file and its archives; a staging file; pattern files; rules, skills and directives; decision records; registers |
| Who uses it | One installation's agent, for one person | Every agent seat that opens the repository, on several platforms, and a sibling estate by exchange |
| What writes it | The acting model, and a second agent after the reply | The acting agent during work; an agent running consolidation |
| What starts a write | Code: a user-turn counter and a tool-iteration counter, default 10 | The agent's recall of an always-on instruction; for consolidation, a size signal, a session close, or the owner's word |
| How it re-enters | Memory and the skill index placed in the prompt at session start; a skill body when loaded | The napkin, read at session start by instruction; rule files as one-line pointers in the prompt, the body read if the agent follows the pointer (observed on one platform); skills when triggered |
| What controls a write | Code guards on the writer: approval gates (default off), a content scan, a review whitelist, pin and lock | Review after the fact: the quorum for doctrine, pull-request review, validators and lint in CI |
| What retains or retires | Code: time since last recorded use, for agent-created skills only; the model's judgement for memory | An agent's judgement at consolidation. Retirement by relocation, folding or a changed fact (P-7). No ageing, no use input |
| What records use | Code: per-skill counts and timestamps on every view, load and patch | Nothing for rules. A skill loads through a tool call that a hook could see; none counts it |
| What records effect | Nothing in the runtime. Offline: a word-overlap score on a held-out set, started by hand | The six records of section 2.2 |
| What reads the effect record | No code path back (V-9) | The dedicated consolidation, for four of the six; a session's wrap and the owner, for the cost ledger; whoever runs a suite |
| How a wrong item is reversed | Archive restore, snapshot rollback, ledger rollback | Git history; a superseding decision record; a later consolidation's review |

**Failure modes each names in its own words.** The left column is from
`memory-learning-architecture.md` L10.

| Hermes names | The Practice names |
| --- | --- |
| "the hoarding library: one references/ file per session, incident narration instead of rules" | "the napkin has become a journal": of 708 mapped items, 186 were state and 367 were already homed (`why-written-lessons-kept-needing-the-owner-2026-09-16.md:81-83`) |
| Captured failures "become persistent self-imposed constraints that bite you later when the environment changes" | "agents calibrate to the most salient blame signal (accreted caution, or the last correction), not the standing policy" (`pending-graduations.md:270`) |
| "A large library can therefore look fully curated while most of it is untouchable." | "a rule-dense corpus always offers a licensing rule for more activity" (`why-written-lessons-kept-needing-the-owner-2026-09-16.md:259-260`) |

Hermes names failure modes that the Practice records read here do not: a poisoned entry that
persists because memory enters the prompt, and two writers compounding each other's entries.
The Practice names one that the Hermes documents read by the study do not: a lesson that has a
home and is still not applied at the moment of the act (PDR-098).

## 4. The same two systems under two other frames

### 4.1 In the Practice's terms

| Stage | The Practice | Hermes, read through this stage |
| --- | --- | --- |
| Capture | The napkin, written during work | No separate stage. The transcript is the raw record and stays in the session database |
| Distil | Rotation: extract, merge, prune | The review agent reads one conversation and writes skills and memory directly. Distilling and promoting are one step |
| Graduate | A settled lesson moves to a home with a different authority and audience | No tiers of authority inside an installation. The curator's states record age, not standing |
| Enforce | People and agents turn some lessons into executed checks in the repository the loop describes | Inside an installation, no learned item becomes a check on later behaviour; every learned item is text for a model. Outside it, the maintainers turn named failures into code between releases (section 1) |

Both systems have an enforce stage. The difference is where it sits. The Practice's is inside
the loop being described: the same agents that capture a lesson can land the lint rule. In
Hermes it is outside the installation: an installation's own learning can only write text, and
code changes arrive from the maintainers by release. The first draft read this as "Hermes has
no enforce stage", which compared the Practice's whole loop with part of Hermes's.

The Practice's own measurements credit this stage. The classes its retrospective lists as
stopped were stopped by a lint rule, a gate, a typed refusal or a template step
(`why-written-lessons-kept-needing-the-owner-2026-09-16.md:145-157`).

### 4.2 In neither system's terms

The adaptive-capacities record separates a persistent trace, a changed response, a retained
change in capability and an improved outcome, and warns that none implies the next
(`report.md:9`). It offers a chain from experience to "later evaluation of the learning
process" (lines 568 to 577) and four latencies for a correction (line 560).

| Link | Hermes | The Practice |
| --- | --- | --- |
| Persistent trace | Established in code | Established in the repository |
| Trace reaches the acting context | In code for memory and the index; a skill body only if loaded | A pointer reaches the context by construction; a rule's body only if the agent reads it |
| Changed response at the act | Not reachable by static reading (`synthesis.md` section 5.1) | Measured weakly: lessons with homes recurred. Whether each was in context when it recurred is not recorded |
| Improved outcome | No measure in the runtime | One observational case |
| Later evaluation of the learning process | The offline loop, unwired | Six records; decided from when a consolidation runs |

Under this frame the two stand closer than under the others. Both establish the first link
and neither establishes the fourth. The Practice has evidence on the third and it is
unfavourable to text.

That research record also bears on section 6. It classes PDR-130's review rule as "governance
choices, not calibrated statistical tests", asks for an explicit inconclusive state (line
525), and designs an experiment for retiring a rule (lines 1029 to 1040). The first slow-lane
row shows why the inconclusive state matters: it reached its date untested.

## 5. Where they converge, where they diverge, and why

**Converge.**

1. **Both learn by an agent writing text for a later agent to read**, and both are told to
   write readily: Hermes's reviewer to be active, the Practice to promote on the first
   instance.
2. **Both refuse to lose what was written.** Hermes's curator archives and does not delete.
   The Practice holds that "Information loss is unacceptable"
   (`.agent/skills/distillation/SKILL-CANONICAL.md:109`). The Practice's rules, skills and
   directives grew 29.9 % by bytes in 42 days
   (`why-written-lessons-kept-needing-the-owner-2026-09-16.md:74`). Nothing was measured for
   Hermes.
3. **Both name the cost of accumulation** in nearly the same words (section 3).
4. **In both, a record of effect exists somewhere and is not what drives retention.** In
   Hermes the score lives in a repository the runtime never reads. In the Practice the records
   live beside the lessons and are read by one workflow that competes for priority with
   delivery work.

**Diverge, with the support for each reason.** A reason marked "reading" is this seat's
inference, not a finding.

| Difference | Reason | Support |
| --- | --- | --- |
| Hermes starts learning writes from counters in code; the Practice from recall and ceremony | Hermes is a program hosting a model and owns its turn loop. The Practice is text hosted by several vendors' programs and owns only instructions and hooks | Reading |
| Hermes records use; the Practice does not | A Hermes skill loads through one function that counts. A Practice rule body is read, or not, by an agent's own file read. Practice skills do load through one tool call and are countable; nobody counts them | Section 3 |
| Hermes retires by time since use; the Practice by judgement | The Practice has no use record to age by. A rule against a rare, severe error is rightly idle most of the time, and Hermes's own record shows what use-based pruning can do: "57 gone in one startup tick" | L10; reading |
| The Practice writes predictions; Hermes does not | The Practice adopted a record whose stated consequence is being able to say which of its changes worked (PDR-130, lines 96 to 98) | Cited |
| The scored loop reaches a decision in the Practice and not in Hermes | The Practice's suite runs inside the repository whose pull request it judges. Hermes's script writes files to an output directory and ends by printing a diff command (L8) | Cited |
| The scored loop has a held-out comparison in Hermes and, on its one recorded use, no discriminating baseline in the Practice | Hermes scores a baseline and a candidate on the same holdout split (L8). The Practice's run compared with and without and both arms failed every case | Cited |

The last two rows are the comparison's one finding that the Practice's records did not already
hold. They answer the owner's question about Hermes's measured loop from the other side: the
part Hermes has, a comparison that can tell two texts apart, is the part the Practice's one
recorded run lacked; the part the Practice has, a decision that follows from the score, is the
part Hermes lacks. Neither run is evidence that either loop works: Hermes's measure is word
overlap on two held-out examples, and the Practice's is one suite on one draft.

## 6. What the Practice could take

The live decision, from the brief: which single feedback loop gets an effect measure first, or
whether none should. The owner's word on the second draft adds the question beneath it: what
starts the loop at all.

### 6.1 The answer: no new measure; change what starts the loop

Six records of effect exist (section 2.2). Every one is being written. Four are read only by
the dedicated consolidation, which last ran on 2026-10-15; of the other two, the skill suites
decided one pull request on 2026-10-27 and the cost ledger has changed no weight. A new measure would be a seventh record waiting on the same
workflow, and that workflow waits on a person (section 2.5). The node this work serves names
the risk: that "maintaining the learning substrate" becomes "the dominant work". For the
owner it already is work that only the owner can start.

Each candidate below is in the node's shape. None changes a rule, skill, plan or register;
each is for a plan to take up.

### 6.2 Recommended: one scheduled seat that runs the consolidation's deciding step

- **The loop.** Capture, then decide: the step from "a record exists" to "something was
  decided from it". It is the step with no starter.
- **The change.** A trial, bounded in time and cost: a scheduled trigger opens a fresh
  unattended session whose only job is the deciding step of the dedicated consolidation, and
  whose output is a draft pull request. The pattern is Hermes's, in three parts.
  1. **The start is in code.** A schedule, as the upstream carrier already has, or a signal
     the fitness tool already computes (a buffer at `hard` or `critical`, or an item past its
     dwell). Hermes uses both kinds: a counter and a timer with an idle test.
  2. **The work is done by a separate agent with nothing else to do.** This is the difference
     from the session-start alert, which asks a seat that opened for other work.
  3. **The result is staged.** A draft pull request is the Practice's staging area, as the
     pending directory is Hermes's. The Hermes study's controls for unattended runs carry over
     as constraints on the trial: nothing deleted, only archived; edits and removals of
     existing doctrine proposed and not applied; a short allowed tool list; one bounded run
     (L5).
- **Its first job is the three decisions already owed.** Decide the two slow-lane rows whose
  dates have passed (pull request 375 is now the first row's test case). Finish the fast-lane
  count so PDR-130's falsifier can be decided; the first reading is in P-6, and if it holds
  the record says what follows: "the obligation has no traction and needs a mechanical check
  or retirement" (PDR-130, lines 112 to 113). Read the cost ledger's rows against the gate's
  weights once.
- **The live decision it enables.** Whether refinement in the Practice can be started without
  the owner, and at what cost per run.
- **The evidence that warrants it.** The owner's word (section 8). Section 2.5: no refinement
  step starts in code. P-3: the due state was seen by a seat that could not take it up. The
  session-start alert: an automatic reminder without an automatic worker drew a correction.
  And one first-hand observation from this session: a harness hook that fired at the end of a
  turn with "There are uncommitted changes" was followed, in the same turn, by the commit and
  push it asked for. A check that fires at the boundary, on a state it can detect, to an agent
  with nothing else queued, was acted on.
- **Falsifier or stop.** Three scheduled runs. Stop if any of these holds: a run opens no pull
  request; the owner's response to a run's output is a correction of the ceremony kind; a run
  exceeds its declared cost; or the three owed decisions are still not recorded after the
  third run. The clock is the schedule, so the falsifier matures whether or not anyone
  remembers it.
- **The effect it expects to change.** For the owner: refinement stops needing the owner to
  start it, and what the owner receives is a pull request to accept, correct or close. For a
  later agent: buffers that drain between sessions.
- **What Hermes's record warns of.** Automatic refinement writes, and Hermes does not measure
  what it writes. Its own documents name the results: a library that hoards, constraints that
  harden, and "57 gone in one startup tick" when an automatic rule met a case its authors had
  not pictured. The trial's seat therefore decides and drains; it does not mint new doctrine
  unattended, and its pull request is where the Practice's existing review applies.
- **What the Practice's own rules already constrain.** An unattended seat cannot ask the
  owner anything (`.agent/rules/unattended-seats-never-prompt.md`), and the consolidation skill
  reserves some outcomes for the owner in person, such as keeping an open question open. The
  trial's seat leaves those items untouched and lists them in the pull request.
- **Not decided here.** Which platform carries the trigger, the schedule, and the cost bound.
  A cloud session can create a scheduled trigger that opens a fresh session; a scheduled
  workflow is the other route. Those are the plan's to settle.

### 6.3 Make skill evaluation the first loop with a discriminating measure

- **The loop.** Author a skill, score it, decide to land or close. This is the Practice's
  counterpart to the Hermes loop the owner asked about.
- **The change.** Before a suite's result may decide a pull request, the no-skill arm must
  pass at least one case; a suite that fails everything on both arms is reported as unable to
  discriminate. The lesson is already in the napkin (section 2.3); this gives it a home in the
  instrument.
- **The live decision it enables.** Land or close an eval-carrying skill on its suite, with
  the suite's power stated.
- **The evidence that warrants it.** One run, one correction. That is one instance, and by the
  Practice's own rule an observation, not a pattern. Hermes's design supplies the contrast: its
  script scores a baseline on the same holdout before it scores the candidate.
- **Falsifier or stop.** Over the next three eval-carrying skill changes, the suite's verdict
  changes no land-or-close decision that the prose read had reached, or the baseline again
  passes nothing.
- **The effect it expects to change.** A later agent reviewing a skill spends "dollars, not
  seat-hours" (`napkin.md:1032-1033`) and knows what the number can show.
- **What it does not cover.** 62 of 78 canonical skills carry no suite, and rules carry none.

### 6.4 Give the recurrence ledger a disposition for each class

- **The loop.** Graduate, recur, decide. The ledger is written at every dedicated
  consolidation and read by a plan with nothing started.
- **The change.** For each class in the ledger, one of: mechanise, accept as a standing cost,
  or retire the text. A signal is available with no new collection: the number of times a
  rule's cure text has been hardened, from `git log`. PDR-098 describes one class whose cure
  "gained a fourth generation — hardened after each recurrence, never before one" (lines 172
  to 174).
- **The live decision it enables.** Which recurring classes get an instrument and which stop
  being re-written.
- **The evidence that warrants it.** Four ledger blocks and no disposition; the node lists
  "Doctrine disposition reviews" among the work that serves it.
- **Falsifier or stop.** Dispositions are recorded and the next ledger block shows the
  accepted and retired classes re-hardened anyway.
- **The effect it expects to change.** The corpus stops growing by re-hardening.

### 6.5 Two candidates from the first draft, withdrawn

- **A readout line for slow-lane review dates.** The first draft recommended this. It is a
  small tooling gap (P-5) and belongs in the frictions register. As a first learning-loop
  intervention it fails on the estate's own evidence. The napkin and the register already read
  `critical`, a seat saw both on the first row's review date and deferred (P-3), and the
  falsifier the draft gave it, "seen and not acted on", describes the present state. The
  estate has also run the stronger version of the experiment: a hook has reported expired plan
  gates at every session open since July, four were reported expired on 2026-10-14, and the owner's word on the
  gates themselves is "ceremony has been invented, and then declared a blocker"
  (`pending-graduations.md:198-199`).
- **A count of hook matches per class.** The design-space plan already names a cheaper form: a
  census of each class's signature over the existing archive (P-8). It needs no new log and no
  information-governance work, and it falls inside 6.4.

### 6.6 Why 6.2 first, and what Hermes contributed

It addresses the weakness the owner named, and the other candidates depend on it. 6.3 and 6.4
each improve a record; a better record with no starter is read as often as the present ones.
It also tests the least-known thing first: whether an unattended seat can run the deciding
step to a standard the owner accepts. If it can, 6.4 becomes that seat's later work. If it
cannot, the trial says so in three runs and the Practice has learned that its refinement needs
a person, which is worth knowing before more is built on the assumption that it does not.

What Hermes contributed, restated after the owner's word. The second draft said Hermes
supplied no evidence for its recommendation, and for that recommendation it was true. Under
the weakness the owner named, Hermes is the nearest worked example available: a system that
starts refinement in code, with a record of the controls that needed and of what went wrong.
It is a design to learn from and not evidence that the design works; the study observed
nothing running, and Hermes itself measures none of it.

## 7. Limits

- **Unequal evidence.** Stated in section 0. No sentence here about Hermes's behaviour in use
  is supported, and none is intended. The owner states that Hermes code was run in prior
  sessions; this seat found no record of those runs and used none. The owner has since
  decided that no re-analysis against them is planned (section 8). The findings here do not
  need them: each is worded as a reading of code and documents or as an observation of this
  repository, and none depends on how Hermes behaves in use.
- **The trial in 6.2 is a design, not a tested mechanism.** Its only first-hand support is
  one hook firing in one session. The platform route was not tried: no trigger was created.
- **One day's observation.** The "does" columns are this repository on 12 November 2026.
- **The fast-lane count.** Ten files read by hand, by the reviewer and not by this seat;
  fourteen scanned by term. Skills and patterns were not hand-read. "Rule files added" is not
  the same population as "graduations".
- **Commit subjects, not diffs**, for P-7's classification of deletions and for P-3's "no
  consolidation since".
- **Claims of absence.** P-5, P-7 and P-8 each rest on a search with a stated scope. The first
  draft made two such claims that were wrong (section 8); these three were re-checked by the
  reviewer and stand.
- **Not read.** PDR-011, PDR-014 beyond its headings, the 2026-08-07 synthesis, the
  practice-system review, two September retrospectives and the vendor-memory audit, all listed
  in the brief. The trial-window telemetry the node names as serving work. The sibling estate.
  The Cursor and Codex rule adapters.
- **Not decided here.** Whether the first slow-lane row's prediction held on pull request 375.
  That is a consolidation's decision, and this document only records that the test case exists.
- **Quotation check.** The row file holds every quoted Practice phrase and seven from the
  Hermes study, with its line range. Result at this revision: section 8.
- **Lineage.** The brief, the Hermes study and this document share one author lineage. The
  challenge pass was made by the same model family and is recorded as a challenge, not as
  independent assurance.

## 8. Challenge pass and session record

**The pass.** One read-only reviewer that wrote neither account was given the document, the
brief, the study and the node, and five questions, the frame first. It was not given this
seat's reasoning. It ran the fitness tool and its own searches, and read ten rule files by
hand. This seat re-read each cited line it relied on before changing the document.

**What it refuted in the first draft.**

| First draft | What the reviewer found | Disposition |
| --- | --- | --- |
| Recommended a readout line for slow-lane review dates, on the diagnosis that the dates go unread | A napkin entry of 2026-10-19 records the due state as seen and deferred by priority; a session-open reader of plan-gate dates already exists and drew the owner's correction about ceremony | Recommendation withdrawn (6.5) and replaced (6.2) |
| "No record was found that later experience writes to against a promoted item" | The consolidation skill has a recurrence-check step and the design-space plan holds four dated ledger blocks | Row rewritten (P-7); the ledger added to section 2.2 |
| The effect records were three | Skill evaluation suites with a with-and-without comparison exist, and one decided a pull request | Added to sections 2.2, 2.3 and 5; candidate 6.3 |
| "has measured the effect of its learning, twice" | The 16-of-19 denominator is selected on recurrence; the measure shows non-extinction only; the second measurement was quoted second-hand | Section 2.3 rewritten |
| "Hermes has no enforce stage" | The study's L10 records maintainers turning failures into code; the draft compared the Practice's whole loop with Hermes's runtime | Section 4.1 rewritten |
| "Hermes's scored loop does not operate because nothing starts it" | The study records one run; the loop bears on nothing because no code carries its result back | Sentence removed |
| Rule files "at session start" reach the context by construction | On this platform the adapters are one-line pointers | Sections 3 and 4.2 corrected |
| An owner question attributed to PDR-130 | The phrase is in the record's Consequences, not the owner's quoted question | Corrected |

**What it confirmed.** P-1, P-2, the deletion counts, the synthesis dates and cost, the plan's
state, and the absence of any slow-lane date reader.

**Its verdict on the frame, kept visible.** The frame was imposed by the brief's author and
shaped the first draft toward "find an unread measure and attach a reader". No owner word asks
for one feedback loop to be made outcome-informed. The owner's one content-level steer was
about Hermes's measured loop, and the first draft never asked whether the Practice has one.
The second draft kept the brief's question, because it is the commission, and answered it
"none, yet". The owner's response, next, supplied the purpose the frame had lacked.

**The owner's response to the second draft, 2026-11-12, verbatim.** Quoting the second
draft's summary line "both of its measures depend on someone remembering to run them":

> In my opinion, that lack of loop automation is the biggest weakness in the Practice as it
> stands today. There are multiple mechanisms, session wrap, retrospectives, the napkin,
> dedicated consolidation sessions, all encoded as skills, but almost all if it requires the
> user to instigate the refinement and learning process.
>
> Note that Hermes code was run in prior sessions

What changed for it. Section 2.5 was added and bears the owner's statement out from the
records. The second draft's recommendation, to take the owed decisions and build nothing,
became the first job of a new recommendation (6.2), because it too waited on someone starting
a consolidation. The first draft and the reviewer had each held half of this: the draft saw
that nothing starts the measures, and proposed an alert; the reviewer saw that alerts are
already seen and deferred, and proposed asking the owner to reprioritise. The owner's
statement names what both missed: the missing part is a starter that also does the work.

On the second sentence: this seat's statements that no Hermes code was run are true of the
study and of this session and were written as if true of all sessions. They are corrected in
sections 0 and 7. A search of this repository and of the two forks' remote branches found no
record of the earlier runs.

The owner then closed the question, 2026-11-12, verbatim: "I don't think we will re-analayse ,
so we don't need the earlier runs, as long as the recorded conclusions are sufficient to
convey our findings". This seat's reading of the condition: they are sufficient. The findings
are the six effect records, the table of what starts each step, the scored-loop contrast and
the recommendation, and each stands on what is cited beside it.

**The readiness review of the strategic node, 2026-11-12.** A second read-only reviewer was
given the node's first sketch, the owner's commissioning words and the plan contract, and
found it not ready. Its findings and what was done with each, kept here because the node
itself carries no review record:

| Finding | Disposition |
| --- | --- |
| The sketch made the design wait on a further owner word that the owner had not asked for, and recorded no gate for it | Accepted. Removed. The owner later set the order in person: inputs arrive, all the work is reviewed together, then design |
| Three delivery nodes ratified on 2026-09-08 put automatic starting out of scope, and neither the node nor this document cited them | Accepted. Named in the node and in section 2.5 here. The owner then ruled that their constraint stands in general, with permission inside the experiment |
| The bet settled three things the owner said should wait: a separate agent, a non-human start, results staged for the owner | Accepted. Moved into the node's open questions |
| "No decision had been taken from any of them for four weeks" was contradicted by this document's own table | Accepted. Corrected here in the summary and section 6.1, and in the node |
| The owner's "ceremony has been invented" was attached to the session-open alert | Accepted. Re-attributed here and removed from the node |
| Rulings the owner gave for the Attendant were imported with a default on the owner's silence | Accepted. Listed in the node as inputs whose application is the owner's |
| A seat's reading sat in the node's numbered list of what is settled | Accepted. Moved out of the list |
| The outcome was wider than the commission | Accepted, and narrowed again after the owner's ruling on starting sessions |
| "None by a clock, a counter or an event" contradicted the node's own mention of a session-start alert; and the fitness readout also runs inside `pnpm make` | Accepted. The node says nothing in the repository starts a step and does its work; section 2.5 here gained the `pnpm make` fact |
| `serves: FRAME-1` and a separate strategic node are right | Confirmed |
| Dated state and counts in the node that would age | Accepted. Replaced by citations to this document |

**The owner's decision on section 6.2, 2026-11-12.** The trial is to be done, and its design
waits for related research to feed in; the owner's words are in the brief. The strategic plan
node `self-starting-practice-refinement` carries it from here. This document is not revised
further for that work; its section 6.2 is one input to the design and not the design. On the
position ratified on 2026-09-08 that a signal never starts a session by itself, the owner's
word the same day: "The session starting constraint stands in general, but when we run the
experiment I will give permission for sessions within the experiment to start without my say
so". Section 6.2 is to be read under that: its scheduled seat is something the experiment may
do with that permission, and nothing the estate does otherwise.

**What the reviewer proposed that this draft did not take.** A count of how often each rule's
cure text was patched, as a standing measure of its own: folded into 6.4 as an input, not a
new record.

**Quotation check.** Run after this revision with the script in
`../hermes-agent-v0.23.0-2026-11/method-instruments.md` section 4, reduced to one repository:
89 rows, no misses. The file keeps earlier drafts' rows beside this draft's, so a few rows
check phrases this revision no longer quotes. Seven ranges were corrected before the first two
drafts were committed: three in the first, four in the second.

**Return conditions.** Reopen this document when a dedicated consolidation next runs (it
changes P-1 to P-4); when PDR-130's fast-lane falsifier is decided; when a second
skill-evaluation run decides a pull request; or when the owner states the comparison's
purpose.
