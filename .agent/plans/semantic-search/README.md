# Semantic Search — Navigation

**Last Updated**: 2026-01-17

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: Ground Truth Review

The ground truth review is in progress. **9/30 subject-phases complete**.

**Details**: [active/ground-truth-review-checklist.md](active/ground-truth-review-checklist.md)

---

## Execution Order

```
1. Ground Truth Review (active/)              ← CURRENT
         ↓
2. SDK Extraction (sdk-extraction/)
         ↓
3. MCP Integration (post-sdk/mcp-integration/)
         ↓
4. Everything Else (post-sdk/ streams)
```

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | Work in progress | 🔄 Ground truth review |
| `sdk-extraction/` | SDK extraction plans | 📋 Ready after Phase 1 |
| `post-sdk/` | Streams of post-SDK work | ⏸️ After SDK extraction |
| `archive/` | Completed work | ✅ Historical |
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
| [Current State](current-state.md) | System metrics |
| [Completed](completed.md) | Historical completed work |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |

---

## Research Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Elastic-native patterns |
| [aliases-and-equivalances.md](../../research/elasticsearch/oak-data/aliases-and-equivalances.md) | Synonym classification |
| [documentation-gap-analysis.md](../../research/elasticsearch/oak-data/documentation-gap-analysis.md) | Gaps and remediation |

---

## Foundation Documents (MANDATORY)

1. [rules.md](../../directives-and-memory/rules.md)
2. [testing-strategy.md](../../directives-and-memory/testing-strategy.md)
3. [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)
