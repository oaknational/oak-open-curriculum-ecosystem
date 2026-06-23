# Active Plans — SDK and MCP Enhancements

Executable plans that are in progress now.

Cross-boundary context report:
[../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
— formal synthesis of the official ontology's implications for MCP orientation,
direct ontology resources, search projections, and service-level updates.

## Umbrellas

- [mcp-app-extension-migration.plan.md](mcp-app-extension-migration.plan.md) —
  MCP Apps migration. WS1-WS3 Phases 0-4.5 complete and shipped
  (PR #76 merged). Phase 5 pending.

## Open Education Knowledge Surfaces

The historical multi-source umbrella (open-education-knowledge-surfaces) is
archived: WS-0/1/2 landed (`1eb302e8` — ADR + factory + misconception
surface), the EEF workstream was superseded by the graph-tooling rebuild
(live plan:
[`eef-graph-tool-completion.plan.md`](../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md)),
and the surviving strands are owned by their own plans:

- [agent-guidance-consolidation.plan.md](../../connecting-oak-resources/knowledge-graph-integration/active/agent-guidance-consolidation.plan.md) —
  **LIVE**. Consolidate agent guidance for the existing tool surface.
- [nc-knowledge-taxonomy-surface.plan.md](../../connecting-oak-resources/knowledge-graph-integration/future/nc-knowledge-taxonomy-surface.plan.md) —
  **PARKED** (blocked until the EEF tool ships; demand tripwire also live).

Companion follow-on plan outside this collection:

- [../../connecting-oak-resources/knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md](../../connecting-oak-resources/knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md) —
  short neutral review plan for re-reading the ontology repo without a
  search-first frame.
- [../../connecting-oak-resources/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md](../../connecting-oak-resources/knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md) —
  strategic comparison plan that treats direct ontology use as the baseline
  and tests whether Neo4j or Stardog earns a downstream serving role.

## MCP App UI

- [ws3-phase-5-interactive-user-search-view.plan.md](ws3-phase-5-interactive-user-search-view.plan.md) —
  **PENDING**. Interactive user-search MCP App view. Post-merge.

## Codegen Enhancements

- [schema-resilience-and-response-architecture.plan.md](schema-resilience-and-response-architecture.plan.md) —
  **PENDING (open questions)**. Address upstream schema validation
  fragility: `.strict()` → `.strip()` or `.passthrough()` migration
  (OQ1 pending owner decision), schema drift health endpoint
  (Sentry-monitored), response `additionalContext` flag, and direct
  API access guidance. Vercel deploy hook for auto-rebuild noted as
  future option.
- [upstream-api-reference-metadata.plan.md](upstream-api-reference-metadata.plan.md) —
  **PENDING**. Add `upstreamApi` field to generated tool descriptors
  with full upstream API URL, parameters, and statuses. For users who
  discover tools via MCP then call the API directly.
- [mcp-self-description-fidelity.plan.md](mcp-self-description-fidelity.plan.md) —
  **✅ COMPLETE (2026-06-23), awaiting archive.** WS1 (large-payload scope
  hints on the generated asset tools + hand-authored `browse`/`search`) and
  WS2 (curriculum-model ontology subjects 13→17, key stages, and KS4
  examSubject schema-derived; `wjec` fix; version 0.2.0) landed; docs homed;
  gates green; adversarial review done. Knowledge fully homed — safe to move
  to `archive/completed/` in the next curation pass.

## Exploration

- [workspace_topology_exploration.plan.md](workspace_topology_exploration.plan.md) —
  **CURRENT**. Four-tier layered architecture analysis. Phase 2
  (function-level analysis) pending.

## Recently Archived (2026-04-10)

Moved to `archive/completed/`: WS3 rebuild, Phase 6, Vercel warnings,
crash investigation, and all earlier WS1-WS3 phase plans.

## Navigation

- Next-up queue: [current/README.md](../current/README.md)
- Later backlog: [future/README.md](../future/README.md)
- Collection roadmap: [roadmap.md](../roadmap.md)
