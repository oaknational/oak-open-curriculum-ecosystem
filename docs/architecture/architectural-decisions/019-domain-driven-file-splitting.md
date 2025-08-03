# ADR-019: Domain-Driven File Splitting

## Status

Accepted

## Date

2025-01-03

## Context

During Phase 3 of the biological architecture transformation, we successfully flattened the logging module from 5 levels of nesting to 2 levels by consolidating related files. However, this created files that are too large (400-600+ lines), violating our linting rules and making the code harder to navigate.

The consolidated files contain multiple distinct responsibilities:

- `pretty.ts` (621 lines): types, colors, levels, text utils, serializers, layouts, factories
- `console.ts` (309 lines): types, colorizer, level formatter, argument builder, transport
- `file.ts` (380 lines): types, error serializer, formatters, transport, adapter
- `utils.ts` (349 lines): ID generation, header parsing, context creation, formatting

## Decision

We will split large consolidated files along domain boundaries rather than arbitrary line counts. Each resulting file should:

1. Have a single, clear responsibility
2. Maintain the 2-level depth limit (e.g., `logging/formatters/pretty-colors.ts`)
3. Be named to reflect its specific domain (not generic like "utils" or "helpers")
4. Export through a barrel file (index.ts) at the module level

Example structure for pretty formatter:

```
src/logging/formatters/
├── index.ts           # Public API
├── pretty-types.ts    # Type definitions
├── pretty-colors.ts   # Color management
├── pretty-levels.ts   # Level formatting
├── pretty-text.ts     # Text utilities
├── pretty-serializers.ts  # Error/context serialization
├── pretty-layouts.ts  # Layout implementations
└── pretty-factories.ts    # Factory functions
```

## Consequences

### Positive

- Files have single responsibilities (cellular architecture)
- Easier to navigate and understand
- Natural boundaries emerge from domain concepts
- Maintains 2-level depth limit
- Satisfies linting rules while preserving architecture

### Negative

- More files than the initial consolidation
- Need to manage exports through barrel files
- Some very small files may emerge (but that's acceptable)

### Neutral

- This is an experiment to find the right balance between consolidation and separation
- We may need to adjust boundaries based on what emerges

## Notes

This represents a middle ground between deep nesting (5 levels) and over-consolidation (600+ line files). It aligns with our biological architecture principles where each module is a "cell" with a clear membrane and specific function.

## References

- [ADR-006: Cellular Architecture Pattern](./006-cellular-architecture-pattern.md)
- [ADR-018: Complete Biological Architecture](./018-complete-biological-architecture.md)
- Phase 3 Biological Architecture Implementation Plan
