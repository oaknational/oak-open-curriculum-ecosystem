# Oak Curriculum MCP Server

MCP server that provides AI assistants with access to Oak National Academy's curriculum content.

## Architecture

This application follows the standard structure:

- App wiring in `src/app/`
- Tools in `src/tools/`
- Integrations in `src/integrations/`

## Architecture Highlights

### Dependency Injection (DI)

- Runtime is composed centrally in `src/app/wiring.ts` using `@oaknational/mcp-core.createRuntime` with Node adapters.
- The Oak Curriculum SDK client is constructed from `OAK_API_KEY` and injected into the tools module via `createMcpToolsModule({ client })`.
- Tool handling uses a factory `createHandleToolCall(client)` to ensure all execution goes through the injected client.

Benefits: explicit composition, testability (mock client), and clear ownership of dependencies.

### Compile-time SDK Tool Generation

- The `@oaknational/oak-curriculum-sdk` generates MCP tool metadata and validators at compile time from the OpenAPI schema.
- This server lists tools from the SDK’s generated `MCP_TOOLS`, and delegates execution via `executeToolCall` with the injected client.
- No runtime schema fetching and no manual mapping layers.

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

## Testing

- Tests avoid network calls by mocking the SDK client and injecting it into the handler factory.
- See `src/tools/handlers/tool-handler.test.ts` for examples.

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
