# Oak Notion MCP Servers

A collection of [Model Context Protocol (MCP)](https://modelcontextprotocol.org) servers and supporting frameworks and libraries that provide AI assistants such as Codex, Claude, and Gemini with access to various data sources:

- Oak Open Curriculum API (read-only access)
- Notion (read-only access)

## 🧭 Architecture

This monorepo uses a standard pnpm + Turborepo layout:

- `apps/` – runnable applications (MCP servers)
- `packages/core/` – shared interfaces, types, and utilities
- `packages/libs/` – runtime-adaptive libraries (`@oaknational/mcp-logger`, `@oaknational/mcp-env`, `@oaknational/mcp-storage`, `@oaknational/mcp-transport`)

### Architectural Decision Records (ADRs)

Key architectural decisions are documented as ADRs. [View all ADRs →](docs/architecture/architectural-decisions/)

## Features (Notion example)

- 🔍 **Search** across your Notion workspace
- 📊 **List and query** databases with filters and sorting
- 📄 **Read page content** including all block types
- 👥 **List workspace users** with automatic email scrubbing
- 🔒 **Privacy-first** - Automatic PII scrubbing, read-only access
- 🚀 **High performance** - TypeScript, ESM-only, tree-shakeable

## Installation & Setup (Notion example; packages not published yet)

### Prerequisites

- Node.js >= 22.0.0
- A [Notion integration](https://www.notion.so/my-integrations) with read access to your workspace

### Oak Curriculum MCP Server Config Examples

For now, we are using simple bearer token authentication for development. In production, use OAuth (see app README for discovery endpoints and auth notes).

> **Canonical transport:** All HTTP clients must target `/mcp` and send `Accept: application/json, text/event-stream` on every POST. The server returns HTTP 406 if either media type is missing. The legacy `/openai_connector` path is a short-lived alias that delegates to the same tool catalogue and will be removed once clients migrate.

```json
{
  "mcpServers": {
    "oak-curriculum-alpha": {
      "url": "https://curriculum-mcp-alpha.oaknational.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${SECRET_TOKEN}"
      }
    }
  }
}
```

### Configure Claude Desktop (Notion example)

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

Alternatively, for local STDIO usage with Cursor or Claude Desktop, see the per‑app READMEs. Example for Cursor:

```json
{
  "command": "pnpm",
  "args": ["exec", "tsx", "apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts"],
  "env": { "OAK_API_KEY": "${OAK_API_KEY}", "LOG_LEVEL": "info" }
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

### Configure Claude Code (Notion example)

```bash
# Add the server
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# Verify it's running
claude mcp list
```

## Usage Examples (Notion example)

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

# Build and validate
pnpm make   # install, type-gen, build, doc-gen, format, markdownlint, lint --fix
pnpm qg     # format-check, type-check, lint, markdownlint-check, test, test:e2e

# Deploy (Vercel)
# Ensure `apps/oak-curriculum-mcp-streamable-http/vercel.json` and envs are configured.
# After deploy, verify health endpoints and smoke tests described in the app README.
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

## Security and Privacy

We aim to avoid security and privacy issues by trying to:

- Never log or expose API keys
- Automatically scrub PII (emails)
- Ensure read-only access to Notion (no write operations)

If you find a security issue, see the [security policy](SECURITY.md).

## Licensing

The code in this repository is under the MIT License - see [LICENSE](LICENSE) for details. All logos and branding remain the property of Oak National Academy. For further information, please see [https://www.thenational.academy/legal/copyright-notice](https://www.thenational.academy/legal/copyright-notice).

Oak's curriculum data is provided under an [Open Government License](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

## Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Report Issues](https://github.com/oaknational/oak-mcp-ecosystem/issues)
- 💬 [Discussions](https://github.com/oaknational/oak-mcp-ecosystem/discussions)

---

Built with ❤️ by [Oak National Academy](https://www.thenational.academy/)
