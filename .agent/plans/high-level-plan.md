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
| 5.5 | 🚧 MITIGATED | Runtime Isolation | Proceeding with boundary isolation strategy |
| 6 | 📅 IN PROGRESS | Oak Curriculum API | SDK + MCP server implementation |
| 7 | 📋 PLANNED | Performance & Optimization | HTTP transport, tree-shaking |
| 8 | 🔮 FUTURE | Multi-Organism Ecosystem | Additional MCP servers |

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

## Phase 5.5: Runtime Isolation 🚧 MITIGATION STRATEGY

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

## Phase 6: Oak Curriculum API Integration 📅 IN PROGRESS

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

**Key Learning**: The reference implementation's sophistication was in the two-stage pipeline - not just using openapi-typescript, but also extracting runtime constants and type guards automatically.

**Key Insight**:
- Original implementation doesn't just generate types
- It extracts runtime constants, type guards, and mappings
- Everything needed for a fully typed client is generated automatically

#### Sub-phase 6.2: MCP Server Structure 📋 PLANNED

**CRITICAL NEXT STEP**: Research existing MCP server implementations to copy patterns from before creating custom implementation.

- **Location**: `ecosystem/psycha/oak-curriculum-mcp`
- **Pattern**: Biological architecture (chorai/organa/psychon)
- **Integration**: SDK wrapped as organ
- **Testing**: Integration and E2E tests

**Note**: Directory structure fixed from `chora` to `chorai` (plural form)

#### Sub-phase 6.3: Multi-Server Coexistence 📋 PLANNED

- **Goal**: oak-notion-mcp and oak-curriculum-mcp running together
- **Configuration**: Independent but compatible
- **Testing**: Cross-server interaction tests

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

## Phase 7: Performance & Optimization 📋 PLANNED

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

## Phase 8: Ecosystem Expansion 🔮 FUTURE

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

## 🎬 Next Actions

1. **First**: Type and validator generation pipeline
2. **Then**: SDK implementation with boundary isolation
3. **Next**: MCP server with biological architecture
4. **Finally**: Multi-server validation and integration

## 📚 References

- [Architecture Guide](../../docs/agent-guidance/architecture.md) - Authoritative biological architecture reference
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [Rules](../directives-and-memory/rules.md) - Core development principles
- [Phase 6 Plan](phase-6-oak-curriculum-api.md) - Detailed implementation plan

---

**Note**: This plan supersedes all previous planning documents. When conflicts arise, this document is authoritative.
