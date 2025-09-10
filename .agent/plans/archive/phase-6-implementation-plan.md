# Phase 6 Implementation Plan: Oak Curriculum API Integration

## Overview

This plan details the implementation of Oak Curriculum API integration through two packages:

1. `oak-curriculum-sdk` - A conventional SDK package
2. `oak-curriculum-mcp` - A biologically-architected MCP server

## Sub-Phase 6.1: SDK Foundation (2-3 days)

### Tasks

1. **Package Setup**
   - [ ] Refactor transplanted placeholder code
   - [ ] Add openapi-fetch and zod dependencies
   - [ ] Configure TypeScript for strict mode
   - [ ] Set up build pipeline with tsup

2. **Type Generation**
   - [ ] Create scripts/typegen.ts for OpenAPI schema fetching
   - [ ] Generate types from Oak API schema
   - [ ] Create type mapping utilities
   - [ ] Add type generation to build process

3. **Base Client Implementation**
   - [ ] Create client factory with API key injection
   - [ ] Implement authentication middleware
   - [ ] Add dual client support (method and path-based)
   - [ ] Create error handling utilities

4. **High-Level API Methods**
   - [ ] Implement searchLessons method
   - [ ] Add getLesson with full content retrieval
   - [ ] Create getUnit and getSequence methods
   - [ ] Add subject and key stage navigation

5. **Testing**
   - [ ] Write comprehensive unit tests for pure functions
   - [ ] Create integration tests for client operations
   - [ ] Set up proper test fixtures and mocks

## Sub-Phase 6.2: MCP Server Structure (2-3 days)

### Tasks

1. **Biological Architecture Setup**
   - [ ] Create chora directories (morphai, stroma, aither, phaneron, eidola)
   - [ ] Set up organa structure (curriculum, mcp)
   - [ ] Initialize psychon orchestration layer
   - [ ] Configure ESLint biological rules

2. **Chorai Implementation**
   - [ ] Define core types in stroma
   - [ ] Set up logging in aither
   - [ ] Create configuration types in phaneron
   - [ ] Add environment interfaces in eidola

3. **Curriculum Organ**
   - [ ] Create curriculum operations interface
   - [ ] Implement search functionality
   - [ ] Add content retrieval methods
   - [ ] Build caching layer for API responses

4. **MCP Organ**
   - [ ] Define MCP tool interfaces
   - [ ] Create resource provider structure
   - [ ] Implement protocol compliance layer
   - [ ] Add error handling for MCP operations

5. **Psychon Wiring**
   - [ ] Create dependency injection setup
   - [ ] Wire organs together
   - [ ] Initialize MCP server
   - [ ] Add startup validation

## Sub-Phase 6.3: MCP Integration (3-4 days)

### Tasks

1. **Tool Implementation**
   - [ ] oak-search-lessons tool
   - [ ] oak-get-lesson tool
   - [ ] oak-list-subjects tool
   - [ ] oak-browse-curriculum tool
   - [ ] oak-get-assets tool

2. **Resource Providers**
   - [ ] Static subject list resource
   - [ ] Dynamic lesson content resource
   - [ ] Unit summary resource
   - [ ] Curriculum hierarchy resource

3. **Caching & Rate Limiting**
   - [ ] Implement LRU cache for API responses
   - [ ] Add rate limiter for Oak API
   - [ ] Create cache invalidation strategy
   - [ ] Monitor API usage metrics

4. **Error Handling**
   - [ ] API error transformation
   - [ ] MCP protocol error handling
   - [ ] Graceful degradation strategies
   - [ ] User-friendly error messages

## Sub-Phase 6.4: Testing & Documentation (2-3 days)

### Tasks

1. **Unit Testing**
   - [ ] Test pure functions in SDK
   - [ ] Test organ operations
   - [ ] Test type transformations
   - [ ] Test cache behavior

2. **Integration Testing**
   - [ ] Test SDK client operations
   - [ ] Test organ interactions
   - [ ] Test MCP tool execution
   - [ ] Test resource retrieval

3. **E2E Testing**
   - [ ] MCP protocol compliance tests
   - [ ] Full workflow tests
   - [ ] Error scenario tests
   - [ ] Performance benchmarks

4. **Documentation**
   - [ ] SDK usage guide
   - [ ] MCP server configuration
   - [ ] API reference documentation
   - [ ] Example implementations

## Implementation Order

### Week 1

1. **Day 1-2**: SDK foundation - package setup, type generation
2. **Day 3-4**: Base client and high-level methods
3. **Day 5**: SDK testing and refinement

### Week 2

1. **Day 1-2**: MCP server biological structure
2. **Day 3-4**: Organ implementation
3. **Day 5**: Psychon wiring and integration

### Week 3

1. **Day 1-2**: MCP tools and resources
2. **Day 3**: Caching and rate limiting
3. **Day 4-5**: Testing and documentation

## Quality Gates

After each sub-phase, run:

1. `pnpm format` - Code formatting
2. `pnpm lint` - ESLint validation
3. `pnpm type-check` - TypeScript validation
4. `pnpm test` - Unit and integration tests
5. `pnpm build` - Build verification

## Risk Mitigation

### Technical Risks

1. **API Changes**: Lock to specific Oak API version
2. **Rate Limits**: Implement aggressive caching
3. **Type Drift**: Automated type generation in CI
4. **Network Issues**: Retry logic with backoff

### Architecture Risks

1. **Biological Violations**: ESLint rules enforcement
2. **Cross-Organ Dependencies**: Strict module boundaries
3. **Circular Dependencies**: Dependency injection pattern
4. **Complexity Creep**: Regular refactoring cycles

## Success Criteria

### SDK Success

- [ ] Type-safe API operations
- [ ] Zero runtime dependencies on environment
- [ ] > 80% test coverage
- [ ] Clean API surface

### MCP Server Success

- [ ] Full biological architecture compliance
- [ ] All MCP tools functional
- [ ] <100ms operation overhead
- [ ] Proper caching behavior

### Overall Success

- [ ] Both packages pass quality gates
- [ ] Documentation complete
- [ ] Examples working
- [ ] Sub-agents approve architecture

## Next Steps

1. Begin Sub-Phase 6.1 with SDK package cleanup
2. Set up type generation pipeline
3. Implement base client following reference patterns
4. Regular grounding and sub-agent reviews

## Notes

- Keep SDK simple and focused
- MCP server handles all complexity
- Build comprehensive test coverage for all new code
- Adapt reference patterns to our standards
- Document as you build
- Regular quality gate checks

## Context

The existing placeholder code was transplanted from earlier work and serves as a starting point. The reference implementation provides valuable patterns and approaches, but our implementation will be built to our own high standards with proper testing, error handling, and architectural patterns.
