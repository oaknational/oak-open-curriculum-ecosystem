# Quick Start Guide

Fast-track guide for developers who want to understand and contribute to infrastructure for Oak's openly-licensed curriculum — SDKs, MCP servers, and semantic search.

> **New here?** This guide gets you running quickly. For comprehensive details, see the [architecture overview](architecture/openapi-pipeline.md) and [onboarding guide](development/onboarding.md).
>
> **Audience**: junior-to-mid-level human developers.
>
> **AI agents**: start with the `start-right` workflow first (command, prompt, or skill), then continue with [AGENT.md](../.agent/directives/AGENT.md) and [AI Agent Guide](agent-guidance/ai-agent-guide.md).

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](architecture/architectural-decisions/), then this foundational set:

- [ADR-029](architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-048](architecture/architectural-decisions/048-shared-parse-schema-helper.md) - Shared parsing helper pattern

## Working with AI Agents

AI agents working with this codebase should read [AGENT.md](../.agent/directives/AGENT.md) as their canonical entry point. It links to rules, testing strategy, and schema-first directives.

See the [AI Agent Guide](agent-guidance/ai-agent-guide.md) for workflow patterns and task management advice.

## Architecture TL;DR

This repository makes Oak's openly-licensed curriculum accessible to AI agents and searchable for teachers. The architectural foundation is a type-safe, compile-time pipeline:

```text
OpenAPI Spec (single source of truth)
         ↓
    pnpm type-gen (compile time)
         ↓
    ┌───────────────────────────────────────────────┐
    ↓                    ↓                           ↓
TypeScript SDK      MCP Tools             Search Type Generators
(types, clients,  (metadata, validators,  (ES mappings, index docs,
 Zod schemas)      input/output shapes)    search constants)
    ↓                    ↓                           ↓
Runtime Apps        MCP Servers            Semantic Search
(admin, CLI)      (stdio, HTTP)           (4-way RRF hybrid)
```

**Key Insight**: The OpenAPI schema is the only definition. Everything else is generated. If the API changes, `pnpm type-gen` updates everything automatically.

## ADR Start Here

Use progressive disclosure:

1. First pass: read the foundational ADRs listed at the top of this guide.
2. Domain handoff: read ADRs for your area only (SDK generation, search, or MCP runtime/auth).
3. Task-time deep dive: read additional ADRs only when your task changes behaviour or architecture in that area.

## Zero-Setup Quick Start (0 minutes)

Oak team contributors can start immediately without any API keys:

```bash
# Clone and install
git clone <repo> && cd oak-mcp-ecosystem
pnpm install

# Run tests and quality checks (no env vars required)
pnpm test           # All unit tests
pnpm type-check     # Type checking
pnpm lint:fix       # Linting (with auto-fix)
pnpm build          # Build SDK and libraries
```

This is perfect for:

- Adding or improving unit tests
- Fixing TypeScript errors
- Refactoring pure functions
- Updating documentation
- Reviewing pull requests

## Full Development Setup (10-15 minutes)

To run dev servers and integration tests, you need the Oak API key:

```bash
# 1. Configure environment
cp .env.example .env
# Edit .env and set: OAK_API_KEY=your_key_here

# Local `.env` and `.env.local` files are ignored by git.
# Keep secrets in local files only, and keep `.env.example` placeholder-only.

# 2. Run full quality gates
pnpm make    # Full pipeline (install → build/type-gen → type-check → doc-gen → lint:fix → subagents:check → markdownlint:root → format:root)
pnpm qg      # Full verification (format-check:root + markdownlint-check:root + subagents:check + UI/E2E/smoke suites)

# 3. Start an MCP dev server (choose one)
pnpm -C apps/oak-curriculum-mcp-stdio dev              # Stdio MCP server
pnpm -C apps/oak-curriculum-mcp-streamable-http dev   # HTTP MCP server

# Search workflows are command-driven (no long-running `dev` script).
# See apps/oak-search-cli/README.md for search setup and CLI commands.
```

See [environment variables guide](development/environment-variables.md) for complete setup details.

For current known `pnpm qg` local caveats, see
[Developer Onboarding → Known Gate Caveats](development/onboarding.md#known-gate-caveats).

## Key Concepts

### Curriculum Data Variances

The Oak curriculum data has significant differences across subjects and key stages. Before working on search or data:

- **[Data Variances](data/DATA-VARIANCES.md)** — Essential reading for understanding data shapes
- **Transcript availability**: MFL (French, Spanish, German) has 0%; most subjects have 100%
- **KS4 complexity**: Tiers, exam boards, pathways don't exist in KS1-3
- **Categories**: Only English, Science, RE have categories
- **Structural patterns**: 6 API traversal patterns that can combine

### OpenAPI-First Pipeline

Everything flows from the OpenAPI specification:

1. **Source**: API provider hosts OpenAPI schema (e.g., Oak Curriculum API)
2. **Generation**: `pnpm type-gen` fetches schema and generates TypeScript, Zod, MCP tools
3. **Consumption**: Apps import the generated types and tools - no manual definitions
4. **Updates**: API changes? Run `pnpm type-gen` - everything updates automatically

### Type Generation is Critical

The `pnpm type-gen` command is the heart of the system:

```bash
pnpm type-gen
```

This command:

- Fetches the latest OpenAPI schema
- Generates TypeScript types
- Creates Zod validators
- Builds MCP tool definitions
- Generates URL helpers
- Updates all consuming code

**The Cardinal Rule**: If the API schema changes, `pnpm type-gen` is sufficient. No manual code changes required.

### The Execution Model

The pipeline doesn't stop at types - it extends to **runtime execution**:

1. **Generated Tool Descriptors** - Each OpenAPI endpoint becomes an MCP tool descriptor
2. **Generated Validators** - Zod schemas validate inputs and outputs
3. **Generated Execution Helpers** - Type-safe tool invocation with automatic validation
4. **Authored Façade** - Thin wrapper that calls generated helpers (no logic duplication)

Example: When you see MCP servers "registering tools", they're importing `MCP_TOOL_DESCRIPTORS` from the generated SDK. There's no manual tool registration code - it's all derived from the OpenAPI schema.

**Key constraint**: Runtime code never re-validates, never widens types, and never works around "missing" descriptors. If a descriptor is missing, that's a generator bug - fail fast.

See [Architecture: OpenAPI Pipeline](architecture/openapi-pipeline.md#execution-model-schema-first-tool-invocation) for the complete execution flow.

### No Manual Type Definitions

You will **never** see code like this in this repository:

```typescript
// ❌ WRONG - manually defining API types
interface LessonSummary {
  id: string;
  title: string;
  // ...
}
```

Instead, types are imported from the generated SDK:

```typescript
// ✅ CORRECT - imported from generated SDK
import type { LessonSummary } from '@oaknational/curriculum-sdk';
```

This ensures types always match the API schema exactly.

### Generated Files Are Read-Only

When you see files marked `DO NOT EDIT MANUALLY` or in `src/types/generated/` directories, this is not a suggestion:

- These files are regenerated on every `pnpm type-gen` run
- Manual edits would be overwritten
- Changes must happen in the generation scripts or upstream OpenAPI schema

**This extends to runtime behavior**: Not just types, but MCP tool descriptors, validators, and execution helpers are all generated. Runtime code is a thin façade that calls generated helpers - it never re-implements validation or widens types.

See [Schema-First Execution Directive](../.agent/directives/schema-first-execution.md) for implementation requirements.

## Development Workflows

### Adding a Feature (General Pattern)

```bash
# 1. Make sure types are up to date
pnpm type-gen

# 2. Write a test first (TDD)
# Create test in appropriate *.unit.test.ts or *.integration.test.ts

# 3. Implement the feature
# Use generated types from the SDK

# 4. Run quality gates
pnpm test          # Does it pass?
pnpm type-check    # Any type errors?
pnpm lint:fix      # Follows code style?

# 5. Commit with conventional format
git commit -m "feat: add amazing feature"
```

### Updating After API Changes

```bash
# 1. Regenerate from updated schema
pnpm type-gen

# 2. Fix any type errors
pnpm type-check
# TypeScript will show exactly what changed

# 3. Update consuming code
# Fix the errors TypeScript found

# 4. Verify everything works
pnpm build
pnpm test
```

### Working on Generation Scripts

```bash
# 1. Make changes to generation scripts
# Edit files in packages/sdks/oak-curriculum-sdk/type-gen/

# 2. Regenerate
pnpm type-gen

# 3. Review generated output
# Check src/types/generated/ for expected changes

# 4. Test the generated code
pnpm build
pnpm test
```

## Common Tasks

### Run All Quality Gates

```bash
pnpm make    # Build everything from scratch
pnpm qg      # Run all quality checks (including UI/E2E/smoke suites)
```

If `pnpm qg` fails locally, check
[Developer Onboarding → Known Gate Caveats](development/onboarding.md#known-gate-caveats)
before assuming setup issues.

### Test a Specific Workspace

```bash
pnpm --filter @oaknational/curriculum-sdk test
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

### Debug Type Generation

```bash
# Run with verbose logging
LOG_LEVEL=debug pnpm type-gen

# Check the generated output
cat packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema.ts | head -100
```

### Update Documentation

```bash
# Generate TypeDoc and API docs
pnpm doc-gen

# Preview documentation
open packages/sdks/oak-curriculum-sdk/docs/index.html
```

## Repository Structure

```text
oak-mcp-ecosystem/
├── packages/
│   ├── sdks/
│   │   └── oak-curriculum-sdk/      # Generated SDK (THE SOURCE)
│   │       ├── type-gen/             # Generation scripts
│   │       └── src/
│   │           ├── types/generated/  # Generated types (DO NOT EDIT)
│   │           └── tool-generation/  # Generated MCP tools (DO NOT EDIT)
│   └── libs/                         # Shared libraries (logger, storage, etc.)
├── apps/
│   ├── oak-curriculum-mcp-stdio/     # MCP server for Claude Desktop
│   ├── oak-curriculum-mcp-streamable-http/  # MCP server for web
│   └── oak-search-cli/ # Search application
└── docs/
    ├── architecture/                 # Architecture decisions
    └── development/                  # Development guides
```

## Type Safety Rules

This repository enforces strict type safety:

- **Never use `any`** — Data entering the system is genuinely `unknown`; immediately validate it using the generated Zod schemas from the SDK. After validation, you have exact types; never widen them back.
- **Never use `as`** — No type assertions (except `as const`, which is a data-structure annotation, not a type assertion)
- **Always validate** — Use Zod schemas from the SDK at all boundaries
- **Use type guards** - Functions with `is` keyword for type narrowing
- **Import from SDK** - Never manually define API types

## Testing Strategy

```typescript
// Unit test (pure function) - *.unit.test.ts
test('extractSlug removes domain and path', () => {
  expect(extractSlug('/lessons/add-two-numbers')).toBe('add-two-numbers');
});

// Integration test (with SDK) - *.integration.test.ts
test('MCP server lists all generated tools', async () => {
  const response = await server.request({ method: 'tools/list' });
  expect(response.tools).toHaveLength(MCP_TOOLS.length);
});
```

## Getting Help

### Documentation

1. **Architecture**: [OpenAPI Pipeline](architecture/openapi-pipeline.md)
2. **Curriculum Data**: [Data Variances](data/DATA-VARIANCES.md)
3. **Setup**: [Environment Variables](development/environment-variables.md)
4. **Onboarding**: [Developer Onboarding](development/onboarding.md)
5. **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

### Troubleshooting

- **Build fails**: Run `pnpm type-gen` to ensure types are current
- **Type errors**: Generated types changed? Update your imports
- **Tests fail**: Check if integration tests need `OAK_API_KEY`
- **Linting errors**: Run `pnpm lint:fix` to auto-fix

### Community

- **Issues**: [GitHub Issues](https://github.com/oaknational/oak-mcp-ecosystem/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oaknational/oak-mcp-ecosystem/discussions)

## Next Steps

1. **Understand the architecture**: Read [OpenAPI Pipeline](architecture/openapi-pipeline.md)
2. **Set up your environment**: Follow [Environment Variables](development/environment-variables.md)
3. **Read the contribution guide**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
4. **Pick your task source**: Oak team members should use active plans and roadmap docs in `.agent/plans/`; external readers can explore architecture docs and published packages.
5. **Start coding**: Follow the TDD workflow above (for internal contributors)

Ready? Let's build type-safe, schema-driven APIs.
