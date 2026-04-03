# SDK and MCP Enhancements

**Last Updated**: 3 April 2026

Planning hub for SDK pipeline evolution, MCP Apps work, and related
architectural changes.

**Collection Roadmap**: [roadmap.md](roadmap.md)
**Active Plans**: [active/README.md](active/README.md)
**Current Plans**: [current/README.md](current/README.md)
**Later Plans**: [future/README.md](future/README.md)

## Documents

| File | Type | Description |
|------|------|-------------|
| [roadmap.md](roadmap.md) | Roadmap | Strategic MCP Apps migration anchor, constraints, and dependency ordering |
| [active/README.md](active/README.md) | Active index | In-progress executable plans |
| [current/README.md](current/README.md) | Current index | Executable plans queued or resumable |
| [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md) | Active umbrella plan | Primary session-anchor plan for the MCP Apps migration |
| [active/ws3-widget-clean-break-rebuild.plan.md](active/ws3-widget-clean-break-rebuild.plan.md) | Active child plan | Fresh React MCP App rebuild. Deletes the dead widget framework and replaces it with MCP Apps infrastructure built from scratch |
| [active/README.md#ws3-phase-companion-plans](active/README.md#ws3-phase-companion-plans) | Phase companion index | Seven WS3 phase companion plans with task-level execution detail; parent WS3 plan remains orchestration source of truth |
| [current/ws3-contrast-validation-prerequisite.plan.md](current/ws3-contrast-validation-prerequisite.plan.md) | Current plan | Build WCAG contrast validation into the token pipeline and fix the blocking token accessibility failures before Phase 4 starts |
| [current/ws3-oak-url-augmentable-codegen-fix.plan.md](current/ws3-oak-url-augmentable-codegen-fix.plan.md) | Current plan | Replace widening Oak URL augmentation typing with schema-derived GET response unions and honest middleware validation |
| [archive/completed/ws3-design-token-prerequisite.plan.md](archive/completed/ws3-design-token-prerequisite.plan.md) | Completed plan | Minimal design-token infrastructure prerequisite completed and archived; Phase 4/5 now build on the shared token package and canonical shell |
| [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md) | Current plan | Add truthful `outputSchema` metadata to every MCP tool while keeping generated upstream-response validation aligned with actual MCP `structuredContent` envelopes |
| [archive/completed/ws2-app-runtime-migration.plan.md](archive/completed/ws2-app-runtime-migration.plan.md) | Completed child plan | WS2 runtime migration completed and archived |
| [archive/completed/mcp-runtime-boundary-simplification.plan.md](archive/completed/mcp-runtime-boundary-simplification.plan.md) | Completed plan | Canonical runtime descriptor surface and ingress-boundary simplification completed and archived |
| [mcp-apps-support.research.md](mcp-apps-support.research.md) | Research | Canonical MCP Apps research summary for Oak. Active implementation is governed by the MCP Apps spec, `@modelcontextprotocol/ext-apps`, and the live executable plans |
| [future/README.md](future/README.md) | Future index | Deferred/later plans |

## Read Order

1. [roadmap.md](roadmap.md)
2. [active/README.md](active/README.md)
3. [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md)
4. [active/ws3-widget-clean-break-rebuild.plan.md](active/ws3-widget-clean-break-rebuild.plan.md)
5. [current/README.md](current/README.md)
6. [current/ws3-oak-url-augmentable-codegen-fix.plan.md](current/ws3-oak-url-augmentable-codegen-fix.plan.md)
7. [current/ws3-contrast-validation-prerequisite.plan.md](current/ws3-contrast-validation-prerequisite.plan.md)
8. [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md)
9. [archive/completed/ws3-design-token-prerequisite.plan.md](archive/completed/ws3-design-token-prerequisite.plan.md)
10. [future/README.md](future/README.md)

## Source of Truth Model

1. Accepted ADRs are the architectural source of truth.
2. Code is the implementation source of truth.
3. Active and current plans are the execution source of truth.
4. Archived plans and research artefacts are provenance and context only.

## Status Legend

Use these canonical status tokens across this collection:

- `ACTIVE` — currently executing and session-anchor relevant
- `IN PROGRESS` — partially delivered, with remaining scoped work
- `QUEUED` — prioritised next, not yet executing
- `PLANNED` — identified future work, not yet queued
- `PENDING` — todo-level item not yet started
- `COMPLETED` / `COMPLETE` — finished and verified
- `SUPERSEDED` — replaced by a newer authoritative plan/path
- `STRATEGIC` — long-horizon planning item, not immediate execution
- `REFERENCE` — context/source artefact, not an active execution task

## MCP Apps Direction

- Oak is building an MCP App, not preserving a legacy app surface.
- Active implementation is governed by the MCP Apps spec and
  `@modelcontextprotocol/ext-apps`.
- Background research artefacts are not normative design input.

## Icebox (Pipeline Framework)

The SDK workspace decomposition trajectory (ADR-108 Workspaces 1 and 3)
and the OpenAPI pipeline framework extraction are iceboxed:

- [openapi-pipeline-framework.md](../icebox/openapi-pipeline-framework.md)

## Usage Guidance

When promoting an archived concept back into live work:

1. Re-validate it against accepted ADRs and current code.
2. Strip any compatibility-layer thinking, stale counts, or historical
   assumptions before reuse.
3. Promote execution detail into `active/` or `current/`, never into archive.
