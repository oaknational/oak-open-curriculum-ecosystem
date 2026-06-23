---
pdr_kind: pattern
---

# PDR-112: The Teaching-Surface Family — Intent-Routed Lenses Across a Portability Seam

**Status**: Accepted
**Date**: 2026-06-22
**Adopted**: 2026-06-22 (owner-ratified)
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities are Practice substance by default);
[PDR-051](PDR-051-vendor-agnostic-skills-standardisation.md)
(skills standardisation — the canonical body carries content; adapters are
generated);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(canonical-first — routing and the no-duplication contract);
[PDR-005](PDR-005-wholesale-practice-transplantation.md)
(how a portable lead-in *artefact* actually travels — transplantation or
seeding, not plasmid exchange);
[PDR-108](PDR-108-generalise-where-generalisation-does-not-cost-utility.md)
(the three-context generality test, applied here to the pattern).

## Context

A Practice-bearing repo teaches newcomers through orientation artefacts, routed
by reader-intent (for example: a fast "what is this", a guided entry/setup, deep
capability-building, a specific-detail lookup). Two failure modes recur when the
surface is left un-named:

1. **Drift and duplication.** Un-named orientation surfaces slowly re-teach each
   other's material; each becomes a second, divergent source of the same facts.
2. **A stranded portable lead-in.** Some literacy is *not* repo-specific — it is
   identical wherever the Practice runs. Embedded inside a repo-bound onboarding
   artefact, it cannot be reused and is the first thing lost.

The **motivating instance** in this repo: nothing teaches how to work with
agentic AI in general, though a newcomer new to agentic AI needs exactly that
before any repo-specific material. That gap is the originating case. The
portable substance this PDR records is the **structural pattern** beneath it —
*not* the literacy content, whose subject matter is any given repo's phenotype
choice.

## Decision

A repo's human-facing teaching surface is a family of intent-routed lenses; and
where the surface includes a **portable lead-in**, it is structured across a
**portability seam** joined by a single **named hand-off edge**:

- **Portable lead-in.** A repo-independent teaching artefact, Practice substance
  (PDR-035), authored as a content-bearing skill body (PDR-051) with no host
  specifics. It **carries its own content** — it does not read the host corpus.
- **Repo-bound lenses.** Host-specific, intent-routed surfaces (phenotype). They
  read the host's shared corpus and route between one another without
  duplicating content (the canonical-first no-duplication contract, PDR-009).
- **The named hand-off edge.** The lead-in ends at a declared continuation
  point; each host wires which repo-bound lens the learner enters next *behind*
  the edge. Because the lead-in carries its own content and shares no corpus with
  the lenses, this edge is the **one and only content coupling** between the
  portable lead-in and the repo-bound members. (Placement and discovery-routing
  are a separate, expected phenotype coupling — to the host's canonical/adapter
  and routing surfaces, not to the members' bodies.)
- **The seam is a hard boundary.** No host *phenotype* in the portable lead-in's
  body — no repo-specific implementation (files, tools, paths, schemas, hooks)
  and no repo product/domain subject matter (PDR-035 §Decision draws the
  memotype/phenotype line). The Practice *memotype* — its concepts and
  vocabulary — is portable substance and may be invoked in the lead-in as
  co-portable illustration, because it travels with the lead-in (PDR-005); only
  the host's phenotype lives behind the edge. No portable substance is stranded
  inside a repo-bound lens.

## Rationale

- The novel, portable substance is the **seam-plus-edge contract**: a portable
  artefact that ends at a declared edge, behind which a host wires its
  continuation. That is what lets a portable artefact lead *into* a repo-bound
  one without coupling their content — the edge is the contract; the
  continuation is phenotype.
- **Three-context test (PDR-108, recorded at authoring).** The seam-plus-edge
  form produces correct, action-changing behaviour across unrelated contexts:
  (1) a general agentic-AI-literacy lead-in into a repo's onboarding walk; (2) a
  domain-concept tutorial lead-in into a product's contributor guide; (3) a
  general tooling/setup primer into a stack-specific setup sequence. In each, the
  lead-in stays host-free, the edge is the only coupling, and the host wires the
  continuation. The pattern carries behaviour-change power in all three, so it
  generalises.
- The **subject matter** of a given lead-in (here, agentic-AI literacy) is *not*
  part of the portable claim — that is the host's phenotype choice. Recording
  "every repo needs an agentic-AI primer" as doctrine would be the untested
  reflex PDR-108 warns against; only the seam-plus-edge pattern is recorded.
- Naming the family is what stops the drift-and-duplication failure mode (the
  routing contract, PDR-009).
- Keeping the lead-in host-free is what lets it be reused when a Practice is
  **transplanted or seeded** into another repo (PDR-005). A skill is not part of
  the Core plasmid package, so it does not travel by plasmid exchange; it travels
  by transplantation/seeding. This *pattern* PDR, living in `decision-records/`,
  travels with the Core plasmid; the lead-in *artefact* it describes travels by
  the transplantation/seeding path.

Alternatives considered: (a) one monolithic onboarding artefact — drifts, and
embeds the portable lead-in where it cannot be reused; (b) the lead-in subsumed
into repo onboarding — the PDR-035 classification trap; (c) surfaces left
un-named — accretion, duplication, and a lost portable asset.

## Consequences

### Required

- A portable lead-in is authored as Practice substance with a host-free,
  content-bearing body and a single named hand-off edge.
- Repo-bound lenses declare the reader-intent they own and route between one
  another without duplicating content (PDR-009).
- The host records its own instantiation — which lenses exist, the routing, and
  the lead-in's placement across canonical and adapter surfaces — on host
  phenotype surfaces (host ADRs and the operational entry point), not in this
  portable pattern.
- The portable lead-in reaches another repo by transplantation or seeding
  (PDR-005); this pattern reaches it as a PDR with the Core plasmid.
- Before a host seeds the lead-in, it wires at least one repo-bound
  continuation behind the hand-off edge. The lead-in's forward promise — that a
  structured continuation exists for the reader — must not dangle: a repo that
  has adopted the Core but not yet authored a continuation lens is not yet ready
  to seed the lead-in.

### Forbidden

- Host *phenotype* in the portable lead-in's body — repo-specific implementation
  (files, tools, paths, schemas, hooks) or repo product/domain subject matter.
  (The Practice memotype and its vocabulary are portable substance, not host
  phenotype — PDR-035 — and may be invoked as illustration; the pedagogy of when
  to invoke it is the lead-in's authoring concern, not a seam rule.)
- Duplicating teaching content across lenses instead of routing between them.
- Recording a lead-in's subject-matter generality ("every repo needs this
  topic") as portable doctrine — that is host phenotype.

### Accepted cost

- The hand-off edge requires a small amount of host wiring per repo (which lens
  the lead-in enters next). This is the deliberate phenotype price of a portable
  lead-in.

## Notes

### Relationship to PDR-035 and PDR-051

The portable lead-in is the canonical illustration of "classify Practice-shaped
first" (PDR-035): repo-independent literacy is owned by the memotype, with only
its placement and continuation expressed as host phenotype. It is authored as an
owned, content-bearing skill body (PDR-051) — distinct from a thin router skill;
adapters are generated, never hand-authored (PDR-009).

### Relationship to PDR-005 — transport

Skills are not in the Core plasmid package (the bounded set in
`.agent/practice-core/`). A portable lead-in reaches a new repo by wholesale
transplantation or seeding (PDR-005); keeping its body host-free is precisely
what makes that transport clean. Confusing the two transports would strand the
lead-in at the plasmid boundary — the failure this pattern exists to prevent.

### Graduation intent

Candidate for graduation into `practice-lineage.md` once the pattern has
hydrated across more than one Practice-bearing repo and the hand-off-edge
contract has proven stable. A single-instance pattern is provisional by
construction (PDR-108).
