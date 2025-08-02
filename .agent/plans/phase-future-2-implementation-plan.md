# Phase Future 2 Implementation Plan: Framework Extraction

## Overview

Extract the generic MCP components built in Phase 3 into the oak-mcp-core library, creating a reusable framework for building MCP servers at Oak National and beyond.

## Extraction Philosophy

The boundary validation principle from Phase 3 creates a natural extraction point:

- **Generic Core (oak-mcp-core)**: All validation-agnostic components (~3,050 LoC)
- **Integration Layer (oak-notion-mcp)**: Boundary validation + Notion-specific adapters (<1,000 LoC)

This separation ensures oak-mcp-core remains pure and reusable while integrations handle their specific validation needs.

## Prerequisites

- Phase 3 completed with all abstractions in place
- ~3,050 LoC of generic code ready for extraction (exceeding current codebase)
- Clear separation between generic and Notion-specific code
- Boundary validation pattern established and proven
- All abstractions tested and proven in production
- All code follows AGENT.md principles (TDD, pure functions, injected IO)
- Edge runtime compatibility demonstrated

## High-Level Timeline (3 weeks)

### Week 1: Repository Setup & Core Extraction

- Set up oak-mcp-core repository with TDD infrastructure
- Extract foundation layers (logging, errors, config) with tests
- Establish build and publishing pipeline
- Ensure all IO is injectable, no hardcoded imports

### Week 2: Pattern Extraction & API Design

- Extract remaining patterns and utilities (with tests first)
- Design public API surface (pure functions preferred)
- Create plugin architecture with dependency injection

### Week 3: Migration & Documentation

- Migrate oak-notion-mcp to use oak-mcp-core
- Create comprehensive documentation
- Build example MCP servers

## Key Deliverables

### 1. oak-mcp-core Library

**Repository Structure**:

```
@oak-national/mcp-core/
├── src/
│   ├── logging/          # Zero-dependency logging framework (550 LoC)
│   ├── errors/           # Comprehensive error handling (300 LoC)
│   ├── config/           # Multi-source configuration (200 LoC)
│   ├── validation/       # Validation framework (150 LoC)
│   ├── server/           # MCP server base classes (150 LoC)
│   ├── middleware/       # Composable middleware (150 LoC)
│   ├── registry/         # Registry system (200 LoC)
│   ├── lifecycle/        # Lifecycle management (100 LoC)
│   ├── monitoring/       # Performance monitoring (100 LoC)
│   ├── testing/          # Testing utilities (200 LoC)
│   ├── utils/            # Type guards, pagination, etc. (950 LoC)
│   └── index.ts          # Public API exports
├── examples/             # Example MCP servers
├── docs/                 # API documentation
└── tests/                # Test doubles and utilities
```

**Technical Decisions** (to be made):

- Monorepo vs single package
- Build tool selection (tsup, rollup, etc.)
- Versioning strategy (semantic versioning)
- Publishing automation
- TDD framework setup (Vitest)
- Documentation approach (TSDoc + examples)

### 2. Migration Strategy

**Approach**:

1. Extract code with minimal changes
2. Update imports in oak-notion-mcp
3. Direct replacement (no compatibility layers)
4. Version appropriately if breaking changes needed

**Key Challenges** (to be discovered):

- Circular dependency resolution
- Type definition exports
- Testing infrastructure sharing
- Documentation generation

### 3. Example Implementations

**Proof of Concept Servers** (all with TDD):

- **Echo Server** (100 LoC) - Pure functions only, demonstrates basic patterns
- **File System Browser** (300 LoC) - Injected file system IO, boundary validation for paths
- **HTTP API Wrapper** (200 LoC) - Injected HTTP client, validates API responses
- **GitHub MCP Server** (400 LoC) - Real-world example with Octokit types

Each example demonstrates:

- Proper IO injection and pure function design
- Boundary validation using Zod schemas
- Use of library types (fs.Dirent, Octokit types, etc.) after validation
- Error handling with ChainedError
- Logging with correlation IDs
- Test coverage patterns

## Success Metrics

### Quantitative

- [ ] Extract 3,050 LoC into oak-mcp-core
- [ ] Reduce oak-notion-mcp to <1,000 LoC (validation + adapters only)
- [ ] Build 3+ example servers in <300 LoC each
- [ ] Achieve <50KB bundle size
- [ ] Support 4+ runtime environments (Node.js, Deno, Bun, CF Workers)
- [ ] 80% edge runtime compatibility achieved

### Qualitative

- [ ] Clear, intuitive API with pure functions preferred
- [ ] Comprehensive documentation with boundary validation patterns
- [ ] Smooth migration path with zero breaking changes
- [ ] Active adoption by other teams
- [ ] Example servers demonstrate validation boundary pattern

## Open Questions (to be answered during implementation)

1. **API Design**
   - How much should we expose vs keep internal?
   - Plugin API vs inheritance model?
   - Synchronous vs asynchronous APIs?

2. **Edge Runtime Support**
   - How to handle Node.js polyfills?
   - WebAssembly for compute-intensive operations?
   - Best practices for multi-runtime packages?

3. **Developer Experience**
   - CLI scaffolding tool?
   - IDE integration?
   - Debugging tools?

4. **Community**
   - Open source strategy?
   - Contribution guidelines?
   - Support model?

## Risk Areas (to be monitored)

1. **Scope Creep**: Stay focused on MCP, avoid general framework features
2. **Over-Engineering**: Keep it simple (KISS), iterate based on feedback
3. **Breaking Changes**: Use versioning, no compatibility layers
4. **Performance**: Ensure abstractions don't add overhead (<5% benchmark)
5. **Type Safety**: No `as`, no `any`, no `!` assertions
6. **Error Handling**: Fail FAST with helpful messages, never swallow errors
7. **Boundary Confusion**: Keep validation separate from core logic
8. **Runtime Compatibility**: Test on all target environments early

## Next Steps

1. Complete Phase 3 with extraction in mind
2. Review and refine this plan based on Phase 3 learnings
3. Get stakeholder approval for oak-mcp-core
4. Begin repository setup

## Notes

This plan will evolve significantly as we:

- Complete Phase 3 and learn from the abstractions
- Discover additional patterns worth extracting
- Get feedback from potential users
- Understand edge runtime limitations better

The key is to remain flexible while maintaining the vision of a reusable, high-quality MCP framework.

## Boundary Validation Pattern for oak-mcp-core

The framework will provide tools for implementing boundary validation but won't enforce specific validation schemas:

```typescript
// oak-mcp-core provides the pattern
export interface BoundaryValidator<TExternal, TInternal> {
  validate(raw: TExternal): TInternal;
}

// Integrations implement their specific validation
class NotionPageValidator implements BoundaryValidator<unknown, PageObjectResponse> {
  validate(raw: unknown): PageObjectResponse {
    const parsed = notionPageSchema.parse(raw);
    if (!isFullPage(parsed)) {
      throw new ValidationError('Invalid page');
    }
    return parsed;
  }
}
```

This ensures oak-mcp-core remains generic while providing powerful patterns for safe integrations.
