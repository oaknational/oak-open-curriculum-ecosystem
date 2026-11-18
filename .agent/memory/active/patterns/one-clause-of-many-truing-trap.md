---
name: The One-Clause-of-Many Truing Trap
polarity: anti-pattern
use_this_when: About to true a stale fact that lives inside a large record (a table cell, a multi-sentence paragraph, an identity column) — before declaring the truing done, check whether the old state is asserted anywhere else in the same record
category: process
layer: general
proven_in: .agent/memory/active/napkin.md (two rounds, 2026-07-08)
proven_date: 2026-07-08
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Truing one sentence inside a large record and declaring the fact corrected, while an earlier clause in the same cell or a trailing identity column still asserts the old state"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not
> a shape to repeat. Recognising a large-record truing as a whole-record
> operation, not a sentence-level edit, is the first move in not repeating
> it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

A large record — a continuity table's cell, a thread-record identity row, a
multi-clause status paragraph — reads to a human as one fact, but is often
authored as several independent sentences accreted over time. When a fact
inside it changes, editing only the sentence a review finding quoted leaves
every *other* sentence in the same cell or row that also asserted the old
state untouched. A cell or row is one record, not a bag of independently
truable sentences.

## Worked Instance (2026-07-08, two rounds)

Truing a stale state inside a large table cell, editing only the sentence a
review finding had quoted, left stale in **round 1** an earlier clause in the
same cell, and in **round 2** the trailing identity column still asserting
the old state. The fact was only fully corrected on the third pass, after
grepping the whole artefact for every assertion of the old state (`is OPEN`,
`still to reply/resolve`).

## Countermeasure

When a fact changes inside a large record, **grep the WHOLE artefact for
every assertion of the old state** before declaring the truing done — every
string the old state could plausibly have been rendered as (a status word, a
SHA, an "OPEN"/"unresolved" phrase) — not just the one sentence a finding
pointed at. Treat the record as one unit that must agree with itself
end-to-end, never as independent sentences to patch one at a time.
