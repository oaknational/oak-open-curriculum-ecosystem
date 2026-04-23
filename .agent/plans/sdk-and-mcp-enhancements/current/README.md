# Current Plans — SDK and MCP Enhancements

Executable plans queued or ready to resume.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Queued; dependency on naming collision remediation satisfied ([archived](../archive/completed/url-naming-collision-remediation.plan.md), ADR-145) |
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Add truthful `outputSchema` metadata to all MCP tools while preserving generated upstream-response validation and aligning transport contracts | Ready for renewed grounding against the now-archived runtime-boundary simplification work |
| [clerk-mcp-tools-and-ext-apps-bumps.plan.md](clerk-mcp-tools-and-ext-apps-bumps.plan.md) | Land four available Clerk + MCP-related dependency updates in `apps/oak-curriculum-mcp-streamable-http` (in-range trio + deliberate `@clerk/mcp-tools` 0.5.0); capture `AppOptions.strict`, ext-apps 1.7.0 capabilities, and MCP SDK 2.0 direction as forward candidates | Queued; self-contained, no blockers |

Completed, awaiting archive:

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
