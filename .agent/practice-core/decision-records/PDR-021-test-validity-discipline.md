---
pdr_kind: governance
---

# PDR-021: Test Validity Discipline — Circular Justification and Claim-Assertion Parity

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-020](PDR-020-check-driven-development.md)
(tool selection for RED assertions — this PDR governs the
validity of the resulting tests);
[PDR-013](PDR-013-grounding-and-framing-discipline.md)
(test claims are grounded assertions; ungrounded claims mismatch
the assertion).

## Context

Tests are the codified verification that the product behaves as
intended. Two failure modes systematically corrode test validity
while leaving the test suite appearing healthy:

1. **Circular test justification**. Production code exists solely
   because tests call it; the tests exist because the production
   code exists. Neither serves an external consumer. The type
   checker and dead-code detector see the symbols as live because
   the tests import them; the tests justify their existence by
   calling the code they depend on. Both sides of the circle
   appear alive while neither serves product behaviour.

2. **Claim-assertion mismatch**. A test's description claims to
   guard against a specific regression (via `describe`/`it` text,
   TSDoc, or comments), but the actual `expect()` calls would pass
   regardless of whether the regression occurred. The narrative
   creates confidence; the assertion cannot deliver it. The test
   reads as proving something it does not actually prove.

Underlying cause: tests look valid from two different angles
(appearing live via type-check / coverage; appearing targeted via
description narrative) even when the underlying validity has
failed. Without explicit discipline around these two failure
modes, the signal degrades silently.

## Decision

**Tests must prove product behaviour — behaviour consumed by an
external caller outside the test itself. Tests as sole consumers
of production code are a migration surface, not a justification.
Test descriptions and test assertions must prove the same thing;
claim-assertion mismatch is a finding, not a stylistic concern.**

### Tests as external consumers only

A valid test verifies behaviour that some external caller depends
on. External callers include:

- Users of the product (application users, end users of an API).
- Consumers of a library (other packages that import and use
  exported symbols).
- Consumers of an MCP tool, a CLI command, or any other
  published surface.
- Integration boundaries (the test proves the contract at the
  boundary, not the boundary's own existence).

A test is **not** justified by:

- Other tests consuming the same production code.
- The test's own import of the production code it exercises.
- The symbol being referenced in coverage reports.

### "Tests use it" is migration surface

When the only consumers of a production symbol are tests, the
production code is **dead** from the product's perspective. The
appearance of liveness via type-check is a side effect of the
test imports, not evidence of use. Correct response when this
state is discovered:

1. Identify the production code as dead.
2. Check whether the tests prove something that would otherwise be
   unprovable (rare; usually the production code can be inlined
   into the test or removed entirely).
3. Remove both sides of the circle: the dead production code AND
   the tests that called it.

The state is a migration surface to be resolved, not a stable
configuration. Commenting that "tests use it" is not
justification.

### Claim-assertion parity

A test's description (via `describe`, `it`, TSDoc, or comment)
names what the test proves. The test's assertions perform the
proof. **The description and the assertions must prove the same
thing.**

Parity failure modes:

- **Description claims regression detection; assertion passes
  regardless of whether the regression occurred.** Common when a
  test sets up state then asserts something trivially true of the
  state, missing the regression condition.
- **Description claims invariant; assertion is tautological.**
  E.g. "verify invariant X holds" with `expect(x).toBe(x)` — the
  assertion tests assignment, not the invariant.
- **Description claims behaviour A; assertion observes behaviour
  B.** The narrative says one thing; the proof is about another.

When claim and assertion diverge, one of two corrections applies:

1. **Rewrite the assertion** to match the claim — most common
   when the claim is right and the assertion was hastily chosen.
2. **Rewrite the claim** to match the assertion — when the
   assertion's substance is legitimate but the claim overstated
   what was being proven.

Either way, parity is restored before the test lands.

### Detection mechanisms

Both failure modes resist detection in passing-test reports (by
definition; the tests pass). Detection mechanisms:

- **Reviewer review of tests explicitly asks**: "does the
  assertion distinguish the regressed state from the correct
  state?" and "is any symbol in this test only consumed by
  tests?"
- **Dead-code detector runs over production code only** (not
  tests) and reports symbols whose only consumers are tests.
- **Mutation testing** catches assertions that pass regardless of
  the code they purport to verify (advanced; worth investing in
  for load-bearing test suites).

## Rationale

**Why tests must prove external behaviour.** The product's value
is in what external consumers can do with it. Tests that prove
internal consistency without reference to external behaviour add
coverage metric without adding product verification. When the
internal behaviour changes without affecting external behaviour,
the test still passes and provides no signal.

**Why circular justification persists.** When removing a feature,
engineers naturally audit production callers first. Test callers
are invisible to the "what still uses this?" search if the test
imports aren't separated. The remaining test callers keep the
production code alive at type-check time; the type-check signal
looks clean; the dead-code detector sees test imports as valid
consumers. Everything appears healthy from the tool surface while
the circle accumulates.

**Why claim-assertion parity is load-bearing.** The description
is what a future maintainer reads to understand what the test
guards. If the assertion cannot prove what the description
claims, the next maintainer who touches the adjacent code
operates under false confidence — they believe the guard exists
and reason accordingly. The test becomes an active source of
misinformation.

Alternatives rejected:

- **Tests-as-their-own-justification.** Produces circular
  justification; masks dead code; corrodes the meaning of
  coverage.
- **Description as optional / stylistic.** Descriptions guide
  maintenance decisions; treating them as stylistic disconnects
  them from the assertion they should reflect.

## Consequences

### Required

- Tests are removed when they and the production code they
  exercise are not consumed by any external caller.
- Test descriptions and test assertions prove the same thing;
  parity is verified before the test lands.
- Reviewers ask about circular justification and claim-assertion
  parity explicitly for non-trivial tests.

### Forbidden

- "Tests use it" as a justification for keeping production code
  alive.
- Test descriptions that overstate what the assertions prove.
- Tautological assertions where both sides of the `expect()`
  are derived from the same substitution without a real
  invariant being exercised.

### Accepted cost

- Removing tests feels wrong when the coverage metric drops.
  Justified by the fact that the removed tests were not proving
  external behaviour; the coverage drop reflects honest exposure.
- Claim-assertion parity takes review effort. Justified by the
  elimination of false-confidence tests.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-021`:

- `.agent/memory/active/patterns/circular-test-justification.md` —
  Sentry MCP wrapper removal (2026-04-15/16); dead production
  code kept alive by test consumers only.
- `.agent/memory/active/patterns/test-claim-assertion-parity.md` —
  Sentry wrapping-order test rewrite (2026-04-16); test header
  claimed regression detection but assertion passed regardless
  of ordering.
