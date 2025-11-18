# Notion MCP Server

> **Note**: This workspace serves as an architectural reference to prevent coupling the OpenAPI→SDK→MCP pipeline pattern to a single use case. The primary focus of this repository is the Oak Open Curriculum implementation (`apps/oak-curriculum-mcp-*` and `packages/sdks/oak-curriculum-sdk`). The Notion integration demonstrates the pattern's generality and helps validate architectural decisions.

## Purpose

This Notion MCP server exists to:

1. **Validate the architecture** - Ensure the OpenAPI→SDK→MCP pattern isn't accidentally coupled to Oak-specific concerns
2. **Demonstrate pattern generality** - Show the same approach works for different APIs
3. **Architectural thinking tool** - Help make design decisions that support multiple use cases

## Configuration

The Notion integration requires a `NOTION_API_KEY` environment variable, but this is **optional** for core repository development. Most contributors will never need to set this up.

```bash
# Optional - only if working on Notion MCP specifically
NOTION_API_KEY=your_notion_api_key_here
```

## Relationship to Core Work

- **Primary implementation**: Oak Curriculum MCP servers (`apps/oak-curriculum-mcp-stdio`, `apps/oak-curriculum-mcp-streamable-http`)
- **Primary SDK**: Oak Curriculum SDK (`packages/sdks/oak-curriculum-sdk`)
- **Architectural reference**: Notion MCP (this workspace)

When working on the OpenAPI pipeline pattern, architectural decisions should consider both implementations to ensure the pattern remains general and reusable.

## Development

This workspace follows the same structure as the Oak MCP servers:

```bash
# Build
pnpm --filter @oaknational/oak-notion-mcp build

# Run (requires NOTION_API_KEY)
pnpm --filter @oaknational/oak-notion-mcp dev

# Test
pnpm --filter @oaknational/oak-notion-mcp test
```

## Documentation

For the complete architectural pattern, see:

- [OpenAPI Pipeline Architecture](../../docs/architecture/openapi-pipeline.md) - Core pattern explanation
- [Oak Curriculum SDK README](../../packages/sdks/oak-curriculum-sdk/README.md) - Primary implementation
- [Development Onboarding](../../docs/development/onboarding.md) - Getting started guide
