# Post-SDK Work — Streams

**Status**: 📋 Pending — Waiting for SDK extraction  
**Parent**: [../roadmap.md](../roadmap.md)

All work in this folder happens AFTER SDK extraction is complete.

---

## Execution Order

```
1. MCP Integration (mcp-integration/)     ← FIRST after SDK
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

## Streams

Each stream is a coherent domain of work with its own README explaining intent and impact.

| Stream | Intent | First Plan |
|--------|--------|------------|
| [mcp-integration/](mcp-integration/) | Wire hybrid search into MCP tools | wire-hybrid-search.md |
| [search-quality/](search-quality/) | Improve search result relevance | Levels 2 → 3 → 4 (sequential) |
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

All streams require:

| Prerequisite | Status | Location |
|--------------|--------|----------|
| Ground truth review complete | 🔄 In Progress | [../active/](../active/) |
| SDK extraction complete | 📋 Pending | [../sdk-extraction/](../sdk-extraction/) |
