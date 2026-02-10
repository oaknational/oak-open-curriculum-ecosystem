# SDK Extraction

**Purpose**: Extract the semantic search capabilities into a dedicated Search SDK and CLI. The Next.js layer has been removed (Feb 2026); the workspace is now a pure TypeScript library.  
**Status**: 🔄 IN PROGRESS  
**Active plan**: [../active/search-sdk-cli.md](../active/search-sdk-cli.md)

---

## Context

The full extraction plan has been promoted to `active/`. See [search-sdk-cli.md](../active/search-sdk-cli.md) for scope, checkpoints, and architectural decisions.

## What Gets Extracted

| Component | From | To |
|-----------|------|-----|
| Retrieval services | `apps/.../src/lib/hybrid-search/` | `packages/libs/search-sdk/retrieval/` |
| Admin services | `apps/.../src/lib/admin/` | `packages/libs/search-sdk/admin/` |
| Observability | `apps/.../src/lib/observability/` | `packages/libs/search-sdk/observability/` |
| CLI commands | `apps/.../scripts/` | `packages/tools/search-cli/` |

## Related Documents

- [../active/search-sdk-cli.md](../active/search-sdk-cli.md) — Full extraction specification (active plan)
- [../roadmap.md](../roadmap.md) — Authoritative milestone sequence
- [../post-sdk/](../post-sdk/) — Work that follows SDK extraction
