# SDK Extraction — Planned Work

**Status**: 📋 PLANNED — Blocked on Milestones 1-2
**Purpose**: Extract NextJS search app into a pure SDK + CLI

---

## Overview

These documents cover the work needed to extract the current NextJS search
application into:

1. **Search SDK** — A `packages/libs/` library with retrieval, admin, and observability services
2. **Search CLI** — A first-class CLI workspace for admin/indexing workflows
3. **MCP Integration** — Express MCP server consuming the SDK

---

## Documents

| Document | Purpose | Depends On |
|----------|---------|------------|
| [search-sdk-cli.md](search-sdk-cli.md) | Main extraction plan (Milestone 11) | Milestones 1-10 |
| [evaluation-infrastructure.md](evaluation-infrastructure.md) | Testing and validation infrastructure | — |
| [vocabulary-mining-bulk.md](vocabulary-mining-bulk.md) | Vocabulary extraction and synonym mining | Complete ingestion |

---

## Prerequisites

Before SDK extraction can begin:

1. ✅ Complete ingestion working (Milestones 1-2)
2. ✅ All quality gates passing
3. 📋 Synonym quality audit (Milestone 3)

---

## Related

- [roadmap.md](../../roadmap.md) — Master roadmap
- [future/](../future/) — Post-SDK enhancements


