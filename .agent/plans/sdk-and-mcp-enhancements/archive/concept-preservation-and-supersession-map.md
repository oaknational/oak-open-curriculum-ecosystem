# SDK and MCP Concept Preservation and Supersession Map

**Last Updated**: 5 March 2026
**Purpose**: Preserve useful engineering concepts from older plans while
preventing execution drift from stale plan mechanics.

## Why This Exists

Many plans in this area were created during earlier architecture phases.
Some were implemented, some partially implemented, and some superseded by
later ADR decisions. This document preserves conceptual value while
discarding stale status labels, sequencing, and file-path assumptions.

## Concept Domains

| Concept Domain | Preserved Idea | Archived Concept Sources | Current Home |
|---|---|---|---|
| Host-neutral tool metadata | Generator-first descriptor enrichment; separate canonical metadata from host-specific projections | `archive/legacy-numbered/01-*` | [roadmap.md](../roadmap.md) (Domain C) |
| Ontology and model grounding | Ontology as structured context primitive; model-visible vs component-only channel separation | `archive/legacy-numbered/02-*`, `10-*`, `16-*` | [roadmap.md](../roadmap.md) (Domains A, B, D) |
| Public resource auth posture | Selective auth bypass for explicitly safe public resources only, constrained by ADR auth boundaries | `archive/legacy-numbered/15a-*`, `15b-*` | [roadmap.md](../roadmap.md) (ADR matrix) |
| Widget safety and rollout control | Shell-first safety gate; deterministic checks before richer rendering | `archive/legacy-numbered/04-widget-*`, `11-*`, `archive/07-*` | [roadmap.md](../roadmap.md) (Domain D) |
| Advanced MCP composition | Config-driven composite tools; code-generation ownership of complex primitives | `archive/legacy-numbered/03-*`, `18-*` | [roadmap.md](../roadmap.md) (Domains C, D) |
| Prompt and guidance ergonomics | Practical prompt/workflow lessons | `archive/legacy-numbered/04-mcp-prompts-*`, `06-*`, `08b-*` | Future scoped plan from Domain D |
| Search quality enrichment | Synonym/query-intent enrichment | `archive/implemented/17-*` | Candidate backlog under Domain D |
| Pipeline framework extraction | Single-pass OpenAPI-to-SDK generator replacing openapi-typescript and openapi-zod-client | Former `pipeline-enhancements/` plans | [icebox/openapi-pipeline-framework.md](../icebox/openapi-pipeline-framework.md) |

## ADR Supersession Crosswalk

| Legacy Theme | ADR Signal | Interpretation |
|---|---|---|
| dotenv-style env loading | ADR-016 superseded by ADR-116 | Use `resolveEnv` pipeline model |
| Consola-first logging | ADR-017 superseded by ADR-051 | OTel-compliant single-line JSON logging |
| Runtime dynamic dispatch for tool typing | ADR-037 superseded by ADR-038 | Compile-time embedding and generator-owned validation |
| Broad discovery-method auth bypass | ADR-056 superseded by ADR-113 | Auth for all MCP methods; only explicit public-resource exceptions |
| Selective public resource bypass | ADR-057 accepted, constrained by ADR-113 | Explicit public-resource scope only |
| Mixed-origin OAuth for Cursor | ADR-115 accepted with ADR-052/053/113 | Same-origin proxy OAuth AS baseline |
| Reused singleton transport/server | ADR-112 accepted | Per-request MCP server + transport |
| Runtime widget URI cache-busting | ADR-071 accepted | Code-gen URI generation with parity checks |
| Dense-vector-first search | ADR-118 superseded by ADR-075 | Two-way hybrid baseline |
| NL interpretation in SDK core | ADR-107 accepted | SDK deterministic; NL in MCP/app boundary |
| Layering DAG | ADR-050 proposed | Directional only; not binding until accepted |
| Rich widget CTA expansion | ADR-061 accepted | Future concept; shell and safety gates first |

## Supersession Categories

Apply this interpretation to archived legacy plans:

1. **Implemented but drifted**: core idea valid, execution mechanics stale.
2. **Partially implemented**: some concepts landed, remainder needs
   ADR-aligned re-planning.
3. **Deferred historical context**: rationale source only, not direct
   execution.
4. **Superseded by active plans**: execution now lives in current anchors.

## Promotion Workflow

When promoting a concept from archive:

1. Extract a candidate note: problem, value, ADR constraints, evidence.
2. Validate against current accepted ADRs.
3. Confirm current-state feasibility in code.
4. Place execution detail in an active plan.
5. Add provenance backlink to archived concept source.
6. Record promotion date and owner in the active plan.

## Guardrails

1. Generator-first and schema-first are non-negotiable.
2. `/mcp` is the single transport surface.
3. Accepted ADRs are binding; superseded/proposed ADRs are context only.
4. Widget safety and data-minimisation gates must be explicit and testable.
5. Prefer promoting concepts into active plans over editing archived plans.
