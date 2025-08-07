# Phase 5: Moria/Histoi/Psycha Evolution Plan

**Status**: IN PROGRESS  
**Progress**: Sub-phase 5.1 (Moria Package) ✅ COMPLETED  
**Last Updated**: 2025-01-07

## Overview

Transform the monolithic genotype/phenotype model into a three-tier biological ecosystem with transplantable tissues, based on [ADR-023](../../docs/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md).

## Architecture Definitions

### Workspace Architecture (Package Organization)

- **Moria (Molecules/Atoms)**: Pure abstractions with zero dependencies - interfaces, types, algorithms
  - *Example*: `Logger` interface, `StorageProvider` interface, pure sorting algorithms
  
- **Histoi (Tissues/Matrices)**: Runtime-adaptive connective tissues that bind organisms
  - *Example*: Adaptive logger using console/pino, storage tissue using localStorage/fs
  
- **Psycha (Living Organisms)**: Complete applications composed from moria and connected by histoi
  - *Example*: `oak-notion-mcp` server, `github-mcp` server

## Core Insight

Different kinds of shared code want to live in different places. The current oak-mcp-core violates the Single Responsibility Principle by trying to be three things simultaneously:

1. Pure abstractions (no IO) → Will become **Moria**
2. Runtime capabilities (need IO) → Will become **Histoi**
3. Development conveniences (opinionated patterns) → Will be distributed appropriately

## Implementation Sub-phases

### Sub-phase 5.1: Create Moria Package ✅ COMPLETED

**Complexity**: Foundation - Extracting pure molecules/atoms  
**Outcome**: Pure building blocks package with zero dependencies

**Tasks**:

- [x] Create `ecosystem/moria/@oaknational/mcp-moria/` directory structure
- [x] Write tests FIRST for all pure interfaces (TDD approach)
- [x] Extract pure interfaces from oak-mcp-core:
  - [x] Tool, Handler, Registry abstract patterns
  - [x] Pure TypeScript types
  - [x] Add EventProcessor alias for Handler compatibility
  - [x] PluginRegistry interface for plugin patterns
  - [x] Enhanced HandlerContext with signal and metadata
  - [ ] Logger, StorageProvider, EnvironmentProvider, EventBus interfaces (deferred to histoi)
  - [ ] Enhanced LifecycleHandler with state transitions (moved to future iteration)
- [x] Write tests FIRST for pure algorithms (TDD approach)
- [x] Extract pure algorithms:
  - [x] Validation functions (no Zod dependency)
  - [x] Parsing functions (pure transformations)
  - [x] Transformation utilities
  - [x] Result helper functions (Ok, Err)
  - [x] State machine types and utilities
  - [x] Boundary pattern types (Pure, Effect, Boundary)
- [x] Configure package.json with zero dependencies
- [x] Set package naming: `@oaknational/mcp-moria`
- [x] Set up build pipeline for moria
- [x] Verify 100% test coverage for all pure functions (242 tests passing)
- [x] Update oak-mcp-core to depend on moria
- [x] Run quality gates: format → type-check → lint → test → build

**Success Criteria**:

- ✅ Zero runtime dependencies achieved
- ✅ 100% test coverage for pure functions (242 tests)
- ✅ All interfaces well-documented
- ✅ Package builds successfully
- Ready for publishing to npm

**Lessons Learned & RFC Insights**:

- Result<T,E> with `ok` convention confirmed as correct choice
- EventProcessor alias successfully maintains compatibility
- Zero dependencies proven feasible for pure abstractions
- Test-driven development essential for quality

### Sub-phase 5.1.5: Moria Phase 2 Enhancements (NEW - from RFC)

**Complexity**: Minor enhancements to existing package
**Outcome**: Complete functional toolkit based on RFC feedback

**Tasks** (from RFC discussion):

- [ ] Add Maybe<T>/Option<T> type for nullable value handling
- [ ] Implement Promise<Result<T,E>> pattern helpers for async operations
- [ ] Extract test factory patterns from oak-mcp-core
- [ ] Consider extracting deduplication module as suggested by Poirot
- [ ] Add example migrations showing adoption patterns
- [ ] Prepare for npm publishing with semantic versioning (0.x initially)

**Success Criteria**:

- Complete functional programming toolkit
- Migration examples documented
- Ready for external consumption

### Sub-phase 5.2: Create Logger Tissue

**Complexity**: First Tissue - Multi-runtime implementation  
**Sequential**: Follows moria creation  
**Outcome**: Adaptive logging that works in any environment

**Tasks**:

- [ ] Create `ecosystem/histoi/@oaknational/mcp-histos-logger/` structure
- [ ] Implement adaptive logger:
  - [ ] `node.ts` - Node.js implementation with full features
  - [ ] `edge.ts` - Edge implementation with constraints
  - [ ] `adaptive.ts` - Runtime detection and routing
  - [ ] `shared/console.ts` - Shared Consola usage
- [ ] Configure conditional exports in package.json:

  ```json
  "exports": {
    ".": {
      "types": "./dist/types.d.ts",
      "node": {
        "import": "./dist/node.mjs",
        "require": "./dist/node.cjs"
      },
      "edge-light": "./dist/edge.mjs",
      "worker": "./dist/edge.mjs",
      "browser": "./dist/edge.mjs",
      "default": "./dist/adaptive.mjs"
    },
    "./node": {
      "types": "./dist/types.d.ts",
      "import": "./dist/node.mjs"
    },
    "./edge": {
      "types": "./dist/types.d.ts",
      "import": "./dist/edge.mjs"
    }
  }
  ```

- [ ] Implement Logger interface from moria
- [ ] Add tree-shaking tests
- [ ] Performance benchmarks (<1ms overhead)
- [ ] Update oak-mcp-core and oak-notion-mcp to use tissue

**Success Criteria**:

- Works in Node.js, Edge, Browser environments
- Tree-shaking removes unused implementations
- <1ms logging overhead
- Type-safe across all environments

### Sub-phase 5.3: Create Storage Tissue

**Complexity**: Second Tissue - Multi-backend abstraction  
**Sequential**: Follows logger tissue to establish patterns  
**Outcome**: Adaptive storage for different runtimes

**Tasks**:

- [ ] Create `ecosystem/histoi/@oaknational/mcp-histos-storage/` structure
- [ ] Implement adaptive storage:
  - [ ] `node.ts` - FileSystem-based storage
  - [ ] `edge.ts` - KV store-based storage
  - [ ] `adaptive.ts` - Runtime detection
- [ ] Implement StorageProvider interface from moria
- [ ] Add migration utilities for data portability
- [ ] Configure conditional exports
- [ ] Write comprehensive tests
- [ ] Update consumers to use storage tissue

**Success Criteria**:

- Seamless switching between storage backends
- Data portability between environments
- Zero data loss during operations
- <10ms operation overhead

### Sub-phase 5.4: Create Environment Tissue

**Complexity**: Simple Tissue - Environment abstraction  
**Sequential**: Quick implementation after storage  
**Outcome**: Adaptive environment variable access

**Tasks**:

- [ ] Create `ecosystem/histoi/@oaknational/mcp-histos-env/` structure
- [ ] Implement adaptive environment:
  - [ ] `node.ts` - process.env + dotenv support
  - [ ] `edge.ts` - Context-based env vars
  - [ ] `adaptive.ts` - Runtime detection
- [ ] Graceful degradation when dotenv unavailable
- [ ] Type-safe environment variable access
- [ ] Configure conditional exports
- [ ] Update consumers to use env tissue
- [ ] Use `workspace:^` protocol for moria dependency

**Success Criteria**:

- Works across all target environments
- Graceful fallbacks for missing capabilities
- Type-safe environment access
- Zero runtime errors from missing env

### Sub-phase 5.5: Create Transport Tissue

**Complexity**: Complex Tissue - Network protocols and session management  
**Sequential**: Final tissue, building on established patterns  
**Outcome**: Adaptive transport for local and remote MCP servers

**Tasks**:

- [ ] Create `ecosystem/histoi/@oaknational/mcp-histos-transport/` structure
- [ ] Write tests FIRST for transport interfaces (TDD approach)
- [ ] Implement transport mechanisms:
  - [ ] `stdio.ts` - Local subprocess transport
  - [ ] `http-streamable.ts` - Remote Streamable HTTP (NOT SSE)
  - [ ] `session.ts` - Session management for stateful remote
  - [ ] `adaptive.ts` - Transport selection based on config
- [ ] Add validation at ALL boundaries (Zod schemas for external signals)
- [ ] Design transport abstraction interface
- [ ] Define RemoteSession interface for stateful operations
- [ ] Implement connection pooling for remote
- [ ] Add retry logic with exponential backoff
- [ ] Configure conditional exports
- [ ] Write integration tests for both transports
- [ ] Document SSE deprecation clearly
- [ ] Run quality gates after implementation

**Success Criteria**:

- Seamless local/remote switching
- <100ms connection overhead
- Robust error handling and retries
- Session persistence for stateful operations

### Sub-phase 5.6: Restructure Directory Layout

**Complexity**: Mechanical Refactoring - File system reorganization  
**Sequential**: After all components exist  
**Milestone**: Major structural change  
**Outcome**: Complete biological organization

**Tasks**:

- [ ] Create new directory structure:

  ```text
  ecosystem/
  ├── moria/
  │   └── @oaknational/mcp-moria/
  ├── histoi/
  │   ├── @oaknational/mcp-histos-logger/
  │   ├── @oaknational/mcp-histos-storage/
  │   ├── @oaknational/mcp-histos-env/
  │   └── @oaknational/mcp-histos-transport/
  └── psycha/
      └── @oaknational/notion-mcp-server/
  ```

- [ ] Move oak-notion-mcp to psycha directory
- [ ] Update all import paths
- [ ] Update pnpm workspace configuration
- [ ] Update package.json dependencies
- [ ] Update TypeScript configuration
- [ ] Update Turborepo configuration
- [ ] Update CI/CD pipelines
- [ ] Update all documentation references

**Success Criteria**:

- All tests passing after restructure
- Build pipeline working
- No broken imports
- Documentation updated

### Sub-phase 5.7: Refactor oak-mcp-core

**Complexity**: Decomposition - Breaking monolith into parts  
**Sequential**: After restructuring  
**Outcome**: oak-mcp-core completely replaced (NOT wrapped)

**Tasks**:

- [ ] Identify remaining value in oak-mcp-core
- [ ] Move pure abstractions to moria
- [ ] Move runtime capabilities to appropriate tissues
- [ ] Create REPLACEMENT guide (not compatibility layer)
- [ ] DELETE oak-mcp-core package entirely
- [ ] Update all dependencies to use new packages directly
- [ ] Clean up ALL redundant code
- [ ] Ensure NO backward compatibility code remains

**Success Criteria**:

- oak-mcp-core fully decomposed
- All functionality preserved in new structure
- Migration guide complete
- Zero breaking changes for end users

### Sub-phase 5.8: Optimize Tree-Shaking

**Complexity**: Performance Optimization - Bundle analysis and tuning  
**Sequential**: After architecture is complete  
**Outcome**: Minimal bundle sizes through proper tree-shaking

**Tasks**:

- [ ] Audit all packages for side effects
- [ ] Mark packages as `"sideEffects": false`
- [ ] Convert all imports to dynamic where appropriate
- [ ] Test bundle sizes with different configurations
- [ ] Document bundler configuration examples
- [ ] Create bundle size benchmarks
- [ ] Add bundle size checks to CI
- [ ] Example bundler configurations (Vite, Webpack, etc.)

**Success Criteria**:

- <10KB per tissue when tree-shaken
- Zero unused code in production bundles
- Bundle size regression tests in CI
- Clear documentation for bundler setup

### Sub-phase 5.9: Documentation and Examples

**Complexity**: Knowledge Transfer - Teaching the new model  
**Sequential**: After optimization, before validation  
**Outcome**: Comprehensive documentation for new architecture

**Tasks**:

- [ ] Update architecture-overview.md with moria/histoi/psycha model
- [ ] Update ARCHITECTURE_MAP.md with new workspace structure
- [ ] Update biological-philosophy.md with workspace architecture
- [ ] Update high-level-architecture.md with new model
- [ ] Update README.md to reflect new architecture
- [ ] Update docs/naming.md with moria/histoi/psycha terms
- [ ] Update all agent-guidance/*.md files for new architecture
- [ ] Create moria/histoi/psycha concept guide
- [ ] Write migration guide from genotype/phenotype to moria/histoi/psycha
- [ ] Create example organisms using shared histoi
- [ ] Update all package README files
- [ ] Create troubleshooting guide
- [ ] Document package naming convention:
  - Moria: `@oaknational/mcp-moria`
  - Tissues: `@oaknational/mcp-histos-{name}`
  - Organisms: `@oaknational/{service}-mcp-server`
- [ ] Document runtime adaptation patterns:
  - Pattern 1: Automatic runtime detection
  - Pattern 2: Explicit runtime selection  
  - Pattern 3: Bundler configuration
- [ ] Add code examples for each pattern

**Success Criteria**:

- Clear conceptual documentation
- Working examples for all patterns
- Migration path documented
- Troubleshooting guide complete

### Sub-phase 5.10: ESLint Configuration Updates

**Complexity**: Architectural Enforcement - Import boundary rules  
**Sequential**: After documentation, before performance validation  
**Outcome**: ESLint enforces moria/histoi/psycha boundaries

**Tasks**:

- [ ] Implement workspace-eslint-rules.md configuration in eslint.config.base.ts
- [ ] Add import-x/no-restricted-paths zones for moria isolation (zero dependencies)
- [ ] Add import-x/no-restricted-paths zones for histoi independence (no cross-tissue imports)
- [ ] Add import-x/no-restricted-paths zones for psycha isolation (no cross-organism imports)
- [ ] Update ecosystem/oak-mcp-core/eslint.config.ts for moria rules
- [ ] Update ecosystem/oak-notion-mcp/eslint.config.ts for psycha rules
- [ ] Create ecosystem/histoi/*/eslint.config.ts templates for tissue packages
- [ ] Test ESLint rules with example violations to ensure they catch errors
- [ ] Add ESLint rule documentation to developer guide
- [ ] Configure IDE integration for real-time import violation feedback

**Success Criteria**:

- ESLint prevents moria from importing anything external
- ESLint prevents histoi from importing other histoi or psycha
- ESLint prevents psycha from importing other psycha
- All legitimate imports still work correctly
- Clear error messages guide developers to correct patterns

### Sub-phase 5.11: Performance Validation

**Complexity**: Quality Assurance - Cross-environment testing  
**Sequential**: Final validation step  
**Outcome**: Verified performance across all environments

**Tasks**:

- [ ] Create performance benchmark suite
- [ ] Test in Node.js environment
- [ ] Test in Edge runtime (Cloudflare Workers)
- [ ] Test in Browser environment
- [ ] Measure memory usage
- [ ] Measure startup time
- [ ] Document performance characteristics
- [ ] Add performance regression tests

**Success Criteria**:

- <50ms startup time
- <10MB base memory footprint
- <1ms operation overhead
- Performance regression prevention

## Risk Mitigation

1. **Breaking Changes**: Create compatibility layer during transition
2. **Bundle Size Growth**: Aggressive tree-shaking and code splitting
3. **Runtime Detection Failures**: Fallback to safe defaults
4. **Version Coordination**: Use workspace protocol (`workspace:^`) for internal deps
5. **Migration Complexity**: Incremental migration with clear guides

## Critical Success Factors

1. **Maintain strict boundaries** - No cross-organism imports
2. **Keep moria pure** - No runtime code in abstractions (zero dependencies)
3. **Ensure tree-shaking** - Use dynamic imports and conditional exports
4. **Document adaptation** - Clear docs on how tissues adapt
5. **Version carefully** - Tissues are shared dependencies
6. **Follow TDD rigorously** - Write tests first, especially for pure functions
7. **Run quality gates** - After EVERY sub-phase completion
8. **No compatibility layers** - Clean replacement, never gradual migration
9. **Keep it simple** - Always ask: could it be simpler without compromising quality?
10. **Validate at boundaries** - All external signals must be validated with Zod

## Success Metrics

- **Architecture**: Three-tier separation achieved
- **Bundle Size**: <10KB per tissue, <50KB total for minimal setup
- **Performance**: <1ms overhead for adaptations
- **Type Safety**: 100% type coverage across environments
- **Tree-Shaking**: Zero unused code in production
- **Documentation**: All patterns documented with examples
- **Tests**: 100% coverage for critical paths

## Dependencies

- Target Architecture document as the blueprint
- Phase 4 completion (oak-mcp-core exists)
- No external blockers

## Linear Implementation Order

**Sequential Phases**:

1. **Foundation**: Create moria package (5.1)
2. **First Tissue**: Logger establishes tissue patterns (5.2)
3. **Core Tissues**: Storage (5.3) then Environment (5.4)
4. **Complex Tissue**: Transport with session management (5.5)
5. **Restructure**: Directory reorganization (5.6)
6. **Decompose**: Split oak-mcp-core (5.7)
7. **Optimize**: Tree-shaking and bundle size (5.8)
8. **Document**: Comprehensive guides (5.9)
9. **Enforce**: ESLint boundary rules (5.10)
10. **Validate**: Performance testing (5.11)

**Why This Order**:

- Moria first establishes the pure interfaces
- Logger tissue creates the pattern for other tissues
- Simple tissues before complex ones
- Restructure only after all pieces exist
- Optimize and document the stable architecture
- Enforce boundaries through ESLint configuration
- Validate everything works as expected

## Cross-Repository Collaboration (NEW)

Based on RFC-001 discussions, we should consider:

1. **Shared Package Strategy**:
   - Publish Moria to npm as `@shared/abstractions` or similar neutral namespace
   - Enable both MCP framework and event processing systems to adopt
   - Maintain backward compatibility through semantic versioning

2. **Collaboration Model**:
   - Use GitHub Gist for RFC discussions (currently private, consider making public)
   - Multiple contributors (Poirot, Marple, others) can provide feedback
   - Sync script enables distributed collaboration

3. **Migration Path**:
   - Create example migrations for both frameworks
   - Show gradual adoption of shared abstractions
   - Document benefits and trade-offs

## Next Steps After Phase 5

- Phase 6: Oak Open Curriculum API MCP implementation
- Phase 7: Production readiness and publishing
- Phase 8: Safety controls for write operations
- Phase 9: Ecosystem expansion with additional organisms
- **NEW**: Consider publishing Moria as shared package for broader ecosystem
