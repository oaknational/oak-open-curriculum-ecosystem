# SDK Extraction

**Purpose**: Extract the semantic search capabilities into a dedicated Search SDK and CLI. The Next.js layer has been removed (Feb 2026); the workspace is now a pure TypeScript library.  
**Status**: 🔄 IN PROGRESS  
**Active plan**: [../active/search-sdk-cli.plan.md](../active/search-sdk-cli.plan.md)

---

## Context

The full extraction plan has been promoted to `active/`. See [search-sdk-cli.plan.md](../active/search-sdk-cli.plan.md) for scope, checkpoints, and architectural decisions.

## Approach

The current workspace stays in place and becomes the CLI
(renamed to `apps/oak-search-cli/`). The SDK library code
is extracted out to `packages/sdks/oak-search-sdk/`. Evaluation
stays in the CLI.

| What | From | To |
|------|------|-----|
| SDK (retrieval, admin, obs) | `apps/.../src/lib/` | `packages/sdks/oak-search-sdk/` |
| CLI + evaluation | `apps/oak-open-curriculum-semantic-search/` | `apps/oak-search-cli/` (rename) |

## Related Documents

- [../active/search-sdk-cli.plan.md](../active/search-sdk-cli.plan.md) — Full extraction specification (active plan)
- [../roadmap.md](../roadmap.md) — Authoritative milestone sequence
- [../post-sdk/](../post-sdk/) — Work that follows SDK extraction
