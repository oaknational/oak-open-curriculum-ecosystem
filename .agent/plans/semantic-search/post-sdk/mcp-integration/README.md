# MCP Integration

**Domain**: Wiring the Search SDK into MCP tools  
**Intent**: Enable AI agents to use semantic search capabilities  
**Impact**: Agents can search Oak curriculum with full hybrid search power  
**Status**: 📋 Ready to start (SDK extraction complete)

---

## Why First?

MCP integration is the **immediate consumer** of the Search SDK. Wiring it up:

1. Validates that the SDK interface is usable
2. Provides immediate value to agent workflows
3. Exposes any SDK API issues early

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [wire-hybrid-search.md](wire-hybrid-search.md) | Connect SDK search to MCP tools | 📋 Ready |

---

## Dependencies (all met)

| Dependency | Status |
|------------|--------|
| SDK extraction complete | ✅ |
| All services return `Result<T, E>` | ✅ |
| Comprehensive TSDoc | ✅ |

---

## Success Criteria

- [ ] MCP `semantic-search` tool calls SDK retrieval methods
- [ ] Suggestions tool calls SDK `suggest`
- [ ] All existing MCP curriculum tools continue to work
- [ ] Quality gates pass
