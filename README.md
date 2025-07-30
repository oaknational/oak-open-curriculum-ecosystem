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

## Development & Testing

### Running Tests

The project has a comprehensive test suite with different test levels:

```bash
# Run all tests (unit, integration, API)
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

Here's a complete example of how to use `oak-notion-mcp` in a development project with Claude Desktop or Claude Code.

### Step 1: Install the MCP Server

In your development project, install `oak-notion-mcp` as a dev dependency:

```bash
npm add -D oak-notion-mcp@latest
# or with pnpm
pnpm add -D oak-notion-mcp@latest
```

### Step 2: Set Up Your Notion API Key

You have two options for handling the Notion API key securely:

#### Option A: Using a .env file (Recommended)

Create a `.env` file in your project root:

```bash
# .env
NOTION_API_KEY=secret_abc123...
```

Make sure to add `.env` to your `.gitignore` to avoid committing sensitive data.

**Note**: When `oak-notion-mcp` runs via `npx` from your project directory, it will automatically load environment variables from your project's `.env` file using the `dotenv` package.

#### Option B: Using Environment Variable Expansion

Configure the API key in your shell environment:

```bash
export NOTION_API_KEY="secret_abc123..."
```

### Step 3: Configure Claude Desktop or Claude Code

#### For Claude Code

Use the Claude Code CLI to add the MCP server:

```bash
# Add to current project (local scope)
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# Or add to project scope (shared with team via .mcp.json)
claude mcp add notion -s project -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# Or add globally (available in all projects)
claude mcp add notion -s user -e NOTION_API_KEY="${NOTION_API_KEY}" -- npx oak-notion-mcp

# For Windows users (not WSL), wrap with cmd:
claude mcp add notion -e NOTION_API_KEY="${NOTION_API_KEY}" -- cmd /c npx oak-notion-mcp
```

This creates a configuration that:

- Uses `npx` to run the locally installed package
- Passes the API key via environment variable
- Can be scoped to local, project, or user level
- Windows users need the `cmd /c` wrapper for npx to work correctly

#### For Claude Desktop

Add the MCP server to your Claude Desktop settings. You can configure it at different scopes:

#### Project Scope (Shared with Team)

Create or update `.claude/settings.json` in your project root:

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

This configuration:

- Uses `npx` to run the locally installed package
- Uses environment variable expansion `${NOTION_API_KEY}` to read the API key
- Can be committed to version control (the actual key is not stored)

#### Local Scope (Personal Use Only)

For personal configuration, create `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["oak-notion-mcp"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY:-secret_default}"
      }
    }
  }
}
```

This uses the syntax `${VAR:-default}` to provide a fallback value.

### Step 4: Verify the Configuration

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

### Step 5: Using the MCP Server

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
