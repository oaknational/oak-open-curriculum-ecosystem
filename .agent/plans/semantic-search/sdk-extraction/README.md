# SDK Extraction

**Purpose**: Extract the semantic search capabilities from the Next.js app into a dedicated Search SDK and CLI.

**Status**: 📋 PLANNED — Blocked by pre-SDK work completion

---

## Context: Two SDKs

This project involves TWO distinct SDKs:

| SDK | Location | Purpose |
|-----|----------|---------|
| **Curriculum SDK** | `packages/sdks/oak-curriculum-sdk/` | Access to upstream Oak API, type generation from OpenAPI schema |
| **Search SDK** | To be created at `packages/libs/search-sdk/` | Elasticsearch-backed semantic search capabilities |

The Search SDK **consumes types from** the Curriculum SDK but is a separate concern.

---

## Plans in This Folder

| Plan | Description |
|------|-------------|
| [search-sdk-cli.md](search-sdk-cli.md) | Full specification for SDK extraction |

---

## Prerequisites

All pre-SDK work must complete first:

1. ✅ M3: Search Quality Optimization (ground truths, benchmarks, synonyms)
2. 📋 Bulk Data Analysis (vocabulary mining, transcript analysis)
3. 📋 Tier 2: Document Relationships
4. 📋 Tier 3: Modern ES Features

See [../pre-sdk-extraction/](../pre-sdk-extraction/) for details.

---

## What Gets Extracted

| Component | From | To |
|-----------|------|-----|
| Retrieval services | `apps/.../src/lib/hybrid-search/` | `packages/libs/search-sdk/retrieval/` |
| Admin services | `apps/.../src/lib/admin/` | `packages/libs/search-sdk/admin/` |
| Observability | `apps/.../src/lib/observability/` | `packages/libs/search-sdk/observability/` |
| CLI commands | `apps/.../scripts/` | `packages/tools/search-cli/` |

---

## Related Documents

- [search-sdk-cli.md](search-sdk-cli.md) — Full extraction specification
- [../pre-sdk-extraction/](../pre-sdk-extraction/) — Work that must complete first
- [../post-sdk-extraction/](../post-sdk-extraction/) — Work that follows

