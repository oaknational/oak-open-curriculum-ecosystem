# Current Plans — SDK and MCP Enhancements

Executable plans queued and ready to start.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Add truthful `outputSchema` metadata to all MCP tools while preserving generated upstream-response validation and aligning transport contracts | Ready for renewed grounding against the now-archived runtime-boundary simplification work |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Not started; depends on predecessor (complete) |
| [auth-boundary-type-safety.plan.md](auth-boundary-type-safety.plan.md) | Tighten auth-boundary typing and contract invariants so auth semantics are explicit and fail-fast | In progress — Tasks 1-3 complete, remediation tasks pending |
| [auth-safety-correction.plan.md](auth-safety-correction.plan.md) | Correct auth safety drift and reassert MCP auth invariants in runtime and metadata projections | Complete (commit `e6574b5a`, 2026-03-31) |

Recently completed:

- [mcp-runtime-boundary-simplification.plan.md](../archive/completed/mcp-runtime-boundary-simplification.plan.md) —
  complete and archived
- [graph-data-integrity-snagging.execution.plan.md](../archive/completed/graph-data-integrity-snagging.execution.plan.md) —
  graph integrity defects classified and resolved
- [search-tool-text-to-query-rename.plan.md](../archive/completed/search-tool-text-to-query-rename.plan.md) —
  full-stack `text` → `query` rename complete

Active work: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)
Collection roadmap: [roadmap.md](../roadmap.md)
