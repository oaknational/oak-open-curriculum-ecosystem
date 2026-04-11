# ADR-055: Zod Version Boundaries

**Status**: Accepted (Revised)  
**Date**: 2025-11-28 (Revised)  
**Decision Makers**: Development Team

## Context

The Oak Open Curriculum ecosystem involves three layers that use Zod for runtime validation:

1. **Oak Curriculum SDK** (`@oaknational/curriculum-sdk`) - Generates types from the upstream OpenAPI schema
2. **MCP SDK** (`@modelcontextprotocol/sdk`) - Provides MCP protocol implementation
3. **Apps** (e.g., `oak-curriculum-mcp-streamable-http`) - Consume both SDKs

Each layer has different Zod version requirements:

- The Oak Curriculum SDK uses **Zod v3** internally because `openapi-zod-client` (used for schema generation) requires Zod v3
- The MCP SDK internally uses **Zod v4**
- Apps use **Zod v4** for modern features and MCP SDK compatibility

## Problem Statement

How do we manage Zod version differences across SDK and app layers while:

1. Maintaining schema-first type generation from OpenAPI (requires Zod v3 for `openapi-zod-client`)
2. Exporting Zod schemas from the SDK for consumer use
3. Ensuring apps receive Zod v4 schemas compatible with MCP SDK
4. Avoiding type conflicts or runtime errors from version mismatches
5. Following schema-first principles (all type information flows from the generator)

## Decision

**The SDK encapsulates `openapi-zod-client` in an adapter and exports only Zod v4 schemas to consumers.**

### Key Insight: Single Source of Zod v3

**`openapi-zod-client` is the ONLY source of Zod v3 artefacts in the entire project.**

This upstream library reads the OpenAPI schema and produces Zod v3 schemas. We encapsulate it in an adapter that:

1. Consumes the Zod v3 output from `openapi-zod-client`
2. Converts everything to Zod v4 using `zod/v4` (available in Zod 3.25+)
3. Ensures Zod v3 artefacts **NEVER escape the adapter boundary**

```text
┌─────────────────────────────────────────────────────────────────┐
│                    openapi-zod-client Adapter                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  openapi-zod-client (Zod v3)                            │    │
│  │  - Reads OpenAPI spec                                   │    │
│  │  - Produces Zod v3 schemas                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Conversion Layer                                       │    │
│  │  - Converts Zod v3 → Zod v4                             │    │
│  │  - Zod v3 NEVER escapes this boundary                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  SDK Public API (Zod v4 ONLY) │
              └───────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  Apps (Zod v4)                │
              └───────────────────────────────┘
```

### Adapter Interface (Future Replacement)

The adapter's public interface defines what our project requires from `openapi-zod-client` or any replacement:

```typescript
interface OpenApiZodAdapter {
  generateToolSchemas(operation: OpenApiOperation): {
    flatInputSchema: z4.ZodObject<z4.ZodRawShape>; // MCP registration
    nestedInputSchema: z4.ZodObject<z4.ZodRawShape>; // SDK invoke
    outputSchema: z4.ZodType; // Response validation
  };
}
```

If we ever replace `openapi-zod-client` (and `openapi3-ts`), the replacement must satisfy this interface. Castr (`@engraph/castr`) is the planned replacement for both libraries — see [ADR-108](108-sdk-workspace-decomposition.md). The adapter can remain in place initially while Castr output is validated side-by-side.

### Boundary Rules

| Layer              | Internal Zod | Exports                                              | Imports                              |
| ------------------ | ------------ | ---------------------------------------------------- | ------------------------------------ |
| Oak Curriculum SDK | v3 + v4      | Zod v4 schemas, TypeScript types, constants, helpers | `openapi-zod-client` output (Zod v3) |
| MCP SDK            | v4           | MCP types, `registerPrompt()`, `registerTool()`      | Compatible with Zod v4               |
| Apps               | v4           | N/A                                                  | SDK Zod v4 schemas, MCP SDK, Zod v4  |

### Key Principle

**The SDK exports Zod v4 schemas and raw shapes, generated at code-generation time.**

The SDK exports:

- ✅ **Zod v4 raw shapes and schemas** for tool inputs (`inputSchema` on authored
  universal-tool entries, `toolMcpFlatInputSchema` on generated descriptors)
- ✅ **Zod v4 schemas** for response validation (`zodOutputSchema`)
- ✅ TypeScript types (derived from Zod schemas)
- ✅ Constants (KEY_STAGES, SUBJECTS, etc.)
- ✅ Type guard functions (pure functions)
- ✅ Metadata objects (MCP_PROMPTS, MCP_TOOL_DESCRIPTORS)

The SDK does NOT export:

- ❌ Zod v3 schemas (internal implementation detail)
- ❌ Raw `openapi-zod-client` output (internal)

### How Zod v4 Export Works

The SDK's `package.json` specifies `"zod": "^3"` (specifically v3.25+), which includes both APIs:

```typescript
// Internal: Zod v3 for openapi-zod-client generated code
import { z as z3 } from 'zod';

// Export: Zod v4 for consumers
import { z as z4 } from 'zod/v4';
```

At code-generation time, the generator:

1. Produces Zod v3 schemas from `openapi-zod-client`
2. Generates equivalent Zod v4 schemas using `zod/v4`
3. Exports only the Zod v4 versions in the public API

### MCP Registration Pattern

Apps import Zod v4 raw shapes and schemas directly from the SDK:

```typescript
// app/src/handlers.ts
import {
  listUniversalTools,
  generatedToolRegistry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

for (const tool of listUniversalTools(generatedToolRegistry)) {
  // tool.inputSchema is a Zod v4 ZodRawShape
  server.registerTool(
    tool.name,
    {
      inputSchema: tool.inputSchema, // Zod v4 raw shape, compatible with MCP SDK
      description: tool.description,
    },
    handler,
  );
}
```

## Rationale

### Why SDK Generates with Zod v3

The `openapi-zod-client` generator, which creates Zod schemas from the OpenAPI specification, requires Zod v3. This is an upstream dependency we cannot change.

### Why SDK Exports Zod v4

- MCP SDK's `registerTool()` and `registerPrompt()` work best with Zod v4
- Apps should not need to recreate schemas manually (violates schema-first)
- Zod 3.25+ provides `zod/v4` making this conversion straightforward
- Eliminates duplication between SDK metadata and app-local schemas

### Why This Is Not a Compatibility Layer

From `principles.md`:

> "NEVER create compatibility layers - replace old approaches with new approaches"

This is NOT a compatibility layer because:

1. We are not supporting both Zod v3 and v4 exports simultaneously
2. We are not creating adapters or wrappers for runtime conversion
3. The conversion happens at **code-generation time**, not runtime
4. Consumers only ever see Zod v4 (the new approach)

The Zod v3 usage is purely an internal implementation detail of the generator.

## Consequences

### Positive

1. **Schema-first compliance**: All Zod schemas flow from the generator, not hand-authored
2. **No duplication**: Apps don't need to recreate schemas locally
3. **Full MCP SDK compatibility**: Exported schemas work directly with `registerTool()`/`registerPrompt()`
4. **Type safety preserved**: `.describe()` calls and full Zod type inference available
5. **Single source of truth**: Changes to OpenAPI schema propagate through to all consumers

### Negative

1. **Generator complexity**: Code-gen must produce both Zod v3 (internal) and v4 (export)
2. **Dual Zod usage in SDK**: SDK workspace uses both `zod` and `zod/v4` imports
3. **Redundancy**: JSON Schema and Zod schema exports have overlapping information

### Mitigations

1. **Generator complexity**: Encapsulated in code-generation templates; apps don't see this
2. **Dual usage**: Clear separation—v3 for generated code, v4 for exports
3. **Redundancy**: Address in a future phase (consolidate or document the relationship)

## Implementation Guidelines

### For SDK Development (Code-Gen)

1. Generate Zod v3 schemas using `openapi-zod-client`
2. In the same code-generation pass, generate Zod v4 equivalents using `zod/v4`
3. Export only Zod v4 schemas in public API surfaces
4. Ensure `.describe()` calls are preserved for MCP parameter descriptions

### For App Development

1. Use Zod v4 (`"zod": "^4"` in package.json)
2. Import Zod schemas directly from SDK
3. Use MCP SDK's `registerPrompt()` and `registerTool()` with SDK-provided schemas

### Code Example

```typescript
// packages/sdks/oak-curriculum-sdk/code-generation/generate-tool.ts
import { z as z3 } from 'zod'; // For openapi-zod-client output
import { z as z4 } from 'zod/v4'; // For exports

// Generated by openapi-zod-client (internal)
const toolInputSchemaV3 = z3.object({
  lesson: z3.string().describe('The lesson slug'),
});

// Exported to consumers (public API)
export const toolMcpFlatInputSchema = z4.object({
  lesson: z4.string().describe('The lesson slug'),
});
```

## Migration Path

### Phase 1: Implement Zod v4 Exports

1. Update code-generation templates to produce Zod v4 schemas alongside v3
2. Export Zod v4 schemas from SDK public API
3. Update apps to use SDK-provided Zod schemas

### Phase 2: Address Type Complexity (TS2589)

After Phase 1, address the TypeScript type instantiation depth issue:

1. Analyse the union type complexity causing TS2589
2. Simplify the exported schema union or type structure
3. Potentially use branded types or other techniques to reduce depth

### Future: Consolidate Redundancy

Address the overlap between JSON Schema and Zod exports:

- Document when to use each
- Or consolidate to a single export with derived formats

## Alternatives Considered

### Alternative 1: Don't Export Zod Schemas (Previous ADR-055)

- SDK exports only TypeScript types; apps recreate Zod schemas locally
- **Rejected**: Violates schema-first; creates duplication; manual sync burden

### Alternative 2: Wait for openapi-zod-client Zod v4 Support

- Delay until upstream supports Zod v4
- **Rejected**: Unknown timeline; we can solve this now with `zod/v4`

### Alternative 3: Runtime Conversion

- Convert Zod v3 to v4 at runtime
- **Rejected**: Adds runtime cost; harder to debug; violates code-generation-time principle

## Related Documents

- [ADR-003: Zod for Runtime Validation](003-zod-for-validation.md)
- [ADR-028: Deferring Zod Validation](028-zod-validation-deferral.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [Schema-First Execution Directive](../../../.agent/directives/schema-first-execution.md)
- [Implementation Plan](../../../.agent/plans/sdk-and-mcp-enhancements/05-zod-v4-export-implementation-plan.md)

## References

- Zod package: `zod/v4` export path in Zod 3.25+
- MCP TypeScript SDK: Zod v4 compatibility
- `openapi-zod-client` Zod version requirements
- [ADR-108: SDK Workspace Decomposition](108-sdk-workspace-decomposition.md) — Castr replaces both `openapi-zod-client` and `openapi3-ts`
