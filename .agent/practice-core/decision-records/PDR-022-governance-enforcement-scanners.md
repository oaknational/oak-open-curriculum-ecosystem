---
pdr_kind: governance
---

# PDR-022: Governance Enforcement Requires a Scanner

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(the canonical-first architecture's portability invariants are
scanner-enforced);
[PDR-008](PDR-008-canonical-quality-gate-naming.md)
(the gate names governed by PDR-008 can be scanner-verified).

## Context

Governance documents — ADRs, PDRs, directives, rules, style
guides — regularly assert that a property holds **universally**
across a set of live surfaces:

- "Every rule cites its authoritative ADR."
- "The vocabulary of the three-zone fitness model appears on every
  live surface."
- "Every governed file declares four fitness metrics in its
  frontmatter."
- "Every canonical artefact has a platform adapter on every
  supported platform."
- "Every public export has TSDoc."
- "Every agent carries a `classification` field in its
  frontmatter."

The assertions use universal quantifiers ("every", "all",
"never"). The enforcement is often prose alone: the document says
the property must hold, but no automated check walks the surfaces
and confirms it.

Observed failure mode: **universal governance claims drift out of
compliance silently** because prose cannot enforce "every". A
single file missing the required field is invisible to the next
reader of the governance doc; the drift accumulates file by file;
eventually, multiple incompatible teachings coexist without
anyone having noticed.

Underlying cause: prose is aspirational; automated checks are
verificational. A claim about "every" surface needs a mechanism
that walks every surface.

## Decision

**Every governance claim that uses a universal quantifier across
live surfaces is backed by an automated scanner that walks those
surfaces and exits non-zero when the property fails. Prose-only
universality drifts; scanner-backed universality holds.**

### When a scanner is required

A governance claim requires a scanner when all three hold:

1. **Universal quantification**: "every", "all", or "never"
   applied to a set of live surfaces.
2. **Surfaces are enumerable at repo state**: the "every" refers
   to files, configs, or artefacts that exist in the repo and can
   be walked by a script.
3. **The property is testable**: the scanner can mechanically
   check whether each surface conforms — via grep, frontmatter
   parse, AST inspection, cross-reference validation, or
   equivalent.

When all three hold, the scanner is part of the governance: the
claim and the scanner ship together. A claim without a scanner is
aspirational; a scanner without a claim is over-engineering.

### Scanner integration

A governance-enforcement scanner:

- Runs in CI on every PR touching governed surfaces.
- Runs in the repo's aggregate quality gate (`check` / `check:ci`
  per PDR-008).
- Produces structured output suitable for agent consumption
  (counts, specific violations with file:line).
- Exits `0` when compliant, non-zero when any surface fails.
- Is fast enough to run routinely (does not need optimising at
  small scale; may need indexing at large scale).

### Scanner-less governance

Not every governance claim needs a scanner. Claims that do NOT
require a scanner:

- **Non-universal claims**: "this architecture decision applies
  to the X subsystem" (scoped, not universal).
- **Non-enumerable quantification**: "every future contributor
  should understand Y" (contributors aren't surfaces).
- **Non-mechanical properties**: "every ADR makes the right
  trade-off" (trade-off quality is a judgement, not a mechanical
  check).

Such claims remain prose; their enforcement is via review,
culture, and specialist reviewers — not automated scan.

### Scanner creation trigger

A scanner is created at the moment the governance claim is
written. Writing "every X must Y" without simultaneously writing
(or scheduling) the scanner is a known anti-pattern: the
ceremonial intent produces the claim; the mechanical enforcement
is forgotten because it has no natural author-time prompt.

When a governance document is authored:

1. Identify universal claims.
2. For each, decide: scanner or not.
3. If scanner: author it in the same change, or name the lane
   that will author it before the governance doc ships.
4. A governance doc with un-scanned universal claims does not
   land.

## Rationale

**Why prose cannot enforce "every".** "Every" is an assertion
about every member of a set. A reader cannot verify every member
by reading prose — they can only verify the claim's wording. The
universality is untested from the reader's perspective; drift is
invisible until someone runs a manual sweep, which is rare and
expensive.

**Why the scanner ships with the claim.** Scanners added later
(when drift is discovered) are reactive — the drift has already
happened; governance has already broken. Scanners added with the
claim are preventive — the surface is walked from day one; drift
cannot accumulate unnoticed.

**Why the scanner is fast.** A scanner that is slow enough to
skip is a scanner that does not run. Scanners run routinely or
they do not enforce. Scale considerations (indexing, incremental
checks) are legitimate; slowness-as-excuse-for-skipping is not.

Alternatives rejected:

- **Periodic manual sweeps.** Not routine; drift happens between
  sweeps; sweeps are expensive when they do run.
- **Reviewer-only enforcement.** Reviewers are specialists for
  judgement-based concerns. Mechanical universality is not a
  reviewer concern; it is a scanner concern.
- **Sampling-based checks.** Universal claims do not admit
  sampling; "every" means every.

## Consequences

### Required

- Every governance claim using universal quantification across
  live surfaces ships with a scanner that walks those surfaces.
- Scanners run in CI and in the local aggregate gate.
- Scanner output is structured for agent consumption.
- Governance docs that claim universality without a scanner do
  not land.

### Forbidden

- Writing "every X must Y" as governance without simultaneous
  scanner creation (or a named lane authoring the scanner).
- Relying on periodic manual sweeps for universal enforcement.
- Excluding surfaces from scanners to make the scanner pass
  without addressing the underlying violations.

### Accepted cost

- Scanners are code to write and maintain. Justified by the drift
  they prevent.
- Some universal claims are hard to scanner-enforce. Where they
  are genuinely non-mechanical, the claim should be rescoped or
  accept the review-based enforcement with explicit acknowledgment
  that drift will happen.

## Notes

### Host-local context (this repo only)

Proven instance retained with `related_pdr: PDR-022`:

- `.agent/memory/patterns/governance-claim-needs-a-scanner.md` —
  proven in `scripts/validate-fitness-vocabulary.mjs` (enforces
  that the zone vocabulary appears on every live surface).
  Additional scanners in the host repo:
  `scripts/validate-portability.mjs` (every canonical artefact
  has platform adapters), `scripts/validate-subagents.mjs`
  (sub-agent adapter parity), `scripts/validate-practice-fitness.mjs`
  (four fitness metrics on every governed file).
