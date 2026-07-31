---
name: "Derive the View; Never Store the Copy"
polarity: pattern
use_this_when: "About to STORE a value that is computable from values already stored (a display token, a disambiguator, a denormalised label) — or reviewing a surface whose findings keep clustering on one stored field."
category: architecture
proven_in: "2026-07 visual-disambiguator token: storing it generated five reviewer waves' findings; render-time derivation as a pure function of prefix+id dissolved the entire class"
proven_date: 2026-07-31
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Storing a derivable value creates a second source of truth that drifts from its inputs; every consumer then needs reconciliation logic, and reviewers correctly flag each site — the stored copy is a finding GENERATOR."
  stable: true
---

> **POLARITY: PATTERN.** A value computable from stored inputs is derived
> at read/render time, as a pure function — never stored beside them.

## The shape

A stored copy of a derivable value is a second source of truth. It drifts:
the inputs change and the copy does not, or the copy is edited and the
inputs are not. Every consumer inherits the ambiguity, and every reviewer
correctly flags every site — one stored token generated five consecutive
reviewer waves' findings before the design moved.

The cure is structural, not reconciliation: derive the view at the moment
of use, as a pure function of the stored inputs (the worked instance:
`disambiguator = f(prefix, id)` computed at render). The stored copy, its
backfill, its sync logic, and its finding class all disappear together.

## The boundary

Caching a derivation for cost is fine when the cache is transparently
invalidated by its inputs (a build-hash leg, a content hash). The
anti-pattern is the copy that stands on its own with no binding to its
inputs — if a human or agent can edit it independently, it is a second
source of truth.
