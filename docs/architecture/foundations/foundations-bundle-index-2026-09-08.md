---
boundary: B2-Architecture
doc_role: index
authority: own-built-foundations-bundle-navigation
status: active
last_reviewed: 2026-09-25
---

# Own-built foundations: bundle index

25 September 2026 · revision 2

This bundle records the repository owner's current direction to author graph and non-graph algorithms and data structures as Capability Foundations with small completed Primitives and meaningful composed capabilities, informed by the best openly licensed references. It combines governing policy, detailed contracts, worked expectations and the disposition of relevant earlier research.

## Read by purpose

| Document                                                                                                         | Responsibility and evidence status                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Governing policy](algorithms-and-data-structures-governance-2026-09-08.md)                                      | Current owner-established implementation-origin, research, provenance and qualification policy. Start here.                                                   |
| [Capability Foundations and composition architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) | Common R01–R10 and C01–C08 requirements; small boundaries, comprehensive assurance and complexity within and across compositions.                             |
| [Completion and adoption profile](capability-foundations-adoption.md)                                            | First-build contracts, TypeScript/Node profile, completion and data/API adoption requirements; no implementation claim.                                       |
| [Comprehensive graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md)            | Graph-specific model, identity, capability, state, custody, transformation and algorithm architecture.                                                        |
| [Graph capability contracts](graph-library-capability-contracts-2026-09-08.md)                                   | Complete target capabilities, lawful profiles, qualifiers and acceptance obligations.                                                                         |
| [Graph requirements register](graph-library-requirements-register-2026-09-08.json)                               | The 356 stable requirement identifiers and machine-readable declaration schema. A valid declaration does not itself establish implemented support.            |
| [Graph review and delivery](graph-library-review-and-delivery-2026-09-08.md)                                     | Graph design inquiry, review questions and delivery obligations; historical checks retain their original scope.                                               |
| [Queue candidate](oce-queue-reliable-atom-2026-09-08.md)                                                         | A concrete stable numeric-priority queue contract and qualification design. No new qualified implementation is supplied.                                      |
| [General worked examples](reliable-atoms-worked-examples-2026-09-08.md)                                          | Graph and non-graph examples of atom and composition laws, failures, proof and costs. Expectations, not execution receipts.                                   |
| [Graph worked examples](graph-library-worked-examples-2026-09-08.md)                                             | Complete graph journeys exposing projection, ownership, validation and evidence obligations.                                                                  |
| [Addressable relationships and identity](addressable-relationships-rdf-quads-and-identity-2026-09-08.md)         | Relationship/content/assertion/occurrence distinctions and RDF preservation questions.                                                                        |
| [Build and layering analysis](oce-graph-build-buy-and-layering-analysis-2026-09-08.md)                           | Current decomposition analysis with dated heap/Effect observations and an explicit keyword-ordering seam. The historical filename is retained for continuity. |
| [Review of the original three documents](review-of-reliable-atoms-graph-and-queue-2026-09-08.md)                 | Original review evidence and current design dispositions; not a new implementation certification.                                                             |
| [Graph concept map](typescript-graphs-concept-map-and-reference.md)                                              | Vocabulary, capability dimensions and source navigation under the current policy.                                                                             |
| [Graph receiving guide](oce-graph-research-handoff-and-index-2026-09-08.md)                                      | Graph-specific entry points and dated research interpretation.                                                                                                |
| [Graph project instructions](typescript-graphs-project-instructions.md)                                          | Dated record of the external project's instruction text; it binds nothing in this repository. Detailed policy remains in the governing document.              |
| [Source review](foundations-source-review-2026-09-08.md)                                                         | Bounded corpus, reading depth, transferable findings, historical dispositions and remaining evidence gaps.                                                    |
| This index                                                                                                       | Navigation and authority map for the foundations collection.                                                                                                  |

## Authority and change

The governing policy owns implementation origin and reference research. The general architecture owns current Primitive/Component/Subsystem grades and common assurance requirements; the adoption profile owns the selected first-build and execution contracts. Dated graph/queue designs retain their detailed laws but do not establish current grade or first-delivery priority. Graph architecture and the capability catalogue refine them for graph work; the register supplies stable identifiers. A worked example illustrates its stated contract and cannot silently weaken a governing requirement or expand an implementation's qualified scope.

Repository bindings on the shape of the workspaces that hold atoms — the declared workspace class, its directory budgets and its stricter lint, compiler and assurance tiers (owner direction 2026-09-14) — are owned by ADR-166 and ADR-230 and the Capability Foundations programme's plan nodes, not by this bundle; the general architecture §9 names the binding and keeps the atom's own boundary a responsibility judgement.

Specific open design questions remain with their owning document. Conflicts are resolved there and reflected in dependent examples and declarations. Navigators and reviews link to those authorities instead of maintaining competing definitions. Current owner decisions take precedence over dated acquisition recommendations in research inputs.

Provenance: the bundle was authored for this repository in the owner's external Typescript Graphs project, whose agent seat (Codex) wrote the records; where a dated record says "Jim" it means the repository owner, Jim Cresswell, and where it says "this project" or speaks of other consumers it speaks from that project: the graph functionality is incubated in OCE, and some of its layers are expected to move out or be published for wider use in time. The records keep their original wording as dated material; this index and the repository's own entry points speak of the owner.

The documents in this directory were written or reconciled together; the original three architectures remain central, and historical investigations and cross-domain product reports remain source records, with their relevant findings and dispositions conserved in the source review, whose §7 records how the bundle was received into this repository.

Subsequent implementation work grounds the applicable OCE instructions at its actual repository revision, selects an exact contract and carries the corresponding assurance evidence; dated snapshots are not claims about future repository or upstream state.
