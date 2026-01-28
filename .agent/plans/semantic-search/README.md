# Semantic Search — Navigation

**Last Updated**: 2026-01-27

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: Ground Truth Query Grounding (Stage 1b)

Create ground truths using known-answer-first methodology. All subjects are critical.

**Details**: [active/ground-truth-redesign-plan.md](active/ground-truth-redesign-plan.md)

---

## Execution Order

```text
1. Ground Truth Redesign (active/)              ← CURRENT (Stage 1b)
   Mine queries from bulk data (known-answer-first)
         ↓
2. Expected Slugs Implementation
   Create .query.ts and .expected.ts files
         ↓
3. SDK Extraction (sdk-extraction/)
         ↓
4. MCP Integration (post-sdk/mcp-integration/)
         ↓
5. Everything Else (post-sdk/ streams)
```

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | Work in progress | 🔄 Ground truth query grounding |
| `sdk-extraction/` | SDK extraction plans | 📋 Ready after GT complete |
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
| [Current State](current-state.md) | System metrics |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |

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
