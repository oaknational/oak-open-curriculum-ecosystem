# Oak Curriculum MCP Server

MCP server that provides AI assistants with access to Oak National Academy's curriculum content.

## Architecture

This organism follows the Moria/Histoi/Psycha architecture:

- **Chorai** (Pervasive Infrastructure): Logging, configuration, types
- **Organa** (Business Logic):
  - `curriculum/` - Oak API client organ that processes external data
  - `mcp/` - MCP protocol handlers
- **Psychon** (Wiring): Application assembly and dependency injection

## Key Architectural Decision

The curriculum API client is implemented as an **organ that processes external data**, not a passive connector. It actively transforms, validates, and enriches curriculum data from the Oak API, making it a functional unit (organ) rather than structural tissue.

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
