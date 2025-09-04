# Oak Curriculum MCP Server

MCP server that provides AI assistants with access to Oak National Academy's curriculum content.

## Architecture

This organism follows the Moria/Histoi/Psycha architecture:

- **Chorai** (Pervasive Infrastructure): Logging, configuration, types, tool metadata
- **Organa** (Business Logic):
  - `mcp/` - MCP protocol handlers that directly delegate to SDK
- **Psychon** (Wiring): Application assembly and dependency injection

## Key Architectural Innovation - Direct SDK Integration

**CRITICAL**: This MCP server achieves full ADR compliance through **direct SDK delegation**:

1. **No Manual API Mapping**: The handler uses enriched tools generated at build time
2. **Automatic API Updates**: When the API changes, we only need to:
   - Rebuild the SDK (which fetches new OpenAPI schema)
   - Regenerate enriched tools (`pnpm exec tsx scripts/generate-enriched-tools.ts`)
   - That's it! No code changes required

The flow is completely automatic:

```
API Change → SDK Rebuild → Enriched Tools Generation → MCP Server Works
```

This is achieved through:

- **ADR-029**: No manual API data structures - all from SDK
- **ADR-030**: SDK as single source of truth - we import SDK types directly
- **ADR-031**: Generation at build time - enriched tools combine SDK operations with decorations

### How It Works

1. **Build Time**:
   - SDK generates operations from OpenAPI schema
   - Our script combines these with decorative metadata
   - Creates `enriched-tools.ts` with all 26 operations

2. **Runtime**:
   - Handler receives MCP tool name
   - Finds enriched tool by name
   - Maps operationId to SDK method name
   - Calls SDK directly with parameters
   - Returns SDK response

No intermediate layers, no manual mapping, everything flows from the API schema.

## Tools

- `oak-search-lessons` - Search for lessons by subject/key stage
- `oak-get-lesson` - Get detailed lesson content
- `oak-list-units` - List units in a programme
- `oak-get-programme` - Get programme overview
- `oak-search-resources` - Search teaching resources

## Resources

- `lesson://{id}` - Individual lesson content
- `unit://{id}` - Unit overview and lessons
- `programme://{subject}/{keystage}` - Programme structure
- `resource://{type}/{id}` - Teaching resources

## Installation

```bash
# Install via npx (when published)
npx @oaknational/oak-curriculum-mcp

# Or clone and build locally
pnpm install
pnpm build
```

## Configuration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "oak-curriculum": {
      "command": "npx",
      "args": ["-y", "@oaknational/oak-curriculum-mcp"],
      "env": {
        "OAK_API_KEY": "${OAK_API_KEY}"
      }
    }
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```
