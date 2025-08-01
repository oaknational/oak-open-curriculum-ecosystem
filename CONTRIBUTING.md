# Contributing to Oak Notion MCP

Thank you for your interest in contributing to the Oak Notion MCP Server! This guide will help you get started.

This is an internal technical spike for now, so at this time we are not looking for external contributions, but we do appreciate your interest.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

1. **Node.js 22+** - Required for ESM support
2. **pnpm** - Package manager (will be installed automatically)
3. **Notion Account** - For testing
4. **Notion API Key** - From a test integration

### Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/yourusername/oak-notion-mcp.git
   cd oak-notion-mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment:

   ```bash
   cp .env.example .env
   # Add your Notion API key to .env
   ```

4. Run tests to verify setup:

   ```bash
   pnpm test
   ```

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
- **Validate inputs** - Use Zod at all boundaries

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

### Layer Boundaries

1. **MCP Protocol Layer** - Handles requests/responses
2. **Business Logic** - Pure functions only
3. **Notion Adapter** - Wraps SDK calls
4. **Infrastructure** - Logging, config, errors

### Adding New Features

1. **Resources**: Add to `src/mcp/resources/handlers.ts`
2. **Tools**: Add to `src/mcp/tools/handlers.ts`
3. **Transformers**: Add to `src/notion/transformers.ts`
4. **Validation**: Add Zod schemas to relevant files

## Testing Your Changes

### Unit Tests

```bash
pnpm test -- scrubbing
# Runs only scrubbing tests
```

### E2E Tests (Manual)

```bash
pnpm test:e2e
# Requires valid NOTION_API_KEY
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

If you find a security issue:

1. **DO NOT** create a public issue
2. Email security contact (TBD)
3. Include details and reproduction steps
4. Wait for response before disclosure

Thank you for contributing to Oak Notion MCP! 🎉
