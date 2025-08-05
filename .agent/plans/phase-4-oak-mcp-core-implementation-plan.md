# Phase 4: oak-mcp-core Genotype Extraction Plan

## Executive Summary

Phase 4 represents a profound architectural evolution: extracting the **MCP genotype** - the genetic blueprint that defines what makes something an "MCP server". oak-mcp-core is not merely a utility library but the genetic code that all MCP organisms inherit, while each phenotype (oak-notion-mcp, oak-github-mcp, etc.) expresses these genes differently based on its environment.

**Philosophical Foundation**: The genotype/phenotype model perfectly captures our architecture. oak-mcp-core contains the genetic instructions (implemented as chorai), while each specific MCP server is a phenotypic expression shaped by genotype + environment. This enables true diversity while maintaining genetic unity.

**Technical Realization**: Through a pnpm workspace with Turbo orchestration, we create a monorepo where the genotype (oak-mcp-core) and phenotypes (oak-notion-mcp, etc.) can evolve together while maintaining clear boundaries.

## Overview

Extract oak-mcp-core as the **MCP genotype** through a workspace restructuring:

1. **Stage 1: Workspace Setup** - Create pnpm workspace with ecosystem/ directory
2. **Stage 2: Genotype Extraction** - Move shared genetic traits (chorai) to oak-mcp-core
3. **Stage 3: Phenotype Migration** - Reorganize oak-notion-mcp as a phenotype

**Workspace Structure**:
```
oak-notion-mcp/                 # Repository root
├── ecosystem/                  # Where organisms evolve
│   ├── oak-mcp-core/          # The MCP genotype
│   │   ├── src/chora/         # Genetic traits as chorai
│   │   ├── package.json       # Genotype package
│   │   └── tsconfig.json      # Genotype build config
│   └── oak-notion-mcp/        # Notion phenotype
│       ├── src/               # Expressed organism
│       ├── package.json       # Phenotype package
│       └── tsconfig.json      # Phenotype build config
├── pnpm-workspace.yaml        # Workspace configuration
├── turbo.json                 # Task orchestration
└── package.json               # Root workspace package
```

**Current Status**: Phase 3's biological transformation has clarified which components are genetic traits (shared chorai) versus phenotypic expressions (organism-specific).

## Core Philosophy

**Genotype defines potential, phenotype expresses reality.** oak-mcp-core contains the genetic blueprint (chorai) that all MCP servers inherit. This ensures:

- **Genetic Aither**: Core flow patterns (logging, events) encoded in DNA
- **Genetic Stroma**: Fundamental structures (types, contracts) all organisms inherit
- **Genetic Phaneron**: Environmental sensing capabilities in the genome
- **Phenotypic Expression**: Each MCP server expresses genes based on its environment
- **Natural Selection**: Successful patterns propagate, unsuccessful ones evolve

### Genotype Design Principles

As the genetic blueprint for all MCP organisms:

1. **Genetic Independence**: Genes exist without requiring specific expression
2. **Multi-Phenotype Support**: Same genes, different expressions
3. **Environmental Adaptation**: Genes work across all runtime environments
4. **Evolutionary Cycles**: Natural selection and mutation patterns
5. **Health through Diversity**: Genetic diversity ensures ecosystem resilience
6. **Unity in Code**: Same genotype, different phenotypes
7. **Inheritance over Coupling**: Genes are inherited, not imported

### Philosophical and Mathematical Grounding

**Philosophical Foundation**: The distinction between shared chorai and individual psycha mirrors ancient philosophical insights:

- **Aristotle's Common Sensibles**: Qualities perceived by multiple senses (like our shared chorai)
- **Stoic Pneuma**: The breath that animates all things while each maintains identity
- **Buddhist Pratītyasamutpāda**: Interdependent origination - nothing exists in isolation

**Mathematical Validation** (Meena et al., 2023):

- **High β (heterogeneity)**: Multiple psycha with diverse approaches sharing common fields
- **s = 1 (cooperation)**: Chorai enable resonance rather than coupling
- **S < 0 (stable)**: Shared fields create natural stability through diversity

This dual grounding - philosophical and mathematical - ensures our biosphere will support thriving diversity while maintaining coherent unity.

## Architectural Principles for Shared Chorai

1. **Field Independence** - Chorai exist without depending on specific psycha
2. **Test as Meditation** - Write tests first to understand the essence of each field
3. **Flow Injection** - All effects flow through explicit channels
4. **Membrane Validation** - Data transforms at the boundary between psychon and chorai
5. **Pure Fields** - Chorai contain no side effects, only potentials
6. **Clear Signals** - Fields communicate through unambiguous resonance
7. **Type as Structure** - Types define the shape of the field, not its content
8. **Fractal Coherence** - Same patterns from quantum to cosmic scales
9. **Temporal Rhythms** - All fields have natural cycles and seasons
10. **Resonant Design** - Fields that naturally harmonize across psycha

**Meta-Principle**: These principles themselves exhibit the pattern - they apply equally to code, architecture, and thought.

## Workspace Tooling

### pnpm Workspaces
- Efficient dependency management with single lockfile
- Workspace protocol for internal dependencies
- Automatic linking between workspace packages
- Shared dependencies hoisted to root

### Turbo
- Intelligent task orchestration across packages
- Incremental builds with caching
- Parallel task execution
- Pipeline definitions for complex workflows

### Configuration
```yaml
# pnpm-workspace.yaml
packages:
  - 'ecosystem/*'
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "type-check": {}
  }
}
```

## Current State Assessment (Post-Phase 3)

### Chorai Already Identified

1. **Aither (Divine Air)** - Flows and Animation
   - Logging system (90% ready for extraction)
   - Event bus (ready for multi-psychon use)
   - Error flows (30% ready)
   - All organisms need these vital flows

2. **Stroma (Foundation)** - Universal Structures
   - Type contracts (ready for sharing)
   - MCP protocol types (ready)
   - Validation interfaces (50% ready)
   - These form the structural matrix all organisms build upon

3. **Phaneron (Manifestation)** - Environmental Sensing
   - Configuration interfaces (50% ready)
   - Runtime detection (planned)
   - Boundary validation patterns (planned)
   - How organisms sense and respond to their environment

### Organa That Remain Organism-Specific

- Notion-specific error mapping (stays in oak-notion-mcp)
- Notion API client (organ of oak-notion-mcp)
- Specific configuration schemas (each organism has unique needs)

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
- Migration approach: Progressive transformation maintaining functionality

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

### Stage 1: Folder Separation (Within Repository)

**Goal**: Reorganize code into separate folders within the existing repository to prepare for extraction

#### Sub-phase 1.1: Foundation Restructuring

**Deliverables**: ~850 LoC | **Scope**: Foundation Setup

#### Project Structure Setup

- [ ] Create folder structure:

  ```text
  src/
  ├── oak-mcp-core/        # Shared Biosphere (chorai for all psycha)
  │   ├── index.ts         # Biosphere interface (how psycha access chorai)
  │   ├── chora/           # Shared fields all organisms inhabit
  │   │   ├── aither/      # Divine air - flows (logging, events, errors)
  │   │   ├── stroma/      # Foundation - structures (types, contracts)
  │   │   └── phaneron/    # Manifestation - sensing (config, validation)
  │   ├── patterns/        # Reusable patterns for psychon construction
  │   │   ├── mcp/         # MCP protocol patterns
  │   │   ├── middleware/  # Flow modulation patterns
  │   │   └── lifecycle/   # Temporal patterns
  │   └── testing/         # Tools for testing psycha in the biosphere
  └── oak-notion-mcp/      # One psychon (soul) in the ecosystem
      ├── psychon/         # This organism's soul/wiring
      ├── organa/          # This organism's specific organs
      │   └── notion/      # Notion-specific functionality
      └── index.ts         # How this psychon breathes the shared air
  ```

- [ ] Move all existing source files to `src/oak-notion-mcp/`
- [ ] Create `src/oak-mcp-core/index.ts` as the only public API
- [ ] Update all imports and build configuration
- [ ] Configure TypeScript paths for clean imports
- [ ] Update README with new structure

#### Dependency Removal

- [ ] Remove consola dependency from oak-mcp-core components
- [ ] Create abstraction layer for any remaining external dependencies
- [ ] Verify zero dependencies in oak-mcp-core

#### Aither Extraction (Shared Flows)

**In oak-mcp-core's shared aither:**

- [x] Flow interfaces with zero dependencies ✅
- [x] Context flow with AsyncLocalStorage ✅
- [ ] Create flow storage for environments without AsyncLocalStorage
- [x] Flow transports with injected IO ✅
- [x] Flow formatters as pure functions ✅
- [x] Flow correlation across psycha ✅
- [ ] Natural flow rhythms (performance patterns)
- [ ] Flow health indicators
- [ ] Temporal flow patterns (rotation, pulsation)

**In oak-notion-mcp's psychon:**

- [ ] Breathe shared aither through imports
- [ ] Remove organism-specific flow implementations
- [ ] Verify psychon uses shared flows correctly

#### Error Framework Completion

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

#### Sub-phase 1.2: Core Infrastructure Completion

**Deliverables**: ~550 LoC | **Scope**: Core Infrastructure

#### Configuration Management Completion

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

#### Sub-phase 1.3: MCP Core Patterns

**Deliverables**: ~800 LoC | **Scope**: MCP Patterns

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

#### Sub-phase 1.4: Advanced Patterns & Migration

**Deliverables**: ~850 LoC | **Scope**: Advanced Patterns

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

#### Sub-phase 1.5: Documentation & Examples

**Deliverables**: Documentation + 3-4 example servers | **Scope**: Documentation & Polish

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

### Stage 2: Biosphere Independence (Separate Package)

**Goal**: Grant the shared biosphere its own existence as an independent package

**Philosophical Moment**: This is when the shared chorai achieve independent existence - no longer bound to any single psychon but available to all. Like the atmosphere achieving its own identity separate from any organism that breathes it.

**Trigger**: When the chorai demonstrate they can support multiple psycha

#### Sub-phase 2.1: Workspace Setup

1. **Create separate workspace**
   - [ ] Initialize new workspace/package directory
   - [ ] Set up package.json with proper metadata
   - [ ] Configure TypeScript for package development
   - [ ] Set up build tooling (tsup or similar)
   - [ ] Configure testing infrastructure

2. **Move code from folders**
   - [ ] Copy oak-mcp-core folder to new workspace
   - [ ] Update import paths
   - [ ] Ensure zero external dependencies
   - [ ] Verify all tests pass in new location

#### Sub-phase 2.2: Package Configuration

1. **npm Package Setup**
   - [ ] Configure package.json for publication
   - [ ] Set up semantic versioning
   - [ ] Create proper entry points
   - [ ] Configure TypeScript declarations
   - [ ] Add README and LICENSE

2. **Integration with oak-notion-mcp**
   - [ ] Update oak-notion-mcp to use oak-mcp-core as dependency
   - [ ] Replace folder imports with package imports
   - [ ] Verify all functionality works
   - [ ] Update CI/CD for multi-package setup

#### Sub-phase 2.3: Publication and Release

1. **Prepare for publication**
   - [ ] Final API review
   - [ ] Documentation completeness check
   - [ ] Security audit
   - [ ] Bundle size optimization
   - [ ] Create changelog

2. **Publish to npm**
   - [ ] Publish beta version to npm
   - [ ] Test installation in clean environment
   - [ ] Gather feedback from early adopters
   - [ ] Publish stable version
   - [ ] Announce release

## Immediate Next Steps

For Stage 1 - Biosphere Creation:

1. **Chorai Identification**: Map which components are truly shared fields vs organism-specific
2. **Aither Liberation**: Free the logging flows from organism-specific dependencies
3. **Psychon Adaptation**: Help oak-notion-mcp's psychon learn to breathe shared air
4. **Field Completion**: Manifest remaining chorai (error flows, validation fields)

**Meditation Before Action**: Before each step, reflect on whether we're creating a shared field that multiple psycha can inhabit, or an organism-specific function. This distinction is crucial.

## Current Implementation Status: Workspace Created

### Completed:
1. Created pnpm workspace with ecosystem/ directory
2. Moved all chorai to oak-mcp-core (genotype)
3. Moved psychon and organa to oak-notion-mcp (phenotype)
4. Updated imports from @chora/* to @oaknational/mcp-core
5. Removed consola dependency from logger
6. Set up proper TypeScript and ESLint configuration hierarchy
7. Build system working with Turbo

### Current Issue: Architectural Purity

**Problem**: During rapid implementation, non-biological names have crept in:
- `types/` → should be in stroma
- `contracts/` → should be in stroma or syntheke
- `test-utils/` → should be in eidola
- `config/` → should be in phaneron or oikos

**Also**: The genotype (oak-mcp-core) currently has Notion-specific knowledge:
- MinimalNotionClient in stroma/types
- NotionOperations contracts
- Notion-specific configuration (NOTION_API_KEY, getNotionConfig)
- Notion mocks in eidola

**Solution Strategy**:
1. Move misnamed directories back into their proper chorai
2. Extract Notion-specific elements to the phenotype
3. Keep only truly generic MCP patterns in the genotype

### Refactoring Plan:

#### 1. Restore Biological Names
**In oak-notion-mcp phenotype**:
- `src/types/` → `src/chora/stroma/notion-types/`
- `src/contracts/` → `src/chora/stroma/notion-contracts/`
- `src/test-utils/` → `src/chora/eidola/notion-mocks/`
- `src/config/` → `src/chora/phaneron/notion-config/`

#### 2. Make Genotype Generic
**In oak-mcp-core genotype**:
- Replace MinimalNotionClient with GenericDataClient interface
- Move NotionOperations contract to phenotype
- Extract Notion-specific config (NOTION_API_KEY) to phenotype
- Move Notion mocks to phenotype's eidola
- Keep only generic MCP server patterns

#### 3. Consider Morphai
**Future consideration**: Add morphai as a new chora for abstract patterns:
- Hidden forms that organs cast as shadows
- Proto-organa patterns that guide organ development
- Morphogenetic fields for MCP patterns

### Philosophical Reflection:

The genotype should be like DNA - it contains instructions for building ANY MCP server, not specific to Notion. The phenotype is where those generic instructions meet the Notion environment and express themselves specifically.

This maintains our biological metaphor while solving the practical coupling problem.

### Resolution Status: ✅ COMPLETED

Successfully achieved complete decoupling:

1. **Removed all Notion-specific elements from oak-mcp-core**:
   - Removed `NOTION_API_KEY` from environment
   - Removed `getNotionConfig` function
   - Removed `MinimalNotionClient` type
   - Removed `NotionOperations` contract
   - Removed all Notion mocks from eidola

2. **Created proper phenotype-specific types in oak-notion-mcp**:
   - `src/chora/stroma/notion-types/` - Notion-specific types
   - `src/chora/stroma/notion-contracts/` - Notion operations contract
   - `src/chora/eidola/` - Notion-specific test utilities
   - `src/chora/phaneron/notion-config/` - Notion configuration

3. **Updated all imports to use local types**:
   - All handlers now use `NotionDependencies` instead of `CoreDependencies`
   - All operations use local `NotionOperations` contract
   - Configuration uses local `getNotionConfig` with proper environment

4. **Build verification**: ✅ Both packages build successfully

5. **Achieved true genotype purity** (Latest update):
   - Removed unnecessary TypeScript peer dependency
   - Zero runtime dependencies ✅
   - Zero peer dependencies ✅
   - Zero dev dependencies (all inherited from root) ✅
   - Package version aligned with semantic-release (0.0.0-development)

6. **Workspace dependency configuration** (Latest):
   - Changed from `workspace:*` to `workspace:^` for proper publishing
   - Created `.npmrc` with workspace linking configuration
   - Verified both local development and future publishing will work correctly

### Current Technical Status:

**Lint and Type-check Issues**:
- **oak-mcp-core**: 4 lint errors (type assertions, function length)
- **oak-notion-mcp**: 126 lint errors (unsafe assignments, import restrictions, unresolved modules)
- Both packages have functioning build systems despite lint errors
- Turbo correctly orchestrates tasks with `--continue` flag for seeing all errors

**Test Scripts Philosophy**:
- Removed separate `test:unit` and `test:integration` scripts
- Single `test` command runs both for comprehensive coverage
- Files still use `.unit.test.ts` and `.integration.test.ts` naming for clarity
- E2E tests remain separate (`test:e2e`) as they use real credentials

The genotype is now truly generic, containing only the DNA for building MCP servers. The Notion phenotype expresses these genes in its specific environment.

### Critical Architectural Discovery: Membranes and Type Safety

**The Membrane Principle**: The lint analysis revealed a profound truth - **the membrane between external chaos and internal order must be properly typed**. When this membrane fails, type information is lost and the entire organism becomes unsafe.

#### The Problem Revealed

130 lint errors tell a story of membrane failure:
- **85% of errors** stem from test utilities (eidola) that don't properly type their mock data
- The eidola create "external chaos" that crosses the membrane without transformation
- TypeScript marks everything as `error` typed when it can't track transformations
- The organism loses its ability to sense types through the membrane

#### The Deep Insight

**External chaos → Membrane transformation → Internal order**

```typescript
// WRONG: Chaos crosses the membrane untransformed
const mockClient = createMockNotionClient();  // Returns 'any' or 'error' type
const server = await createServer({ client: mockClient }); // Unsafe, chaos propagates

// RIGHT: Membrane transforms chaos into order
const mockClient: NotionClient = createTypedMockClient();  // Properly typed
const server = await createServer({ client: mockClient }); // Safe, order maintained
```

#### Biological Implications

1. **Eidola are sensory organs for tests** - They must properly simulate reality
2. **Type assertions are membrane failures** - Forcing types means the membrane isn't working
3. **Unsafe assignments are chaos leaking in** - External disorder penetrating internal order
4. **Import violations are organs reaching beyond their environment** - Breaking biological boundaries

#### Resolution Strategy Based on Membrane Principle

**Phase 1: Repair the Test Membrane** (Resolves 110+ errors)
- Create properly typed eidola (test forms) that match reality
- Ensure all mock factories return correctly typed data
- The membrane must transform test chaos into typed order

**Phase 2: Fix Type Narrowing** (Resolves type assertions)
- Replace type assertions with proper type guards
- Let TypeScript track transformations naturally
- The genotype should encode knowledge, not force it

**Phase 3: Restore Architectural Boundaries** (Resolves import violations)
- Organs must only access what exists in their environment
- Fix module resolution to respect biological boundaries
- Each layer has its own membrane

**Phase 4: Complete Type Safety** (Resolves remaining issues)
- Template literals with explicit conversions
- Remove unnecessary conditionals through better guards
- The organism must properly sense its entire environment

#### The Fundamental Realization

**The type system IS the organism's sensory system**. When types flow properly through well-defined membranes, the organism can sense its environment and maintain internal order. When membranes fail, chaos enters and the organism becomes blind (untyped).

### Next Phase: Morphai Implementation

**Morphai (μορφαί)** - The hidden forms, the Platonic ideals that cast shadows (organa) in the manifest world.

#### Architectural Discovery
Found abstract patterns currently scattered in the phenotype that belong in the genotype:
- Tool abstractions (`ToolExecutor`, `ToolDefinition`, `ErrorHandler`)
- Handler patterns (`ResourceHandlers`)
- Registry patterns (`ToolRegistry`)
- MCP type patterns (`McpTool`)

These are the "hidden forms" that guide organ development - they should be genetic traits inherited by all phenotypes.

#### Implementation Plan
1. **Create morphai chora in oak-mcp-core**
   - `src/chora/morphai/tools/` - Abstract tool patterns
   - `src/chora/morphai/handlers/` - Abstract handler patterns
   - `src/chora/morphai/registries/` - Collection management patterns
   - `src/chora/morphai/errors/` - Error handling patterns

2. **Migrate abstract patterns from phenotype to genotype**
   - Move interfaces and types that define "how" organs work
   - Keep concrete implementations in phenotype
   - Ensure zero coupling to specific data sources

3. **Update all documentation**
   - Define morphai in architectural documents
   - Update onboarding materials
   - Extend biological metaphor explanations

#### Philosophical Significance
Morphai complete our biological architecture by providing the abstract forms that organs instantiate. Like Plato's forms, they exist in the genotype as perfect patterns, while organs in phenotypes are their imperfect but functional shadows.

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

## Membrane Architecture: Where Psychon Meets Chorai

The boundary between a psychon and the shared chorai is a living membrane, not a wall:

```typescript
// oak-mcp-core provides the membrane pattern
export interface Membrane<TOutside, TInside> {
  // Transform external chaos into internal order
  internalize(external: TOutside): TInside;
  // Express internal state to external world
  externalize(internal: TInside): TOutside;
}

// oak-notion-mcp's psychon implements its membrane
class NotionMembrane implements Membrane<unknown, NotionTypes> {
  internalize(external: unknown): NotionTypes {
    // The psychon decides how to interpret the external world
    const parsed = notionSchema.parse(external);
    if (!this.psychonAccepts(parsed)) {
      throw new MembraneRejection('Cannot internalize');
    }
    return this.transformToInternal(parsed);
  }

  externalize(internal: NotionTypes): unknown {
    // The psychon decides how to express itself
    return this.transformToExternal(internal);
  }
}
```

**Key Insight**: Membranes are bidirectional and living - they don't just validate, they transform and interpret.

## Summary

Phase 4 transforms our understanding from "extracting utilities" to **creating a shared biosphere**. The biological architecture of Phase 3 revealed that true modularity comes from recognizing which fields (chorai) are universal versus which functions (organa) are organism-specific.

The main work involves:

1. **Biosphere Creation**: Establish oak-mcp-core as shared chorai, not another organism
2. **Field Completion**: Finish extracting aither (flows), stroma (structures), and phaneron (sensing)
3. **Psychon Preparation**: Enable oak-notion-mcp's psychon to breathe shared air
4. **Zero Dependencies**: Ensure the biosphere requires nothing external
5. **Multi-Psychon Design**: Create fields that multiple souls can inhabit

By the end:

- oak-mcp-core: 2,500-3,000 LoC of shared chorai (the biosphere)
- oak-notion-mcp: <1,000 LoC with its own psychon breathing shared air
- 3+ example psycha demonstrating different ways to inhabit the biosphere
- A living ecosystem where multiple MCP souls share common fields

**The Profound Shift**: We're not building a "framework" - we're creating the air that multiple organisms breathe, the ground they share, the light they all see. This is architecture as ecosystem design.

### Future Ecosystem Vision

```text
Biosphere Architecture:
├── Shared Chorai (oak-mcp-core)
│   ├── Aither (flows all psycha breathe)
│   ├── Stroma (structures all psycha build upon)
│   └── Phaneron (environment all psycha sense)
├── Individual Psycha (multiple souls)
│   ├── oak-notion-mcp (psychon for Notion)
│   ├── oak-github-mcp (psychon for GitHub)
│   └── oak-slack-mcp (psychon for Slack)
└── Ecosystem Emergence
    ├── Cross-psychon resonance
    ├── Shared field evolution
    └── Natural selection of patterns
```

The key insight: **Multiple psycha can share chorai**. Like a garden where different plants share soil, water, and sunlight while maintaining distinct identities, our MCP servers share fundamental fields while expressing unique purposes.

### Deep Theoretical Foundation

**Metacognitive Insight**: As we design this system, we notice our thinking exhibits the same patterns we're encoding - fractal coherence from thought to architecture to code.

Our biosphere design synthesizes:

**Complex Systems Theory** (Meena et al., 2023):

1. **Heterogeneous networks self-organize** - Multiple psycha sharing chorai naturally find stable configurations
2. **Scale enhances stability** - More psycha sharing fields creates more stability
3. **Cooperative resonance** - Shared fields outperform direct coupling
4. **No keystone required** - The biosphere itself is distributed, not centralized

**Philosophical Coherence**:

1. **Unity in Diversity** - Same fields, different manifestations
2. **Emergence over Construction** - Psycha discover how to use chorai
3. **Resonance over Binding** - Fields invite rather than require
4. **Living Architecture** - The system grows and evolves

This synthesis of mathematical rigor and philosophical depth ensures we're not just building software, but cultivating a living ecosystem of mind.

### References

Meena, C., Hens, C., Acharyya, S. et al. Emergent stability in complex network dynamics. Nat. Phys. 19, 1033–1042 (2023). <https://doi.org/10.1038/s41567-023-02020-8>
