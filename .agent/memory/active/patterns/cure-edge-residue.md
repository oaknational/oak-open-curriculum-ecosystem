---
name: Cure-Edge Residue
polarity: anti-pattern
use_this_when: Curing any finding on an invariant the estate states in more than one place, or executing a deletion cure whose disposition claims the content was re-homed
category: agent
proven_in: .agent/memory/active/napkin.md 2026-08-06 wrap captures (Saffron guards Hedgerow, round-2 structural diagnosis, Director-endorsed)
proven_date: 2026-08-06
related_pattern: eager-rounding-off-on-partial-structures
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Point-instance cures on multiply-stated invariants spawning the next review round's findings — uncured sibling statements, cured contracts whose intersection stays open, and deletion cures whose pointer-claimed re-homing never landed"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is curing the one statement of
> an invariant a finding pointed at, while the invariant's sibling statements —
> and the intersections between separately-cured contracts — stay uncured.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

An estate states load-bearing invariants in more than one place — a rule, a
skill's restatement, a reference doc's summary, a contract's mirror in a second
contract. A review finding points at ONE statement; the cure edits that one
statement; the review closes. The uncured siblings are now not merely stale —
they are **contradictions bearing the estate's authority**, and each becomes a
fresh finding for the next round. The measured instance: a 20-cure round spawned
at least 6 of the following round's 9 findings, in three shapes:

1. **Uncured sibling statements** — the invariant's other statements kept the
   pre-cure text.
2. **Cured contracts with an open intersection** — two contracts each cured
   separately, leaving the seam between them stating neither cure.
3. **Deletion cures whose pointer-claimed re-homing never landed** — content
   deleted with a disposition claiming "moved to X", where X never received it.

The generator is the finding's own frame: a finding names a location, so the
cure inherits location-scope, while the defect has invariant-scope.

## Cure

Two mechanical steps, adopted as standing discipline at the source window:

- **Grep-enumerate EVERY statement of a touched invariant before editing** — the
  cure's scope is the enumeration's result, not the finding's citation. A cure
  that edits fewer statements than the enumeration found must say why the
  remainder stand.
- **Verify EVERY pointer's landing after a deletion cure** — a disposition
  claiming re-homing is a claim; open the named home and confirm the content
  arrived before the round closes (the same move as `verify-dont-trust`'s
  compound-claim element check).

## Composition

- [`verify-dont-trust`](../../../rules/verify-dont-trust.md) — the
  element-by-element compound-claim discipline this pattern applies at cure
  time.
- `eager-rounding-off-on-partial-structures` — the same partial-structure
  generator one level down: the cure fills the visible part of the structure and
  infers the rest.
