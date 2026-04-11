# ADR-157: Multi-Source Open Education Knowledge Integration

**Status**: Accepted
**Date**: 2026-04-10
**Related**: [ADR-029](029-no-manual-api-data.md) — cardinal rule (applies to
Oak API types; non-API data sources have their own typing disciplines),
[ADR-030](030-sdk-single-source-truth.md) — SDK as single source of truth,
[ADR-123](123-mcp-server-primitives-strategy.md) — MCP server primitives,
[ADR-154](154-separate-framework-from-consumer.md) — separate framework from
consumer (the graph resource factory follows this pattern)

## Context

This repository currently integrates a single data source: the
[Oak Open Curriculum API](https://open-api.thenational.academy/). All types,
validators, and MCP tools are generated from the API's OpenAPI specification.

The open education landscape includes two additional publicly available
knowledge sources that answer complementary questions:

| Question                              | Source                            | What It Provides                                                           |
| ------------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| **What content exists?**              | Oak Open Curriculum API           | Lessons, units, threads, sequences, quizzes, transcripts                   |
| **How is the curriculum structured?** | Oak Curriculum Ontology           | Formal NC knowledge taxonomy, concept relationships, progressions          |
| **What teaching approaches work?**    | EEF Teaching and Learning Toolkit | 30 evidence-synthesised approaches with impact, cost, and evidence ratings |

None of these sources alone can answer all three questions. Together they
enable evidence-grounded curriculum discovery: an AI agent can search for
content (Oak API), understand where it fits in the curriculum structure
(ontology), and recommend evidence-backed teaching approaches (EEF).

### Data Sources

**[Oak Open Curriculum API](https://open-api.thenational.academy/)**

The existing data source. OpenAPI-generated types, Zod validators, and MCP
tools. Licensed under the
[Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

**[Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)**

A W3C-compliant formal knowledge graph (RDF, OWL, SKOS, SHACL) modelling
the UK National Curriculum and Oak's teaching programmes. Primary author:
Mark Hodierne. Data licensed under OGL v3.0; code licensed under MIT.

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

| Resource              | URI                                  | Source             |
| --------------------- | ------------------------------------ | ------------------ |
| Curriculum model      | `curriculum://model`                 | Oak API + Ontology |
| Prior knowledge graph | `curriculum://prior-knowledge-graph` | Oak API            |
| Thread progressions   | `curriculum://thread-progressions`   | Oak API            |
| Misconception graph   | `curriculum://misconception-graph`   | Oak API            |
| EEF methodology       | `curriculum://eef-methodology`       | EEF                |
| EEF strands           | `curriculum://eef-strands`           | EEF                |
| NC knowledge taxonomy | `curriculum://nc-knowledge-taxonomy` | Ontology           |

The `curriculum://` scheme means "curriculum-relevant data from this
server," not "data from the Oak API specifically."

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
The initial surfaces (misconception graph, EEF recommendations, NC
taxonomy) are deliberately modest in scope — they prove the integration
pattern and deliver immediate value to educators while laying the
foundation for richer cross-source capabilities.

### Trade-offs

- Each new data source adds a maintenance surface: the typed interfaces
  must be kept aligned with the upstream data as it evolves. Zod
  validation at load time mitigates this for static data (EEF); build-time
  extraction mitigates it for ontology data.
- The cardinal rule (ADR-029) applies strictly to Oak API types. Non-API
  data sources have their own typing disciplines documented above. This
  is a conscious scope boundary, not an exception.
