# SDK and MCP Concept Preservation and Supersession Map

**Last Updated**: 22 February 2026  
**Purpose**: Preserve useful engineering concepts from older plans while preventing execution drift from stale plan mechanics.

## Why This Exists

Many plans in this area were created during earlier architecture phases.
Some were implemented, some partially implemented, and some superseded by later ADR decisions.

The goal is to preserve conceptual value while discarding stale status labels, stale sequencing, and stale file-path assumptions.

## Execution Anchors (Current)

Use these as current execution anchors:

1. Pre-merge widget stabilisation (Tracks 1a + 1b):
   `.agent/plans/semantic-search/active/widget-search-rendering.md`
2. Search dispatch type safety (B1/W1):
   `.agent/plans/semantic-search/archive/completed/search-dispatch-type-safety.md`
3. Post-merge MCP extensions and ADR-aligned future work:
   `.agent/plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md`

Execution rule:

- Do not execute archived legacy plans directly unless explicitly promoted into an active execution plan.

## Concept Domains to Preserve

| Concept Domain | Preserved Idea | Archived Concept Sources | Current Home |
| --- | --- | --- | --- |
| Host-neutral tool metadata | Keep generator-first descriptor enrichment and separate canonical metadata from host-specific projections | `archive/legacy-numbered/01-mcp-tool-metadata-enhancement-plan.md` | `mcp-extensions-research-and-planning.md` (Domain C, ADR matrix) |
| Ontology and model grounding | Keep ontology as a structured context primitive and preserve model-visible vs component-only channel separation | `archive/legacy-numbered/02-curriculum-ontology-resource-plan.md`, `archive/legacy-numbered/10-quick-wins-from-aila-research.md`, `archive/legacy-numbered/16-context-grounding-optimization.md` | `mcp-extensions-research-and-planning.md` (Domains A, B, D) |
| Public resource auth posture | Keep selective auth bypass for explicitly safe public resources only, constrained by ADR auth boundaries | `archive/legacy-numbered/15a-public-resource-auth-bypass.md`, `archive/legacy-numbered/15b-static-widget-shell-optimization.md` | `mcp-extensions-research-and-planning.md` (ADR-057/113/115 mapping and gates) |
| Widget safety and rollout control | Preserve shell-first safety gate and deterministic checks before richer rendering returns | `archive/legacy-numbered/04-widget-and-tooling-improvements.md`, `archive/legacy-numbered/11-widget-universal-renderers-plan.md`, `archive/07-widget-playwright-tests-plan.md` | `widget-search-rendering.md` (Tracks 1a and 1b), then `mcp-extensions-research-and-planning.md` |
| Advanced MCP composition patterns | Preserve config-driven composite tools and type-gen ownership of complex primitives | `archive/legacy-numbered/03-mcp-infrastructure-advanced-tools-plan.md`, `archive/legacy-numbered/18-schema-driven-sdk-adapter-generation-plan.md` | `mcp-extensions-research-and-planning.md` (Domains C and D) |
| Prompt and guidance ergonomics | Preserve practical prompt/workflow lessons without inheriting old execution structure | `archive/legacy-numbered/04-mcp-prompts-and-agent-guidance-plan.md`, `archive/legacy-numbered/06-ux-improvements-and-research-plan.md`, `archive/legacy-numbered/08b-openai-apps-sdk-part-2-deferred.md` | Future scoped plan from Domain D candidates |
| Search quality enrichment | Preserve synonym/query-intent enrichment theme | `archive/implemented/17-synonym-enrichment-from-owa-oala.md` | Candidate backlog item under Domain D |

## Supersession Categories

Apply this interpretation to archived legacy plans:

1. Implemented but drifted: core idea valid, execution mechanics stale.
2. Partially implemented: some concepts landed, remainder needs ADR-aligned re-planning.
3. Deferred historical context: rationale source only, not direct execution.
4. Superseded by active plans: execution now lives in current anchors.

## ADR Supersession and Constraint Crosswalk

| Legacy Theme in Archived Plans | ADR Signal | Practical Interpretation Now |
| --- | --- | --- |
| dotenv-style or ad-hoc environment loading assumptions | ADR-016 superseded by ADR-116 | Treat as historical; use `resolveEnv` pipeline model. |
| Consola-first logging assumptions | ADR-017 superseded by ADR-051 | Treat old logging assumptions as obsolete; keep OTel-compliant single-line JSON logging. |
| Runtime lookup or dynamic dispatch patterns for tool typing | ADR-037 superseded by ADR-038 | Prefer compile-time embedding and generator-owned validation. |
| Broad discovery-method auth bypass as default | ADR-056 superseded by ADR-113 | Do not bypass auth for MCP methods generally; only explicit public-resource exceptions remain. |
| Selective public resource bypass | ADR-057 accepted and constrained by ADR-113 | Keep only in explicit public-resource scope and MCP-spec-compliant auth boundaries. |
| Mixed-origin OAuth assumptions for Cursor | ADR-115 accepted with ADR-052/053/113 | Same-origin proxy OAuth AS behaviour is the compatibility baseline. |
| Reused singleton transport/server assumptions | ADR-112 accepted | Use per-request MCP server plus transport creation. |
| Runtime query-parameter cache-busting for widget URIs | ADR-071 (widget URI cache-busting simplification) accepted | Prefer type-gen URI generation and generated/runtime parity checks. |
| Legacy dense-vector-first assumptions | ADR-118 superseded by ADR-075 | Treat dense vector strategy as historical; two-way hybrid baseline remains current unless new ADR changes this. |
| NL interpretation inside SDK core | ADR-107 accepted | Keep SDK deterministic; NL parsing stays in MCP/app boundary layers. |
| Layering DAG draft as binding policy | ADR-050 proposed | Directional only; not binding until accepted. |
| Immediate rich widget CTA expansion | ADR-061 accepted, but pre-merge tracks gate richer behaviour | Preserve as future concept; keep shell and safety gates first. |

ADR baseline policy:

1. Accepted ADRs are binding.
2. Superseded ADRs are historical/context checks only.
3. Proposed ADRs are directional context only.

## Promotion Workflow (Concept to Active Work)

When promoting a concept from archive:

1. Extract a candidate note: problem, value, ADR constraints, evidence.
2. Validate against current accepted ADRs.
3. Confirm current-state feasibility in code.
4. Place execution detail in an active plan.
5. Add provenance backlink to archived concept source.
6. Record promotion date and owner in the active plan.

## Guardrails

1. Keep generator-first and schema-first as non-negotiable.
2. Keep `/mcp` as the single transport surface.
3. Keep accepted ADRs binding and superseded/proposed ADRs as context only.
4. Keep widget safety and data-minimisation gates explicit and testable.
5. Prefer promoting concepts into active plans over editing archived plans.
