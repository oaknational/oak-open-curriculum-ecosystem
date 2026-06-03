# Current Plans — SDK and MCP Enhancements

Executable plans queued or ready to resume.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [upstream-sequences-api-realignment.plan.md](upstream-sequences-api-realignment.plan.md) | Realign the repo to the upstream sequences API change (`/subjects/{subject}/sequences` removed; `/sequences/{slug}` added; tool renamed `get-sequences`); search-cli's legacy API-supplementation pipeline is red after codegen refresh | **TOP PRIORITY — owner-directed dedicated specialist session (2026-06-03)**; decide delete-vs-adapt FIRST (the bulk-data feature request marks the broken path legacy); `pnpm check` red on any codegen-refreshed tree until cured |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Queued; dependency on naming collision remediation satisfied ([archived](../archive/completed/url-naming-collision-remediation.plan.md), ADR-145) |
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Declare a required, object-rooted `outputSchema` on all 35 tools (24 generated via codegen, 11 aggregated hand-authored) and thread it through the universal-tools seam to `registerTool` | Decision-complete (re-grounded 2026-06-02, [audit](../../../reports/output-schema-mcp-plan-audit-2026-06-02.md)); one open S0/EEF-D6 sequencing decision gates `s0-cycle-1` only |
| [download-asset-user-only-url.plan.md](download-asset-user-only-url.plan.md) | Move `download-asset` signed URLs out of model-visible MCP result fields and into MCP App `_meta` for user-only downloads | Queued; should run before output-schema work finalises the `download-asset` contract |
| [oak-preview-mcp-snagging-2026-04-23.plan.md](oak-preview-mcp-snagging-2026-04-23.plan.md) | In-repo findings from black-box preview MCP validation: `explore-topic` relevance tuning, KS3-science questions empty-response investigation, consistent MCP-side response surface for empty / no-match / unsupported / failure, and suggest-scope URL population in oak-search-sdk (WS5; reconfirmed 2026-05-25) | Queued; complements the upstream issue reports under [`../../sector-engagement/ooc-issues/`](../../sector-engagement/ooc-issues/) |

Completed, awaiting archive:

- [clerk-mcp-tools-and-ext-apps-bumps.plan.md](clerk-mcp-tools-and-ext-apps-bumps.plan.md) —
  COMPLETE. Clerk/MCP dependency targets are landed; 2026-06-02 refresh leaves
  `pnpm -r outdated` clean.
- [ws3-oak-url-augmentable-codegen-fix.plan.md](ws3-oak-url-augmentable-codegen-fix.plan.md) —
  COMPLETE. Schema-derived GET response union, ADR-153, quality gates passed.
- [ws3-contrast-validation-prerequisite.plan.md](ws3-contrast-validation-prerequisite.plan.md) —
  COMPLETE. WCAG contrast validation and blocking token fixes landed.

Recently completed and archived:

- [ws3-design-token-prerequisite.plan.md](../archive/completed/ws3-design-token-prerequisite.plan.md) —
  canonical token foundation and shared shell complete on 2 April 2026
- [url-generation-cleanup.plan.md](../archive/completed/url-generation-cleanup.plan.md) —
  retired `generateOakUrl`, made `sequenceSlug`/`unitUrl` type-safe (2026-04-01)
- [auth-boundary-type-safety.plan.md](../archive/completed/auth-boundary-type-safety.plan.md) —
  complete (2026-03-31)
- [auth-safety-correction.plan.md](../archive/completed/auth-safety-correction.plan.md) —
  complete (commit `e6574b5a`, 2026-03-31)
- [mcp-runtime-boundary-simplification.plan.md](../archive/completed/mcp-runtime-boundary-simplification.plan.md) —
  complete and archived
- [graph-data-integrity-snagging.execution.plan.md](../archive/completed/graph-data-integrity-snagging.execution.plan.md) —
  graph integrity defects classified and resolved
- [search-tool-text-to-query-rename.plan.md](../archive/completed/search-tool-text-to-query-rename.plan.md) —
  full-stack `text` → `query` rename complete

Active work: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)
Collection roadmap: [roadmap.md](../roadmap.md)
