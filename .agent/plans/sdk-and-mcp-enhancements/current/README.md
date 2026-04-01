# Current Plans — SDK and MCP Enhancements

Executable plans queued and ready to start.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [url-naming-collision-remediation.plan.md](url-naming-collision-remediation.plan.md) | Fix decorator overwrite, type widening, naming collision (`canonicalUrl` → `oakUrl`), search-CLI boundary violation, and stale ADR-047 | Queued; should execute before `canonical-url-enforcement.plan.md` |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Queued; depends on naming collision remediation completing first |
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Add truthful `outputSchema` metadata to all MCP tools while preserving generated upstream-response validation and aligning transport contracts | Ready for renewed grounding against the now-archived runtime-boundary simplification work |

Recently completed and archived:

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
