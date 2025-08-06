# Oak Notion MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.org) server that provides AI assistants like Claude with safe, read-only access to your Notion workspace through the official Notion API.

> 🗺️ **First time here?** Check our [Architecture Map](docs/ARCHITECTURE_MAP.md) for a visual guide to the codebase!

## Quick Start

```bash
# Install in your project
npm add -D oak-notion-mcp@latest

# Configure with your Notion API key
export NOTION_API_KEY="secret_your_actual_key_here"

# Add to Claude Desktop/Code (see detailed setup below)
```

## 🏛️ Architecture: Greek-Inspired Biological Design

This project uses Greek philosophical terms to create clear conceptual boundaries. The architecture follows a **genotype/phenotype** model:

## Genotype (oak-mcp-core)
The genetic blueprint - abstract patterns all MCP servers inherit:

| Greek Term             | English           | Purpose                        | Location                                            |
| ---------------------- | ----------------- | ------------------------------ | --------------------------------------------------- |
| **Morphai** (μορφαί)   | Hidden Forms      | Abstract patterns (Platonic)   | [`ecosystem/oak-mcp-core/src/chora/morphai/`]      |
| **Stroma** (στρῶμα)    | Foundation/Matrix | Types, contracts, schemas      | [`ecosystem/oak-mcp-core/src/chora/stroma/`]       |
| **Aither** (αἰθήρ)     | Divine Air        | Logging, events, errors        | [`ecosystem/oak-mcp-core/src/chora/aither/`]       |
| **Phaneron** (φανερόν) | The Visible       | Configuration, settings        | [`ecosystem/oak-mcp-core/src/chora/phaneron/`]     |
| **Eidola** (εἴδωλα)    | Phantoms          | Test mocks and fixtures        | [`ecosystem/oak-mcp-core/src/chora/eidola/`]       |

## Phenotype (oak-notion-mcp)
The expressed organism - concrete implementation for Notion:

| Greek Term             | English           | Purpose                        | Location                                            |
| ---------------------- | ----------------- | ------------------------------ | --------------------------------------------------- |
| **Organa** (ὄργανα)    | Organs            | Business logic units           | [`ecosystem/oak-notion-mcp/src/organa/`]           |
| **Psychon** (ψυχόν)    | Soul              | App wiring and startup         | [`ecosystem/oak-notion-mcp/src/psychon/`]          |

### Why Greek Terms?

1. **Clarity** - Avoids overloaded English terms like "service" or "component"
2. **Precision** - Each term has specific philosophical meaning
3. **Memorability** - Unique names create stronger mental models

### The Morphai: Platonic Forms in Code

**Morphai (μορφαί)** are the hidden forms - abstract patterns that organs instantiate. Like Plato's theory of forms, morphai represent the perfect, eternal patterns that exist in the genotype, while organs are their imperfect but functional shadows in the phenomenal world.

- **Morphai define potential** - What it means to be a tool, handler, or registry
- **Organs express actuality** - How those patterns work in a specific context
- **Inheritance through genetics** - All phenotypes inherit the same morphai from the genotype

> 📚 Learn more: [Architecture Overview](docs/architecture-overview.md) | [Complete Naming Guide](docs/naming.md) | [Morphai Philosophy](ecosystem/oak-mcp-core/src/chora/morphai/README.md)

## Features

- 🔍 **Search** across your Notion workspace
- 📊 **List and query** databases with filters and sorting
- 📄 **Read page content** including all block types
- 👥 **List workspace users** with automatic email scrubbing
- 🔒 **Privacy-first** - Automatic PII scrubbing, read-only access
- 🚀 **High performance** - TypeScript, ESM-only, tree-shakeable

## Installation & Setup

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

### Configure Claude Desktop

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

### Configure Claude Code

```bash
# Add the server
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# Verify it's running
claude mcp list
```

## Usage Examples

Once configured, you can ask Claude:

- "Show me all databases in my Notion workspace"
- "Search for pages about 'Q4 planning'"
- "Get the content of page [page-id]"
- "Query the Projects database for items with status 'In Progress'"
- "List all users in the workspace"

## Development

### Getting Started

```bash
# Clone and install
git clone https://github.com/oaknational/oak-notion-mcp.git
cd oak-notion-mcp
pnpm install

# Set up environment
cp .env.example .env
# Add your NOTION_API_KEY to .env

# Run in development
pnpm dev
```

### Available Commands

```bash
# Development
pnpm dev          # Run with hot reload
pnpm build        # Build for production
pnpm start        # Run built version

# Testing
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report
pnpm test:e2e     # Run end-to-end tests (requires API key)

# Code Quality
pnpm lint         # Check linting
pnpm lint:fix     # Fix linting issues
pnpm format       # Format code
pnpm type-check   # Check TypeScript types

# Analysis
pnpm analyze      # Run all analysis tools
```

### Project Structure

```text
src/
├── chora/          # Cross-cutting infrastructure layers
│   ├── stroma/     # Types, contracts, schemas (foundation)
│   ├── aither/     # Logging, events, errors (flows)
│   ├── phaneron/   # Configuration (visible settings)
│   └── eidola/     # Test mocks (phantoms)
├── organa/         # Business logic organs
│   ├── notion/     # Notion API integration
│   └── mcp/        # MCP protocol handlers
└── psychon/        # Application wiring (soul)
```

## Architecture Decisions

Key architectural decisions are documented as ADRs:

- [ESM-Only Package](docs/architecture/architectural-decisions/001-esm-only-package.md)
- [Pure Functions First](docs/architecture/architectural-decisions/002-pure-functions-first.md)
- [Biological Architecture](docs/architecture/architectural-decisions/020-biological-architecture.md)
- [View all ADRs →](docs/architecture/architectural-decisions/)

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
- 🐛 [Report Issues](https://github.com/oaknational/oak-notion-mcp/issues)
- 💬 [Discussions](https://github.com/oaknational/oak-notion-mcp/discussions)

---

Built with ❤️ by [Oak National Academy](https://www.thenational.academy/)
