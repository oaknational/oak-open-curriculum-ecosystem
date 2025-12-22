# Test Isolation Root Cause Analysis

**Date**: 2025-12-21  
**Updated**: 2025-12-22  
**Status**: Analysis Complete - DI Refactoring ~90% Complete

---

## Summary

Test failures when removing process isolation are **not caused by missing cleanup**. They are caused by **global state mutation** which violates our testing strategy.

The proper fix requires **product code refactoring**, not test changes.

---

## What We Discovered

### Initial Hypothesis (WRONG)

"Tests need better cleanup - add `afterEach` hooks to clean up timers and mocks."

### Actual Root Cause (CORRECT)

Tests mutate `window.matchMedia` globally via `Object.defineProperty`, which is equivalent to `vi.stubGlobal` - explicitly forbidden by testing-strategy.md line 25.

```typescript
// mock-match-media.ts
export function mockMatchMedia(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => createMediaQueryList({ matches, query })),
  });
}
```

This creates race conditions when tests run in parallel without process isolation.

---

## Why Adding Cleanup Doesn't Work

1. **Still mutates global state during execution** - cleanup happens after damage is done
2. **Race conditions persist** - parallel tests see each other's mutations
3. **Violates architectural principle** - working around the problem, not fixing it
4. **Hides the real issue** - product code has poor dependency management

---

## The Right Fix

Product code must accept `matchMedia` as an injected dependency:

### Before (Global Dependency)

```typescript
// Product code
function useBreakpointMatch(name: string): boolean {
  const media = window.matchMedia(query);  // ← Direct global access
  return media.matches;
}

// Test
mockMatchMedia(true);  // ← Global mutation
render(<Component />);
```

### After (Dependency Injection)

```typescript
// Product code
function useBreakpointMatch(name: string): boolean {
  const { matchMedia } = useMediaQuery();  // ← Injected dependency
  const media = matchMedia(query);
  return media.matches;
}

// Test
const mockAPI = { matchMedia: vi.fn(...) };
render(
  <MediaQueryContext.Provider value={mockAPI}>
    <Component />
  </MediaQueryContext.Provider>
);
```

No global mutation, no race conditions, tests are simple.

---

## Lessons Learned

### 1. Question Assumptions

**Assumption**: "Tests are failing, so tests need fixing"  
**Reality**: Tests revealed a product code architecture issue

### 2. Solve at the Right Layer

**Wrong layer**: Add cleanup to work around global state  
**Right layer**: Refactor product code to eliminate global state

### 3. First Question

**"Could it be simpler without compromising quality?"**

Yes - with proper DI, tests become trivial:
- No global mutations
- No complex cleanup
- No race conditions
- Just pass a mock via props/context

### 4. Testing Strategy is Non-Negotiable

Line 25: "Tests MUST NOT manipulate shared global state"

This isn't a guideline - it's a hard requirement. When tests violate it, the fix is **always** to refactor product code, never to add workarounds.

---

## Action Items

1. ✅ Add `window.matchMedia` violation to global state elimination plan
2. ✅ Create matchMedia DI refactoring plan
3. ✅ Update test isolation fix plan to reflect root cause
4. ✅ Execute DI refactoring (~90% complete, completing quality gates)
   - ✅ Create MediaQueryContext with provider, hook, SSR fallback
   - ✅ Refactor product code (SearchSecondary, theme-utils, ThemeContext, Providers)
   - ✅ Refactor tests to use context provider
   - ✅ Delete obsolete mock-match-media files
   - ✅ Fix type discipline violations discovered during build (`unknown[]` → `BulkOperations`)
   - ⏳ Complete quality gate suite (type-check and lint:fix in progress)
5. ⏳ Verify tests pass after refactoring (pending quality gates)
6. ⏳ Document pattern in ADR for future browser API usage

## Current State (2025-12-22)

### Completed
- All product code refactored to use DI for `matchMedia`
- All tests refactored to inject mocks via Context
- No global state mutations remaining
- Type discipline restored across Elasticsearch bulk operations pipeline
- Quality gates: `type-gen` ✅, `build` ✅

### In Progress
- Fixing remaining type errors in `search-index-target.unit.test.ts`
- Fixing lint errors in `index-oak-helpers.ts`
- Completing quality gate suite

---

## Related Documents

- **DI Plan**: [matchmedia-di-refactoring-plan.md](../architecture/matchmedia-di-refactoring-plan.md)
- **Test Fix Plan**: [test-isolation-architecture-fix.md](test-isolation-architecture-fix.md)
- **Global State Plan**: [global-state-elimination-and-testing-discipline-plan.md](../quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md)
- **Testing Strategy**: `.agent/directives-and-memory/testing-strategy.md`

---

## Meta-Reflection

This analysis demonstrates the value of:

1. **Stepping back** - Don't just fix the immediate symptom
2. **Questioning assumptions** - "Are we solving the right problem?"
3. **Right layer thinking** - Architecture issues need architecture fixes
4. **Foundation documents** - Testing strategy guided us to the real issue
5. **First Question** - Simplicity comes from proper design, not clever workarounds

The test failures were a **gift** - they revealed a fundamental architecture problem that process isolation was hiding.


