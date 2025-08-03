# ADR-003: Zod for Runtime Validation

## Status

Accepted

## Context

TypeScript provides compile-time type safety, but we need runtime validation for:

- External API responses
- User inputs
- Environment variables
- MCP protocol messages
- Configuration files

We need a solution that integrates well with TypeScript and provides good developer experience.

## Decision

Use Zod for all runtime type validation at system boundaries.

## Rationale

- **Type Inference**: Zod can infer TypeScript types from schemas, ensuring runtime and compile-time types stay in sync
- **Composability**: Schemas can be composed and reused like building blocks
- **Error Messages**: Provides detailed, human-readable validation errors
- **Developer Experience**: Clean API that feels natural in TypeScript
- **Active Maintenance**: Well-maintained library with strong community support
- **Performance**: Efficient validation with minimal overhead

## Consequences

### Positive

- Single source of truth for types (derive TS types from Zod schemas)
- Comprehensive validation at all system boundaries
- Better error messages for debugging and user feedback
- Prevents invalid data from entering the system
- Schemas serve as runtime documentation

### Negative

- Additional dependency to maintain
- Need to keep schemas updated with API changes
- Small runtime overhead for validation
- Team needs to learn Zod API

## Implementation

- Define Zod schemas for all external data structures
- Validate at system boundaries (API calls, user input, env vars)
- Use `.parse()` for validation with exceptions
- Use `.safeParse()` for validation with error handling
- Derive TypeScript types from Zod schemas using `z.infer<>`
- Place schemas close to where they're used
