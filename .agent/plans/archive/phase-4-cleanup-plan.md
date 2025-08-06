# Phase 4 Cleanup Plan

## Current State (2025-08-06)

### What's Working
- ✅ Error Framework implemented (ChainedError, ContextStorage, Result<T,E>)
- ✅ All 127 unit tests passing
- ✅ All 7 E2E tests passing  
- ✅ Type checking passes
- ✅ Build successful

### Critical Issues to Fix

#### 1. Genotype/Phenotype Violation (HIGH PRIORITY)
**Problem**: Node.js runtime dependencies in oak-mcp-core (genotype)
**Files**: 
- `oak-mcp-core/src/chora/aither/errors/context-storage.ts` (lines 122, 147)
- `oak-mcp-core/src/chora/aither/logging/context-logger.ts` (line 9)

**Solution**: 
- Move all runtime-specific implementations to phenotype
- Keep only pure abstractions in genotype
- Use factory pattern in phenotype to create runtime-appropriate implementations

#### 2. Linting Errors (MEDIUM PRIORITY)
**Problem**: Complexity and type safety issues
**Main issues**:
- Use of `any` types and type assertions
- `require()` imports in ESM context
- Complexity exceeding thresholds
- Nested blocks too deep

**Solution**:
- Replace `any` with proper types
- Remove `require()` calls
- Simplify complex functions
- Reduce nesting depth

#### 3. Async Feature Detection (LOW PRIORITY)
**Problem**: Adds unnecessary complexity
**File**: `oak-notion-mcp/src/chora/phaneron/runtime-detection/features.ts`

**Solution**: Already simplified by user - just needs linting fixes

## Implementation Strategy

### Step 1: Fix Genotype Purity
1. Create abstract interfaces in genotype
2. Move Node.js-specific implementations to phenotype
3. Add factory functions in phenotype

### Step 2: Fix Linting Errors
1. Replace all `any` types with proper types
2. Remove all `require()` imports
3. Break down complex functions
4. Reduce nesting levels

### Step 3: Validate Architecture
1. Run architecture-reviewer
2. Ensure no cross-boundary violations
3. Verify genotype has zero runtime dependencies

## Success Criteria
- [ ] Zero Node.js imports in oak-mcp-core
- [ ] All linting errors resolved
- [ ] All tests still passing
- [ ] Build still successful
- [ ] Architecture review passes