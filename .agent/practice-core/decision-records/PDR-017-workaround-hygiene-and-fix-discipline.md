---
pdr_kind: governance
---

# PDR-017: Workaround Hygiene and Fix-at-Source Discipline

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(grounded fix decisions require grounded diagnosis);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(workaround justifications that sound plausible but lack evidence
are findings that route per PDR-012).

## Context

Workarounds are pervasive in real systems: the upstream contract is
inconvenient, the library has a bug, the integration has an edge
case. Well-placed workarounds are legitimate engineering responses.
Three failure modes emerge when workaround discipline is loose:

1. **Fixes applied at the consumer when the producer is wrong**.
   Multiple attempts to work around a type error, a null return,
   or a missing field fail at the consumer; each attempt adds
   complexity; the root cause is that the producer's type or
   function signature is wrong. The consumer-side fixes accumulate
   without resolving the underlying problem.

2. **Workaround removal conditions documented but never
   re-evaluated**. A workaround is added with a comment naming its
   removal condition ("remove when library X ships version Y").
   Version Y ships; nobody checks; the workaround persists
   indefinitely. Removal conditions without a check mechanism are
   ornamental.

3. **Workaround debt rationalised rather than addressed**. A
   workaround exists. Someone asks why. The answer invokes
   "different purposes" or "separate concerns" or "legacy
   decisions" — language that sounds explanatory but is post-hoc
   rationalisation. The rationalisation makes the workaround feel
   justified; meanwhile the underlying pressure that created it
   compounds into a second workaround, a third, and eventually
   a debt surface that dominates the architecture.

Underlying cause: workarounds are local convenience; fixing the
root cause is distant effort. The local incentive always favours
the workaround; discipline is what pushes the other way.

## Decision

**Fix at the source, not at the consumer. Removal conditions on
workarounds have a check mechanism or they do not exist. A
rationalisation for a workaround that invokes "different purposes"
or "separate concerns" is a signal that the workaround is
compounding debt, not resolving it.**

### Fix at source

When multiple workaround attempts fail at the consumer, the
workaround is the wrong intervention. The failure signals that the
producer is wrong — the type is wrong, the function returns the
wrong shape, the contract excludes the case. The fix belongs at the
producer, not at the consumer.

Diagnostic signals that the fix belongs at the source:

- Two or more attempts at consumer-side workaround have failed or
  added complexity without resolving the underlying issue.
- The consumer's code is explaining the producer's behaviour
  repeatedly — inline comments, wrapper functions, defensive
  null-checks.
- The producer's contract is narrower than the real behaviour, or
  the real behaviour is narrower than the contract.
- Multiple consumers independently work around the same producer
  issue.

When any of these apply, the workaround in the consumer should be
reverted and the fix applied at the producer.

### Removal conditions require check mechanisms

A workaround with a documented removal condition is only legitimate
if the condition is **checkable**. A checkable condition has:

- A **named artefact** whose state determines whether the condition
  has triggered (an upstream version, a config value, a feature
  flag, a test pass).
- A **check point** in the repo's workflow where the condition is
  re-evaluated (a quarterly dependency review, a consolidation
  step, a test that fails when the condition holds).

Without a check mechanism, the condition is ornamental — written
once, never consulted, never triggered. The workaround persists
indefinitely regardless of whether its cause was resolved.

### Recognise rationalisation

When a workaround exists and the explanation invokes:

- "Different purposes" without naming the purposes
- "Separate concerns" without naming the separation
- "Legacy decision" without naming the decision's origin or the
  constraint that made it necessary
- "We don't have time to fix it properly" for more than one
  cycle

…the explanation is post-hoc rationalisation, not causal
explanation. The workaround is compounding debt; the
rationalisation is making the debt feel acceptable. Recognise
the rationalisation and route it per PDR-012: ACTIONED (fix
now), TO-ACTION (named lane with the real fix and a promotion
trigger), or REJECTED (explicit rationale citing the principle
being upheld — e.g. "we accept this coupling to avoid coupling Y").

### The rationalisation test

Before adding a new workaround, the author writes the one-sentence
reason **without invoking** rationalisation vocabulary. If the
reason cannot be written in concrete terms ("the upstream API
returns null for X; we handle that here"), the workaround is not
well-understood and should not be added yet.

## Rationale

**Why fix at source.** Consumer-side workarounds multiply: each
consumer of the problematic producer re-derives its own workaround,
producing N implementations of the same mitigation with no shared
fix. Producer-side fixes apply once. The economics always favour
fixing at source when the producer is genuinely wrong.

**Why removal conditions need checks.** Without a check, the
condition is documentation without feedback. Documentation without
feedback decays. Checks turn the condition into a mechanism that
can actually fire — which turns the workaround from permanent into
temporary.

**Why rationalisation is a signal.** Rationalisation vocabulary
("different purposes", "separate concerns") is information-free: it
does not name a specific constraint or cost. Real engineering
reasons are specific ("coupling X avoids reentering the event loop
on Y", "the legacy endpoint requires this shape until its sunset
date of 2026-09-01"). When explanation reaches for
information-free vocabulary, the real reason is either absent
(the workaround compounds debt) or hidden (the real reason is
something the author prefers not to state).

Alternatives rejected:

- **Fix at consumer because it's faster.** Fast locally; produces
  N workarounds for one problem; fragments the system.
- **Removal conditions in comments are sufficient.** Never get
  checked; workaround persists.
- **Accept rationalisations as reasons.** Permits compounding
  debt under a veneer of acceptability.

## Consequences

### Required

- When two consumer-side workaround attempts fail, the next attempt
  is at the producer (or explicit rejection of the producer-side
  fix with written rationale).
- Workarounds with removal conditions have a named check mechanism
  (a test, a review, a scheduled re-evaluation).
- Workaround justifications use concrete vocabulary (named
  constraints, specific costs, measurable outcomes). Rationalisation
  vocabulary ("different purposes", "separate concerns") is a
  finding.
- Workaround debt accumulating in an area is named and routed per
  PDR-012 rather than re-explained.

### Forbidden

- Third consumer-side workaround attempt on the same producer issue
  without a producer-side fix being considered.
- Removal conditions in comments without a check mechanism.
- Workaround justifications that invoke rationalisation vocabulary
  as the explanation.

### Accepted cost

- Producer-side fixes are more effort than consumer-side
  workarounds in the short term. Justified by long-term multiplier
  of avoided consumer-side proliferation.
- Writing concrete workaround justifications takes more effort than
  reaching for familiar rationalisation vocabulary. Justified by
  detecting debt before it compounds.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-017`:

- `.agent/memory/patterns/fix-at-source-not-consumer.md` — originated
  from multiple-consumer workaround attempts failing until the
  producer's type was corrected.
- `.agent/memory/patterns/re-evaluate-removal-conditions.md` —
  originated from workarounds whose removal conditions had been
  met but never re-evaluated.
- `.agent/memory/patterns/workaround-debt-compounds-through-rationalisation.md`
  — originated from discovered rationalisation vocabulary
  ("different purposes") covering a coupling that had in fact
  become a debt surface.
