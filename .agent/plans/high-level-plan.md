# High Level Plan

## Vision

### Immediate Goal

Create a production-ready MCP server that safely exposes Notion resources and tools to LLMs, enabling AI agents to manage Notion workspaces with human oversight and confirmation.

### Evolved Vision - The Moria/Histoi/Psycha Architecture

Transform from monolithic genotype/phenotype model to a three-tier biological ecosystem:

- **Moria (Molecules/Atoms)**: Abstract patterns and interfaces - the smallest building blocks
- **Histoi (Tissues/Matrices)**: Runtime-adaptive connective tissues that bind organisms
- **Psycha (Living Organisms)**: Complete applications composed from moria and histoi
- **Ecosystem Formation**: Multiple organisms sharing transplantable tissues

## Target Architecture Overview

### Three Biological Categories

1. **Moria** (`ecosystem/moria/`)
   - Pure abstractions, interfaces, and patterns
   - No runtime code, no dependencies, no IO
   - Package: `@oaknational/mcp-moria`

2. **Histoi** (`ecosystem/histoi/`)
   - Transplantable, adaptive implementations
   - Runtime adaptation (Node.js, Edge, Browser)
   - Packages: `@oaknational/mcp-histos-logger`, `@oaknational/mcp-histos-storage`, `@oaknational/mcp-histos-transport`, etc.
   - Tree-shakeable through conditional exports
   - Transport tissue supports both stdio (local) and Streamable HTTP (remote)

3. **Psycha** (`ecosystem/psycha/`)
   - Complete living applications
   - Packages: `@oaknational/notion-mcp-server`, `@oaknational/github-mcp-server`, etc.
   - Compose moria + selected histoi

### Key Architectural Properties

- **Runtime Adaptation, Not Degradation**: Different environments have different capabilities
- **Tree-Shaking Through Dynamic Imports**: Only needed code included in bundles
- **Consumer Responsibility for IO**: Organisms choose their environment
- **Type Safety Across Environments**: Same interfaces regardless of runtime

## Technical Overview

**MCP Transport**:

- **Local**: stdio (for execution as a subprocess) - Current implementation
- **Remote**: Streamable HTTP (for edge deployment) - Future implementation
- **DEPRECATED**: SSE (Server-Sent Events) - Do not use

**Integration Type**: Internal Notion integration (API key based)  
**Core MCP Features**: Resources, Tools, and Prompts  
**Runtime**: Node.js 22+ (current), Edge runtimes (future)  
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
11. **Complete Biological Model** - Distinguish between chora (shared fields), organa (discrete functions), and psychon (soul/wiring - the moment where components become alive)
12. **Multi-Scale Architecture** - Apply same principles from functions to ecosystems
13. **Listen to Early Warning Signals** - Import violations and architectural friction are the system telling us where boundaries want to form, not problems to suppress

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

### Phase 3: Complete Biological Architecture Implementation ✅ COMPLETED

**Outcome**: Restructured codebase following the complete biological model with Greek nomenclature for clarity (chora/organa/psychon)

**Rationale**: Our architectural evolution analysis, validated by complex systems research (Scheffer et al., 2009), revealed that our 101 relative import warnings were "early warning signals" showing where the architecture naturally wanted to form boundaries. The Greek nomenclature resolved conceptual confusion between cross-cutting fields (chorai) and discrete components (organa).

**Approach**: Progressive transformation maintaining system functionality

**Final Results**:

- Started with 176 ESLint errors, achieved 0 errors
- Transformed substrate → chora/stroma, systems → chora/aither+phaneron
- Integrated all essential life functions (errors, utils, types, test-helpers) into the organism
- Created psychon as directory structure for application wiring
- Achieved complete architectural enforcement through ESLint configuration
- Enhanced developer experience with comprehensive documentation and architecture map

**Sub-Phases Completed**:

1. ✅ **Documentation Foundation** - Updated all docs with Greek nomenclature
2. ✅ **Non-Conforming Analysis** - Identified pragmatic exceptions
3. ✅ **Chora Transformation** - Restructured cross-cutting concerns
4. ✅ **Organism Integration** - Integrated all essential life functions
5. ✅ **Psychon Creation** - Created wiring layer as directory structure
6. ✅ **Validation & Cleanup** - All quality gates passing
7. ✅ **Architectural Enforcement** - 0 ESLint errors achieved

**Key Achievements**:

- **Greek Nomenclature**: chora (cross-cutting fields), organa (discrete organs), psychon (soul/wiring)
- **Complete Organism**: All essential functions integrated (no external dependencies for core life)
- **Developer Experience**: Architecture map, enhanced READMEs in every Greek-named directory
- **Import Discipline**: Clear rules for within-chora vs between-chorai imports
- **Architectural Enforcement**: ESLint configured to maintain boundaries
- **Zero Technical Debt**: All 176 linting errors resolved through principled refactoring

**Implementation Details**: See [Phase 3 Biological Architecture](phase-3-biological-architecture.md) for the complete journey

**Success Metrics Achieved**:

- 176 ESLint errors → 0 (complete resolution)
- All 173 tests passing
- Clear chora/organa/psychon separation
- Architectural boundaries self-enforcing
- Developer onboarding enhanced with documentation
- Ready for Phase 4 oak-mcp-core extraction

### Phase 4: oak-mcp-core Genotype Extraction ✅ COMPLETED

**Outcome**: Successfully extracted oak-mcp-core as the **MCP genotype** - the genetic blueprint that all MCP organisms inherit, organized as a pnpm workspace with Turborepo

**Completion Date**: 2025-01-06

**Ecosystem Role**: oak-mcp-core now provides the genetic code (implemented as chorai) that defines what makes something an "MCP server". The oak-notion-mcp phenotype successfully expresses these genes in the Node.js environment.

**Architectural Principles**:

- **Morphai as Platonic Forms**: Abstract patterns in the genotype are the perfect, eternal forms that organs in phenotypes instantiate as imperfect but functional shadows
- **Distributed Chorai**: Both genotype and phenotype have chorai - genotype contains universal traits, phenotypes add environmental adaptations (see ADR-021)
- **Operating at Criticality**: The architecture deliberately operates at the edge of chaos for optimal information processing, following principles from neuroscience and complex systems theory
- **Mathematical Foundation**: Implementing the stability classifier S = β(s + ν + ρ - μ - η) from complex systems research (ADR-009)

**Strategy**: Create a pnpm workspace structure where oak-mcp-core contains the genotype (shared genetic traits implemented as chorai), and each specific MCP server is a phenotype expressing those genes in its environment.

**Completed**: See [Archived Phase 4 Plan](archive/phase-4-consolidated-plan.md) for implementation details

**Workspace Structure**:

```text
oak-notion-mcp/                 # Repository root
├── ecosystem/                  # Where organisms evolve
│   ├── oak-mcp-core/          # The MCP genotype
│   │   └── src/chora/         # Genetic traits as chorai
│   └── oak-notion-mcp/        # Notion phenotype
│       └── src/               # Expressed organism
├── pnpm-workspace.yaml        # Workspace configuration
├── turbo.json                 # Task orchestration
└── package.json               # Root workspace package
```

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

**Key Achievements**:

- [x] **oak-mcp-core Framework Created**:
  - [x] Separate workspace package at `ecosystem/oak-mcp-core`
  - [x] Single public API via comprehensive `index.ts`
  - [x] 3,500+ LoC of generic MCP framework components
  - [x] Conditional dependencies with graceful degradation (ADR-022)
  - [x] 106 meaningful tests (removed 300+ lines of useless tests)
  - [x] Runtime detection for Node.js/Bun/Deno/Edge environments
  - [x] Ready for extraction to @oaknational/mcp-core

- [x] **Core Framework Components Delivered**:
  - [x] Logging Framework - Complete with runtime detection (600+ LoC)
  - [x] Error Framework - ChainedError, Result<T,E>, ErrorContext (500+ LoC)
  - [x] Configuration Management - Environment loader with graceful degradation (300+ LoC)
  - [x] Runtime Detection - Feature detection for all environments (100+ LoC)
  - [x] Context Storage - Runtime-agnostic with AsyncLocalStorage support (200+ LoC)
  - [x] Sensitive Data Scrubbing - PII protection utilities (100+ LoC)
  - [x] Event Bus - Pub/sub system for decoupled communication (100+ LoC)
  - [x] Type System - Comprehensive types and contracts (400+ LoC)
  - [x] Test Factories - Mock creation utilities (100+ LoC)

- [x] **oak-notion-mcp Migration Completed**:
  - [x] Updated to depend on @oaknational/mcp-core workspace package
  - [x] Successfully importing and using core components
  - [x] Moved generic infrastructure to core (env-loader, runtime-detection)
  - [x] Proper phenotype implementation with Node.js specifics
  - [x] 116 tests passing with core integration
  - [x] Clean architectural separation achieved

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

**Success Metrics Achieved**:

- [x] oak-mcp-core created with 3,500+ LoC of shared infrastructure
- [x] Proper genotype/phenotype separation with conditional dependencies  
- [x] 222 total tests passing (106 oak-mcp-core, 116 oak-notion-mcp)
- [x] Every test proves something meaningful (300+ lines of useless tests removed)
- [x] Test file naming convention followed consistently
- [x] All quality gates passing (0 lint errors, 0 type errors)
- [x] Pre-commit and pre-push hooks working perfectly
- [x] CI/CD pipeline with Turborepo remote caching enabled
- Performance benchmarks established:
  - Logging overhead <1ms per operation
  - Middleware processing <0.5ms per layer
  - Memory usage <10MB base footprint
  - Bundle size <50KB minified + gzipped
- 4+ runtime environments supported (Node.js, Deno, Bun, edge) - environmental adaptation
- 3+ example servers demonstrating patterns (<300 LoC each) - future psycha
- All abstractions follow SOLID principles and are runtime-agnostic
- Clear separation enforced by package boundaries (cell membranes)
- All external data validated at boundaries before entering core system
- Zero errors lost through propagation chain
- All logging is structured, correlated, and edge-compatible
- Published to npm as @oaknational/mcp-core
- Beta feedback incorporated before stable release
- **Ecosystem readiness**: Designed for future symbiotic relationships

### Phase 5: Ecosystem Evolution to Moria/Histoi/Psycha

**Outcome**: Transform the monolithic genotype/phenotype model into a three-tier biological ecosystem with transplantable tissues

**Core Insight**: Different kinds of shared code want to live in different places. Oak-mcp-core violates the Single Responsibility Principle by trying to be three things: pure abstractions, runtime capabilities, AND development conveniences. This creates fundamental architectural tension.

**Rationale**: Phase 4's success revealed this tension - the genotype tries to contain both DNA (pure forms) AND organ implementations (runtime-specific code). The solution separates these into three biologically-coherent categories.

**Target Architecture**: See [ADR-023](../docs/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md) and [Phase 5 Plan](phase-5-moria-histoi-psycha-evolution.md) for complete vision

**Biological Alignment**:

- **Moria = Molecules/Atoms**: The smallest building blocks - pure patterns
- **Histoi = Connective Tissues/Matrices**: Like tissues that form the connective matrix between organisms - transplantable, adaptive, binding
- **Psycha = Complete Organisms**: Living applications composed from molecules and connected by tissues

**Architectural Resolution**: This resolves the Library vs Framework tension - moria provides libraries (tools), histoi provides adaptive capabilities, and psycha compose what they need. Consumer truly becomes responsible for IO.

**Deployment Flexibility**: The transport tissue enables the same MCP server to run either:

- **Locally**: As a subprocess using stdio transport (current implementation)
- **Remotely**: On edge runtimes using Streamable HTTP transport (future implementation)
- Session management handles stateful operations for remote deployments

**Key Transformations**:

1. **Split oak-mcp-core** into:
   - `@oaknational/mcp-moria`: Pure abstractions and interfaces (molecules/atoms)
   - Multiple tissue packages: Adaptive, transplantable implementations

2. **Create Tissue Packages**:
   - `@oaknational/mcp-histos-logger`: Adaptive logging (Node/Edge/Browser)
   - `@oaknational/mcp-histos-storage`: Adaptive storage (FileSystem/KV Store)
   - `@oaknational/mcp-histos-env`: Adaptive environment (process.env/context)
   - Each with tree-shakeable runtime adaptations

3. **Reorganize into Biological Directories**:
   - `ecosystem/moria/`: Pure molecules/atoms
   - `ecosystem/histoi/`: Transplantable tissues
   - `ecosystem/psycha/`: Living organisms

4. **Enable Runtime Adaptation** (Three Patterns):
   - **Automatic**: Runtime detection chooses implementation
   - **Explicit**: Import specific runtime (e.g., `/node` or `/edge`)
   - **Bundler**: Configure bundler to force specific runtime
   - Tree-shaking via conditional exports and dynamic imports

5. **Create Transport Tissue** for deployment flexibility:
   - `@oaknational/mcp-histos-transport` with stdio and Streamable HTTP
   - Session management for stateful remote operations
   - Automatic transport selection based on deployment context

**Documentation Updates Required**:

- [ ] Update architecture-overview.md with new model
- [ ] Update all ADRs to reference moria/histoi/psycha
- [ ] Create migration guide from current to target
- [ ] Update developer onboarding documentation
- [ ] Update all README files in affected directories

**Success Metrics**:

- Zero bundled dependencies in moria
- <10KB bundle addition per tissue
- Tree-shaking removes unused runtimes
- Type safety maintained across all environments
- Existing tests continue to pass

**Critical Success Factors** (Ongoing Practices):

1. **Maintain strict boundaries** - No cross-organism imports
2. **Keep moria pure** - No runtime code in abstractions (zero dependencies)
3. **Ensure tree-shaking** - Use dynamic imports and conditional exports
4. **Document adaptation** - Clear docs on how tissues adapt
5. **Version carefully** - Tissues are shared dependencies
6. **Use TDD throughout** - Design with tests first, especially for pure functions
7. **Run quality gates** - After each sub-phase: format → type-check → lint → test → build
8. **No compatibility layers** - Direct migration, not gradual transition

**Future Evolution Enabled**:

- New organisms can be created using existing organs
- New organs can be added for all organisms to use
- New runtimes can be supported (e.g., Deno, Bun)
- Ecosystem can grow with multiple organisms sharing organs

### Phase 6: Oak Open Curriculum API MCP

This will be the first practical demonstration of the ecosystem vision - multiple organisms breathing in the same biosphere, sharing transplantable organs while maintaining their unique business logic (their own internal organa for curriculum-specific operations).

Sub-phase 6.0: Creating the Oak Open Curriculum API SDK

- Create a new, type-safe SDK for the Open Curriculum API. The work is 80% done [in the oak-curriculum-api-client repo](https://github.com/oaknational/oak-curriculum-api-client), but it needs bringing into this repo and refactoring to fully integrate into the MCP ecosystem.

Sub-phase 6.1: MCP Server

- A fully functional MCP server for accessing the Open Curriculum API

Sub-phase 6.2: Elastic Search Index with Lexical and Semantic Search Capabilities

- An elastic search index for the Open Curriculum API with both lexical and semantic search capabilities (work happens outside this repo, blocks rest of phase 6)
- Additional MCP tools for interacting with the elastic search index
- MCP server workflows for carrying out a search operation, and then fetching Open Curriculum API data based on the search results

### Phase 7: Production Readiness

**Outcome**: Published npm packages ready for public use

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
          "args": ["-y", "@oaknational/notion-mcp-server"],
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
- Package installable via `npx @oaknational/notion-mcp-server`
- Example integrations working with Claude Desktop
- Community feedback incorporated

### Phase 8: Safety Controls

**Outcome**: Comprehensive safety controls for MCP servers

**Key Deliverables**:

- [ ] **Safety Controls**:
  - [ ] Human confirmation system for all write operations
  - [ ] Operation preview before execution
  - [ ] Rollback capability tracking
  - [ ] Audit log of all operations
- [ ] **Advanced Features**:
  - [ ] Resource subscriptions for real-time updates - not possible until MCP clients support push notifications
  - [ ] Batch operations support

### Phase 9: Ecosystem Expansion

**Outcome**: Multiple MCP psycha sharing the same biosphere

**Key Deliverables**:

- [ ] **Additional Psycha**:
  - [ ] oak-github-mcp - GitHub psychon breathing shared chorai
  - [ ] oak-slack-mcp - Slack psychon in the same atmosphere
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
