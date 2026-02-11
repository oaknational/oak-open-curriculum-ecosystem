# Semantic Search — Navigation

**Last Updated**: 2026-02-11

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: MCP Search Integration

SDK extraction is complete (Checkpoints A–E2, Feb 2026).
The immediate priority is wiring the Search SDK into the
MCP curriculum servers so that AI agents can use hybrid
Elasticsearch search.

**Plan**: [post-sdk/mcp-integration/wire-hybrid-search.md](post-sdk/mcp-integration/wire-hybrid-search.md)

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs
         ↓
2. SDK Extraction + CLI Wiring                   ✅ COMPLETE
   Checkpoints A–E2 (extraction, Result pattern, TSDoc)
         ↓
3. MCP Search Integration                        ← CURRENT
   Wire hybrid search into MCP tools
         ↓
4. Search Quality + Ecosystem (parallel streams)
   GT expansion, Levels 2-4, bulk data, SDK API,
   subject domain model, operations
         ↓
5. Extensions
   RAG, knowledge graph, advanced features
```

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | SDK extraction plan (complete, reference) | ✅ Complete |
| `sdk-extraction/` | SDK extraction context | ✅ Complete |
| `post-sdk/` | Streams of post-extraction work | 📋 Ready |
| `archive/` | Historical work | ✅ Reference only |

---

## Post-SDK Streams

After SDK extraction, work is organized into **streams** — coherent domains with their own intent and impact.

| Stream | Intent |
|--------|--------|
| [mcp-integration/](post-sdk/mcp-integration/) | Wire hybrid search into MCP tools (FIRST) |
| [search-quality/](post-sdk/search-quality/) | Improve search result relevance (Levels 2-4) |
| [bulk-data-analysis/](post-sdk/bulk-data-analysis/) | Mine vocabulary from curriculum data |
| [sdk-api/](post-sdk/sdk-api/) | Understand and stabilise SDK API |
| [operations/](post-sdk/operations/) | Run the system safely |
| [extensions/](post-sdk/extensions/) | Add capabilities beyond core search |

Each stream has a README explaining domain, intent, desired impact, and any internal sequencing.

---

## Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point |
| [Roadmap](roadmap.md) | **THE** authoritative plan sequence |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |

---

## Archive

Historical work from previous phases. **Metrics and details are stale** — for reference only.

| Document | Purpose |
|----------|---------|
| [archive/completed-jan-2026.md](archive/completed-jan-2026.md) | Initial development phase milestones |
| [archive/completed/](archive/completed/) | Individual completed plans |

---

## Foundation Documents (MANDATORY)

1. [rules.md](../../directives/rules.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)
