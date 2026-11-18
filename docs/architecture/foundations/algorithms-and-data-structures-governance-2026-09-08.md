---
boundary: B2-Architecture
doc_role: policy
authority: own-built-foundations-development-policy
status: active
last_reviewed: 2026-09-25
---

# Algorithms and data structures: governing development policy

25 September 2026 · revision 2 · owner-established working policy

## 1. Decision and intended value

**We author and maintain our own algorithms and data structures, including graph and non-graph capabilities, as Capability Foundations: small completed Primitives and meaningful Components and Subsystems. We survey the best openly licensed examples and use what they teach us to design the capabilities, algorithms, contracts, representations, structures and compositions.**

The repository owner established this direction on 8 September 2026 and requested its documentation. It is the current implementation-origin policy. The precise mechanisms and decomposition remain design decisions governed by the requirements and evidence below. A future change of acquisition policy is an owner decision; elapsed time does not expire this one.

The intended value is a coherent foundation whose behaviour can be understood, comprehensively assured, composed and changed within the estate. Research reuses accumulated engineering knowledge: established mechanisms, explanations, contract distinctions, counterexamples and experience. Our ability to evolve those foundations coherently is an architectural objective. Net effort savings are an empirical hypothesis to assess over delivered capabilities and subsequent changes.

## 2. Scope and authority

The owner accepts substantial upfront definition, proof, implementation and assurance
cost so complete supported capabilities can be finished and reused permanently.
New functionality defines a new scope; defects reopen affected claims. The
[adoption profile](capability-foundations-adoption.md) owns the concrete completion
criteria and first-build contracts. Consumer count is not an admission,
qualification, publication or retention criterion. Package decisions still account
for cohesion, actual dependencies, platform and release responsibility.

This policy governs algorithm and data-structure implementation within the foundations programme, from local mechanisms through reusable compositions. It includes graph construction, identity and incidence structures, graph operations and applicable query/numerical mechanisms; and non-graph collections, ordering, selection, indexing, checked arithmetic, intervals, buffers, windows and related algorithms. It applies to new capability and to deliberate replacement or reconstruction within that scope.

The underlying language/runtime and canonical shared facilities have declared trust and dependency contracts. Higher products also consume separately governed protocol, storage, transport and platform capabilities. A boundary must identify which responsibility is owned here and which is supplied by a declared dependency. A facade does not change the acquisition classification of the mechanism it contains. Standards conformance, public interoperability and canonical estate types remain binding where applicable.

Scope is established through owner direction and declared offered value. Consumer journeys guide semantics, design and sequencing; innovation can establish useful capabilities before existing applications consume them. Qualification addresses the exact promised scope. Publication as a separate package is a further delivery decision based on cohesion, consumption, dependency budget and release responsibility.

The [general architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) owns the common requirements R01–R10 and C01–C08. The [graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md) and [capability catalogue](graph-library-capability-contracts-2026-09-08.md) own graph-specific coverage and laws. This document owns implementation origin, reference research and the relationship between learning, design and qualification. The [bundle index](foundations-bundle-index-2026-09-08.md) locates each authoritative concern.

## 3. Design from responsibilities and complete journeys

Name the useful responsibility, admitted values, observable results, invariants and failure/state contract before selecting its mechanism. Survey references to challenge that initial contract as well as to discover implementations. Close the contract for the chosen baseline before claiming that an implementation satisfies it; record later contract changes explicitly.

Choose the smallest coherent boundary that owns its laws and removes repeated reasoning. Internal helpers can belong to the same atom. A composition owns the additional coordination, interpretation or invariant created by connecting independently specified capabilities. Each validating composition sits above the capabilities it consumes and controls publication or other mutation that could bypass its invariant.

Explore bottom-up mechanisms alongside sufficiently complete top-down journeys. Useful observations include a queue's stable removal order, a window's unchanged state on rejected replacement, a graph edit's coherent publication, and assertion-specific retraction through a derived view. These journeys reveal obligations that individual-component tests cannot establish.

Evaluate complexity within atoms, between atoms, within compositions, between compositions, across atom–composition boundaries and across the whole ensemble. Repeated conversions, duplicated knowledge, widespread edits and consumer maintenance of private invariants are concrete evidence to reconsider a boundary. Several useful composition layers can exist within a module or package. The common architecture owns the detailed comparison and feedback method.

## 4. Reference research that changes a design decision

A survey is bounded by the question it can resolve. Reuse existing reference knowledge, then investigate the unresolved mechanism or contract. The useful stopping point is sufficient evidence to select and explain the next design choice, including a serious search for counterexamples and limitations. A source count or an exhaustive ranking is not the completion criterion.

Choose references for the quality of the particular material: inspectable explanation and mechanism, clear laws, relevant semantics, test depth, documented limitations, historical defect evidence, meaningful cost analysis and an openly licensed basis for the material inspected. Maintenance and usage can provide context; neither substitutes for inspecting that material. Relevant examples can come from other languages or domains when their execution and representation assumptions are translated explicitly.

Study several genuinely different sources where their disagreement can expose an important design uncertainty. Shared lineage, copied tests, common benchmarks and repeated reports remain correlated evidence. A single clear reference can be sufficient for a familiar bounded mechanism when the contract has independent support. Research depth follows the uncertainty and consequence, while correctness and assurance requirements remain constant.

Each reference investigation records the following compactly, in the owning design record or reference register:

| Field                       | Required meaning                                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Responsibility and question | The atom/composition contract and the decision this investigation can change.                                                                                       |
| Exact reference             | Project/author, file or section, immutable revision or dated standard, source URL and inspection date.                                                              |
| Material and licence        | The code, documentation, tests or other material inspected, with the exact applicable notice and any unresolved scope. An unverified lead remains labelled as such. |
| Engineering knowledge       | Mechanism, representation, laws, contract choices, composition boundaries, costs, edge cases and failure behaviour learned.                                         |
| Applicability               | Matching assumptions, necessary translations, meaningful differences and unsupported scope.                                                                         |
| Alternatives and challenge  | Serious alternative mechanisms, relevant negative evidence and a counterexample capable of defeating the proposed choice.                                           |
| Authored design             | The chosen contract/mechanism and an independently intelligible explanation of why it fits.                                                                         |
| Qualification bridge        | Required laws, reference models, misuse cases, fault targets, cost checks and public-consumption evidence.                                                          |
| Provenance and uncertainty  | Source lineage, actual use of material, remaining gaps and evidence that would reopen the design.                                                                   |

This is an information contract, not a requirement for one new document or database per atom. Shared research records should remove repeated work and keep the implementation read path small.

## 5. Authorship and provenance

The implementation is authored against our contract. Choose a conventional mechanism when it is the clearest sound design. Similarity in the implementation of a well-understood algorithm is evaluated through correctness, clarity and provenance; novelty is not a qualification criterion.

Record what was actually inspected and used. Conceptual learning, quotations, adapted code and reused test material are distinct provenance facts. Relabelling adapted material as inspiration would make the record inaccurate. The selected production route is our own authored implementation; any proposed use that changes that route must be made explicit before it becomes part of the implementation.

Retain attribution and exact licensing evidence with the source record. Apply the adopting repository's rules for openly licensed sources to the particular material. A package's licence badge alone does not establish the status of every linked document, test corpus or third-party fragment. This policy supplies no blanket legal clearance for a source collection.

AI assistance can support discovery, explanation, authoring and fault generation. Its output receives the same source, semantic, review and assurance discipline as other contributions. Multiple generated accounts of one source do not supply independent corroboration.

## 6. Qualification independent of inspiration

The comprehensive testing, mutation-testing, documentation, type and consumption requirements remain in the common architecture. Qualification binds the actual implementation, contract, dependencies, execution assumptions and evidence revisions. A proposed design, familiar algorithm or successful example is a candidate until the applicable requirements are satisfied.

Use independently derived laws and straightforward semantic models where they discriminate faults. A model should be understandable without relying on the optimized mechanism's helpers or incidental representation. Differential testing against a reference requires a stated semantic crosswalk: compare only the operations and premises that agree, and investigate disagreements rather than assuming either implementation is authoritative.

Tests inspired by upstream defects are useful but retain their provenance. Mutation testing establishes discrimination against its stated fault population; it does not establish that the specification includes every necessary requirement. Challenge the specification itself through misuse analysis, composition journeys, independent models and plausible counterexamples.

| Scale               | Examples of evidence the owner must establish                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Atom                | Equality/order, exact occurrence conservation, arithmetic domain, bounds, ownership, normal absence, failure and post-failure state.            |
| Composition         | Compatible premises, state coherence, failure propagation, publication, resource lifecycle, and the new invariant or interpretation.            |
| Transformation      | Declared preservation/loss, reference and occurrence mappings, soundness/completeness directions, witness transport and exact round-trip scope. |
| Complete capability | Features survive the relevant construction, computation, update, read and exchange journey under the named execution/profile contract.          |
| Evolution           | Changed assumptions reopen affected qualification; actual public consumers and maintenance changes expose coupling and cost.                    |

Reference quality does not automatically transfer to authored code, and atom qualification does not automatically transfer to its compositions. Those transfers require their own evidence.

## 7. Effort, learning and review

Assess effort across research, specification, implementation, assurance, documentation, integration, diagnosis and maintenance at comparable capability and quality. Code volume, generated-code throughput and runtime dependency count are incomplete proxies. Distinguish analytical cost arguments, observed operation counts, measured runtime behaviour and measured engineering effort.

Capture information already produced by delivery and change work: repeated consumer obligations removed, conversion and coordination costs, defects caught or escaped, scope of a later contract change and time spent investigating inherited assumptions. Avoid a separate measurement apparatus whose cost exceeds the uncertainty it can resolve. No quantitative savings claim is made by this baseline.

Reconsider an atom or composition boundary when failures reveal a misplaced invariant, repeated coordination, unaffordable cost under its declared model, incompatible identity/precision assumptions or changes spreading across supposedly independent responsibilities. Research can then target that exact question. The policy's empirical promise is tested by coherent, qualified capabilities that remain economical to change.

## 8. Delivery and evidence status

Delivery proceeds through small coherent increments, with the complete capability requirements visible throughout. Each increment owns an exact contract and the assurance needed for the claims it makes. Shared qualification tools and canonical vocabulary are reused where they reduce ensemble complexity. Implementation location follows actual dependencies and release needs.

This bundle defines policy, architecture, capability contracts, candidate designs, worked expectations and a source review. It does not contain a qualified new queue or graph implementation. Research evidence remains tied to the source revisions and executions that produced it. The [source review](foundations-source-review-2026-09-08.md) distinguishes those observations from the decisions and inferences made for this bundle.

The governing direction is owner-established. Repository integration is a documentation change on the default branch; implementation qualification is a separate event. Subsequent implementations re-ground the current OCE directives and applicable gates at delivery time.
