---
pdr_kind: governance
---

# PDR-098: Doctrine Traction — the Firing × Detection × Response Decomposition

**Status**: Accepted (reconciliation frame; mechanism deferred — see §Scope of
this acceptance)
**Date**: 2026-06-15
**Related**:
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(firing-cadence-first; advisory-response constraint; observable-artefact-or-it-
didn't-fire; markdown-ritual / platform-parity);
[PDR-044](PDR-044-memetic-immune-system.md)
(innate / adaptive two-layer immune model; citation discipline as the
autoimmunity safeguard);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement);
metacognition directive
(pre-action ratification of the action-to-impact bridge);
`passive-guidance-loses-to-artefact-gravity`
(recall-dependent guidance loses under context pressure);
the design-space plan
`action-time-structural-interrupt-design-space.plan.md`
(the lane that explores the mechanism this PDR deliberately leaves open).

## Context

A maturing Practice accumulates rules, PDRs, and patterns faster than it gives
them an **action-time firing surface**. Authoring a rule installs *text*, not a
*tripwire*: the great majority of the rule estate is `always-on` (present in
context) but **recall-dependent at the decision moment**. Under artefact gravity
and flow-state pressure, recall-dependent guidance loses — the documented finding
of `passive-guidance-loses-to-artefact-gravity`, whose own Instance 1 records
even installed markdown tripwires failing to fire and being caught by external
friction instead. The experience corpus spent roughly six days (2026-05-30
onward) re-diagnosing this same insufficiency, which is the cross-session
evidence that promoted it to an owner-greenlit doctrine item.

Three existing doctrines appear to conflict on the cure, which is why the gap
persisted unresolved:

- the candidate finding: *"only a mechanical tripwire fires"*;
- PDR-029: *"advisory firing, **not mechanical** enforcement"*;
- PDR-044: the innate (deterministic, surface-signature) vs adaptive (cognitive,
  consolidation-time) immune split.

## Decision

The apparent conflict dissolves once doctrine-traction is decomposed into **three
independent axes** that the installed estate has so far kept coupled. Each of the
three claims above is a claim on a *different* axis, and they compose:

1. **Firing axis** — *what triggers the check.* **Mechanical / environmental**
   (the environment fires on a detectable condition; no agent recall required)
   vs **recall-dependent** (the agent must remember the rule exists at the
   decision point). The candidate's "only a mechanical tripwire fires" is a
   firing-axis claim: do not depend on recall; fire environmentally.
2. **Detection axis (modality)** — *how the pathogen is recognised once the check
   fires.* **Surface-match** (a literal/regex signature a deterministic scanner
   matches) vs **cognitive** (recognition needing judgement — a model reading the
   artefact against the doctrine). PDR-044's innate-vs-adaptive split *is* this
   axis: innate = surface-match, adaptive = cognitive.
3. **Response axis** — *what the check does once fired.* **Advisory**
   (consult-and-decide; the agent decides) vs **enforcing** (refuse-or-allow; the
   environment decides). PDR-029's "advisory, not mechanical enforcement" is a
   response-axis claim: advise, do not refuse (refusal invites routing-around at
   the cost of architectural excellence). PDR-044 agrees for the substantive
   class (soft-report) and reserves enforcing-response for the irreducible class
   (block).

**The gap is an empty quadrant.** The installed estate couples the axes: the
PDR-044 innate scanner occupies *mechanical-fire + surface-detect +
(block-or-soft-report)*; the PDR-029 advisory markdown-ritual and PDR-044 adaptive
layer occupy *cognitive-detect + recall-or-consolidation-fire*. The closest
installed approximation is PDR-029 Class A.1 (the plan-body-first-principles-check):
it gives cognitive content a *defined firing moment* (shape-entry), but it fires by
recall-gated markdown-ritual (an always-applied trigger the agent applies at the
moment), not mechanically — there is no environment hook (`.agent/hooks/policy.json`)
that fires it without agent recall. So **mechanical-FIRING with cognitive-DETECTION
at action time does not exist anywhere** — the quadrant is fully empty, and A.1 is
merely the closest the estate reaches. So the unresolved gap is one quadrant:
**mechanical-firing + cognitive-detection + advisory-response, for semantic
pathogens at action time** — the failure modes behind doctrine such as
`verify-dont-trust`, `present-verdicts-not-menus`, `ground-convenient-claims`, and
`validate-specialist-findings-before-acting`, none of which has a surface string a
deterministic scanner can match.

## Scope of this acceptance

What this PDR **ratifies** (the settled reconciliation, owner-approved
2026-06-15): the three-axis decomposition above, the demonstration that the
apparent PDR-029 / PDR-044 / candidate conflict dissolves because each is a claim
on a different axis, and the location of the precise gap (the empty quadrant). This
is a *clarifying lens*, not an empirical mechanism claim — it composes existing
ratified doctrine into one coherent frame.

What this PDR **deliberately leaves open** (NOT ratified here):

- **The mechanism** that would occupy the empty quadrant. Mechanism-family
  exploration lives in the closure-pressure-remediation design space and the
  action-time-structural-interrupt design-space plan; it is owner-directed and
  evidence-driven. This PDR does **not** select one.
- **The gap's size** — the semantic-pathogen inventory (which rules / PDRs /
  feedback entries have no surface signature) is unbuilt; it is the empirical base
  any mechanism choice needs.
- **Whether the gap is closable mechanically at all.** It may be that semantic
  pathogens are irreducibly cognitive and the best achievable is a *faster
  adaptive cadence + vaccination* (PDR-044) rather than an action-time interrupt.
  This is held as a live possible outcome, not assumed away.

## Consequences

### Enables

- A shared vocabulary (firing / detection / response) for reasoning about why a
  given rule does or does not fire, and for classifying any proposed
  doctrine-traction mechanism by which quadrant it occupies.
- A precise target for the design lane: the empty quadrant, not "make rules fire"
  in the abstract.

### Forbids

- **The self-referential trap.** The cure for recall-dependent doctrine MUST NOT
  be another passive always-on rule that says "fire at action time" — that is
  itself recall-dependent and is an instance of the failure mode it claims to
  cure. Any mechanism graduated from the design lane must carry a mechanical
  firing cadence AND an observable-artefact-or-it-didn't-fire record (PDR-029).
- **Minting a third parallel immune system.** PDR-044 already names the innate and
  adaptive layers; this frame names the gap *between* them, not a competitor to
  them. Any mechanism extends the existing immune substrate.
- **Autoimmunity without citation discipline.** A mechanism firing cognitively on
  semantic pathogens could produce false-positive fatigue across the whole rule
  surface; per PDR-044 it must carry the doctrinal-anchor citation discipline.

### Accepted cost

- The frame is a lens, not a fix: ratifying it does not close the gap. Its value
  is making the gap precise and the design lane's success criterion (t6 of the
  design-space plan) explicit, so the eventual mechanism is evaluated honestly
  rather than mistaken for a passive-rule patch.

## Falsifiability

The decomposition is falsified if a doctrine-traction phenomenon is found that
does not fit the three axes — e.g. a firing/detection/response combination that is
neither mechanical-nor-recall, neither surface-nor-cognitive, neither
advisory-nor-enforcing — or if the "apparent conflict dissolves" claim fails
because two of the three source doctrines genuinely contradict on the *same* axis.
The located gap is falsified if a counter-example shows mechanical-firing +
cognitive-detection + advisory-response *already* installed at action time
anywhere (Class A.1 does not count — it is recall-fired at a defined moment, not
mechanically fired).

## Cross-references

- The mechanism lane: the action-time-structural-interrupt design-space plan
  (reconciliation home → now this PDR; mechanism exploration → closure-pressure)
  and its self-referential-trap success criterion (t6).
- PDR-029 Class A.1 (plan-body-first-principles-check) — the closest installed
  approximation: cognitive content bound to a *defined firing moment* (shape-entry)
  via recall-gated ritual, not a mechanical fire. The existence proof that cognitive
  detection can be bound to a defined action-moment at all; the design lane's task is
  to give that binding a *mechanical* firing cadence.
