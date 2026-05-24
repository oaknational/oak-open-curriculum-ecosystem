# WS1.6 Vocabulary Registry Prep

Status: planning prep only. This note prepares the WS1.6 vocabulary registry
slice for owner review; it does not propose implementation, choose namespace
policy, or add registry data.

Sources checked:

- `graph-stack.plan.md` WS1.6 and graph-stack topology notes.
- `open-education-knowledge-surfaces.plan.md` source-surface summary.
- `packages/core/graph-core/src/data-factory/index.ts`.
- `packages/core/graph-core/src/dataset/index.ts`.
- `packages/core/graph-core/src/vocab/index.ts`.
- `packages/core/graph-core/README.md`.

## Scope Boundary

WS1.6 should remain a vocabulary registry planning and data-contract slice.
The accepted implementation lane, once owner direction is available, is
expected to expose const-typed `NamedNode` values through
`@oaknational/graph-core/vocab` using the WS1.3 DataFactory `namedNode()`
helper. Oak-specific ingestion, mapping, or graph construction belongs in
consumer packages such as `graph-corpus-sdk`, not in `graph-core`.

## Controlled Vocabularies To Adopt

- RDF foundation terms required by the RDF/JS shape: RDF, RDFS, OWL, SKOS,
  SHACL, PROV-O, DCMI, and schema.org.
- Oak Curriculum Ontology IRIs as canonical Oak curriculum identity where the
  upstream ontology already defines terms. These include curriculum structure,
  concept relationships, and National Curriculum aligned knowledge taxonomy
  terms.
- Oak source-data controlled values from the generated Oak API or bulk data:
  subjects, key stages, phases, year groups, programmes, sequences, units,
  lessons, threads, quizzes, transcripts, and any source-authored topic or tag
  identifiers.
- Oak education-domain grouping values that are needed for stable lookup but
  must not be hand-authored without a source of truth: subject families,
  curriculum areas, topic tags, lesson type tags, and assessment or quiz
  categories.
- EEF custom IRIs for Teaching and Learning Toolkit concepts only where the
  project has an owner-approved canonical source for approach identity,
  impact, cost, and evidence-strength categories.

## Open Design Questions

- Source authority: for each Oak controlled value, is the source of truth the
  Oak Curriculum Ontology, generated Oak API types/data, bulk exports, or a
  project-maintained bridge table?
- SKOS ConceptScheme identity: should subjects, key stages, topic tags, and
  ontology concepts live in one Oak concept scheme, separate schemes, or only
  reuse upstream scheme identity where present?
- Namespace policy: should local constants use upstream ontology IRIs exactly,
  a project-owned Oak namespace, or a package-local namespace for bridge-only
  terms? WS1.6 should not invent this without owner direction.
- Hierarchy depth: how much hierarchy belongs in the registry rather than in
  graph-corpus adapters? Candidate boundaries include subject to key stage,
  subject to topic, topic to lesson, and ontology concept hierarchy.
- Upstream alignment: how should renamed, deprecated, or aliased upstream Oak
  terms be represented in forward and reverse lookups?
- JSON-LD context relationship: should WS1.6 define compact aliases consumed by
  the WS1.4 JSON-LD processor tests, or should alias/context design remain a
  separate graph-jsonld concern?
- Literal/datatype ergonomics: the WS1.3 DataFactory still has a TODO about
  datatype-IRI helper policy. WS1.6 needs a decision before adding datatype
  convenience exports.
- Reverse lookup semantics: should reverse lookup be one-to-one only, or allow
  aliases and deprecated terms? If aliases exist, which spelling is canonical?
- Versioning: how will registry entries track upstream ontology or API schema
  changes so stable IRI tests fail clearly when source authority changes?
- EEF scope: are EEF categories first-class controlled vocabulary in
  `graph-core`, or only adapter-owned values emitted by the EEF ingestion lane?

## Reviewer Flags

- `type-expert`: preserve literal `NamedNode<'iri'>` inference end to end,
  avoid widening to `string`, and review forward/reverse lookup typings plus
  datatype helper decisions.
- `architecture-expert-fred`: confirm `graph-core/vocab` remains substrate
  code with no Oak ingestion leakage, no source-data fetching, and no consumer
  coupling.
- `assumptions-expert`: review source-authority choices, namespace assumptions,
  SKOS ConceptScheme identity, EEF scope, and upstream ontology stability.
- `test-expert`: review stable IRI tests, forward and reverse lookup coverage,
  and the invariant that emitted edge predicates are `NamedNode`, never bare
  strings.
- `design-system-expert`: only needed if a later owner decision introduces a
  UI surface for browsing or editing vocabularies. No UI surface is expected
  for WS1.6 as currently scoped.

## Owner Decisions Needed Before Implementation

- Pick source authority for Oak subjects, key stages, topic tags, and EEF
  categories.
- Decide SKOS ConceptScheme identity and namespace policy.
- Decide hierarchy depth for registry data versus adapter-emitted graph shape.
- Decide alias and deprecation behaviour for reverse lookups.
- Decide whether WS1.6 should include JSON-LD aliases or leave that to a
  later context-design slice.
