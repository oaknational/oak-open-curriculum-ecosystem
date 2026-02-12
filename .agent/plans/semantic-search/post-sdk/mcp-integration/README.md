# MCP Integration

**Domain**: Wiring the Search SDK into MCP tools  
**Intent**: Enable AI agents to use semantic search capabilities  
**Impact**: Agents can search Oak curriculum with full hybrid search power  
**Status**: ⏸️ Blocked by SDK validation (Phase 2e)

---

## Why This Stream?

MCP integration is the **first production consumer** of the
Search SDK. Wiring it up:

1. Validates that the SDK interface is usable
2. Provides immediate value to agent workflows
3. Exposes any SDK API issues early

**However**, the SDK must first be validated against real
Elasticsearch (Phase 2e) — it was completely rewritten
during extraction.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [wire-hybrid-search.md](wire-hybrid-search.md) | Connect SDK search to MCP tools | ⏸️ Blocked by Phase 2e |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| SDK extraction complete | ✅ |
| All services return `Result<T, E>` | ✅ |
| Comprehensive TSDoc | ✅ |
| SDK validated against real ES (Phase 2e) | 📋 Pending |

---

## Success Criteria

- [ ] MCP `semantic-search` tool calls SDK retrieval methods
- [ ] Suggestions tool calls SDK `suggest`
- [ ] All existing MCP curriculum tools continue to work
- [ ] Quality gates pass
