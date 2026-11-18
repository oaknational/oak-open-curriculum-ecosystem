---
name: state-the-property-not-the-mechanism
polarity: pattern
category: process
layer: general
use_this_when: "Writing a plan row, a ledger row or a routing note that a verifier, a probe or a gate must satisfy, when the next reviewer will look for a way round it."
proven_in: >-
  The Codex dialogues probe, 2026-09-23 (Blazar lifts Corona, b65a9a): four review rounds on
  one pull request each found a new bypass in a security-critical verifier specified in plan
  prose (the exit code, the missing item, the substring, extra executions); moving the mechanics
  into a ledger row that still prescribed a mechanism drew a fifth; rewriting the row to state
  the property to be established, failing closed where it cannot be, ended the loop. One lane,
  one arc: an observation with a cure that held.
proven_date: 2026-09-23
related_pattern: enforce-via-schema-not-prose-for-vendor-surfaces
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A verifier described as one mechanism invites the next bypass each round; a property, failed closed, covers the next variant."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# State the property, not the mechanism

A routing row, a plan clause or a ledger row for a verifier states the property
the verifier must establish, and says it fails closed where the property cannot
be established. It does not name the one mechanism that establishes it today. A
mechanism named in prose is a target: each review round finds the case the
mechanism misses, the cure names a second mechanism, and the loop has no end. A
property covers the next variant without a new sentence.

The companion question, asked before the first round: why does the proof route
through the party whose behaviour it bounds? A verifier that asks the verified
party to count its own acts is answering a threat model nobody wrote down; state
the threat model first, then the property.
