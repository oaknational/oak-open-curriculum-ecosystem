---
pdr_kind: governance
---

# PDR-114: Knowledge Surfaces Are Curated Suggestions to a Judging Agent, Not Control-Flow

**Status**: Accepted
**Date**: 2026-06-23
**Related**:
[PDR-113](PDR-113-source-intent-from-the-principal-not-the-records.md) (sibling —
records are a projection to verify, not the source; this PDR is the routing-surface case);
[PDR-098](PDR-098-doctrine-traction-firing-detection-response.md) (passive guidance loses at
the action moment — the consumer of a knowledge surface is a judging agent, which is why a
surface cannot *compel*);
[PDR-046](PDR-046-layered-knowledge-processing.md) (the knowledge-flow staircase whose surfaces
this PDR characterises).

## Context

A skill, rule, register, reviewer brief, or routing pointer is sometimes read as if it were
control-flow — a branch the system must execute, a gate that fires deterministically, a call
that another surface invokes. That framing produces two recurring errors: treating a skill that
points to another skill as a loop/cycle risk (as if invocation were mechanical), and grading a
reviewer or a knowledge surface purely on the facts it states while ignoring the *lens* — the
frame from which it judges.

Every such surface is in fact read by a **judging agent** that decides what serves the moment.
The surface is an input to judgement, not an instruction the runtime obeys.

## Decision

Treat every knowledge surface — skills, rules, registers, routing pointers, reviewer briefs,
doctrine — as a **curated suggestion to a judging agent, not control-flow**. The surface informs
a decision; it does not make one. The agent reading it remains the decider and is accountable
for the judgement.

Two consequences follow directly:

1. **A surface suggesting another surface carries no loop or cycle risk.** "Skill A points to
   skill B points to skill A" is not infinite recursion — it is guidance a judging agent
   weighs and may decline. Cycle-safety reasoning imported from control-flow does not apply.
2. **A reviewer's (or surface's) lens is first-class, alongside its facts.** What frame it judges
   from shapes the judgement as much as the facts it cites; evaluate the lens, not only the
   assertions.

## Consequences

- Authoring a surface that references other surfaces is normal composition, not a hazard to
  engineer around.
- A reviewer brief is assessed on both its facts *and* the frame it reasons from; a
  fact-complete review from the wrong lens can still mislead.
- A surface cannot *compel* behaviour — which is why passive guidance loses at the action moment
  ([PDR-098](PDR-098-doctrine-traction-firing-detection-response.md)): the judging agent can
  always decline it. Mechanisms that must fire need a structural interrupt, not a louder
  suggestion.

## Enables

This PDR names why the Practice can layer suggestion-on-suggestion safely (the orientation
primer hands off to a lens; a skill points to a deep reference; a rule cites another rule) without
the brittleness control-flow composition would imply — the judging agent is the integration point,
and its judgement, not a call graph, is where the surfaces compose.
