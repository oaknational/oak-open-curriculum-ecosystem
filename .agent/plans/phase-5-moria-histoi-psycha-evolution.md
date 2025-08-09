# Phase 5: Moria/Histoi/Psycha Evolution Plan

**Status**: IN PROGRESS  
**Progress**: Sub-phases 5.1-5.5 ✅ COMPLETED | 5.6-5.11 ⏳ PENDING  
**Last Updated**: 2025-08-09  
**Last Comprehensive Review**: 2025-08-09

## 🎯 Executive Summary

Phase 5 transforms our monolithic genotype/phenotype model into a three-tier biological ecosystem. We have successfully completed the foundation (Moria) and core tissues (Logger, Storage, Environment), with all quality gates passing. The architecture is sound and ready for expansion.

### Current State

- **Moria Package**: ✅ Zero dependencies, pure abstractions (A+ implementation)
- **Histoi Tissues**: ✅ Three adaptive tissues operational
- **Integration**: ✅ Critical ESM build issues resolved
- **Quality**: 149 tests passing, 0 lint errors, 0 type errors
- **Test Violations**: ✅ All fixed (useless tests deleted, skipped tests replaced)
- **Directory Structure**: ✅ Reorganized to ecosystem/psycha/oak-notion-mcp
- **Dist Exclusion**: ✅ All packages have .prettierignore files

### Next Immediate Action

**Implement ESLint boundary rules** to enforce architectural constraints programmatically

---

## 📊 Comprehensive Code Review Results (2025-08-09)

### Overall Assessment: **EXCELLENT** with minor improvements needed

#### Moria Package: **A+ (Exceptional)**

- ✅ **PERFECT**: Zero dependencies achieved
- ✅ **EXCELLENT**: Pure function implementation
- ✅ **EXCELLENT**: Single source of truth for types
- ✅ **EXCELLENT**: TDD compliance in tests
- ✅ **EXCELLENT**: Module boundaries and exports

#### Histoi Tissues: **B+ (Good with issues)**

- ✅ **GOOD**: Proper dependency management (only Moria + minimal externals)
- ✅ **GOOD**: Feature detection implementation
- ✅ **EXCELLENT**: Transplantability achieved
- ⚠️ **NEEDS WORK**: Test quality (useless tests, complex mocks)
- ⚠️ **NEEDS WORK**: Test file naming conventions

#### Architecture Compliance: **A (Excellent)**

- ✅ **EXCELLENT**: Moria → Histoi → Psycha hierarchy maintained
- ✅ **EXCELLENT**: No circular dependencies
- ✅ **EXCELLENT**: Transplantable tissues
- ⚠️ **MINOR**: Some direct organ internal imports in psychon

### Critical Issues Found

1. **Test Quality Violations** (MUST FIX):
   - Useless tests in histos-logger (entire test file)
   - Skipped tests in histos-storage (violates rules)
   - Complex mocks in storage tests (signals design problem)
   - Wrong test file naming (missing .unit/.integration suffix)

2. **Configuration Issues** (SHOULD FIX):
   - Missing cross-references in some package.json files
   - Inconsistent script naming across packages

### Rule Violations Detected

| Rule | Location | Violation | Severity |
|------|----------|-----------|----------|
| No skipped tests | histos-storage/tests | 3 skipped test blocks | HIGH |
| No useless tests | histos-logger/tests | Entire file tests nothing | HIGH |
| Test file naming | All test files | Missing .unit/.integration suffix | MEDIUM |
| No complex mocks | histos-storage/tests | Complex vi.doMock usage | MEDIUM |

---

## 🏗️ Architecture Overview

### Three-Tier Biological Ecosystem

```text
ecosystem/
├── moria/                    # Pure abstractions (molecules/atoms)
│   └── mcp-moria/           # Zero dependencies, interfaces & types
├── histoi/                   # Adaptive tissues (connective matrix)
│   ├── histos-logger/       # Logging tissue (Consola-based)
│   ├── histos-storage/      # Storage tissue (FS/LocalStorage/Memory)
│   └── histos-env/          # Environment tissue (Node/Edge/Memory)
└── oak-notion-mcp/          # Living organism (psycha)
```

### Dependency Flow (Strictly Enforced)

```text
Psycha → Histoi → Moria
  ↓        ↓        ↓
Can use  Can use  ZERO
both     Moria    deps
```

---

## ✅ Completed Sub-phases

### Sub-phase 5.1: Moria Package ✅ COMPLETED
**Grade: A+** | **Status: Production Ready**

Successfully created the zero-dependency foundation with:
- Pure interfaces (Logger, Storage, Environment, EventBus)
- Result monad implementation
- State machine types
- Boundary patterns (Pure/Effect/Boundary)
- 22 high-quality unit tests

### Sub-phase 5.2: Logger Tissue ✅ COMPLETED
**Grade: B** | **Status: Needs Test Cleanup**

Implemented unified Consola-based logger with:
- Feature detection for Node.js capabilities
- Graceful degradation
- ⚠️ Tests need complete rewrite (currently useless)

### Sub-phase 5.3: Storage Tissue ✅ COMPLETED
**Grade: B+** | **Status: Needs Test Refactor**

Three-backend storage implementation:
- FileSystem (Node.js)
- LocalStorage (Browser)
- Memory (Universal fallback)
- ⚠️ Complex mocks indicate design issue
- ⚠️ Has skipped tests (rule violation)

### Sub-phase 5.4: Environment Tissue ✅ COMPLETED
**Grade: B+** | **Status: Functional**

Environment abstraction with:
- Node environment (process.env + dotenv)
- Edge environment (context-based)
- Memory environment (testing/fallback)
- Feature detection (not runtime detection)

---

## 📋 Immediate Action Items ✅ COMPLETED (2025-08-09)

### 1. Fix Test Violations ✅ COMPLETED
- Deleted useless test file from histos-logger
- Renamed test files with proper .unit/.integration suffixes
- Replaced skipped tests with real integration tests
- Removed complex mocks in favor of real filesystem tests

### 2. Directory Restructure ✅ COMPLETED
- Created ecosystem/psycha/ directory
- Moved oak-notion-mcp to psycha/oak-notion-mcp
- Updated all import paths and configurations
- All quality gates passing

### 3. Dist File Exclusion ✅ COMPLETED
- Added .prettierignore to all packages
- Ensured dist/ is excluded from all quality checks
- Verified with successful prettier format:check

---

## 🚀 Remaining Sub-phases (Reordered for Optimal Flow)

### Sub-phase 5.5: Restructure Directory Layout ✅ COMPLETED
**Grade: A** | **Status: Production Ready**

Successfully reorganized the ecosystem structure:
- Created `ecosystem/psycha/` directory
- Moved `oak-notion-mcp` → `psycha/oak-notion-mcp`
- Updated all import paths (30+ files)
- Updated workspace configurations
- All quality gates passing (149 tests, 0 errors)

### Sub-phase 5.6: ESLint Architectural Enforcement ⏳ NEXT
**Complexity: MEDIUM** | **Estimated: 1 day**

#### Rationale
Enforce the new structure immediately after creating it (no point building more without proper tooling)

#### Tasks
1. Implement import boundary rules
2. Enforce Moria zero-dependency rule
3. Prevent cross-tissue imports
4. Prevent cross-organism imports in psycha
5. Add clear error messages for violations
6. Test with intentional violations

### Sub-phase 5.7: Create STDIO Transport Tissue ⏳
**Complexity: MEDIUM** | **Estimated: 2 days**

#### Rationale
Only the STDIO transport is needed for Oak API MCP - HTTP can wait

#### Objectives
Create minimal `@oaknational/mcp-histos-transport` with STDIO support only

#### Detailed Tasks
1. **Setup Package Structure**
   ```bash
   mkdir -p ecosystem/histoi/histos-transport/src
   mkdir -p ecosystem/histoi/histos-transport/tests
   ```

2. **Write Tests FIRST (TDD)**
   - `tests/stdio.integration.test.ts` - stdio transport tests
   - `tests/adaptive.integration.test.ts` - adaptation logic tests (stdio only for now)

3. **Implement STDIO Components Only**
   ```typescript
   // src/types.ts - Transport interfaces
   interface Transport {
     send(message: Message): Promise<void>;
     receive(): AsyncIterator<Message>;
     close(): Promise<void>;
   }
   
   // src/stdio.ts - Local subprocess transport
   class StdioTransport implements Transport { ... }
   
   // src/adaptive.ts - Simple selection (stdio only for now)
   export function createAdaptiveTransport(config: Config): Transport {
     return new StdioTransport(config);
   }
   ```

4. **Success Criteria**
   - STDIO transport working for local MCP servers
   - Clean interface for future HTTP addition
   - All quality gates passing

### Sub-phase 5.8: Documentation Update ⏳
**Complexity: MEDIUM** | **Estimated: 2 days**

#### Rationale
Document the stable architecture before adding more organisms

#### Tasks
1. Update architecture-overview.md with final structure
2. Document the Moria/Histoi/Psycha model clearly
3. Create tissue adaptation pattern documentation
4. Update all package README files
5. Create troubleshooting guide

---

## 🎯 Phase 6: Oak Curriculum API MCP (Separate Phase)

After Phase 5 core work is complete, we move to Phase 6 to add the Oak API organism.

---

## 🔄 Post-Oak API Work (Lower Priority)

### Sub-phase 5.9: Add HTTP Transport to Transport Tissue ⏳
**Complexity: HIGH** | **Estimated: 2-3 days**

#### Rationale
Remote deployment capability - can wait until after Oak API is working locally

#### Tasks
1. Add HTTP transport tests
2. Implement Streamable HTTP (NOT SSE)
3. Add session management for stateful operations
4. Update adaptive selection to choose transport based on config
5. Add retry logic with exponential backoff

### Sub-phase 5.10: Optimize Tree-Shaking ⏳
**Complexity: LOW** | **Estimated: 1 day**

#### Rationale
Performance optimization - do this after functionality is complete

#### Tasks
1. Audit for side effects
2. Add `"sideEffects": false` to package.json files
3. Test bundle sizes
4. Add bundle size CI checks
5. Target: <10KB per tissue when tree-shaken

### Sub-phase 5.11: Performance Validation ⏳
**Complexity: MEDIUM** | **Estimated: 2 days**

#### Rationale
Measure and validate optimizations

#### Tasks
1. Create benchmark suite
2. Test in Node.js, Edge, Browser
3. Measure memory and startup time
4. Add regression tests
5. Document performance characteristics

---

## 📈 Success Metrics

### Achieved ✅
- Zero dependencies in Moria
- Transplantable Histoi tissues
- No circular dependencies
- All quality gates passing
- Critical ESM issues resolved
- oak-mcp-core deleted (no longer exists)

### Pending ⏳
- Proper directory structure (psycha folder)
- ESLint architectural enforcement
- STDIO transport for local MCP
- Documentation updates
- (Later) HTTP transport for remote deployment
- (Later) <10KB bundle per tissue
- (Later) Performance benchmarks

---

## 🔍 Critical Success Factors

1. **MAINTAIN ZERO DEPENDENCIES IN MORIA** - This is non-negotiable
2. **FIX ALL TEST VIOLATIONS** - No exceptions to testing rules
3. **ENFORCE ARCHITECTURE WITH TOOLING** - ESLint rules prevent violations
4. **BUILD FUNCTIONALITY FIRST** - Optimize later
5. **RUN QUALITY GATES** - After every change

---

## 🎬 Next Steps (In Priority Order)

1. **NOW**: Implement ESLint boundary rules (Sub-phase 5.6)
2. **TODAY**: Test ESLint rules with intentional violations
3. **TOMORROW**: Create STDIO transport tissue (Sub-phase 5.7)
4. **THIS WEEK**: Update architecture documentation (Sub-phase 5.8)
5. **NEXT**: Move to Phase 6 for Oak API MCP
6. **LATER**: Add HTTP transport, optimize performance

---

## 📝 Lessons Learned

### What Worked Well
1. **Zero-dependency Moria** - Proves the concept is viable
2. **Feature detection** - More reliable than runtime detection
3. **Separate build configs** - Libraries vs applications need different treatment
4. **TDD for pure functions** - Result.ts is exemplary

### What Needs Improvement
1. **Test quality in Histoi** - Too many useless tests
2. **Complex mocking** - Indicates design problems
3. **Test file naming** - Inconsistent conventions
4. **Documentation** - Need clearer adaptation patterns

### Key Insights
1. **ESM requires explicit extensions** - Node.js cannot import directories
2. **Libraries ≠ Applications** - Different bundling strategies needed
3. **Feature detection > Runtime detection** - More reliable and future-proof
4. **Complex mocks = Bad design** - Simplify the code, not the tests
5. **Build functionality before optimizing** - Get it working, then make it fast

---

## ⚠️ Risk Mitigation

| Risk | Mitigation | Status |
|------|------------|--------|
| Breaking changes | No compatibility layers, use versioning | ✅ |
| Test quality degradation | Strict enforcement of rules | ⚠️ Must fix NOW |
| Architecture violations | ESLint enforcement after restructure | ⏳ |
| Premature optimization | Build Oak API first, optimize later | ✅ |

---

## 📚 References

- [ADR-023: Moria/Histoi/Psycha Architecture](../../docs/architecture/architectural-decisions/023-moria-histoi-psycha-architecture.md)
- [Architecture Guide](../../docs/agent-guidance/architecture.md)
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md)
- [Rules](../.agent/directives-and-memory/rules.md)
- [AGENT.md](../.agent/directives-and-memory/AGENT.md)

---

## 🏁 Definition of Done for Phase 5

Phase 5 will be complete when:
- [x] Moria package with zero dependencies
- [x] Core Histoi tissues (Logger, Storage, Environment)
- [x] All test violations fixed
- [x] Directory structure reorganized to psycha/
- [ ] ESLint boundaries enforced
- [ ] STDIO transport operational
- [ ] Documentation updated
- [ ] Ready for Phase 6 (Oak Curriculum API)

**Note**: HTTP transport, optimization, and performance validation moved to post-Oak API work.