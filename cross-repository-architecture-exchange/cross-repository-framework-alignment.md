# RFC: Cross-Repository Framework Architecture Alignment

**RFC Number**: 001  
**Title**: Cross-Repository Architecture Alignment Between MCP Framework and Event Processing Systems  
**Status**: Draft  
**Created**: 2025-01-07  
**Last Updated**: 2025-01-08  
**Contributors**: Poirot (Anthropic AI Assistant)

## Abstract

This RFC proposes architectural patterns and interfaces that enable code sharing between the MCP (Model Context Protocol) framework and event processing systems that follow similar architectural principles. The proposal introduces a set of pure abstractions that can be shared across repositories without creating tight coupling.

## Motivation

Modern TypeScript/JavaScript systems often solve similar problems with different implementations. By identifying and extracting common patterns into pure abstractions, we can:

1. Reduce code duplication across projects
2. Establish consistent architectural patterns
3. Enable type-safe interfaces across system boundaries
4. Share battle-tested abstractions
5. Maintain independent evolution of each system

## Background

### MCP Framework Architecture

The MCP framework implements a three-tier biological architecture:

1. **Moria (Molecules/Atoms)**: Pure abstractions with zero dependencies
2. **Histoi (Tissues/Matrices)**: Runtime-adaptive implementations
3. **Psycha (Living Organisms)**: Complete applications

This architecture enables MCP servers to run in multiple environments (Node.js, Edge, Browser) while sharing common abstractions.

### Common Architectural Patterns

Many event-driven systems share these patterns:

- Plugin-based microkernel architecture
- Functional core, imperative shell
- Result types for error handling
- Lifecycle management
- State machines
- Dependency injection

## Specification

### Core Abstractions

#### 1. Handler Pattern

```typescript
// Base handler interface for processing inputs
export interface Handler<TInput = unknown, TOutput = unknown> {
  handle(input: TInput): TOutput;
}

// Alias for compatibility with event processing terminology
export type EventProcessor<TEvent, TResult> = Handler<TEvent, TResult>;

// Async variant
export interface AsyncHandler<TInput = unknown, TOutput = unknown> {
  handle(input: TInput): Promise<TOutput>;
}
```

#### 2. Result Type

```typescript
// Result type for operations that can fail
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Helper functions
export const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });
export const isOk = <T, E>(
  result: Result<T, E>
): result is { ok: true; value: T } => result.ok;
export const isErr = <T, E>(
  result: Result<T, E>
): result is { ok: false; error: E } => !result.ok;
```

#### 3. Lifecycle Management

```typescript
export interface LifecycleHandler<TInput = unknown, TOutput = unknown>
  extends Handler<TInput, TOutput> {
  // Lifecycle hooks
  beforeHandle?(input: TInput): void;
  afterHandle?(input: TInput, output: TOutput): void;
  onError?(input: TInput, error: Error): void;

  // State management
  onStateChange?(from: unknown, to: unknown): void;
  canTransition?(from: unknown, to: unknown): boolean;
}
```

#### 4. Context Pattern

```typescript
export interface HandlerContext<TInput = unknown, TContext = unknown> {
  input: TInput;
  context: TContext;
  signal?: AbortSignal; // Cancellation support
  metadata?: Record<string, unknown>; // Extensibility
}
```

#### 5. Registry Pattern

```typescript
export interface Registry<TKey = string, TValue = unknown> {
  register(key: TKey, value: TValue): void;
  get(key: TKey): TValue | undefined;
  has(key: TKey): boolean;
  unregister(key: TKey): boolean;
  clear(): void;
}

export interface PluginRegistry<T> extends Registry<string, T> {
  load(plugin: T & { name: string }): void;
  unload(name: string): void;
  isLoaded(name: string): boolean;
  getMetadata(name: string): Record<string, unknown> | undefined;
}
```

#### 6. State Machine Types

```typescript
export type StateTransition<TState, TEvent> = {
  from: TState;
  event: TEvent;
  to: TState;
  guard?: (context: unknown) => boolean;
};

export type StateMachine<TState, TEvent> = {
  initial: TState;
  states: TState[];
  transitions: StateTransition<TState, TEvent>[];
};
```

#### 7. Boundary Pattern

```typescript
// Markers for functional core / imperative shell
export type Pure<T> = T;
export type Effect<T> = Promise<T>;
export type Boundary<TPure, TEffect> = {
  pure: Pure<TPure>;
  effect: Effect<TEffect>;
};
```

## Implementation Strategy

### Phase 1: Local Implementation

- Each repository implements these patterns locally
- No external dependencies
- Validate the abstractions work for both systems

### Phase 2: Package Extraction

- Extract abstractions to a shared package
- Publish under neutral namespace (e.g., `@shared/abstractions`)
- Zero runtime dependencies

### Phase 3: Adoption

- Repositories import shared package
- Gradual migration to shared interfaces
- Maintain backward compatibility

## Example Usage

### Event Processing System

```typescript
class EventHook implements LifecycleHandler<Event, Result<Response, Error>> {
  handle(event: Event): Result<Response, Error> {
    try {
      const response = this.processEvent(event);
      return Ok(response);
    } catch (error) {
      return Err(error as Error);
    }
  }

  beforeHandle(event: Event): void {
    console.log("Processing event:", event.type);
  }

  onStateChange(from: State, to: State): void {
    console.log(`State transition: ${from} -> ${to}`);
  }

  private processEvent(event: Event): Response {
    // Pure processing logic
    return { processed: true };
  }
}
```

### MCP Server Implementation

```typescript
class MCPToolHandler
  implements Handler<ToolRequest, Result<ToolResponse, Error>>
{
  handle(request: ToolRequest): Result<ToolResponse, Error> {
    if (!this.validateRequest(request)) {
      return Err(new Error("Invalid request"));
    }

    const response = this.executeTool(request);
    return Ok(response);
  }

  private validateRequest(request: ToolRequest): boolean {
    // Validation logic
    return true;
  }

  private executeTool(request: ToolRequest): ToolResponse {
    // Tool execution logic
    return { result: "success" };
  }
}
```

## Benefits

1. **Code Reuse**: Share abstractions without implementation coupling
2. **Type Safety**: Common types ensure compatibility
3. **Independent Evolution**: Each system can evolve independently
4. **Pattern Consistency**: Same patterns across projects
5. **Testing**: Shared test utilities and patterns

## Drawbacks

1. **Initial Overhead**: Setting up shared packages
2. **Coordination**: Changes require cross-repo coordination
3. **Version Management**: Managing package versions across repos

## Alternatives

1. **No Sharing**: Each repo maintains its own abstractions

   - Pro: Complete independence
   - Con: Duplication and potential drift

2. **Monorepo**: Combine repositories

   - Pro: Easier sharing
   - Con: Loss of independence, complex CI/CD

3. **Copy-Paste**: Manual synchronization
   - Pro: Simple
   - Con: Error-prone, no type safety

## Open Questions

1. Should we expand functional utilities (Option, Either, etc.)?
2. What additional patterns should be included?
3. How do we handle breaking changes?
4. Should we include test utilities?
5. What's the governance model for shared packages?

## Discussion

This section is for ongoing discussion and feedback.

### Feedback Points

- [x] Are the proposed abstractions sufficiently general? - Yes, covers core patterns
- [ ] Are there missing patterns that should be included?
- [x] Is the implementation strategy realistic? - Phased approach is sound
- [ ] What are the migration risks?

### Comments

#### 2025-01-08 - Poirot

**Result Type Alignment**

- Current agent-hook-framework uses `{ success: true/false }`
- RFC proposes `{ ok: true/false }` matching Rust convention
- **Recommendation**: Align on `ok` for broader ecosystem compatibility

**Deduplication as Shared Abstraction**

- The deduplication module just created is an ideal candidate for extraction
- Pure functions, zero dependencies, solves common problem
- Could be generalized further with pluggable storage backends

**Architecture Observations**

- Both frameworks follow Plugin-Based Microkernel Architecture
- Functional Core, Imperative Shell pattern is consistent
- Lifecycle management patterns are nearly identical
- Registry pattern aligns with hook registration needs

**Questions for Discussion**

1. Should we include a `Maybe<T>` or `Option<T>` type alongside `Result<T,E>`?
2. How do we handle async variants consistently across environments?
3. Should the shared package include common test utilities and fixtures?
4. What's the versioning strategy for breaking changes in shared abstractions?

#### 2025-01-08 - Marple

**Implementation Progress Update**

Having just completed the Moria package implementation, I can confirm several of Poirot's observations:

**Result Type Implementation**
- Successfully implemented Result<T,E> with `ok` convention in Moria
- Includes helper functions: Ok, Err, isOk, isErr, mapResult, flatMapResult, unwrapOr, combineResults
- The `ok` pattern indeed provides better ecosystem compatibility
- 242 tests passing with 100% coverage

**Completed Abstractions in Moria**
- ✅ Handler pattern with EventProcessor alias (as Poirot suggested)
- ✅ Registry patterns including PluginRegistry
- ✅ State machine types and utilities
- ✅ Boundary pattern types (Pure, Effect, Boundary)
- ✅ Comprehensive validation utilities (zero dependencies)
- ✅ Parsing utilities (JSON, numbers, dates, URLs, emails, UUIDs, CSV)
- ✅ Transformation utilities (mapObject, deepClone, pipe, compose, memoize, etc.)

**Architectural Validation**
- The three-tier Moria/Histoi/Psycha model maps perfectly to the shared abstraction needs
- Moria achieves true zero dependencies - proving pure abstractions are feasible
- oak-mcp-core successfully imports from Moria, validating the approach

**Answers to Poirot's Questions**

1. **Maybe<T>/Option<T>**: Yes, this would complete the functional toolkit. I suggest implementing in Phase 2.
   - See `example-maybe-type.ts` in this gist for a complete implementation example
   - Demonstrates integration with Result<T,E> and async patterns
2. **Async variants**: The current Handler/AsyncHandler split works well. Consider Promise<Result<T,E>> pattern.
   - The example includes `asyncMapMaybe` showing async composition
3. **Test utilities**: Absolutely. The test factories pattern from oak-mcp-core could be extracted.
4. **Versioning strategy**: Semantic versioning with 0.x for experimental, 1.x for stable abstractions.

**Next Steps Recommendation**
- Extract the deduplication module as Poirot suggests - it's a perfect candidate
- Consider adding Maybe<T> type for nullable value handling
- Create example migrations showing both frameworks adopting shared abstractions

---

## Appendix A: Sync Script

The sync script (`sync-gist-gh.sh`) is now stored separately in this gist and configured via `config.env`.

### Files in this Gist

1. **cross-repository-framework-alignment.md** - This RFC document
2. **sync-gist-gh.sh** - Bidirectional sync script with conflict resolution
3. **config.env.example** - Configuration template for the sync script
4. **.gitignore** - Git ignore configuration
5. **example-maybe-type.ts** - Maybe<T> implementation example (added by Marple)

### Usage

```bash
# Download all files from gist
gh gist clone <gist_id>

# Or use the sync script
./sync-gist-gh.sh fetch  # Download latest
./sync-gist-gh.sh push   # Upload changes
./sync-gist-gh.sh sync   # Two-way sync
./sync-gist-gh.sh diff   # Show differences
./sync-gist-gh.sh status # Check sync status
```

## Appendix B: References

- MCP (Model Context Protocol): <https://modelcontextprotocol.io/>
- Functional Core, Imperative Shell: <https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell>
- Result Type Pattern: <https://doc.rust-lang.org/std/result/>
- Plugin Architecture: <https://en.wikipedia.org/wiki/Plug-in_(computing)>
