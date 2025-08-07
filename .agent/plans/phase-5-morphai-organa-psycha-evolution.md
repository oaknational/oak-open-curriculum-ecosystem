# Phase 5: Morphai/Organa/Psycha Evolution Plan

## Overview

Transform the monolithic genotype/phenotype model into a three-tier biological ecosystem with transplantable organs, based on the [Target Architecture](../architecture/target-architecture.md).

## Core Insight

Different kinds of shared code want to live in different places. The current oak-mcp-core violates the Single Responsibility Principle by trying to be three things simultaneously:
1. Pure abstractions (no IO)
2. Runtime capabilities (need IO) 
3. Development conveniences (opinionated patterns)

## Implementation Sub-phases

### Sub-phase 5.1: Create Morphai Package
**Timeline**: 2 days  
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
- [ ] Set up build pipeline for morphai
- [ ] Write tests for all pure functions
- [ ] Update oak-mcp-core to depend on morphai

**Success Criteria**:
- Zero runtime dependencies
- 100% test coverage for pure functions
- All interfaces well-documented
- Package builds and publishes successfully

### Sub-phase 5.2: Create Logger Organ
**Timeline**: 2 days  
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
      "node": "./dist/node.mjs",
      "edge-light": "./dist/edge.mjs",
      "default": "./dist/adaptive.mjs"
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
**Timeline**: 2 days  
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
**Timeline**: 1 day  
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

**Success Criteria**:
- Works across all target environments
- Graceful fallbacks for missing capabilities
- Type-safe environment access
- Zero runtime errors from missing env

### Sub-phase 5.5: Create Transport Organ
**Timeline**: 3 days  
**Outcome**: Adaptive transport for local and remote MCP servers

**Tasks**:
- [ ] Create `ecosystem/organa/@oaknational/mcp-organ-transport/` structure
- [ ] Implement transport mechanisms:
  - [ ] `stdio.ts` - Local subprocess transport
  - [ ] `http-streamable.ts` - Remote Streamable HTTP (NOT SSE)
  - [ ] `session.ts` - Session management for stateful remote
  - [ ] `adaptive.ts` - Transport selection based on config
- [ ] Design transport abstraction interface
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
**Timeline**: 2 days  
**Outcome**: Complete biological organization

**Tasks**:
- [ ] Create new directory structure:
  ```
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
- [ ] Update Turborepo configuration
- [ ] Update CI/CD pipelines
- [ ] Update all documentation references

**Success Criteria**:
- All tests passing after restructure
- Build pipeline working
- No broken imports
- Documentation updated

### Sub-phase 5.7: Refactor oak-mcp-core
**Timeline**: 2 days  
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
**Timeline**: 2 days  
**Outcome**: Minimal bundle sizes through proper tree-shaking

**Tasks**:
- [ ] Audit all packages for side effects
- [ ] Mark packages as `"sideEffects": false`
- [ ] Convert all imports to dynamic where appropriate
- [ ] Test bundle sizes with different configurations
- [ ] Document bundler configuration examples
- [ ] Create bundle size benchmarks
- [ ] Add bundle size checks to CI

**Success Criteria**:
- <10KB per organ when tree-shaken
- Zero unused code in production bundles
- Bundle size regression tests in CI
- Clear documentation for bundler setup

### Sub-phase 5.9: Documentation and Examples
**Timeline**: 2 days  
**Outcome**: Comprehensive documentation for new architecture

**Tasks**:
- [ ] Update architecture-overview.md
- [ ] Create morphai/organa/psycha concept guide
- [ ] Write migration guide from old to new architecture
- [ ] Create example organisms using shared organs
- [ ] Update all README files
- [ ] Create troubleshooting guide
- [ ] Document runtime adaptation patterns
- [ ] Add code examples for each pattern

**Success Criteria**:
- Clear conceptual documentation
- Working examples for all patterns
- Migration path documented
- Troubleshooting guide complete

### Sub-phase 5.10: Performance Validation
**Timeline**: 1 day  
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
4. **Version Coordination**: Use workspace protocol for internal deps
5. **Migration Complexity**: Incremental migration with clear guides

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

## Estimated Timeline

Total: ~18 days (3.5 weeks) with parallel work possible

## Next Steps After Phase 5

- Phase 6: Oak Open Curriculum API MCP implementation
- Phase 7: Production readiness and publishing
- Phase 8: Safety controls for write operations
- Phase 9: Ecosystem expansion with additional organisms