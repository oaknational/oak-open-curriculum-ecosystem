# ADR-028: Deferring Zod Validation

**Status**: Accepted  
**Date**: 2025-01-10  
**Decision**: Defer Zod validation implementation, use existing type predicates

## Context

The OpenAPI type generation pipeline could include Zod schema generation for runtime validation. We investigated three approaches:
1. Generate Zod schemas from OpenAPI (`openapi-zod`)
2. Transform TypeScript types to Zod (`ts-to-zod`)
3. Manual generation from extracted data

Currently, our type generation already provides:
- TypeScript interfaces for compile-time safety
- Type predicate functions (`isKeyStage`, `isSubject`)
- Extracted constants for validation
- Path validation functions

## Decision

Defer Zod implementation and rely on existing type predicates for the MVP.

## Rationale

### Current Validation is Sufficient

Our generated type predicates provide basic runtime validation:
```typescript
export function isKeyStage(value: string): value is KeyStage {
  const keyStages: readonly string[] = KEY_STAGES;
  return keyStages.includes(value);
}
```

### Complexity Without Clear Benefit

Adding Zod now would require:
- Another stage in the generation pipeline
- Additional dependency
- More generated code to maintain
- Potential version conflicts with MCP server's Zod usage

### MCP Server Can Add Zod at Boundaries

The MCP server already uses Zod for tool input validation. It can validate at its boundaries without requiring SDK-level Zod validation.

### Clear Reconsideration Triggers

We will reconsider when:
- API returns malformed data in production
- Runtime validation errors become frequent
- We need data transformation/coercion
- MCP tool validation becomes complex

## Consequences

### Positive
- Simpler generation pipeline
- Fewer dependencies
- Faster build times
- Less generated code

### Negative
- No automatic data coercion
- Less detailed validation errors
- Manual validation for complex types
- Potential for runtime type errors

### Neutral
- Type predicates provide basic validation
- TypeScript catches most issues at compile time
- Can be added later without breaking changes

## Alternatives Considered

1. **Implement full Zod generation now**: Rejected - premature optimisation
2. **No runtime validation at all**: Rejected - too risky
3. **Manual Zod schemas**: Rejected - defeats automation purpose
4. **JSON Schema validation**: Rejected - Zod is more TypeScript-friendly

## Migration Path

When we do implement Zod:

```typescript
// Add to generation pipeline
import { generate } from 'ts-to-zod';

await generate({
  input: './src/types/generated/api-schema/api-paths-types.ts',
  output: './src/validators/generated/api-validators.ts'
});

// Use in SDK
import { LessonSchema } from './validators/generated/api-validators';

export function validateLesson(data: unknown): Lesson {
  return LessonSchema.parse(data);
}
```

## References

- Investigation notes: `.agent/plans/phase-6-oak-curriculum-api-implementation-plan.md#6.1.4`
- Future Refinements: `.agent/plans/high-level-plan.md#future-refinements`
- [Zod Documentation](https://github.com/colinhacks/zod)
- [ts-to-zod](https://github.com/fabien0102/ts-to-zod)