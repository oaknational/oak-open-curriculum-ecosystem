---
boundary: B2-Architecture
doc_role: reference
authority: addressable-relationships-rdf-quads-and-identity
status: active
last_reviewed: 2026-09-09
---

# Addressable relationships, RDF quads and identity

**Date:** 8 September 2026

**Status:** shared vocabulary and conceptual findings; representation choices remain open within the owner-selected implementation policy.

**Shared baseline:** [Typescript Graphs concept map and reference](typescript-graphs-concept-map-and-reference.md). **Governing policy:** [algorithms and data structures governance](algorithms-and-data-structures-governance-2026-09-08.md). Our implementation uses SMALL Reliable Atoms and composition layers; openly licensed designs inform its contracts and mechanisms.

## Capability and identity

The shared capability name is **addressable relationships and statements about relationships**: make a relationship, its content or an assertion of it an explicit target of further information. “Addressable” means referable under a declared identity scheme. RDF is itself a graph model; its mechanisms illustrate this general capability.

Distinguish the target before selecting an encoding:

| Target            | Meaning                                                         | Example                                              |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| Relation type     | The kind of relationship and its rules.                         | Whether `knows` is symmetric.                        |
| Edge instance     | One identified structural relationship in a chosen graph model. | Edge `e17` connects Alice to Bob.                    |
| Statement content | What is expressed, independently of who expresses it.           | “Alice knows Bob.”                                   |
| Assertion         | An attributable act or record of asserting that content.        | Carol asserts it on Tuesday.                         |
| Occurrence        | A particular appearance in a source or representation.          | The sentence at one location in a document revision. |

These mappings need not be one-to-one. Two assertions can share content; one assertion can have several source occurrences; a computational edge can aggregate multiple assertions. A meta-graph of **edge definitions** usually describes relation types. A graph describing **particular edges or assertions** addresses a different target. Separate physical graphs are optional in either case.

## Representations

**Reification** introduces a node representing a relationship or statement, with subject, relation-type and object connections. Other edges describe that node, making relationship information reachable through ordinary node references.

**Native edge references** expose identified edges as referable graph elements. An edge identifier alone does not make an edge a legal endpoint: the API must specify whether references occur as endpoints, property values or external lookup handles. Native edge references and reified nodes are interchangeable **only for declared preserved semantics**; changing representation can change identity, multiplicity, traversal and lifecycle behaviour.

**Edge attributes** suffice for information within their value and identity contract, such as a numeric weight. A scalar property does not automatically provide independently identifiable assertions, arbitrary relationships to other entities, or statements about the attribute itself. Structured reference properties can support more, but need explicit semantics.

## RDF statements about statements

RDF 1.2's **triple term** represents subject–predicate–object structure. In the inspected 7 April 2026 Candidate Recommendation Snapshot, triple terms occur in the **object position** of RDF triples; they are not general-purpose subject terms. A **reifier** is a resource associated with a triple term through `rdf:reifies`. Merely using a triple term or reifying a triple does not assert the represented triple. These distinctions are specified in [RDF 1.2 Concepts, §§1.5 and 3.6](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/).

In this schematic encoding, the final column is an **application interpretation**, not an automatic RDF inference:

| Subject   | Predicate     | Object                               | Intended interpretation                   |
| --------- | ------------- | ------------------------------------ | ----------------------------------------- |
| `:claim1` | `rdf:reifies` | triple term `(:alice, :knows, :bob)` | Claim record concerns this content.       |
| `:claim1` | `:assertedBy` | `:carol`                             | Carol is the attributed asserter.         |
| `:claim2` | `rdf:reifies` | the same triple term                 | Another record concerns the same content. |
| `:claim2` | `:assertedBy` | `:dave`                              | Dave is its attributed asserter.          |

`rdf:reifies` is generic: it does not itself classify its subject as an assertion act, guarantee one reifier per content, or impose a one-triple-per-reifier application constraint. Define assertion and occurrence profiles separately, including attribution and whether the underlying relationship is asserted. [RDF 1.2 reification](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/)

## Quads and named graphs

A quad records **subject, predicate, object and graph position**. The fourth component selects membership in a named graph or identifies the default graph in the relevant API. RDF/JS represents ordinary triples as `Quad` with a `DefaultGraph` marker. An RDF dataset contains a default graph and named graphs; the default graph is not automatically their union. The graph position is neither an edge ID nor automatic provenance. [RDF datasets](https://www.w3.org/TR/rdf11-concepts/#section-dataset), [RDF/JS Quad](https://rdf.js.org/data-model-spec/#quad-interface)

Thus `(Alice, knows, Bob, g1)` and `(Alice, knows, Bob, g2)` place the same triple in two graph contexts. RDF graphs are sets: **the same quad does not identify repeated assertion acts**. Repeating a serialized line does not create an additional assertion identity in the abstract dataset. Quads alone also cannot record an empty named graph. [RDF graphs](https://www.w3.org/TR/rdf11-concepts/#section-rdf-graph), [N-Quads](https://www.w3.org/TR/n-quads/)

A UUID-based IRI can name a graph under a **one-assertion-per-graph convention**. Appropriate UUID generation provides practical global uniqueness, not an absolute guarantee. The application supplies the identifier’s meaning and relation to assertion identity. One assertion can concern multiple triples; triple count alone does not determine the graph’s role. This is an available convention, **not a project decision**. Naming a graph does not make it an assertion or establish its source. [UUID uniqueness](https://www.rfc-editor.org/rfc/rfc9562.html#section-6.8), [RDF datasets](https://www.w3.org/TR/rdf11-concepts/#section-dataset)

## Contracts and open choices

For each representation seam, specify:

- **Identity and preservation:** which edge, content, assertion, occurrence and graph identities survive; how duplicates and aggregation behave.
- **Lifecycle:** what deletion, replacement, revision and dangling references mean; whether historic assertions remain addressable.
- **Traversal:** which relationships count as domain adjacency, which expose metadata, and whether reification changes path length or reachability.
- **Round trips:** the explicit equivalence relation, including graph membership, blank-node treatment and empty graphs where relevant; unsupported cases and failure behaviour.

Open choices are which consumers require which identities, when native references or reified nodes simplify their contracts, and when graph context should carry grouping versus application-defined assertion scope. No universal representation, UUID strategy or package boundary is selected here. The [capability catalogue](graph-library-capability-contracts-2026-09-08.md) owns the required RDF and addressability profiles; this conceptual note does not narrow them.

Survey reference designs for explicit edge handles, reified nodes, assertion ledgers, reference indexes and preserving exchange. Compare their laws and lifecycle costs at the responsibility they inform. A familiar representation may be used where it earns the contract; originality does not require mechanism divergence. Qualify our exact composition with independently derived identity laws and the three-assertion journey [GEX02](graph-library-worked-examples-2026-09-08.md), including an assertion-specific reference, unasserted content and retraction preserving other support. This report records conceptual and specification findings; it includes no executed implementation or conformance evidence.
