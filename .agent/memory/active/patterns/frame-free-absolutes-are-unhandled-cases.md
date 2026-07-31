---
name: Frame-Free Absolutes Are Unhandled Cases
polarity: anti-pattern
use_this_when: "Authoring or citing any categorical statement in doctrine, tickets, TSDoc, or review dispositions — 'all', 'never', 'without exception', 'the only sound shape' — and whenever a review loop keeps generating findings against categorical estate text"
category: process
status: emerging
discovered: 2026-07-29
proven_in: >-
  Four instances in one review window (napkin 2026-07-29 ~10:30Z, Raccoon
  turns Nocturne): "integration tests trigger no IO" (true while supertest was
  classified E2E; falsified by the boundary re-ruling); "supertest is E2E"
  (true under the tool reading, wrong under the boundary reading); ADR-078's
  "prohibited in all tests without exception" (contradicted twenty-seven
  lines later by its own smoke exception); MCP-269's F4 "static config is the
  only sound shape" (evaluated header-as-trust designs, cited against
  bounded-selection where it did not generalise). Independent corroboration
  the same week: every universal quantifier in a plan text died at a
  code-visible corner during a reviewer arc, and the claim that survived was
  the one that named its exceptions (Osprey spins Vortex, 2026-07-24).
proven_date: 2026-07-29
adjacent: >-
  The no-hedging-vocabulary rule is the complement, not the tension: the cure
  is NOT hedging. frozen-text-false-authority covers a recorded frame
  outliving its ratification; this pattern covers text whose frame was never
  recorded at all. verify-dont-trust §"Claims Crossing Boundaries" carries
  the transmission-side frame-carriage clause.
---

# Frame-Free Absolutes Are Unhandled Cases

A statement true **within a frame**, recorded **without** the frame, is later
cited at full authority outside it — and every citation is individually
reasonable, because nothing in the text marks the boundary. This is a type
problem, not a style problem: the absolute has an unhandled case exactly the
way a throwing function has one.

The cure is not hedging — hedging is banned here and would be worse, because
a hedge weakens the rule inside its domain without marking the domain. What
cured all four proving instances was restating each absolute **on its
discriminating axis**: not "no IO" but "no IO beyond the loopback harness
exchange"; not "supertest is E2E" but "classification follows the boundary".
The absolute stays absolute; its domain becomes explicit. Same move as
`Result<T, E>` over throwing — stating the axis makes the rule total over a
named domain.

Authoring discipline: hunt your own "every", "all", "never", "regardless",
and "without exception" before a reviewer does; the strong-sounding claim is
the weak one, and the claim that survives review is the one that names its
exceptions. Review discipline: when findings keep arriving against
categorical estate text, the generator is usually one frame-free absolute
being falsified from different angles — restate it on its axis instead of
absorbing findings forever.

## Falsifiers

- If a rule restated on its axis is still cited outside that axis, the axis
  was not the discriminator — find the real one.
- If axis-restatement lengthens rules without changing any review outcome,
  it is cosmetic; stop.
