# Semantic Search — Navigation

**Last Updated**: 2026-02-10

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: SDK Extraction

Ground truths are complete across all four indexes. The Next.js layer has been removed (Feb 2026). The immediate priority is extracting the search capability into a dedicated SDK and CLI.

**Details**: [active/search-sdk-cli.md](active/search-sdk-cli.md)

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs
         ↓
2. SDK Extraction (sdk-extraction/)              ← CURRENT
   Extract search into SDK + CLI (Next.js layer removed)
         ↓
3. MCP Integration (post-sdk/mcp-integration/)
   Wire hybrid search into MCP tools
         ↓
4. Search Enhancements (post-sdk/search-quality/)
   Ground truth expansion, fundamentals re-evaluation,
   document relationships, modern ES features, AI enhancement
```

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | Work in progress | 🔄 SDK extraction |
| `sdk-extraction/` | SDK extraction context | See `active/` |
| `post-sdk/` | Streams of post-SDK work | ⏸️ After SDK extraction |
| `archive/` | Historical work | ✅ Reference only |
| `templates/` | Session templates | — |

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
| [Ground Truth Protocol](/apps/oak-open-curriculum-semantic-search/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |

---

## Archive

Historical work from previous phases. **Metrics and details are stale** — for reference only.

| Document | Purpose |
|----------|---------|
| [archive/completed-jan-2026.md](archive/completed-jan-2026.md) | Initial development phase milestones |
| [archive/completed/](archive/completed/) | Individual completed plans |

---

## Foundation Documents (MANDATORY)

1. [rules.md](../../directives-and-memory/rules.md)
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md)
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)
