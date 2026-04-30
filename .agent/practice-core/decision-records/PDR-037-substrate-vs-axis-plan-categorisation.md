---
pdr_kind: governance
---

# PDR-037: Substrate-vs-Axis Plan Categorisation for Multi-Axis Collections

**Status**: Accepted
**Date**: 2026-04-30
**Related**:
[PDR-036](PDR-036-friction-as-structural-finding.md)
(generative principle — invent-justification is the signal that
the categorisation is incomplete; this PDR is a worked instance
in the planning domain);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — plans are load-bearing artefacts that
encode world-state at authoring time; categorisation drift is a
named risk);
[PDR-007](PDR-007-three-destinations-for-graduation.md)
(three destinations for graduation — pattern vs PDR vs governance
home; this PDR is governance applied to plan collections, not a
pattern).

## Context

Plan collections in the Practice are organised along their
collection-defining axes — the observability collection has a
five-axis frame (engineering, product, usability, accessibility,
security); a security collection might be organised by
trust-boundary × layer; a semantic-search collection by signal ×
algorithm. The axis frame becomes the navigation surface: a
five-or-N-axis coverage table sits at the top of the high-level
plan, and inventory tables run alongside.

Empirical instance (2026-04-30, observability collection on
`fix/sentry-identity-from-env`): a new strategic plan
(`observability-config-coherence.plan.md`) served all five axes —
its config-coherence work fed engineering telemetry, product
analytics, accessibility traces, security audit, and usability
diagnostics simultaneously — without shipping any axis-specific
output. Forcing it into one axis was misleading; leaving it out of
the axis table made it invisible to axis-by-axis scanning. A
sibling plan (`multi-sink-vendor-independence-conformance.plan.md`)
had the same shape and had been shoehorned under Engineering.

The categorisation system was missing a category. The friction was
the writing-justification-prose signal named in
[PDR-036](PDR-036-friction-as-structural-finding.md).

## Decision

**Multi-axis plan collections must distinguish two structurally
different kinds of plan:**

- **Axis-shipping plans** ship at least one named output on at
  least one of the collection's axes. They are the visible
  product of the collection (telemetry, signals, decisions,
  capabilities).
- **Substrate plans** enable axis-shipping work without themselves
  shipping any axis output. Removing one would not lose any axis
  signal directly, but every axis-shipping plan would have to
  re-derive the same infrastructure.

The two kinds need different inventory treatment, different review
lenses, and different promotion criteria. Conflating them forces
substrate plans into a single axis (misleading) or hides them from
axis-by-axis scanning (invisible).

The reusable shape is captured as the
[`substrate-vs-axis-plans` plan-collection component](../../plans/templates/components/substrate-vs-axis-plans.md).
That component is the canonical artefact; this PDR records why the
component exists and gives it Practice-governance authority across
repos.

## Consequences

- **Multi-axis collections gain an explicit `### Substrate
  (cross-axis infrastructure)` section** in their high-level plan
  inventory. Each substrate plan keeps its canonical lifecycle entry
  in the collection's existing tables; the substrate section is an
  index, not a duplicate.
- **Promotion criteria differ.** Axis-shipping plans promote when
  their axis output is needed for a workstream. Substrate plans
  promote when an axis-shipping plan would otherwise re-derive the
  substrate infrastructure for the second time.
- **Review lenses differ.** Substrate plans are reviewed for
  cross-cutting impact (every axis-shipping plan benefits/depends);
  axis-shipping plans are reviewed for axis correctness.
- **Single-substrate edge case.** If only one substrate plan exists,
  no section is needed yet; note its substrate role in its own plan
  body and revisit when a second appears.

## Implementation Notes

A multi-axis collection is one whose primary navigation surface is
the axis frame (typically a five-or-N-axis coverage table at the
top of the collection's high-level plan). Single-axis or
chronologically-organised collections do not apply this PDR.

Cross-reference for the canonical shape and worked example:

- Component file: `.agent/plans/templates/components/substrate-vs-axis-plans.md`
- First applied instance: `.agent/plans/observability/high-level-observability-plan.md § Substrate`
- ADR-162 history entry records the closure-property bridge between
  the convention and architectural decision records.

## Compliance Triggers

- A plan in a multi-axis collection serves all axes simultaneously
  without shipping any axis-specific output → categorise as
  substrate.
- A plan body contains the phrase "cross-cutting infrastructure"
  or "rather than axis-specific" or similar → check whether the
  collection has a substrate section yet.
- A second plan with the same shape appears in the same
  collection → trigger the §Substrate section if not already
  present.

## Amendment Log

None yet.
