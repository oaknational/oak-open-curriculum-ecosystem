# High Level Plan

## Vision

### Immediate Goal

Create a production-ready MCP server that safely exposes Notion resources and tools to LLMs, enabling AI agents to manage Notion workspaces with human oversight and confirmation.

### Long-term Vision

Evolve from a single MCP server into a thriving ecosystem of MCP implementations, following complete biological principles:

- **Complete Biological Architecture**: Substrate (foundation) + Systems (pervasive) + Organs (discrete)
- **Organism Evolution**: From monolithic app to multi-organism ecosystem
- **oak-mcp-core Extraction**: Framework as first independent organism (keystone species)
- **Ecosystem Formation**: Multiple MCP servers as organisms in symbiotic relationships

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
11. **Complete Biological Model** - Distinguish between substrate (types/contracts), systems (pervasive infrastructure), and organa (discrete business logic)
12. **Multi-Scale Architecture** - Apply same principles from functions to ecosystems

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

**Next Steps**: Proceed with Phase 3 architectural evolution before oak-mcp-core extraction.

### Phase 3: Complete Biological Architecture Implementation ⏳ IN PROGRESS

**Outcome**: Restructure codebase following the complete biological model with Greek nomenclature for clarity (chora/organa/psychon)

**Rationale**: Our architectural evolution analysis, validated by complex systems research (Scheffer et al., 2009), reveals that our 91 relative import warnings are "early warning signals" showing where the architecture naturally wants to form boundaries. The Greek nomenclature resolves conceptual confusion between cross-cutting fields (chorai) and discrete components (organa).

**Approach**: Progressive transformation maintaining system functionality

**Progress Update (2025-01-05)**:

- Started with 101 relative parent import violations
- Currently at 91 warnings (all expected architectural boundaries)
- Zero errors, all quality gates passing
- Substrate, systems, and organa layers established
- Dependency injection implemented, eliminating cross-organ imports
- Renamed organs to organa

**Key Deliverables**:

- [x] **Foundation Phase: Substrate** ✅ COMPLETED (Types & Contracts):
  - [x] Create `src/substrate/` directory structure
  - [x] Extract core types to `substrate/types/` (LogLevel, etc.)
  - [x] Define service contracts in `substrate/contracts/` (Logger, ConfigProvider, EventBus, NotionOperations)
  - [x] Create event schemas in `substrate/event-schemas/`
  - [x] Zero runtime code - compile-time only
  - [x] Fixed config→logging dependency inversion

- [x] **Infrastructure Phase: Core Systems** ✅ COMPLETED (Pervasive Infrastructure):
  - [x] Create `src/systems/` directory
  - [x] Extract logging system (flattened from 5 to 2 levels, applied domain-driven splitting)
  - [x] Create edge-compatible event bus system
  - [x] Move configuration system from substrate to systems (corrected placement)
  - [x] Implement dependency injection patterns
  - [x] No cross-system imports validated

- [x] **Modularization Phase: Business Organa** ✅ COMPLETED (Discrete Logic):
  - [x] Create `src/organa/` directory structure
  - [x] Move Notion integration to `organa/notion/`
  - [x] Move MCP protocol to `organa/mcp/`
  - [x] Fix cross-organ imports using dependency injection (not events)
  - [x] Create NotionOperations contract and public API
  - [x] Zero cross-organ imports achieved

- [ ] **Integration Phase: Organism Assembly** ⏳ PENDING:
  - [ ] Create `src/organism.ts` as assembly point
  - [ ] Wire systems through dependency injection
  - [ ] Connect organa via dependency injection
  - [ ] Update entry points to use Organism
  - [ ] Remove old directories and update tests
  - [ ] Run final validation suite

**Implementation approach**: See [Phase 3 Biological Architecture](phase-3-biological-architecture.md) for detailed phase-by-phase roadmap with specific examples and validation criteria.

**Quality Checkpoints** (after each phase):

- Run `pnpm lint` to verify violation count reduction
- Run `pnpm test` to ensure no regressions
- Verify dependency flow with `madge --circular src`
- Check that substrate has zero runtime code
- Confirm systems are injected, not imported
- Validate organa communicate only via dependency injection

**Success Metrics**:

- 101 relative import violations → 0 (complete elimination)
- Zero circular dependencies detected
- All 158 existing tests passing
- Clear substrate/systems/organa separation
- Event-driven organ communication established
- Ready for Phase 4 oak-mcp-core extraction

**Risk Mitigation**:

- Progressive transformation (system stays working)
- Each step has validation criteria
- Rollback strategy for each phase
- Continuous testing throughout

### Phase 4: oak-mcp-core Framework Extraction (First Independent Organism)

**Outcome**: Extract oak-mcp-core as the **pioneer organism** - a comprehensive MCP server framework in a separate workspace/package while migrating oak-notion-mcp to use it

**Ecosystem Role**: oak-mcp-core will be a keystone species, providing essential services that future MCP organisms will depend on

**Strategy**: Now that we have proper architectural boundaries from Phase 3, extract generic components to oak-mcp-core as a separate package. All external data validation happens at boundaries using Zod schemas and type guards

**Detailed Plan**: See [Phase 4 oak-mcp-core Implementation Plan](phase-4-oak-mcp-core-implementation-plan.md) for week-by-week breakdown

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
  - [ ] Create separate workspace/package for oak-mcp-core
  - [ ] Single public API via `oak-mcp-core/src/index.ts`
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
  - [ ] Update package.json to depend on oak-mcp-core
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
   - Create separate oak-mcp-core workspace/package
   - Set up build and test infrastructure for oak-mcp-core
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
   - Publish oak-mcp-core to npm registry

5. **Documentation & Examples**
   - Comprehensive API documentation
   - 3-4 example MCP servers (100-300 LoC each)
   - Migration guide and troubleshooting
   - Beta release and feedback collection
   - Published as @oaknational/mcp-core

**Quality Checkpoints** (after each component):

- `pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build`
- Verify zero integration-specific dependencies in generic components
- Ensure 100% test coverage for new abstractions
- Document extraction readiness in component headers
- Benchmark performance impact (<5% overhead)

**Success Metrics**:

- oak-mcp-core created with 3,050 LoC of generic framework code (pioneer organism)
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
- 4+ runtime environments supported (Node.js, Deno, Bun, edge) - environmental adaptation
- 3+ example servers demonstrating patterns (<300 LoC each) - future organisms
- All abstractions follow SOLID principles and are runtime-agnostic
- Clear separation enforced by package boundaries (cell membranes)
- All external data validated at boundaries before entering core system
- Zero errors lost through propagation chain
- All logging is structured, correlated, and edge-compatible
- Published to npm as @oaknational/mcp-core
- Beta feedback incorporated before stable release
- **Ecosystem readiness**: Designed for future symbiotic relationships

### Phase 5: Production Readiness

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

### Phase 6: Write Tools and Safety Controls

**Outcome**: Full-featured MCP server with write capabilities and safety controls

### Phase 7: Ecosystem Expansion (Future Vision)

**Outcome**: Multiple MCP servers forming a symbiotic ecosystem

**Key Deliverables**:

- [ ] **Additional Organisms**:
  - [ ] oak-github-mcp - GitHub integration (uses oak-mcp-core)
  - [ ] oak-slack-mcp - Slack integration (uses oak-mcp-core)
  - [ ] oak-jira-mcp - Jira integration (uses oak-mcp-core)
- [ ] **Ecosystem Infrastructure**:
  - [ ] Shared type definitions package
  - [ ] Common utilities package
  - [ ] Unified testing framework
  - [ ] Monorepo tooling and governance
- [ ] **Ecosystem Patterns**:
  - [ ] Inter-organism communication protocols
  - [ ] Resource sharing mechanisms
  - [ ] Evolutionary pressure testing
  - [ ] Health monitoring dashboard
- [ ] **Temporal Architecture**:
  - [ ] Release cycles coordination
  - [ ] Deprecation lifecycle management
  - [ ] Migration pattern library
  - [ ] Seasonal refactoring schedules

**Quality Checkpoints**:

- Biodiversity index > 3 (different implementation approaches)
- Build time efficiency across all packages
- Zero cascading failures between organisms
- Pattern propagation < 1 week

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

### Organism-Level Metrics

1. **Code Quality**
   - Zero TypeScript errors
   - Zero ESLint violations
   - 100% prettier compliance
   - No failing tests

### Ecosystem-Level Metrics (Future)

1. **Ecosystem Health**
   - Biodiversity index (variety of approaches)
   - Energy efficiency (build/deploy times)
   - Resilience score (failure recovery)
   - Adaptation rate (new feature adoption)

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
- **Fractal patterns** - Same principles at every scale (function → module → package → ecosystem)
- **Temporal awareness** - Consider time dimension in all designs

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
