# MCP Consumer Integration

**Domain**: Wiring the Search SDK into MCP tools  
**Intent**: Enable AI agents to use semantic search capabilities  
**Impact**: Agents can search Oak curriculum with full hybrid search power  
**Status**: 📋 Backlog (post-merge follow-up)

---

## Why This Boundary?

MCP integration is the **first production consumer** of the
Search SDK. Wiring it up:

1. Validates that the SDK interface is usable
2. Provides immediate value to agent workflows
3. Exposes any SDK API issues early

The SDK has been validated against real Elasticsearch
(Phase 2e complete) — thread search benchmarks confirmed
correct results across all indexes.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [phase-3a-mcp-search-integration.md](../../archive/completed/phase-3a-mcp-search-integration.md) | MCP search tools delivered and archived | ✅ Complete |
| [mcp-result-pattern-unification.md](mcp-result-pattern-unification.md) | Migrate MCP tool execution to `Result<T, E>` pattern | 📋 Next-up (post-merge) |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| SDK extraction complete | ✅ |
| All services return `Result<T, E>` | ✅ |
| Comprehensive TSDoc | ✅ |
| SDK validated against real ES (Phase 2e) | ✅ Complete |

---

## Success Criteria

- [x] Three MCP tools (`search`, `browse-curriculum`, `explore-topic`) wired to SDK retrieval (WS1-WS2)
- [x] Filter parameters passed through correctly
- [x] `Result<T, E>` errors surfaced as MCP errors
- [x] All existing MCP tools unaffected
- [x] All quality gates pass (191/191 E2E, 1241 SDK, 620 HTTP)
- [x] NL guidance, documentation, TSDoc (WS3)
- [x] Integration tests for search-retrieval-factory and browse formatting (WS4 follow-up)
- [x] Compare SDK search vs REST API search; replacement complete (archived in Phase 3a)
- [ ] Result pattern unification — `ToolExecutionResult` → `Result<T, E>` (post-merge)
