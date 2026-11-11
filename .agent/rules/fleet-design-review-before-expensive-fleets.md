---
classification: core
description: Any fleet or workflow fan-out, whatever its size — the ahead-of-time cost estimate from a pilot leg per phase, the hand yield sample, the tier per phase and the enforced budget fire before every launch; a potentially expensive fleet (over the default workflow size guideline or ~500k estimated tokens) also has its design reviewed by a smaller adversarial fleet before the owner prices it, and the review's verdicts travel with the plan to the ratification ask.
---

# Fleet design review before expensive fleets

Owner-directed standing practice (2026-08-11): any potentially expensive
fleet — as a working line, one that would exceed the session's default
workflow size guideline, or whose estimated spend crosses ~500k tokens —
has its DESIGN reviewed by a smaller fleet before the owner prices it,
and the design review's verdicts travel with the plan to the
ratification ask. Before ANY fleet launches (owner word 2026-09-07): an
ahead-of-time cost estimate from one measured pilot leg per phase, each times
its phase's fan-out and summed across the phases,
a hand sample of the yield first, no adversarial verify phase where the seat
verifies at application, bounded per-item search, a named tier per phase
with the budget enforced in the script, and those numbers in the launch
record — the section "Ahead-of-time cost estimate, pilot and yield" below
carries each requirement and the measurement behind it. This rule is CORE
(since 2026-09-07): fleets launch from any seat on any platform through
primitives no loader recognises, so the controls load in every session.

## Why (the measured instance)

The first use of this practice paid for itself before it was a rule. The
PR #846 review-fleet plan (2026-08-10, `pr-846-review-fleet`) was
reviewed by a five-leg fleet (~384k tokens, ~7 minutes) ahead of an
estimated 1.5–4.8M-token run, and returned 5/5 *revise* with two
severity-4 design defects, either of which would have wasted or
corrupted the whole spend:

- **The wrong object**: the dispatched diff range (`main...branch`)
  resolved against a stale local `main` to ~906 files instead of the
  PR's ~41 — every leg would have reviewed a 22× contaminated object.
  All five legs caught it independently.
- **Structural false confidence**: refute-by-default empirical
  verification would have systematically killed judgement-class
  findings (frame, doctrine, architecture) and hard-to-reproduce
  browser findings, then reported their absence as verified soundness.

Neither defect was visible to the plan's author — both live in the gap
between the plan's words and the execution environment, which is
exactly where independent eyes are cheapest.

## The practice

1. **Compose the review fleet small and adversarial**: 3–6 legs chosen
   by substance — always `assumptions-expert` (proportionality,
   agent-count warrant) and a frame-challenger; add adversarial
   architecture, test-methodology, and script-mechanics lenses as the
   design's shape demands. Reviewers get the plan file AND first-hand
   access to the execution environment, with the instruction to VERIFY
   the plan's factual claims there (ranges, ports, paths, tool names)
   — the wrong-object class is caught only by resolving the plan's
   words against the real environment.
2. **Adjudicate and revise in place**: every severity-3+ finding cured
   or refuted with evidence; the revision carries a dated note naming
   what changed.
3. **Present with the verdicts attached**: the owner's pricing decision
   sees the review's findings, the cures, and the reviewed cost
   estimate together.

Cheap fleets (a handful of legs, well-trodden shape) do not need this
ceremony — the rule binds where the spend makes a design defect
expensive. The earlier one-or-two-subagents limit was lifted by the owner
on 2026-09-16 for all seats and all repositories; what stays is the
identical-frame discipline (every leg gets the same six-field frame) and
this review for expensive fleets. Estimate after scripting, never before:
an estimate that paced agent work like hand work (26 to 40 hours) was
overtaken when the first scripted hour delivered most of it (2026-09-12).
A frame that asks for a report names the report's exact row shape (the
field order, the delimiter, the heading per row): seven analysts given
identical frames returned three formats, and the seat's join tooling read
one (2026-09-30). Where several workers return the same item shape, the join
script assigns the item letters and repairs a mis-copied id from the one
source that carries the quote: a worker points, a script numbers (the second
instance of report-format drift, 2026-10-01).

## Briefs centre the question, never the predecessor

A baseline document transmits its STANCE, not only its facts: round-1
census judges handed the 2026-04-28 matrix as their baseline carried its
"keep as thin leaf" editorial stance unratified into their target states,
and the round that centred the question instead produced a dramatically
different result (2026-08-14). A ratification transmits its stance the
same way: briefs seeded with "ratified structure must be respected"
converted surface-with-verdict into defend-the-ruling — every panel
graded the incumbent instead of searching the space (owner diagnosis
2026-08-17, verbatim: "self-congratulatory theater"). When the owner
reopens a space ("the original target architecture was WRONG"), prior
rulings inside it become historical data: write briefs that forbid
deference to anything in the reopened space, admit only first-hand
verified mechanism facts and measurements as evidence, and let prior
decisions enter as ordinary candidates. The anchor-free legs (a cold pass
forbidden the corpus; raw git measurement) were the only parts of that
day's work that survived, and they independently agreed with the owner.
Cure record: `.agent/research/workspace-basis-regrounding-2026-08-17.md`;
the named concept: `patterns/baseline-transmits-its-stance.md`.

Budget the READ traffic. Repo-direct walker legs are dominated by
tool-read tokens, not output: the 2026-08-17 survey round missed its
estimate threefold (3.5M spent against ≤1.1M estimated) because reads
were unpriced. A fleet estimate names its read model per leg.

## A killed builder's seam is re-verified at the next gate tier

Fleet design includes the hand from a builder to its finisher. A builder
killed by quota hands its seam to the NEXT gate tier's re-verify, not only
the tier it died inside: a finisher's "green" omitted the pre-push-only
smoke chain, and the stale fixture literal sat exactly at the original
builder's death seam (2026-08-18). Brief the finisher to re-run every gate
tier above the death point before it reports green.

## Research prompts name the held command classes

A background agent cannot answer a hook's approval prompt: a refuter that
ran a recursive delete inside its own scratch trial held a fifteen-agent
workflow at 14/15 for fifteen minutes (2026-09-03). A research prompt names
the held command classes — recursive deletes, network writes, anything the
hook policy approves interactively — not only "do not modify files"; the
resume from the run id returned the cached agents instantly. The Claude
harness phenotype of the tool — the died-agent check, the stall diagnosis
and the resume path — is
[`workflow-tool-operations.md`](../claude-harness-integrations/workflow-tool-operations.md).

## The review's first question is the warrant, never the instrument

Owner, 2026-08-17, closing the landscape-survey post-mortem: "the more we
expect to spend, the more certain we need to be of what we are measuring,
why, and what value we hope to get out of it." The original ask had been a
survey of common patterns, algorithms and data structures across the
estate; a week of elaborations later a taxonomy survey of about thirteen
million tokens ran a fleet-design review that stress-tested the
instrument's internals and never asked whether the question was ours to
answer or worth the spend. Review depth had scaled with instrument
complexity, not with spend. So, before any above-trivial spend (a fleet, a
long campaign, a paid vendor run): write the three-part warrant in one
short block (what is measured, why, what value is expected), check the
question's class (an owner-fact question goes to the owner's records and a
card, never to measurement), present it at the action moment, re-state it
at EVERY elaboration boundary, and check the current effort against the
VERBATIM original ask. The review below starts from that block; a review
that opens on the instrument has skipped the question that prices it. The
same day the owner cancelled a survey's second round with "the programme
guessed at owner-class questions" (relayed by the Director; one instance):
what the owner intends is not a discovery target, so a programme whose
questions turn on it asks the owner before launch.

The landscape-survey post-mortem's headline: "internal instruments audit mechanics, only external
reads audit warrants", so a fleet's own review legs test how the instrument runs and never whether
the question was worth asking; the warrant block above is read by someone outside the fleet (Poppy
lifts Bark's closeout of 2026-08-17, event 51008ab5).

## Tier every leg to its judgment weight

Owner, 2026-07-26, on a seven-agent verification workflow whose every agent
inherited the Fable main-loop model: "You can't start a suite of Fable
instances like that … doing that burns quota too quickly, there are more
refined, less brute force ways of achieving good outcomes with sweeps and
research." `Workflow` and `Agent` calls inherit the session model by
default, so a heavyweight main loop silently multiplies its own cost by N,
and quota is a shared fleet resource. An effort flag in the harness is not
owner word; the owner prices quota. The default composition: inline first
(a few serial greps, reads or `gh` calls by the main loop answer most
"verification legs"); when a fan-out is justified, tier per leg, with
mechanical verification, extraction and existence checks on the cheapest
tier at low effort, in-frame judgement on the middle tier, and one
frame-challenge or deep-adjudication seat on the top tier; and fewer,
sharper agents over breadth, merging cheap legs into one agent's checklist.
The 2026-08-06 lift of the top-tier subagent embargo removed the
prohibition, not the economy: a heavyweight sweep can be warranted ("in
this case it may well be warranted, I do not trust the state we were
handed"), and that warrant is the owner's to price case by case.

## Ahead-of-time cost estimate, pilot and yield (owner word 2026-09-07)

The owner, on the 2026-09-06/07 mapping fleets: "your dynamic workflows have been
eating tokens at an incredible rate"; the fleet-design documentation "needs to
include ahead of time cost estimates and optimisation". Measured from those runs'
records (about 8.1M tokens for 43 map blocks and 8 record chunks; a verify phase
of 41 legs returning one result; 82k–171k per leg on the session model, 87k per
leg on a cheaper tier with a twelve-call cap):

1. **Cost is set by what enters a leg's context, times its turns.** The unit
   itself (a napkin block of thousand-character lines is 10–15k tokens; a
   record chunk of five-thousand-character lines 30k), the rules, and every tool
   result — each re-sent on every later turn, so tool results dominate. A
   cheaper tier lowers the price per token and never the count; a call cap
   bounds calls, not results. Estimate a leg as (unit tokens + rules) × turns +
   Σ tool-result tokens × turns remaining; size units by tokens (`wc -c` ÷ 4),
   about 8k each.
2. **Pilot before fan-out.** One representative leg per distinct phase (map,
   reduce, verify, synthesis), measured from its run record, times that phase's
   fan-out, summed across phases in the launch record beside the estimate; abort
   when the sum crosses the budget (a single-phase fleet reduces to pilot × N). A resume by run id is a launch: the pilot and yield are re-decided.
3. **Sample the yield by hand first.** Three to five units read at the seat show
   what fraction would move — four fifths of the 2026-09-07 napkin was already
   homed or pure state, a fact a twenty-minute sample would have set before an
   instrument was built. The count chooses the instrument, or no instrument.
4. **No adversarial verify phase behind a first-hand check.** Adversarial
   verification belongs where the consumer would otherwise trust the output
   unread (findings that go straight to a PR); a seat that verifies at
   application makes the phase pure spend.
5. **No open-ended repository search per item.** Legs read the unit and return
   items with a proposed home class; the seat verifies homes with targeted reads
   (a script checks citations mechanically). Where search is allowed, bound it
   by a search command, a per-item read cap and a result-size cap derived in the
   launch record from the measured pilot (the 2026-09-07 instance: `grep -l`
   only, one read of at most sixty lines per item). A read-back of mapped
   items against whole source bundles misses facts stated in passing inside
   an announcement and owner words cut inside a clause (one cut dropped a
   "not"); check every owner quote mechanically against the source's
   quotation marks before any leg's verdict is applied (2026-10-01).
6. **Name the tier per phase and enforce a budget in the script** (the workflow
   API's `budget`): the top tier only where judgement is the product; `log()`
   dropped coverage; a stop condition that is not the owner noticing.
7. **The launch record carries the numbers**: estimate, pilot, yield sample,
   tier per phase, budget — and, above the ~500k threshold, this rule's design
   review with its verdict. Runs report tokens, calls, mean and max per phase
   from the run record when they end (a tally row, as the Cricket tally does per
   leg).

The measured 2026-09-07 fleet failures share one generator: "instruments about the object instead of
contact with it; a mechanism modelled instead of measured", recorded with "thirteen fleet-design
defects and nine process defects each with a cure" (Juno seeks Apogee's owner-directed measurement
of 2026-09-07, event c8812df4).

Two leg failures a design plans for. An agent started late in the usage window dies on the
limit and returns nothing: start no reviewer near the limit, or after a compaction has been
called. A narrow verifier can return a stub on its first run: a reading of every leg's output
before the next stage catches it, a count of returned legs does not (three stubs, 2026-07-08).

Legs share no mutable resource. A relay arm whose spawns shared scratch filenames crossed
seven of twenty-eight runs, and striking the crossed rows reversed the finding the run had
seemed to show (August 2026). Remove the shared resource; do not shrink the window. Carry the
task's id through the output schema so that contamination shows, and strike data whose
provenance cannot be verified.

A survey that asks models for the owner's facts produces guesses, and their consensus is not a
decision input (owner ruling, 2026-08-17): keep its mechanical measurements and its fleet
lessons only.

The committed design is the task specification of record. A workflow script drafted in a
scratchpad is never the specification.

A call cap bounds calls, not results. Price each leg from what it reads, because a flat
per-leg figure hides the large leg: a triage stage estimated at 0.7M tokens cost 2.1M, each leg
reading a 70 KB batch for about 130,000 tokens (2026-10-01).
