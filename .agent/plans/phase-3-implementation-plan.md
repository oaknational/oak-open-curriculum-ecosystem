# Phase 3 Implementation Plan: Strategic Enhancements

## Overview

Phase 3 focuses on building generic MCP abstractions within oak-notion-mcp that will later be extracted to oak-mcp-core. Every enhancement must answer: "Will this help oak-mcp-core?"

## Objectives

1. Build generic abstractions first, then specialize for Notion
2. Prepare ~2,500 LoC for future extraction (83% of codebase)
3. Improve performance by 20%+ while adding abstractions
4. Maintain stability through versioning (no backward compatibility layers)
5. Follow TDD/BDD with pure functions and simple mocks
6. All IO must be injected as arguments (dependency injection)
7. Fail FAST with helpful errors, never fail silently
8. No type assertions (`as`), no `any`, no `!` (non-null assertion)

## Week 1: Foundation Layers (1,550 LoC extractable)

### Day 1-2: Enhanced Logging Framework (550 LoC)

**Why First**: Zero dependencies, everything else depends on logging

**Deliverables**:

- [ ] Create `src/logging/logger-interface.ts` with zero-dependency Logger interface
- [ ] Implement `src/logging/context-logger.ts` with AsyncLocalStorage
- [ ] Create console and file transports in `src/logging/transports/`
- [ ] Add JSON and pretty formatters in `src/logging/formatters/`
- [ ] Implement request tracing in `src/logging/request-tracing.ts`
- [ ] Write unit tests FIRST (TDD) with pure functions
- [ ] Ensure all transports are passed as arguments (dependency injection)
- [ ] Update existing console.log calls to use new logger

**Key Design Decisions**:

- Zero external dependencies in core
- AsyncLocalStorage for correlation IDs
- Non-blocking async writes
- Edge-compatible abstractions

### Day 3-4: Enhanced Error Framework (300 LoC)

**Deliverables**:

- [ ] Create `src/errors/error-chain.ts` with ChainedError class
- [ ] Implement structured error types in `src/errors/error-types.ts`
- [ ] Add ErrorContext with AsyncLocalStorage in `src/errors/error-context.ts`
- [ ] Create recovery strategies in `src/errors/recovery-strategies.ts`
- [ ] Implement error reporters in `src/errors/error-reporter.ts`
- [ ] Add error sanitizer for PII protection
- [ ] Ensure errors fail FAST with helpful messages
- [ ] Create Result<T, E> type for functional error handling
- [ ] Integrate with logging framework
- [ ] Write unit tests FIRST (TDD) with simple mock scenarios
- [ ] Ensure all error handlers are pure functions where possible

**Critical Requirements**:

- Never lose original error
- Always include context
- Sanitize sensitive data
- Support structured retry logic

### Day 5: Configuration, Validation & Testing (550 LoC)

**Configuration Management (200 LoC)**:

- [ ] Create `src/config/config-manager.ts` with multi-source support
- [ ] Implement environment and file config sources
- [ ] Add Zod schema integration
- [ ] Create hot-reload capability (with injected file watcher)
- [ ] Write unit tests FIRST (TDD) with mock config sources as arguments
- [ ] Ensure config sources are injected, not imported

**Validation Framework (150 LoC)**:

- [ ] Create `src/validation/validator.ts` interface
- [ ] Implement ValidationChain for composable validators
- [ ] Add common validators (string, required, url, etc.)
- [ ] Create Zod integration adapter
- [ ] Write unit tests FIRST (TDD) for all validators
- [ ] Ensure validators are pure functions

**Testing Utilities (200 LoC)**:

- [ ] Create `src/testing/test-server.ts` for in-process testing
- [ ] Implement TestTransport for mocking
- [ ] Add TestDataBuilder for common scenarios
- [ ] Create assertion helpers
- [ ] Document testing patterns
- [ ] Ensure all test doubles are simple fakes

## Week 2: Core Patterns (950 LoC extractable)

### Day 1: Type Safety Enhancements (80 LoC)

**Type Guard Registry**:

- [ ] Create `src/utils/type-guards/registry.ts`
- [ ] Implement composite guard creation
- [ ] Register Notion SDK guards (isFullPage, etc.)
- [ ] Add custom domain guards
- [ ] Write unit tests FIRST (TDD) proving type narrowing
- [ ] Use meaningful `is` predicates, never type assertions

### Day 2: Pagination Framework (100 LoC)

**Generic Pagination**:

- [ ] Create `src/utils/pagination/strategy.ts` interface
- [ ] Implement PaginationHandler with AsyncGenerator
- [ ] Add NotionPaginationStrategy
- [ ] Support cursor and offset patterns
- [ ] Write unit tests FIRST (TDD) with mock paginated data
- [ ] Ensure pagination handlers are pure functions with injected IO

### Day 3: Resource Patterns (75 LoC)

**Resource Linking**:

- [ ] Create `src/mcp/patterns/resource-linking.ts`
- [ ] Implement URI extraction and reference creation
- [ ] Add response transformation
- [ ] Write unit tests FIRST (TDD) for payload size reduction
- [ ] Ensure transformers are pure functions

### Day 4: Performance & Middleware (250 LoC)

**Performance Monitoring (100 LoC)**:

- [ ] Create `src/monitoring/performance.ts` interface
- [ ] Implement timer and metric recording
- [ ] Add middleware integration
- [ ] Write unit tests FIRST (TDD) for performance monitoring
- [ ] Test overhead is <5% using simple mocks

**Middleware System (150 LoC)**:

- [ ] Create `src/middleware/middleware.ts` with Next pattern
- [ ] Implement MiddlewareStack with async support
- [ ] Add common middleware (logging, validation, errors)
- [ ] Create timing and correlation middleware
- [ ] Write unit tests FIRST (TDD) for composition and error propagation
- [ ] Ensure middleware are pure functions with Next pattern
- [ ] Document middleware patterns

### Day 5: MCP Base & Registry System (500 LoC)

**Generic Base Class (150 LoC)**:

- [ ] Create `src/mcp/base/mcp-server-base.ts`
- [ ] Add lifecycle management hooks
- [ ] Implement plugin architecture
- [ ] Create NotionMcpServer extending base
- [ ] Migrate existing server.ts
- [ ] Write unit tests FIRST (TDD) for startup/shutdown sequences
- [ ] Mock all IO operations, pass as arguments

**Registry System (200 LoC)**:

- [ ] Create `src/registry/registry.ts` base class
- [ ] Implement ResourceRegistry with URI matching
- [ ] Implement ToolRegistry with middleware support
- [ ] Add registry middleware composition
- [ ] Create Notion-specific registries
- [ ] Write unit tests FIRST (TDD) for registration and lookup
- [ ] Ensure registry operations are pure where possible

**Lifecycle Management (100 LoC)**:

- [ ] Create `src/lifecycle/lifecycle.ts` interface
- [ ] Implement LifecycleManager with rollback
- [ ] Add component dependency ordering
- [ ] Write unit tests FIRST (TDD) for startup/shutdown sequences
- [ ] Mock all IO operations, pass as arguments
- [ ] Write unit tests FIRST (TDD) for graceful degradation
- [ ] Fail FAST with helpful error messages, never fail silently

**Additional Utilities (50 LoC)**:

- [ ] Create Result<T, E> type in `src/utils/result.ts`
- [ ] Add functional error handling helpers
- [ ] Document usage patterns

## Week 3: Integration & Polish

### Day 1: Notion-Specific Implementations

**Implement Notion versions of all abstractions**:

- [ ] NotionErrorHandler with APIErrorCode mapping
- [ ] Notion-specific configuration schema
- [ ] Notion pagination strategy
- [ ] Notion-specific type guards
- [ ] Write integration tests with mocked Notion API (simple fakes)
- [ ] Pass all IO operations as arguments, no direct imports

### Day 2: Registry Implementation & Pattern Application

**GROUNDING**: Read GO.md and follow all instructions

**Complete Registry Integration**:

- [ ] Register all existing resources in ResourceRegistry
- [ ] Register all existing tools in ToolRegistry
- [ ] Apply middleware to all handlers
- [ ] Implement resource linking for all responses
- [ ] Add performance monitoring to critical paths

### Day 3: Migration & Refactoring

**Update existing code to use new abstractions**:

- [ ] Replace console.log with logger
- [ ] Use ChainedError for all error handling
- [ ] Migrate to ConfigManager
- [ ] Add middleware to all handlers
- [ ] Update tests to use TestMcpServer

### Day 4: Performance & Documentation

**GROUNDING**: Read GO.md and follow all instructions

**Performance Testing**:

- [ ] Benchmark before/after each abstraction
- [ ] Ensure <5% overhead
- [ ] Profile memory usage
- [ ] Optimize hot paths

**Documentation**:

- [ ] Mark all generic components with extraction readiness
- [ ] Document design decisions
- [ ] Create migration guide
- [ ] Add usage examples

### Day 5: Final Integration & Review

**Quality Assurance**:

- [ ] Run full test suite
- [ ] Check 100% coverage on new code
- [ ] Verify all quality gates pass
- [ ] Performance regression testing
- [ ] Code review checklist

## Success Criteria

### Technical Metrics

- [ ] All existing tests pass
- [ ] 100% test coverage on new abstractions
- [ ] Performance improvement of 20%+
- [ ] No breaking changes in existing API (use versioning if needed)
- [ ] All abstractions are edge-compatible

### Extraction Readiness

- [ ] 2,500 LoC marked as extractable
- [ ] Clear separation between generic/specific
- [ ] No Notion dependencies in generic code
- [ ] All abstractions follow SOLID principles

### Code Quality

- [ ] No type assertions (as)
- [ ] No any types
- [ ] All functions are pure where possible
- [ ] Simple mocks only (passed as arguments)
- [ ] Never mock with complex stubs or spies
- [ ] Comprehensive error handling

## Risk Mitigation

1. **Over-abstraction**: Start simple, iterate based on real needs
2. **Performance**: Benchmark continuously, rollback if needed
3. **Complexity**: If it's hard to explain, redesign it
4. **Time**: Focus on highest-value abstractions first
5. **Never use backward compatibility layers**: Replace old code directly
6. **Always write tests FIRST**: TDD is mandatory, not optional
7. **IO injection**: All IO must be passed as arguments, never imported directly

## Dependencies

- Current oak-notion-mcp codebase
- Node.js 22+
- TypeScript 5.8+
- Existing test infrastructure

## Next Phase Preparation

This phase prepares for Phase Future 2 by:

- Creating clear module boundaries
- Establishing abstraction patterns
- Proving the abstractions work
- Documenting extraction points

Every line of code should be written with extraction in mind!
