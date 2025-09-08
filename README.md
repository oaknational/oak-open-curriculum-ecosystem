# Oak Notion MCP Servers

A collection of [Model Context Protocol (MCP)](https://modelcontextprotocol.org) servers and supporting frameworks and libraries that provide AI assistants like Claude with access to various data sources:

- Notion (read-only access)
- Oak Open Curriculum API (read-only access)

> 🗺️ **First time here?** Check our [Architecture Map](docs/ARCHITECTURE_MAP.md) for a visual guide to the codebase!

## 🧭 Architecture

This monorepo uses a conventional, intent-revealing structure:

- `apps/` – runnable applications (MCP servers)
- `packages/core/` – shared interfaces, types, and utilities (`@oaknational/mcp-core`)
- `packages/libs/` – runtime-adaptive libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/mcp-storage`, `@oaknational/mcp-transport`)

Legacy Greek terminology has been deprecated from active code and docs. For historical context only, see `docs/architecture/greek-ecosystem-deprecation.md`.

### Architectural Decision Records (ADRs)

Key architectural decisions are documented as ADRs. [View all ADRs →](docs/architecture/architectural-decisions/)

## Features (specific to Notion, needs moving)

- 🔍 **Search** across your Notion workspace
- 📊 **List and query** databases with filters and sorting
- 📄 **Read page content** including all block types
- 👥 **List workspace users** with automatic email scrubbing
- 🔒 **Privacy-first** - Automatic PII scrubbing, read-only access
- 🚀 **High performance** - TypeScript, ESM-only, tree-shakeable

## Installation & Setup (specific to Notion, needs moving, also the packages are not published yet)

### Prerequisites

- Node.js >= 22.0.0
- A [Notion integration](https://www.notion.so/my-integrations) with read access to your workspace

### For End Users

```bash
# Install globally
npm install -g oak-notion-mcp

# Or in your project
npm add -D oak-notion-mcp
```

### Configure Claude Desktop (specific to Notion, needs moving)

Add to your Claude Desktop settings (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["oak-notion-mcp"],
      "env": {
        "NOTION_API_KEY": "secret_your_actual_key_here"
      }
    }
  }
}
```

**Security tip**: Use environment variables instead of hardcoding keys:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["oak-notion-mcp"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

### Configure Claude Code (specific to Notion, needs moving)

```bash
# Add the server
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# Verify it's running
claude mcp list
```

## Usage Examples (specific to Notion, needs moving)

Once configured, you can ask Claude:

- "Show me all databases in my Notion workspace"
- "Search for pages about 'Q4 planning'"
- "Get the content of page [page-id]"
- "Query the Projects database for items with status 'In Progress'"
- "List all users in the workspace"

## Development

This is a pnpm workspaces monorepo, using Turbo for task execution.

This repo is optimised for working with agentic AI assistants, see [below](#making-the-most-of-agentic-ai-assistants).

### Getting Started

```bash
# Clone and install
git clone https://github.com/oaknational/oak-mcp-ecosystem.git
cd oak-mcp-ecosystem
pnpm install

# Set up environment
cp .env.example .env
# Add your NOTION_API_KEY and/or OAK_API_KEY to .env
```

### Available Commands

#### In the root of the monorepo

```bash
# Development
"build": "turbo run --continue build",
"clean": "turbo run --continue clean",
"dev": "turbo run --continue dev",
"format": "turbo run --continue format -- --cache",
"lint": "turbo run --continue lint",
"test": "turbo run --continue test",
"test:e2e": "turbo run --continue test:e2e",
"type-check": "turbo run --continue type-check",

# Analysis
pnpm analyze      # Run all analysis tools
```

If you want to deal with automatically fixable linting issues, run `pnpm lint -- --fix` in the root of the monorepo, or `pnpm lint --fix` in a workspace.

### Making the Most of Agentic AI Assistants

[TBD]

## Contributing

This is a pre-release version of the project, as such we are not accepting contributions at this time. Please watch the repository for updates.

1. Read our [Contributing Guide](CONTRIBUTING.md)
2. Follow the [Development Guide](docs/development/README.md)
3. Use [Conventional Commits](https://www.conventionalcommits.org/)
4. Ensure all tests pass before submitting PRs

## Security

We aim to avoid security and privacy issues by trying to:

- Never log or expose API keys
- Automatically scrub PII (emails)
- Ensure read-only access to Notion (no write operations)

## License

MIT - see [LICENSE](LICENSE) for details

## Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Report Issues](https://github.com/oaknational/oak-mcp-ecosystem/issues)
- 💬 [Discussions](https://github.com/oaknational/oak-mcp-ecosystem/discussions)

---

Built with ❤️ by [Oak National Academy](https://www.thenational.academy/)
