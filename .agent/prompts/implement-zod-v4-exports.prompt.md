# Implement Zod v4 Exports from SDK

## Foundation Documents (Read First)

Before any work, read and commit to these foundation documents:

- @.agent/directives-and-memory/rules.md - Cardinal Rule, TDD, type safety
- @.agent/directives-and-memory/schema-first-execution.md - Generator-first architecture  
- @.agent/directives-and-memory/testing-strategy.md - Unit → integration → E2E, TDD at all levels

**Pre-Work Question**: Before the First Question, ask: are we solving the right problem, at the right layer?

---

## Architectural Insight (Critical)

### The Single Source of Zod v3

**`openapi-zod-client` is the ONLY source of Zod v3 artefacts in the entire project.**

This library reads the OpenAPI schema and produces Zod v3 schemas. Everything else—the SDK public API, all apps, the MCP SDK—should use Zod v4.

### The Adapter Pattern

We encapsulate `openapi-zod-client` in an **adapter**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    openapi-zod-client Adapter                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  openapi-zod-client (Zod v3)                            │    │
│  │  - Reads OpenAPI spec                                   │    │
│  │  - Produces Zod v3 schemas                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Adapter Layer                                          │    │
│  │  - Converts Zod v3 → Zod v4                             │    │
│  │  - Zod v3 NEVER escapes this boundary                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │  SDK Public API (Zod v4 ONLY) │
              └───────────────────────────────┘
```

### Why This Matters

1. **Clean boundary**: Zod v3 is contained; consumers only see Zod v4
2. **Replacement-ready**: The adapter defines what we need from `openapi-zod-client`
3. **Single responsibility**: One place handles the version translation
4. **Testable**: We can test the adapter boundary in isolation

### Adapter Interface (What We Need from Any Replacement)

```typescript
interface OpenApiZodAdapter {
  generateToolSchemas(operation: OpenApiOperation): {
    flatInputSchema: z4.ZodObject<z4.ZodRawShape>;   // MCP registration
    nestedInputSchema: z4.ZodObject<z4.ZodRawShape>; // SDK invoke
    outputSchema: z4.ZodType;                         // Response validation
  };
}
```

---

## Context

### The Problem

The SDK uses `openapi-zod-client` which produces Zod v3 schemas. Currently these leak into the public API, causing:

1. Apps use Zod v4, creating type mismatches
2. MCP SDK expects Zod v4 for optimal compatibility
3. TS2589 "Type instantiation excessively deep" error

### The Solution

Create an adapter that:
1. Encapsulates `openapi-zod-client` (the only Zod v3 source)
2. Converts all output to Zod v4 using `zod/v4`
3. Ensures Zod v3 artefacts NEVER escape the adapter boundary

Zod 3.25+ includes `zod/v4` which provides the Zod v4 API:

```typescript
import { z as z3 } from 'zod';      // Zod v3 (inside adapter only)
import { z as z4 } from 'zod/v4';   // Zod v4 (everywhere else)
```

---

## Key Documents

### Implementation Plan
@.agent/plans/sdk-and-mcp-enhancements/05-zod-v4-export-implementation-plan.md

This plan has two phases:
- **Phase 1**: Create adapter, encapsulate `openapi-zod-client`, export Zod v4 only
- **Phase 2**: Resolve TS2589 type complexity (after Phase 1)

### Architectural Decision
@docs/architecture/architectural-decisions/055-zod-version-boundaries.md

This ADR documents the Zod version boundary architecture.

### TS2589 Investigation (Background)
@.agent/prompts/investigate-ts2589-type-recursion.prompt.md

Documents the TS2589 error root cause—addressed in Phase 2.

---

## Current State

### SDK Zod Version
The SDK uses `"zod": "^3"` (specifically v3.25.76) which includes:
- `zod` - Zod v3 API
- `zod/v4` - Zod v4 API

Verified at: `packages/sdks/oak-curriculum-sdk/node_modules/zod/package.json`

### Where openapi-zod-client Is Used

Currently scattered in type-gen:
```
packages/sdks/oak-curriculum-sdk/type-gen/
├── zodgen.ts                 # Calls openapi-zod-client
├── typegen/mcp-tools/parts/  # Generates tool files with Zod v3
```

### Where Zod Schemas Are Exported

Public API exports from:
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts`
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`

### Where Zod Schemas Are Consumed

Apps that import and use these schemas:
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
- `apps/oak-curriculum-mcp-stdio/src/app/server.ts`

---

## Implementation Approach

### Phase 1: Create the Adapter

#### Step 1: Create Adapter Module Structure

```
type-gen/
├── adapter/
│   ├── index.ts                       # Public API (Zod v4 only)
│   ├── openapi-zod-client-adapter.ts  # Encapsulates the library
│   ├── zod-v3-to-v4.ts                # Conversion utilities
│   └── adapter.unit.test.ts           # Test the boundary
```

#### Step 2: Implement Zod v3 → v4 Conversion

```typescript
// type-gen/adapter/zod-v3-to-v4.ts
import { z as z3 } from 'zod';
import { z as z4 } from 'zod/v4';

/**
 * Convert a Zod v3 schema to Zod v4.
 * This is the ONLY place Zod v3 types are handled.
 */
export function convertToV4(v3Schema: z3.ZodTypeAny): z4.ZodTypeAny {
  // Implementation preserves .describe() calls
}
```

#### Step 3: Update Type-Gen to Use Adapter

All type-gen templates should import from the adapter, never from `openapi-zod-client` directly.

#### Step 4: Verify Boundary

Add checks that ensure:
- No `import { z } from 'zod'` outside the adapter
- Only `import { z } from 'zod/v4'` in generated code

---

## Quality Gates

After each phase:

```bash
pnpm type-gen    # Regenerate schemas
pnpm build       # Build all packages
pnpm type-check  # Verify no type errors
pnpm lint        # Code style
pnpm test        # All tests pass
```

---

## Key Constraints

From the foundation documents:

1. **Schema-first**: All changes go through type-gen templates, not hand-authored
2. **TDD**: Write tests first (Red → Green → Refactor)
3. **No type shortcuts**: No `as`, `any`, `!`, or type assertions
4. **Preserve type information**: Don't widen types; keep `.describe()` calls
5. **Clear boundaries**: Zod v3 stays inside the adapter, never escapes

---

## Success Criteria

Phase 1 Complete:
- [ ] Adapter encapsulates all `openapi-zod-client` usage
- [ ] Zod v3 NEVER escapes the adapter boundary
- [ ] SDK exports Zod v4 schemas only
- [ ] Apps can import and use schemas with MCP SDK
- [ ] `.describe()` calls preserved for MCP parameter descriptions
- [ ] All quality gates pass

Phase 2 Complete:
- [ ] No TS2589 error during type-check
- [ ] Type safety maintained
- [ ] MCP registration works correctly

---

## Getting Started

1. Read the foundation documents listed above
2. Read the implementation plan: @.agent/plans/sdk-and-mcp-enhancements/05-zod-v4-export-implementation-plan.md
3. Create the adapter module structure
4. Write tests for the adapter boundary first (TDD)
5. Implement the Zod v3 → v4 conversion
6. Update type-gen to use the adapter
