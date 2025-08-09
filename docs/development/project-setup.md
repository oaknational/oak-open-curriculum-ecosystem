# Project Setup

This document provides setup and configuration details for the Oak Notion MCP project.

## Project Overview

oak-notion-mcp is a Model Context Protocol (MCP) server that provides access to Notion via the Notion API. It allows AI clients like Claude or Gemini to interact with Notion workspaces.

## Architecture Overview

The project follows clean architecture principles with:

- **MCP SDK** (`@modelcontextprotocol/sdk`) for protocol implementation
- **Notion API Client** (`@notionhq/client`) for Notion integration
- **Environment variables** in `.env` for API keys
- **TypeScript** for type safety

## Environment Configuration

Create a `.env` file in the project root:

```env
NOTION_API_KEY=your_notion_api_key_here
```

**Important**: Never commit the `.env` file to version control.

## Initial Setup

1. **Install dependencies** with `pnpm install`
2. **Copy environment file**: `cp .env.example .env`
3. **Add your Notion API key** to the `.env` file
4. **Run quality gates** to verify setup:

   ```bash
   pnpm format
   pnpm type-check
   pnpm lint
   pnpm test
   pnpm build
   ```

## Key Dependencies

### Core Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@notionhq/client` - Notion API client
- `consola` - Logging library
- `dotenv` - Environment variable management
- `zod` - Runtime validation

### Development Dependencies

- `vitest` - Testing framework
- `supertest` - API testing
- `tsup` - Build tool
- `typescript` - Type system
- `eslint` - Linting
- `prettier` - Code formatting
- `husky` - Git hooks
- `lint-staged` - Pre-commit formatting

## Testing Structure

The project uses a strict testing hierarchy:

1. **Unit tests** (`*.test.ts`) - Test pure functions in isolation
2. **Integration tests** (`*.integration.test.ts`) - Test component interactions with mocked I/O
3. **API tests** (`*.api.test.ts`) - Test API endpoints using Supertest
4. **E2E tests** (`*.e2e.test.ts`) - Full system tests with real I/O

Tests must be co-located with the code they test.

## Development Commands

All commands use `pnpm` (required - never use npm or yarn):

```bash
# Development
pnpm dev          # Run in development mode
pnpm start        # Run built version

# Quality Gates (run in order)
pnpm format       # Format code with Prettier
pnpm type-check   # Check TypeScript types
pnpm lint         # Run ESLint
pnpm test         # Run tests (excludes E2E)
pnpm build        # Build with tsup

# Testing
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate coverage report
pnpm test:e2e     # Run E2E tests (requires API key)

# Analysis
pnpm analyze      # Run architecture analysis
```

## Current Project State

The project is actively being developed with:

- Core MCP server functionality implemented
- Notion integration working for read operations
- Comprehensive test coverage
- Architecture evolution toward cellular/ecosystem patterns

See [Architecture Overview](../architecture-overview.md) for detailed architecture information.
