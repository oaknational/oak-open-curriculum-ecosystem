# Phase 3: oak-mcp-core Framework Implementation Plan

## Overview

Create oak-mcp-core as a comprehensive MCP server framework within the existing repository using a folder structure, while simultaneously migrating oak-notion-mcp to use it. This approach builds generic components in their final location, validating them through real use.

## Core Philosophy

**Build once, in the right place.** Every generic component is built directly in oak-mcp-core, not in oak-notion-mcp. This ensures:

- True generalisation from day one
- No wasted extraction effort
- Immediate validation through real use
- Clear boundaries enforced by package separation

## Architectural Principles

1. **Zero Dependencies in Core** - Generic components must have no external dependencies
2. **Test-Driven Development** - Write unit tests FIRST for all pure functions
3. **Dependency Injection** - All IO must be injected as arguments
4. **Boundary Validation** - External data validated at entry, SDK types used internally
5. **Pure Functions** - Maximize pure functions, minimize side effects
6. **Fail FAST** - Clear error messages, never fail silently
7. **No Type Assertions** - No `as`, no `any`, no `!` (non-null assertion)

## Success Metrics

- Extract 3,050 LoC into oak-mcp-core (exceeding current oak-notion-mcp size)
- Reduce oak-notion-mcp to <1,000 LoC (validation + adapters only)
- 100% test coverage on all pure functions
- Test file naming: `*.unit.test.ts` and `*.integration.test.ts`
- All quality gates passing (format, lint, type-check, test, build)
- Pre-commit and pre-push hooks working
- CI/CD with automated releases

### Performance Benchmarks

- **Logging**: <1ms overhead per operation
- **Middleware**: <0.5ms processing per layer
- **Error Handling**: <0.1ms for error chain creation
- **Memory**: <10MB base footprint
- **Bundle Size**: <50KB minified + gzipped
- **Startup Time**: <100ms cold start

### Runtime Support

- Node.js 18+ (native)
- Deno (through web platform APIs)
- Bun (native Node APIs)
- Cloudflare Workers (web platform APIs)
- Vercel Edge Runtime (web platform APIs)
- Browser (with HTTP transport)

### Community Feedback Loop

- Beta release after Sub-phase 4
- Feedback channels: GitHub Issues, Discord
- Weekly iteration based on feedback
- Breaking changes only in major versions

## Testing Strategy

- **Unit Tests** (`*.unit.test.ts`): Test pure functions in isolation - TDD mandatory
- **Integration Tests** (`*.integration.test.ts`): Test component interactions with mocked IO
- **E2E Tests**: Test full oak-notion-mcp + oak-mcp-core integration
- **Performance Tests**: Track benchmarks for each component
- **Test Organization**: Tests co-located with code, not in separate directories

### Integration Testing Plan

- **Between Components**: Test logger + error handler integration
- **With oak-notion-mcp**: Continuous testing during migration
- **Cross-Runtime**: Test in Node.js, Deno, and Bun environments
- **Bundle Testing**: Verify tree-shaking and size optimization
- **Type Testing**: Ensure TypeScript types work correctly for consumers

## Dependency Management

- **Core**: Zero external dependencies
- **TypeScript**: Peer dependency ^5.0.0
- **Runtime Abstractions**: Interfaces for Timer, Storage, etc.
- **Zod**: Integration through adapters, not direct dependency
- **Edge Compatibility**: Feature detection with graceful degradation

### Runtime Abstraction Strategy

```typescript
// Instead of Node.js-specific APIs
interface Timer {
  now(): number;
}

interface Storage {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

// Runtime-specific implementations injected at startup
```

### Runtime Feature Matrix

| Feature               | Node.js | Cloudflare Workers | Deno | Bun | Browser    |
| --------------------- | ------- | ------------------ | ---- | --- | ---------- |
| **Core Framework**    | ✅      | ✅                 | ✅   | ✅  | ✅         |
| Logging to Console    | ✅      | ✅                 | ✅   | ✅  | ✅         |
| Logging to File       | ✅      | ❌                 | ✅   | ✅  | ❌         |
| AsyncLocalStorage     | ✅      | ✅ (als)           | ✅   | ✅  | ❌         |
| performance.now()     | ✅      | ✅                 | ✅   | ✅  | ✅         |
| Error Stack Traces    | ✅      | ✅                 | ✅   | ✅  | ✅         |
| File System Access    | ✅      | ❌                 | ✅   | ✅  | ❌         |
| Environment Variables | ✅      | ✅                 | ✅   | ✅  | ❌         |
| HTTP/HTTPS            | ✅      | ✅ (fetch)         | ✅   | ✅  | ✅ (fetch) |
| WebSockets            | ✅      | ✅                 | ✅   | ✅  | ✅         |
| Crypto APIs           | ✅      | ✅ (Web Crypto)    | ✅   | ✅  | ✅         |

**Legend:**

- ✅ = Full support
- ✅ (variant) = Supported with different API
- ❌ = Not available (graceful degradation required)

## Risk Mitigation Schedule

- **Sub-phase 1**: Performance benchmarking baseline
- **Sub-phase 2**: API design review checkpoint
- **Sub-phase 3**: Type safety audit
- **Sub-phase 4**: Bundle size optimization
- **Sub-phase 5**: Security review and beta feedback

## Implementation Sub-phases

### Sub-phase 1: Foundation & Core Systems

**Deliverables**: ~850 LoC

#### Project Structure Setup

- [ ] Create folder structure:
  ```
  src/
  ├── oak-mcp-core/
  │   └── index.ts    # Single public API export
  └── oak-notion-mcp/
      └── (move all current files here)
  ```
- [ ] Move all existing source files to `src/oak-notion-mcp/`
- [ ] Create `src/oak-mcp-core/index.ts` as the only public API
- [ ] Update all imports and build configuration
- [ ] Configure TypeScript paths for clean imports
- [ ] Write unit tests FIRST for folder structure verification
- [ ] Update README with new structure

#### Logging Framework (550 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for Logger interface (TDD)
- [ ] Create `src/oak-mcp-core/logging/logger-interface.ts` with zero dependencies
- [ ] Write unit tests for ContextLogger
- [ ] Implement `src/oak-mcp-core/logging/context-logger.ts` with optional AsyncLocalStorage
- [ ] Create Storage abstraction for context when AsyncLocalStorage unavailable
- [ ] Write unit tests for transports (console, file)
- [ ] Create transport implementations with injected IO
- [ ] Write unit tests for formatters (JSON, pretty)
- [ ] Implement formatters as pure functions
- [ ] Write integration tests for request tracing
- [ ] Implement request tracing with correlation IDs

**In oak-notion-mcp:**

- [ ] Import from `../../oak-mcp-core`
- [ ] Replace console.log with new logger
- [ ] Verify logging in integration tests

#### Error Framework (300 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for ChainedError
- [ ] Create `src/errors/error-chain.ts` preserving full context
- [ ] Write unit tests for error types and categories
- [ ] Implement structured error types with metadata
- [ ] Write unit tests for ErrorContext
- [ ] Add AsyncLocalStorage-based error context
- [ ] Write unit tests for recovery strategies
- [ ] Implement exponential backoff and retry logic
- [ ] Write unit tests for Result<T, E> type
- [ ] Create functional error handling utilities
- [ ] Write unit tests for error sanitizer
- [ ] Implement PII detection and scrubbing

**In oak-notion-mcp:**

- [ ] Create NotionErrorHandler extending base
- [ ] Map Notion APIErrorCodes to MCP errors
- [ ] Update all error handling to use framework

### Sub-phase 2: Core Infrastructure

**Deliverables**: ~550 LoC

#### Configuration Management (200 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for ConfigManager
- [ ] Create multi-source configuration system
- [ ] Write unit tests for config sources
- [ ] Implement environment and file sources with injected IO
- [ ] Write unit tests for schema validation
- [ ] Add Zod integration for config validation
- [ ] Write integration tests for hot-reload
- [ ] Implement config watching (injected watcher)

**In oak-notion-mcp:**

- [ ] Migrate to ConfigManager
- [ ] Define Notion-specific config schema
- [ ] Remove old environment handling

#### Validation Framework (150 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for ValidationChain
- [ ] Create composable validator interface
- [ ] Write unit tests for common validators
- [ ] Implement string, required, url validators as pure functions
- [ ] Write unit tests for Zod adapter
- [ ] Create Zod integration for boundary validation
- [ ] Write unit tests for transform operations
- [ ] Add validation composition utilities

**Boundary Validation Pattern:**

```typescript
export interface BoundaryValidator<TExternal, TInternal> {
  validate(raw: TExternal): TInternal;
}
```

**In oak-notion-mcp:**

- [ ] Implement NotionBoundaryValidator
- [ ] Use Zod schemas + SDK type guards
- [ ] Validate all Notion API responses

#### Testing Utilities (200 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for TestMcpServer
- [ ] Create in-process test server
- [ ] Write unit tests for TestTransport
- [ ] Implement mock transport for testing
- [ ] Write unit tests for TestDataBuilder
- [ ] Create builder pattern for test data
- [ ] Write unit tests for assertion helpers
- [ ] Add custom assertions for MCP

**In oak-notion-mcp:**

- [ ] Migrate tests to use new utilities
- [ ] Simplify test setup significantly

### Sub-phase 3: MCP Core Patterns

**Deliverables**: ~800 LoC

#### MCP Server Base & Middleware (300 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for McpServerBase
- [ ] Create abstract server base class
- [ ] Write unit tests for lifecycle hooks
- [ ] Implement startup/shutdown sequences
- [ ] Write unit tests for middleware stack
- [ ] Create Next-pattern middleware system
- [ ] Write unit tests for common middleware
- [ ] Implement logging, validation, error middleware

**In oak-notion-mcp:**

- [ ] Create NotionMcpServer extending base
- [ ] Migrate server.ts to new architecture
- [ ] Apply middleware to all handlers

#### Registry System (200 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for Registry base
- [ ] Create generic registry with middleware
- [ ] Write unit tests for ResourceRegistry
- [ ] Implement URI matching and routing
- [ ] Write unit tests for ToolRegistry
- [ ] Add tool discovery and execution
- [ ] Write integration tests for middleware composition
- [ ] Ensure registries work with middleware stack

**In oak-notion-mcp:**

- [ ] Register all resources and tools
- [ ] Remove manual routing logic

#### Type Guards & Pagination (300 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for TypeGuardRegistry
- [ ] Create composable type guard system
- [ ] Write unit tests for guard composition
- [ ] Implement AND/OR guard combinators
- [ ] Write unit tests for PaginationHandler
- [ ] Create AsyncGenerator-based pagination
- [ ] Write unit tests for pagination strategies
- [ ] Support cursor and offset patterns

**In oak-notion-mcp:**

- [ ] Register Notion SDK guards (isFullPage, etc.)
- [ ] Implement NotionPaginationStrategy
- [ ] Use pagination for all list operations

### Sub-phase 4: Advanced Patterns & Migration

**Deliverables**: ~850 LoC

#### Performance & Monitoring (200 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for PerformanceMonitor
- [ ] Create metrics collection interface
- [ ] Write unit tests for Timer abstraction
- [ ] Implement Timer using performance.now() (available in all runtimes)
- [ ] Create runtime detection utilities
- [ ] Write unit tests for PerformanceMiddleware
- [ ] Add automatic handler instrumentation
- [ ] Write integration tests for overhead
- [ ] Ensure <5% performance impact

**In oak-notion-mcp:**

- [ ] Add performance monitoring
- [ ] Create performance baselines

#### Lifecycle Management (100 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for LifecycleManager
- [ ] Create component orchestration
- [ ] Write unit tests for rollback
- [ ] Implement failure recovery
- [ ] Write integration tests for sequences
- [ ] Test startup/shutdown ordering

**In oak-notion-mcp:**

- [ ] Implement graceful shutdown
- [ ] Add health checks

#### Resource Patterns & Utilities (200 LoC)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for ResourceLinker
- [ ] Create cross-reference system
- [ ] Write unit tests for URI utilities
- [ ] Add extraction and resolution
- [ ] Write unit tests for Result type helpers
- [ ] Create additional functional utilities

**In oak-notion-mcp:**

- [ ] Implement resource linking
- [ ] Reduce response payloads

#### Final Migration & Optimization (350 LoC)

**In oak-mcp-core:**

- [ ] Add any missing utilities discovered during migration
- [ ] Optimize bundle size
- [ ] Ensure runtime compatibility via abstractions
- [ ] Test in multiple runtime environments:
  - [ ] Node.js 18+
  - [ ] Cloudflare Workers (using Miniflare)
  - [ ] Deno
  - [ ] Bun
- [ ] Final API surface review

**In oak-notion-mcp:**

- [ ] Complete migration to oak-mcp-core
- [ ] Remove all generic code
- [ ] Verify <1,000 LoC remaining
- [ ] Update all documentation

### Sub-phase 5: Documentation & Examples

**Deliverables**: Documentation + 3-4 example servers

#### Documentation

**In oak-mcp-core:**

- [ ] Write comprehensive API documentation
- [ ] Create getting started guide
- [ ] Document all design patterns
- [ ] Add migration guide from direct SDK
- [ ] Create troubleshooting guide
- [ ] Document testing strategies

#### Example Servers

**Example 1: Echo Server (100 LoC)**

- [ ] Pure functions only
- [ ] Demonstrates basic patterns
- [ ] Full test coverage

**Example 2: File Browser (200 LoC)**

- [ ] Injected file system IO
- [ ] Path validation at boundaries
- [ ] Shows middleware usage

**Example 3: GitHub MCP (300 LoC)**

- [ ] Real-world complexity
- [ ] Uses Octokit types after validation
- [ ] Demonstrates all patterns

#### Polish & Release

- [ ] Security review of all components
- [ ] Beta release to early adopters
- [ ] Collect and incorporate feedback
- [ ] Final bundle size optimization

- [ ] Prepare for future extraction to @oaknational/mcp-core
- [ ] Document extraction process
- [ ] Create announcement blog post draft
- [ ] Update oak-notion-mcp README
- [ ] Community engagement plan

## Risk Mitigation

1. **Circular Dependencies**: Build in dependency order, test continuously
2. **API Design**: Start with minimal surface, expand based on needs
3. **Performance**: Benchmark each component, maintain <5% overhead
4. **Type Safety**: No compromises - full type safety throughout
5. **Testing**: 100% coverage on pure functions, integration tests for IO

## Quality Checkpoints

After each component:

```bash
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build
```

Additional checks:

- Verify zero external dependencies in core
- Confirm tests written FIRST (TDD)
- Validate all IO is injected
- Ensure pure functions where possible

## Boundary Validation Architecture

The framework provides the pattern, integrations implement specifics:

```typescript
// oak-mcp-core provides
export interface BoundaryValidator<TExternal, TInternal> {
  validate(raw: TExternal): TInternal;
}

// oak-notion-mcp implements
class NotionPageValidator implements BoundaryValidator<unknown, PageObjectResponse> {
  validate(raw: unknown): PageObjectResponse {
    const parsed = notionPageSchema.parse(raw);
    if (!isFullPage(parsed)) {
      throw new ValidationError('Invalid page');
    }
    return parsed;
  }
}
```

## Summary

This plan builds oak-mcp-core from the ground up while simultaneously proving each abstraction through real use in oak-notion-mcp. By the end:

- oak-mcp-core: ~3,050 LoC of pure, generic MCP framework
- oak-notion-mcp: <1,000 LoC of Notion-specific validation and adapters
- 3+ example servers demonstrating the patterns
- Clear path for other teams to build MCP servers

The key is building in the right place from day one, with continuous validation through real use.
