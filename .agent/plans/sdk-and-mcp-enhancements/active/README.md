# Active Plans — SDK and MCP Enhancements

Executable plans that are in progress now.

- [mcp-app-extension-migration.plan.md](mcp-app-extension-migration.plan.md) —
  **PRIMARY** umbrella plan for the MCP Apps migration. WS1 and WS2 are
  complete. Runtime-boundary simplification is complete and archived. The live
  implementation track is now the fresh React MCP App rebuild.
- [ws3-widget-clean-break-rebuild.plan.md](ws3-widget-clean-break-rebuild.plan.md) —
  **ACTIVE CHILD PLAN**. Delete the dead widget framework and replace it with
  fresh MCP Apps infrastructure built from scratch with React. This is a full
  replacement, not a migration layer: `search` remains model-facing and
  `user-search` is the new UI-first, user-first MCP App surface. Canonical
  enforcement is centralised in the child plan's `Canonical Compliance
  Checklist`.

## WS3 Phase Companion Plans

- [ws3-phase-0-baseline-and-red-specs.plan.md](ws3-phase-0-baseline-and-red-specs.plan.md) —
  WS3 companion phase plan for grounding, contamination baseline, and RED test
  setup.
- ~~ws3-phase-1-delete-legacy-widget-framework.plan.md~~ —
  Complete and [archived](../archive/completed/ws3-phase-1-delete-legacy-widget-framework.plan.md).
- [ws3-phase-2-scaffold-fresh-mcp-app-infrastructure.plan.md](ws3-phase-2-scaffold-fresh-mcp-app-infrastructure.plan.md) —
  WS3 companion phase plan for fresh React MCP App scaffolding and tooling.
- [ws3-phase-3-canonical-contracts-and-runtime.plan.md](ws3-phase-3-canonical-contracts-and-runtime.plan.md) —
  WS3 companion phase plan for canonical metadata/registration/auth/runtime
  contract alignment. The closure batch is gate-green locally; the only open
  parent-plan item is deferred non-UI host fallback evidence.
- [ws3-phase-4-curriculum-model-view.plan.md](ws3-phase-4-curriculum-model-view.plan.md) —
  WS3 companion phase plan for the curriculum-model view delivery.
- [ws3-phase-5-interactive-user-search-view.plan.md](ws3-phase-5-interactive-user-search-view.plan.md) —
  WS3 companion phase plan for user-search UI delivery and helper-tool flow.
- [ws3-phase-6-docs-gates-review-commit.plan.md](ws3-phase-6-docs-gates-review-commit.plan.md) —
  WS3 companion phase plan for docs, gates, reviewers, and closure checks.

Completed and archived:

- [ws2-app-runtime-migration.plan.md](../archive/completed/ws2-app-runtime-migration.plan.md) —
  WS2 complete and archived on 26 March 2026.
- [mcp-runtime-boundary-simplification.plan.md](../archive/completed/mcp-runtime-boundary-simplification.plan.md) —
  Runtime boundary simplification complete and archived on 27 March 2026.
- [replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](../archive/completed/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md) —
  Superseded by the active umbrella and child plans above.
- [oak-preview-mcp-snagging.execution.plan.md](../archive/completed/oak-preview-mcp-snagging.execution.plan.md) —
  Complete and archived.
- [asset-download-proxy.plan.md](../archive/completed/asset-download-proxy.plan.md) —
  Complete and archived.
- [sitemap-driven-canonical-urls.plan.md](../archive/completed/sitemap-driven-canonical-urls.plan.md) —
  Complete and archived.
- [ws1-get-curriculum-model.plan.md](../archive/completed/ws1-get-curriculum-model.plan.md) —
  Complete and archived.
- [merge-readiness.plan.md](../archive/completed/merge-readiness.plan.md) —
  Branch merged on 2 March 2026.
- [ws3-phase-1-delete-legacy-widget-framework.plan.md](../archive/completed/ws3-phase-1-delete-legacy-widget-framework.plan.md) —
  Legacy widget framework deleted on 31 March 2026.
- [ws3-phase-3-schema-fallout-closure.plan.md](../archive/completed/ws3-phase-3-schema-fallout-closure.plan.md) —
  `canonicalUrl`/`oakUrl` lesson-summary schema fallout closed on 31 March 2026.

Completed and archived (URL remediation):

- [url-naming-collision-remediation.plan.md](../archive/completed/url-naming-collision-remediation.plan.md) —
  Decorator overwrite, type widening, naming collision (`canonicalUrl` →
  `oakUrl`), search-CLI boundary violation, and stale ADR-047 — all
  resolved on 1 April 2026. See ADR-145.
- [url-remediation-snagging.plan.md](../archive/completed/url-remediation-snagging.plan.md) —
  Residual findings from the URL naming collision remediation review:
  stale references, URL pattern duplication, import direction, documentation
  gaps, and missing test coverage — all resolved on 1 April 2026.

Next-up queue: [current/README.md](../current/README.md)
Later backlog: [future/README.md](../future/README.md)
Collection roadmap: [roadmap.md](../roadmap.md)
