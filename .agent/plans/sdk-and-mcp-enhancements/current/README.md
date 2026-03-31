# Current Plans — SDK and MCP Enhancements

Executable plans queued and ready to start.

Auth closure plans in this directory are complete and no longer block WS3
Phase 3 closure. The `canonicalUrl`/`oakUrl` schema-fallout closure record now
lives in `active/ws3-phase-3-schema-fallout-closure.plan.md`; do not treat the
queued `canonical-url-enforcement.plan.md` as that work.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Add truthful `outputSchema` metadata to all MCP tools while preserving generated upstream-response validation and aligning transport contracts | Ready for renewed grounding against the now-archived runtime-boundary simplification work |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Not started; separate from the active Phase 3 schema-fallout closure work |
| [auth-boundary-type-safety.plan.md](auth-boundary-type-safety.plan.md) | Tighten auth-boundary typing and contract invariants so auth semantics are explicit and fail-fast | Complete (all tasks + remediations done, 2026-03-31) |
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
