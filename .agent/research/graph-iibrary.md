# Report: Stable-first JSON / JSON-LD graph utilities with RDF semantics and future-standard migration paths

**Date:** 4 May 2026
**Scope:** A small library or collection of utilities for ingesting, enhancing, normalising, validating, querying, and exporting graph-like JSON or JSON-LD.

## Executive summary

A strong design is to build a **stable-first graph utility library** around **JSON-LD 1.1**, **RDF 1.1-compatible quads**, **schema.org**, and adjacent stable RDF vocabularies such as **RDFS**, **SKOS**, **PROV-O**, **Dublin Core Terms**, **OWL 2**, and **SHACL**.

The library should not merely manipulate JSON trees. It should treat JSON and JSON-LD as inputs, then normalise them into a semantic graph model with explicit identifiers, predicates, source mappings, validation, provenance, and property-graph-style interaction APIs.

The recommended posture is:

> Use only stable standards for persisted data, public APIs, and default exports. Design internal abstractions so RDF 1.2, JSON-LD 1.2/1.3, SPARQL 1.2, and SHACL 1.2 become adapter upgrades rather than architectural rewrites.

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
| Graph data model                      | [RDF 1.1 Concepts and Abstract Syntax](https://www.w3.org/TR/rdf11-concepts/)                                   | Canonical semantic model: subject–predicate–object triples and datasets               |
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
| RDF 1.2                    | [RDF 1.2 Concepts](https://www.w3.org/TR/rdf12-concepts/) and [RDF 1.2 Semantics](https://www.w3.org/TR/rdf12-semantics/) are W3C Candidate Recommendation Snapshot documents as of 7 April 2026 | Important future target, especially for triple terms and statement-level annotations; do not require it in persisted core data yet |
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

The canonical internal model should be an RDF-compatible dataset, ideally compatible with RDF/JS concepts:

```ts
type Term =
  | NamedNode
  | BlankNode
  | Literal
  | DefaultGraph;

type Quad = {
  subject: Term;
  predicate: NamedNode;
  object: Term;
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

## 8. Relationship records as the migration bridge

For stable JSON-LD 1.1 and RDF 1.1 compatibility, relationship metadata should be represented as explicit relationship records.

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

This is portable today. It also gives a clean future migration path to RDF 1.2 triple-term or statement-annotation patterns where appropriate.

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

### RDF 1.2 migration seam

Today:

```text
RelationshipRecord {
  source,
  predicate,
  target,
  properties
}
```

Future RDF 1.2 adapter:

```text
If safe:
  relationship record → triple-term annotation

If not safe:
  relationship record remains a first-class node
```

Do not assume every edge property is merely metadata about a triple. Some are independent domain objects.

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
  RDF 1.1-compatible datasets
  SHACL 1.0
  schema.org and stable RDF vocabularies

Semantic in the middle:
  RDF-compatible quads
  vocabulary registry
  relationship records
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

Future-ready by design:
  RDF 1.2 adapter
  JSON-LD 1.2 / 1.3 adapter
  SPARQL 1.2 adapter
  SHACL 1.2 adapter
```

This gives you a library that is useful immediately for graph-like JSON and JSON-LD, grounded in RDF and schema.org from the beginning, but not blocked by newer standards that are still in flight.
