---
pdr_kind: pattern
---

# PDR-137: The Basis-Set Transformation Method

**Status**: Accepted (owner merge of PR #874, 2026-08-13T09:49Z, plus
the same sitting's card go-word; provenance below)
**Date**: 2026-08-13
**Related**:
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(first-principles screening at authoring time — the check every derived
plan runs);
[PDR-108](PDR-108-generalise-where-generalisation-does-not-cost-utility.md)
(generalise only as far as behaviour-changing utility survives — bounds
step 6's structural moves);
[PDR-134](PDR-134-knowledge-strata-carriers-and-the-concept-layer.md)
(generality and identity as explicit system properties);
[PDR-135](PDR-135-cost-of-change-gradient.md)
(general mechanism below, specific value above — the expression-side
shape this method's transformations preserve).

## Context

A recurring class of work has the form: **an existing system exhibits
properties we want a system of ours to have.** Brand onboarding into a
design framework, re-truing a derived surface against a live product,
migrating a practice between hosts, reconstructing a capability from a
reference implementation — all are transformations judged by likeness
to an origin.

Two failure modes dominate this class. The judging authority becomes
the operating instrument — every step needs their eye, which does not
scale and leaves quality held by vigilance rather than structure. Or a
single proxy metric stands in for the target property and is optimised
into meaninglessness: any one proxy can be gamed, and under
optimisation pressure it will be.

The owner named the cure and its mechanism (2026-08-13, in-session):
orthogonal proxies compound — *"every proxy can be gamed, but two,
high quality, orthogonal proxies are very hard to simultaneously game,
three orthogonal proxies near impossible"* — and the general method:
*"We take an origin system, we define a set of characteristics from
the origin that we want a new system to have, we define an orthogonal
basis set model for that set of characteristics, we use the model to
define a plan, a set of acceptance criteria, metrics for success and
health, a multidimensional fitness function, we perturb and iterate
the new system until it maximises alignment with the basis set."*

## Decision

Transformations — and creations of new systems — of the form "our
system should exhibit chosen properties of an origin system" run the
**basis-set method**. The method is DOMAIN-GENERAL (owner
clarification, 2026-08-13, verbatim): *"the generalised system
transform/creation method needn't be about visual qualities, it could
be literally anything, the case of the design system and the Oak
identity is a particular case that happens to be about a visual
identity expressed through css and components."* The characteristics
may be behavioural, structural, procedural, tonal, performance-shaped,
or anything else observable about an origin; and they may be drawn
from ONE origin or SEVERAL — the basis unifies a selection, not a
single source.

1. **Name and render the origin(s).** Each origin system is identified
   and OBSERVED first-hand in its native medium before any
   decomposition — run the reference implementation, read the corpus,
   render the pages; a description of the origin is not the origin
   (the render-the-reference discipline).
   Reference captures carry provenance and become the fixed comparison
   set; a live origin drifts, so the committed captures ARE the
   reference, with a named re-baseline procedure.

2. **Choose the desired parts.** An explicit, ratified selection of
   characteristics — never "all of it". Target-state properties, not
   the origin's legacy accidents or mid-migration residue: span where
   the origin is going. The selection is a design act belonging to the
   deciding authority, and it is recorded.

3. **Model the selection as an orthogonal basis.** Decompose the
   desired parts into independent, separately measurable dimensions.
   **The orthogonality admission rule** (owner-ratified 2026-08-13):
   every metric admitted to the set declares its AXIS and its distinct
   GAMING VECTOR; a candidate sharing an axis with an existing metric
   is rejected or explicitly replaces it; no metric outranks another.
   Floors (correctness, accessibility, hygiene) and meta-guards
   (generality of mechanism) are conjunct preconditions OUTSIDE the
   basis — counting a floor as an axis fakes orthogonal coverage.

4. **Derive the plan from the model.** Dimensions map to slices;
   instruments land before movement (measure first, red-first against
   the current state); each dimension carries an acceptance criterion
   with a typed proof. Metrics split into **success** (alignment per
   dimension) and **health** (the process: do successive rounds shrink
   the residual; are witnesses fresh and digest-bound; what is the
   flap policy). State and dynamics are separate disciplines — a loop
   of individually correct steps can still diverge.

5. **Define the multidimensional fitness function.** Fitness is
   VECTOR-VALUED: per-dimension alignment, never prematurely
   scalarised — a weighted sum reopens gaming through trade between
   axes. Iteration may improve any dimension; acceptance is the
   CONJUNCTIVE level set: every basis dimension at threshold and every
   guard conjunct green. Inter-dimension disagreement blocks and is
   investigated as evidence about the metrics, on a bounded path with
   a declared escalation.

6. **Perturb and iterate.** Two move classes, priced and governed
   differently: **parameter moves** (values within existing expressive
   dimensions — cheap, frequent, reversible) and **structural moves**
   (new expressive dimensions — expensive, ratified before
   implementation, versioned). Structural moves are sized by the
   MEASURED residual after parameter moves, never by an up-front
   inventory, and each requires a demonstrated expressibility gap plus
   consumer evidence beyond the single driving instance. Measurements
   re-baseline, with recorded provenance, at each structural move;
   "no regression" binds within a basis version. Rounds are budgeted;
   a persistently red dimension at budget routes to the deciding
   authority as evidence about the metric.

7. **Hold the terminal evaluation out.** The deciding authority's
   sign-off sits OUTSIDE the optimisation loop — the held-out test the
   loop cannot overfit. Their eye appears at named moments only:
   ratifying the selection and the basis, threshold ratification at
   calibration, and final sign-off.

The anti-gaming property is structural: a set of genuinely orthogonal
dimensions SPANS the target property, so simultaneously satisfying all
of them converges on actually having the property — gaming the full
basis is indistinguishable from achievement.

## Conceptual lineage (owner-named)

The method sits in *"model optimisation and parameter optimisation
adjacent conceptual space"* (owner, 2026-08-13), and the mapping is
diagnostic, not decorative:

| This method | Optimisation analogue |
| --- | --- |
| the new system | the model |
| its configuration values | parameters |
| the orthogonal basis | objective decomposition |
| orthogonality admission rule | anti-Goodhart regularisation |
| floors and guards | constraints |
| perturb-and-iterate rounds | the optimiser loop |
| ratchet rows | monotonicity constraints |
| parameter vs structural moves | parameter search vs architecture search |
| counter-instance regression | held-out generalisation test |
| ablation distractors in perception trials | ablation studies |
| deciding-authority sign-off | held-out evaluation |

When a transformation stalls, ask what the optimisation literature
does at the analogous failure: plateaued fitness under parameter moves
suggests a missing dimension (architecture, not more tuning); a
mechanism that only its driving instance exercises is overfit
(demand a second consumer); a judge the loop can see gets gamed (hold
it out).

## Boundaries

Use the method when the goal is "system B exhibits chosen properties
of system A" and the properties decompose into independently
measurable axes. Do not use it: for greenfield goals with no origin
(there is nothing to decompose — state outcomes directly); for a
single-characteristic target (a basis of one is just a metric with a
control); or where decomposition destroys the property being measured
(then measure holistically, accept the weaker gaming resistance, and
say so).

## First worked instance

`oak-identity-recognisability.plan.md` (design lane, 2026-08-13): a
four-metric recognition basis (declared-structure conformance,
rendered-structure probes, rendered-geometry witnesses, holistic
perception trials) with quality-floor and generality guards, derived
slices S1–S5 in exactly the shape above, and the owner's
recognisability criterion held with his eye at four named moments
only. Its readiness reviews supplied the method's hard-won
sharpenings: floors out of the basis, vector fitness with conjunctive
acceptance, residual-sized structural moves, witness decay, and the
held-out judge.

## Provenance

Owner words, 2026-08-13, design-lane session (d0274e), verbatim quotes
in §Context and §Conceptual lineage; the same sitting ratified the
orthogonality admission rule and directed this generalisation: *"I
want the basis set method generalised and recorded."* Transcribed by
the design seat; the Proposed → ratified transition is the owner's
glance at this record's pull request.
