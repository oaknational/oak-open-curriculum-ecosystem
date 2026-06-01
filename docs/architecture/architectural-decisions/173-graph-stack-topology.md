# ADR-173: Graph Stack Topology — Standards-First, Layered, MCP-Agnostic

**Status**: Accepted 2026-05-11 (Sparking Charring Ash session, owner
final-approval following reviewer absorption against
architecture-expert-betty, architecture-expert-fred,
assumptions-expert, and architecture-expert-barney
PROMOTION-READY verdict on `graph-stack.plan.md`). Skeleton 2026-05-07;
NC-boundary amendment 2026-05-10; reviewer-absorption amendment
2026-05-11; EEF concurrent-tenant amendment 2026-05-21; graph-query-layer
correction 2026-06-01; post-acceptance hygiene 2026-06-01 (stale
pre-promotion sections cleared; Inc.3 adapter-sequencing retired).

**Date**: 2026-05-07; amended 2026-05-10; amended 2026-05-11; amended 2026-05-21;
amended 2026-06-01

**2026-05-11 amendment summary** (Flamebright Burning Lava session,
reviewer absorption against architecture-expert-betty,
architecture-expert-fred, assumptions-expert):

- Tripwire #2 ↔ #5 cross-reference: explicit note that #5 review must
  re-check #2 status (RDF 1.2 REC may land before RDF/JS WG publishes
  the data-model extension).
- Tripwire #6 reformulated from "deferred tripwire awaiting first
  triple-term corpus" to "continuous contract test on `graph-ingest`
  asserts triple-term inputs round-trip" — reframes a structurally-
  ambiguous deferred tripwire as named continuous validation.
- Tripwire #8 added: upstream `oaknational/oak-curriculum-ontology`
  breaking-change tripwire. Higher-probability near-term risk than
  spec REC tripwires given ontology IRIs are canonical identity.
- Open Question 2 (MCP-agnostic principle as separate ADR) —
  **Resolved 2026-05-11**: extracted to
  [ADR-179](179-transport-agnostic-graph-substrate.md) per owner
  direction; ADR-173 §"Transport discipline (see ADR-179)" now
  references ADR-179 rather than restating the rule inline.
- Plan-body routed findings (graph-enhance/graph-validate seam
  protocol, graph-ingest/graph-corpus-sdk corpus-local parse
  extension protocol, build-vs-buy attestation expansion, JSON-LD
  framing performance contract test) absorbed into the active graph
  stack plan rather than this ADR — they are sequencing and
  test-discipline concerns, not topology decisions.

**2026-05-21 amendment summary** (owner-directed sequencing
pull-forward to ship the first user-facing graph-stack consumer
earlier without scope reduction):

- Workspace #6 (`graph-corpus-sdk`) Inc.1 activation expanded: the
  Oak Curriculum Ontology Threads adapter and the EEF strands adapter
  are concurrent tenants in Inc.1. Prerequisite and misconception
  adapters remain at Inc.3.
- §First-wave ingestion scope amended to record two concurrent
  attached corpora with disjoint ingestion paths: Threads via
  `graph-ingest` Turtle/SHACL from the pinned ontology raw import,
  EEF strands via a corpus-local typed direct-load inside
  `graph-corpus-sdk` with no `graph-ingest` participation.
- The topology of seven active workspaces plus one deferred is
  unchanged. Increment activation for the EEF adapter shifts forward;
  no workspace is added, no boundary moves, no transport rule
  changes.
- §Corpus source authority is unchanged: the repository-held EEF
  Toolkit JSON snapshot remains the canonical implementation source
  until EEF clarifies refresh mechanics; the corpus must not be
  reconstructed from scraped pages.
- Tripwire set unchanged: EEF data does not exercise triple terms,
  so tripwire #6 (triple-term ingestion contract test) is unaffected
  by the earlier EEF adapter activation. Tripwire #8 (upstream
  ontology breaking change) is also unaffected because the EEF
  adapter does not consume the Oak Curriculum Ontology IRI surface.
- Per-increment sequencing and plan-body decomposition continue to
  live in the active substrate and vertical-slice plan bodies in
  operational memory, not in this ADR.

**2026-06-01 amendment summary** (graph-query-layer correction,
owner-directed during the EEF graph-tool work):

- The shared graph-core query layer ships **real operations only**: a
  query operation is implemented with real graph-derived logic and tests,
  or it is absent. The query contract is built from the operations its
  consumers use.
- The EEF strands corpus is the active first corpus consumer. Further
  corpus adapters (Oak Curriculum Ontology Threads, prerequisite,
  misconception) and cross-corpus join primitives are built when their
  consumers exist. This supersedes the 2026-05-21 concurrent-tenant
  arrangement above; the Threads adapter placeholder is removed.
- The RDF substrate (term/dataset/jsonld/canon/data-factory), genuinely
  multi-consumer, is unchanged.

**2026-06-01 amendment summary (post-acceptance hygiene)** — clears
residue left after the ADR reached Accepted (2026-05-11):

- **Increment-numbered adapter sequencing retired.** The 2026-05-21
  summary's "Prerequisite and misconception adapters remain at Inc.3"
  no longer holds: per the graph-query-layer correction above, every
  corpus adapter (Oak Curriculum Ontology Threads, prerequisite,
  misconception) is built when its consumer exists, not at a numbered
  increment. "Inc.3" has no live referent. The substrate-workspace
  standup increments in §Topology (Inc.1/Inc.2/Inc.4) are unaffected —
  they remain the legitimate foundation-build order.
- **Stale pre-promotion framing cleared** in §"Open questions" and
  §"Notes for future revision" (both formerly read "before promotion"
  though the ADR has been Accepted since 2026-05-11).

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
[ADR-179](179-transport-agnostic-graph-substrate.md) — transport-agnostic
graph substrate; the cross-cutting transport-discipline rule that the
substrate ships no MCP/HTTP/CLI/transport-shaped code (extracted from
ADR-173 on 2026-05-11);
[ADR-157](157-multi-source-open-education-integration.md) (cited
above) — the first vertical-slice consumer of this topology is
the graph MVP arc that ADR-157 carries structurally; the active
plan body in operational memory carries the per-increment
sequencing.

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
   canonical identity. **The EEF strands corpus is the active first corpus
   consumer; further corpus adapters (Oak Curriculum Ontology Threads,
   prerequisite, misconception) and cross-corpus join primitives are built
   when their consumers exist (2026-06-01 amendment). The shared query
   layer ships real operations only.**
7. `agent-graphs/practice-graph/` — markdown-corpus graph for Oak's
   engineering practice. It is an agent-tooling-adjacent consumer, not a
   substrate library, and proves the substrate works for non-curriculum data.
   **Activates in Inc.4 (second-consumer proof); the `agent-graphs/`
   organisation plan unblocks it.**
8. `packages/libs/graph-future/` — _deferred_. Workspace not created until
   a consumer needs RDF 1.2 / JSON-LD 1.2 / SPARQL 1.2 / SHACL 1.2
   adapters; the adapter seams ship from day one in the active workspaces.
   **Tripwire-gated (not increment-sequenced).**

### Transport discipline (see ADR-179)

The transport-agnostic principle (no graph substrate workspace ships
MCP/HTTP/CLI/transport-shaped code; surfacing is a consumer-side concern with
at most one home per transport) is recorded as
[ADR-179](179-transport-agnostic-graph-substrate.md) following the
2026-05-11 reviewer absorption (architecture-expert-fred's advisory
amendment). ADR-173 references ADR-179 rather than restating the principle
inline so transport-discipline doctrine and topology doctrine evolve
independently.

ADR-123 (MCP server primitives strategy) is unaffected by either ADR. Future
graph-derived MCP primitives amend ADR-123 at the point a consumer surfaces
them, and live in the home named by ADR-179.

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
joined explicitly rather than collapsed silently. The two first-wave attached
corpora carry distinct identity schemes (per the 2026-05-21 amendment):
the Oak Curriculum Ontology Threads corpus uses ontology Thread IRIs as graph
identity, while API/bulk slugs and unit metadata remain generated API/bulk
projections; the EEF strands corpus uses the corpus-native `strands[].id`
(e.g. `eef-tl-metacognition-and-self-regulation`) as graph identity, with
the `id → strand_id` rename happening at the corpus boundary inside the EEF
adapter's loader, not inside graph traversal code. A consumer that needs
API shape uses the generated SDK types; a consumer that needs graph traversal
uses each corpus's canonical identity through `graph-corpus-sdk`; a
cross-corpus tool states the join boundary in its adapter and output metadata.

### First-wave ingestion scope (amended 2026-05-21 — two concurrent attached corpora)

The foundation wave targets two end-to-end attached corpora, each
with its own ingestion path. Both are first-wave; neither is a
follow-on. The corpora share no ingestion machinery — Threads
exercises the substrate Turtle/SHACL path; EEF strands exercises a
corpus-local typed direct-load without `graph-ingest` participation.

1. **Oak Curriculum Ontology Threads graph** — Turtle + SHACL, ingested
   from the source-of-truth `oaknational/oak-curriculum-ontology` GitHub
   repository. TTL and SHACL are canonical; derived release bundles and
   projection formats are not first-wave ingestion targets. Round-trip
   equivalence between TTL and the derived projections is asserted upstream and
   not re-verified by the graph stack. `graph-ingest` owns generic Turtle/SKOS
   parsing; `graph-enhance` owns derived graph enrichments and IRI/link records;
   `graph-corpus-sdk` owns the `curric:Thread` enumeration and
   `curric:includesThread` inverse-edge typed adapter.
2. **EEF strands corpus** — corpus-local snapshot held `as const`,
   loaded by typed direct construction inside `graph-corpus-sdk`
   against the repository-held canonical snapshot. `graph-ingest` does
   not participate in this path; the corpus types are derived directly
   from the `as const` snapshot via `typeof`/indexed-access (consistent
   with §Typing Discipline of
   [ADR-157](157-multi-source-open-education-integration.md)). Source
   authority is governed by §Corpus source authority below: the
   repository-held snapshot is canonical until EEF clarifies refresh
   mechanics. `graph-corpus-sdk` hosts the EEF strands corpus adapter on
   the EEF strand ID identity scheme; further corpus adapters carry their
   own identity schemes (e.g. ontology IRIs for an Oak Curriculum Ontology
   Threads adapter) with disjoint ingestion paths, and a cross-corpus join
   primitive is built when a cross-corpus consumer exists (2026-06-01
   amendment).

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
- The foundation ingestion scope is bounded to two concurrent attached corpora
  with disjoint ingestion paths (per the 2026-05-21 amendment): the Oak
  Curriculum Ontology Threads corpus is imported as full straight-copy
  Turtle/SHACL source files, proving ontology IRI identity and generic
  Turtle/SKOS parsing against real Oak ontology data; the EEF strands corpus
  is loaded by typed direct construction from its `as const` snapshot inside
  `graph-corpus-sdk`, proving the substrate composes with a corpus-native
  identity scheme through a path independent of `graph-ingest`.
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

| #   | Tripwire                                                                      | Trigger signal                                                                                                                                                                   | Modules affected                                                                                                      | What changes (high-level)                                                                                                                                                                                                                                                                                                         |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JSON-LD 1.2 reaches W3C Recommendation**                                    | <https://www.w3.org/TR/json-ld12/> CR → REC (WG charter target Q4 2027)                                                                                                          | `graph-core/jsonld`; `graph-future` activates                                                                         | JSON-LD 1.2 emit/parse adapter; default version may shift from `"1.1"` to `"1.2"` after consumer-compat check; RelationshipRecord becomes one wire profile, not the canonical shape                                                                                                                                               |
| 2   | **RDF/JS WG formalises RDF 1.2 data-model extension**                         | RDF/JS spec publishes `TripleTerm` as a canonical type. **Cross-reference tripwire #5**: any review of #5 must check #2 status, and vice versa.                                  | `graph-core` only                                                                                                     | Migrate `Term` union if our shape differs from the published spec (typed refactor confined to `graph-core`)                                                                                                                                                                                                                       |
| 3   | **SHACL 1.2 reaches W3C Recommendation**                                      | SHACL 1.2 Core / Rules WD → REC                                                                                                                                                  | `graph-validate`; `graph-future` may activate                                                                         | Add `shacl-1.2` profile to ShapeValidator adapter; re-evaluate `rdf-validate-shacl` for SHACL 1.2 conformance                                                                                                                                                                                                                     |
| 4   | **SPARQL 1.2 reaches W3C Recommendation**                                     | SPARQL 1.2 Query Language WD → REC                                                                                                                                               | `graph-future` activates                                                                                              | Author SPARQL 1.2 export/query adapter behind versioned interface                                                                                                                                                                                                                                                                 |
| 5   | **RDF 1.2 itself reaches W3C Recommendation**                                 | RDF 1.2 Concepts / Semantics CR → REC. **Cross-reference tripwire #2**: REC may land before RDF/JS WG publishes the data-model extension; #5 review must explicitly re-check #2. | Documentation and package metadata; revisit `graph-core` `TripleTerm` shape against finalised RDF 1.2 abstract syntax | Update declared spec version; pre-Recommendation risk window closes; if RDF/JS WG has not yet acted, retain bespoke `TripleTerm` and continue watching #2                                                                                                                                                                         |
| 6   | **Triple-term ingestion contract test fails**                                 | Continuous contract test in `graph-ingest` asserts triple-term inputs round-trip preserving annotations; test failure is the trigger                                             | `graph-ingest`, `graph-validate`, `graph-enhance`                                                                     | Diagnose ingestion regression; verify SHACL shape constraints; verify provenance for triple-term derivations. Reformulated 2026-05-11 from deferred-tripwire to continuous-contract-test per assumptions-expert review.                                                                                                           |
| 7   | **Adapter implementation diverges from targeted spec**                        | Contract test failure on `jsonld.js`, `rdf-canonize`, `rdf-validate-shacl`, or any future adapter; includes RDF Dataset Canonicalization 1.0 → 2.0                               | The diverging adapter only                                                                                            | Pin to last-known-good version, file upstream issue, evaluate alternatives; intervention point is always the version/profile discriminator                                                                                                                                                                                        |
| 8   | **`oaknational/oak-curriculum-ontology` upstream introduces breaking change** | Upstream commit between pinned revisions renames a predicate, deprecates an IRI, or restructures the source-file globs `graph-corpus-sdk` relies on                              | `graph-corpus-sdk` Threads adapter; `graph-core/vocab` registry; pinned-import manifest                               | Re-pin revision; map the breaking change inside the adapter (or refuse migration with a named plan); surface in the import manifest; assess downstream cross-corpus joins. Added 2026-05-11 per assumptions-expert review — higher-probability near-term risk than spec REC tripwires given ontology IRIs are canonical identity. |

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

## Open questions

The ADR is **Accepted** (2026-05-11); these are tracked open items, not
promotion blockers. Q1 and Q2 are resolved (history retained); Q3 remains open.

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
2. ~~Confirm the ADR is the right artefact for the MCP-agnostic principle~~
   **Resolved 2026-05-11**: extracted to
   [ADR-179](179-transport-agnostic-graph-substrate.md) per owner
   direction (Flamebright Burning Lava session). ADR-173 references
   ADR-179 in §"Transport discipline (see ADR-179)". Rule substance
   unchanged; only the home moved.
3. Confirm Mark Hodierne's author addition is required at ratification or
   only on first ontology ingestion.

## Notes for future revision

The pre-promotion review this section once gated is complete: workspace path
conventions are matrix-recorded in
[ADR-041](041-workspace-structure-option-a.md); the transport-agnostic principle
moved to [ADR-179](179-transport-agnostic-graph-substrate.md); the topology was
owner-approved at acceptance (2026-05-11). Author attribution (Mark Hodierne)
is the one tracked open item — see §Open questions Q3.
