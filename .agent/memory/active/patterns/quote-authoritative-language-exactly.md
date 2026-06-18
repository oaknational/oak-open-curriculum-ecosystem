---
name: "Quote Authoritative Language Exactly"
polarity: anti-pattern
use_this_when: "Restating mission, vision, licence, owner-stated, or other protected / authoritative source language in a doc, summary, or prose passage."
category: process
proven_in: "2026-06-17 vision rewrite (Ocelot binds Curfew): paraphrasing Oak's mission 'supporting teachers to teach' -> 'helping teachers teach' for prose flow lost the teacher-as-agent precision and rephrased a protected source; the owner caught it."
proven_date: 2026-06-18
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Paraphrasing authoritative / mission / protected-source language for prose rhythm silently degrades its precision and rephrases a source that was not yours to rephrase."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A failure mode to avoid. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Quote Authoritative Language Exactly

When restating mission, vision, licence, owner-stated, or other protected / authoritative
language, **quote it verbatim.** Smoothing it for rhythm or flow is a degradation, not an
edit — the precise wording is load-bearing, and the source was not yours to rephrase.

## Anti-pattern

Paraphrasing authoritative language to make a passage read better: "supporting teachers
to teach" → "helping teachers teach" drops the teacher-as-agent precision *and* silently
rewrites a protected mission statement. The change feels like ordinary prose polishing; it
is a fidelity loss the author cannot feel, because the paraphrase reads fine on its own.

## The cure

Quote authoritative / mission / protected-source language exactly, in quotation marks,
with attribution. If a passage needs the meaning in your own words for flow, *add* your
gloss alongside the verbatim quote — never replace the quote with the gloss. When in
doubt whether a source is authoritative, treat it as authoritative and quote it.

## Related

- [`no-hedging-vocabulary`](../../../rules/no-hedging-vocabulary.md) — sibling discipline: specific
  wording carries load; this is its fidelity-of-quotation counterpart. (Candidate to graduate to a
  rule clause if a second instance recurs, per `new-rule-vs-pdr-clause`.)
- [`three-levels-of-reference-quality.md`](three-levels-of-reference-quality.md) — adjacent: that
  governs pointer quality; this governs quotation fidelity.
- [`fluency-is-a-failure-vector.md`](fluency-is-a-failure-vector.md) — "this reads better" is the
  fluent move that smooths the source.
