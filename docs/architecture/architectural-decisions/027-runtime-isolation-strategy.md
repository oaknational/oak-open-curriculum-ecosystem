# ADR-027: Runtime Isolation Strategy

**Status**: Updated  
**Date**: 2025-01-10  
**Decision**: Node.js-only SDK support with explicit environment injection

## Context

The SDK now targets Node.js only. Multi-runtime support is deferred, so environment handling must be explicit and injected rather than inferred from global objects.

## Decision

Adopt explicit configuration injection for Node.js:

```typescript
export interface SdkConfig {
  apiUrl: string;
  apiSchemaUrl: string;
}

export function readSdkConfig(env: NodeJS.ProcessEnv): SdkConfig {
  // validate and return config derived from env
}
```

## Rationale

### Why Node.js Only?

- Matches current product scope and deployment targets
- Reduces ambiguity in config handling
- Keeps SDK predictable and easier to test

## Consequences

### Positive

- Clear Node.js contract
- Configuration is explicit and testable
- Less runtime branching

### Negative

- No edge/browser support for SDK until revisited

## Alternatives Considered

1. **Full abstraction from start**: Rejected - over-engineering for current needs
2. **Multi-runtime detection**: Rejected for now - not aligned with current SDK scope
3. **Build-time polyfills**: Rejected - increases bundle size
4. **Separate packages per runtime**: Rejected - maintenance overhead

## Implementation Plan

### Current (SDK Only)

- [ ] Provide `readSdkConfig(env)` with validation
- [ ] Ensure entry points pass `process.env` once
- [ ] Remove runtime detection logic from SDK config

## References

- SDK Implementation: `packages/sdks/oak-curriculum-sdk/src/config/index.ts`
