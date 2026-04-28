# SDK and MCP Enhancements

**Last Updated**: 28 April 2026

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
| [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md) | Formal report | Cross-boundary synthesis of the official ontology's implications for MCP orientation, direct ontology surfaces, search projections, and service updates |
| [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md) | Active umbrella plan | Primary session-anchor plan for the MCP Apps migration |
| [archive/completed/ws3-widget-clean-break-rebuild.plan.md](archive/completed/ws3-widget-clean-break-rebuild.plan.md) | Completed child plan | Fresh React MCP App rebuild completed and archived for provenance |
| [archive/completed/ws3-phase-6-docs-gates-review-commit.plan.md](archive/completed/ws3-phase-6-docs-gates-review-commit.plan.md) | Completed child plan | WS3 Phase 6 closeout plan covering docs, gates, review, and commit hygiene |
| [archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md](archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md) | Completed plan | Phase 4.5 wrap-up complete: projection removal, SDK-ready tool metadata, TSDoc/doc sync, and readiness evidence archived |
| [archive/completed/embed-widget-html-at-build-time.plan.md](archive/completed/embed-widget-html-at-build-time.plan.md) | Completed plan | Widget HTML now follows the committed codegen-constant pattern, preserves DI, and records the runtime decision in ADR-156 |
| [current/ws3-contrast-validation-prerequisite.plan.md](current/ws3-contrast-validation-prerequisite.plan.md) | Current plan (complete, awaiting archive) | Build WCAG contrast validation into the token pipeline and fix the blocking token accessibility failures before Phase 4 starts |
| [current/ws3-oak-url-augmentable-codegen-fix.plan.md](current/ws3-oak-url-augmentable-codegen-fix.plan.md) | Current plan (complete, awaiting archive) | Replace widening Oak URL augmentation typing with schema-derived GET response unions and honest middleware validation |
| [archive/completed/ws3-design-token-prerequisite.plan.md](archive/completed/ws3-design-token-prerequisite.plan.md) | Completed plan | Minimal design-token infrastructure prerequisite completed and archived; Phase 4/5 now build on the shared token package and canonical shell |
| [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md) | Current plan | Add truthful `outputSchema` metadata to every MCP tool while keeping generated upstream-response validation aligned with actual MCP `structuredContent` envelopes |
| [current/clerk-mcp-tools-and-ext-apps-bumps.plan.md](current/clerk-mcp-tools-and-ext-apps-bumps.plan.md) | Current plan | Land four available Clerk + MCP-related dependency updates (`@clerk/express`, `@clerk/backend`, `@modelcontextprotocol/ext-apps`, `@clerk/mcp-tools`) and capture `AppOptions.strict`, ext-apps 1.7.0 capabilities, and MCP SDK 2.0 direction as forward candidates |
| [archive/completed/ws2-app-runtime-migration.plan.md](archive/completed/ws2-app-runtime-migration.plan.md) | Completed child plan | WS2 runtime migration completed and archived |
| [archive/completed/mcp-runtime-boundary-simplification.plan.md](archive/completed/mcp-runtime-boundary-simplification.plan.md) | Completed plan | Canonical runtime descriptor surface and ingress-boundary simplification completed and archived |
| [mcp-apps-support.research.md](mcp-apps-support.research.md) | Research | Canonical MCP Apps research summary for Oak. Active implementation is governed by the MCP Apps spec, `@modelcontextprotocol/ext-apps`, and the live executable plans |
| [archive/completed/server-info-branding.plan.md](archive/completed/server-info-branding.plan.md) | Completed plan | MCP server branding alignment completed and archived |
| [../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md](../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md) | Active plan | Expose misconception graph as MCP resource + tool (post-merge) |
| [../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md](../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md) | Future cross-boundary plan | Re-read the ontology repo from an upstream-first starting point and write up what that fresh pass changes |
| [../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md](../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md) | Future cross-boundary plan | Test direct ontology use as the control case before any Neo4j, Stardog, or hybrid serving decision is promoted |
| [future/mcp-protocol-adoption-roadmap.plan.md](future/mcp-protocol-adoption-roadmap.plan.md) | Future plan | Resource templates, prompt completion, curriculum downloads, per-primitive icons |
| [future/mcp-tool-token-economy-and-progressive-discovery.plan.md](future/mcp-tool-token-economy-and-progressive-discovery.plan.md) | Future strategic brief | Cloudflare/Anthropic Code Mode research, token-footprint measurement, progressive discovery, and Oak MCP applicability |
| [future/README.md](future/README.md) | Future index | Deferred/later plans |

## Read Order

1. [roadmap.md](roadmap.md)
2. [active/README.md](active/README.md)
3. [../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md](../../reports/oak-ontology-mcp-search-integration-report-2026-04-19.md)
4. [../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md](../knowledge-graph-integration/future/ontology-repo-fresh-perspective-review.plan.md)
5. [../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md](../knowledge-graph-integration/future/direct-ontology-use-and-graph-serving-prototypes.plan.md)
6. [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md)
7. [archive/completed/ws3-widget-clean-break-rebuild.plan.md](archive/completed/ws3-widget-clean-break-rebuild.plan.md)
8. [archive/completed/ws3-phase-6-docs-gates-review-commit.plan.md](archive/completed/ws3-phase-6-docs-gates-review-commit.plan.md)
9. [archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md](archive/completed/ws3-phase-4.5-live-react-and-metadata-shape.plan.md)
10. [current/README.md](current/README.md)
11. [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md)
12. [archive/completed/ws3-design-token-prerequisite.plan.md](archive/completed/ws3-design-token-prerequisite.plan.md)
13. [future/mcp-tool-token-economy-and-progressive-discovery.plan.md](future/mcp-tool-token-economy-and-progressive-discovery.plan.md)
14. [future/README.md](future/README.md)

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
