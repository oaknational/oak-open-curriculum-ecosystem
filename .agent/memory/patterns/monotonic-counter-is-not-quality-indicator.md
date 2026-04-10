---
name: "Monotonic Counter Is Not a Quality Indicator"
use_this_when: "Comparing two versions of a document or artefact that each carry a sequence counter"
category: process
proven_in: ".agent/practice-core/provenance.yml"
proven_date: 2026-04-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Higher-indexed incoming material dismissed as stale without content comparison"
  stable: true
---

## Principle

A monotonic counter (provenance index, version number, sequence ID)
tracks temporal position in a chain, not completeness or quality
across dimensions. Two artefacts at the same index, or even at
different indices, may have evolved different capabilities
independently. Always compare content, not counters.

## Pattern

1. Treat the counter as metadata about when, not about how good.
2. Compare bidirectionally: the incoming may be behind in some
   areas and ahead in others.
3. Evaluate each section or capability on merit — wording quality,
   structural improvements, vocabulary additions — independent of
   the counter value.
4. Record what was adopted and what was kept, with rationale.

## Anti-pattern

- Seeing index 17 > index 10 and concluding "we are ahead."
- Deleting incoming material because "our version is newer."
- Treating a single scalar as a multi-dimensional quality measure.

## When to Apply

Any scenario involving versioned artefacts from independent
evolution paths: Practice Core transfers, schema migrations,
configuration drift between environments, document versions
across forks.
