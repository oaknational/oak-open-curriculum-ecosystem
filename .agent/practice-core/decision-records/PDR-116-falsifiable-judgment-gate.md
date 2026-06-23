---
pdr_kind: pattern
---

# PDR-116: Falsifiable-Judgment Gate — Anchor a Judgment to Its Source, Not to Taste

**Status**: Accepted
**Date**: 2026-06-23
**Related**:
[PDR-113](PDR-113-source-intent-from-the-principal-not-the-records.md) (verify against the
source, not a projection — this pattern is its gate-design form);
the `verify-dont-trust` rule (a sweep/verdict is a claim whose filters must be audited — a
judgment is the same shape);
[PDR-046](PDR-046-layered-knowledge-processing.md).

## Context

A quality gate, review, or completeness check often has a **judgment-heavy arm** — "does X
plausibly achieve Y?", "have all the consumers been found?", "is this no-loss?". Where a gate's
conformance/traceability arms have concrete mechanisms, the judgment arm is the **theatre-risk
locus**: it can pass by hand-waving or by sampling, because the verdict rests on the reviewer's
taste rather than on anything the source can refute.

Two instances make the general shape visible:

1. **Substance-gate effectiveness arm** (2026-06-21): a gate's "does this achieve the intent?"
   arm passed by plausible narration, with no mechanism forcing the reviewer to check every
   dimension the intent's source visibly contains.
2. **Grep-gate over an enumerated list** (2026-06-23): a specialist handed an enumerated file
   list to reconcile; a first-hand grep caught a live member the list (a *sample*) missed. The
   list rested on the specialist's coverage; the grep rested on the source.

Both share one failure: a judgment whose completeness rests on the judge, where the source could
have refuted it.

## Decision

When a gate or review has a judgment-heavy arm, make the judgment **falsifiable against its
source**: decompose it against a fixed set of dimensions (or a generated/enumerated set) that the
**source visibly contains**, so under-decomposition is detectable *by the source*, not by the
reviewer's taste. The verdict is unrenderable without the source-anchored coverage × soundness
map.

- Replace a **sampled** check (a hand-picked list, a spot-check) with a **generated** one (grep,
  import graph, schema inventory, source enumeration): the list is a sample; the gate is the
  invariant.
- Replace a **holistic** "it plausibly achieves Y" with a **decomposed** "Y's source names
  dimensions {a, b, c}; here is coverage and soundness for each": the decomposition is fixed by
  the source, not chosen by the reviewer.

## Consequences

- A judgment that omits a source-visible dimension fails visibly, instead of passing on narration.
- The gate's output carries the source-anchored map, so a later reader can re-check the
  decomposition against the source rather than trusting the verdict.
- This composes with `verify-dont-trust`: a sampled list and a holistic verdict are both
  claim-shaped artefacts whose basis (sample vs source) must be audited before they are trusted.

## Enables

Settles the PG-1 pending-graduation. Applies to any gate/review with a "does X achieve Y" or
"have all members been found" arm — substance gates, completeness checks, no-loss audits,
readiness reviews. The instance evidence stays in the napkin archive and the `verify-dont-trust`
worked instances; this PDR is the synthesised general form.
