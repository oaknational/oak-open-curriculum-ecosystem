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

3. Set up environment (skip for Level 1 contributions — no env vars needed):

   ```bash
   cp .env.example .env
   # Populate OAK_API_KEY (see below for which variables go where)
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

**Requires**: `OAK_API_KEY`, `ELASTICSEARCH_URL`, and
`ELASTICSEARCH_API_KEY` for the canonical HTTP MCP server workspace.

With an API key, you can:

- Run the canonical HTTP MCP server locally
- Test SDK integrations
- Run most integration tests
- Work on application features

```bash
cp .env.example .env
# Add:
# OAK_API_KEY=your_key_here
# ELASTICSEARCH_URL=https://your-es-endpoint
# ELASTICSEARCH_API_KEY=your_es_api_key
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
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

- **British English** — Use British spelling, grammar, and date formats
  throughout documentation, comments, commit messages, and PR descriptions.
- **Commit messages** — Commitlint enforces conventional commit `subject-case`:
  the subject line must start with a lowercase type prefix (e.g.
  `fix(scope): description`).

For full TypeScript, ESM, testing, and error handling standards, see:

- [TypeScript Practice](docs/governance/typescript-practice.md) — type safety,
  no `any`, no assertions, validation at boundaries
- [Development Practice](docs/governance/development-practice.md) — functions,
  testing, error handling, ESM conventions
- [Testing Strategy](.agent/directives/testing-strategy.md) — TDD approach at
  all levels

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
pnpm -C apps/oak-curriculum-mcp-streamable-http dev
# In another terminal, add the MCP server to Claude Desktop
```

## Common Issues

See the [Troubleshooting Guide](docs/operations/troubleshooting.md) for
detailed solutions. Quick fixes:

- **Build fails** — check Node.js version (24.x required); clear with
  `rm -rf node_modules && pnpm install`
- **Type errors** — use generated SDK types, not manual definitions; no `any`
  or `as`
- **Test failures** — ensure test fakes match SDK types exactly

## Release Process

Semantic-release handles automated releases: PRs merged to `main` trigger
version bumps, GitHub releases, and npm publishing based on commit types.

## Security

If you find a security issue, see the [security policy](SECURITY.md).
