# Oak Notion MCP Server

A local [MCP server](https://modelcontextprotocol.org) allowing clients such as Claude Code, Claude Desktop, or other AI applications, access to Notion via the Notion API.

API keys for notion are stored in a .env file, or passed to the client at initialisation.

The package will be built and deployed to npm, will be open source, and will be installed locally or globally, and then be usable by an MCP client such as Claude Desktop via the usual configuration process.

Further documentation can be found in the [docs directory](docs/README.md)

## Development

### Prerequisites

- Node.js >= 22.0.0
- pnpm (automatically installed as a dev dependency)

### Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and add your Notion API key
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Commands

```bash
# Run in development mode with hot reload
pnpm dev

# Build the project
pnpm build

# Run tests (unit, integration, API)
pnpm test
pnpm test:run      # Run once without watch
pnpm test:coverage # Run with coverage report

# Run E2E tests (manual only, not in CI/CD)
pnpm test:e2e

# Linting and formatting
pnpm lint          # Check for linting errors
pnpm lint:fix      # Fix linting errors
pnpm format        # Format code with Prettier
pnpm format:check  # Check formatting

# Type checking
pnpm type-check
```

### Quality Gates

This project uses the following quality gates:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Using ESLint 9 flat config with TypeScript rules
- **Prettier**: Enforced code formatting
- **Vitest**: Test runner for unit, integration, and API tests
- **Husky**: Git hooks for pre-commit and commit-msg validation
- **Commitlint**: Enforces conventional commit messages
- **Semantic Release**: Automated versioning and GitHub releases

### Testing Strategy

Tests follow a strict hierarchy:

1. **Unit Tests** (`*.unit.test.ts`): Pure functions only, no IO, no mocks
2. **Integration Tests** (`*.integration.test.ts`): No IO, simple mocks allowed
3. **API Tests** (`*.api.test.ts`): No IO, mocks allowed, uses Supertest
4. **E2E Tests** (`*.e2e.test.ts`): Real IO allowed, manual execution only

All tests except E2E are run automatically in CI/CD and pre-push hooks.

### Project Structure

```
oak-notion-mcp/
├── src/              # Source code
├── dist/             # Built output (gitignored)
├── e2e-tests/        # End-to-end tests (manual only)
├── docs/             # Documentation
├── .agent/           # AI agent directives and plans
└── coverage/         # Test coverage reports (gitignored)
```

### MCP Configuration

To use this server with Claude Desktop, add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "oak-notion-mcp": {
      "command": "node",
      "args": ["/path/to/oak-notion-mcp/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "your-notion-api-key"
      }
    }
  }
}
```
