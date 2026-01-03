# SDK Extraction — Planned Work

**Status**: 📋 PLANNED — After Milestone 3
**Purpose**: Extract NextJS search app into a pure SDK + CLI
**Last Updated**: 2026-01-02

---

## Overview

These documents cover the work needed to extract the current NextJS search
application into:

1. **Search SDK** — A `packages/libs/` library with retrieval, admin, and observability services
2. **Search CLI** — A first-class CLI workspace for admin/indexing workflows
3. **MCP Integration** — Express MCP server consuming the SDK

---

## Documents

| Document | Purpose | Roadmap |
|----------|---------|---------|
| [search-sdk-cli.md](search-sdk-cli.md) | Main extraction plan | Milestone 7 |
| [evaluation-infrastructure.md](evaluation-infrastructure.md) | Unify evaluation directories | Backlog |
| [vocabulary-mining-bulk.md](vocabulary-mining-bulk.md) | Vocabulary extraction — **feeds M3** | M3 Phase 4 |

---

## Prerequisites

| Prerequisite | Status |
|--------------|--------|
| Complete ingestion (M1, M2) | ✅ Complete |
| DRY/SRP refactoring (M4) | ✅ Complete |
| Data completeness (M5) | ✅ Complete |
| Search quality optimization (M3) | 📋 **NEXT** |

---

## Related

- [roadmap.md](../../roadmap.md) — Master roadmap
- [synonym-quality-audit.md](../future/synonym-quality-audit.md) — M3 detailed plan
- [future/](../future/) — Post-SDK enhancements


