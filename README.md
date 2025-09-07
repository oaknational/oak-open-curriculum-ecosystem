# Oak Notion MCP Server

A collection of [Model Context Protocol (MCP)](https://modelcontextprotocol.org) servers and supporting frameworka and libraries that provide AI assistants like Claude with access to various data sources:

- Notion (read-only access)
- Oak Open Curriculum API (read-only access)

> 🗺️ **First time here?** Check our [Architecture Map](docs/ARCHITECTURE_MAP.md) for a visual guide to the codebase!

## 🏛️ Architecture: Ancient Greek-Inspired Biological Design

This project uses Ancient Greek (inspired) biological and metaphysical terms to create clear conceptual boundaries, these live under the `ecosystem` directory.

Most code will fit into the below categories, but where that doesn't make sense, we will use the `packages` directory and more conventional naming.

There are three main ecosystem layers:

- Moria (plural: molecules), pure functions
- Histoi (plural: tissues/matrices), runtime-adaptive libraries, e.g. logging, storage, transport
- Psycha (plural: ensouled beings/organisms), complete applications (should really be Empsycha, but that is a mouthful)

| Greek Term         | English          | Purpose                                   | Packages                                                                                                                                      |
| ------------------ | ---------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Moria** (Μόρια)  | Molecules/Atoms  | Pure abstractions, zero dependencies      | `@oaknational/mcp-moria`                                                                                                                      |
| **Histoi** (Ἱστοί) | Tissues/Matrices | Transplantable runtime-adaptive libraries | `@oaknational/mcp-histos-logger`<br>`@oaknational/mcp-histos-storage`<br>`@oaknational/mcp-histos-env`<br>`@oaknational/mcp-histos-transport` |
| **Psycha** (Ψυχά)  | Ensouled beings  | Complete applications                     | `@oaknational/oak-notion-mcp`                                                                                                                 |

Within each Psychon organism there are

- Chora/Chorai (singular/plural: fields), pervasive, cross-cutting infrastructure, e.g. configuration management
- Organon/Organa (singular/plural: organs), discrete business logic, e.g. a Notion SDK
- Psychon (singular: soul), application wiring, bringing it all together

| Greek Term          | English | Purpose                  | Example Location                     |
| ------------------- | ------- | ------------------------ | ------------------------------------ |
| **Chorai** (χώραι)  | Fields  | Pervasive infrastructure | [`apps/oak-notion-mcp/src/chorai/`]  |
| **Organa** (ὄργανα) | Organs  | Discrete business logic  | [`apps/oak-notion-mcp/src/organa/`]  |
| **Psychon** (ψυχόν) | Soul    | Integration & wiring     | [`apps/oak-notion-mcp/src/psychon/`] |

There are (currently) four categories of chorai/fields

- aither/aitheres (air/flows) - Transforms that modify data flows, e.g. PII scrubbing
- eidolon/eidola (phantoms) - Test doubles, mocks, fakes, stubs etc
- phaneron/phanera (the visible) - Configuration (not secrets)
- stroma/stromata (foundations) - Types, schemas, contracts

we are likely to also need

- krypton/krypta (hidden) - Secrets, keys, tokens

and possibly some combination of

- nomos/nomoi (governance/policy) - Access control policy
- kratos/krate (power/control) - Identity and access control

### Why Greek Terms?

1. **Clarity** - Avoids overloaded English terms like "service" or "component"
2. **Precision** - Each term has specific philosophical meaning
3. **Memorability** - Unique names create stronger mental models

> 📚 Learn more: [Architecture Overview](docs/architecture-overview.md) | [Complete Naming Guide](docs/naming.md)

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
