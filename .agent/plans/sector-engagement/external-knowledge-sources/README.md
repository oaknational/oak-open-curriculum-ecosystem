# External Knowledge Sources

This subthread owns sector-engagement work where Oak consumes third-party
knowledge sources, evidence sources, public curriculum APIs, or future external
knowledge graphs as data sources for applications.

It is separate from
[knowledge-graph-integration/](../../knowledge-graph-integration/), which owns
internal Oak KG integration into MCP, search, QA, and graph-serving layers.

## Scope

In scope:

- EEF Toolkit evidence data and related pedagogy resources;
- education skills and prompt/workflow corpora from external ecosystems;
- non-Oak public curriculum APIs used to prove pipeline generality;
- future third-party knowledge graphs that Oak may ingest as application data.

Out of scope:

- moving the Oak Curriculum Ontology repo into this monorepo;
- deciding how external organisations should consume Oak's own KG assets;
- long-running implementation details that belong in SDK, MCP, search, or
  infrastructure collections after promotion.

## Current Source Plans

| Plan | Source | Status | Notes |
|---|---|---|---|
| [current/eef-evidence-mcp-surface.plan.md](current/eef-evidence-mcp-surface.plan.md) | EEF Teaching and Learning Toolkit | Queued | External evidence source exposed through Oak MCP surfaces |

## Future Source Plans

| Plan | Source | Status | Notes |
|---|---|---|---|
| [future/education-skills-mcp-surface.plan.md](future/education-skills-mcp-surface.plan.md) | Agent Skills ecosystem | Strategic | External pedagogy/skills corpus surfaced as prompts and discovery tools |
| [future/evidence-integration-strategy.md](future/evidence-integration-strategy.md) | EEF + Oak curriculum | Strategic | Impact requirements and integration levels for evidence/curriculum crosswalks |
| [future/oak-eef-technical-comparison.md](future/oak-eef-technical-comparison.md) | EEF prototype | Reference | Technical comparison of EEF and Oak MCP stacks |
| [future/eef-toolkit.json](future/eef-toolkit.json) | EEF Toolkit | Data reference | Dataset snapshot used by the EEF integration plan |
| [future/external-knowledge-graph-data-source-integration.plan.md](future/external-knowledge-graph-data-source-integration.plan.md) | Future external KGs | Strategic | Intake model for third-party knowledge graphs as Oak application data sources |

## Related Sector Sources

- [../future/finnish-national-curriculum-api-pipeline-demonstration.plan.md](../future/finnish-national-curriculum-api-pipeline-demonstration.plan.md)
  covers a public curriculum API rather than a graph, but exercises the same
  external-source intake question.
- [../oeai/initial-review.md](../oeai/initial-review.md) records a read-only
  review of an external education analytics architecture that may become a
  later engagement or data-model comparison thread.

## Promotion Rule

Promote work from this subthread only when Oak has chosen a specific external
source and can name the intended application, provenance model, validation
rules, and owning implementation collection.
