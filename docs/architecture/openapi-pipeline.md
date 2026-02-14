# The OpenAPI-First Pipeline

## Problem Statement

Traditional API integration requires:

- Manual type definitions that duplicate API schema knowledge
- Hand-written validators that drift from the actual API
- Separate tool definitions for MCP servers
- Manual updates when APIs change
- Runtime type assertions and unsafe casts

**Result**: Type safety degrades over time, schemas drift, maintenance burden grows, and errors only appear at runtime.

## Our Solution

**Generate everything at compile time from the OpenAPI schema.**

This repository implements a pattern where a single OpenAPI specification drives all types, validators, and tooling through automated code generation.

### The Pipeline

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. OpenAPI Schema (single source of truth)                     │
│    - Hosted by API provider (e.g., Oak Curriculum API)         │
│    - Fetched during `pnpm type-gen`                            │
│    - Defines all endpoints, parameters, responses              │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. SDK Generation (compile time)                               │
│    - TypeScript types (via openapi-typescript)                 │
│    - Zod schemas (via openapi-zod-client)                      │
│    - MCP tool metadata (custom generation)                     │
│    - URL helpers (custom generation)                           │
│    - Request validators (custom generation)                    │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Generated Artifacts (committed to repository)               │
│    - src/types/generated/api-schema.ts                         │
│    - src/types/generated/zod-schemas.ts                        │
│    - src/tool-generation/mcp-tools.ts                          │
│    - src/types/generated/routing/url-helpers.ts                │
│    - All fully typed, no runtime assertions needed             │
└────────────────────┬────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Runtime Applications (import generated code)                │
│    - MCP servers import tool definitions directly              │
│    - Search app imports request validators                     │
│    - All apps import TypeScript types                          │
│    - No manual type definitions anywhere                       │
│    - No type assertions or 'any' types needed                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Key Principle

**If the OpenAPI schema changes, running `pnpm type-gen` is sufficient to update everything.**

No manual code changes are required. The SDK regenerates, types update, validators adjust, and all consuming applications automatically get the changes through their imports.

## Key Benefits

### 1. Single Source of Truth

The API schema is the **only** definition. Everything else derives from it:

- TypeScript interfaces match the schema exactly
- Zod validators enforce the same constraints
- MCP tools expose the same parameters
- Documentation reflects the actual API

There is no drift because there's only one source.

### 2. Automatic Updates

When the API changes:

```bash
pnpm type-gen  # Fetch schema, regenerate everything
pnpm build     # Type errors show what broke
```

TypeScript compilation failures immediately show what needs updating in consuming code. No surprises at runtime.

### 3. Complete Type Safety

- **No `any` types**: Everything is fully typed from the schema
- **No type assertions**: No `as` casts needed
- **No runtime validation failures**: Schema changes break at compile time
- **IntelliSense works perfectly**: IDEs understand all types

### 4. Zero Drift

Traditional approach:

```typescript
// API schema says: { name: string, age?: number }
// But someone wrote:
interface User {
  name: string;
  age: number; // Forgot the optional!
}
```

Our approach:

```typescript
// Generated from schema - always correct
import type { User } from '@oaknational/curriculum-sdk';
// TypeScript enforces what the API actually returns
```

### 5. Pattern Reusability

This pattern works for **any** OpenAPI-compliant API:

- Different API providers
- Multiple versions simultaneously
- Private and public APIs
- REST, GraphQL (with OpenAPI), or other specs

## Implementation: Oak Open Curriculum

The primary implementation uses the Oak National Academy Curriculum API:

- **OpenAPI Schema**: `https://open-api.thenational.academy/api/v0/openapi.json`
- **Generated SDK**: `@oaknational/curriculum-sdk`
- **MCP Servers**:
  - `apps/oak-curriculum-mcp-stdio` (for Claude Desktop, Cursor)
  - `apps/oak-curriculum-mcp-streamable-http` (for web clients, Vercel)
- **Applications**:
  - `apps/oak-search-cli` (hybrid search)
  - Admin tools, status pages, telemetry

### Generalisability

The pipeline is designed to be generic enough that it could
serve any OpenAPI-described API, not just the Oak curriculum
API. The planned SDK workspace decomposition (ADR-108)
formalises this by separating generic pipeline concerns from
Oak-specific configuration.

## How It Works

### Type Generation Flow

1. **Fetch OpenAPI Schema**: `type-gen/typegen.ts` fetches the remote schema
2. **Generate TypeScript Types**: Using `openapi-typescript`
3. **Generate Zod Schemas**: Using `openapi-zod-client`
4. **Generate MCP Tools**: Custom script `type-gen/mcp-toolgen.ts` creates tool metadata
5. **Generate URL Helpers**: Custom script creates canonical URL generators
6. **Commit Artifacts**: Generated code is committed for review and CI

### Runtime Consumption

MCP servers import generated tools:

```typescript
import { MCP_TOOLS, executeToolCall } from '@oaknational/curriculum-sdk';

// Tools are already defined - no manual work
for (const tool of MCP_TOOLS) {
  server.tool(tool.name, tool.inputSchema, async (args) => {
    return executeToolCall(client, tool.name, args);
  });
}
```

Applications import generated types:

```typescript
import type { LessonSummary } from '@oaknational/curriculum-sdk';
import { parseWithCurriculumSchema } from '@oaknational/curriculum-sdk';

// Types and validators already exist
const result = await parseWithCurriculumSchema(response, 'LessonSummary');
// result is fully typed, no assertions needed
```

## Extending to New APIs

To add a new OpenAPI-based API:

1. **Create SDK Package**: `packages/sdks/your-api-sdk/`
2. **Configure Type Generation**:
   - Add `type-gen/typegen.ts` to fetch the OpenAPI schema
   - Configure generation scripts for your API's structure
3. **Run Generation**: `pnpm type-gen` to create artifacts
4. **Create MCP Server**: Import generated tools from your SDK
5. **Build Applications**: Import generated types from your SDK

### Example Structure

```text
packages/sdks/your-api-sdk/
├── type-gen/
│   ├── typegen.ts           # Fetch OpenAPI schema
│   ├── mcp-toolgen.ts       # Generate MCP tools
│   └── url-helpers.ts       # Generate canonical URLs
├── src/
│   ├── types/generated/     # Generated types (DO NOT EDIT)
│   ├── tool-generation/     # Generated MCP tools (DO NOT EDIT)
│   └── client/              # Runtime client (hand-written)
└── package.json
```

## Architectural Decision Records

This pattern is formalized in several ADRs:

- **[ADR-029](./architectural-decisions/029-no-manual-api-data.md)**: No manual API data structures - everything from OpenAPI
- **[ADR-030](./architectural-decisions/030-sdk-single-source-truth.md)**: SDK as the single source of truth for API contracts
- **[ADR-031](./architectural-decisions/031-generation-time-extraction.md)**: All transformations happen at build/generation time
- **[ADR-048](./architectural-decisions/048-shared-parse-schema-helper.md)**: Shared parsing helpers pattern for validation

## Related Documentation

- [Programmatic Tool Generation](./programmatic-tool-generation.md) - Details on MCP tool generation
- [SDK Documentation](../../packages/sdks/oak-curriculum-sdk/README.md) - Runtime usage of the generated SDK
- [Development Onboarding](../development/onboarding.md) - Getting started guide

## Execution Model: Schema-First Tool Invocation

The OpenAPI pipeline doesn't stop at type generation - it extends to **runtime execution**. Every MCP tool call follows a schema-driven execution path:

### The Execution Layers

```text
1. Contract
   ↓ ToolDescriptor<TName, TClient, TArgs, TResult>

2. Definitions (GENERATED)
   ↓ MCP_TOOL_DESCRIPTORS literal map

3. Type Aliases (GENERATED)
   ↓ ToolArgsForName, ToolResultForName

4. Runtime Helpers (GENERATED)
   ↓ callTool(), callToolWithValidation()

5. Façade (AUTHORED)
   ↓ Thin wrapper, repository-specific error mapping only
```

### Key Constraints

From [Schema-First Execution Directive](.agent/directives/schema-first-execution.md):

- **No manual tool registration** - All tools come from `MCP_TOOL_DESCRIPTORS`
- **No type widening** - Runtime code never returns `unknown` or widens unions
- **No manual validation** - Arguments validated by generated helpers only
- **No overrides or fallbacks** - Missing descriptors are generator bugs, fail fast

### Why This Matters

This execution model ensures that:

1. **Type safety extends to runtime** - Not just compile-time types, but runtime behavior
2. **API changes propagate automatically** - New endpoints → new tool descriptors → automatic registration
3. **Zero manual mapping** - No hand-written glue code between SDK and MCP layer
4. **Generator is the single authority** - One place to update when patterns change

### Generator-First Mindset

When behavior needs to change:

1. ✅ Update generator templates in `type-gen/typegen/mcp-tools/`
2. ✅ Run `pnpm type-gen` to regenerate
3. ❌ Never edit generated files manually
4. ❌ Never add runtime workarounds for "missing" descriptors

See [Schema-First Execution Directive](.agent/directives/schema-first-execution.md) for complete implementation requirements.

## Key Takeaway

**The OpenAPI schema is the single source of truth. Everything else is generated.**

When you see generated files marked "DO NOT EDIT", that's not a suggestion - it's the core principle. Manual edits would be overwritten on the next `pnpm type-gen` run, and would break the single-source-of-truth contract.

This discipline ensures type safety, prevents drift, and makes API changes automatic rather than manual.
