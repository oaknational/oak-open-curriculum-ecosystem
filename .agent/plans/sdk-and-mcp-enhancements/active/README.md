# Active Plans — SDK and MCP Enhancements

Executable plans that are in progress now.

## Umbrella

- [mcp-app-extension-migration.plan.md](mcp-app-extension-migration.plan.md) —
  **PRIMARY** umbrella for the MCP Apps migration.
- [ws3-widget-clean-break-rebuild.plan.md](ws3-widget-clean-break-rebuild.plan.md) —
  **ACTIVE CHILD**. Clean-break React MCP App rebuild.

## Pre-Merge (must complete before PR #76 merges)

- [ws3-phase-6-docs-gates-review-commit.plan.md](ws3-phase-6-docs-gates-review-commit.plan.md) —
  **ACTIVE**. Local production-startup recovery, warning cleanup, contamination
  check, and aggregate gates are green; this remains the merge-handoff
  reference until the closeout commit/push and deployed preview recheck land.
- [vercel-mcp-build-warnings-and-bootstrap.plan.md](vercel-mcp-build-warnings-and-bootstrap.plan.md) —
  **ACTIVE** (Phase 0 baseline complete; deploy verification pending). Local
  fixes for preview bootstrap, build warnings, and the HTTP dev contract are in
  place; remaining work is fresh preview/build-log confirmation for
  `dist/oak-banner.html` startup plus the enumerated warning classes.

## Post-Merge

- [ws3-phase-5-interactive-user-search-view.plan.md](ws3-phase-5-interactive-user-search-view.plan.md) —
  **PENDING**. Interactive user-search MCP App view and helper-tool flow.
  Builds on the live React foundation from Phase 4.5.
- [misconception-graph-mcp-surface.plan.md](misconception-graph-mcp-surface.plan.md) —
  **PENDING**. Expose misconception graph as MCP resource + tool.

## Completed This Branch (latest archive 2026-04-09)

All archived to `archive/completed/`:

- Phases 0–4, server-info branding, off-the-shelf SDK adoption,
  MCP Apps SDK audit, widget pipeline idiomatic alignment.
- Phase 4.5 live React + metadata shape wrap-up archived on 2026-04-09.

## Navigation

- Next-up queue: [current/README.md](../current/README.md)
- Later backlog: [future/README.md](../future/README.md)
- Collection roadmap: [roadmap.md](../roadmap.md)
