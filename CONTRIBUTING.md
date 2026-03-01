---
fitness_ceiling: 400
split_strategy: 'Extract detailed sections to docs/engineering/ or governance docs; keep contributor workflow here'
---

# Contributing to Oak Open Curriculum Ecosystem

This guide is for Oak team members contributing to the repository. If you
are an external reader, you are welcome to read, fork, and learn from the
code under the MIT licence. We are not currently accepting external
contributions (pull requests, issues, or feature requests), but this may
change — watch the repository for updates. If you find a security issue,
please follow our [security policy](SECURITY.md).

## Code of Conduct

By participating in this project, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Architecture Guidelines

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth. These foundational ADRs define the constraints you must follow when contributing — all code generation, types, and validation flow from the OpenAPI schema:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction
- [ADR-048](docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md) — Shared parsing helper pattern

See the [ADR index](docs/architecture/architectural-decisions/) for the full list.

### The Generation-First Principle

This repository is fundamentally about **code generation from OpenAPI schemas**.

**DO**:

- Add new features by extending the OpenAPI schema (upstream)
- Improve generation scripts in `packages/sdks/oak-sdk-codegen/code-generation/`
- Import types and validators from the generated SDK
- Test that `pnpm sdk-codegen` updates everything correctly
- Use shared validation helpers (`parseSchema`, `parseWithCurriculumSchema`, etc.)

**DON'T**:

- Manually define API types or response shapes
- Create custom validators for API data
- Hand-write MCP tool definitions
- Use type assertions (`as`) or `any` types
- Duplicate schema knowledge across workspaces
- Edit files in `src/types/generated/` directories
- Re-validate or re-parse in runtime code (use generated helpers)
- Widen types or add fallbacks for "missing" descriptors

> **Critical**: Read [Schema-First Execution Directive](.agent/directives/schema-first-execution.md) before working on MCP tool execution, argument validation, or response handling. All runtime behaviour must flow from generated artefacts.

### Layer Boundaries

The architecture flows in one direction: **OpenAPI -> Generation -> Runtime**

1. **OpenAPI Schema** (single source of truth, external)
2. **SDK Generation** (`code-generation/` scripts)
3. **Generated Artefacts** (`src/types/generated/`) — DO NOT EDIT
4. **Runtime Applications** (MCP servers, search app, admin tools)
5. **Core Infrastructure** (`packages/core/`)
6. **Infrastructure Libraries** (`packages/libs/`)

For practical guidance on adding new MCP tools, search indices, SDK helpers, and core packages, see the [Extension Points Guide](docs/engineering/extending.md).

---

Before making changes, start with the quick start guide:
[docs/foundation/quick-start.md](docs/foundation/quick-start.md)

### Prerequisites

1. **Node.js 24.x**
2. **pnpm**
3. Service credentials for the areas you are touching (Oak Curriculum API keys,
   Elasticsearch Serverless API keys). See workspace READMEs for details.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/oaknational/oak-open-curriculum-ecosystem.git
   cd oak-open-curriculum-ecosystem
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

   `.env` and `.env.local` are local-only, untracked files.
   Real credentials should never be added to source control.
   Keep `.env.example` as placeholders only; do not copy secrets into it.

4. Run tests to verify setup:

   ```bash
   pnpm test
   ```

### Contribution Levels

We support different contribution paths depending on your setup time and
access to services:

#### Level 1: Code-Only Contributions (0 minutes setup)

**No environment variables required!**

You can contribute immediately by:

- Fixing TypeScript errors
- Adding/improving unit tests
- Refactoring pure functions
- Updating documentation
- Reviewing pull requests
- Improving generation scripts in `code-generation/`

```bash
pnpm install
pnpm test           # All unit tests run without API keys
pnpm type-check     # Type checking works without env vars
pnpm lint:fix       # Linting works without env vars
pnpm build          # SDK and libraries build without env vars
```

#### Level 2: Integration Development (10-15 minutes setup)

**Requires: `OAK_API_KEY`** (core curriculum tools). Search functionality additionally requires `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`.

With an API key, you can:

- Run MCP servers locally (core curriculum tools work with `OAK_API_KEY` alone; search tools require Elasticsearch credentials)
- Test SDK integrations
- Run most integration tests
- Work on application features

```bash
cp .env.example .env
# Add: OAK_API_KEY=your_key_here
pnpm -C apps/oak-curriculum-mcp-stdio dev
```

Get your Oak API key from the public form:
<https://open-api.thenational.academy/docs/about-oaks-api/api-keys>

#### Level 3: Full Stack Development (1-2 hours setup)

**Requires: Multiple service credentials**

For smoke testing and search functionality (E2E tests use mocks and DI — no
real credentials needed; see [Build System](docs/engineering/build-system.md)):

- `OAK_API_KEY` — Curriculum API (root `.env`)
- `ELASTICSEARCH_URL` + `ELASTICSEARCH_API_KEY` — Search indices (root `.env`)
- `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — OAuth smoke testing (root `.env`)
- `SEARCH_API_KEY` — Search admin endpoints (`apps/oak-search-cli/.env.local`)

See [environment variables guide](docs/operations/environment-variables.md) and
workspace READMEs for detailed setup instructions.

## Development Process

For the complete development lifecycle — branching, TDD, quality gates, CI, AI review, human review, merge, and release — see the [Development Workflow](docs/engineering/workflow.md).

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
pnpm build             # Build all workspaces
pnpm type-check        # Check types
pnpm lint:fix          # Lint code (with auto-fix)
pnpm format:root       # Format code
pnpm test              # Run tests
pnpm secrets:scan:all  # Secret scan (branches + tags + full history)
```

Pre-push hook also runs the secret scan; pushes are blocked if secrets are
detected.

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

If you hit a push failure due to missing `gitleaks`, install it first:

- `brew install gitleaks` (macOS)
- `go install github.com/gitleaks/gitleaks/v8@latest` (Go)

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title

Use conventional commit format:

- `feat: add database pagination support`
- `fix: correct email scrubbing regex`

### PR Description

Include:

1. **What** — Brief description of changes
2. **Why** — Problem being solved or feature being added
3. **How** — High-level approach taken
4. **Testing** — How you tested the changes

### PR Checklist

- [ ] Tests added/updated for all changes
- [ ] All tests passing (`pnpm test`)
- [ ] Types checked (`pnpm type-check`)
- [ ] Code linted (`pnpm lint:fix`)
- [ ] Documentation updated if needed
- [ ] No `console.log` statements
- [ ] No hardcoded values
- [ ] No `any` types or type assertions

## Code Standards

### TypeScript

- **No `any` types** — Data entering the system is genuinely `unknown`; validate immediately with generated Zod schemas so it has a specific type from that point on
- **No type assertions** — No `as` casting (except `as const`)
- **Use type guards** — Functions with `is` keyword for type narrowing
- **Validate at boundaries** — Use the generated Zod schemas via the shared helpers in
  `@oaknational/curriculum-sdk` (see `parseSchema` and friends)

### ESM Module System

The monorepo is ESM-only (`"type": "module"` in all `package.json` files).

- **File extensions mandatory**: `import { x } from './helper.js'` — use `.js`
  even for `.ts` source files; TypeScript does not rewrite import specifiers
- **No CommonJS**: no `require()`, no `module.exports`
- **No `__dirname` / `__filename`**: use `import.meta.dirname` instead
- **JSON imports**: `import data from './data.json' with { type: 'json' }`
- **Vitest mock paths**: `vi.mock('./module.js')` — `.js` extension required
- **Barrel exports**: `export * from` is banned by `no-restricted-syntax`;
  always use named re-exports
- **Common error "Cannot find module"**: check for missing `.js` extension.
  Applies to ALL relative imports including barrel re-exports. `pnpm build` +
  `pnpm type-check` do NOT catch this — only E2E tests against built `dist/`
  surface the error. Run `pnpm test:e2e` before pushing.

### Workspace and Turbo

- `pnpm-workspace.yaml` must list only existing package directories — a missing directory causes confusing turbo scope errors.
- `workspace:*` not `workspace:^` — all workspaces use `workspace:*`. For private packages that will never be published to a registry, the runtime difference is zero, but consistency matters.
- Turbo cache can mask latent failures for a long time — package renames force cache misses that surface them.
- Turbo stops at first failure by default — use `--continue` to see all errors across workspaces.
- Semantic-release managed packages use `"version": "0.0.0-development"`.
- Never commit `.turbo/` cache files.
- E2E tests need explicit env in `turbo.json`: `"env": ["OAK_API_KEY"]`.
- E2E config files use prefix convention (`vitest.e2e.config.ts`) not suffix (`vitest.config.e2e.ts`) — prefix is matched by `*.config.ts` globs in tsconfig and ESLint.

### Self-Referencing Imports

Self-referencing imports within a package (e.g. `import from '@oaknational/sdk-codegen/bulk'` inside sdk-codegen itself) are a trap: TypeScript and tsup do not catch them, only runtime does. External consumers use subpath exports; internal files use relative imports.

### Commit Messages

Commitlint enforces conventional commit `subject-case`: the subject line must start with a lowercase type prefix (e.g. `fix(scope): description`). Uppercase item references like "F7 — description" are rejected.

### Functions

- **Prefer pure functions** — No side effects
- **Single responsibility** — One function, one job
- **Descriptive names** — Self-documenting code
- **Early returns** — Reduce nesting

### Testing

- **Test behaviour, not implementation**
- **No complex mocks** — Simple fakes only
- **100% coverage for pure functions**
- **Use existing test patterns**

E2E tests use mocks and dependency injection; they do not require real API
keys. Only smoke tests (`pnpm smoke:dev:stub`, `pnpm smoke:dev:live`)
require real credentials.

### Error Handling

- Use the `Result<T, E>` type from `@oaknational/result` for explicit error
  handling without exceptions
- Fail fast with helpful error messages — never silently
- No sensitive data in error messages

## Testing Your Changes

### Unit Tests

```bash
pnpm test -- scrubbing
# Runs only scrubbing tests
```

### E2E Tests

```bash
pnpm test:e2e
# Uses mocks and DI — no real API keys required
```

### Test with Claude

```bash
pnpm build
pnpm -C apps/oak-curriculum-mcp-stdio dev
# In another terminal, add the MCP server to Claude Desktop
```

## Common Issues

### Build Fails

- Check Node.js version (24.x required)
- Clear node_modules: `rm -rf node_modules && pnpm install`

### Type Errors

- Never use `any` or `as`
- Use generated SDK types, not manual definitions
- Check for missing properties in test fakes

### Test Failures

- Ensure test fakes match SDK types exactly
- Check for race conditions in async tests
- Verify environment setup

## Release Process

We use semantic-release for automated releases:

1. PRs merged to `main` trigger release
2. Version bumped based on commit types
3. GitHub release created automatically
4. npm package published for public packages

## Security

If you find a security issue, see the [security policy](SECURITY.md).
