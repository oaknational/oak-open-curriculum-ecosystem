# Phase 4: oak-mcp-core Framework Extraction Plan

## Overview

Extract oak-mcp-core as the **first independent organism** in our future ecosystem - a comprehensive MCP server framework in a separate workspace/package, while simultaneously migrating oak-notion-mcp to use it. This follows the complete biological architecture established in Phase 3, where we've already organized the codebase into substrate, systems, and organs.

**Ecosystem Vision**: oak-mcp-core will be the pioneer organism that establishes patterns for future MCP servers. It's designed as a keystone species - many future packages will depend on it, making it critical to get the architecture right from the start.

**Current Status**: Significant refactoring progress has been made. The codebase has undergone extensive modularization with many components already prepared for extraction to oak-mcp-core.

## Core Philosophy

**Build once, in the right place.** Every generic component is built directly in oak-mcp-core, not in oak-notion-mcp. This ensures:

- True generalisation from day one
- No wasted extraction effort
- Immediate validation through real use
- Clear boundaries enforced by package separation
- **Ecosystem readiness**: Components designed for future symbiosis

### Organism Design Principles

As the first organism in our ecosystem:

1. **Self-contained**: Can function independently
2. **Symbiosis-ready**: Designed for beneficial relationships
3. **Environmental adaptation**: Works across multiple runtimes
4. **Temporal awareness**: Includes lifecycle management
5. **Health metrics**: Built-in observability
6. **Heterogeneity-enabling**: Supports diverse implementation patterns
7. **Cooperative by design**: Event-driven patterns for stability

### Mathematical Grounding: Stability by Design

Based on emergent stability theory (Meena et al., 2023), we design for:

- **High β (heterogeneity)**: Enable diverse implementation approaches
- **s = 1 (cooperation)**: Prefer event-driven over direct coupling
- **S < 0 (stable)**: Architect for negative stability classifier

This ensures oak-mcp-core and its ecosystem will naturally self-organize into stable configurations as they grow.

## Architectural Principles

1. **Zero Dependencies in Core** - Generic components must have no external dependencies
2. **Test-Driven Development** - Write unit tests FIRST for all pure functions
3. **Dependency Injection** - All IO must be injected as arguments
4. **Boundary Validation** - External data validated at entry, SDK types used internally
5. **Pure Functions** - Maximize pure functions, minimize side effects
6. **Fail FAST** - Clear error messages, never fail silently
7. **No Type Assertions** - No `as`, no `any`, no `!` (non-null assertion)
8. **Fractal Patterns** - Same principles apply at function, module, and package levels
9. **Temporal Architecture** - Consider time dimension in all designs
10. **Ecosystem Thinking** - Design for future package interactions

## Current State Assessment (December 2024)

### Completed Work

1. **Logging Framework** (90% Complete)
   - Zero-dependency logger interface
   - Context logger with AsyncLocalStorage support
   - Console and file transports with dependency injection
   - JSON and pretty formatters as pure functions
   - Request tracing with correlation IDs
   - Comprehensive unit tests for core components

2. **Error Framework** (30% Complete)
   - Basic error classification and MCP error mapping
   - Error handler for Notion API errors

3. **Configuration Management** (50% Complete)
   - Environment validation with Zod
   - Type-safe configuration boundary
   - Notion-specific configuration

4. **MCP Tool Registry** (40% Complete)
   - Basic tool registry implementation
   - Tool factory pattern
   - Type definitions

### Key Gaps

- No oak-mcp-core folder structure yet
- Consola dependency still present (violates zero-dependency principle)
- Missing components: ChainedError, AsyncLocalStorage contexts, Result<T,E> utilities
- Incomplete test coverage using `.unit.test.ts` convention

## Success Metrics (Updated)

### Technical Metrics

- Extract 2,500-3,000 LoC into oak-mcp-core (adjusted from 3,050)
- Reduce oak-notion-mcp to <1,000 LoC (validation + adapters only)
- 100% test coverage on all pure functions
- Test file naming: `*.unit.test.ts` and `*.integration.test.ts`
- All quality gates passing (format, lint, type-check, test, build)
- Pre-commit and pre-push hooks working
- CI/CD with automated releases
- Migration time: 2-3 weeks (vs original 4-5 week estimate)

### Ecosystem Readiness Metrics

- **Symbiosis Factor**: How easily other packages can integrate
- **Environmental Adaptability**: Number of supported runtimes (4+)
- **Evolutionary Potential**: How easily patterns can be extended
- **Health Observability**: Built-in metrics and monitoring
- **Heterogeneity Index (β)**: Diversity of implementation patterns supported
- **Cooperation Score (s)**: Ratio of event-driven vs direct coupling
- **Stability Classifier (S)**: Predicted stability based on architecture

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

- **Core**: Zero external dependencies (requires consola removal)
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

### Runtime Feature Matrix (Environmental Adaptation)

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

This environmental adaptation ensures oak-mcp-core can thrive in diverse runtime ecosystems.

**Legend:**

- ✅ = Full support
- ✅ (variant) = Supported with different API
- ❌ = Not available (graceful degradation required)

## Risk Mitigation Schedule

- **Sub-phase 1**: Performance benchmarking baseline + Incremental migration
- **Sub-phase 2**: API design review checkpoint
- **Sub-phase 3**: Type safety audit
- **Sub-phase 4**: Bundle size optimization
- **Sub-phase 5**: Security review and beta feedback

## Updated Implementation Sub-phases

### Sub-phase 1: Foundation Restructuring (Priority: IMMEDIATE)

**Deliverables**: ~850 LoC | **Timeline**: 3-5 hours

#### Project Structure Setup (2-3 hours)

- [ ] Create folder structure:

  ```text
  src/
  ├── oak-mcp-core/        # First organism (pioneer species)
  │   ├── index.ts         # Cell membrane (single public API)
  │   ├── logging/         # Circulatory system
  │   ├── errors/          # Immune system
  │   ├── config/          # Regulatory system
  │   ├── validation/      # Digestive system (data intake)
  │   ├── mcp/            # Communication system
  │   ├── testing/        # Reproductive system (creating tests)
  │   └── ecosystem.ts    # Future ecosystem integration points
  └── oak-notion-mcp/      # Second organism (specialized)
      ├── index.ts         # Cell membrane
      ├── notion/          # Specialized organs
      ├── server.ts        # Nervous system
      └── types/           # Genetic information
  ```

- [ ] Move all existing source files to `src/oak-notion-mcp/`
- [ ] Create `src/oak-mcp-core/index.ts` as the only public API
- [ ] Update all imports and build configuration
- [ ] Configure TypeScript paths for clean imports
- [ ] Update README with new structure

#### Dependency Removal (1-2 hours)

- [ ] Remove consola dependency from oak-mcp-core components
- [ ] Create abstraction layer for any remaining external dependencies
- [ ] Verify zero dependencies in oak-mcp-core

#### Logging Framework Completion (2-3 hours)

**In oak-mcp-core (Circulatory System):**

- [x] Logger interface with zero dependencies ✅
- [x] ContextLogger with optional AsyncLocalStorage ✅
- [ ] Create Storage abstraction for context when AsyncLocalStorage unavailable
- [x] Transport implementations with injected IO ✅
- [x] Formatters as pure functions ✅
- [x] Request tracing with correlation IDs ✅
- [ ] Performance benchmarking (metabolic rate)
- [ ] Complete integration tests (health checks)
- [ ] Add temporal patterns (log rotation cycles)

**In oak-notion-mcp:**

- [ ] Import from `../../oak-mcp-core`
- [ ] Remove consola usage
- [ ] Verify logging in integration tests

#### Error Framework Completion (4-5 hours)

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

- [x] Basic NotionErrorHandler ✅
- [ ] Extend to use oak-mcp-core error framework
- [ ] Update all error handling to use framework

### Sub-phase 2: Core Infrastructure Completion

**Deliverables**: ~550 LoC | **Timeline**: 1-2 days

#### Configuration Management Completion (3-4 hours)

**In oak-mcp-core:**

- [ ] Write unit tests FIRST for ConfigManager
- [ ] Create multi-source configuration system
- [ ] Write unit tests for config sources
- [ ] Implement environment and file sources with injected IO
- [x] Schema validation with Zod integration ✅
- [ ] Write integration tests for hot-reload
- [ ] Implement config watching (injected watcher)

**In oak-notion-mcp:**

- [x] Environment validation ✅
- [ ] Migrate to full ConfigManager
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

**Deliverables**: ~800 LoC | **Timeline**: 2-3 days

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

#### Registry System Enhancement (200 LoC)

**In oak-mcp-core:**

- [ ] Extract generic registry base class from existing tool registry
- [ ] Add middleware support to registries
- [ ] Write unit tests for ResourceRegistry
- [ ] Implement URI matching and routing
- [x] Basic ToolRegistry ✅
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

**Deliverables**: ~850 LoC | **Timeline**: 2-3 days

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

**Deliverables**: Documentation + 3-4 example servers | **Timeline**: 2-3 days

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

## Immediate Next Steps

1. **Hour 1-2**: Create folder structure and move files
2. **Hour 3**: Remove consola dependency from logging components
3. **Hour 4**: Update imports and verify tests pass
4. **Hour 5+**: Complete error framework with TDD approach

## Risk Mitigation (Updated)

1. **Circular Dependencies**: Build in dependency order, test continuously
2. **API Design**: Start with minimal surface, expand based on needs
3. **Performance**: Benchmark each component, maintain <5% overhead
4. **Type Safety**: No compromises - full type safety throughout
5. **Testing**: 100% coverage on pure functions, integration tests for IO
6. **Incremental Migration**: Maintain backward compatibility during transition
7. **Existing Tests**: Leverage current test suite, don't rewrite from scratch

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
- Monitor bundle size and performance metrics

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

This updated plan builds on the significant refactoring progress already made. The modular structure and zero-dependency interfaces provide an excellent foundation. The main work now involves:

1. **Reorganization**: Create the oak-mcp-core folder structure as first organism
2. **Completion**: Finish partially implemented components (error framework, configuration)
3. **Extraction**: Move generic components to oak-mcp-core
4. **Zero Dependencies**: Remove consola and ensure true zero-dependency status
5. **Ecosystem Preparation**: Design for future symbiotic relationships

By the end:

- oak-mcp-core: 2,500-3,000 LoC of pure, generic MCP framework (pioneer organism)
- oak-notion-mcp: <1,000 LoC of Notion-specific validation and adapters (specialized organism)
- 3+ example servers demonstrating the patterns (future organisms)
- Clear path for ecosystem growth with multiple MCP servers

### Future Ecosystem Vision

```text
Ecosystem Evolution:
├── Phase 3: Pioneer organism (oak-mcp-core)
├── Phase 4: Specialized organisms (oak-notion-mcp, oak-github-mcp)
├── Phase 5: Ecosystem services (shared types, utilities)
└── Phase 6: Full ecosystem (multiple biomes, natural selection)
```

The key remains building in the right place from day one, with continuous validation through real use, while preparing for future ecosystem evolution.

### Mathematical Foundation

Our ecosystem design is grounded in complex systems theory. Research shows that:

1. **Heterogeneous networks naturally self-organize into stable states**
2. **Scale enhances stability when combined with diversity**
3. **Cooperative interactions (events) outperform competitive (direct calls)**
4. **Keystone species (oak-mcp-core) mathematically anchor ecosystems**

This isn't just metaphor - it's proven mathematics (Meena et al., 2023).

### References

Meena, C., Hens, C., Acharyya, S. et al. Emergent stability in complex network dynamics. Nat. Phys. 19, 1033–1042 (2023). https://doi.org/10.1038/s41567-023-02020-8
