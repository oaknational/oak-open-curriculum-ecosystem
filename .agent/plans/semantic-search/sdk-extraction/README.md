# SDK Extraction

**Label**: Prerequisite  
**Purpose**: Extract the semantic search capabilities from the Next.js app into a dedicated Search SDK and CLI.  
**Status**: 📋 READY — Waiting for Ground Truth Review to complete

---

## Labelling System Reference

See [../roadmap.md](../roadmap.md) for the full labelling system. SDK Extraction is a **Prerequisite** — it must complete before Foundations and Tier work begins.

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

| Prerequisite | Status | Notes |
|--------------|--------|-------|
| Ground truth review complete | 🔄 In Progress | 9/30 subject-phases done |
| RRF architecture correct | ✅ | ADR-099 implemented |
| Synonym coverage complete | ✅ | ADR-100 implemented |

**Note (2026-01-17)**: The dependency chain has been revised. Filter testing, bulk analysis, and tier work now happen AFTER SDK extraction. The SDK API can evolve as we learn more — extraction is primarily a packaging concern.

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
- [../roadmap.md](../roadmap.md) — Authoritative milestone sequence
- [../post-sdk/](../post-sdk/) — Work that follows SDK extraction
