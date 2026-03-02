# ADR-004: Abstract Notion SDK Behind Interface

## Status

**Deprecated** — The `oak-notion-mcp` workspace has been removed.
The Notion MCP server originally existed to force generalisation
of the codebase for multiple MCP servers. That architectural
forcing function is now obsolete: the ecosystem supports multiple
MCP servers natively (`oak-curriculum-mcp-stdio`,
`oak-curriculum-mcp-streamable-http`). See Item #4 in the
[high-level plan](../../../.agent/plans/high-level-plan.md).

## Historical Context

The Notion SDK was a third-party dependency used in the
`oak-notion-mcp` workspace. This ADR established the principle
of wrapping third-party SDKs behind interfaces — an
anti-corruption layer pattern. While the Notion-specific
implementation no longer exists, the underlying principle
(abstract external dependencies behind domain interfaces)
remains valid and is applied elsewhere in the codebase (e.g.
the Oak API SDK wraps the Open Curriculum API).

## Original Decision

Wrap the Notion SDK behind a `NotionClientWrapper` interface.
No direct SDK usage outside of the adapter layer.

## Enduring Principles

The following principles from this ADR remain relevant across
the codebase:

- **Isolation**: External API changes are isolated to adapter layers
- **Testability**: Test with simple implementations of interfaces
- **Domain Language**: Interfaces use our domain language, not the vendor's
- **Anti-Corruption Layer**: Prevents vendor-specific concepts from leaking into business logic
