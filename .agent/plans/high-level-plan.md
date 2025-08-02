# High Level Plan

## Vision

Create a production-ready MCP server that safely exposes Notion resources and tools to LLMs, enabling AI agents to manage Notion workspaces with human oversight and confirmation.

## Technical Overview

**MCP Transport**: stdio (for local execution as a subprocess)  
**Integration Type**: Internal Notion integration (API key based)  
**Core MCP Features**: Resources, Tools, and Prompts  
**Runtime**: Node.js 22+ (required)  
**Package Manager**: pnpm (exclusively)

## Core Principles

1. **Test-Driven Development (TDD)** - Every feature starts with tests
2. **Clean Architecture** - Pure functions, clear boundaries, mockable IO
3. **Safety First** - No Notion modifications without human confirmation
4. **Quality Gates** - Automated checks prevent regressions
5. **Best Practices** - Follow all documented standards rigorously
6. **Type Safety** - No `any`, no type assertions, validate at boundaries with Zod
7. **Dependency Injection** - All IO must be passed as arguments, never imported directly
8. **Fail FAST** - Clear error messages, never fail silently or swallow errors
9. **No Backward Compatibility Layers** - Use versioning, replace code directly
10. **Validate at System Boundaries** - Use Zod schemas and type guards to validate external data at entry points, then use Notion SDK types directly throughout the codebase. This creates a clear separation: external data → validation layer → trusted types in our system

## Development Phases

### Phase 1: Foundation Setup (Prerequisites for TDD)

**Outcome**: Fully configured development environment with all quality gates operational

**Key Deliverables**:

- [x] Complete package.json with all dependencies and scripts
- [x] TypeScript configuration with strict mode (ESM-only)
- [x] ESLint and Prettier configurations
- [x] Vitest configuration for all test types
- [x] Husky and lint-staged for pre-commit hooks
- [x] Commitlint for conventional commits
- [x] Basic MCP server skeleton with passing unit tests
- [x] GitHub Actions for CI/CD

**Quality Checkpoints**:

- All quality gate commands (`pnpm format`, `pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm build`) working
- Pre-commit hooks preventing non-compliant code
- Initial test suite passing (skeleton tests)

### Phase 2: Core MCP Implementation ✅ COMPLETED

**Outcome**: Functional MCP server with basic Notion read capabilities

**Detailed Plan**: See [Phase 2 Implementation Plan](phase-2-implementation-plan.md) for week-by-week breakdown

**Key Deliverables**:

- [x] MCP server implementation using stdio transport
- [x] Notion API client wrapper with proper error handling
- [x] **Resources** (read-only access):
  - [x] Static resource for workspace discovery (`notion://discovery`)
  - [x] Dynamic resource templates for users (`notion://users/{userId}`)
  - [x] Dynamic resource templates for pages (`notion://pages/{pageId}`)
  - [x] Dynamic resource templates for databases (`notion://databases/{databaseId}`)
- [x] **Tools** (read operations):
  - [x] `notion-search` - Search across workspace content
  - [x] `notion-list-databases` - List accessible databases
  - [x] `notion-query-database` - Query database with filters
  - [x] `notion-get-page` - Retrieve page content
  - [x] `notion-list-users` - List workspace users
- [x] **Prompts** (interaction templates):
  - Decided to use examples instead of prompt templates
- [x] Environment configuration (`.env` for API key)
- [x] Input validation using Zod at all boundaries
- [x] Structured error handling following MCP and Notion patterns
- [x] PII scrubbing for privacy protection
- [x] Comprehensive test suite (158 tests)
- [x] E2E testing with real Notion API
- [x] Code review completed

**Quality Checkpoints** ✅:

- 100% unit test coverage for pure functions
- Integration tests for all integration points
- Mocked tests for all Notion API interactions
- All quality gates passing
- Type safety with no `any` or type assertions

### Phase 2.9: Architectural Review & Modularization ✅ COMPLETED

**Outcome**: Complete architectural analysis identifying generic MCP components for extraction into `oak-mcp-core`.

**Key Findings**:

- **36% generic components** (9 modules, 695 LoC) - immediately extractable
- **40% mixed components** (10 modules, 1,114 LoC) - require refactoring
- **24% Notion-specific** (6 modules, 1,195 LoC) - remain in this package
- **80% edge compatibility** achievable with proper abstractions
- **No circular dependencies** found in the codebase

**Deliverables**: All analysis reports completed and available in [`.agent/generalisation-opportunities-analysis/`](../generalisation-opportunities-analysis/)

**Next Steps**: Proceed with Phase 3 enhancements or begin oak-mcp-core extraction based on the analysis.

### Phase 3: Strategic Enhancements (Framework-First Approach)

**Outcome**: Build generic MCP abstractions first, then specialize for Notion, preparing ~3,050 LoC for oak-mcp-core extraction

**Strategy**: Every enhancement creates reusable abstractions that will form oak-mcp-core's foundation. All external data validation happens at boundaries using Zod schemas and type guards

**Key Deliverables**:

- [ ] **Enhanced Logging Framework** (foundation layer - no dependencies):
  - [ ] Create zero-dependency `Logger` interface (~50 LoC extractable)
  - [ ] Implement `ContextLogger` with AsyncLocalStorage correlation (~150 LoC)
  - [ ] Add transport abstraction with console and file transports (~150 LoC)
  - [ ] Create JSON and pretty formatters with error serialization (~100 LoC)
  - [ ] Implement request tracing with correlation IDs (~50 LoC)
  - [ ] Add performance logging integration (~50 LoC)
  - [ ] Create buffered, async non-blocking transports
  - [ ] Ensure edge-runtime compatibility (abstract file system)

- [ ] **Generic MCP Server Base Class** (replaces direct SDK migration):
  - [ ] Create abstract `McpServerBase<TConfig, TDeps>` class (~150 LoC extractable)
  - [ ] Implement lifecycle management (start, stop, health checks)
  - [ ] Add plugin architecture for handlers
  - [ ] Create `NotionMcpServer extends McpServerBase`
  - [ ] Migrate existing server.ts to use new base class

- [ ] **Enhanced Error Framework** (generic first, Notion second):
  - [ ] Create `ChainedError` class that preserves full error chain (~300 LoC extractable)
  - [ ] Implement structured error types with categories and metadata
  - [ ] Add `ErrorContext` with AsyncLocalStorage for context preservation
  - [ ] Create `RecoveryStrategy` interface with exponential backoff
  - [ ] Implement `ErrorReporter` for monitoring and metrics
  - [ ] Add error boundaries for all handlers with context extraction
  - [ ] Create `Result<T, E>` type for type-safe error handling
  - [ ] Implement `ErrorSanitizer` for sensitive data protection
  - [ ] Add `NotionErrorHandler` using SDK's `APIErrorCode` enum
  - [ ] Ensure every error includes: cause, context, timestamp, unique ID

- [ ] **Generic Pagination Framework**:
  - [ ] Create `PaginationStrategy<T, TCursor>` interface (~100 LoC extractable)
  - [ ] Implement `PaginationHandler` with AsyncGenerator support
  - [ ] Add `NotionPaginationStrategy` using `iteratePaginatedAPI`
  - [ ] Handle page_size limits generically
  - [ ] Support both cursor and offset pagination patterns

- [ ] **Type Guard Registry Framework**:
  - [ ] Create `TypeGuardRegistry<T>` for composable guards (~80 LoC extractable)
  - [ ] Implement composite guard creation
  - [ ] Register SDK guards (`isFullPage`, `isFullDatabase`)
  - [ ] Add custom domain type guards
  - [ ] Zero type assertions policy

- [ ] **Resource Linking Pattern**:
  - [ ] Create `ResourceLinker` interface (~75 LoC extractable)
  - [ ] Implement `ResourceLinkingHandler` for response transformation
  - [ ] Add URI extraction and reference creation
  - [ ] Reduce response payloads universally
  - [ ] Enable cross-resource references

- [ ] **Performance Instrumentation Layer**:
  - [ ] Create `PerformanceMonitor` interface (~100 LoC extractable)
  - [ ] Implement `PerformanceMiddleware` for handler wrapping
  - [ ] Add pluggable metric backends
  - [ ] Zero overhead when disabled
  - [ ] Prepare for caching and rate limiting integration points

- [ ] **Configuration Management System**:
  - [ ] Create `ConfigManager` with multi-source support (~200 LoC extractable)
  - [ ] Implement `ConfigSchema` interface with validation
  - [ ] Add environment and file config sources
  - [ ] Integrate with Zod for schema validation
  - [ ] Support config hot-reloading

- [ ] **Testing Utilities Framework**:
  - [ ] Create `TestMcpServer` for in-process testing (~200 LoC extractable)
  - [ ] Implement `TestTransport` for mocking MCP communication
  - [ ] Add `TestDataBuilder` for common test scenarios
  - [ ] Create test assertion helpers
  - [ ] Support snapshot testing for responses

- [ ] **Middleware System**:
  - [ ] Create composable middleware stack with Next pattern (~150 LoC extractable)
  - [ ] Implement common middleware (logging, error handling, validation)
  - [ ] Add timing and correlation middleware
  - [ ] Support async middleware execution
  - [ ] Create middleware composition utilities

- [ ] **Registry System**:
  - [ ] Create generic `Registry<T>` base class (~200 LoC extractable)
  - [ ] Implement `ResourceRegistry` with URI matching
  - [ ] Implement `ToolRegistry` with middleware support
  - [ ] Add registry middleware composition
  - [ ] Create dynamic registration and discovery

- [ ] **Lifecycle Management**:
  - [ ] Create `LifecycleManager` for component orchestration (~100 LoC extractable)
  - [ ] Implement startup/shutdown sequences with rollback
  - [ ] Add component dependency ordering
  - [ ] Support graceful degradation
  - [ ] Create health check integration

- [ ] **Validation Framework**:
  - [ ] Create `ValidationChain` for composable validators (~150 LoC extractable)
  - [ ] Implement common validators (string, required, url, etc.)
  - [ ] Add Zod integration adapter
  - [ ] Support transform operations
  - [ ] Create boundary validation helpers

**Implementation Order** (3 weeks):

1. **Week 1: Foundation Layers** (1,550 LoC extractable)
   - Enhanced Logging Framework (no dependencies) - 550 LoC
   - Enhanced Error Framework (depends on logger) - 300 LoC
   - Configuration Management System - 200 LoC
   - Testing Utilities Framework - 200 LoC
   - Validation Framework - 150 LoC
   - Generic MCP Server Base Class (depends on all) - 150 LoC

2. **Week 2: Core Patterns** (1,450 LoC extractable)
   - Middleware System - 150 LoC
   - Registry System (resources/tools) - 200 LoC
   - Type Guard Registry Framework - 80 LoC
   - Generic Pagination Framework - 100 LoC
   - Resource Linking Pattern - 75 LoC
   - Performance Instrumentation - 100 LoC
   - Lifecycle Management - 100 LoC
   - Additional utilities (Result type, etc.) - 50 LoC
   - Boundary validation patterns - 595 LoC

3. **Week 3: Integration & Polish**
   - Implement all Notion-specific versions with boundary validation
   - Migrate existing code to new abstractions
   - Apply validation at all external data entry points
   - Document patterns for oak-mcp-core
   - Performance testing and optimization

**Quality Checkpoints** (after each component):

- `pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build`
- Verify zero integration-specific dependencies in generic components
- Ensure 100% test coverage for new abstractions
- Document extraction readiness in component headers
- Benchmark performance impact (<5% overhead)

**Success Metrics**:

- **For Phase 3**: All existing tests pass, 20%+ performance improvement
- **For Future 2 prep**: 3,050 LoC extractable (exceeding 100% of current codebase)
- All abstractions follow SOLID principles and are runtime-agnostic
- Clear separation between generic and Notion-specific code
- All external data validated at boundaries before entering core system
- Zero errors lost through propagation chain
- 100% of errors include full context and are sanitized
- All logging is structured, correlated, and edge-compatible
- Configuration system supports multiple sources and hot-reloading
- Test utilities enable rapid MCP server development
- Notion SDK types used consistently after boundary validation

### Phase Future 1: Production Readiness

**Outcome**: Published npm package ready for public use

**Key Deliverables**:

- [ ] **Documentation**:
  - [ ] README with quick start guide
  - [ ] API documentation for all resources, tools, and prompts
  - [ ] Configuration guide for different MCP clients
  - [ ] Troubleshooting guide
  - [ ] Security best practices guide
- [ ] **Example Configurations**:
  - [ ] Example `.mcp.json` for Claude Desktop:

    ```json
    {
      "mcpServers": {
        "notion": {
          "command": "npx",
          "args": ["-y", "oak-notion-mcp"],
          "env": {
            "NOTION_API_KEY": "${NOTION_API_KEY}"
          }
        }
      }
    }
    ```

  - [ ] Example configurations for other MCP clients
  - [ ] Sample Notion workspace setup guide

- [ ] **Distribution**:
  - [ ] NPM package configuration
  - [ ] Semantic versioning with conventional commits
  - [ ] Automated release process via semantic-release
  - [ ] Package entry points for both CLI and programmatic use
- [ ] **CI/CD Pipeline**:
  - [x] GitHub Actions for automated testing
  - [x] Automated GitHub releases via semantic-release
  - [ ] Automated npm publishing on release (currently disabled)
  - [ ] Security scanning for dependencies
  - [ ] Code coverage reporting

**Quality Checkpoints**:

- Documentation review completed
- Package installable via `npx oak-notion-mcp`
- Example integrations working with Claude Desktop
- Community feedback incorporated

### Phase Future 2: Framework Extraction

**Outcome**: Extract oak-mcp-core library containing the generic MCP components built in Phase 3, creating a reusable framework for building MCP servers at Oak National and beyond.

**Key Deliverables**:

- [ ] **oak-mcp-core Library Creation** (3-week timeline):
  - [ ] Week 1: Repository setup and core extraction
    - [ ] Set up oak-mcp-core repository with TDD infrastructure
    - [ ] Extract foundation layers (logging, errors, config) - 1,050 LoC
    - [ ] Establish build and publishing pipeline
    - [ ] Ensure all IO is injectable, no hardcoded imports
  - [ ] Week 2: Pattern extraction and API design
    - [ ] Extract remaining patterns and utilities - 2,000 LoC
    - [ ] Design public API surface (pure functions preferred)
    - [ ] Create plugin architecture with dependency injection
    - [ ] Implement edge runtime abstractions
  - [ ] Week 3: Migration and documentation
    - [ ] Migrate oak-notion-mcp to use oak-mcp-core
    - [ ] Create comprehensive documentation
    - [ ] Build example MCP servers (echo, file browser, HTTP wrapper)
    - [ ] Publish to npm as @oak-national/mcp-core

- [ ] **oak-notion-mcp Migration**:
  - [ ] Update imports to use @oak-national/mcp-core
  - [ ] Extend base classes from core library
  - [ ] Remove duplicated generic code (~3,050 LoC)
  - [ ] Keep only Notion-specific validation and adapters
  - [ ] Update tests to use core testing utilities
  - [ ] Result: oak-notion-mcp becomes <1,000 LoC thin integration layer

- [ ] **Documentation and Examples**:
  - [ ] API documentation for oak-mcp-core
  - [ ] Migration guide from direct SDK usage
  - [ ] Example MCP server using oak-mcp-core
  - [ ] Edge deployment guides (CF Workers, Vercel, etc.)

**Quality Checkpoints**:

- 100% test coverage for oak-mcp-core
- Zero breaking changes in oak-notion-mcp
- Successfully deploy example server to CF Workers
- Second MCP integration built using oak-mcp-core in <500 LoC
- All boundary validations properly separated from core logic
- 4+ runtime environments supported (Node.js, Deno, Bun, edge)

### Phase Future 3: Write Tools and Safety Controls

**Outcome**: Full-featured MCP server with write capabilities and safety controls

**Key Deliverables**:

- [ ] **Write Tools** (with mandatory confirmation):
  - [ ] `notion-create-page` - Create new pages with confirmation
  - [ ] `notion-update-page` - Update page content with confirmation
  - [ ] `notion-create-database-entry` - Add database items with confirmation
  - [ ] `notion-update-database-entry` - Modify database items with confirmation
  - [ ] `notion-add-comment` - Add comments to pages with confirmation
- [ ] **Safety Controls**:
  - [ ] Human confirmation system for all write operations
  - [ ] Operation preview before execution
  - [ ] Rollback capability tracking
  - [ ] Audit log of all operations
- [ ] **Advanced Features**:
  - [ ] Resource subscriptions for real-time updates
  - [ ] Batch operations support
  - [ ] Advanced database filtering with Notion's query language
  - [ ] Template system for common operations
- [ ] **Performance & Reliability**:
  - [ ] Response caching for frequently accessed resources
  - [ ] Rate limiting to respect Notion API quotas
  - [ ] Exponential backoff for retries
  - [ ] Graceful degradation on API errors
- [ ] Configurable logging levels (following Notion SDK pattern)

**Quality Checkpoints**:

- E2E tests demonstrating safety controls
- Performance benchmarks established
- Security audit passed
- All test types (unit, integration, API, E2E) passing

## Success Metrics

1. **Code Quality**
   - Zero TypeScript errors
   - Zero ESLint violations
   - 100% prettier compliance
   - No failing tests

2. **Test Coverage**
   - 100% unit test coverage for pure functions
   - All integration points have integration tests
   - All API endpoints have API tests
   - Critical paths have E2E tests

3. **Safety**
   - Zero unauthorized Notion modifications
   - All write operations require explicit confirmation
   - Comprehensive audit trail

4. **Usability**
   - Installation takes < 5 minutes
   - Configuration is well-documented
   - Works with major MCP clients out-of-the-box

## Risk Mitigation

1. **Technical Risks**
   - Notion API changes: Abstract API calls behind interfaces
   - MCP protocol evolution: Follow SDK best practices
   - Performance issues: Implement caching and rate limiting early

2. **Security Risks**
   - API key exposure: Use environment variables, never commit secrets
   - Unauthorized access: Implement proper authentication
   - Data leakage: Validate all inputs/outputs

## Development Workflow

1. For each feature:
   - Write tests first (TDD)
   - Implement minimal code to pass tests
   - Refactor for clarity and performance
   - Run all quality gates
   - Commit with conventional message

2. Before each commit:
   - `pnpm format`
   - `pnpm type-check`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`

3. Regular grounding:
   - Read GO.md every third task
   - Review best practices documentation
   - Ensure alignment with project vision

## Development Standards

### Code Design

- **DRY, KISS, YAGNI** - Avoid duplication, keep it simple, build only what's needed
- **Pure functions preferred** - Minimize side effects for testability
- **Clear boundaries** - Well-defined interfaces between modules

### Architecture

- **SOLID principles** (loosely) - Focus on single responsibility
- **Clean Architecture** - Separate concerns into layers
- **Mockable IO** - All external interactions must be injectable

### Version Control

- **GitHub flow** - Feature branches merge to main
- **Conventional commits** - Enforced by commitlint
- **Semantic versioning** - Automated releases via semantic-release

### Tooling

- **Latest versions** - All tools must use latest versions (check with `pnpm outdated`)
- **Node.js 22+** - Required runtime version
- **pnpm only** - No npm or yarn allowed

## Expected User Experience

### Installation (< 5 minutes)

1. User creates Notion integration and gets API key
2. User adds server to Claude Desktop via `.mcp.json`
3. User sets `NOTION_API_KEY` environment variable
4. Server automatically connects when Claude Desktop starts

### Usage Examples

- **Reading**: "Show me all tasks due this week from my project database"
- **Searching**: "Find all pages mentioning 'Q4 planning'"
- **Writing** (with confirmation): "Add a new task to my database for reviewing the sales report"
- **Analysis**: "Summarize the key decisions from yesterday's meeting notes"

### Safety Features

- All write operations show preview and require explicit confirmation
- Clear indication of what will be modified
- Audit trail of all operations performed
- No automatic modifications without user consent
