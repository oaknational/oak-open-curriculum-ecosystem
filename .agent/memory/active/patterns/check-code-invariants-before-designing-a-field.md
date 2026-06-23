---
name: check-code-invariants-before-designing-a-field
use_this_when: "Adding a new field, enum, taxonomy, or discriminator to existing code — enumerate the invariants the surrounding code already maintains first, then choose the new shape's axis to preserve them (the invariant-safe axis is often non-obvious)."
polarity: pattern
category: architecture
status: emerging
discovered: 2026-06-09
proven_by: "EEF answerType taxonomy: the obvious single-strand-vs-explicit-set split would have broken the landed D4 overlap invariant (inspectStrand(id) === evidenceForMove({strandIds:[id]})). The invariant-safe axis turned out to be coverage (strand-lookup vs context-subset) — discoverable only by reading the invariant the code already holds before choosing the field's axis."
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Designing a new field, taxonomy, or enum on existing code along the intuitively-obvious axis, then discovering it violates an invariant the surrounding code already maintains — forcing a redesign after the shape is half-built."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Check the Invariants the Code Already Holds Before Designing a New Field

## Pattern

When adding a new field, taxonomy, enum, or discriminator to existing code, **enumerate
the invariants the surrounding code already maintains first**, then choose the new shape's
axis so it preserves them. The existing invariant is design input, discovered before the
field is drawn — not a constraint discovered after.

## Anti-pattern

The intuitive axis is chosen for the new field (e.g. "single strand vs explicit set"),
the shape is half-built, and only then does a test or a reviewer surface that it breaks an
invariant the code already relied on (e.g. an overlap identity between two lookups). The
field must be redrawn along a different axis — work that the up-front invariant read would
have avoided.

## Why it matters

A new field added to a settled module inherits all that module's invariants whether the
author looked at them or not. Choosing the axis from the *problem* (what distinction do I
want to express?) without first reading the *code* (what equalities/orderings/coverage
relations must still hold?) is how an "obvious" taxonomy turns out to be the wrong one. The
invariant-safe axis is often non-obvious (coverage rather than cardinality, in the EEF
case) and only the invariant read reveals it.

## When to apply

- Adding a discriminated-union variant, an enum member, or a classifying field to an
  existing schema or domain type.
- Extending a taxonomy that other code consumes.
- Any "new field on old code" change where the field participates in relations the existing
  code asserts.

## Adjacent

- [`verify-data-supports-shape-before-building`](../../../rules/verify-data-supports-shape-before-building.md)
  — verify the data supports the shape; this verifies the *code's invariants* support the axis.
- [[boundary-narrowing-for-schema-types]] — schema-driven shape discipline at boundaries.
