# MCP Integration

**Domain**: Wiring the Search SDK into MCP tools  
**Intent**: Enable AI agents to use semantic search capabilities  
**Impact**: Agents can search Oak curriculum with full hybrid search power

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
| [wire-hybrid-search.md](wire-hybrid-search.md) | Connect SDK search to MCP tools | 📋 Pending |

---

## Dependencies

- SDK extraction complete
- Search SDK published and consumable

---

## Success Criteria

- [ ] MCP `search-curriculum` tool calls SDK search
- [ ] MCP `suggest-completions` tool calls SDK suggestions
- [ ] All existing MCP curriculum tools continue to work
- [ ] Quality gates pass
