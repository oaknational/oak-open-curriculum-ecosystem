---
name: "Validate a Sampled Schema Against the Complete Corpus"
polarity: pattern
use_this_when: "A type, union, schema, or universal claim was derived from a SAMPLE of the data it describes — and you are about to trust it for the whole corpus (build on it, verify with it, or assert it)."
category: code
layer: general
proven_in: "curriculum-hub-demo 2026-07-01: the Block union, built from a content subset during the spine, missed 5 real fields; the generator's `: Course` typed-literal annotation over the full 214-block extraction surfaced all 5 at compile time (scripts/course-extract.ts + lib/course/oak-course.generated.ts). Second instance 2026-07-02, one layer up in VERIFICATION: a workflow verifier CONFIRMED 'the token package carries the same values' from two sampled anchors; the corpus-complete check found 3 of 20 values present."
proven_date: 2026-07-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A schema inferred from samples reads as complete because every sampled item fits it; the gaps are invisible until the whole corpus is type-checked at once. The same fallacy recurs in verification: a universal claim ('carries the values', 'all items conform') spot-checked on anchors confirms fluently and wrongly."
  stable: true
---

# Validate a Sampled Schema Against the Complete Corpus

> **POLARITY: PATTERN.** This is a shape to repeat: a compile-time (or
> equivalent mechanical) gate over the COMPLETE dataset is the falsifier
> that subset review cannot be.

## The shape

1. A schema/type/union is drafted from the data available at design time —
   inevitably a sample.
2. Before the schema is trusted, run the **whole corpus** through a
   mechanical check against it. The cheapest strong form in TypeScript: a
   generator emits the full dataset as a typed literal (`const course:
   Course = …`) so `tsc` itself is the corpus-complete validator. A zod
   `strictObject` parse over every record at generation time is the
   schema-first equivalent (both belts landed in the demo's
   content-is-data redesign, 2026-07-02).
3. The same discipline applies to **universal claims in verification**: a
   confirm-verdict on "X holds for all items" needs a corpus-complete
   check, not sampled anchors. Two anchors confirming is fluent evidence,
   not sufficient evidence.

## Why it works

Every sampled item fits the sampled schema by construction — the schema
cannot fail on the data that produced it. Only the unsampled remainder
can falsify it, so the check must cover the remainder. A compiler or
strict parser does this exhaustively and for free once wired; a human
subset review structurally cannot.

## Worked instances

- Block union: 5 additive gaps (title-less callout, callout `attrib`,
  flip `frontImage`, optional accordion `chip`/`badge`, accordion `img`)
  found ONLY by the full-corpus `: Course` gate.
- Verification variant: "palette carries the same values" confirmed from
  2 anchors, refuted by the 20-value corpus check (3/20 present).

## Related

- `verify-own-explanations-against-full-source` (user-memory) — the
  behavioural sibling.
- ADR-038 compile-time revolution; `strict-validation-at-boundary`.
