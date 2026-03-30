# Current Plans — SDK and MCP Enhancements

Executable plans queued and ready to start.

| Plan | Scope | Status / Blocked By |
|---|---|---|
| [mcp-runtime-boundary-simplification.plan.md](mcp-runtime-boundary-simplification.plan.md) | Post-WS2 runtime cleanup: establish one canonical transport-neutral SDK tool descriptor surface, keep app-rendering registration on the ext-apps helper boundary, and replace the Express/Clerk ingress bridge with one explicit auth boundary. **Phase 0 added (2026-03-26)**: evaluate `@clerk/mcp-tools/express` adoption before building custom ingress boundary | Not started; requires the WS2 baseline in the working branch |
| [output-schemas-for-mcp-tools.plan.md](output-schemas-for-mcp-tools.plan.md) | Add truthful `outputSchema` metadata to all 31 MCP tools while preserving generated upstream-response validation and aligning transport contracts | Not started; Phase 3 depends on Phase 3 of `mcp-runtime-boundary-simplification.plan.md` |
| [canonical-url-enforcement.plan.md](canonical-url-enforcement.plan.md) | Promote URL validation from warn-only to configurable gate; validate URLs in ingestion pipeline before ES storage | Not started; depends on predecessor (complete) |

Recently completed:

- [graph-data-integrity-snagging.execution.plan.md](../archive/completed/graph-data-integrity-snagging.execution.plan.md) — graph integrity defects (bulk dedup, ordering, generation invariants) classified and resolved
- [search-tool-text-to-query-rename.plan.md](../archive/completed/search-tool-text-to-query-rename.plan.md) — full-stack `text` → `query` rename, reviewer remediation, commit, and governance follow-through complete

Active work: [active/README.md](../active/README.md)
Later backlog: [future/README.md](../future/README.md)
Collection roadmap: [roadmap.md](../roadmap.md)
