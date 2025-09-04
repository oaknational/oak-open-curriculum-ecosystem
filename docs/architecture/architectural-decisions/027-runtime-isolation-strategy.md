# ADR-027: Runtime Isolation Strategy

**Status**: Accepted  
**Date**: 2025-01-10  
**Decision**: Progressive runtime isolation with environment detection

## Context

The MCP ecosystem needs to run in multiple runtime environments:
- Node.js (development and traditional servers)
- Cloudflare Workers (edge computing)
- Deno (future)
- Browser (future)

Each environment has different globals and APIs:
- Node.js: `process.env`, `fs`, `path`, `crypto`
- Cloudflare Workers: `globalThis.env`, no filesystem, Web APIs
- Deno: Similar to browser with additional permissions
- Browser: Web APIs only, no filesystem or environment

## Decision

Implement progressive runtime isolation in three phases:

### Phase 1: SDK Isolation (✅ COMPLETED)
Isolate environment variables with try-catch detection:
```typescript
try {
  // Node.js environment
  apiUrl = process.env.OAK_API_URL;
} catch {
  try {
    // Cloudflare Workers environment
    apiUrl = globalThis.env.OAK_API_URL;
  } catch {
    // Use defaults
  }
}
```

### Phase 2: Histoi Tissue Isolation (Phase 7)
Create runtime abstraction layer with adapters:
```typescript
interface RuntimeAdapter {
  getEnv(key: string): string | undefined;
  readFile?(path: string): Promise<string>;
  writeFile?(path: string, content: string): Promise<void>;
}
```

### Phase 3: Full Ecosystem Support (Phase 7)
- Dynamic import of runtime-specific code
- Build targets for each environment
- Conditional compilation where needed

## Rationale

### Why Progressive?
- Allows immediate progress on SDK
- Validates approach before full commitment
- Reduces risk of over-engineering
- Enables incremental migration

### Why Try-Catch Detection?
- Simple and effective for environment detection
- No additional dependencies
- Works in all environments
- Graceful fallback behaviour

### Why Adapter Pattern for Histoi?
- Clear separation of concerns
- Testable with mock adapters
- Extensible to new runtimes
- Type-safe interfaces

## Consequences

### Positive
- SDK works in edge environments today
- Clear migration path for other packages
- No breaking changes required
- Maintains type safety

### Negative
- Try-catch has minor performance overhead
- Some code duplication across adapters
- Build complexity increases
- Testing burden for multiple environments

### Neutral
- Runtime detection happens at startup
- Adapter selection is explicit
- Some features may not be available in all environments

## Alternatives Considered

1. **Full abstraction from start**: Rejected - over-engineering for current needs
2. **Node.js only**: Rejected - limits deployment options
3. **Build-time polyfills**: Rejected - increases bundle size
4. **Separate packages per runtime**: Rejected - maintenance nightmare

## Implementation Plan

### Current (SDK Only)
- ✅ Environment variable detection
- ✅ Fallback to defaults
- ✅ No hard Node.js dependencies

### Phase 7 (Full Ecosystem)
- [ ] Define RuntimeAdapter interface
- [ ] Implement Node.js adapter
- [ ] Implement Cloudflare adapter
- [ ] Update Histoi tissues
- [ ] Update MCP servers
- [ ] Add build targets

## References

- Phase 7 Plan: `.agent/plans/high-level-plan.md#phase-7-full-ecosystem-runtime-isolation`
- SDK Implementation: `packages/oak-curriculum-sdk/src/config/index.ts`
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Deno Deploy Documentation](https://deno.com/deploy)