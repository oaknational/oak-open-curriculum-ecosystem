# External Knowledge Sources

This subthread owns sector-engagement work where Oak consumes third-party
knowledge sources, public curriculum APIs, or future external knowledge graphs
as data sources for applications, **except for EEF Toolkit material, which has
its own dedicated subthread**.

It is separate from
[knowledge-graph-integration/](../../knowledge-graph-integration/), which owns
internal Oak KG integration into MCP, search, QA, and graph-serving layers.

## Sibling Subthreads

| Subthread | Owns |
|---|---|
| [../eef/](../eef/) | EEF Teaching and Learning Toolkit data, strategic brief, technical comparison, and queued MCP surface plan |
| [../knowledge-graph-adoption/](../knowledge-graph-adoption/) | Support for external organisations using Oak's own KG assets |

## Scope

In scope:

- education skills and prompt/workflow corpora from external ecosystems;
- non-Oak public curriculum APIs used to prove pipeline generality;
- future third-party knowledge graphs that Oak may ingest as application data;
- the meta-strategy for evaluating new third-party knowledge sources.

Out of scope:

- EEF Toolkit material — see [`../eef/`](../eef/);
- moving the Oak Curriculum Ontology repo into this monorepo;
- deciding how external organisations should consume Oak's own KG assets;
- long-running implementation details that belong in SDK, MCP, search, or
  infrastructure collections after promotion.

## Current Source Plans

_None currently queued. EEF was previously here and now lives in [`../eef/current/`](../eef/current/)._

## Future Source Plans

| Plan | Source | Status | Notes |
|---|---|---|---|
| [future/education-skills-mcp-surface.plan.md](future/education-skills-mcp-surface.plan.md) | Agent Skills ecosystem | Strategic | External pedagogy/skills corpus surfaced as prompts and discovery tools |
| [future/external-knowledge-graph-data-source-integration.plan.md](future/external-knowledge-graph-data-source-integration.plan.md) | Future external KGs | Strategic | Intake model for third-party knowledge graphs as Oak application data sources |

## Related Sector Sources

- [../oeai/initial-review.md](../oeai/initial-review.md) records a read-only
  review of an external education analytics architecture that may become a
  later engagement or data-model comparison thread.

## Promotion Rule

Promote work from this subthread only when Oak has chosen a specific external
source and can name the intended application, provenance model, validation
rules, and owning implementation collection.
