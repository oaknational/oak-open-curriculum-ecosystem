# Research direction: Stable-first JSON / JSON-LD graph utilities with RDF semantics and future-standard migration paths

> **This is a research direction, not a plan.** It captures one well-supported
> shape for a general graph-handling layer, plus first-wave Oak ingestion scope.
> The executable plan that consumes this direction is
> [`.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md`](../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md);
> the topology decision lives in **ADR-168**.

**Date:** 4 May 2026 (last revised 7 May 2026 — Option B applied:
**RDF 1.2-native internals**, JSON-LD 1.1 wire, **Oak first-wave ingestion
scope**, and a **canonical Standards-evolution tripwire map** in §19).
**Scope:** A small library or collection of utilities for ingesting, enhancing, normalising, validating, querying, and exporting graph-like JSON or JSON-LD.

## Executive summary

A strong design is to build a **stable-first graph utility library** with:

- **JSON-LD 1.1** as the wire syntax (JSON-LD 1.2 is not yet stable; targeted Q4 2027 per the W3C JSON-LD WG charter).
- **RDF 1.2-native internal model** (W3C Candidate Recommendation Snapshot, 7 April 2026). Triple terms are first-class members of the canonical `Term` union from day one (§4); statement-level annotations are first-class internal types, not a shim. The library emits **RDF 1.1-compatible quads on the wire**, lowered from the RDF 1.2-native internals via a `RelationshipRecord` projection on JSON-LD 1.1 emit (§8). When JSON-LD 1.2 reaches Recommendation, the projection becomes one supported wire profile rather than the canonical wire shape (§19, tripwire #1).
- **schema.org**, **RDFS**, **SKOS**, **PROV-O**, **Dublin Core Terms**, **OWL 2**, **SHACL** as the vocabulary baseline.

The library should not merely manipulate JSON trees. It should treat JSON and JSON-LD as inputs, then normalise them into a semantic graph model with explicit identifiers, predicates, source mappings, validation, provenance, and property-graph-style interaction APIs.

The recommended posture is:

> Use only stable standards on the wire and in public APIs. **Design internally to RDF 1.2** so that when JSON-LD 1.2 reaches Recommendation, the library upgrades by adding emit/parse adapters rather than reshaping the canonical model. SPARQL 1.2 and SHACL 1.2 are tracked the same way.

The practical architecture is:

```text
Plain JSON / JSON-LD input
        ↓
Ingestion and graph-shape detection
        ↓
JSON-LD 1.1 processing
        ↓
RDF 1.1-compatible quad dataset
        ↓
Vocabulary-aware enhancement
        ↓
Validation and provenance
        ↓
Property-graph-style interaction APIs
        ↓
JSON-LD / RDF / property-graph / application exports
```

## 1. Recommended stable foundation

The stable baseline should be:

| Concern                               | Recommended stable basis                                                                                        | Role in the library                                                                   |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| JSON-linked-data syntax               | [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)                                                                 | Primary standards-based JSON representation for graph data                            |
| JSON-LD processing                    | [JSON-LD 1.1 Processing Algorithms and API](https://www.w3.org/TR/json-ld11-api/)                               | Expansion, compaction, flattening, conversion into RDF-compatible data                |
| JSON-LD tree views                    | [JSON-LD 1.1 Framing](https://www.w3.org/TR/json-ld11-framing/)                                                 | Stable way to shape graph data back into predictable JSON trees                       |
| Graph data model                      | [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/) — wire-stable today; internals aligned with [RDF 1.2 Concepts](https://www.w3.org/TR/rdf12-concepts/) (CR Snapshot 7 April 2026) | Canonical semantic model: subject–predicate–object triples and datasets, designed for the RDF 1.2 triple-term path. |
| RDF schema vocabulary                 | [RDF Schema 1.1](https://www.w3.org/TR/rdf-schema/)                                                             | Basic classes, properties, labels, comments, domain/range hints                       |
| Web vocabulary                        | [schema.org](https://schema.org/) and [schema.org data model](https://schema.org/docs/datamodel.html)           | Default vocabulary for common public entities and relationships                       |
| Validation                            | [SHACL](https://www.w3.org/TR/shacl/)                                                                           | Semantic validation of RDF graphs using shapes                                        |
| Provenance                            | [PROV-O](https://www.w3.org/TR/prov-o/)                                                                         | Represent derivation, generation, attribution, activities, and agents                 |
| Taxonomies                            | [SKOS Reference](https://www.w3.org/TR/skos-reference/)                                                         | Controlled vocabularies, concepts, broader/narrower relationships                     |
| Ontology modelling                    | [OWL 2 Overview](https://www.w3.org/TR/owl2-overview/)                                                          | Stronger ontology constructs where needed, used selectively                           |
| Metadata                              | [DCMI Metadata Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/)                        | Titles, creators, dates, subjects, sources, rights, licenses                          |
| Query interoperability                | [SPARQL 1.1 Query Language](https://www.w3.org/TR/sparql11-query/)                                              | Optional export/query compatibility, not necessarily the primary app API              |
| RDF dataset hashing / signing support | [RDF Dataset Canonicalization 1.0](https://www.w3.org/TR/rdf-canon/)                                            | Canonicalisation for stable hashes, signatures, comparison, deduplication             |
| JSON document addressing              | [JSON Pointer, RFC 6901](https://datatracker.ietf.org/doc/html/rfc6901)                                         | Stable paths into source JSON documents                                               |
| JSON patching                         | [JSON Patch, RFC 6902](https://datatracker.ietf.org/doc/html/rfc6902)                                           | Stable representation of document-level changes                                       |
| JSON querying                         | [JSONPath, RFC 9535](https://www.rfc-editor.org/rfc/rfc9535)                                                    | Stable selector language for extracting parts of arbitrary JSON                       |
| JavaScript RDF interface              | [RDF/JS Data Model](https://rdf.js.org/data-model-spec/) and [RDF/JS Dataset](https://rdf.js.org/dataset-spec/) | Practical TypeScript/JavaScript-compatible interface for terms, quads, datasets       |
| Property-graph concepts               | [ISO/IEC 39075:2024 GQL](https://www.iso.org/standard/76120.html)                                               | Conceptual influence for property-graph projections, not the canonical JSON-LD format |

## 2. Active state of newer standards

The system should be designed with these emerging standards in mind, but not depend on them in the stable core.

| Area                       | Current state                                                                                                                                                                                    | Design implication                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| RDF 1.2                    | [RDF 1.2 Concepts](https://www.w3.org/TR/rdf12-concepts/) and [RDF 1.2 Semantics](https://www.w3.org/TR/rdf12-semantics/) are W3C Candidate Recommendation Snapshot documents as of 7 April 2026 | **Design target for internal types** (triple terms, statement-level annotation patterns) so that JSON-LD 1.2 lands as an emit/parse adapter. Persisted/wire form remains RDF 1.1-compatible until JSON-LD 1.2 is stable. |
| JSON-LD 1.2                | The [JSON-LD Working Group Charter](https://www.w3.org/2026/01/json-ld-wg-charter.html) targets JSON-LD 1.2 Recommendation in Q4 2027                                                            | Keep context handling disciplined and adapter-based                                                                                |
| JSON-LD 1.3 / JSON-LD-star | Listed as tentative future work in the [JSON-LD Working Group Charter](https://www.w3.org/2026/01/json-ld-wg-charter.html), related to RDF 1.2 compatibility                                     | Treat as a future import/export profile, not a core syntax                                                                         |
| SPARQL 1.2                 | [SPARQL 1.2 Query Language](https://www.w3.org/TR/sparql12-query/) is a Working Draft                                                                                                            | Keep RDF data query-compatible; expose SPARQL 1.1-compatible behaviour by default                                                  |
| SHACL 1.2                  | Drafts such as [SHACL 1.2 Core](https://www.w3.org/TR/shacl12-core/) and [SHACL 1.2 Rules](https://www.w3.org/TR/shacl12-rules/) are active                                                      | Use SHACL 1.0 as the stable baseline; leave room for SHACL 1.2 extensions                                                          |
| GQL                        | [ISO/IEC 39075:2024](https://www.iso.org/standard/76120.html) is published and stable                                                                                                            | Useful for property-graph thinking, query semantics, nodes, edges, labels, and properties; not a JSON-LD/RDF replacement           |

The most important future feature is RDF 1.2’s support for triple terms. RDF 1.2 Concepts allows the object of an RDF triple to be another triple, which creates a standards path toward statement-level metadata. That matters for relationship properties, confidence, provenance, annotation, and property-graph-style edge metadata. However, because RDF 1.2 is not yet a final W3C Recommendation and JSON-LD support for RDF 1.2 triple terms is still in transition, the stable system should model edge metadata explicitly today.

## 3. Core design position

The library should be described as:

> A stable-first utility layer for graph-like JSON and JSON-LD that normalises data into RDF-compatible quads, enhances it with vocabulary-aware mappings, validates it with graph shapes, and exposes ergonomic property-graph-style operations while preserving standards-based JSON-LD and RDF semantics.

The key commitment is:

```text
JSON is the input surface.
JSON-LD is the web-native linked-data representation.
RDF is the canonical semantic graph model.
schema.org and related vocabularies provide semantic scaffolding.
Property-graph concepts provide ergonomic interaction and projection.
Enhancements are explicit, inspectable, and reversible.
Emerging standards are future adapter targets, not current dependencies.
```

## 4. Canonical internal model

The canonical internal model is **RDF 1.2-native** — triple terms are
first-class members of the `Term` union, matching the RDF 1.2 abstract syntax
(W3C Candidate Recommendation Snapshot, 7 April 2026). The library is
therefore RDF 1.2-native from day one for ingestion, internal modelling,
validation, and projection.

Wire-format compatibility with JSON-LD 1.1 / RDF 1.1 is preserved by
*projecting* triple-term annotations to `RelationshipRecord` shapes on emit
(§8). When JSON-LD 1.2 reaches Recommendation, the projection becomes one
supported wire profile rather than the canonical wire shape and consumers
can opt into native triple-term syntax (see §19 — tripwire #1).

The data model aligns with RDF/JS concepts where they exist; for triple
terms the RDF/JS WG has not yet published a formal extension (tripwire #2
covers migration if our shape differs from the eventual published spec).

```ts
type Term =
  | NamedNode
  | BlankNode
  | Literal
  | DefaultGraph
  | TripleTerm;            // RDF 1.2 (CR Snapshot, 7 April 2026)

type TripleTerm = {
  termType: "TripleTerm";
  subject: Term;           // can itself be a TripleTerm (nested allowed)
  predicate: NamedNode;
  object: Term;            // can itself be a TripleTerm
};

type Quad = {
  subject: Term;           // includes TripleTerm in RDF 1.2
  predicate: NamedNode;
  object: Term;            // includes TripleTerm in RDF 1.2
  graph: Term;
};
```

Above that canonical layer, expose more practical abstractions:

```ts
type GraphNode = {
  id: string;
  types: string[];
  properties: Record<string, unknown>;
  sourcePaths?: string[];
};

type GraphEdge = {
  id?: string;
  from: string;
  predicate: string;
  to: string;
  properties?: Record<string, unknown>;
  sourceQuadIds?: string[];
  sourcePaths?: string[];
};

type GraphDocument = {
  source: unknown;
  contexts: JsonLdContext[];
  dataset: DatasetCore;
  nodes: () => GraphNode[];
  edges: () => GraphEdge[];
  relationshipRecords: () => RelationshipRecord[];
  enhancements: EnhancementRecord[];
  warnings: GraphWarning[];
};
```

The important distinction is:

```text
RDF quads are the semantic normal form.
Nodes and edges are ergonomic views.
Relationship records are stable edge-metadata objects.
Property graphs are projections, not the canonical truth.
```

## 5. Vocabulary layer

The library should include a vocabulary registry rather than hard-coding schema.org only.

Recommended default vocabularies:

| Vocabulary                                                                             | Use                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [schema.org](https://schema.org/)                                                      | Common public entities: `Person`, `Organization`, `CreativeWork`, `Article`, `Dataset`, `Place`, `Event`, `Action`, `Product`, `Thing`; common properties such as `name`, `description`, `about`, `creator`, `mentions`, `sameAs`, `hasPart` |
| [RDF Schema](https://www.w3.org/TR/rdf-schema/)                                        | `rdfs:Class`, `rdfs:label`, `rdfs:comment`, `rdfs:subClassOf`, `rdfs:domain`, `rdfs:range`                                                                                                                                                   |
| [SKOS](https://www.w3.org/TR/skos-reference/)                                          | Concepts, taxonomies, thesauri, `skos:Concept`, `skos:broader`, `skos:narrower`, `skos:prefLabel`, `skos:altLabel`                                                                                                                           |
| [PROV-O](https://www.w3.org/TR/prov-o/)                                                | Derivation, attribution, agents, activities, generated data, inferred/enhanced data                                                                                                                                                          |
| [Dublin Core Terms](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) | General metadata: title, creator, source, created, modified, license, rights, subject                                                                                                                                                        |
| [OWL 2](https://www.w3.org/TR/owl2-overview/)                                          | Ontology-level constructs such as equivalence, identity, inverse properties, and class/property modelling where required                                                                                                                     |
| [SHACL](https://www.w3.org/TR/shacl/)                                                  | Constraints and validation shapes                                                                                                                                                                                                            |

A vocabulary registry might look like this:

```ts
type VocabularyRegistry = {
  prefixes: Record<string, string>;

  knownClasses: Record<string, Iri>;

  knownProperties: Record<string, Iri>;

  preferredLabels: Record<Iri, string>;

  mappings: {
    jsonKey: string;
    predicate: Iri;
    targetClass?: Iri;
    confidence?: number;
  }[];
};
```

This allows the library to make context-sensitive mappings such as:

```text
"title"       → schema:name or dcterms:title
"author"      → schema:author or dcterms:creator
"tags"        → schema:keywords or skos:Concept links
"category"    → skos:Concept
"createdAt"   → dcterms:created
"source"      → dcterms:source or prov:wasDerivedFrom
"sameAs"      → schema:sameAs or owl:sameAs, depending on strength of claim
```

## 6. Ingestion modes

The library should not assume every input is already valid JSON-LD. It should support multiple ingestion modes.

```text
strict-jsonld
  Input must already be valid JSON-LD 1.1.

jsonld-compatible
  Input is ordinary JSON with @context, @id, @type, or inferable linked-data structure.

plain-json-tree
  Nested objects and arrays are treated as candidate nodes, properties, or relationships.

records
  Arrays of objects are treated as entity records; IDs and foreign-key-like fields are detected.

node-edge-list
  Structures such as { nodes, edges } are interpreted as property-graph-style inputs.

custom-mapping
  User supplies explicit mappings from JSON paths to RDF classes, predicates, and node IDs.
```

For arbitrary JSON, use [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) for exact source locations and [JSONPath](https://www.rfc-editor.org/rfc/rfc9535) for selectors over source documents.

Example source mapping:

```ts
type SourceMapping = {
  sourcePath: string;        // JSON Pointer, e.g. "/items/0/author"
  selector?: string;         // JSONPath, e.g. "$.items[*].author"
  outputQuadIds: string[];
  outputNodeIds?: string[];
  outputEdgeIds?: string[];
};
```

## 7. Enhancement model

Enhancement must be explicit. The library should never silently turn ambiguous JSON structure into semantic claims without recording what it did.

```ts
type EnhancementRecord = {
  id: string;

  kind:
    | "stable-id-generated"
    | "json-key-mapped"
    | "schemaorg-type-mapped"
    | "predicate-normalized"
    | "literal-normalized"
    | "relationship-record-created"
    | "concept-linked"
    | "sameas-linked"
    | "provenance-added"
    | "inferred-type";

  sourcePath?: string;
  inputTerms?: string[];
  outputQuadIds?: string[];
  outputNodeIds?: string[];
  outputEdgeIds?: string[];
  confidence?: number;
};
```

This is important because enhancement can easily become semantic corruption.

For example:

```json
{
  "author": "Jim"
}
```

Mapping that to a literal is relatively conservative:

```text
_:article schema:author "Jim" .
```

Mapping it to an identified person is stronger:

```text
_:article schema:author <https://example.org/people/jim> .
```

The second transformation should be represented as an enhancement with provenance and confidence.

## 8. Relationship records as the JSON-LD 1.1 emit projection

Relationship records are the **JSON-LD 1.1 emit projection** of RDF 1.2
triple-term annotations — not a substitute for them. Internally, edge
metadata is modelled as triple terms (§4); when emitting JSON-LD 1.1 — the
wire-stable default until tripwire #1 fires (§19) — those triple-term
annotations are projected to `RelationshipRecord` shapes so JSON-LD 1.1
consumers receive a clean, framable JSON-LD document.

Once JSON-LD 1.2 reaches Recommendation, the projection becomes one
supported wire profile rather than the canonical wire shape, and consumers
can opt into native triple-term syntax (see §19 — tripwire #1).

Example:

```json
{
  "@context": {
    "kg": "https://example.org/kg/",
    "schema": "https://schema.org/",
    "source": { "@id": "kg:source", "@type": "@id" },
    "predicate": { "@id": "kg:predicate", "@type": "@id" },
    "target": { "@id": "kg:target", "@type": "@id" },
    "confidence": "kg:confidence",
    "wasDerivedFrom": { "@id": "http://www.w3.org/ns/prov#wasDerivedFrom", "@type": "@id" }
  },
  "@id": "https://example.org/relationships/r1",
  "@type": "kg:RelationshipRecord",
  "source": "https://example.org/articles/a",
  "predicate": "schema:about",
  "target": "https://example.org/concepts/json-ld",
  "confidence": 0.86,
  "wasDerivedFrom": "https://example.org/source-documents/doc1"
}
```

This is portable today, on the JSON-LD 1.1 wire. The internal RDF 1.2
triple-term annotation it projects from carries the same information; the
projection is reversible (a JSON-LD 1.1 RelationshipRecord round-trips back
to a triple-term annotation).

The internal type might be:

```ts
type RelationshipRecord = {
  id: string;
  source: NodeId;
  predicate: Iri;
  target: NodeId | LiteralValue;
  properties?: Record<Iri, unknown>;
  provenance?: ProvenanceRef[];
  sourceQuads?: string[];
  canProjectToStatementAnnotation?: boolean;
};
```

Important rule:

```text
A relationship record is the stable representation.
An RDF 1.2 triple-term annotation is a future export/import profile.
```

Not every relationship record should collapse into a future RDF 1.2 annotation. Some relationship records are meaningful entities in their own right.

## 9. Validation model

Use two different validation layers.

### Raw JSON validation

Use JSON Schema for the shape of incoming JSON where useful. [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12) is widely used and maintained, but it should validate raw document structure, not graph semantics.

Example concerns:

```text
Is this an array?
Does every record have an id?
Is createdAt a string?
Are required fields present?
```

### Graph validation

Use [SHACL](https://www.w3.org/TR/shacl/) for semantic graph validation.

Example concerns:

```text
Does every schema:Person have a schema:name?
Does every relationship record have source, predicate, and target?
Is the value of schema:about an IRI rather than a literal?
Does this class allow multiple values for this property?
Is this node closed to unknown predicates?
```

Recommended posture:

```text
JSON Schema validates source shape.
SHACL validates graph meaning.
```

## 10. Interaction API

The public interaction layer should be practical and property-graph-like, even though the canonical model is RDF-compatible.

Example API:

```ts
const doc = await GraphDocument.from(input, {
  baseIri: "https://example.org/data/",
  context,
  mode: "json-or-jsonld"
});

const enhanced = doc
  .withStableIds()
  .withVocabularyMappings()
  .withDetectedLinks()
  .withRelationshipRecords()
  .withProvenance();

const nodes = enhanced.nodes();
const edges = enhanced.edges();

const neighbours = enhanced.neighbours("https://example.org/people/jim");

const aboutJsonLd = await enhanced.toJsonLd({
  context,
  frame
});

const propertyGraph = enhanced.toPropertyGraph();

const report = enhanced.validate({
  shacl: shapes
});
```

Suggested operations:

```ts
graph.nodes()
graph.edges()
graph.node(id)
graph.edge(id)
graph.incoming(id)
graph.outgoing(id)
graph.neighbours(id)
graph.traverse({ from, via, depth })
graph.match({ subject, predicate, object, graph })
graph.describe(id)
graph.findByType(schema.Person)
graph.findByPredicate(schema.about)
graph.relationshipRecords()
graph.enhancements()
graph.validate(shapes)
graph.toJsonLd(options)
graph.toDataset()
graph.toPropertyGraph()
```

## 11. Property-graph projection

Property-graph concepts should be present as an ergonomic projection.

The projection can expose:

```ts
type PropertyGraph = {
  nodes: {
    id: string;
    labels: string[];
    properties: Record<string, unknown>;
  }[];

  edges: {
    id?: string;
    from: string;
    to: string;
    label: string;
    properties: Record<string, unknown>;
  }[];
};
```

This maps naturally onto GQL-style thinking: nodes, edges, labels, and properties. [GQL](https://www.iso.org/standard/76120.html) is useful conceptually because it standardises property-graph data structures and operations, but it should not replace JSON-LD/RDF as the canonical interchange model.

Recommended hierarchy:

```text
Canonical semantic representation:
  RDF-compatible dataset

Stable web representation:
  JSON-LD 1.1

Developer interaction representation:
  property-graph-style nodes and edges

Optional export representation:
  property graph, adjacency list, Cytoscape, Graphology, GQL-oriented shape
```

## 12. Future migration strategy

The system should be built around migration seams.

### Wire-format migration seam (formerly: RDF 1.2 migration seam)

The data model is already RDF 1.2-native (§4); the migration seam is the
**wire format**, not the data model.

Today (JSON-LD 1.1 wire — until tripwire #1 fires, §19):

```text
Internal:    triple-term annotation (RDF 1.2)
On emit:     RelationshipRecord projection (JSON-LD 1.1)
```

Future (JSON-LD 1.2 wire — when tripwire #1 fires):

```text
Internal:    triple-term annotation (unchanged)
On emit:     native JSON-LD 1.2 triple-term syntax (default)
             OR RelationshipRecord projection (back-compat profile)
```

Do not assume every edge property collapses neatly into a triple-term
annotation. Some relationship records are meaningful entities in their own
right and emerge as first-class nodes in either wire profile.

### JSON-LD 1.2 / 1.3 migration seam

Keep JSON-LD processing behind a versioned adapter:

```ts
type JsonLdProcessor = {
  version: "1.1" | "1.2" | "1.3-experimental";
  expand(input: unknown): Promise<unknown>;
  compact(input: unknown, context: unknown): Promise<unknown>;
  flatten(input: unknown): Promise<unknown>;
  frame(input: unknown, frame: unknown): Promise<unknown>;
};
```

Default:

```text
JSON-LD 1.1 only
```

Future:

```text
JSON-LD 1.2 adapter
JSON-LD 1.3 / RDF 1.2 compatibility adapter
```

### SPARQL 1.2 migration seam

Expose graph matching in a library-native API first:

```ts
graph.match({ subject, predicate, object, graph })
```

Then provide SPARQL export or query adapters:

```text
SPARQL 1.1-compatible query adapter today
SPARQL 1.2 adapter later
```

### SHACL 1.2 migration seam

Keep shape validation versioned:

```ts
type ShapeValidator = {
  profile: "shacl-1.0" | "shacl-1.2-experimental";
  validate(dataset: DatasetCore, shapes: DatasetCore): ValidationReport;
};
```

Default:

```text
SHACL 1.0 stable validation
```

Future:

```text
SHACL 1.2 features where useful
```

## 13. Suggested package structure

A small library can still be modular internally.

```text
graph-core
  RDF-compatible terms, quads, graph document model, node/edge views

graph-jsonld
  JSON-LD 1.1 expansion, compaction, framing, context management

graph-ingest
  JSON tree ingestion, record ingestion, node-edge-list ingestion, source maps

graph-vocab
  schema.org, RDF, RDFS, SKOS, PROV-O, DCTERMS, OWL helpers

graph-enhance
  ID generation, predicate mapping, type inference, link detection, relationship records

graph-validate
  JSON Schema wrappers for raw input
  SHACL wrappers for graph validation

graph-project
  property graph projection
  adjacency list projection
  visualisation exports

graph-canon
  RDF dataset canonicalisation, stable hashing, deduplication helpers

graph-future
  RDF 1.2, JSON-LD 1.2/1.3, SPARQL 1.2, SHACL 1.2 adapters
  not part of the stable default API
```

## 14. Design invariants for trivial migration

The following invariants should be enforced from the beginning:

```text
1. Every generated node can receive a stable IRI.
2. Every edge has a predicate IRI, even if displayed as a short label.
3. Edge metadata is represented as a first-class relationship record.
4. The original JSON source path is preserved.
5. Enhancements are recorded explicitly.
6. Named graph or source-scope boundaries are available internally.
7. Unknown JSON fields are preserved unless explicitly discarded.
8. JSON-LD contexts are versioned and controlled.
9. The core API does not expose draft-only syntax.
10. Export/import adapters are versioned.
11. Property-graph projection is derived, not canonical.
12. Validation distinguishes raw JSON structure from graph semantics.
13. schema.org terms are reused where appropriate.
14. Custom vocabulary terms are introduced only when existing vocabularies do not fit.
15. Future RDF 1.2 support is implemented as an adapter over stable relationship records.
```

## 15. Recommended stable API surface

A concise but powerful stable API could look like this:

```ts
const graph = await Graph.fromJson(input, {
  baseIri,
  context,
  ingestion: "json-or-jsonld"
});

graph.dataset();              // RDF/JS-compatible quads
graph.nodes();                // ergonomic node view
graph.edges();                // ergonomic edge view
graph.relationshipRecords();  // first-class edge metadata
graph.enhancements();         // transformations and inferred structures
graph.sourceMap();            // JSON Pointer / JSONPath links to source

graph.match({ predicate: schema.about });
graph.describe(nodeId);
graph.traverse({ from: nodeId, depth: 2 });

graph.validate({ shacl: shapes });
graph.toJsonLd({ context, frame });
graph.toPropertyGraph();
```

The API should let users work naturally with graph concepts without forcing them to write RDF or SPARQL for ordinary tasks.

## 16. What to avoid

Avoid these design choices:

```text
Using RDF 1.2 triple terms in stable persisted data today.
Depending on JSON-LD-star syntax.
Treating schema.org as sufficient for every domain.
Treating every nested JSON object as a semantic entity.
Throwing away source paths.
Collapsing relationship records into bare triples too early.
Making SPARQL the only query interface.
Making property-graph projection the canonical model.
Mixing validation, enhancement, and assertion without provenance.
Using draft-only standards in public APIs.
```

## 17. Recommended conclusion

The best architecture is:

```text
Stable on the wire:
  JSON-LD 1.1
  RDF 1.1-compatible datasets (lowered from RDF 1.2-native internals)
  SHACL 1.0
  schema.org and stable RDF vocabularies

Semantic in the middle (RDF 1.2-native):
  RDF 1.2-compatible quads with TripleTerm as a first-class Term member
  vocabulary registry
  triple-term annotations (projected to RelationshipRecord on JSON-LD 1.1 emit)
  source maps
  enhancement records
  validation reports

Ergonomic at the edges:
  nodes
  edges
  traversals
  property-graph projections
  framed JSON-LD
  JSONPath and JSON Pointer source access

Future-ready by design (tripwire-driven, see §19):
  JSON-LD 1.2 emit/parse adapter (tripwire #1)
  RDF/JS RDF 1.2 alignment migration (tripwire #2)
  SHACL 1.2 profile (tripwire #3)
  SPARQL 1.2 adapter (tripwire #4)
```

## 18. Oak Ontology repo data formats and first-wave ingestion scope

Added 7 May 2026.

### Oak Curriculum Ontology repo — formats and canonicality

The sibling [`oak-curriculum-ontology`](https://github.com/oaknational/oak-curriculum-ontology)
repo distributes the same logical content in multiple formats. Turtle is the
source of truth; everything else is a derived projection.

| Format | Files / scripts | Role |
|---|---|---|
| **Turtle (.ttl)** — RDF | `ontology/oak-curriculum-ontology.ttl`, `ontology/oak-curriculum-constraints.ttl` (SHACL), `data/**/*.ttl` (programme structure, threads, temporal structure, per-subject KS + knowledge-taxonomy) | **Source of truth**. Includes SHACL constraints. |
| **Property-graph JSONL** | `scripts/generate_pg_jsonl.py`, `scripts/validate_pg_jsonl.py`, `docs/property-graph-format.md` | Derived view |
| **Neo4j export** | `scripts/export_to_neo4j.py`, `scripts/export_to_neo4j_ARCHITECTURE.md` | Derived for Neo4j workloads |
| **SQL schema + Postgres / SQLite loaders** | `scripts/generate_sql_schema.py`, `scripts/load_rdf_to_postgres.py`, `scripts/load_rdf_to_sqlite.py` | Derived relational projections |
| **SPARQL test queries** | `scripts/test_sparql_queries.py` | Validation harness |
| **WIDOCO HTML docs** | `.github/workflows/generate-docs-widoco.yml` | Documentation projection |

**Decision (owner-set, 7 May 2026): the library imports Turtle (with SHACL)
directly from the ontology repo. The other projections are not first-wave
ingestion targets. Round-trip equivalence between Turtle and the derived
projections is asserted upstream and not re-verified by the graph stack.**

If a downstream Oak workload needs PG-JSONL, Neo4j-export, or SQL projections,
they remain available as exports of the canonical TTL and can be re-introduced
as ingestion modes when a concrete consumer demands them.

### First-wave ingestion scope

The first wave of import support targets four corpora:

1. **Oak Curriculum Ontology — Turtle + SHACL.** Direct ingestion of the
   ontology repo's `.ttl` distribution and its SHACL shapes. Canonical IRIs are
   honoured; node identity is ontology-anchored.
2. **Pre-requisite graph.** Built in this repo, so the on-disk format is a
   choice, not a constraint. Recommended emit shape: JSON-LD 1.1 with a stable
   Oak context, importable through the `jsonld-compatible` ingestion mode and
   round-trippable to RDF.
3. **Misconception graph.** Same posture as the prerequisite graph — emit
   shape is a choice. Recommended JSON-LD 1.1 with a stable Oak context.
4. **EEF Teaching and Learning Toolkit.** External dataset; we do not control
   its source format. The library must accept whatever EEF provides
   (currently a structured JSON corpus per
   [`eef-evidence-corpus.plan.md`](../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md))
   through the `jsonld-compatible` or `records` ingestion mode, with
   provenance recorded.

**Out of scope for first wave**: Oak ontology projections beyond Turtle
(PG-JSONL, Neo4j export, SQL); third-party knowledge graphs as data sources
(tracked separately in
[`external-knowledge-graph-data-source-integration.plan.md`](../plans/exploring-open-education-resources/external-knowledge-sources/future/external-knowledge-graph-data-source-integration.plan.md)).

## 19. Standards-evolution tripwires

This library is **RDF 1.2-native internally** and **JSON-LD 1.1 / RDF 1.1
on the wire**. The wire constraint is a deliberate concession to JSON-LD 1.1
stability and downstream interop. The tripwires below are the **canonical
list of work that activates as the ecosystem catches up**: each one names
*what to watch for*, *what changes*, and *what stays the same*. ADR-168
enumerates the same tripwires by name as binding commitments; the executable
plan ([`graph-stack.plan.md`](../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md))
schedules them as named follow-ons.

### Tripwire #1 — JSON-LD 1.2 reaches W3C Recommendation

- **Signal to watch**: <https://www.w3.org/TR/json-ld12/> moves from
  Candidate Recommendation to Recommendation. (W3C JSON-LD WG charter target:
  Q4 2027.)
- **Modules affected**: `graph-core/jsonld` (default `JsonLdProcessor`
  version), `graph-future` (activated to host JSON-LD 1.2 emit/parse),
  `graph-corpus-sdk` (consumer choice of wire profile).
- **What changes**:
  - Add a JSON-LD 1.2 emit/parse adapter behind the existing
    `JsonLdProcessor.version` discriminator.
  - After consumer-compat verification, change the default version from
    `"1.1"` to `"1.2"`.
  - The RelationshipRecord projection becomes one supported wire profile
    rather than the canonical wire shape; consumers can opt into native
    triple-term JSON-LD 1.2 syntax.
- **What stays the same**: internal RDF 1.2 model (already aligned);
  RelationshipRecord projection (still works for JSON-LD 1.1 consumers);
  SHACL profile; SPARQL adapter shape.
- **Prerequisite for downstream tripwires**: none — tripwire #1 is independent
  of #2-5.

### Tripwire #2 — RDF/JS WG formalises an RDF 1.2 data-model extension

- **Signal to watch**: an RDF/JS spec publishes `TripleTerm` (or equivalent)
  as a canonical type. Watch the
  [RDF/JS Community Group](https://rdf.js.org/) and W3C activity around
  RDF 1.2 alignment of the JS data model.
- **Modules affected**: `graph-core` only.
- **What changes**:
  - Compare our `TripleTerm` shape (§4) to the published spec.
  - If different, migrate `graph-core`'s `Term` union and any
    type-level downstream usage to match the published spec.
  - Update `rdf-data-factory` and any RDF/JS-aligned dependency.
- **What stays the same**: every workspace above `graph-core`. The migration
  is a single-workspace concern by design — `graph-core` is the only place
  that owns the `Term` union, so the blast radius is bounded.
- **Mitigation today**: keep our `TripleTerm` shape minimal (matches the
  RDF 1.2 abstract syntax — `subject`, `predicate`, `object` with no extras);
  avoid premature additions that might diverge from the eventual spec.

### Tripwire #3 — SHACL 1.2 reaches W3C Recommendation

- **Signal to watch**: SHACL 1.2 Core / SHACL 1.2 Rules drafts move from
  Working Draft to Recommendation.
- **Modules affected**: `graph-validate`, `graph-future` (activated if a
  consumer needs SHACL 1.2 features beyond what `graph-validate` exposes).
- **What changes**:
  - Add `shacl-1.2` to the `ShapeValidator.profile` discriminator (research §12).
  - Re-evaluate `rdf-validate-shacl` (zazuko) for SHACL 1.2 conformance;
    consider alternative implementations if conformance is partial.
  - Update default `profile` once the substrate validates SHACL 1.2 features
    in production use.
- **What stays the same**: `shacl-1.0` profile remains supported (consumers'
  existing shapes don't require migration unless they want SHACL 1.2-only
  features).

### Tripwire #4 — SPARQL 1.2 reaches W3C Recommendation

- **Signal to watch**: SPARQL 1.2 Query Language moves from Working Draft to
  Recommendation.
- **Modules affected**: `graph-future` (activated to host the SPARQL 1.2
  query/export adapter).
- **What changes**: author the SPARQL 1.2 export/query adapter behind the
  versioned interface in research §12.
- **What stays the same**: library-native match/traverse APIs in
  `graph-project` remain the **primary** query surface. SPARQL is always an
  export/adapter, never the primary application API. This invariant is
  preserved across SPARQL 1.1, 1.2, and beyond.

### Tripwire #5 — RDF 1.2 itself reaches W3C Recommendation

- **Signal to watch**: RDF 1.2 Concepts and RDF 1.2 Semantics move from
  Candidate Recommendation Snapshot to Recommendation.
- **Modules affected**: documentation and package metadata mostly; no
  architectural change.
- **What changes**:
  - Update declared spec version in package metadata, READMEs, ADR-168, and
    this research document.
  - The pre-Recommendation risk window (small, but non-zero — CR Snapshots can
    receive non-substantive corrections) closes.
- **What stays the same**: internal data model (already RDF 1.2-native, §4).

### Tripwire #6 — first triple-term-using corpus enters first-wave ingestion

- **Signal to watch**: any first-wave corpus (Oak Curriculum Ontology,
  prerequisite, misconception, EEF) — or a future corpus — starts emitting
  data that uses RDF 1.2 triple-term shape (e.g. statement-level annotations,
  RDF-star or RDF 1.2 Turtle). Today none of the first-wave corpora use
  triple terms, so this tripwire is dormant on landing.
- **Modules affected**: `graph-ingest` (parser correctness), `graph-validate`
  (shape constraints over triple terms), `graph-enhance` (provenance and
  derivation records over triple terms), contract tests across the substrate.
- **What changes**:
  - Verify ingestion preserves triple terms through the pipeline end-to-end.
  - Verify SHACL shape constraints hold on triple-term data.
  - Verify enhancement records correctly attribute triple-term derivations.
- **What stays the same**: wire emission still defaults to JSON-LD 1.1
  (lowering to RelationshipRecord) until tripwire #1 fires. This tripwire
  exercises the **internal** RDF 1.2 path; it does *not* implicitly fire
  tripwire #1.

### Tripwire #7 — adapter implementation diverges from targeted spec

- **Signal to watch**: contract test failure on `jsonld.js`, `rdf-canonize`,
  `rdf-validate-shacl`, or any future adapter against the pinned spec
  profile. Includes RDF Dataset Canonicalization 1.0 → 2.0 spec evolution and
  any major-version dependency bumps.
- **Modules affected**: the diverging adapter only.
- **What changes**:
  - Pin to the last-known-good adapter version.
  - File an upstream issue.
  - Evaluate alternative implementations.
  - Use the relevant `version` / `profile` / discriminator field
    (`JsonLdProcessor.version`, `ShapeValidator.profile`, etc.) as the
    intervention point — never patch the canonical types or callers.
- **What stays the same**: the canonical internal model and other adapters
  are unaffected by definition (that is what the discriminator is for).

### Tripwire discipline (binding)

- Every tripwire is a **contract test or version-pin** in the codebase.
  This document is the **authoritative tripwire map**; ADR-168 enumerates
  them by name as binding commitments; the plan body schedules them as
  named follow-on plans when triggered.
- **No tripwire can be silently skipped.** When a trigger fires, the work
  is a named follow-on plan, not an inline sweep. The follow-on cites this
  section by tripwire number.
- **Default position for any unresolved spec is to stay on the stable
  profile.** Premature adoption is a worse failure mode than late adoption —
  spec churn during CR / WD periods is real, and our wire commitments
  outlast our internal flexibility.
- **Discriminator fields are the only legitimate intervention point.**
  Adapter version and profile fields (`JsonLdProcessor.version`,
  `ShapeValidator.profile`, etc.) exist precisely so tripwire-triggered
  upgrades happen behind a single, typed boundary.

This gives you a library that is useful immediately for graph-like JSON and JSON-LD, grounded in RDF and schema.org from the beginning, but not blocked by newer standards that are still in flight.
