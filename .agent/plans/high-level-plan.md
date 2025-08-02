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

### Phase 3: oak-mcp-core Framework Implementation

**Outcome**: Create oak-mcp-core as a comprehensive MCP server framework while simultaneously migrating oak-notion-mcp to use it

**Strategy**: Build generic components directly in oak-mcp-core from day one, validating them through real use in oak-notion-mcp. All external data validation happens at boundaries using Zod schemas and type guards

**Detailed Plan**: See [Phase 3 oak-mcp-core Implementation Plan](phase-3-oak-mcp-core-implementation-plan.md) for week-by-week breakdown

**Dependency Management Strategy**:

- Zero external dependencies in core components
- Runtime abstractions instead of polyfills (Timer, Storage interfaces)
- TypeScript as peer dependency with version range 5.0+
- Zod integration through adapters, not direct dependency
- All dependencies injected, never imported directly
- Graceful degradation for runtime-specific features

**Testing Strategy**:

- Unit tests (`*.unit.test.ts`) for all pure functions - TDD mandatory
- Integration tests (`*.integration.test.ts`) for boundary validation
- End-to-end tests for oak-notion-mcp using oak-mcp-core
- Continuous integration testing during migration
- Performance benchmarks tracked in CI

**Key Deliverables**:

- [ ] **oak-mcp-core Framework Creation**:
  - [ ] Create `src/oak-mcp-core/` folder structure
  - [ ] Single public API via `src/oak-mcp-core/index.ts`
  - [ ] Build 3,050 LoC of generic MCP framework components
  - [ ] Zero external dependencies in core components
  - [ ] 100% test coverage using TDD (tests written first)
  - [ ] Support for 4+ runtime environments via abstractions
  - [ ] Prepare for future extraction to @oaknational/mcp-core

- [ ] **Core Framework Components**:
  - [ ] Logging Framework - Zero-dependency with AsyncLocalStorage (550 LoC)
  - [ ] Error Framework - ChainedError with full context preservation (300 LoC)
  - [ ] Configuration Management - Multi-source with validation (200 LoC)
  - [ ] Validation Framework - Composable validators with Zod (150 LoC)
  - [ ] Testing Utilities - In-process server and mocks (200 LoC)
  - [ ] MCP Server Base - Abstract class with lifecycle hooks (150 LoC)
  - [ ] Middleware System - Next pattern with composition (150 LoC)
  - [ ] Registry System - Generic with middleware support (200 LoC)
  - [ ] Type Guards - Composable registry pattern (150 LoC)
  - [ ] Pagination - AsyncGenerator with strategies (150 LoC)
  - [ ] Performance Monitoring - <5% overhead (100 LoC)
  - [ ] Lifecycle Management - Orchestration with rollback (100 LoC)
  - [ ] Resource Linking - Cross-reference patterns (75 LoC)
  - [ ] Additional Utilities - Result type, helpers (575 LoC)

- [ ] **oak-notion-mcp Migration**:
  - [ ] Move all current files to `src/oak-notion-mcp/` folder
  - [ ] Progressively adopt oak-mcp-core components via imports
  - [ ] Create NotionMcpServer extending base class
  - [ ] Implement boundary validation for all Notion data
  - [ ] Remove all generic code (3,050 LoC reduction)
  - [ ] Final size: <1,000 LoC of Notion-specific code

- [ ] **Example Implementations**:
  - [ ] Echo Server - Pure functions demonstration (100 LoC)
  - [ ] File Browser - IO injection patterns (200 LoC)
  - [ ] GitHub MCP - Real-world complexity (300 LoC)
  - [ ] Each with full test coverage and documentation

- [ ] **Documentation**:
  - [ ] Comprehensive API documentation
  - [ ] Getting started guide
  - [ ] Migration guide from direct SDK usage
  - [ ] Pattern documentation with examples
  - [ ] Troubleshooting guide

**Implementation Sub-phases**:

1. **Foundation & Core Systems** (850 LoC)
   - Create folder structure: `src/oak-mcp-core/` and `src/oak-notion-mcp/`
   - Move existing files to `src/oak-notion-mcp/`
   - Enhanced Logging Framework (no dependencies) - 550 LoC
   - Enhanced Error Framework (depends on logger) - 300 LoC
   - Update imports to use local oak-mcp-core
   - Set up performance benchmarking baseline

2. **Core Infrastructure** (550 LoC)
   - Configuration Management System - 200 LoC
   - Validation Framework with boundary patterns - 150 LoC
   - Testing Utilities Framework - 200 LoC
   - Update oak-notion-mcp to use all three
   - API design review checkpoint

3. **MCP Core Patterns** (800 LoC)
   - MCP Server Base Class & Middleware - 300 LoC
   - Registry System (resources/tools) - 200 LoC
   - Type Guards & Pagination - 300 LoC
   - Migrate oak-notion-mcp to extend base
   - Type safety audit

4. **Advanced Patterns & Migration** (850 LoC)
   - Performance Monitoring & Lifecycle - 300 LoC
   - Resource Linking & Utilities - 200 LoC
   - Complete oak-notion-mcp migration - 350 LoC
   - Verify oak-notion-mcp <1,000 LoC
   - Bundle size optimization

5. **Documentation & Examples**
   - Comprehensive API documentation
   - 3-4 example MCP servers (100-300 LoC each)
   - Migration guide and troubleshooting
   - Beta release and feedback collection
   - Prepare for future extraction to separate package

**Quality Checkpoints** (after each component):

- `pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build`
- Verify zero integration-specific dependencies in generic components
- Ensure 100% test coverage for new abstractions
- Document extraction readiness in component headers
- Benchmark performance impact (<5% overhead)

**Success Metrics**:

- oak-mcp-core created with 3,050 LoC of generic framework code
- oak-notion-mcp reduced to <1,000 LoC (validation + adapters only)
- All existing tests pass with zero regressions
- 100% test coverage on all pure functions (TDD enforced)
- Test file naming: `*.unit.test.ts` for pure functions, `*.integration.test.ts` for boundaries
- All quality gates passing (format, lint, type-check, test, build)
- Pre-commit and pre-push hooks configured and working
- CI/CD pipeline with automated releases via semantic-release
- Performance benchmarks established:
  - Logging overhead <1ms per operation
  - Middleware processing <0.5ms per layer
  - Memory usage <10MB base footprint
  - Bundle size <50KB minified + gzipped
- 4+ runtime environments supported (Node.js, Deno, Bun, edge)
- 3+ example servers demonstrating patterns (<300 LoC each)
- All abstractions follow SOLID principles and are runtime-agnostic
- Clear separation enforced by package boundaries
- All external data validated at boundaries before entering core system
- Zero errors lost through propagation chain
- All logging is structured, correlated, and edge-compatible
- Published to npm as @oaknational/mcp-core
- Beta feedback incorporated before stable release

### Phase 4: Production Readiness

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

### Phase 5: Write Tools and Safety Controls

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
