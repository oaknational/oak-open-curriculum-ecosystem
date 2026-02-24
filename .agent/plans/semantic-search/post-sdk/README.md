# Post-SDK Work — Streams

**Status**: 📋 Ready — SDK extraction complete (Feb 2026)  
**Parent**: [../roadmap.md](../roadmap.md)

SDK extraction is complete. Work in these streams can now begin.

---

## Execution Order

```text
1. MCP Integration (mcp-integration/)     ← FIRST
   Wire hybrid search into MCP tools
         ↓
2. Everything else (parallel where independent):
   ├── Search Quality (search-quality/)
   ├── Bulk Data Analysis (bulk-data-analysis/)
   ├── SDK API (sdk-api/)
   ├── Operations (operations/)
   └── Extensions (extensions/)
```

**MCP integration comes first** because it's the immediate consumer of the SDK.

---

## Standalone Plans

Plans that span multiple streams or address SDK architecture.

| Plan | Intent | Prerequisite |
|------|--------|--------------|
| [subject-domain-model.md](move-search-domain-knowledge-to-typegen-time.md) | Oak API SDK type-gen: subject hierarchy, KS4 patterns, curriculum config | SDK extraction complete ✅ |
| [mcp-result-pattern-unification.md](mcp-integration/mcp-result-pattern-unification.md) | Migrate MCP `ToolExecutionResult` to `Result<T, E>` — post-merge work | Phase 3a WS5 complete |

---

## Streams

Each stream is a coherent domain of work with its own README explaining intent and impact.

| Stream | Intent | First Plan |
|--------|--------|------------|
| [mcp-integration/](mcp-integration/) | Wire hybrid search into MCP tools | [phase-3a-mcp-search-integration.md](../archive/completed/phase-3a-mcp-search-integration.md) |
| [search-quality/](search-quality/) | Improve search result relevance | Levels 2 → 3 → 4 (sequential); reranking investigation at Level 3 |
| [bulk-data-analysis/](bulk-data-analysis/) | Mine vocabulary from curriculum data | vocabulary-mining.md |
| [sdk-api/](sdk-api/) | Understand and stabilise SDK API surface | filter-testing.md |
| [operations/](operations/) | Run the system safely and reliably | governance.md |
| [extensions/](extensions/) | Add capabilities beyond core search | advanced-features.md |

---

## Stream Principles

1. **Each plan belongs to exactly one stream**
2. **Stream READMEs** explain domain, intent, desired impact, and any sequencing
3. **Plans within a stream** may be sequential or parallel depending on dependencies
4. **When a plan mixes concerns**, examine whether it should be split by stream

---

## Prerequisites

| Prerequisite | Status | Location |
|--------------|--------|----------|
| Ground truth foundation | ✅ Complete | [../archive/completed/](../archive/completed/) |
| SDK extraction | ✅ Complete | [../sdk-extraction/](../sdk-extraction/) |
