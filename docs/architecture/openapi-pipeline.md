# The OpenAPI-First Pipeline

**Last Updated**: 2026-02-25  
**Status**: Active architecture reference

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
│    - Fetched during `pnpm sdk-codegen`                           │
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

**If the OpenAPI schema changes, running `pnpm sdk-codegen` is sufficient to update everything.**

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
pnpm sdk-codegen  # Fetch schema, regenerate everything
pnpm build        # Type errors show what broke
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

1. **Fetch OpenAPI Schema**: `code-generation/codegen.ts` fetches the remote schema
2. **Generate TypeScript Types**: Using `openapi-typescript`
3. **Generate Zod Schemas**: Using `openapi-zod-client`
4. **Generate MCP Tools**: Custom script `code-generation/mcp-toolgen.ts` creates tool metadata
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
   - Add `code-generation/codegen.ts` to fetch the OpenAPI schema
   - Configure generation scripts for your API's structure
3. **Run Generation**: `pnpm sdk-codegen` to create artifacts
4. **Create MCP Server**: Import generated tools from your SDK
5. **Build Applications**: Import generated types from your SDK

### Example Structure

```text
packages/sdks/your-api-sdk/
├── code-generation/
│   ├── codegen.ts           # Fetch OpenAPI schema
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
- [Quick Start Guide](../foundation/quick-start.md) - Getting started guide

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

From [Schema-First Execution Directive](../../.agent/directives/schema-first-execution.md):

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

1. ✅ Update generator templates in `code-generation/typegen/mcp-tools/`
2. ✅ Run `pnpm sdk-codegen` to regenerate
3. ❌ Never edit generated files manually
4. ❌ Never add runtime workarounds for "missing" descriptors

See [Schema-First Execution Directive](../../.agent/directives/schema-first-execution.md) for complete implementation requirements.

## Known Constraints and Limitations

### Zod v3-to-v4 Transformation Edge Cases

The current pipeline uses `openapi-zod-client` to generate Zod schemas, then
transforms them from v3 to v4 via an adapter
(`packages/core/openapi-zod-client-adapter`). Two edge cases are known:

- **`.strict().and(.strict())` intersection failure**: When `strictObjects: true`
  is enabled, `openapi-zod-client` generates `.strict().and(.strict())` for
  OpenAPI `allOf` schemas. Each `.strict()` rejects the other side's properties,
  making intersections impossible to validate. This is fixed via a two-pass regex
  in `zod-v3-to-v4-transform.ts`.
- **Regex replacement gotcha**: The `.and($1$2)` replacement capture groups can
  produce double parentheses if `$2` captures the closing `)`. Test assertions
  must be scoped carefully to avoid false positives.

### Adapter Rebuild Requirement

The adapter package must be built (`pnpm build`) before `pnpm sdk-codegen` picks
up changes. The SDK consumes the adapter's built output, not its source. If you
modify the adapter and run `pnpm sdk-codegen` without rebuilding first, the old
transformation logic will be used. Turbo's dependency graph handles this when
using `pnpm make`, but manual `pnpm sdk-codegen` invocations may miss it.

### CI and Offline Mode

CI sdk-codegen requires a cached SDK schema. If the cached schema is missing, the
pipeline throws an error directing you to run `pnpm sdk-codegen` locally first to
populate the cache. This constraint exists because CI environments may not have
network access to the upstream OpenAPI endpoint.

### Parameter Generation Edge Cases

If an API parameter has no concrete enum values, no constant or type guard is
emitted — open-ended parameters are handled as open sets. This means some
parameters will not have compile-time-validated values and must be validated
at the application layer.

### Runtime Type Inference Limitation

Tool descriptor resolution is dynamic at runtime, so TypeScript cannot
statically infer the output type from a descriptor name. A single controlled
cast in `emit-index.ts` bridges the gap between the runtime-selected schema
and the static type. This is a structural limitation, not a workaround.

### Schema Validation Requirements

The canonical URL decoration requires `components.schemas` to be an object in
the OpenAPI specification. Not all minimal OpenAPI 3 structures meet this
requirement. If the upstream schema changes structure significantly, the
`schema-validator.ts` checks will surface this early.

### ADR-Documented Negative Consequences

The architectural decisions that define this pipeline have documented trade-offs:

- SDK dependency creates a build bottleneck — all workspaces depend on the SDK
  build completing first
  ([ADR-029](./architectural-decisions/029-no-manual-api-data.md))
- Single source of truth creates coupling — changes to the SDK ripple through
  all consumers
  ([ADR-030](./architectural-decisions/030-sdk-single-source-truth.md))
- Generation-time extraction increases build complexity and output file size
  ([ADR-031](./architectural-decisions/031-generation-time-extraction.md))

### Planned Migration: Castr

The current `openapi-zod-client` + adapter pipeline is planned for replacement
by Castr, which will produce Zod v4 output directly, eliminating the
transformation layer entirely. Prerequisites: SDK workspace separation (in
progress), side-by-side validation, then adapter removal. See
[ADR-055](./architectural-decisions/055-zod-version-boundaries.md),
[ADR-108](./architectural-decisions/108-sdk-workspace-decomposition.md), and
the [Castr plan](../../.agent/plans/external/castr/README.md).

## Key Takeaway

**The OpenAPI schema is the single source of truth. Everything else is generated.**

When you see generated files marked "DO NOT EDIT", that's not a suggestion - it's the core principle. Manual edits would be overwritten on the next `pnpm sdk-codegen` run, and would break the single-source-of-truth contract.

This discipline ensures type safety, prevents drift, and makes API changes automatic rather than manual.
