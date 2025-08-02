# AGENT.md

This file provides guidance to AI agents when working with code in this repository. Read ALL of it first, and then follow the instructions.

## Prime Directive

**Ask: could it simpler without compromising quality?**

## Rules Summary

### Design

- ALWAYS use unit test TDD
- ALWAYS use pure functions, and where that is not possible make sure all IO functions are passed as arguments from integration points
- ALWAYS use DIP, DRY, KISS, YAGNI principles
- ALWAYS use SOLID principles
- Fail FAST, fail hard, with instructive, helpful error messages.
- Do not fail open
- Do not fail silently
- Never swallow errors
- Do not attempt to use "sensible defaults", if a required argument is missing, throw an error.
- Always make code as simple and readable as possible, without sacrificing impact.
- NEVER create duplicate interfaces, types, or classes
- NEVER create duplicate functions
- NEVER create wrappers around functions if you can possibly use them directly

### Development

- Never use `as`
- Never use `any` type
- Never use `!` (non-null assertion)
- Only use `unknown` at incoming boundaries from IO
- Define types ONCE, there must be a SINGLE source of truth for each type
- When dealing with a library, use the types from that library, do not make up new ones
- Use MEANINGFUL type guards/predicates to narrow types (functions with the `is` keyword) OR use Zod schemas to validate incoming data
- Always work to the highest software engineering principles
- ALWAYS run the quality gates, one by one, after any major changes. Fix any issues, regardless of location or cause. Run the gates again after each fix to prevent regressions.

### Testing

- ALL IO MUST be mocked in tests, except in E2E tests
- Unit tests must NEVER contain mocks
- Unit tests tests must only be of pure functions
- Integration tests may contain mocks
- Mocks must ALWAYS be simple fakes, passed as arguments to functions
- Where creating an integration test is complex, STOP, refactor the code into pure functions, unit test the functions, and create a simple integration point that has a simple mockable interface and integration test that.
- NEVER add complex logic to tests, it risks testing the test code rather than the code under test
- Always ask what a test is proving. It should prove something useful about the code under test.
- Each proof should happen ONCE, repeated proofs are fragile and a waste of time.
- Unit and integration tests prove engineering correctness
- E2E tests prove behavioural impact

### Documentation

- Always add JSDoc/TypeDoc comments to files, classes, functions, and types and anything else that needs reasoning about
- Make sure that the markdown documentation is up to date [docs](../../docs/README.md)

### Refactoring

The goal is never to simply "satisfy" the refactoring rules, but to make the code as simple, easy to reason about, and maintainable as possible, without sacrificing impact.

- NEVER create compatibility layers, replace old code with new code
- Never maintain backward compatibility, we have versioning for that -- keep the system in a correct and fully functional state by replacing old approaches with new approaches
- If a function is too complex or too long, examine its responsibilities, domains, reflect on the SOLID principles, and break it down into smaller PURE functions with no side effects
- If a file is too long, examine its responsibilities, domains, reflect on the SOLID principles, and break it down into smaller files. If the new files will be domain related, create a folder for them, with an index.ts file that is the sole public API and the definitions of domain boundary.
- Where refactoring for DIP causes complexity, take a step back and consider why, what is this teaching you about the architecture, what is the best way to address this? Refactoring the architecture is always an option.
- Remember: single responsibility, single reason to change, single source of truth.

### Planning

- Never refer to Chronos times or durations in plans, they are not accurate or relevant. Use Kairos based semantic milestones instead.

## Project Overview

oak-notion-mcp is a Model Context Protocol (MCP) server that provides access to Notion via the Notion API. It allows AI clients like Claude or Gemini to interact with Notion workspaces.

## Best Practice, Rules, and Conventions in Detail

- [High Level Architecture](../../docs/high-level-architecture.md)
- [Development Practice](../../docs/development-practice.md)
- [TypeScript Practice](../../docs/typescript-practice.md)
- [Testing and Development Strategy](../../docs/testing-and-development-strategy.md)
- [Tooling](../../docs/tooling.md)
- [Safety and Security](../../docs/safety-and-security.md)

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
