# ADR-173: Graph Stack Topology — Standards-First, Layered, MCP-Agnostic

**Status**: Proposed (skeleton, 2026-05-07; NC-boundary amendment
2026-05-10) — pending owner approval before ratification.

**Date**: 2026-05-07; amended 2026-05-10

**Related**:
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP server primitives
strategy; this ADR establishes the substrate that future graph-shaped MCP
primitives will consume, and explicitly does _not_ amend ADR-123 because the
substrate ships no MCP primitives;
[ADR-154](154-separate-framework-from-consumer.md) — framework/consumer
separation; this ADR is a worked application of that rule across seven active
graph workspaces plus one deferred future-standards workspace;
[ADR-157](157-multi-source-open-education-integration.md) — multi-source
open education integration; this ADR is the structural carrier for that
integration (Oak API + Oak Curriculum Ontology + EEF, with the EEF
cross-cutting thread fully named);
[`graph-mvp-arc.plan.md`](../../../.agent/plans/graph-mvp-arc.plan.md) —
first vertical-slice consumer of this topology, keeping EEF and misconception
cross-source value in scope while excluding NC graph/taxonomy work from the
MVP.

## Context

The repository has no graph infrastructure in the substrate sense. What
exists today is graph-shaped MCP exposure inside `oak-curriculum-sdk` (the
resource factory plus prerequisite, misconception, and thread-progressions
adapters) and a queued `GraphView` query-layer plan. Each surface is a
property graph by construction, derived deterministically from typed bulk
data; none rests on a canonical RDF-compatible model, none uses ontology IRIs
as identity, none can compose across corpora without bespoke alignment.

The Oak Curriculum Ontology already publishes RDF/OWL/SKOS/SHACL with stable
IRIs and SHACL CI validation, but is consumed only as an _idea_ — no current
code path ingests its triples directly. Other Oak-internal graphs (the
prerequisite and misconception graphs) are emitted as ad-hoc typed JSON. The
EEF Toolkit is an external corpus we want to compose with both.

Plans elsewhere in the portfolio assume a substrate exists. This ADR records
the proposed substrate shape so those plans can attach to a stable spine
rather than each inventing one.

## Decision

Adopt a **seven-active-plus-one-deferred** graph topology with an RDF
1.2-native internal model, JSON-LD 1.1 wire profile, versioned standards
adapters, and explicit separation between MCP surfacing and graph substrate
packages.

### Standards stance

- **RDF 1.2 abstract syntax is the canonical internal model from day one.**
  `Term` includes `TripleTerm`; statement-level annotations are first-class
  internal types, not a shim. (Candidate Recommendation Snapshot, 7 April
  2026; pre-Recommendation risk addressed in §Standards evolution and
  tripwires below — tripwire #5.)
- **JSON-LD 1.1** is the wire syntax for persisted data, public APIs, and
  default exports. JSON-LD 1.2 is a future emit/parse adapter (W3C JSON-LD
  WG charter target: Q4 2027). Until then, internal triple-term annotations
  are _projected_ to `RelationshipRecord` shapes on JSON-LD 1.1 emit.
  RelationshipRecord is the **wire projection**, not the canonical model.
- **RDF 1.1-compatible quads on the wire**, lowered from RDF 1.2-native
  internals.
- **Vocabulary baseline**: schema.org, RDFS, SKOS, PROV-O, Dublin Core
  Terms, OWL 2, SHACL 1.0.
- **SPARQL 1.2 and SHACL 1.2** are tracked behind versioned adapters in the
  deferred `graph-future` workspace; activation is triggered by tripwires #3
  and #4 below.

### Topology

Seven active graph workspaces plus one deferred. Each item carries its
sequenced activation increment; the topology decision commits the full
set, but workspaces are stood up in increment order rather than all at
once. Increment sequencing is owned by the implementing plan.

1. `packages/core/graph-core/` — RDF/JS-aligned terms/quads/datasets,
   JSON-LD 1.1 expansion+compaction+framing, canonicalisation, vocabulary
   registry. Pure, no I/O. **Activates in Inc.1 (foundation).**
2. `packages/libs/graph-ingest/` — JSON-LD-compatible, record, generic
   Turtle/SKOS parse-to-dataset support, and other consumer-agnostic
   ingestion modes. Oak-specific corpus mapping does not live here.
   **Activates in Inc.1 with `jsonld-compatible` plus generic
   Turtle/SKOS parsing; remaining ingestion modes in Inc.2.**
3. `packages/libs/graph-enhance/` — stable IRI minting, predicate mapping,
   type inference, link detection, `EnhancementRecord` and
   `RelationshipRecord` discipline. **Activates in Inc.2 (second-wave
   substrate); the adapter seam ships from Inc.1 inside `graph-core`.**
4. `packages/libs/graph-validate/` — JSON Schema (raw shape) + SHACL
   (graph meaning). **Activates in Inc.2 (second-wave substrate); the
   adapter seam ships from Inc.1 inside `graph-core`.**
5. `packages/libs/graph-project/` — property-graph projection, adjacency,
   neighbours/match/traverse primitives, visualisation/export hooks.
   **Activates in Inc.1 with property-graph projection plus adjacency
   primitives; full traversal and visualisation surface in later
   increments.**
6. `packages/sdks/graph-corpus-sdk/` — Oak's typed corpus adapters (Oak
   Curriculum Ontology Threads graph, prerequisite, misconception, EEF
   strands, future corpora). Cross-corpus join primitives. Ontology IRIs as
   canonical identity. **Activates in Inc.1 with the Oak Curriculum
   Ontology Threads adapter; prerequisite, misconception, and EEF
   adapters activate in Inc.3.**
7. `agent-graphs/practice-graph/` — markdown-corpus graph for Oak's
   engineering practice. It is an agent-tooling-adjacent consumer, not a
   substrate library, and proves the substrate works for non-curriculum data.
   **Activates in Inc.4 (second-consumer proof); the `agent-graphs/`
   organisation plan unblocks it.**
8. `packages/libs/graph-future/` — _deferred_. Workspace not created until
   a consumer needs RDF 1.2 / JSON-LD 1.2 / SPARQL 1.2 / SHACL 1.2
   adapters; the adapter seams ship from day one in the active workspaces.
   **Tripwire-gated (not increment-sequenced).**

### MCP-agnostic principle (proposed)

**No graph workspace ships MCP-shaped code.** Tool definitions, resource
constants, and registration helpers live with the existing curriculum MCP
consumer surface (the SDK MCP module plus HTTP app) or a future app-facing
adapter, not with the graph SDK that produces the data. If a graph workspace
starts wanting an MCP type or factory, that is the signal to extract a thin
consumer adapter workspace — not to leak MCP into the substrate. ADR-123 is
therefore unaffected by this ADR; future graph-derived MCP primitives amend
ADR-123 at the point a consumer surfaces them.

The same discipline applies to HTTP, CLI, and JSON-LD export: each transport
is a consumer-side concern with at most one home per transport.

### Corpus source authority

The graph stack does not replace the Oak Open Curriculum API contract or the
bulk-data extraction pipeline. It adds an ontology-identity layer that composes
with them.

The source-authority split is:

- **OpenAPI / SDK authority**: API-shaped request, response, and MCP tool
  execution types still flow from the OpenAPI schema through `pnpm
sdk-codegen`. Thread slugs, API endpoint shapes, unit response fields, and
  generated validators remain API-owned.
- **Bulk-data authority**: graph-shaped resources derived from Oak bulk API
  data, such as thread progressions, prior knowledge, and misconception
  graphs, remain generated from bulk-data processing in this repository. The
  misconception graph is constructed here from bulk data as part of that
  processing path; it is not an external raw corpus and is not hand-authored as
  a replacement source of curriculum truth.
- **Ontology authority**: the Oak Curriculum Ontology owns ontology IRIs,
  classes, predicates, and graph semantics such as `curric:Thread` and
  `curric:includesThread`. `graph-corpus-sdk` maps ontology identity to typed
  corpus adapters and joins, but it does not become the source of API-shaped
  unit or thread definitions.
- **EEF authority**: until EEF clarifies whether Oak should refresh from a
  public download/API endpoint or direct supply, the repository-held EEF
  Toolkit JSON snapshot is the canonical implementation source for EEF strand
  data. The graph stack may validate, copy, index, and enhance that snapshot,
  but it must not reconstruct the corpus from scraped EEF pages.

Where the same educational concept appears in more than one source, identity is
joined explicitly rather than collapsed silently. For the first attached corpus,
the ontology Thread IRI is the graph identity, while API/bulk slugs and unit
metadata remain generated API/bulk projections. A consumer that needs API shape
uses the generated SDK types; a consumer that needs graph traversal uses
ontology IRIs through `graph-corpus-sdk`; a cross-corpus tool states the join
boundary in its adapter and output metadata.

### First-wave ingestion scope (proposed topology constraint)

The foundation wave targets the smallest end-to-end attached corpus:

1. **Oak Curriculum Ontology Threads graph** — Turtle + SHACL, ingested
   from the source-of-truth `oaknational/oak-curriculum-ontology` GitHub
   repository. TTL and SHACL are canonical; derived release bundles and
   projection formats are not first-wave ingestion targets. Round-trip
   equivalence between TTL and the derived projections is asserted upstream and
   not re-verified by the graph stack. `graph-ingest` owns generic Turtle/SKOS
   parsing; `graph-enhance` owns derived graph enrichments and IRI/link records;
   `graph-corpus-sdk` owns the `curric:Thread` enumeration and
   `curric:includesThread` inverse-edge typed adapter.

### Ontology source-of-truth boundary

The source of truth for ontology definitions and ontology source data is the
`oaknational/oak-curriculum-ontology` GitHub repository. This repository may
consume those ontology files as raw material for ingestion and enhancement, but
it does not author, curate, fork, or reduce the ontology definition corpus.

Raw ontology imports in this repository are reproducibility artefacts, not a
second source of truth. They preserve upstream source files as straight copies
from a pinned upstream revision and remain distinct from derived graph artefacts.
Implementation plans own the operational mechanics for fetching, pinning,
validating, and storing those imports.

Any cleanup, indexing, join records, graph enhancements, JSON-LD projections, or
typed SDK surfaces are derived from the raw imported corpus with provenance back
to the upstream ontology revision. Normal graph code consumes the pinned import
or generated derived artefacts, not a developer's local ontology checkout and
not live network URLs.

Pre-requisite, misconception, and EEF strand adapters are outside the foundation
topology decision and are sequenced by the executable graph-stack plan. The
source-authority decision above still constrains those later adapters:
misconceptions are bulk-derived, EEF strands are repository-snapshot-derived
until EEF clarifies refresh mechanics, and ontology adapters are upstream
GitHub-derived. Other ontology-derived adapters or surfaces, including NC
knowledge taxonomy work, and third-party knowledge graphs are tracked separately
and introduced only when concrete consumers require them and the owner promotes
that work separately.

## Consequences

**Positive**:

- Every layer in the research direction has a workspace home; no layer is
  foreclosed.
- Cross-corpus joins are structurally cheap because ontology IRIs are
  shared canonical identity.
- Non-graph transports (MCP, HTTP, CLI) decide independently whether and
  how to surface graph capability; the graph stack itself stays portable
  and publishable as open-education infrastructure.
- The RDF 1.2-native internal stance minimises the JSON-LD 1.2 upgrade
  cost: when JSON-LD 1.2 reaches Recommendation (tripwire #1), we add an
  emit/parse adapter rather than reshape the canonical model.
- The foundation ingestion scope is bounded to one attached corpus while still
  importing that corpus as full straight-copy source files, proving ontology
  IRI identity and generic Turtle/SKOS parsing against real Oak ontology data.
- The API/bulk/ontology split prevents a new graph adapter from becoming a
  shadow schema layer for thread or unit data. Joins are explicit and
  inspectable instead of hidden behind shared names.
- A pinned straight-copy raw import gives reproducible CI without making the
  ontology repository or GitHub network access a runtime dependency.

**Negative / cost accepted**:

- Three external dependencies are adopted (`jsonld.js`, `rdf-canonize`,
  `rdf-validate-shacl`); each is behind a versioned adapter so it is
  replaceable, but the dependency surface grows.
- The deferred `graph-future` workspace is a deliberate gap — adapter seams
  exist from day one, but consumers requiring RDF 1.2 / JSON-LD 1.2 wire
  formats will need to author the workspace before those adapters can ship.
- Our `TripleTerm` shape is authored ahead of an RDF/JS WG
  formalisation. If the eventual published spec differs, `graph-core`
  migrates the `Term` union — a typed refactor confined to one workspace.
  Tripwire #2 covers this.
- The pinned raw import introduces a provenance-maintenance obligation.
  Provenance-free ontology files in this repository are documentation/data
  drift, not an acceptable import.

## Standards evolution and tripwires

The substrate is internally RDF 1.2-native and externally JSON-LD 1.1 /
RDF 1.1-compatible on the wire. This is a deliberate gap that closes as
the ecosystem catches up. This ADR proposes seven tripwires by name.
**Each tripwire becomes a named follow-on plan when triggered, not an inline
sweep.**

| #   | Tripwire                                               | Trigger signal                                                                                                                                     | Modules affected                                                  | What changes (high-level)                                                                                                                                                           |
| --- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JSON-LD 1.2 reaches W3C Recommendation**             | <https://www.w3.org/TR/json-ld12/> CR → REC (WG charter target Q4 2027)                                                                            | `graph-core/jsonld`; `graph-future` activates                     | JSON-LD 1.2 emit/parse adapter; default version may shift from `"1.1"` to `"1.2"` after consumer-compat check; RelationshipRecord becomes one wire profile, not the canonical shape |
| 2   | **RDF/JS WG formalises RDF 1.2 data-model extension**  | RDF/JS spec publishes `TripleTerm` as a canonical type                                                                                             | `graph-core` only                                                 | Migrate `Term` union if our shape differs from the published spec (typed refactor confined to `graph-core`)                                                                         |
| 3   | **SHACL 1.2 reaches W3C Recommendation**               | SHACL 1.2 Core / Rules WD → REC                                                                                                                    | `graph-validate`; `graph-future` may activate                     | Add `shacl-1.2` profile to ShapeValidator adapter; re-evaluate `rdf-validate-shacl` for SHACL 1.2 conformance                                                                       |
| 4   | **SPARQL 1.2 reaches W3C Recommendation**              | SPARQL 1.2 Query Language WD → REC                                                                                                                 | `graph-future` activates                                          | Author SPARQL 1.2 export/query adapter behind versioned interface                                                                                                                   |
| 5   | **RDF 1.2 itself reaches W3C Recommendation**          | RDF 1.2 Concepts / Semantics CR → REC                                                                                                              | Documentation and package metadata                                | Update declared spec version; pre-Recommendation risk window closes                                                                                                                 |
| 6   | **First triple-term-using corpus enters ingestion**    | Any first-wave corpus or future corpus emits triple-term-shaped data (none do today)                                                               | `graph-ingest`, `graph-validate`, `graph-enhance`, contract tests | Verify ingestion preserves triple terms; verify SHACL shape constraints; verify provenance for triple-term derivations                                                              |
| 7   | **Adapter implementation diverges from targeted spec** | Contract test failure on `jsonld.js`, `rdf-canonize`, `rdf-validate-shacl`, or any future adapter; includes RDF Dataset Canonicalization 1.0 → 2.0 | The diverging adapter only                                        | Pin to last-known-good version, file upstream issue, evaluate alternatives; intervention point is always the version/profile discriminator                                          |

**Tripwire discipline (proposed for ratification)**:

- Every tripwire is a contract test or version-pin in the codebase.
- No tripwire can be silently skipped. Triggering creates a named follow-on
  plan that cites the tripwire by number.
- Default position for any unresolved spec is to **stay on the stable
  profile**. Premature adoption is a worse failure mode than late adoption.
- Discriminator fields (`JsonLdProcessor.version`, `ShapeValidator.profile`,
  etc.) are the only legitimate intervention point for spec-version
  changes. Canonical types and callers do not change shape when adapters
  upgrade.

## Alternatives considered

- **Single combined graph workspace.** Rejected: violates ADR-154 by
  collapsing framework and consumer concerns; would force `graph-corpus-sdk`
  Oak-specific code to live alongside MCP-agnostic substrate code.
- **JSON-LD 1.2-first stance.** Rejected: 1.2 is not yet stable (WG charter
  targets Q4 2027). Wire compatibility now requires 1.1.
- **RDF 1.1-only internal model.** Rejected: forces a future reshape when
  JSON-LD 1.2 lands. RDF 1.2-native internals plus RDF 1.1 wire emission
  is the lower-cost path.
- **Full RDF 1.2 including wire** (Turtle 1.2 / N-Triples 1.2 / JSON-LD-star
  emitted natively from day one). Rejected as disproportionate today:
  JSON-LD 1.2 is not yet stable (WG target Q4 2027); JSON-LD-star is
  informal/non-standard so any web consumer expecting JSON-LD 1.1 would
  break; SHACL 1.2 and SPARQL 1.2 implementations are partial; spec
  stability is CR/WD, not Recommendation. Tripwires #1, #3, #4 close this
  gap at the right time.
- **Direct Neo4j or Stardog adoption as the substrate.** Rejected here as
  the substrate decision; serving-platform comparison remains a downstream
  decision when a concrete serving consumer requires it.
- **Property-graph as canonical model.** Rejected: GQL is conceptually
  useful, but property-graph projection over an RDF-compatible canon
  preserves migration headroom. Property-graph is exposed as an ergonomic
  view, not the canonical truth.

## Open questions to resolve before promotion

1. ~~Confirm the workspace path conventions~~ **Resolved 2026-05-11**:
   the workspace path conventions
   (`packages/core/graph-core/`, `packages/libs/...`,
   `packages/sdks/graph-corpus-sdk/`, `agent-graphs/practice-graph/`)
   are matrix-recorded in
   [ADR-041](041-workspace-structure-option-a.md) (2026-05-11
   amendment). `agent-graphs/` is a distinct top-level tier with
   permitted importer/importee rows; `practice-graph` is the first
   occupant. The `agent-graphs/` physical organisation is sequenced
   outside this ADR.
2. Confirm the ADR is the right artefact for the MCP-agnostic principle, or
   whether it should be a separate ADR with this one referencing it.
3. Confirm Mark Hodierne's author addition is required at ratification or
   only on first ontology ingestion.

## Notes for future revision

Before promotion to Accepted, this ADR must be reviewed for workspace path
conventions, author attribution, and whether the MCP-agnostic principle
belongs here or in a separate ADR. Promotion requires owner approval of the
topology and confirmation that the proposed workspaces match repository
workspace policy.
