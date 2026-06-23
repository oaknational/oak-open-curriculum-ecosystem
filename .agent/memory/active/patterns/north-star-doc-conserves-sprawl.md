---
name: "A North-Star Doc Conserves Sprawl Instead of Delegating"
polarity: anti-pattern
use_this_when: "Authoring or raising the standard of a vision, charter, strategy, or other north-star document whose job is to orient, not to explain everything."
category: process
proven_in: "2026-06-17 vision rewrite (Ocelot binds Curfew): the first 'up to standard' pass kept the old doc's kitchen-sink shape; the owner: 'it is not a vision, it is a meandering set of explanations and commitments.' The knowledge-preservation instinct conserved the sprawl."
proven_date: 2026-06-18
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A north-star doc accretes explanations and commitments that belong elsewhere because the knowledge-preservation instinct conserves them inline; it becomes a meandering catch-all instead of an orienting surface that delegates outward."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** A failure mode to avoid. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A North-Star Doc Conserves Sprawl Instead of Delegating

A vision / charter / strategy / north-star doc orients: it states what is changing, why it
matters, and a map to the documents that explain *how*. It **delegates** explanations and
commitments outward. The recurring failure is the opposite drift — the doc accretes every
explanation and commitment inline, because the knowledge-preservation instinct conserves
sprawl rather than routing it to its proper home.

## Anti-pattern

Raising the standard of a north-star doc by *keeping* its kitchen-sink shape — every
rationale, every commitment, every explanation preserved in place. Each retention feels
like conservation (don't lose the content), but the aggregate is a meandering catch-all
that no longer orients. The exact wording of *what* the doc must contain is the owner's
genre-shaping call; this anti-pattern is only about the **sprawl-conserving drift**, not a
prescription for the genre.

## The cure

Screen each section against the doc's orienting job: does it state the change / why, or does
it restate a commitment or explanation that belongs in strategy / a README / an ADR / a
plan? Route the latter to its home (extract-and-archive, not banner-and-keep) and leave a
map. Knowledge-preservation is satisfied by *homing* the content, not by conserving it inline.

## Related

- [`delivering-a-reframing-is-a-consumer-walk.md`](delivering-a-reframing-is-a-consumer-walk.md)
  — the delivery technique once content is routed out (extract-and-archive; partition live/historical).
- [`substance-before-fitness.md`](substance-before-fitness.md) — knowledge-preservation is homing
  at the right weight, not conserving everything in one place.
- [`fluency-is-a-failure-vector.md`](fluency-is-a-failure-vector.md) — "keep it, don't lose it" is
  the fluent conservation move that produces the sprawl.
