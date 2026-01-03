# Quick Start Guide

Fast-track guide for developers who want to understand and contribute to the OpenAPI→SDK→MCP pipeline.

> **New here?** This guide gets you running quickly. For comprehensive details, see the [architecture overview](architecture/openapi-pipeline.md) and [onboarding guide](development/onboarding.md).

## 🤖 Working with AI Agents

When assigning tasks to AI agents, always include:

```text
"[Task description]. Read GO.md and follow all instructions"
```

This ensures the agent maintains focus, quality, and regular grounding. See [AI Agent Guide](agent-guidance/ai-agent-guide.md) for details.

## Architecture TL;DR

This repository implements a type-safe, compile-time pipeline:

```text
OpenAPI Spec (single source of truth)
         ↓
    pnpm type-gen (compile time)
         ↓
    ┌────────────────────────────────┐
    ↓                                ↓
TypeScript SDK                  MCP Tools
(types, clients,              (metadata, validators,
 Zod schemas)                  input/output shapes)
    ↓                                ↓
Runtime Apps                   MCP Servers
(search, admin)              (stdio, HTTP)
```

**Key Insight**: The OpenAPI schema is the only definition. Everything else is generated. If the API changes, `pnpm type-gen` updates everything automatically.

## Zero-Setup Quick Start (0 minutes)

You can start contributing immediately without any API keys:

```bash
# Clone and install
git clone <repo> && cd oak-notion-mcp
pnpm install

# Run tests and quality checks (no env vars required)
pnpm test           # All unit tests
pnpm type-check     # Type checking
pnpm lint           # Linting
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

# 2. Run full quality gates
pnpm make    # install → type-gen → build → docs → lint → format
pnpm qg      # All quality gates

# 3. Start a dev server (choose one)
pnpm -C apps/oak-curriculum-mcp-stdio dev              # Stdio MCP server
pnpm -C apps/oak-curriculum-mcp-streamable-http dev   # HTTP MCP server
pnpm -C apps/oak-open-curriculum-semantic-search dev  # Search application
```

See [environment variables guide](development/environment-variables.md) for complete setup details.

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
import type { LessonSummary } from '@oaknational/oak-curriculum-sdk';
```

This ensures types always match the API schema exactly.

### Generated Files Are Read-Only

When you see files marked `DO NOT EDIT MANUALLY` or in `src/types/generated/` directories, this is not a suggestion:

- These files are regenerated on every `pnpm type-gen` run
- Manual edits would be overwritten
- Changes must happen in the generation scripts or upstream OpenAPI schema

**This extends to runtime behavior**: Not just types, but MCP tool descriptors, validators, and execution helpers are all generated. Runtime code is a thin façade that calls generated helpers - it never re-implements validation or widens types.

See [Schema-First Execution Directive](../.agent/directives-and-memory/schema-first-execution.md) for implementation requirements.

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
pnpm lint          # Follows code style?

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
pnpm qg      # Run all quality checks
```

### Test a Specific Workspace

```bash
pnpm --filter @oaknational/oak-curriculum-sdk test
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
oak-notion-mcp/
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
│   ├── oak-open-curriculum-semantic-search/ # Search application
│   └── oak-notion-mcp/               # Architectural reference
└── docs/
    ├── architecture/                 # Architecture decisions
    └── development/                  # Development guides
```

## Type Safety Rules

This repository enforces strict type safety:

- **Never use `any`** - Use `unknown` at boundaries, then validate
- **Never use `as`** - No type assertions (except `as const` for literals)
- **Always validate** - Use Zod schemas from the SDK at all boundaries
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
- **Linting errors**: Run `pnpm lint -- --fix` to auto-fix

### Community

- **Issues**: [GitHub Issues](https://github.com/oaknational/oak-mcp-ecosystem/issues)
- **Discussions**: [GitHub Discussions](https://github.com/oaknational/oak-mcp-ecosystem/discussions)

## Next Steps

1. **Understand the architecture**: Read [OpenAPI Pipeline](architecture/openapi-pipeline.md)
2. **Set up your environment**: Follow [Environment Variables](development/environment-variables.md)
3. **Read the contribution guide**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
4. **Pick an issue**: Browse [good first issues](https://github.com/oaknational/oak-mcp-ecosystem/labels/good%20first%20issue)
5. **Start coding**: Follow the TDD workflow above

Ready? Let's build type-safe, schema-driven APIs! 🚀
