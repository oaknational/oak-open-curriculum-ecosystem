# ADR-033: Centralised Log Level Configuration

## Status

Accepted

## Context

Log level configuration was duplicated across multiple organisms in the ecosystem, with each implementing its own validation and type definitions. This violated the DRY principle and made it difficult to ensure consistent logging behaviour across all organisms.

Additionally, the log level configuration was tightly coupled to environment-specific concerns:
- Direct access to `process.env` within utility functions
- Implicit dotenv loading within modules
- NODE_ENV-based logic that made assumptions about the runtime environment

## Decision

We will centralise log level configuration in the `histos-logger` tissue, following the principle that histoi tissues are transplantable components that can be used by any organism.

The implementation follows a single-source-of-truth pattern:

1. **Master Data Structure**: A single `LOG_LEVEL_VALUES` const object defines all log levels with their properties
2. **Derived Types**: The `LogLevel` type is derived from the keys of this structure
3. **Derived Guards**: Type guards and validation functions are derived from the structure
4. **Pure Functions**: All functions are pure, accepting values rather than accessing globals

```typescript
// Single source of truth
const LOG_LEVEL_VALUES = {
  TRACE: { label: 'TRACE', value: 0, default: false },
  DEBUG: { label: 'DEBUG', value: 10, default: false },
  INFO: { label: 'INFO', value: 20, default: true },
  WARN: { label: 'WARN', value: 30, default: false },
  ERROR: { label: 'ERROR', value: 40, default: false },
  FATAL: { label: 'FATAL', value: 50, default: false },
} as const;

// Everything else derives from this
export type LogLevel = keyof typeof LOG_LEVEL_VALUES;
```

## Consequences

### Positive

- **Single Source of Truth**: All log level information flows from one data structure
- **Reusability**: All organisms use the same logging configuration
- **Type Safety**: Types and runtime validation are guaranteed to be in sync
- **Testability**: Pure functions are easy to test
- **Flexibility**: Consuming applications control environment access explicitly
- **Maintainability**: Changes to log levels only need to be made in one place

### Negative

- **Migration Required**: Existing organisms need to update their imports
- **Explicit Environment Access**: Consuming code must pass environment values explicitly

### Neutral

- **Separation of Concerns**: Environment access is now the responsibility of the consuming organism, not the utility library

## Implementation Details

The centralised configuration provides:

1. **Constants**: `LOG_LEVEL_KEY`, `ENABLE_DEBUG_LOGGING_KEY` for environment variable names
2. **Types**: `LogLevel`, `BaseLoggingEnvironment` for type safety
3. **Guards**: `isLogLevel()` for runtime validation
4. **Utilities**: `parseLogLevel()`, `compareLogLevels()`, `shouldLog()` for common operations
5. **Defaults**: `getDefaultLogLevel()` returns the level marked as default in the data structure

## Related Decisions

- ADR-023: Moria-Histoi-Psycha Architecture - Defines the tissue transplantability principle
- ADR-032: External Boundary Validation Pattern - Establishes patterns for handling external data
- ADR-002: Pure Functions First - Reinforces the use of pure functions without side effects

## Notes

This pattern can be applied to other cross-cutting concerns that need consistent configuration across organisms, such as:
- Feature flags
- Performance thresholds
- Retry policies
- Timeout configurations