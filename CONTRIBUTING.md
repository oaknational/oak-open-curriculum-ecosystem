# Contributing to Oak MCP Ecosystem

Thank you for your interest in contributing to the Oak MCP Ecosystem Server! This guide will help you get started.

This is an internal technical spike for now, so at this time we are not looking for external contributions, but we do appreciate your interest.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

1. **Node.js 22+**
2. **pnpm**
3. Service credentials for the areas you are touching (Oak Curriculum API keys, Elasticsearch Serverless API keys, optional Notion keys for archived servers).

### Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/yourusername/oak-mcp-ecosystem.git
   cd oak-mcp-ecosystem
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment:

   ```bash
   cp .env.example .env
   # Populate OAK_API_KEY, SEARCH_API_KEY, ELASTICSEARCH_* etc. as needed
   ```

4. Run tests to verify setup:

   ```bash
   pnpm test
   ```

## Contribution Levels

We support different contribution paths depending on your setup time and access to services:

### Level 1: Code-Only Contributions (0 minutes setup)

**No environment variables required!**

You can contribute immediately by:

- Fixing TypeScript errors
- Adding/improving unit tests
- Refactoring pure functions
- Updating documentation
- Reviewing pull requests
- Improving generation scripts in `type-gen/`

```bash
pnpm install
pnpm test          # All unit tests run without API keys
pnpm type-check    # Type checking works without env vars
pnpm lint          # Linting works without env vars
pnpm build         # SDK and libraries build without env vars
```

### Level 2: Integration Development (10-15 minutes setup)

**Requires: `OAK_API_KEY` only**

With a single API key, you can:

- Run MCP servers locally
- Test SDK integrations
- Run most integration tests
- Work on application features

```bash
cp .env.example .env
# Add: OAK_API_KEY=your_key_here
pnpm -C apps/oak-curriculum-mcp-stdio dev
```

Get your Oak API key from: Contact Oak engineering team or see [Environment Variables Guide](docs/development/environment-variables.md).

### Level 3: Full Stack Development (1-2 hours setup)

**Requires: Multiple service credentials**

For complete E2E testing and search functionality:

- `OAK_API_KEY` – Curriculum API
- `ELASTICSEARCH_URL` + `ELASTICSEARCH_API_KEY` – Search indices
- `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` – OAuth testing
- `OPENAI_API_KEY` – Natural language search (optional)
- `SEARCH_API_KEY` – Admin endpoints

See workspace READMEs for detailed setup instructions.

## Development Process

### 1. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Follow TDD Approach

1. **Write tests first**:
   - Unit tests for pure functions
   - Integration tests for component interactions
   - Follow existing test patterns

2. **Implement minimal code** to pass tests

3. **Refactor** for clarity and performance

### 3. Run Quality Gates

Before committing, run all quality checks:

```bash
pnpm format        # Format code
pnpm type-check    # Check types
pnpm lint          # Lint code
pnpm test          # Run tests
pnpm build         # Verify build
```

### 4. Commit Your Changes

Use conventional commit format:

```bash
git add .
git commit -m "feat: add new search filter option"
# or
git commit -m "fix: handle empty database queries"
```

Commit types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `test`: Add/update tests
- `chore`: Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use conventional commit format:

- ✅ `feat: add database pagination support`
- ✅ `fix: correct email scrubbing regex`
- ❌ `Updated code`
- ❌ `Fixed stuff`

### PR Description

Include:

1. **What** - Brief description of changes
2. **Why** - Problem being solved or feature being added
3. **How** - High-level approach taken
4. **Testing** - How you tested the changes
5. **Screenshots** - If UI changes (unlikely for this project)

### PR Checklist

- [ ] Tests added/updated for all changes
- [ ] All tests passing (`pnpm test`)
- [ ] Types checked (`pnpm type-check`)
- [ ] Code linted (`pnpm lint`)
- [ ] Documentation updated if needed
- [ ] No `console.log` statements
- [ ] No hardcoded values
- [ ] No `any` types or type assertions

## Code Standards

### TypeScript

- **No `any` types** - Use `unknown` at boundaries
- **No type assertions** - No `as` casting
- **Use type guards** - Functions with `is` keyword
- **Validate inputs** - Use the generated Zod schemas via the shared helpers in `@oaknational/oak-curriculum-sdk` (see `parseSchema` and friends)

### Functions

- **Prefer pure functions** - No side effects
- **Single responsibility** - One function, one job
- **Descriptive names** - Self-documenting code
- **Early returns** - Reduce nesting

### Testing

- **Test behavior, not implementation**
- **No complex mocks** - Simple fakes only
- **100% coverage for pure functions**
- **Use existing test patterns**

Example test structure:

```typescript
describe('scrubEmail', () => {
  it('should scrub email addresses', () => {
    expect(scrubEmail('john.doe@example.com')).toBe('joh...@example.com');
  });

  it('should handle short emails', () => {
    expect(scrubEmail('ab@example.com')).toBe('ab@example.com');
  });
});
```

### Error Handling

- **Use ErrorHandler class** for consistency
- **No sensitive data in errors**
- **User-friendly messages**
- **Log internal details only**

## Architecture Guidelines

### The Generation-First Principle

This repository is fundamentally about **code generation from OpenAPI schemas**.

**DO**:

- ✅ Add new features by extending the OpenAPI schema (upstream)
- ✅ Improve generation scripts in `packages/sdks/oak-curriculum-sdk/type-gen/`
- ✅ Import types and validators from the generated SDK
- ✅ Test that `pnpm type-gen` updates everything correctly
- ✅ Use shared validation helpers (`parseSchema`, `parseWithCurriculumSchema`, etc.)

**DON'T**:

- ❌ Manually define API types or response shapes
- ❌ Create custom validators for API data
- ❌ Hand-write MCP tool definitions
- ❌ Use type assertions (`as`) or `any` types
- ❌ Duplicate schema knowledge across workspaces
- ❌ Edit files in `src/types/generated/` directories
- ❌ Re-validate or re-parse in runtime code (use generated helpers)
- ❌ Widen types or add fallbacks for "missing" descriptors

> **Critical**: Read [Schema-First Execution Directive](../.agent/directives-and-memory/schema-first-execution.md) before working on MCP tool execution, argument validation, or response handling. All runtime behavior must flow from generated artifacts.

### Layer Boundaries

The architecture flows in one direction: **OpenAPI → Generation → Runtime**

1. **OpenAPI Schema** (single source of truth, external)
   - Hosted by API provider (e.g., Oak Curriculum API)
   - Defines all endpoints, parameters, responses
   - Changed by API maintainers, not us

2. **SDK Generation** (`type-gen/` scripts)
   - Fetches OpenAPI schema at build time
   - Generates TypeScript types, Zod schemas, MCP tools
   - Outputs to `src/types/generated/` (DO NOT EDIT)
   - Transforms schema → code

3. **Generated Artifacts** (`src/types/generated/`, `src/tool-generation/`)
   - TypeScript types, Zod validators, MCP tool metadata
   - Committed to repository for review and CI
   - **DO NOT EDIT MANUALLY** - changes will be overwritten
   - Import from these, never duplicate

4. **Runtime Applications** (MCP servers, search app, admin tools)
   - Import types and tools from SDK
   - Use shared validation helpers
   - Implement business logic
   - No manual API definitions

5. **Infrastructure Libraries** (`packages/libs/`)
   - Logging, configuration, storage, transport
   - Independent of API schema
   - Reusable across different SDKs

### Adding New Features

1. **Plan the work**: Update or add plan items in `.agent/plans/` (follow ACTION/REVIEW/QUALITY-GATE cadence)

2. **If API needs to change**:
   - Work with API maintainers to update the OpenAPI schema
   - After schema changes, run `pnpm type-gen`
   - Fix any TypeScript errors that appear
   - Update consuming code to use new/changed types

3. **If generation needs to improve**:
   - Modify scripts in `packages/sdks/oak-curriculum-sdk/type-gen/`
   - Run `pnpm type-gen` to regenerate
   - Verify generated output is correct
   - Update tests for generation scripts

4. **If application logic changes**:
   - Import types from SDK
   - Use shared validation helpers
   - Keep business logic pure
   - Write tests for your changes

5. **Update documentation**:
   - Update workspace READMEs
   - Add or amend ADRs for architectural changes
   - Update onboarding docs for new patterns

## Testing Your Changes

### Unit Tests

```bash
pnpm test -- scrubbing
# Runs only scrubbing tests
```

### E2E Tests (Manual)

```bash
pnpm test:e2e
# Requires valid OAK_API_KEY
```

### Test with Claude

```bash
pnpm build
pnpm dev
# In another terminal:
claude mcp add test-notion -- node dist/index.js
```

## Common Issues

### Build Fails

- Check Node.js version (22+)
- Clear node_modules: `rm -rf node_modules && pnpm install`

### Type Errors

- Never use `any` or `as`
- Use proper Notion SDK types
- Check for missing properties in mocks

### Test Failures

- Ensure mocks match Notion SDK types exactly
- Check for race conditions in async tests
- Verify environment setup

## Getting Help

- **GitHub Issues**: Search existing or create new
- **Documentation**: Check `/docs` folder

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in commit co-authorship

## Release Process

We use semantic-release for automated releases:

1. PRs merged to `main` trigger release
2. Version bumped based on commit types
3. GitHub release created automatically
4. NPM package published (when enabled)

## Security

If you find a security issue, see the [security policy](SECURITY.md).

Thank you for contributing to Oak MCP Ecosystem! 🎉
