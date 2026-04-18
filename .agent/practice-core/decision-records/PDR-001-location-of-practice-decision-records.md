# PDR-001: Location of Practice Decision Records

**Status**: Accepted
**Date**: 2026-04-17
**Related**: Practice Core (`practice.md`, `practice-lineage.md`),
Practice Context layer.

## Context

The Practice — the self-reinforcing system of principles, structures,
agents, and tooling that governs how work happens in a repo — has
accumulated architectural and governance decisions of its own:
decisions about how the Practice is bootstrapped, how it propagates
between repos, how foundational documents relate to each other, how
the fitness-function model operates, how continuity artefacts
interact with the surprise pipeline.

These decisions have historically been recorded as Architectural
Decision Records inside the host repo's product-ADR folder. That
location places authoritative governance of a portable Practice
inside a single repo's non-portable documentation layer. When the
Practice Core plasmid is hydrated into a new repo, these decisions
do not travel; only their downstream operational consequences (rules,
commands, learned principles) arrive in the new repo, stripped of
their decision lineage.

Four candidate locations for Practice-governance decisions were
considered:

1. Host repo's product-ADR folder (status quo). Fails the travel
   test: decisions that govern the Practice do not accompany the
   Practice when it propagates.
2. Absorb into the Core's `practice-lineage.md` Learned Principles
   section. Misfits the ADR shape: Learned Principles are terse
   rule statements without supersession chains, consequences, or
   decision lineage.
3. Add a new file or subfolder inside the Practice Core itself.
   Violates the eight-file Core contract and requires a structural
   change to the memotype. Delays the capture of accumulated
   decisions behind a structural re-negotiation.
4. A new peer directory, alongside Core and Context, carrying
   Practice-governance decisions as portable content. Preserves the
   Core contract; extends the existing peer-layer pattern that
   already accommodates the optional Context companion.

A fifth meta-observation applies: the decision about where Practice
decisions live is itself a Practice decision, and its home is the
answer to itself. Whichever option is chosen, the first decision
recorded in that home must be this one.

## Decision

Create `.agent/practice-decision-records/` as a peer directory to
`.agent/practice-core/` and `.agent/practice-context/`. Practice
Decision Records (PDRs) record authoritative decisions that govern
the Practice itself. PDRs are portable; they travel alongside the
Practice Core when the Practice is hydrated into a new repo.

The directory is provisional. The long-term intent is that stable
PDRs integrate into the Core's plasmid trinity as refinements
(`practice.md` for structure, `practice-lineage.md` for evolution
doctrine, `practice-bootstrap.md` for templates). Until that
integration path is routine, the PDR directory carries the decisions
that would otherwise have no portable home.

## Rationale

Option 4 is adopted because it is the least disruptive path that
also satisfies the travel requirement. Option 1 fails the travel
test. Options 2 and 3 require either misfitting the ADR shape or
amending the eight-file Core contract; the former loses decision
substance, the latter enlarges the memotype permanently before the
decision-recording need has stabilised.

The user explicitly acknowledged the arrangement as "clumsy but
functional for now" with an expected future path into Core
integration. The provisional framing is deliberate: the PDR directory
is a staging ground, not a permanent fixture. Treating it as
permanent would pre-commit the architecture; treating it as
experimental allows the integration question to be answered after
practical experience accumulates.

## Consequences

**Preserved**:

- The eight-file Practice Core contract is unchanged.
- Portability remains per the "concepts are the unit of exchange"
  principle: PDRs must carry their substance, not point at
  host-repo artefacts for the decision itself.
- The Context layer's role as optional sender-maintained companion
  is unchanged.

**Added**:

- A third peer directory, referenced from the Core's entry points
  (README, index) so agents encountering the Practice discover it.
- A lightweight governance surface for decisions about the Practice
  that would otherwise accumulate in host-repo ADR folders and
  fail the travel test.

**Forbidden**:

- PDRs MUST NOT carry host-repo-specific references in the
  substance of the decision. Host-local cross-references are
  permitted only in explicit **Notes** sections.
- PDRs MUST NOT be silently deleted. Superseded PDRs remain in
  place with a `Superseded by` header.

**Deferred**:

- Retroactive migration of existing Practice-governance ADRs in
  host-repo ADR folders (in this repo: at least six such ADRs,
  including the ADRs that define Agentic Engineering Practice,
  Practice Propagation, Documentation as Foundational
  Infrastructure, Self-Referential Property of the Practice, the
  Two-Threshold Fitness Model, and Continuity Surfaces). Migration
  touches rule-file cross-references and is a separate decision.
- Concrete integration of stable PDRs into Core refinements. The
  graduation path will be defined by a subsequent PDR when the
  first graduation becomes pressing.

## Notes

This PDR is self-referential: it creates the directory by being
the first file in it. Its acceptance is the acceptance of the
directory.

Recording this as PDR-001 rather than PDR-000 is deliberate. PDR-000
is reserved as a sentinel should a future Practice adopt a
"meta-PDR about how PDRs themselves are structured" convention. The
current directory begins at 1 and counts up.

### Host-local context (this repo only, not part of the decision)

In the repo where this PDR was authored, the existing
Practice-governance ADRs referenced above are
[ADR-119](../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md),
[ADR-124](../../docs/architecture/architectural-decisions/124-practice-propagation-model.md),
[ADR-127](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md),
[ADR-131](../../docs/architecture/architectural-decisions/131-self-referential-property-of-the-practice.md),
[ADR-144](../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md),
and
[ADR-150](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md).
These paths do not travel with this PDR.
