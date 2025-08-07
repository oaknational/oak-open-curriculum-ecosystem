# Phase 5: Morphai/Organa/Psycha Evolution Plan

## Overview

Transform the monolithic genotype/phenotype model into a three-tier biological ecosystem with transplantable organs, based on [ADR-023](../../docs/architecture/architectural-decisions/023-morphai-organa-psycha-architecture.md).

## Core Insight

Different kinds of shared code want to live in different places. The current oak-mcp-core violates the Single Responsibility Principle by trying to be three things simultaneously:

1. Pure abstractions (no IO)
2. Runtime capabilities (need IO)
3. Development conveniences (opinionated patterns)

## Implementation Sub-phases

### Sub-phase 5.1: Create Morphai Package

**Complexity**: Foundation - Extracting pure abstractions  
**Outcome**: Pure forms package with zero dependencies

**Tasks**:

- [ ] Create `ecosystem/morphai/@oaknational/mcp-morphai/` directory structure
- [ ] Extract pure interfaces from oak-mcp-core:
  - [ ] Logger, StorageProvider, EnvironmentProvider, EventBus interfaces
  - [ ] Tool, Handler, Registry abstract patterns
  - [ ] Pure TypeScript types
- [ ] Extract pure algorithms:
  - [ ] Validation functions (no Zod dependency)
  - [ ] Parsing functions (pure transformations)
  - [ ] Transformation utilities
- [ ] Configure package.json with zero dependencies
- [ ] Set package naming: `@oaknational/mcp-morphai`
- [ ] Set up build pipeline for morphai
- [ ] Write tests for all pure functions
- [ ] Update oak-mcp-core to depend on morphai

**Success Criteria**:

- Zero runtime dependencies
- 100% test coverage for pure functions
- All interfaces well-documented
- Package builds and publishes successfully

### Sub-phase 5.2: Create Logger Organ

**Complexity**: First Organ - Multi-runtime implementation  
**Sequential**: Follows morphai creation  
**Outcome**: Adaptive logging that works in any environment

**Tasks**:

- [ ] Create `ecosystem/organa/@oaknational/mcp-organ-logger/` structure
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

- [ ] Implement Logger interface from morphai
- [ ] Add tree-shaking tests
- [ ] Performance benchmarks (<1ms overhead)
- [ ] Update oak-mcp-core and oak-notion-mcp to use organ

**Success Criteria**:

- Works in Node.js, Edge, Browser environments
- Tree-shaking removes unused implementations
- <1ms logging overhead
- Type-safe across all environments

### Sub-phase 5.3: Create Storage Organ

**Complexity**: Second Organ - Multi-backend abstraction  
**Sequential**: Follows logger organ to establish patterns  
**Outcome**: Adaptive storage for different runtimes

**Tasks**:

- [ ] Create `ecosystem/organa/@oaknational/mcp-organ-storage/` structure
- [ ] Implement adaptive storage:
  - [ ] `node.ts` - FileSystem-based storage
  - [ ] `edge.ts` - KV store-based storage
  - [ ] `adaptive.ts` - Runtime detection
- [ ] Implement StorageProvider interface from morphai
- [ ] Add migration utilities for data portability
- [ ] Configure conditional exports
- [ ] Write comprehensive tests
- [ ] Update consumers to use storage organ

**Success Criteria**:

- Seamless switching between storage backends
- Data portability between environments
- Zero data loss during operations
- <10ms operation overhead

### Sub-phase 5.4: Create Environment Organ

**Complexity**: Simple Organ - Environment abstraction  
**Sequential**: Quick implementation after storage  
**Outcome**: Adaptive environment variable access

**Tasks**:

- [ ] Create `ecosystem/organa/@oaknational/mcp-organ-env/` structure
- [ ] Implement adaptive environment:
  - [ ] `node.ts` - process.env + dotenv support
  - [ ] `edge.ts` - Context-based env vars
  - [ ] `adaptive.ts` - Runtime detection
- [ ] Graceful degradation when dotenv unavailable
- [ ] Type-safe environment variable access
- [ ] Configure conditional exports
- [ ] Update consumers to use env organ
- [ ] Use `workspace:^` protocol for morphai dependency

**Success Criteria**:

- Works across all target environments
- Graceful fallbacks for missing capabilities
- Type-safe environment access
- Zero runtime errors from missing env

### Sub-phase 5.5: Create Transport Organ

**Complexity**: Complex Organ - Network protocols and session management  
**Sequential**: Final organ, building on established patterns  
**Outcome**: Adaptive transport for local and remote MCP servers

**Tasks**:

- [ ] Create `ecosystem/organa/@oaknational/mcp-organ-transport/` structure
- [ ] Implement transport mechanisms:
  - [ ] `stdio.ts` - Local subprocess transport
  - [ ] `http-streamable.ts` - Remote Streamable HTTP (NOT SSE)
  - [ ] `session.ts` - Session management for stateful remote
  - [ ] `adaptive.ts` - Transport selection based on config
- [ ] Design transport abstraction interface
- [ ] Define RemoteSession interface for stateful operations
- [ ] Implement connection pooling for remote
- [ ] Add retry logic with exponential backoff
- [ ] Configure conditional exports
- [ ] Write integration tests for both transports
- [ ] Document SSE deprecation clearly

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
  ├── morphai/
  │   └── @oaknational/mcp-morphai/
  ├── organa/
  │   ├── @oaknational/mcp-organ-logger/
  │   ├── @oaknational/mcp-organ-storage/
  │   ├── @oaknational/mcp-organ-env/
  │   └── @oaknational/mcp-organ-transport/
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
**Outcome**: oak-mcp-core split into morphai and organs

**Tasks**:

- [ ] Identify remaining value in oak-mcp-core
- [ ] Move pure abstractions to morphai
- [ ] Move runtime capabilities to appropriate organs
- [ ] Create migration guide for existing consumers
- [ ] Deprecate oak-mcp-core package
- [ ] Update all dependencies
- [ ] Clean up redundant code

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

- <10KB per organ when tree-shaken
- Zero unused code in production bundles
- Bundle size regression tests in CI
- Clear documentation for bundler setup

### Sub-phase 5.9: Documentation and Examples

**Complexity**: Knowledge Transfer - Teaching the new model  
**Sequential**: After optimization, before validation  
**Outcome**: Comprehensive documentation for new architecture

**Tasks**:

- [ ] Update architecture-overview.md
- [ ] Create morphai/organa/psycha concept guide
- [ ] Write migration guide from old to new architecture
- [ ] Create example organisms using shared organs
- [ ] Update all README files
- [ ] Create troubleshooting guide
- [ ] Document package naming convention:
  - Morphai: `@oaknational/mcp-morphai`
  - Organs: `@oaknational/mcp-organ-{name}`
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

### Sub-phase 5.10: Performance Validation

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
2. **Keep morphai pure** - No runtime code in abstractions
3. **Ensure tree-shaking** - Use dynamic imports and conditional exports
4. **Document adaptation** - Clear docs on how organs adapt
5. **Version carefully** - Organs are shared dependencies

## Success Metrics

- **Architecture**: Three-tier separation achieved
- **Bundle Size**: <10KB per organ, <50KB total for minimal setup
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
1. **Foundation**: Create morphai package (5.1)
2. **First Organ**: Logger establishes organ patterns (5.2)
3. **Core Organs**: Storage (5.3) then Environment (5.4)
4. **Complex Organ**: Transport with session management (5.5)
5. **Restructure**: Directory reorganization (5.6)
6. **Decompose**: Split oak-mcp-core (5.7)
7. **Optimize**: Tree-shaking and bundle size (5.8)
8. **Document**: Comprehensive guides (5.9)
9. **Validate**: Performance testing (5.10)

**Why This Order**:
- Morphai first establishes the pure interfaces
- Logger organ creates the pattern for other organs
- Simple organs before complex ones
- Restructure only after all pieces exist
- Optimize and document the stable architecture
- Validate everything works as expected

## Next Steps After Phase 5

- Phase 6: Oak Open Curriculum API MCP implementation
- Phase 7: Production readiness and publishing
- Phase 8: Safety controls for write operations
- Phase 9: Ecosystem expansion with additional organisms
