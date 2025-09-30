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

### Layer Boundaries

1. **SDK generation** – All curriculum data flows from the OpenAPI contract. Never hand-write schemas or types.
2. **Validation layer** – Use the shared helpers exported from `packages/sdks/oak-curriculum-sdk/src/validation` (`parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, `parseSearchResponse`).
3. **Application layer** – MCP servers, Semantic Search routes, and admin tools import the SDK helpers and keep business logic pure.
4. **Infrastructure** – Logging, configuration, storage, and transport live in `packages/libs/`.

### Adding New Features

1. Update or add plan items in the relevant `.agent/plans/` document (remember ACTION/REVIEW/QUALITY-GATE cadence).
2. Regenerate SDK artefacts with `pnpm type-gen` if the API schema changes.
3. Extend the shared validation helpers instead of duplicating `safeParse` calls.
4. Update the workspace README + onboarding docs so contributors know how to run or test the new behaviour.
5. Add or amend ADRs when introducing new architectural rules (e.g. shared parsing, ingestion flow changes).

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
