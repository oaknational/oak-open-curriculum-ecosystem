---
pdr_kind: governance
---

# PDR-087: TDD as Design — Tests Describe System States

**Status**: Accepted
**Date**: 2026-05-29
**Adopted**: 2026-05-29
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(Core contract under which this PDR is authored; governance kind);
[PDR-020](PDR-020-check-driven-development.md)
(check-driven development — gates as assertions; the RED-phase tool
selection this definition's failing-test step uses);
[PDR-021](PDR-021-test-validity-discipline.md)
(test validity — circular justification and claim-assertion parity; the
validity a describing test must satisfy);
[PDR-034](PDR-034-test-fixtures-encode-production-shape.md)
(fixtures encode production shape — a describing test's fixtures
describe reality, not the code's expectation).

## Context

A Practice-bearing repo treats automated tests as load-bearing, but
*why* tests exist and *how* they relate to product code is easy to leave
implicit — and the implicit default is corrosive. The default frames a
test as an after-the-fact verifier of code that already exists. Under
that frame, tests ratify an interface the author already committed to;
they pass; and they carry no design information, only regression
coverage. The interface quality the discipline was supposed to produce
never materialises, because the test was never allowed to shape the
interface.

The corrosion compounds at the landing boundary. If a test merely
verifies existing code, there is no reason for test and code to land
together — so they drift into separate commits, reviews, and sessions,
and the test arrives as an audit of a decision already made. The result
reads like TDD (there are tests; they pass) while being its precise
inverse. This decision names what TDD *is*, portably, so every adopting
repo inherits the definition rather than re-deriving it — usually
re-deriving it wrong, as the verify-after-the-fact default.

## Decision

### The foundational definition

A test does not verify code. **A test describes a system state, and
product code is the path that guides the system into that state.** Test
and product code are two halves of one act of design; writing them
separately, in either order, is a category error. Every downstream rule
in this PDR derives from this definition.

### The atomic-landing invariant

Because test and product code are *co-defined* — neither can be cleanly
written without understanding the shape of the other — they are one
landing unit. **Every TDD cycle lands as one commit: the failing test,
the product code that greens it, and any refactor, together. Test and
product code never travel in separate commits.** The atomic landing is a
TDD *invariant*, not a process convenience; landing the halves
separately treats one act of design as two outputs, and the
second-arriving half is necessarily an audit of the first.

If a cycle cannot be greened in a single landing, the slice is too big:
decompose into smaller test+code pairs and land each as its own cycle. A
higher-scale test needing several lower-scale cycles first sequences
those and finishes with the commit that greens the higher-scale test;
every commit ends with all tests passing.

### The describe-vs-audit blade

The load-bearing reviewer question is: **does this test describe an
interface, or audit one?** A *describing* test could plausibly have been
written before the product code, names behaviour in domain terms, holds
for any reasonable alternative implementation, and constrains *what* the
system does. An *auditing* test can be derived mechanically from the
product code, names methods/fields/branches, breaks under any
behaviour-preserving refactor, and constrains *how*. Audit-shaped tests
carry zero design value and impose refactoring friction; they are
rewritten as descriptions or deleted — never ratified on the strength of
passing.

## Consequences

### Required

- The definition is foundational doctrine: above the test-type taxonomy
  for any question of *why* tests exist and *how* they relate to product
  code, below repository-wide principles.
- Each TDD cycle lands as one atomic commit (test + greening code +
  refactor); every commit ends green at every scale.
- Tests are screened for describe-vs-audit shape; audit-shaped tests are
  rewritten or deleted, not accepted because they pass.

### Forbidden

- Framing a test as an after-the-fact verifier of already-built code.
- A commit adding product code with no paired test (description after
  the path — an audit); a failing/skipped test intended to be greened by
  a future commit (path after the description); a batch of failing tests
  committed ahead of their product code.
- Ratifying an audit-shaped test because it passes.

### Accepted costs

- The atomic-landing invariant constrains commit granularity and forbids
  landing a broad test batch ahead of implementation. Accepted: the
  alternative is audit-shaped tests and silent description gaps.
- Scales have intentionally different greening costs; collapsing toward
  the cheapest scale is a description gap, not an optimisation.

## Falsifiability

The doctrine fails if a test written strictly after its product code,
deriving its assertions from that code's structure, routinely survives
review on the strength of passing — direct evidence the
describe-vs-audit blade is not applied and the definition has decayed
back to verify-after-the-fact. It succeeds when tests read as
descriptions of behaviour that constrain *what* the system does, land
atomically with the code that satisfies them, and survive
behaviour-preserving refactors unchanged.

## Notes

This PDR records the portable *decision*. Host repos operationalise it in
their own directive, rule, and reviewer surfaces — the foundational
directive that "TDD" expands to, the rule surface forbidding skipped /
conditional / global-state tests, and the test-discipline reviewer that
carries the describe-vs-audit blade on every invocation. The portable
doctrine travels; the repo-bound operationalisation is bridged through
the practice-index. This PDR adds no new repo-bound substrate, so it has
no standalone phenotype ADR; its phenotype is the host's existing TDD
directive and reviewer surfaces.

Adopter scope: **every Practice-bearing repo.** This is not
methodology-flavoured advice; it is the load-bearing frame the whole
validation arc derives from.
