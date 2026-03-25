# SDK and MCP Enhancements

**Last Updated**: 7 March 2026

Planning hub for SDK pipeline evolution, MCP extensions, and related
architectural work. Consolidated from the former `pipeline-enhancements/`
and `sdk-and-mcp-enhancements/` directories.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Plans**: [active/README.md](active/README.md)
**Current Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| [roadmap.md](roadmap.md) | Roadmap | MCP Apps standard migration: reframing rationale, coupling inventory, ADR matrix, domain ordering |
| [active/README.md](active/README.md) | Active index | In-progress executable plans |
| [current/README.md](current/README.md) | Current index | Executable plans queued or resumable |
| [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md) | Current plan | Add truthful `outputSchema` metadata to every MCP tool while keeping generated upstream-response validation aligned with the actual MCP `structuredContent` envelope |
| [archive/completed/oak-preview-mcp-snagging.execution.plan.md](archive/completed/oak-preview-mcp-snagging.execution.plan.md) | Completed | All phases complete; post-deploy reindex is operational only. Archived 2026-03-11. |
| [future/README.md](future/README.md) | Future index | Deferred/later plans |
| [mcp-apps-support.research.md](mcp-apps-support.research.md) | Research | MCP Apps standard evidence base: ChatGPT support, SEP-1865, capability matrix |
| [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md) | Active plan | Plainly named execution entry point for replacing legacy OpenAI App surfaces with MCP Apps infrastructure |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Now (in progress)**: [active/README.md](active/README.md)
3. **Active MCP Apps migration entry point**: [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md)
4. **Archived oak-preview snagging**: [archive/completed/oak-preview-mcp-snagging.execution.plan.md](archive/completed/oak-preview-mcp-snagging.execution.plan.md)
5. **Current queue index**: [current/README.md](current/README.md)
6. **Current output-schema work**: [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md)
7. **Later (deferred)**: [future/README.md](future/README.md)
8. **Research evidence**: [mcp-apps-support.research.md](mcp-apps-support.research.md)

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
| [archive/](archive/) | Historical notes, data artefacts, applied metaplans |

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
