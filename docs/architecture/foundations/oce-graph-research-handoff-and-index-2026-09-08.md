---
boundary: B2-Architecture
doc_role: index
authority: oce-graph-foundations-research-navigation
status: active
last_reviewed: 2026-09-09
---

# OCE graph foundations: receiving guide and research index

8 September 2026 · Revision 2 · Current graph-specific guide to the foundations bundle

**Purpose:** help Engraph OCE implement comprehensive graph capabilities as SMALL Reliable Atoms and layers of composition, informed by the best openly licensed examples. The [governing document](algorithms-and-data-structures-governance-2026-09-08.md) owns that current policy across graph and non-graph algorithms and data structures. The [bundle index](foundations-bundle-index-2026-09-08.md) owns the complete reading order and document map.

The owner has established the broad capability investment. Implementation sequencing uses concrete journeys, while the full graph capability ledger remains required scope. Prior package investigations supply reference designs, adverse cases, semantic distinctions and evaluation methods. They do not select our implementation source or certify the code we will build.

## Read by responsibility

| Reader's question                                           | Current source                                                                                                                                                                                   | What it owns                                                                                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| How do we build and reduce effort?                          | [Algorithms and data structures governance](algorithms-and-data-structures-governance-2026-09-08.md)                                                                                             | Own implementation, reference surveys, provenance, independent qualification and total effort assessment.                      |
| What qualifies a Reliable Atom or composition?              | [General architecture](reliable-atoms-and-composition-architecture-2026-09-08.md)                                                                                                                | Smallness, exact contracts, comprehensive tests/mutation tests/documentation, dependencies and complexity across the ensemble. |
| What does the graph library provide and how is it composed? | [Graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md)                                                                                                          | Invariant ownership, lawful models, narrow access capabilities, transformations and lifecycle boundaries.                      |
| How is comprehensive coverage made inspectable?             | [Capability contracts](graph-library-capability-contracts-2026-09-08.md) and [requirements register](graph-library-requirements-register-2026-09-08.json)                                        | Required models, operations, interactions and stable leaf coverage; missing implementation remains missing.                    |
| Which semantic distinctions matter?                         | [Shared vocabulary](typescript-graphs-concept-map-and-reference.md) and [addressable relationships](addressable-relationships-rdf-quads-and-identity-2026-09-08.md)                              | Models, levels, dimensions and seams; relationship/content/assertion/occurrence identity and RDF distinctions.                 |
| What do the contracts mean in concrete cases?               | [Graph examples](graph-library-worked-examples-2026-09-08.md), [general examples](reliable-atoms-worked-examples-2026-09-08.md) and [queue specification](oce-queue-reliable-atom-2026-09-08.md) | Exact example profiles, expected success/rejection traces, boundaries and remaining implementation evidence.                   |
| What did review change and what work remains?               | [Graph delivery record](graph-library-review-and-delivery-2026-09-08.md)                                                                                                                         | Design warrants, attributed prior reviews, work packages and reopening observations.                                           |
| What did the wider library contribute?                      | [Source review](foundations-source-review-2026-09-08.md)                                                                                                                                         | Inspected sources, evidence limitations, preserved findings and dispositions.                                                  |

The project instructions and vocabulary describe the source research project. OCE's current `AGENTS.md`, principles, canonical skills, plan and PR procedures govern repository work. A draft bundle is reviewable architecture and policy material; its presence does not claim qualified graph implementations or passed implementation gates.

## Design value carried from the research

**Separate model, authority and computational access.** A model's mathematical distinctions do not force one physical store or a universal RDF representation. RDF is a required peer capability. An operation can consume lawful narrow access without materialising every other capability. An implicit source may expose successors without whole-source enumeration; algorithm premises determine what can be concluded.

**Preserve identity through complete journeys.** Relationship instances, statement content, assertion acts, source occurrences, graph membership, domain IDs and implementation handles have different equality and lifecycle laws. An edge-bearing path identifies the selected parallel relationship. Equal quads do not preserve repeated assertion acts. Reconstructed topology does not by itself prove safe future identifier allocation or preserve historical reference meaning.

**Make state ownership concrete.** Topology, payloads and indexes can have different mutation risks. A composition owns coherent publication, failure-state validity, iterator lifetime and derived-state invalidation where its contract promises them. Validate fallible input before shared mutation where possible. An exception translated into a result does not establish recovery. Current access policy and immutable retained data are separate contracts; already disclosed consumer copies are outside a managed handle's revocation boundary.

**Qualify seams as operations.** A mapping names its exact preserved semantics, losses, identity associations, update behaviour and costs. Reconstructable storage does not establish lawful lifting of an algorithm's result. Hyperarc conjunction, metadata paths, temporal journeys and parallel-edge aggregation provide concrete counterexamples. Compare maintained indexes and incremental views with independently understandable rebuilt results over the same source revisions and policies.

**Separate reference inspiration from qualification evidence.** Historical defect cases can expose missing laws and broaden our adversarial fixtures. Reference implementations, their documentation and their tests may share a defect. Independently derived laws, small reference models and complete composition cases qualify our implementation at its actual responsibility. Mutation testing adds meaningful fault detection within that implementation; it cannot prove the specification contains every required behaviour.

## Implementation sequence within the current policy

This sequence describes future implementation work; this document does not report it as executed.

| Step | Deliverable                                                                                                                          | Decision or evidence it supplies                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| 1    | A coherent capability journey with exact identity, model, ownership, execution and outcome contracts.                                | Establishes which responsibilities must compose and which catalogue leaves are exercised.                                         |
| 2    | A bounded survey of the best relevant openly licensed examples, including composition approaches and contrasting mechanisms.         | Resolves named uncertainties; records learned laws, structures, assumptions, alternatives and counterexamples under the governor. |
| 3    | Our smallest coherent atom implementations and the intermediate compositions that own recurring coordination.                        | Makes boundaries concrete without imposing one atom per function/package or copying an engine's entire architecture.              |
| 4    | Independent semantic checks, complete contract tests, comprehensive mutation campaigns, documentation and public-consumption checks. | Qualifies exact implementations and distinguishes missing evidence from supported scope.                                          |
| 5    | Failure, change, reconstruction and cross-model journeys using the qualified public interfaces.                                      | Tests guarantees created across boundaries and exposes duplicated consumer obligations or invalid result lifting.                 |
| 6    | Updated support and design records, with actual survey, assurance, integration and evolution observations.                           | Enables honest progress reporting and later boundary refinement; no unmeasured saving or comprehensive-completion claim.          |

Graph and non-graph foundations share useful responsibilities—ordering, exact arithmetic, identity, indexing, queues, windows and retained values—without requiring every graph operation to depend on a universal collections package. Survey findings may serve several related atoms. A composition receives its own investigation when it introduces materially different laws or coordination costs.

## Historical evidence and receiving boundaries

The 7 September report and evidence describe OCE commit `dfe92492711f8d7c6ac8233735994c8fada45e0e`; the 8 September capability investigation inspected selected OCE source at `3864af2253a1a00feb4850a7594bee18dc4072d0`. These are historical baselines. Read current receiving-repository sources before implementing or treating an old diagnosis as a present defect.

The later investigation recorded six reconstructed entrypoints and 49 expected case outcomes, including adverse observations. Its reconciliation distinguishes the older RDF script's **15 logged observations** from assertion-based conformance checks. The corpus review for this bundle reads those records without rerunning their scripts. Source-bundle hash consistency establishes byte correspondence, not behavioural correctness.

Historical benchmarks use specified outputs, runtimes, graphs and publication contracts. Early unequal-output timings cannot become a fair speed ranking; later common-contract measurements still do not measure total ownership or universal performance. Full upstream conformance, current OCE/browser/worker qualification and comprehensive mutation evidence for our future library remain separate work.

Existing OCE graph research and the general data-structure research associated with PR 70 are useful discovery surfaces. The new draft bundle should have reciprocal navigation from the appropriate current repository documents. Its governor owns the current implementation policy; prior source evidence retains its dated attribution and does not acquire authority merely through a cross-link.
