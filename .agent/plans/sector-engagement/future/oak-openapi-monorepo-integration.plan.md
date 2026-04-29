---
name: "Oak OpenAPI Monorepo Integration"
overview: "Strategic brief for deciding whether and how the sibling oak-openapi repo should integrate with this monorepo so the public API, SDKs, MCP server, semantic search, and KG work converge coherently."
status: future
source_repos:
  - "oak-openapi sibling checkout"
related_plans:
  - "../ooc-api-wishlist/index.md"
  - "../external-material-triage.md"
  - "../../knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md"
specialist_reviewer: "architecture-reviewer-betty, architecture-reviewer-barney, type-reviewer, docs-adr-reviewer"
---

# Oak OpenAPI Monorepo Integration

**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Collection**: `sector-engagement/`
**Last updated**: 2026-04-29

## Problem and Intent

The sibling `oak-openapi` repo is the upstream public API application. It is a
Next.js app serving REST-like API endpoints through tRPC + OpenAPI, Swagger JSON,
documentation pages, and bulk-download infrastructure for Oak curriculum data.
This repository consumes that API contract through generated SDKs, MCP surfaces,
semantic search indexing, and future KG/API convergence work.

The intent is to decide whether and how the Oak OpenAPI repo should integrate
with this monorepo so external organisations see a coherent Oak API + SDK +
MCP + semantic search + knowledge graph ecosystem.

## Ownership Note

This sector-engagement brief preserves consumer evidence, ecosystem rationale,
and adoption context. If Oak promotes the repo-topology decision into
execution, the executable decision plan should live under the owning
architecture collection and link back here for sector-facing context.

## Domain Boundaries and Non-Goals

In scope:

- evaluating repo integration models for the public API app and this monorepo;
- aligning OpenAPI generation, SDK codegen, MCP tool surfaces, semantic search,
  and KG/API requirements;
- preserving downstream consumer feedback from `ooc-api-wishlist/` and
  `ooc-issues/` as API-roadmap evidence.

Explicit non-goals:

- moving the `oak-openapi` repo during this strategic brief;
- hand-editing generated OpenAPI output;
- making this repo the source of truth for API behaviour without a decision;
- treating legacy external wishlist items as current bugs without validating
  them against the live Oak OpenAPI implementation.

## Dependencies and Sequencing Assumptions

1. The Oak OpenAPI repo's local schema-first directive says OpenAPI output must
   flow from router/Zod schemas and `pnpm generate:openapi`; this plan must
   preserve that contract.
2. Castr remains relevant as a future codegen replacement candidate because the
   current downstream pipeline still needs a route away from the dead
   `openapi-to-zod` / `openapi-zod-client` dependency chain.
3. The ontology workspace reassessment is a sibling convergence decision. API
   integration and KG integration should be compared together before either
   repo boundary is treated as settled.

## Candidate Models

| Model | What it optimises | Primary concern |
|---|---|---|
| Separate repos with stronger contract CI | Low disruption | Continued cross-repo drift |
| Generated OpenAPI artefact dependency | Clear downstream contract | Less visibility into API implementation changes |
| Shared workspace / monorepo absorption | End-to-end API -> SDK -> MCP -> search validation | Larger repo, ownership, and deployment complexity |
| Hybrid: API remains app, generated contract moves here | Contract centrality | Two-source navigation and release discipline |

## Success Signals

Promotion is justified when Oak can answer:

1. which repo is authoritative for each layer: API runtime, OpenAPI contract,
   generated SDK, MCP tools, search documents, KG/API enrichment;
2. which external wishlist/issue items are still current after comparison with
   the `oak-openapi` repo;
3. which validation command proves the API contract and downstream generated
   consumers stay aligned;
4. which integration model best supports sector-facing adoption.

## Risks and Unknowns

| Risk | Severity | Mitigation |
|---|---|---|
| Monorepo integration blurs API runtime and downstream consumer ownership | High | Define layer ownership before any move |
| External feedback is promoted without current API validation | Medium | Cross-check against the current `oak-openapi` implementation before action |
| Generated contract flow becomes bidirectional or hand-edited | High | Preserve schema-first generation from API router/Zod schemas |
| API/KG convergence is solved piecemeal | High | Compare with ontology workspace reassessment before final topology decision |

## Promotion Trigger Into `current/`

Promote when Oak wants a bounded architecture decision on the API repo boundary
and can allocate time to compare the candidate models with real commands,
deployment ownership, and downstream contract validation.

## Reference-Context Rule

Implementation detail in this brief is reference context only. Repo movement,
workspace topology, and validation gates are finalised only during promotion.
