# High-Level Implementation Plan

**Last Updated**: 2025-01-10  
**Status**: AUTHORITATIVE - All other plans are superseded by this document  
**Lead Developer**: Claude (with multi-agent collaboration)

## 🎯 Vision

Build a robust MCP ecosystem using biological architecture principles, starting with Notion integration and expanding to Oak Curriculum API. The system demonstrates multi-organism coexistence, runtime adaptability, and clean architectural boundaries.

## 🏗️ Architectural Foundation

### Biological Model (Moria/Histoi/Psycha)

```text
┌─────────────────── ECOSYSTEM ───────────────────┐
│                                                  │
│  MORIA (Pure Abstractions - Zero Dependencies)   │
│    ↓                                             │
│  HISTOI (Runtime-Adaptive Tissues)               │
│    ↓                                             │
│  PSYCHA (Complete Organisms/Applications)        │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Package Organization Strategy

- **`ecosystem/`**: Biological architecture (Moria/Histoi/Psycha)
- **`packages/`**: Conventional TypeScript packages (no biological patterns)
- **`reference/`**: External code for analysis only (never imported)

## 📊 Phase Status Overview

| Phase | Status | Description | Key Outcome |
|-------|--------|-------------|-------------|
| 1-4 | ✅ COMPLETED | Foundation & Setup | Monorepo, quality gates, initial structure |
| 5 | ✅ COMPLETED | Moria/Histoi/Psycha Evolution | Biological architecture implemented |
| 5.5 | 🚧 MITIGATED | Runtime Isolation (SDK only) | Proceeding with boundary isolation strategy |
| 6 | 🚧 IN PROGRESS | Oak Curriculum API | SDK + MCP server with full tool coverage |
| 7 | 🎯 CRITICAL | Full Ecosystem Runtime Isolation | Edge runtime compatibility |
| 8 | 📋 PLANNED | Performance & Optimization | HTTP transport, tree-shaking |
| 9 | 🔮 FUTURE | Multi-Organism Ecosystem | Additional MCP servers |

## Phase 5: Moria/Histoi/Psycha Architecture ✅ COMPLETED

Successfully evolved from monolithic to biological architecture:

### Achievements

- Created three-tier ecosystem (Moria → Histoi → Psycha)
- Established runtime-adaptive tissues
- Implemented clean dependency hierarchy
- Zero dependencies in Moria packages
- ESLint rules enforce architectural boundaries

### Current Structure

```text
ecosystem/
├── moria/           # Pure abstractions
│   └── moria-mcp/   # Interfaces, types, patterns
├── histoi/          # Runtime-adaptive tissues
│   ├── histos-logger/
│   ├── histos-storage/
│   ├── histos-transport/
│   └── histos-env/
└── psycha/          # Complete organisms
    └── oak-notion-mcp/
```

## Phase 5.5: Runtime Isolation

### For SDK COMPLETE, for Repo as a whole, superseded by Phase 7

**Original Goal**: Remove all Node.js globals from core logic  
**Current Status**: MITIGATED through boundary isolation  
**Decision**: Deferred until after SDK integration but BEFORE MCP tool exposure (hard blocker)  
**Implementation**: SDK can use Node dependencies initially, but must be isolated before MCP tools are exposed

### Mitigation Approach

1. **Core Logic**: Pure TypeScript with no Node.js dependencies
2. **Boundaries**: Node.js adapters injected at edges only
3. **SDK Design**: Platform-agnostic core with runtime adapters
4. **Future Work**: Complete isolation can happen incrementally

### Why This Works

- SDK core will be pure TypeScript
- Node dependencies isolated to adapters
- MCP server can inject appropriate runtime
- Maintains architectural integrity while enabling progress

## Phase 6: Oak Curriculum API Integration 🚧 IN PROGRESS

### Overview

Add Oak National Academy's curriculum API as a new MCP organism, demonstrating multi-organism coexistence.

### Architecture Decisions

1. **Package Structure**
   - SDK: `packages/oak-curriculum-sdk` (conventional TypeScript)
   - MCP: `ecosystem/psycha/oak-curriculum-mcp` (biological architecture)

2. **ElasticSearch Scope**
   - **DEFERRED** to future phase (not part of Phase 6)
   - Use Oak API's native search capabilities for MVP
   - Will be added as enhancement after core functionality is proven
   - Simplifies initial implementation significantly

3. **Type Generation Strategy (CORRECTED)**
   - Use `openapi-typescript` package to generate complete API types
   - Copy original's two-stage pipeline:
     - Stage 1: openapi-typescript generates paths & operations
     - Stage 2: Custom processing extracts runtime constants, type guards
   - Generated files in `src/types/generated/api-schema/`:
     - `api-paths-types.ts` - Complete paths interface
     - `api-schema.ts` - Runtime schema object
     - `path-parameters.ts` - Extracted values and type guards
   - ONLY manual step when API changes: regenerate types
   - Zod validators will be added to same automatic pipeline later

4. **Code Reuse Strategy (CORRECTED)**
   - Copy original implementation wholesale where possible
   - Minimal modifications only for paths and package names
   - Remove incompatible existing code that doesn't align
   - Everything must be automatic - no manual type maintenance

### Implementation Progress

#### Sub-phase 6.1: SDK Foundation ✅ COMPLETED

- **Location**: `packages/oak-curriculum-sdk`
- **Pattern**: Conventional TypeScript package using openapi-fetch
- **Strategy**: Copy original implementation wholesale
- **Testing**: Use generated types for full type safety

**Achievements**:

- ✅ Successfully copied reference's two-stage type generation pipeline
- ✅ Generated all 4 files with complete type safety:
  - `api-paths-types.ts` - Complete paths interface from openapi-typescript
  - `api-schema.ts` - Runtime schema object
  - `api-schema.json` - Cached OpenAPI spec
  - `path-parameters.ts` - Extracted constants and type guards
- ✅ Implemented openapi-fetch client pattern (BaseApiClient)
- ✅ Added auth middleware for Bearer token injection
- ✅ Created factory functions for both client types
- ✅ All quality gates passing (format, lint, type-check, test, build)
- ✅ Removed all incompatible custom implementation
- ✅ Runtime isolation implemented with multi-environment support (Node.js and Cloudflare Workers)

**Key Learning**: The reference implementation's sophistication was in the two-stage pipeline - not just using openapi-typescript, but also extracting runtime constants and type guards automatically.

**Key Insight**:

- Original implementation doesn't just generate types
- It extracts runtime constants, type guards, and mappings
- Everything needed for a fully typed client is generated automatically

#### Sub-phase 6.2: MCP Server Structure ✅ COMPLETED (2025-01-12)

- **Location**: `ecosystem/psycha/oak-curriculum-mcp`
- **Pattern**: Biological architecture (chorai/organa/psychon)
- **Integration**: SDK wrapped as organ with proper contracts
- **Testing**: 38 tests passing (unit, integration, E2E)
- **Quality**: Zero technical debt, all functions <50 lines, complexity <8
- **Production Ready**: All quality gates passing

#### Sub-phase 6.3: Multi-Server Coexistence ✅ COMPLETED

- **Goal**: oak-notion-mcp and oak-curriculum-mcp running together
- **Configuration**: Independent but compatible
- **Testing**: Cross-server interaction tests

#### Sub-phase 6.4: Build Configuration ✅ COMPLETED

- **Multi-entry point build**: tsup configuration
- **Pagination support**: Already supported by API
- **Startup script**: Environment variable loading from root .env
- **File logging**: Daily rotation to .logs directory

#### Sub-phase 6.5: Full MCP Tool Coverage 🚧 IN PROGRESS

- **Current State**: 4/25 tools implemented (search, get lesson, list key stages/subjects)
- **Target State**: 25+ tools covering all API endpoints
- **Critical Gap**: Missing transcript, quiz, and asset access
- **Timeline**: 4.5-day implementation (0.5 day for critical fixes)
- **Sub-Agent Reviews**: ✅ Completed (4 agents reviewed)
  - Code Reviewer: Avoid runtime registry, keep flat structure
  - Architecture: Strong compliance, use interface segregation
  - Test Auditor: Excellent foundation, add registry tests
  - Config Auditor: **CRITICAL** - Build failures must be fixed first
- **See**: [Phase 6 Implementation Plan](phase-6-oak-curriculum-api-implementation-plan.md) for full details

### Success Criteria (UPDATED)

- [✅] SDK uses openapi-typescript for complete type automation
- [✅] Original's type generation pipeline successfully copied
- [✅] Runtime constants and type guards automatically extracted
- [✅] Client implementation uses openapi-fetch pattern
- [✅] Tests adapted to use generated types
- [✅] Quality gates passing (format, lint, type-check, test, build)
- [ ] MCP server implementation (researching references first)
- [ ] Both servers can run simultaneously
- [ ] Full system integration tested

### Implementation Sequence

- **Foundation**: SDK with type/validator generation and boundary isolation
- **Server Structure**: MCP implementation with biological patterns
- **Integration**: Full system validation and multi-server support

## Phase 7: Full Ecosystem Runtime Isolation 🎯 CRITICAL

### Goals

Enable the entire MCP ecosystem to run in edge runtimes (Cloudflare Workers, Deno Deploy, etc.) by isolating all runtime-specific logic.

### Current State

- SDK: ✅ Partially isolated (config supports Node.js and Cloudflare)
- Histoi tissues: ❌ Still have Node.js dependencies
- MCP servers: ❌ Depend on Node.js-specific packages

### Implementation Strategy

1. **Create Runtime Abstraction Layer**
   - Define interfaces for all runtime operations
   - File system, environment variables, crypto, streams
   - Network operations, process management

2. **Implement Runtime Adapters**
   - Node.js adapter (default)
   - Cloudflare Workers adapter
   - Deno adapter (future)
   - Browser adapter (future)

3. **Conditional Imports**
   - Use dynamic imports for runtime-specific code
   - Detect runtime environment at startup
   - Load appropriate adapter

4. **Update All Packages**
   - Histoi tissues: Remove direct Node.js usage
   - MCP servers: Use runtime abstraction
   - Build tools: Support multiple target environments

### Success Criteria

- [ ] All packages can build for edge runtimes
- [ ] Runtime detection and adapter loading works
- [ ] No Node.js globals in core logic
- [ ] Tests pass in multiple environments
- [ ] Documentation for edge deployment

### Priority: HIGH

This phase is a **hard blocker** for production deployment to edge environments and must be completed before the MCP ecosystem can be considered production-ready.

## Phase 8: Performance & Optimization 📋 PLANNED

### Goals

- HTTP transport support (beyond stdio)
- Tree-shaking optimization
- Bundle size reduction
- Performance benchmarking

### Key Work Items

- Implement HTTP transport in histoi tissue
- Optimize package exports for tree-shaking
- Add performance monitoring
- Create benchmark suite

## Phase 9: Ecosystem Expansion 🔮 FUTURE

### Vision

Multiple specialized MCP organisms coexisting:

- GitHub MCP server
- Slack MCP server
- Google Workspace MCP server
- Custom domain-specific servers

### Architectural Benefits

- Shared histoi tissues reduce duplication
- Consistent patterns across organisms
- Runtime adaptability for different environments
- Clear boundaries enable independent evolution

## 🛠️ Development Principles

### Core Rules (from rules.md)

1. **Simplicity First**: Could it be simpler without compromising quality?
2. **Pure Functions First**: TDD design, no side effects in core logic
3. **Clear Boundaries**: Define boundaries at each scale with index.ts
4. **Fail Fast**: Never fail silently, provide helpful errors
5. **No Disabled Checks**: Never disable quality gates or linting

### Testing Strategy

1. **TDD Always**: Write tests FIRST
2. **Test Behaviour**: Not implementation details
3. **Simple Mocks**: Complex mocks indicate need for refactoring
4. **Test Types**:
   - Unit tests: Pure functions only (*.unit.test.ts)
   - Integration tests: Component interaction (*.integration.test.ts)
   - E2E tests: Full system behaviour (*.e2e.test.ts)

### Quality Gates (Sequential)

1. `pnpm format` - Code formatting
2. `pnpm type-check` - TypeScript validation
3. `pnpm lint` - ESLint with architectural rules
4. `pnpm test` - Unit and integration tests
5. `pnpm build` - Build verification
6. `pnpm test:e2e` - End-to-end tests (manual trigger)

## 🔄 Future Refinements

### Zod Validation Integration (Deferred from Phase 6.1.4)

**Original Plan**: Add Zod validation to the type generation pipeline

**Current Status**: DEFERRED - Using existing type predicates

**Rationale**:

- Current type predicates provide basic runtime validation
- TypeScript interfaces ensure compile-time safety
- Adding Zod now would introduce complexity without clear immediate benefit
- MCP server can add Zod validation at its boundaries when needed

**Future Implementation Options**:

1. **OpenAPI → Zod libraries** (`openapi-zod`, `openapi-zod-client`)
2. **TypeScript → Zod transformation** (`ts-to-zod`)
3. **Manual generation from existing data**

**Reconsideration Triggers**:

- API returns malformed data in production
- MCP server tool input validation needs
- Runtime validation errors become frequent
- Data transformation/coercion capabilities needed

## 🎬 Next Actions

1. **First**: Continue with MCP server structure (Phase 6.2)
2. **Then**: Implement MCP tools with biological architecture
3. **Next**: Multi-server validation and integration
4. **Finally**: Performance optimisation and ecosystem expansion

## 📚 References

- [Architecture Guide](../../docs/agent-guidance/architecture.md) - Authoritative biological architecture reference
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [Rules](../directives-and-memory/rules.md) - Core development principles
- [Phase 6 Plan](phase-6-oak-curriculum-api.md) - Detailed implementation plan

---

**Note**: This plan supersedes all previous planning documents. When conflicts arise, this document is authoritative.
