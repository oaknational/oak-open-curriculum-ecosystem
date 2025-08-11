# ADR-026: OpenAPI Type Generation Strategy

**Status**: Accepted  
**Date**: 2025-01-10  
**Decision**: Use two-stage pipeline with openapi-typescript plus custom extraction

## Context

The Oak Curriculum API provides an OpenAPI schema that we need to consume in our TypeScript SDK. We need a strategy that:
- Generates complete TypeScript types from the OpenAPI specification
- Provides runtime validation capabilities
- Extracts constants for dynamic API path construction
- Maintains type safety throughout the SDK
- Updates automatically when the API changes

## Decision

We will use a two-stage type generation pipeline:

1. **Stage 1**: Use `openapi-typescript` to generate complete TypeScript interfaces from the OpenAPI schema
2. **Stage 2**: Custom processing to extract runtime constants, type guards, and path mappings

This approach directly copies the reference implementation's proven pattern.

## Rationale

### Why Two Stages?

The OpenAPI schema contains information at two levels:
- **Type definitions**: Structure of requests and responses (handled by openapi-typescript)
- **Runtime values**: Enum values, parameter constraints, path patterns (need custom extraction)

### Why Not Just openapi-typescript?

While openapi-typescript generates excellent type definitions, it doesn't extract:
- Runtime constants (KEY_STAGES, SUBJECTS arrays)
- Type guard functions (isKeyStage, isSubject)
- Valid parameter combinations for path construction
- Path-to-type mappings for dynamic routing

### Implementation Details

```typescript
// Stage 1: Generate types
const ast = await openapiTS(schema);
const contents = astToString(ast);
fs.writeFileSync('api-paths-types.ts', contents);

// Stage 2: Extract runtime data
const { parameters, validCombinations } = extractPathParameters(schema);
// Generate constants, type guards, and mappings
```

## Consequences

### Positive
- Complete type safety from OpenAPI to runtime
- Single source of truth (OpenAPI schema)
- Automatic updates when API changes
- Runtime validation via type guards
- No manual type maintenance

### Negative
- Two-stage pipeline is more complex than single tool
- Custom extraction logic needs maintenance
- Generated files are large (but that's automated)

### Neutral
- Must run generation on every API schema change
- Generated files should not be edited manually
- Build process includes type generation step

## Alternatives Considered

1. **Manual Type Definitions**: Rejected - too error-prone and maintenance-heavy
2. **openapi-typescript alone**: Rejected - doesn't provide runtime values
3. **openapi-fetch types only**: Rejected - insufficient for our dynamic needs
4. **GraphQL codegen**: Rejected - API is REST, not GraphQL

## References

- [openapi-typescript documentation](https://github.com/drwpow/openapi-typescript)
- Reference implementation: `packages/oak-curriculum-sdk/scripts/typegen-core.ts`
- Phase 6 Implementation Plan: `.agent/plans/phase-6-oak-curriculum-api-implementation-plan.md`