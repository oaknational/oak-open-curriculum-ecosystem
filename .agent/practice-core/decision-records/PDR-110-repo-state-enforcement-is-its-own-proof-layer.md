---
pdr_kind: governance
---

# PDR-110: Repo-State Enforcement Is Its Own Proof Layer

**Status**: Accepted
**Date**: 2026-06-21
**Adopted**: 2026-06-21
**Related**:
[PDR-101](PDR-101-graduation-requires-quorum.md)
(repo-state checks are how some graduated doctrine is mechanically enforced — the
proof layer this PDR distinguishes is where that enforcement is itself proven).

## Context

A Practice-bearing repo proves two different kinds of claim. **Behaviour claims**
— "this function returns the right value", "this flow handles the error" — are
proven by behaviour tests that exercise product code. **Repo-state claims** —
"every canonical rule has a platform adapter", "no doctrine surface links to an
ephemeral one", "the bridge truthfully reflects the installed estate" — are
claims about the *shape of the repository itself*, not about runtime behaviour.

The tempting move is to collapse the second kind into the first: to treat a
repo-audit validator as just another test, or to write the validator and assume
it works because it runs clean. Both lose something. A behaviour test and a
repo-state audit answer different questions, and an audit that has never been
seen to *fail* is not known to detect anything.

## Decision

**Repo-state enforcement is its own proof layer, distinct from behaviour
testing — do not collapse the two.** Behaviour tests prove product code does the
right thing; repo-audit validators prove the repository is in the right shape.
They have different subjects, different failure signatures, and different homes;
conflating them weakens both.

**RED-first applies to repo-state enforcement as strictly as it applies to
behaviour.** Before trusting a repo-state validator, prove the failure first:
construct (or observe) the broken-shape state, watch the validator fail on it,
*then* fix the infrastructure and watch it pass. A validator that has only ever
been observed passing is an unproven claim — it may be inspecting the wrong thing,
or nothing at all. The failing observation is what makes the green meaningful.

## Consequences

- Repo-state validators are designed and reviewed as a first-class proof layer,
  not smuggled in as behaviour tests or trusted on first green.
- Every repo-state validator ships with evidence that it fails on the state it
  claims to detect — a probe, a fixture, or a recorded observation — so its green
  result is load-bearing.
- The two layers stay legible: a reader can tell whether a given check proves
  runtime behaviour or repository shape, and route a new check to the right home.
- This guards against the most dangerous repo-audit failure: a validator that
  passes because it inspects nothing, giving false confidence that the estate is
  sound.
