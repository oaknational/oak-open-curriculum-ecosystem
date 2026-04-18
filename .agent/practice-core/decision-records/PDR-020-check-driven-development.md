---
pdr_kind: governance
---

# PDR-020: Check-Driven Development — Gates as Assertions

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-008](PDR-008-canonical-quality-gate-naming.md)
(canonical gate names that this PDR uses as assertion tools);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings about gate-bending or suppressions route per PDR-012).

## Context

Test-driven development is a foundational Practice discipline. In
practice, "test" is often interpreted narrowly — meaning only the
test runner (Vitest, Jest, cargo test, etc.). This narrow
interpretation produces a characteristic failure mode:

**Bending tool usage to fit a narrow TDD definition.** When the
gap to prove is outside the test runner's natural scope (a missing
module, unused code, a circular dependency, a lint-rule violation),
the developer either:

- Writes runtime assertions (`expect(x).toHaveProperty('foo')`) to
  keep the proof inside the test runner even when the type checker
  would prove the gap more directly.
- Adds `eslint-disable` or `@ts-expect-error` to avoid breaking
  the type checker or linter, hiding the RED signal behind a
  suppression.
- Skips the RED phase entirely for gaps the test runner cannot
  naturally prove.

Underlying cause: a narrow definition of "test" treats only one
tool as a valid assertion mechanism, when the repo's full quality-
gate surface provides several.

## Decision

**In TDD's RED phase, use whichever quality gate proves the gap
most directly. The test runner is one assertion tool; the type
checker, dead-code detector, dependency graph validator, linter,
and search tool are others. Bending tool usage to keep the proof
inside the test runner — especially through suppressions — hides
the RED signal and corrodes the discipline.**

### Assertion tool selection

A RED assertion proves that a specific gap exists. Different kinds
of gap are proven most directly by different tools:

| Gap to prove | Best assertion tool |
|---|---|
| Missing module, export, or symbol | Type checker |
| Missing runtime behaviour / failing invariant | Test runner |
| Unused code after a refactor | Dead-code detector |
| Circular or forbidden dependency | Dependency graph validator |
| Code pattern presence or absence | Search (grep / rg) |
| Lint rule violation | Linter |
| Schema / format violation | Schema validator / formatter |
| Coverage gap | Coverage tool |

The RED phase uses the tool that proves the specific gap. The
GREEN phase makes that specific tool exit clean.

### Suppression as RED-phase signal loss

When the RED phase would naturally break a gate (type-check,
linter, dead-code detector), **do not suppress**. The break IS the
RED signal. Suppressing it produces a falsely-clean state that
hides the work needed in GREEN.

Examples:

- If the RED proves a missing export, the type-check error is the
  RED signal. Do not add `@ts-expect-error`; let type-check fail
  until GREEN provides the export.
- If the RED proves dead code, the dead-code detector error is
  the RED signal. Do not add the file to an ignore list; let the
  detector fail until GREEN removes the code.
- If the RED proves a circular dependency, the dependency graph
  validator error is the RED signal. Do not add the edge to an
  exception list; let the validator fail until GREEN resolves the
  cycle.

### Multi-gate RED

A single gap may be provable by multiple tools (a missing
behaviour provable by both test runner and type checker, for
instance). Choose the tool closest to the gap's primary
expression — the tool whose clean-exit most directly verifies
that the gap is closed in GREEN. Redundant assertions across
multiple tools are acceptable when they prove different aspects
of the same gap.

## Rationale

**Why the gate surface is the assertion surface.** Each quality
gate is an assertion mechanism: it states "this property holds."
When the property we want to prove in RED is exactly one of these
gate-enforced properties, the gate IS the assertion. Forcing the
proof into the test runner when the gate expresses it more
directly adds ceremony without adding verification strength.

**Why suppression loses the signal.** Suppression marks a gate
violation as intentional. In normal use, this is appropriate (some
violations are genuine exceptions). In RED-phase use, the violation
is the thing being proven — marking it as "intentional and
accepted" communicates the opposite of what the phase needs.
Suppression turns RED into false-GREEN.

**Why tool selection matters to discipline.** When the same gap is
proven with the wrong tool, GREEN becomes harder to verify. A
runtime property-existence check passes when the property is
added, but also passes when the property is added with the wrong
type — the type checker would have caught the type error. Using
the right tool for the RED means GREEN verification is tight.

Alternatives rejected:

- **Test runner as sole assertion tool.** Forces workarounds for
  type-check / lint / dead-code / cycle gaps; bends tool usage.
- **Suppress gate failures during RED.** Hides the RED signal; GREEN
  looks like "remove suppression" instead of "fix the underlying
  issue."
- **Redundant assertions always.** Over-produces ceremony; adds
  maintenance without adding verification.

## Consequences

### Required

- RED-phase assertions use the quality gate that most directly
  expresses the gap being proven.
- Gate failures during RED are the RED signal — not suppressed,
  not worked around.
- GREEN closes the specific gate used as the RED assertion
  (plus any others affected by the change).

### Forbidden

- Adding suppressions (`@ts-expect-error`, `eslint-disable`,
  dependency-validator ignore entries, etc.) during RED to keep
  other gates clean.
- Writing runtime property-existence checks solely to avoid a
  type-check failure that would have been the direct RED signal.
- Treating the test runner as the only valid assertion tool.

### Accepted cost

- RED assertions may span multiple tools (type-check failing,
  test runner skipped, lint failing). The working-tree state
  during RED is noisier. Justified by signal fidelity.
- Agents unfamiliar with the multi-gate surface need to learn
  which tool matches which gap. Justified by the payoff in
  assertion quality.

## Notes

### Host-local context (this repo only)

Proven instance retained with `related_pdr: PDR-020`:

- `.agent/memory/patterns/check-driven-development.md` —
  originated from SDK canonical-descriptor unit tests
  (2026-03-26) where runtime property-existence checks were
  initially written to avoid breaking type-check; refactored to
  use the type checker as the direct assertion after owner
  correction.
