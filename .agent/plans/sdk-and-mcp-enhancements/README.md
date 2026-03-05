# SDK and MCP Enhancements

**Last Updated**: 5 March 2026

Planning hub for SDK pipeline evolution, MCP extensions, and related
architectural work. Consolidated from the former `pipeline-enhancements/`
and `sdk-and-mcp-enhancements/` directories.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Plans**: [active/README.md](active/README.md)
**Next-Up Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| [roadmap.md](roadmap.md) | Roadmap | MCP Apps standard migration: reframing rationale, coupling inventory, ADR matrix, domain ordering |
| [active/README.md](active/README.md) | Active index | In-progress executable plans |
| [current/README.md](current/README.md) | Current index | Next-up plans queued and ready |
| [future/README.md](future/README.md) | Future index | Deferred/later plans |
| [mcp-apps-support.research.md](mcp-apps-support.research.md) | Research | MCP Apps standard evidence base: ChatGPT support, SEP-1865, capability matrix |

## Read Order

1. **Roadmap first**: [roadmap.md](roadmap.md)
2. **Now (in progress)**: [active/README.md](active/README.md)
3. **Next (queued)**: [current/README.md](current/README.md)
4. **Later (deferred)**: [future/README.md](future/README.md)
5. **Research evidence**: [mcp-apps-support.research.md](mcp-apps-support.research.md)

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
