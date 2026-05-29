---
pdr_kind: governance
---

# PDR-088: Reviewers Carry Doctrine, Not Just Audit Against It

**Status**: Accepted
**Date**: 2026-05-29
**Adopted**: 2026-05-29
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(Core contract under which this PDR is authored; governance kind);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(domain-specialist capability — the reviewer roles this PDR governs are
instances of that pattern);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(how a reviewer's findings route — this PDR governs what a reviewer must
*be* before its findings carry weight);
[PDR-087](PDR-087-tdd-as-design.md)
(the foundational TDD doctrine the test-discipline reviewer carries — the
worked instance this PDR generalises from).

## Context

A reviewer can operate in two fundamentally different modes. In the first,
it is a *structural auditor*: it runs output against a checklist of
surface properties and reports mismatches. In the second, it is a
*carrier of the doctrine it enforces*: it has internalised the governing
principles and reasons from them, so its findings name *why* a thing is
wrong in the doctrine's own terms, not merely *that* a checklist item
failed.

The auditor mode degrades silently. A checklist can be applied without
understanding what it protects; the findings are shallow, miss the cases
the checklist did not anticipate, and cannot distinguish a harmless
surface match from a load-bearing one. The corrosion is invisible because
the auditor still produces output that *looks* like review. The cure is to
make the reviewer carry the doctrine — and to make that carrying a
*forcing function* in the reviewer's own definition, not an aspiration.

## Decision

**A reviewer is a carrier of the doctrine it enforces, not a structural
auditor of output against a checklist.** Two properties make this
operative rather than aspirational:

### The forcing-function read-path (the mechanism)

A reviewer's definition carries a **mandatory read-path**: a section that
requires the reviewer to read and internalise the governing doctrine
documents *on every invocation*, with lazy loading explicitly forbidden.
The read-path is the forcing function — it converts "the reviewer should
know the doctrine" into "the reviewer reads the doctrine before it
reviews." This is the mechanism by which carrying happens; it is not a
separate practice from carrying, it is how carrying is enforced.

### Cite-by-section (the closing variant)

The stronger instantiation closes the loop on the output side: the
reviewer's findings must **cite the governing doctrine by section
heading**, and abstract advice that cites nothing is treated as an
admission the doctrine was not read. Cite-by-section makes
non-internalisation *observable in the output* — a reviewer that has not
read the doctrine cannot cite it by section, so the gap surfaces rather
than hiding behind plausible-sounding generic findings.

## Consequences

### Required

- A reviewer role's definition names the doctrine it carries and requires
  reading-and-internalising it on every invocation (the forcing-function
  read-path), lazy loading forbidden.
- Where the doctrine has a citable structure (named sections, a recipe or
  pattern bank), the reviewer's findings cite it by section; abstract
  findings that cite nothing are a reviewer-discipline failure.

### Forbidden

- A reviewer defined as a pure structural auditor — a checklist with no
  required read-path into the doctrine the checklist serves.
- Accepting a reviewer's findings as authoritative when its definition
  does not require it to carry the doctrine it claims to enforce.

### Accepted costs

- The mandatory read-path adds invocation cost (the reviewer reads the
  doctrine every time). Accepted: the alternative is shallow audit-mode
  findings that miss exactly the cases a checklist did not foresee.
- Not every reviewer role yet instantiates the stronger cite-by-section
  variant; the read-path is the floor, cite-by-section the ceiling
  (see Notes).

## Falsifiability

The doctrine fails if a reviewer whose definition carries no required
read-path nonetheless produces findings indistinguishable in depth from a
doctrine-carrying reviewer — evidence the read-path is ceremony, not a
forcing function. It succeeds when reviewer findings reason from the
doctrine in its own terms (citing it where it is citable) rather than
reporting surface checklist mismatches, and when a reviewer that skipped
the doctrine is detectable by the absence of doctrine-grounded citations.

## Notes

**Evidence base (honest scope).** The forcing-function read-path is the
≥2-instance pattern: multiple reviewer roles — the test-discipline
reviewer, the type-safety reviewer, and the architecture reviewer — each
carry a mandatory "read and internalise these documents on every
invocation" section. The **cite-by-section** variant is, at the time of
this decision, fully instantiated by the test-discipline reviewer alone
(its findings must cite a recipe or pattern by section heading, and
abstract suggestions are named an admission the doctrine was not read);
the type-safety and architecture reviewers carry the mandatory read-path
but not yet the cite-by-section enforcement. This PDR therefore graduates
the read-path as the portable floor and names cite-by-section as the
stronger variant a reviewer adopts where its doctrine is citable — it does
not claim all reviewers are equivalent carriers.

This PDR records the portable *decision*. Host repos operationalise it in
their reviewer-role definitions; the repo-bound surfaces are bridged
through the practice-index. It adds no new repo-bound substrate, so it has
no standalone phenotype ADR; its phenotype is the host's existing reviewer
role definitions.

Adopter scope: **every Practice-bearing repo that runs specialist
reviewer roles.**
