# ADR-032: External Boundary Validation Pattern

**Status**: Accepted  
**Date**: 2025-08-13  
**Deciders**: Jane Eyre (Standards Evangelist), Architecture team

## Context

When receiving data from external sources in TypeScript applications, we face a fundamental challenge:

- External data arrives as `unknown` type (from globalThis, process.env, API responses, file reads, etc.)
- We need to validate and narrow these types to work with them safely
- Type assertions (`as`) bypass TypeScript's safety and should be avoided
- We must distinguish between external boundary code and internal application code

We discovered this pattern while eliminating type assertions from the histoi tissues, particularly when handling environment variables from different JavaScript runtimes.

## Decision

**ALL external data validation must happen at clearly marked boundaries using specific type guards**.

The pattern is:

1. **Mark boundary code explicitly**: Functions handling external data must be clearly documented as "EXTERNAL BOUNDARY"
2. **Use specific type guards**: Create focused type predicates for expected shapes, not generic object validation
3. **Validate once at the boundary**: After validation, work with trusted types internally
4. **Never use `unknown` internally**: The `unknown` type should ONLY appear at system boundaries

## Rationale

### 1. Type Safety Without Assertions

Type guards with predicates (`is` keyword) provide compile-time guarantees without bypassing the type system.

### 2. Clear Separation of Concerns

External validation is isolated from business logic. The boundary is explicit and auditable.

### 3. Runtime Safety

Invalid external data is caught at the boundary before it can corrupt internal state.

### 4. Maintainability

New developers can immediately identify where external data enters the system.

## Implementation Example

### Moria Runtime Boundary Utilities (runtime-boundary.ts)

```typescript
/**
 * @fileoverview External boundary type utilities for EXTERNAL DATA ONLY
 *
 * ⚠️ WARNING: These utilities should ONLY be used at system boundaries where we receive
 * unknown data from EXTERNAL sources:
 * - globalThis
 * - process.env
 * - API responses
 * - File system reads
 * - Command line arguments
 * - External message passing
 */

/**
 * EXTERNAL BOUNDARY ONLY: Type guard for environment variable objects.
 *
 * @param value - Unknown value from an EXTERNAL source
 * @returns Type predicate confirming value is an environment variable object
 */
export function isEnvironmentObject(value: unknown): value is Record<string, string | undefined> {
  if (!isObject(value)) {
    return false;
  }

  // Validate all values are strings or undefined
  for (const val of Object.values(value)) {
    if (val !== undefined && typeof val !== 'string') {
      return false;
    }
  }

  return true;
}
```

### Histoi Tissue Usage (adaptive.ts)

```typescript
/**
 * EXTERNAL BOUNDARY: Validates and extracts environment variables from runtime context
 *
 * This function handles the boundary where external data (globalThis) enters our system.
 * After this point, all types are trusted and we work with EnvVars internally.
 */
function extractEnvVars(context: unknown): EnvVars {
  // Try Node.js style: globalThis.process.env
  if (hasNestedProperty(context, ['process', 'env'])) {
    const processEnv = extractNestedProperty(context, ['process', 'env']);
    if (isEnvironmentObject(processEnv)) {
      return processEnv; // Type is now trusted
    }
  }

  // Try Edge/Deno style: globalThis.env
  if (hasProperty(context, 'env')) {
    const env = extractProperty(context, 'env');
    if (isEnvironmentObject(env)) {
      return env; // Type is now trusted
    }
  }

  throw new EnvironmentNotSupportedError();
}

// Internal functions work with trusted types
function getEnvVar(env: EnvVars, key: string): string | undefined {
  return env[key]; // No validation needed - type is trusted
}
```

### Zod Validation at Boundaries (Higher Layers)

```typescript
// In organa or psycha layers, use Zod for complex validation
import { z } from 'zod';

const ApiResponseSchema = z.object({
  id: z.string(),
  data: z.array(z.string()),
  timestamp: z.number(),
});

/**
 * EXTERNAL BOUNDARY: Validate API response
 */
async function fetchData(url: string): Promise<ApiResponse> {
  const response = await fetch(url);
  const data = await response.json(); // unknown type

  // Validate at the boundary
  return ApiResponseSchema.parse(data); // Returns typed data or throws
}
```

## Consequences

### Positive

- **Type Safety**: No type assertions needed anywhere in the codebase
- **Clear Boundaries**: External data entry points are explicit and documented
- **Progressive Enhancement**: Can add Zod validation in higher layers without changing the pattern
- **Runtime Safety**: Invalid data rejected before entering internal systems
- **Testability**: Boundary validation can be tested independently

### Negative

- **Verbosity**: Type guards require more code than type assertions
- **Learning Curve**: Developers must understand the boundary concept
- **Discipline Required**: Must resist temptation to use `as` for convenience

### Neutral

- **Central Definitions**: Boundary utilities must be defined in foundational layers (Moria)
- **Documentation**: Boundary functions must be clearly marked

## Key Principles

1. **`unknown` is ONLY at boundaries**: Never pass `unknown` between internal functions
2. **Validate once**: Don't re-validate data that's already been validated at the boundary
3. **Specific guards**: `isEnvironmentObject` is better than generic `isObject`
4. **Clear documentation**: Mark boundary code with "EXTERNAL BOUNDARY" comments
5. **Trust after validation**: Internal code works with trusted types

## Alternatives Considered

### Type Assertions Everywhere

Use `as` to cast unknown values.

- **Rejected**: Bypasses TypeScript's safety. Violates "no type assertions" rule.

### Generic Object Validation

Use a single `ValidatedObject` type for all external data.

- **Rejected**: Too generic. Loses type information. Not aligned with TypeScript practice.

### Re-validation Throughout

Check types at every usage point.

- **Rejected**: Performance overhead. Indicates lack of trust in the type system.

### Any Type at Boundaries

Use `any` for external data.

- **Rejected**: Completely disables type checking. Worst possible option.

## Related

- [TypeScript Practice Guide](../../governance/typescript-practice.md)
- [ADR-003: Zod for Validation](003-zod-for-validation.md)
- [ADR-023: Moria-Histoi-Psycha Architecture](023-moria-histoi-psycha-architecture.md)
- [Moria Runtime Boundary Implementation](../../../ecosystem/moria/moria-mcp/src/types/runtime-boundary.ts)
