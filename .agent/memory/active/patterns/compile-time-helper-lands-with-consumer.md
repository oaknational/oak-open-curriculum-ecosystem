---
name: "A Compile-Time-Only Helper Has No Standalone Runtime Test — Co-Land It With Its First Consumer"
polarity: pattern
use_this_when: "Authoring a helper whose entire value is a compile-time guarantee (exhaustiveness, type narrowing) and TDD pressure wants a standalone unit test for it before any consumer exists."
category: testing
proven_in: "assertNeverResult exhaustiveness helper, @oaknational/result WS0 + graph-core term-reconstruction WS4 — 2026-06-19 (Merlin spins Cirrus)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Forcing a standalone runtime test onto a helper whose only value is a compile-time property — which, in a repo that bans type assertions, can only be written by type-forging, producing a test that proves nothing."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: land the compile-time helper
> atomically with the consumer whose tsc gate + ok-path tests exercise the
> property. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A Compile-Time-Only Helper Has No Standalone Runtime Test — Co-Land It With Its First Consumer

## Principle

Some helpers exist purely to enforce a **compile-time** guarantee — an
exhaustiveness assertion, a type-narrowing utility — whose correctness is checked
by `tsc` at each use site, not by any runtime behaviour. Such a helper has **no
meaningful standalone runtime test**:

- There is no runtime behaviour to assert — the guarantee *is* "this does not
  compile if a case is missed."
- In a repo that bans type assertions, the only way to write a standalone test is
  to **type-forge** the input (e.g. `'x' as never`, a banned cast), producing a
  test that asserts on a fiction and proves nothing.

The atomic-landing invariant still holds — but the test that co-defines the
helper is the **consumer's** ok-path test plus the `tsc` gate, not a fabricated
unit test for the helper in isolation. So **land the helper atomically with its
first real consumer**, whose tests exercise the property at a genuine use site.

## Worked instance — 2026-06-19 (Merlin spins Cirrus)

`assertNeverResult` (an exhaustiveness helper in `@oaknational/result`) could not
get a standalone unit test: its correctness is a compile-time exhaustiveness
guarantee, and the repo's type-assertion ban makes any runtime test type-forge.
`type-expert` and `test-expert` both ruled: land it **atomically with** its first
consumer (graph-core term-reconstruction), whose ok-path tests + the tsc gate ARE
the test. The error-factory signature `(value: never, makeError: (s) => E) => E`
is itself forced by `noUnusedParameters` (the `never` parameter must be used) plus
the no-underscore-rename rule. The property propagates to ~100 downstream sites,
each checked by tsc — no standalone test could have covered them.

## Related

- [`tdd-as-design`](../../directives/tdd-as-design.md) / atomic-landing — the
  test and product code co-define one act of design; here the co-defining test
  lives at the consumer.
- [`foundations-before-consumers`](foundations-before-consumers.md) — the
  sequencing dual: foundations land first; a *compile-time-only* foundation lands
  *with* its first consumer because that is where its test lives.
- [`dont-test-sdk-internals`](dont-test-sdk-internals.md) — the same "don't
  fabricate a test for something with no behaviour to prove" discipline.
