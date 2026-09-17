---
name: Red-First Test With a Wrong Oracle
polarity: anti-pattern
use_this_when: Writing a red-first test for a cure, reviewing one, or trusting a green cure-test as evidence the cure works — especially when the test's input model came from the same belief that produced the defect
category: testing
proven_in: .agent/memory/active/napkin.md 2026-08-06 ~20:05Z entry (the #790 S3 cure specimen; third dated instance of the class in two days per that entry)
proven_date: 2026-08-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A cure and its red-first test sharing one wrong belief about what the system actually delivers, so the test pins an input the system cannot produce and stays green over a silently wrong cure"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is a red-first test whose oracle
> — its model of the input the real system delivers — comes from the same wrong
> belief as the code it tests, so red-first discipline is satisfied while the
> test proves nothing about reality.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

Red-first discipline proves a test CAN fail — against the author's model of the
input. When the cure and the test share one wrong belief about what the system
actually delivers, the test goes red, the cure lands, the test goes green, and
the whole chain is internally consistent while watching an input that cannot
occur. The specimen: a githooks(5) cure and its green test both believed
bare-URL pushes deliver an empty remote name (reality: the URL itself), so the
detector watched exactly the range shape that is NOT the degraded case — an
~836× silent over-scan (measured 5,016 vs 6 commits) survived a red-first test
because the test pinned an input git cannot produce. Third dated instance of the
class in two days at the source window.

## Cure

**Oracle independence**: the test's input model must come from an instrument
independent of the belief under test — the vendor's document read first-hand,
or better, the real system exercised (a probe hook echoing its actual `$1`; a
real invocation captured). The instrument that kept working across all three
instances was the **evidence-running reviewer**: a review pass that executes
real-system probes rather than reading the test's internal consistency. A
reviewer who checks that the test is red-first, well-shaped, and matches the
cure is checking the shared belief against itself.

The authoring-time question: *where did the test's expected input come from?*
If the answer is "the same reasoning that produced the cure", the test needs a
real-system capture before it counts as evidence.

## Composition

- [`testing-strategy`](../../../directives/testing-strategy.md) §Prove
  behaviour — the umbrella; this pattern is the failure mode red-first
  discipline alone does not reach.
- [`verify-dont-trust`](../../../rules/verify-dont-trust.md) §Name the
  Instrument — the test IS an instrument; this pattern is instrument-naming
  applied to the test's own oracle.
