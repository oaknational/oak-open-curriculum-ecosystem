---
pdr_kind: pattern
---

# PDR-123: Agentic Design Panels — Independent Generators, a Diverse-Lens Critic Ensemble, Orchestrator Synthesis

**Status**: Accepted
**Date**: 2026-07-02 (graduated on first instance per the promote-on-first-instance
doctrine and owner direction; the founding instance and its effectiveness assessment
are recorded in the host report `agentic-design-panel-protocol-2026-06-29.md`. Each
application refines this PDR in place — see §Self-Improvement.)
**Related**:
[PDR-122](PDR-122-agentic-judgment-pipelines.md) (the *adjudicative* sibling — judging
existing items; this PDR is the *generative* shape, and the two share the
asymmetric-ensemble insight);
[PDR-100](PDR-100-decision-debt-as-a-first-class-pillar.md) (single-instance graduation
when the lenses give a clear answer);
the host `principles.md` §First Question (the constraint the protocol structurally
enforces).

## Context

Using a panel of agents to **design** something is distinct from using agents to
*implement* (workflow fan-out over a work-list) or to *judge* (PDR-122 pipelines). The
first worked instance (the corpus-analysis v2 design, 2026-06-29) showed both the value
and the characteristic failure: independent parallel designers produced deep, grounded,
assessable drafts — and **over-elaborated in a correlated way** (all four gold-plated;
"design deeply" rewards thoroughness, so each proposed-then-justified elaboration). The
single adversarial critic was load-bearing by a wide margin: it caught real
over-engineering AND what the panel collectively missed. The expensive error in design
is shipping an over-engineered or principle-violating design, so rigour belongs on the
critique side.

## Decision

A design panel is built to this shape:

1. **Independent parallel generators, restraint-by-default.** Each designer receives
   the shared evidence and governing principles, works one facet, and is briefed to
   **default to the simplest shape and earn every addition against an observed
   failure** — never to "design deeply" and justify elaboration afterward. Require a
   `simplerAlternativeConsidered` and a `whatNotToDo` from each.
2. **A MECE facet cut, or an explicit merge step.** Cut facets to be orthogonal; where
   overlap is expected, add a synthesis/merge stage rather than discovering DRY
   violations in critique.
3. **A diverse-lens critic *ensemble* — the marginal critic beats the marginal
   designer.** Use two or more critics with distinct lenses (simplicity/YAGNI,
   completeness/what's-missing, principle-conformance), aggregated by the
   orchestrator. One critic is itself a single point of judgment — the exact error
   class the protocol exists to defeat.
4. **Synthesis stays with the orchestrator (the context-holder).** Subagents reason
   over artefacts; only the orchestrator holds the problem first-hand. Mechanise what
   is mechanical (e.g. duplicate-artefact detection across facets) rather than
   spending a critic on it.
5. **Proportionality.** Use a panel for genuine design decisions with a wide solution
   space, where independent perspectives plus adversarial pruning beat
   one-pass-iterated. A panel over a trivial or forced answer is theatre.

## Self-Improvement

Each application is itself a generation-and-critique that yields **both the design and
a refined protocol-for-running-panels**: record the effectiveness assessment (what the
critics caught, what the generators over-built, what the cut missed) alongside the
design, and fold refinements into this PDR. The founding instance's assessment (v1 →
the five refinements above) is the worked example of this loop.

## The dogfood symmetry

A design panel and the agentic artefact it designs often share architecture — fan-out
generation → adversarial validation → synthesis — and the same lessons govern both:
the adversary is the heart; rigour belongs where the expensive error lives; separate
broad generation from judgment; aggregate deterministically (PDR-122). When designing
an agentic system, check whether the design *process* should adopt the same shape the
*product* is adopting.

## Non-goals

- **Not an implementation fan-out** — work-list execution needs no critic ensemble.
- **Not a judgment pipeline** — adjudicating existing items is PDR-122's shape, with
  its conserve-by-default and deterministic-aggregation invariants.
- **Not a fixed panel size** — generator and critic counts are per-design
  configuration; the invariants are restraint-by-default generation, a diverse-lens
  critic ensemble, and orchestrator-held synthesis.
