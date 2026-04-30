# Sector Engagement

Sector engagement collects plans, reviews, and reference material for helping
external organisations use Oak's open curriculum infrastructure and for
coordinating with upstream or adjacent education data sources.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Plans**: [active/README.md](active/README.md)
**Next-Up Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)

## Scope

This collection owns engagement work where the primary question is how Oak's
resources travel beyond this repository:

- external data sources and upstream API coordination;
- external organisation adoption of Oak pipelines, SDKs, MCP servers, semantic
  search configuration, knowledge graphs, and generated artefacts;
- external knowledge sources or knowledge graphs that Oak may ingest as data
  sources for applications;
- partner-facing review threads that evaluate whether and how an external
  project should use or inform Oak's work;
- cross-project requirements packs that are read by people outside the Oak
  repo.

## Impact Intent

The desired impact is not just that this repo contains useful code. The desired
impact is that Oak's open curriculum infrastructure becomes a practical public
asset: external organisations can understand it, trust it, adapt it, and build
with it without depending on private Oak context. Sector-engagement plans should
therefore name the outside user or organisation, the resource they need, the
support or evidence that would make reuse safe, and the point at which an
internal engineering plan is needed.

The recurring resources in scope are the OpenAPI-driven pipeline, generated
SDKs, MCP server surfaces, semantic-search configuration, knowledge-graph
assets, and the documentation/playbooks that make those assets usable by
others. The collection also tracks how MCP Apps in AI platforms such as Claude
Cowork and ChatGPT can turn those assets into practical end-user and developer
experiences.

Implementation of the underlying systems usually remains with the relevant
engineering collections. For example, SDK publishing stays in
`developer-experience/`, MCP runtime work stays in `sdk-and-mcp-enhancements/`,
and search relevance work stays in `semantic-search/`. Source-ingestion plans
may live here when the external-source semantics, provenance, and adoption
context are the main risk; code delivery still links to the owning
implementation collection when promoted.

## Documents

| Path | Type | Description |
|---|---|---|
| [roadmap.md](roadmap.md) | Roadmap | Sector-engagement phase sequence and ownership boundaries |
| [active/README.md](active/README.md) | Active index | In-progress sector-engagement execution plans |
| [current/README.md](current/README.md) | Current index | Queued sector-engagement plans |
| [future/README.md](future/README.md) | Future index | Deferred strategic briefs and partner/data-source opportunities |
| [external-material-triage.md](external-material-triage.md) | Triage note | Current disposition of legacy external material and retained/rejected relevance |
| [eef/](eef/) | EEF subthread | EEF Teaching and Learning Toolkit: queued MCP surface plan, strategic brief, technical comparison, and dataset snapshot |
| [external-knowledge-sources/](external-knowledge-sources/) | Source-ingestion thread | External education skills, non-Oak public curriculum APIs, and future KG sources consumed by Oak applications |
| [knowledge-graph-adoption/](knowledge-graph-adoption/) | Adoption thread | Support model for external organisations using Oak KG assets |
| [castr/](castr/) | Partner/reference pack | Requirements for an external OpenAPI/codegen tool to support Oak's schema-first pipeline |
| [ooc-api-wishlist/](ooc-api-wishlist/) | Upstream coordination | Oak Open Curriculum API wishlist, examples, and enhancement proposals |
| [ooc-issues/](ooc-issues/) | External issue reports | Standalone issue reports for upstream API teams |
| [oeai/](oeai/) | Partner thread | Open Education AI review and future engagement notes |

## Read Order

1. [roadmap.md](roadmap.md)
2. [future/README.md](future/README.md)
3. [external-material-triage.md](external-material-triage.md)
4. [eef/README.md](eef/README.md)
5. [external-knowledge-sources/README.md](external-knowledge-sources/README.md)
6. [knowledge-graph-adoption/README.md](knowledge-graph-adoption/README.md)
7. [ooc-api-wishlist/index.md](ooc-api-wishlist/index.md)
8. [ooc-issues/README.md](ooc-issues/README.md)
9. [oeai/README.md](oeai/README.md)

## Document Roles

- **Roadmap** records the sector-engagement sequence and promotion triggers.
- **Lifecycle indexes** record active, queued, and later plan state.
- **Partner/reference folders** preserve evidence and requirements packs.
- **External source threads** preserve intake strategy for third-party sources
  that Oak may consume.
- **Adoption threads** preserve support strategy for organisations consuming
  Oak's own resources.
- **OEAI and similar sub-threads** hold organisation-specific reviews and
  engagement notes.

When a sector-engagement thread identifies engineering work, promote that work
into the owning implementation collection and link back here for context.

## Foundation Documents

Before promoting sector-engagement work into executable implementation plans,
re-read:

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question: Could it be simpler without compromising quality?
