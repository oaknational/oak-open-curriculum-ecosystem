# SDK and MCP Enhancements

**Last Updated**: 1 March 2026

Planning hub for SDK pipeline evolution, MCP extensions, and related
architectural work. Consolidated from the former `pipeline-enhancements/`
and `sdk-and-mcp-enhancements/` directories.

## Lifecycle Plans

| Lane | Directory | Contents |
|------|-----------|----------|
| **Active** (now) | [active/](active/) | [get-curriculum-model: Replace get-ontology and get-help](active/ws1-get-curriculum-model.plan.md) — In Progress, WS1 (RED) not started. 6-specialist reviewed. |
| **Current** (next) | [current/](current/) | _(empty — WS2+WS3 collapsed to future review checkpoint)_ |
| **Future** (later) | [future/](future/) | [WS2+WS3: Pedagogical Review Checkpoint](future/ws2-ws3-pedagogical-review-checkpoint.plan.md), [Output Schemas for MCP Tools](future/output-schemas-for-mcp-tools.plan.md) |

## Strategic and Reference Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [improve-pedagogical-context.plan.md](archive/completed/improve-pedagogical-context.plan.md) | Strategic brief: `get-curriculum-model` tool, canonical glossary, pedagogical term disambiguation | Archived (content consolidated into active WS1 plan) |
| [mcp-extensions-research-and-planning.md](mcp-extensions-research-and-planning.md) | Post-merge MCP extensions: research, specialist specification, refactoring and feature backlogs | Blocked (Gate 3) |
| [concept-preservation-and-supersession-map.md](concept-preservation-and-supersession-map.md) | ADR crosswalk and concept provenance for legacy plans | Reference |

## Icebox (Pipeline Framework)

The SDK workspace decomposition trajectory (ADR-108 Workspaces 1 and 3)
and the OpenAPI pipeline framework extraction are iceboxed:

- [openapi-pipeline-framework.md](../icebox/openapi-pipeline-framework.md)

## Source of Truth Model

1. ADRs are the architecture source of truth.
2. Code is the current implementation source of truth.
3. Archived plans are concept sources only — do not execute directly.

## Archive

All legacy materials are archived and should not be executed directly.

| Archive Path | Contents |
|--------------|----------|
| [archive/legacy-numbered/](archive/legacy-numbered/) | Legacy numbered plans (01–18) |
| [archive/implemented/](archive/implemented/) | Historically implemented references |
| [archive/completed/](archive/completed/) | Completed plans with provenance |
| [archive/](archive/) | Historical notes, data artefacts |

## Workspace Context

Per [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md),
work in this area mainly touches:

- WS2: Oak Code-Gen
- WS4: Oak Runtime

Generator-first and schema-first remain non-negotiable.

## Usage Guidance

When promoting a concept from archive:

1. Extract the concept from archived sources.
2. Validate it against accepted ADR constraints.
3. Verify current-state claims in code.
4. Promote execution detail into an active plan, not an archived plan.
5. Add provenance links back to the archived source.
