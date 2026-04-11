---
title: "From Surprise to Doctrine"
thesis: >-
  The highest-value learning signal in agentic engineering is surprise: when
  reality breaks expectation, a system can capture that break, distil it, and
  turn it into future constraints.
status: stub
tags: [agentic-engineering, learning-loops, metacognition, knowledge-management]
---

# From Surprise to Doctrine

## Core Argument

Engineering teams talk constantly about knowledge sharing, but much of what
they preserve is low-value narrative: status summaries, meeting notes, chat
logs, and generic retrospectives. These records can be useful, but they miss
the sharpest signal of all:

**surprise**.

Surprise is what happens when expectation meets reality and loses.

You expected a refactor to be local; it broke a dependency boundary two
packages away.
You expected a reviewer role to require three adapters; it required seven.
You expected a provenance index to imply maturity; it only implied order.
You expected a tool to remember enough context; it resumed the files but not
the rationale.

These moments matter because they are traces of mental model repair. They show
exactly where the system taught you something you did not know before.

In an agentic workflow, this matters even more. AI makes it easy to produce
output without fully internalising why the output is right. Surprise tells you
where understanding lagged behind action.

## Why Surprise Beats Summary

Summaries preserve what happened.
Surprises preserve what changed.

That distinction is everything.

A generic session summary says:

- updated the plan
- fixed the tests
- created the reviewer

A surprise-aware record says:

- I assumed provenance was linear progress; it was only lineage order
- I assumed the portability check covered fewer adapters than it really does
- I assumed a design was over-engineered; the human context revealed it was
  proportionate

The second form is much more valuable because it changes future judgement, not
just future recollection.

## The Learning Loop

A strong agentic practice should route surprise through a disciplined pipeline.

### 1. Capture

Record the surprise while it is fresh.

- What did I expect?
- What actually happened?
- Why was that expectation wrong?
- What behaviour should change next time?

### 2. Distil

Ask whether the surprise would change future behaviour if read next session.
If yes, compress it into a portable rule or pattern.

### 3. Graduate

If the pattern is stable and broadly relevant, move it into a durable form:
directive, ADR, governance doc, reviewer instruction, or pattern library.

### 4. Enforce

Turn the learning into something the system can actually lean on: prompts,
rules, checklists, review boundaries, validation scripts, quality gates.

This is how a subjective moment becomes objective scaffolding.

## Why This Matters for Human-Agent Work

The most interesting thing about agentic engineering is not that agents can
help. It is that they make learning asymmetrical.

The system can generate a correct patch faster than the human can form a robust
mental model. That creates a dangerous illusion: because the output is good,
the understanding must be good too.

It often is not.

Surprise is one of the best counters to that illusion because it forces
reflection at the exact point where a hidden assumption failed.

Done well, this does not just improve the human. It improves the shared system.
The next session, next agent, next reviewer, or next repo can inherit the
repaired model rather than repeat the same mistake.

## The Doctrine Angle

The title is deliberate. The goal is not to collect interesting surprises. It
is to ask which ones deserve to become doctrine.

Most surprises should remain local.
Some should become distilled guidance.
Very few should harden into canonical rules.

That threshold matters. Otherwise every unexpected event becomes policy, and
the system calcifies.

But when the threshold is right, doctrine becomes grounded rather than
speculative. It is no longer "someone thought this sounded sensible". It is
"reality contradicted us here often enough, or sharply enough, that future work
should carry this constraint by default".

## Beyond Failure: Positive Surprise

There is a second category worth protecting: positive surprise.

Sometimes the most important thing learned is not "this failed", but "this
worked better than expected".

- a tiny note format proved enough to preserve context
- a reviewer boundary prevented conceptual drift
- a short continuation prompt resumed a large workstream cleanly
- a simple question surfaced a hidden assumption before weeks of work

If the system only records pain, it learns defensively. If it also records
positive surprises, it learns how to reproduce good conditions.

## The Field-Level Opportunity

There is room here for a more rigorous methodology for agentic learning loops.

Instead of asking teams to "document lessons learned", ask them to maintain a
surprise pipeline:

- capture expectation failure
- classify scope and durability
- promote only what changes future behaviour
- verify whether promoted learnings actually prevent recurrence

That would move the field away from vague retrospection and towards
evidence-backed institutional learning.

## Open Questions

- Can surprise be made into a routine without becoming performative?
- How should positive and negative surprise be weighted differently?
- What is the right threshold for promotion into doctrine?
- Can surprise be measured in a way that helps, rather than gamifies, learning?
- Which kinds of surprises should remain local because they are too contextual
  to generalise?
