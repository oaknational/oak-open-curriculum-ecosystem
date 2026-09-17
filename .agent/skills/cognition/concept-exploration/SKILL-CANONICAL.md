---
name: concept-exploration
classification: active
description: >-
  Explore an unshaped concept, phenomenon, recurring incident class, or messy set of observations
  before solution options or the decision question are well formed. Use when framing options
  immediately would foreclose the real question; run four alternating metacognition and reason
  movements to produce a well-formed understanding with warranted, falsifiable proposals. Do not
  use it as a separate pre-decision pass once the options or decision question are already well
  formed; continue through the estate's formed-decision workflow instead.
---

# Concept Exploration

Convert raw observations into holistic understanding before committing to well-formed options.
This workflow is the upstream sibling of the decision lenses: it composes
[`metacognition`](../metacognition/SKILL-CANONICAL.md) inward and
[`reason`](../reason/SKILL-CANONICAL.md) outward so that each discipline checks the other's failure
shape. Reasoning alone structures prematurely; reflection alone yields insight that never
converges.

Its paired pre-decision gate is [`proportionality`](../proportionality/SKILL-CANONICAL.md): this
workflow asks *is this the right question?*, that gate asks *is this the right SIZE of question,
and the right LEVEL to answer it?* Run them together — an exploration that never sizes its subject
can produce a warranted synthesis of work nobody should do at that scale, and a sizing pass over a
malformed question sizes the wrong thing.

Repository-specific provenance, adaptation notes, and replication guidance live in
[the concept-exploration Practice transfer note](../../../research/concept-exploration-practice-transfer-2026-07.md).

## Loop Dynamics

The principles beneath every iterative loop this estate runs — exploration movements, review
rounds, cure cycles (owner-ratified 2026-07-27, from the four-seat review-loop instance):

- **State and dynamics are separate disciplines.** An artefact's correctness is a state question;
  a process's convergence is a dynamics question. A loop can be composed entirely of individually
  correct steps and still diverge. Judge the loop by whether successive rounds SHRINK; a round
  that grows the surface is a routing failure, not diligence.
- **Individual validity is not sufficiency.** A finding, idea, or improvement being correct does
  not entitle it to in-loop cure. Relevance to the current story and proportionality to the
  current instrument are separate conjuncts, tested separately. The general form of the owner's
  review-triage ruling: reject the incorrect; absorb only the correct-relevant-proportionate;
  re-home everything else explicitly and CLOSE it here.
- **Cure-class separation.** Work the current story does not require is routed to its own named
  home (a pointer ticket, a sibling exploration, a later movement) — never absorbed. Absorbing
  adjacent valid work is the mechanism by which loops diverge.
- **Every loop names its exit criteria** before it runs (`loop-exit-criteria-required`), and the
  operational forms live where the loops live: review rounds in `pr-lifecycle` §Phase 4 (the
  triage discipline and convergence-as-the-test) AND §"The review-round state machine" items 2
  and 4 (the mechanical step-back predicate and the settled definition — different things, both
  binding); sizing in
  [`proportionality`](../proportionality/SKILL-CANONICAL.md). "Repeat the movement that failed to
  bite" (below) is bounded by the same discipline — a movement repeated twice without biting is a
  mis-framed question, not a cue for a third repetition.
- **An exit criterion that cannot be reached is not an exit criterion.** Verify the predicate
  against the mechanism's real output before claiming the loop is bounded — a stand-down counter
  that advances only on a condition the system never produces reads as bounded and runs forever
  (worked instance 2026-07-27: the F-75 peer-liveness recipe, whose own comment claimed "never an
  unbounded loop").

## Four Movements

Run the movements in order. Let each movement change the next; do not fill in a predetermined
answer.

1. **Reflect on the raw observations.** Gather what was actually observed: incidents, surprises,
   exact words, and patterns. Use metacognition to expose inherited assumptions before imposing a
   frame.
2. **Define the problem space.** Use reason to name the kind of thing and state the gap, who it
   harms, the causal mechanism, constraints, and what success looks like. Define the problem,
   never a preferred solution.
3. **Reflect on possible solutions.** Re-open the solution space with metacognition. Interrogate
   the fluent first answer and inherited shapes; let the reflection change what counts as a
   solution.
4. **Synthesise and propose.** Combine reason and metacognition into one holistic understanding.
   Propose proportionate next steps, each with its warrant and a falsifier.

## Output Contract

Finish with:

- the problem frame and its load-bearing observations;
- assumptions or inherited shapes that changed;
- proposed next steps with a warrant and falsifier for each; and
- unresolved evidence that could materially change the synthesis.

A pass succeeds only when it changes a framing, surfaces a warrant, alters a proposal, or produces
a justified no-change verdict. If it merely restates the starting position or fills in the four
headings, repeat the movement that failed to bite.

## Routing Boundaries

- When options or a contested decision are already well formed, use the estate's formed-decision
  workflow (`reason`, decision lenses, and any required decision matrix) instead of re-running this
  standalone pre-decision exploration.
- When the question is well formed but its SIZE, its instrument weight, or the SEAT that should
  answer it is the live uncertainty, run [`proportionality`](../proportionality/SKILL-CANONICAL.md)
  rather than opening an exploration. Exploring a correctly-framed question that is simply
  mis-sized or mis-routed spends the expensive instrument on the cheap defect.
- When the need is only to inspect the thinker's stance at an action boundary, use `metacognition`
  directly.
- When the synthesis is settled and implementation needs sequencing, hand the result to the plan
  workflow; do not turn this exploration into an implementation plan implicitly.
