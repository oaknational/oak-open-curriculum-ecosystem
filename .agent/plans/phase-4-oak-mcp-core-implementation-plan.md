# Phase 4: oak-mcp-core Genotype Extraction Plan

## Goal
Extract oak-mcp-core as the MCP genotype - the genetic blueprint that all MCP organisms inherit.

## Current Status: Sub-phase 1 ✅ COMPLETED (2025-01-06)

### What Was Achieved
- **Monorepo Architecture**: pnpm workspace with Turborepo orchestration
- **Genotype/Phenotype Separation**: Clean architectural separation
- **Bundle Size**: Reduced from 708KB to 25.8KB (96% reduction)
- **Zero Dependencies**: oak-mcp-core has no runtime dependencies
- **Quality Gates**: All passing with 172 tests
- **Performance**: 90%+ speed improvements with Turborepo caching

### Current Structure
```
ecosystem/
├── oak-mcp-core/          # The MCP genotype (zero dependencies)
│   └── src/
│       ├── chora/         # Shared genetic traits
│       │   ├── aither/    # Logging, events, errors
│       │   ├── stroma/    # Types and contracts
│       │   ├── phaneron/  # Configuration
│       │   ├── eidola/    # Test utilities
│       │   └── morphai/   # Abstract patterns
│       └── index.ts       # Public API
└── oak-notion-mcp/        # Notion phenotype
    └── src/
        ├── psychon/       # Application wiring
        ├── organa/        # Business logic
        └── index.ts       # Entry point
```

## Remaining Work: Sub-phases 2-5

### Sub-phase 2: Core Infrastructure Completion
**Goal**: Complete the essential infrastructure components that Sub-phase 1 prepared for.

#### 2.1 Error Framework (~300 LoC)
- [ ] Write unit tests for ChainedError class
- [ ] Implement ChainedError with full context preservation
- [ ] Write unit tests for ErrorContext with AsyncLocalStorage
- [ ] Implement error context tracking
- [ ] Write unit tests for Result<T,E> type utilities
- [ ] Implement functional error handling patterns
- [ ] Integrate with existing NotionErrorHandler

#### 2.2 Configuration Management (~200 LoC)
- [ ] Write unit tests for ConfigManager
- [ ] Implement multi-source configuration (env, file, defaults)
- [ ] Write unit tests for hot-reload capability
- [ ] Implement configuration watching with injected watcher
- [ ] Migrate oak-notion-mcp to use ConfigManager

#### 2.3 Validation Framework (~150 LoC)
- [ ] Write unit tests for ValidationChain
- [ ] Implement composable validator interface
- [ ] Write unit tests for common validators (string, url, required)
- [ ] Create Zod adapter for boundary validation
- [ ] Implement BoundaryValidator pattern for oak-notion-mcp

### Sub-phase 3: MCP Core Patterns
**Goal**: Create reusable MCP server patterns.

#### 3.1 Server Base & Middleware (~300 LoC)
- [ ] Write unit tests for McpServerBase abstract class
- [ ] Implement server lifecycle hooks (startup/shutdown)
- [ ] Write unit tests for middleware stack
- [ ] Implement Next-pattern middleware system
- [ ] Create common middleware (logging, validation, error)
- [ ] Migrate NotionMcpServer to extend base class

#### 3.2 Registry System (~200 LoC)
- [ ] Extract generic registry pattern from existing ToolRegistry
- [ ] Write unit tests for ResourceRegistry
- [ ] Implement URI matching and routing for resources
- [ ] Add middleware support to registries
- [ ] Integrate with oak-notion-mcp handlers

#### 3.3 Type Guards & Pagination (~300 LoC)
- [ ] Write unit tests for TypeGuardRegistry
- [ ] Implement composable type guard system (AND/OR combinators)
- [ ] Write unit tests for PaginationHandler
- [ ] Implement AsyncGenerator-based pagination
- [ ] Create cursor and offset pagination strategies
- [ ] Apply to oak-notion-mcp list operations

### Sub-phase 4: Advanced Patterns & Testing
**Goal**: Add performance monitoring and comprehensive testing utilities.

#### 4.1 Performance & Lifecycle (~200 LoC)
- [ ] Write unit tests for PerformanceMonitor
- [ ] Implement metrics collection with Timer abstraction
- [ ] Write unit tests for LifecycleManager
- [ ] Implement component orchestration with rollback
- [ ] Add to oak-notion-mcp for instrumentation

#### 4.2 Testing Utilities (~200 LoC)
- [ ] Write unit tests for TestMcpServer
- [ ] Implement in-process test server
- [ ] Create TestTransport for mocking
- [ ] Implement TestDataBuilder pattern
- [ ] Add custom MCP assertions
- [ ] Migrate oak-notion-mcp tests to use utilities

#### 4.3 Final Migration (~350 LoC)
- [ ] Complete migration of all generic code to oak-mcp-core
- [ ] Verify oak-notion-mcp is <1,000 LoC
- [ ] Optimize bundle sizes
- [ ] Performance benchmarking
- [ ] Security audit

### Sub-phase 5: Documentation & Examples
**Goal**: Make oak-mcp-core ready for ecosystem adoption.

#### 5.1 Documentation
- [ ] Write comprehensive API documentation
- [ ] Create getting started guide
- [ ] Document all design patterns with examples
- [ ] Write migration guide from direct SDK usage
- [ ] Create troubleshooting guide

#### 5.2 Example Servers
- [ ] Echo Server - Pure functions demo (100 LoC)
- [ ] File Browser - IO injection patterns (200 LoC)
- [ ] GitHub MCP - Real-world complexity (300 LoC)
- [ ] Full test coverage for each example

#### 5.3 Release Preparation
- [ ] Prepare npm package configuration
- [ ] Set up semantic versioning
- [ ] Create changelog
- [ ] Beta release to early adopters
- [ ] Incorporate feedback
- [ ] Publish as @oaknational/mcp-core

## Success Metrics

### Technical Requirements
- oak-mcp-core: ~3,000 LoC of shared infrastructure
- oak-notion-mcp: <1,000 LoC (Notion-specific only)
- Zero runtime dependencies in oak-mcp-core
- 100% test coverage on pure functions
- All quality gates passing

### Performance Targets
- Logging: <1ms overhead per operation
- Middleware: <0.5ms per layer
- Memory: <10MB base footprint
- Bundle: <50KB minified + gzipped
- Startup: <100ms cold start

### Runtime Support
- Node.js 18+
- Deno
- Bun
- Cloudflare Workers
- Vercel Edge Runtime

## Quality Checkpoints
After each component:
```bash
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build
```

## Implementation Notes

### Testing Strategy
- Write tests FIRST (TDD mandatory)
- Unit tests: `*.unit.test.ts`
- Integration tests: `*.integration.test.ts`
- Tests co-located with code

### Dependency Rules
- Zero external dependencies in oak-mcp-core
- All IO must be injected
- Runtime abstractions over polyfills
- Feature detection for graceful degradation

### Migration Approach
- Progressive transformation
- Maintain functionality at every step
- Verify with existing test suite
- No breaking changes during migration

## Next Immediate Actions
1. Start Sub-phase 2.1: Error Framework
2. Write ChainedError unit tests first
3. Implement ChainedError class
4. Continue TDD cycle for each component