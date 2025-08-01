# Phase Future 2 Implementation Plan: Framework Extraction

## Overview

Extract the generic MCP components built in Phase 3 into the oak-mcp-core library, creating a reusable framework for building MCP servers at Oak National and beyond.

## Prerequisites

- Phase 3 completed with all abstractions in place
- ~2,500 LoC of generic code ready for extraction
- Clear separation between generic and Notion-specific code
- All abstractions tested and proven in production
- All code follows AGENT.md principles (TDD, pure functions, injected IO)

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

**Repository Structure** (to be refined):

```
@oak-national/mcp-core/
├── src/
│   ├── logging/          # Zero-dependency logging framework
│   ├── errors/           # Comprehensive error handling
│   ├── config/           # Multi-source configuration
│   ├── server/           # MCP server base classes
│   ├── middleware/       # Composable middleware
│   ├── testing/          # Testing utilities
│   ├── utils/            # Type guards, pagination, etc.
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

- Simple echo server (100 LoC) - pure functions only
- File system browser (300 LoC) - injected file system IO
- HTTP API wrapper (200 LoC) - injected HTTP client

These will validate the framework's usability and identify missing abstractions.
All examples must demonstrate proper IO injection and pure function design.

## Success Metrics

### Quantitative

- [ ] Extract 2,500+ LoC into oak-mcp-core
- [ ] Reduce oak-notion-mcp to <1,000 LoC
- [ ] Build 2+ example servers in <500 LoC each
- [ ] Achieve <50KB bundle size
- [ ] Support 4+ runtime environments

### Qualitative

- [ ] Clear, intuitive API
- [ ] Comprehensive documentation
- [ ] Smooth migration path
- [ ] Active adoption by other teams

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
4. **Performance**: Ensure abstractions don't add overhead
5. **Type Safety**: No `as`, no `any`, no `!` assertions
6. **Error Handling**: Fail FAST with helpful messages, never swallow errors

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
