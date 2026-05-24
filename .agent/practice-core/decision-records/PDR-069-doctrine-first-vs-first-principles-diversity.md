---
pdr_kind: pattern
---

# PDR-069: Doctrine-First and First-Principles Reasoning Are Cognitive-Approach Diversity

**Status**: Draft
**Date**: 2026-05-22
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — this PDR names the
upstream cognitive shape at the *application* end of the
pipeline, where ratified doctrine meets a live situation);
[PDR-046](PDR-046-knowledge-layering-and-natural-homes.md)
(knowledge layering — the doctrine surface is the
doctrine-first reasoner's primary input);
[`practice-index.md`](../practice-index.md) (substrate-
implementation ADR carrying the repo-specific phenotype — the
pre-action first-principles checkpoint and the recurrence-
diagnostic move when the same doctrine answer is reached for
twice in a short window).

## Status Caveat

This PDR is a **Draft** rather than a Proposed decision. It
captures a single owner-flagged observation from 2026-05-17
that names a structural cognitive shape. Promotion to Proposed
requires either a second instance from a different agent or
owner direction to ratify. The substance is recorded here at
PDR fidelity because the surface is cognitive-approach-shape,
which fits PDR more cleanly than pattern.

## Context

Corrections recur in agent-owner pairs in a recognisable shape:
the agent applies a doctrine-match move (fast, consistent,
transferable from prior decisions); the owner reframes at the
structural layer (slow, novel, doctrine-extending). The
recurrence is **not** an agent failure — it is the natural
cognitive division when one party carries the corpus of prior
decisions and the other carries the structural-extending
reasoning.

## Observation

The two reasoning shapes have complementary evolutionary fit:

### Doctrine-First

Scales when doctrine is **complete** and the situation is
**in-distribution**. The doctrine answer applies; the agent
reaches for the nearest rule, applies it, moves on.

Failure mode: when the rule has a hole or the situation is
out-of-distribution, lexical match reaches for the nearest
rule **even when none fits structurally**. The agent
confidently applies the wrong cure.

### First-Principles

Scales when the situation is **novel** or doctrine is
**incomplete**. Produces structural insights that grow the
doctrine. Slow, novel, doctrine-extending.

Failure mode: slow, doesn't transfer well to similar future
situations, re-derives established knowledge unnecessarily
when the situation is actually in-distribution.

## Decision

The pair compounds when **both are present in the agent-owner
dyad**. When the owner is not present, the agent operates
doctrine-first alone, and the doctrine-by-analogy failure mode
becomes the dominant risk.

Two cure shapes:

1. **Pre-action first-principles checkpoint.** Before applying
   a doctrine answer, the agent asks: *what kind of thing is in
   front of me, and is this rule shaped for it?* If the
   answer is uncertain, slow down and re-derive from substance.

2. **Recurrence diagnostic.** When the same doctrine answer is
   reached for **twice in a short window** (a second
   limit-raise, a second correction of the same shape), the
   agent treats the doctrine answer itself as a candidate
   failure mode and asks: *what is the upstream cause of this
   signal recurring?*

## Consequences

- Doctrine-first reasoning remains the default at agent-scale
  because it is the only mode that scales with the doctrine
  corpus.
- First-principles fires explicitly at the pre-action
  checkpoint and the recurrence diagnostic; it does not fire
  on every decision (that would collapse into permanent
  uncertainty).
- Owner reframes become **structural inputs** rather than
  corrections-to-recover-from; the doctrine-extending move is
  the owner's natural contribution and the agent's natural
  response is doctrine update, not avoidance.

## Falsifiability

At the next equivalent decision after a recurrence, the agent
surfaces a **surface-classification verdict** (does this
doctrine apply structurally?) before proposing a response,
and routes recurring signals to upstream-cause diagnosis
rather than to menu-application. A future decision where the
same doctrine is reached for repeatedly without the
pre-action check or the recurrence diagnostic firing is the
failure mode this PDR warns against.

## Promotion to Proposed

Requires either:

- A second worked instance from a different agent, with
  evidence the pre-action checkpoint and/or the recurrence
  diagnostic fired and produced the right move.
- Owner direction to ratify on the substance currently
  available.
