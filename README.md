# Oak Notion MCP Server

A local [MCP server](https://modelcontextprotocol.org) allowing clients such as Claude Code, Claude Desktop, or other AI applications, access to Notion via the Notion API.

API keys for notion are stored in a .env file, or passed to the client at initialisation.

The package will be built and deployed to npm, will be open source, and will be installed locally or globally, and then be usable by an MCP client such as Claude Desktop via the usual configuration process.

**Architecture Note**: This project is being refactored to include `oak-mcp-core`, a generic MCP framework that will enable rapid development of MCP servers. The Notion-specific functionality will be built on top of this reusable framework, reducing code duplication and improving maintainability across MCP server implementations.

**🧪 Complete Biological Architecture**: We follow a comprehensive biological model for software architecture that distinguishes between:

- **Substrate** (Foundation) - Types, contracts, and event schemas that form the "physics" of our system
- **Systems** (Pervasive) - Infrastructure like logging and events that flow throughout the organism
- **Organa** (Discrete) - Business logic units like Notion and MCP with clear boundaries
- **Organisms** (Applications) - Complete applications that wire systems and organs together
- **Ecosystems** (Multiple Apps) - Future vision of multiple organisms interacting symbiotically

This approach is grounded in complex systems theory and recent mathematical research proving that:

- Heterogeneous networks with cooperative interactions achieve greater stability (Meena et al., 2023)
- Systems operate optimally at criticality - the edge of chaos (Beggs & Plenz, 2003)
- Complex systems show universal early warning signals before transitions (Scheffer et al., 2009)

Our 103 relative import warnings are such early warning signals, showing where architectural boundaries naturally want to form. Learn more in our [architectural documentation](docs/architecture/README.md), [mathematical foundation](docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md), and [evolution plan](.agent/plans/architectural-evolution-plan.md).

## Architecture Decision Records

Our architectural decisions are documented as ADRs (Architecture Decision Records):

- [ADR-001: ESM-Only Package](docs/architecture/architectural-decisions/001-esm-only-package.md)
- [ADR-002: Pure Functions First](docs/architecture/architectural-decisions/002-pure-functions-first.md)
- [ADR-003: Zod for Runtime Validation](docs/architecture/architectural-decisions/003-zod-for-validation.md)
- [ADR-004: Abstract Notion SDK Behind Interface](docs/architecture/architectural-decisions/004-no-direct-notion-sdk-usage.md)
- [ADR-005: Automatic PII Scrubbing](docs/architecture/architectural-decisions/005-automatic-pii-scrubbing.md)
- [ADR-006: Cellular Architecture Pattern](docs/architecture/architectural-decisions/006-cellular-architecture-pattern.md)
- [ADR-007: Accept Current Technical Debt as Architectural Markers](docs/architecture/architectural-decisions/007-accept-current-technical-debt.md)
- [ADR-008: Ecosystem Architecture Vision](docs/architecture/architectural-decisions/008-ecosystem-architecture-vision.md)
- [ADR-009: Mathematical Foundation for Architecture](docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md)
- [ADR-010: Use tsup for Bundling](docs/architecture/architectural-decisions/010-tsup-for-bundling.md)
- [ADR-011: Use Vitest for Testing](docs/architecture/architectural-decisions/011-vitest-for-testing.md)
- [ADR-012: Use pnpm as Package Manager](docs/architecture/architectural-decisions/012-pnpm-package-manager.md)
- [ADR-013: Git Hooks with Husky and lint-staged](docs/architecture/architectural-decisions/013-husky-and-lint-staged.md)
- [ADR-014: Conventional Commits Standard](docs/architecture/architectural-decisions/014-conventional-commits.md)
- [ADR-015: Node.js 22+ Requirement](docs/architecture/architectural-decisions/015-node-22-minimum.md)
- [ADR-016: Use dotenv for Environment Configuration](docs/architecture/architectural-decisions/016-dotenv-for-configuration.md)
- [ADR-017: Use Consola for Logging](docs/architecture/architectural-decisions/017-consola-for-logging.md)
- [ADR-018: Complete Biological Architecture](docs/architecture/architectural-decisions/018-complete-biological-architecture.md)

Further documentation can be found in the [docs directory](docs/README.md)

**New to MCP or AI agent development?** Follow our [Developer Onboarding Journey](docs/development/onboarding-journey.md) for a structured learning path.

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

# Run tests (unit, integration)
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

# Architecture analysis
pnpm analyze        # Run all analysis commands
pnpm analyze:deps   # Generate dependency graph
pnpm analyze:circular # Check for circular dependencies
pnpm analyze:modules  # Classify modules for extraction
pnpm analyze:loc      # Count lines of code
```

### Architecture Analysis

The project includes tools for analyzing the codebase architecture to identify components suitable for extraction into a shared library:

```bash
# Run complete architecture analysis
pnpm analyze

# Individual analysis commands:
pnpm analyze:deps     # Creates visual dependency graph at .agent/analyses/dependency-graph.svg
pnpm analyze:circular # Checks for circular dependencies
pnpm analyze:modules  # Analyzes and classifies modules as generic/specific/mixed
pnpm analyze:loc      # Generates lines of code metrics
```

**Note**: The dependency graph visualization (`analyze:deps`) requires [Graphviz](https://formulae.brew.sh/formula/graphviz) to be installed:

```bash
# Install on macOS
brew install graphviz

# Install on Ubuntu/Debian
sudo apt-get install graphviz

# Install on Windows
# Download from https://graphviz.org/download/
```

The analysis results are stored in `.agent/analyses/` and help identify:

- Generic MCP components that can be reused across projects
- Notion-specific code that should remain in this package
- Mixed modules that are candidates for refactoring
- Node.js API usage for edge runtime compatibility planning

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
2. **Integration Tests** (`*.integration.test.ts`): No IO, simple mocks allowed, includes MCP protocol testing
3. **E2E Tests** (`*.e2e.test.ts`): Real IO allowed, manual execution only

All tests except E2E are run automatically in CI/CD and pre-push hooks.

### Project Structure

```
oak-notion-mcp/
├── src/                    # Source code
│   ├── substrate/         # Foundation layer (types & contracts)
│   │   ├── types/         # Pure type definitions
│   │   ├── contracts/     # Interface definitions
│   │   └── event-schemas/ # Event type definitions
│   ├── systems/           # Pervasive infrastructure
│   │   ├── logging/       # Nervous system
│   │   ├── events/        # Hormonal signaling
│   │   └── config/        # Endocrine system
│   ├── organa/            # Discrete business logic
│   │   ├── notion/        # Notion integration organ
│   │   └── mcp/           # MCP protocol organ
│   └── (organism.ts)      # Future: Assembly point
├── dist/                   # Built output (gitignored)
├── e2e-tests/             # End-to-end tests (manual only)
├── docs/                  # Documentation
├── .agent/                # AI agent directives and plans
└── coverage/              # Test coverage reports (gitignored)
```

The project follows a **complete biological architecture** with clear separation between:

- **Substrate**: Compile-time foundation (types, contracts)
- **Systems**: Pervasive runtime infrastructure that flows throughout
- **Organa**: Discrete business logic units with no cross-imports
- **Organism**: (Future) Wires everything together

This structure will enable extraction of `oak-mcp-core` as a separate package in Phase 4.

## Development & Testing

### Running Tests

The project has a comprehensive test suite with different test levels:

```bash
# Run all tests (unit, integration)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run only changed tests
pnpm test:changed

# Run E2E tests (requires NOTION_API_KEY in .env)
pnpm test:e2e
```

### E2E Testing

End-to-end tests verify real integration with the Notion API. They are not run in CI/CD due to requiring API credentials.

To run E2E tests:

1. Ensure you have a valid `NOTION_API_KEY` in your `.env` file
2. Run `pnpm test:e2e`

The E2E tests will:

- Build the project
- Start the MCP server with real Notion API credentials
- Verify connection, resource listing, tool execution, and error handling
- Test PII scrubbing (emails are automatically redacted)

### Development Workflow

1. **Make changes** to source files
2. **Run tests** to ensure nothing breaks: `pnpm test:changed`
3. **Check types**: `pnpm type-check`
4. **Fix linting**: `pnpm lint:fix`
5. **Format code**: `pnpm format`
6. **Build**: `pnpm build`
7. **Test locally**: `pnpm dev`

### Git Hooks

The project uses Husky for Git hooks:

- **pre-commit**: Runs lint-staged to format and lint changed files
- **pre-push**: Runs type checking, linting, and tests
- **commit-msg**: Validates commit messages follow conventional format

If a hook fails, fix the issues and try again. Never bypass hooks with `--no-verify`.

### Code Quality

All code must pass strict TypeScript checking with no `any` types. The project enforces:

- No unused variables or parameters
- No implicit returns
- No unchecked indexed access
- Exhaustive switch statements
- Consistent casing in file names

## Usage Example: Using with Claude Desktop or Claude Code

### For End Users (After npm install)

Install `oak-notion-mcp` in your project:

```bash
npm add -D oak-notion-mcp@latest
# or with pnpm
pnpm add -D oak-notion-mcp@latest
# or globally
npm install -g oak-notion-mcp
```

### Setting Up Your Notion API Key

Since the package is installed via npm, you need to provide your own Notion API key. You have three options:

#### Option 1: Direct Configuration (Simplest for local development)

Add directly to `.claude/settings.local.json` (create this file if it doesn't exist):

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

**Note**: This file should NOT be committed to version control as it contains your secret key.

#### Option 2: System Environment Variable (Recommended for security)

Set the API key as a system environment variable:

```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export NOTION_API_KEY="secret_your_actual_key_here"
```

Then use environment variable expansion in `.claude/settings.json` (this file CAN be committed):

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

#### Option 3: Project .env File

If you prefer using a `.env` file in your project root:

```bash
# .env in your project root
NOTION_API_KEY=your_notion_api_key_here
```

The package will automatically load the `.env` file from your current working directory when run via `npx`.

Make sure to add `.env` to your `.gitignore`.

### Using with Claude Code

The configurations above work with both Claude Desktop and Claude Code. For Claude Code specifically, you can also use the CLI:

```bash
# Add using whichever API key method you chose above
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# For Windows users (not WSL), wrap with cmd:
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- cmd /c npx oak-notion-mcp
```

### Verify the Configuration

#### In Claude Code

Check that the server is configured and running:

```bash
# List all configured servers
claude mcp list

# Get details for the notion server
claude mcp get notion

# Check server status interactively
# Type /mcp in Claude Code chat
```

#### In Claude Desktop

The server will start automatically when you open Claude Desktop. Check the logs if you encounter issues.

### Using the MCP Server

Once configured, you can interact with your Notion workspace through Claude:

```text
> Show me all databases in my Notion workspace

> Search for pages containing "Q4 planning"

> Get the content of page with ID abc123

> List all users in the workspace

> Query the "Projects" database for items with status "In Progress"
```

### Alternative: Global Installation

If you prefer a global installation:

```bash
# Install globally
npm install -g oak-notion-mcp

# Configure in Claude Desktop settings
{
  "mcpServers": {
    "notion": {
      "command": "oak-notion-mcp",
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

### Security Best Practices

1. **Never commit API keys** - Always use environment variables or `.env` files
2. **Use read-only access** - When creating your Notion integration, grant only necessary permissions
3. **Project vs Personal** - Use `.claude/settings.json` for team-shared config, `.claude/settings.local.json` for personal config
4. **Environment variable expansion** - Claude Desktop supports `${VAR}` and `${VAR:-default}` syntax

### Troubleshooting

If the MCP server fails to connect:

1. Check that your Notion API key is valid
2. Verify the package is installed: `npm ls oak-notion-mcp`
3. Test the server directly: `NOTION_API_KEY=your_key npx oak-notion-mcp`
4. Check Claude Desktop logs for connection errors

### MCP Configuration Reference

The full configuration supports these options:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["oak-notion-mcp"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}",
        "LOG_LEVEL": "info", // Optional: debug, info, warn, error
        "MCP_TIMEOUT": "30000" // Optional: timeout in milliseconds
      }
    }
  }
}
```
