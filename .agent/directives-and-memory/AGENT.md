# AGENT.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

oak-notion-mcp is a Model Context Protocol (MCP) server that provides access to Notion via the Notion API. It allows AI clients like Claude or Gemini to interact with Notion workspaces.

## Development Commands

Package manager: **pnpm** (required - do not use npm or yarn)

```bash
# Install dependencies
pnpm install

# Development commands (to be implemented in package.json)
pnpm format      # Format code with Prettier
pnpm type-check  # Run TypeScript type checking
pnpm lint        # Run ESLint
pnpm test        # Run tests with Vitest
pnpm build       # Build with tsup
```

**Quality Gates**: Run these commands after major changes and before commits:

1. `pnpm format`
2. `pnpm type-check`
3. `pnpm lint`
4. `pnpm test`
5. `pnpm build`

## Architecture

The project follows clean architecture principles with:

- **MCP SDK** (`@modelcontextprotocol/sdk`) for protocol implementation
- **Notion API Client** (`@notionhq/client`) for Notion integration
- Environment variables in `.env` for API keys
- TypeScript for type safety

## Testing Strategy

This project uses TDD/BDD approach with strict testing hierarchy:

1. **Unit tests**: Test individual functions/classes in isolation
2. **Integration tests**: Test component interactions with mocked IO
3. **API tests**: Test API endpoints using Supertest
4. **E2E tests**: Full system tests (only place where real IO is allowed)

Test file naming:

- Unit: `*.test.ts`
- Integration: `*.integration.test.ts`
- API: `*.api.test.ts`
- E2E: `*.e2e.test.ts`

Tests must be co-located with the code they test.

## Key Dependencies

- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `@notionhq/client` - Notion API client
- `vitest` - Testing framework
- `supertest` - API testing
- `tsup` - Build tool
- `typescript` - Type system
- `eslint` - Linting
- `prettier` - Code formatting

## Environment Configuration

The `.env` file should contain:

```env
NOTION_API_KEY=your_notion_api_key_here
```

## Current Project State

The project is in initial setup phase. Before implementing features:

1. Install dependencies with `pnpm install`
2. Set up configuration files (tsconfig.json, eslint config, etc.)
3. Implement the build/test/lint commands in package.json
4. Follow the documented development practices in `docs/`
