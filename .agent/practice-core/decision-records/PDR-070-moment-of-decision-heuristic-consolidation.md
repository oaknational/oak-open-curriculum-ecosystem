---
pdr_kind: governance
---

# PDR-070: Moment-of-Decision Heuristic Consolidation

**Status**: Draft
**Date**: 2026-05-22
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(capture → distil → graduate → enforce — this PDR addresses
the *enforce* stage's organising surface);
[PDR-046](PDR-046-knowledge-layering-and-natural-homes.md)
(knowledge layering — the doctrine surface this PDR proposes
to re-shape);
[PDR-069](PDR-069-doctrine-first-vs-first-principles-diversity.md)
(doctrine-first reasoning — this PDR proposes a consolidated
heuristic that doctrine-first reasoning can apply at the moment
of decision);
[`practice-index.md`](../practice-index.md) (substrate-
implementation ADR carrying the repo-specific phenotype — the
rule-topology consolidation that would express this PDR's
shape in the always-applied rule tier).

## Status Caveat

This PDR is a **Draft** rather than a Proposed decision. Two
instances have been observed (a multi-rule convergence on a
verdict; an owner reframing of closure-pressure under the same
heuristic). Promotion to Proposed requires a third worked
instance against a different decision class, or owner direction
to ratify on the substance currently available.

## Context

Rules and skills are currently decomposed by **topic**:
replace-don't-bridge, present-verdicts-not-menus,
no-fallbacks, schema-first, apply-don't-ask,
stop-inventing-optionality, plan-body-first-principles-check,
and so on. Each rule has its own substance and its own
trigger conditions; agents fan out to all of them at
decision time and synthesise the convergent verdict.

Decomposition by **temporal/structural locus** would group
rules by *when they should fire*. The moment of decision is
the densest locus: many rules converge there. A single
decision-time heuristic — *at every decision point, the
question is which shape gives long-term architectural
excellence* — is a candidate to subsume many rules' verdicts
at that locus.

## Observation

Rules at the moment of decision do not actually disagree
when the long-term-architectural-excellence frame is applied.
Worked instance: a verdict on a five-rule fan-out (replace-don't-
bridge, no-aliases, no-fallbacks, verdict-vs-menu, schema-first)
produced the same answer (route every entry through the
canonical factory) when the long-term frame was applied at the
moment of decision. The five rules carried the *reasoning content*
behind the verdict; the verdict itself converged under one
question.

If the convergence is reliable, the rule corpus's role at
the moment of decision is to provide **reasoning content
behind the verdict**, not **triggered fan-out to produce the
verdict**. The fan-out cost (loading and checking N rules
against the situation) is amortised across the corpus's
substantive depth rather than spent at each decision.

## Decision (Provisional)

Adopt the **moment-of-decision heuristic** as the consolidating
question at every decision point:

> *Which shape gives long-term architectural excellence?*

The rules continue to carry the reasoning content — the
*why* behind each shape's excellence-relative-to-alternatives —
but the verdict at the decision point is produced by applying
the heuristic, not by serially evaluating each rule.

This is a Draft because the consolidation has implications for
the rule corpus's topology that have not been worked through:

- Which rules become **reasoning-content sources** (read when
  the heuristic's answer is contested) versus **gating rules**
  (always fire regardless of the heuristic)?
- How does the heuristic compose with rules whose subject is
  *meta* (capture discipline, observability, identity) rather
  than *architectural*?
- Does the heuristic invite over-confidence — does the agent
  use it to skip rules that should fire?

## Falsifiability

Future decision points where multiple rules fire should
produce verdicts that **converge under the heuristic**.
Divergence names rules the heuristic doesn't cover yet —
either because the rule is meta-level (not about
architecture) or because the heuristic's articulation is
incomplete and needs extending.

A future decision where the heuristic produces a verdict that
conflicts with a fan-out application of the relevant rules is
the falsifying instance.

## Promotion to Proposed

Requires:

- A third worked instance against a different decision class
  (not architectural; e.g. testing, security, accessibility).
- Owner direction to ratify on the substance currently
  available, **or**
- A rule-topology slice that absorbs this PDR as its design
  input.

## Open Questions

1. Is the heuristic complete, or does it need bidirectional
   framing to cover both the "what should I do?" and
   "what should I avoid?" sides of a decision?
2. What is the cost of agents skipping a rule they should
   have fired because they applied the heuristic and got an
   answer that *felt* right?
3. Is the doctrine-first/first-principles divide (see
   [PDR-069](PDR-069-doctrine-first-vs-first-principles-diversity.md))
   a useful split for which rules become reasoning-content
   sources versus gating rules?
