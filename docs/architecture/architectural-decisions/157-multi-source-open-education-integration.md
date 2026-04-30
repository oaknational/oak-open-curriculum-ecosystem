# ADR-157: Multi-Source Open Education Knowledge Integration

**Status**: Proposed (was Accepted; demoted 2026-04-30 — this ADR is a
speculative direction, not a settled decision; in-flight work in the
`sector-engagement/eef/` and `knowledge-graph-integration/` plan
collections explores the space without being constrained by this ADR's
specific structure. The ADR may be re-promoted to Accepted when the
multi-source integration has shipped enough surface to confirm the
typing-discipline, URI-scheme, and namespace decisions are still right.)
**Date**: 2026-04-10 (status amended 2026-04-30)
**Related**: [ADR-029](029-no-manual-api-data.md) — cardinal rule (applies to
Oak API types; non-API data sources have their own typing disciplines),
[ADR-030](030-sdk-single-source-truth.md) — SDK as single source of truth,
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP server primitives,
[ADR-154](154-separate-framework-from-consumer.md) — separate framework from
consumer (the graph resource factory follows this pattern)

## Status Amendment Note (2026-04-30)

This ADR was originally accepted on 2026-04-10 alongside a single
queued plan that proposed exposing EEF Toolkit data through the
existing graph factory pattern. The plan estate has since evolved
(2026-04-30, Iridescent Soaring Planet): the EEF integration is now
modelled as Increment 2 of a five-increment delivery sequence
(graph-query foundation, evidence-corpus extension, cross-source
journeys, telemetry/freshness, deferred school-context overlay),
with `EvidenceCorpus` modelled as composition over a `GraphView`
foundation rather than as a single-purpose surface.

The structural decisions in this ADR (typing discipline for non-API
data, `curriculum://` URI scheme with source-identifying segments,
`eef-*` namespace prefix, machine-readable provenance metadata) are
still operating assumptions for the in-flight work but should be
re-evaluated when the corpus extension lands. Until then, this ADR
is **proposed**, not **accepted** — it documents a direction, not a
constraint.

## Context

This repository currently integrates a single data source: the
[Oak Open Curriculum API](https://open-api.thenational.academy/). All types,
validators, and MCP tools are generated from the API's OpenAPI specification.

The open education landscape includes two additional publicly available
knowledge sources that answer complementary questions:

| Question                              | Source                            | What It Provides                                                                                  |
| ------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------- |
| **What content exists?**              | Oak Open Curriculum API           | Lessons, units, threads, sequences, quizzes, transcripts                                          |
| **How is the curriculum structured?** | Oak Curriculum Ontology           | Oak's NC-aligned knowledge taxonomy (SKOS hierarchy), programme structures, concept relationships |
| **What teaching approaches work?**    | EEF Teaching and Learning Toolkit | 30 evidence-synthesised approaches with impact, cost, and evidence ratings                        |

None of these sources alone can answer all three questions. Together they
enable evidence-grounded curriculum discovery: an AI agent can search for
content (Oak API), understand where it fits in the curriculum structure
(ontology), and recommend evidence-backed teaching approaches (EEF).

**Current framing note (2026-04-29):** this decision is part of the wider repo
goal to combine APIs, MCP, hybrid semantic search, and Oak knowledge graphs as
complementary primitives. The integration is not only internal enrichment; it
is also intended to help the wider education and technology sectors build on
Oak's openly licenced curriculum and knowledge surfaces.

### Data Sources

**[Oak Open Curriculum API](https://open-api.thenational.academy/)**

The existing data source. OpenAPI-generated types, Zod validators, and MCP
tools. Licensed under the
[Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

**[Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)**

Oak's formal semantic representation of curriculum structure, aligned to
the National Curriculum for England (2014). Uses W3C standards (RDF, OWL,
SKOS, SHACL). This is an Oak-developed representation and does not
constitute an official DfE National Curriculum publication. Primary
author: Mark Hodierne. Data licenced under OGL v3.0; code licenced under
MIT.

**[EEF Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)**

The Education Endowment Foundation's evidence synthesis: 30
research-informed teaching approaches with quantified impact (months of
additional progress), cost ratings (1-5), and evidence strength ratings
(0-5 padlocks). EEF MCP server prototype by John Roberts.

## Decision

Integrate the Oak Curriculum Ontology and the EEF Teaching and Learning
Toolkit as data sources alongside the Oak Open Curriculum API. Expose
these through MCP resources, tools, and prompts following the patterns
established by the existing curriculum surfaces.

### Typing Discipline

The cardinal rule (ADR-029) requires that Oak API types flow from the
OpenAPI specification via `pnpm sdk-codegen`. Non-API data sources
(ontology, EEF) do not have OpenAPI specifications. Their typing
discipline is:

- **Ontology data**: Typed interfaces derived from the SKOS/OWL
  structure at build time. Changes to `.ttl` files require re-extraction.
- **EEF data**: Typed interfaces with Zod validation at load time.
  The EEF JSON file is static and versioned. Zod validation catches
  schema drift between the file and the declared types.

Both approaches preserve the principle of strict, compile-time type
safety without requiring an OpenAPI specification.

### URI Scheme Policy

All MCP resources use the `curriculum://` URI scheme with
source-identifying path segments. This keeps a single URI authority
for the server while clearly identifying data provenance:

| Resource                  | URI                                      | Source             |
| ------------------------- | ---------------------------------------- | ------------------ |
| Curriculum model          | `curriculum://model`                     | Oak API + Ontology |
| Prior knowledge graph     | `curriculum://prior-knowledge-graph`     | Oak API            |
| Thread progressions       | `curriculum://thread-progressions`       | Oak API            |
| Misconception graph       | `curriculum://misconception-graph`       | Oak API            |
| EEF methodology           | `curriculum://eef-methodology`           | EEF                |
| EEF strands               | `curriculum://eef-strands`               | EEF                |
| Oak KG knowledge taxonomy | `curriculum://oak-kg-knowledge-taxonomy` | Ontology           |

The `curriculum://` scheme means "curriculum-relevant data from this
server," not "data from the Oak API specifically."

### Namespace Convention

Resource and tool names use a prefix convention that signals data
provenance for citation, credit, and attribution:

| Prefix     | Source                              | Examples                                                |
| ---------- | ----------------------------------- | ------------------------------------------------------- |
| _(none)_   | Oak Open Curriculum API (bulk data) | `prior-knowledge-graph`, `thread-progressions`, `model` |
| `oak-kg-*` | Oak Curriculum Ontology             | `oak-kg-knowledge-taxonomy`                             |
| `eef-*`    | EEF Teaching and Learning Toolkit   | `eef-methodology`, `eef-strands`                        |

**No `nc-*` prefix.** Nothing served by this system is genuinely
National Curriculum data. All curriculum content arrives through an
Oak or EEF intermediary. The NC is a separate entity with separate
ownership (DfE). Using `nc-*` would imply we serve NC data directly,
which would be inaccurate. The upstream API field
`nationalCurriculumContent` is the API's own nomenclature (cardinal
rule, ADR-029) and is not subject to this convention.

**Unprefixed default.** Bulk API data carries no prefix because it is
the original and majority source. Adding a prefix retroactively would
break all existing consumers for no added clarity. This asymmetry is
an accepted trade-off, documented here for transparency.

**Attribution metadata.** In addition to the human-readable prefix,
each resource and tool definition carries machine-readable source
attribution in its `_meta` field (source, licence, attribution note).
This ensures downstream consumers can programmatically identify
provenance without parsing names.

**Known remediation.** The internal codegen pipeline uses `NC`-prefixed
symbols (e.g. `NCCoverageGraph`, `nc-statement-extractor.ts`) for
types that process `nationalCurriculumContent` from bulk data. These
are not exposed as MCP surfaces but should be renamed in a future
session to avoid implying direct NC ownership. See
`.agent/plans/kgs-and-pedagogy/future/ontology-integration-strategy.md`
for the planned rename.

### Licensing

| Source                            | Licence                      | Attribution Required           |
| --------------------------------- | ---------------------------- | ------------------------------ |
| Oak Open Curriculum API           | OGL v3.0                     | Yes (standard OGL attribution) |
| Oak Curriculum Ontology           | OGL v3.0 (data) + MIT (code) | Yes                            |
| EEF Teaching and Learning Toolkit | Attribution required         | Yes (must cite EEF)            |

See [LICENCE-DATA.md](../../../LICENCE-DATA.md) for full licence terms
and attribution requirements.

### Attribution

- **Education Endowment Foundation** — data source, citation required
  on all EEF-derived outputs
- **John Roberts** — EEF MCP server prototype
- **Mark Hodierne / Oak National Academy** — Oak Curriculum Ontology, primary author

## Consequences

### Positive

- The repository becomes multi-source open education knowledge
  infrastructure — a strategic inflection point from "typed API wrapper
  with search" to something that creates capabilities no single source
  provides alone.
- Teachers (via AI agents) can discover curriculum content, understand
  its structural context, and access evidence-backed teaching approaches
  in a single conversation.
- The graph resource factory (ADR-154 pattern: framework separated
  from consumer) enables adding new graph surfaces with ~50 lines
  instead of ~160.
- Attribution and licensing are explicitly documented, reducing
  compliance risk for downstream consumers.

### Early Days, Growing Impact

This is the beginning of a multi-source integration that will deepen
as the ontology matures, EEF data expands, and Oak's knowledge graph
work progresses. The value of these collaborations compounds over time.
The initial surfaces (misconception graph, EEF recommendations, Oak KG
knowledge taxonomy) are deliberately modest in scope — they prove the integration
pattern and deliver immediate value to educators while laying the
foundation for richer cross-source capabilities.

### Two Graph Derivation Methods — Complementary, Not Redundant

The graphs currently wired into this MCP server are **property graphs
derived from the Oak bulk download data** — extracted by the vocab-gen
pipeline at codegen time from JSON lesson/unit records. They model
curriculum content as it appears in Oak's teaching programmes.

The [oak-curriculum-ontology](https://github.com/oaknational/oak-curriculum-ontology)
repository produces **formal knowledge graphs** using W3C standards
(RDF, OWL, SKOS, SHACL). These model curriculum _structure_ — Oak's
representation of NC-aligned knowledge taxonomy, programme structures,
and concept relationships — using ontological reasoning.

In some cases both repositories produce graphs covering the same
domain. For example, both produce a misconception graph: this
repository extracts misconceptions from Oak lesson quiz data (12,858
misconceptions with teacher responses), while the ontology models
misconceptions as typed entities in a formal knowledge graph with
semantic relationships.

**These resources are complementary, not redundant.** They are
constructed from different views on the data using completely
different methods:

| Aspect       | Bulk-derived (this repo)                                       | Ontology-derived (KG repo)                                |
| ------------ | -------------------------------------------------------------- | --------------------------------------------------------- |
| **Source**   | Oak API bulk JSON                                              | RDF/OWL `.ttl` files                                      |
| **Method**   | Codegen-time extraction                                        | Ontological modelling                                     |
| **Strength** | Concrete instances (lesson-level)                              | Formal relationships (concept-level)                      |
| **Example**  | "Students confuse area and perimeter" (from a specific lesson) | Misconception → relatedTo → Concept (typed semantic link) |

As the ontology matures, deeper integration (Levels 4/4b of the
evidence integration strategy) will connect these complementary
views — for instance, linking a bulk-derived misconception instance
to its ontology concept classification. The KG alignment audit
(`.agent/plans/semantic-search/current/kg-alignment-audit.execution.plan.md`)
measures this overlap to inform the integration path.

### Trade-offs

- Each new data source adds a maintenance surface: the typed interfaces
  must be kept aligned with the upstream data as it evolves. Zod
  validation at load time mitigates this for static data (EEF); build-time
  extraction mitigates it for ontology data.
- The cardinal rule (ADR-029) applies strictly to Oak API types. Non-API
  data sources have their own typing disciplines documented above. This
  is a conscious scope boundary, not an exception.
