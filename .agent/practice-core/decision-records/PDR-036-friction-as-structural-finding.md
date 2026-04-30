---
pdr_kind: governance
---

# PDR-036: Friction-as-Structural-Finding (Invent-Justification Is the Signal)

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — disposition drift; tool-error-as-question);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment; deferral honesty discipline).

## Context

When an agent meets an edge case in a categorisation system —
a plan that fits no axis cleanly, a type-union member whose role
is unclear, an ADR that resists categorisation by lifecycle, a
lint-rule whose category overlaps two existing buckets — the
common move is to write a short paragraph of *justification* that
explains why the edge case lives where it lives. The justification
performs the categorisation work. The work continues. The
artefact appears complete.

Empirical instance (2026-04-30 on `fix/sentry-identity-from-env`,
Vining Ripening Leaf session): a strategic plan
(`observability-config-coherence.plan.md`) addressed every axis of
the observability frame (engineering, product, usability,
accessibility, security) but did not fit any axis. The agent added
the plan to the collection's future-plans table with a short
justification (*"cross-cutting infrastructure rather than
axis-specific telemetry"*) and continued. The user asked: *"do we
need to call out the existence of cross-axis concerns explicitly?"*
The answer turned out to be yes — the justification was
load-bearing but unrecorded. The next agent reading the table would
either force-fit the plan into one axis (already happening with a
sibling plan) or miss it entirely.

The pattern: when an agent finds itself writing prose to *justify*
a structural exception, the categorisation system has a missing
category. The exception is not unusual. The justification is
the signal that the structure has not caught up to the shape of the
work.

The companion failure mode is treating the noticed friction as a
private bookkeeping concern — a small "this needs an explanation"
feeling that the agent absorbs and resolves through prose rather
than escalating as a structural finding.

## Decision

**Friction at the moment of justifying a structural exception is a
structural finding, not a bookkeeping detail. The agent must
escalate it immediately as evidence that the categorisation system
is incomplete — by surfacing the gap to the owner or by capturing it
as a candidate convention/rule/PDR — rather than absorbing it
through prose.**

The discipline has three concrete moves:

1. **Notice and name.** When the agent reaches for prose to explain
   why something lives where it lives, that's the signal. Stop and
   name what is being justified.
2. **Decide whether to escalate or absorb.** If the justification is
   load-bearing (next reader needs the same insight to make sense
   of the artefact), it must be captured as a structural change to
   the categorisation system: a new category, a new convention, a
   new rule, or a recorded exception. If the justification is
   genuinely small (a one-off note that does not recur), absorb
   it locally and continue.
3. **Capture the structural change in a durable home.** A new
   axis/category in the same artefact; a new convention component
   under `templates/components/`; a new rule under `.agent/rules/`;
   or a candidate PDR/ADR depending on scope. The "where" is
   determined by the substance shape (per the consolidate-docs
   §7a graduation flow); the "must" is determined by this PDR.

## Consequences

- **Plans, ADRs, type unions, lint categories, governance taxonomies
  all benefit equally.** The principle is domain-agnostic. Specific
  applications (e.g. PDR-037 substrate-vs-axis-plan-categorisation
  applies the principle to multi-axis plan collections) are
  worked instances rather than separate principles.
- **Reviewers and consolidations gain a new question to ask.** When
  a plan body, ADR, or rule contains paragraph-shaped justifications
  for structural choices, the reviewer/consolidation should treat
  those paragraphs as candidates for category extraction.
- **Closure of the corrective loop is fast.** The cost of stopping
  to name a missing category is small. The cost of leaving it
  tacit compounds with every future artefact that hits the same
  edge.

## Implementation Notes

The principle does not require a new validator; it requires a new
*habit*. Reviewer agents and consolidation passes can include the
question *"are any structural choices justified by prose rather
than category?"* as part of their walk.

When the friction-as-signal is noticed but the categorisation
change is not yet obvious, capture the friction itself as a
candidate in the Pending-Graduations Register with explicit framing
(e.g. *"axis A1 in collection C wants justification — investigate
whether C has a missing axis"*). The candidate trigger is owner
direction OR second instance of the same friction.

## Compliance Triggers

- A plan / ADR / rule body contains a paragraph that begins with a
  structural-exception phrasing ("this doesn't fit any of...",
  "rather than...", "an exception is needed because...") — review
  whether the categorisation needs extending.
- A reviewer agent finds a paragraph-shaped justification and the
  load-bearing test fires (next reader needs the same insight) —
  surface as a categorisation finding.

## Worked Instance

[PDR-037 Substrate-vs-Axis Plan Categorisation](PDR-037-substrate-vs-axis-plan-categorisation.md)
applies this principle to multi-axis plan collections. The substrate
axis was the missing category; Vining's justification prose was
the signal.

## Amendment Log

None yet.
