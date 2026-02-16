# SDK Extraction

**Purpose**: Extract the semantic search capabilities into a dedicated Search SDK and CLI.  
**Status**: ✅ COMPLETE (Feb 2026)  
**Plan**: [../archive/completed/search-sdk-cli.plan.md](../archive/completed/search-sdk-cli.plan.md)

---

## What Was Done

The full extraction plan (Checkpoints A–E2) is complete:

- SDK workspace at `packages/sdks/oak-search-sdk/` with retrieval,
  admin, and observability services (34 tests)
- CLI renamed to `apps/oak-search-cli/` with all subcommands wired
  to SDK services (934 tests)
- All service I/O methods return `Result<T, E>` with per-service
  discriminated union error types
- Comprehensive TSDoc across all SDK and CLI functions
- All quality gates pass

| What | From | To |
|------|------|-----|
| SDK (retrieval, admin, obs) | `apps/.../src/lib/` | `packages/sdks/oak-search-sdk/` ✅ |
| CLI + evaluation | `apps/oak-open-curriculum-semantic-search/` | `apps/oak-search-cli/` ✅ |

## Next

MCP integration: [phase-3a-mcp-search-integration.md](../active/phase-3a-mcp-search-integration.md)
