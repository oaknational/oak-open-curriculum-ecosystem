# Phase 1 Blocking Issue: Test Suite Memory Exhaustion

**Status**: ❌ BLOCKING  
**Created**: 2025-12-21  
**Priority**: Critical - Must fix before continuing with Phases 2-4

---

## Issue Summary

Phase 1 (tier field cleanup) is functionally complete but **test quality gate is failing**:
- Tests: 489/492 passed
- Error: Worker process crashes with OOM during cleanup
- Exit code: 1 (failing gate)

## Root Cause Analysis

### Immediate Cause
- Config has `isolate: true` with `pool: 'forks'`
- 89 test files × separate processes = memory exhaustion
- Each process loads large OpenAPI schema (~6500 lines)
- Memory exhausted during cleanup phase

### Underlying Cause
Per [`vitest.config.ts` comment](../../apps/oak-open-curriculum-semantic-search/vitest.config.ts#L18-19):
```typescript
// Force process isolation to prevent global state pollution between tests
// TODO: Refactor tests to use dependency injection instead of process.env mutation
```

The isolation exists **because the code has shared state issues**. This is documented in:
- [`.agent/plans/quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md`](../quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md)

**Catch-22**:
- Without `isolate: true`: Tests fail intermittently from shared state
- With `isolate: true`: Memory exhaustion

## Type Shortcuts Identified

In `index-oak-helpers.ts`:
```typescript
lessonOps: unknown[]  // ❌ Violates rules.md - destroys type information
rollupSnippets: Map<string, string[]>  // ❌ Too generic
```

Should be:
```typescript
lessonOps: BulkOperation[]  // ✅ Specific ES bulk format
rollupSnippets: Map<UnitSlug, LessonSnippet[]>  // ✅ Domain types
```

## What Rules Say

From [`.agent/directives-and-memory/rules.md`](../../directives-and-memory/rules.md):
> **Line 61**: All quality gates are blocking at all times, regardless of location, cause, or context.
> **Line 60**: Never work around checks - fix the root cause.
> **Line 68**: No type shortcuts - Never use `unknown`, they disable the type system.

## Options

### Option 1: Fix Shared State (Proper Solution)
Follow the global-state-elimination plan:
- Remove `process.env` mutations from tests (22 remaining)
- Implement DI for config instead of reading `process.env` directly
- This allows removing `isolate: true` without test failures
- **Effort**: 4-6 hours
- **Benefit**: Fixes root cause permanently

### Option 2: Optimize Memory (Workaround)
- Use `poolOptions.forks.maxForks` to limit concurrent processes
- **Problem**: Still a workaround, doesn't fix shared state
- **Against rules**: "Never work around checks"

### Option 3: Continue with Broken Gate (Not Acceptable)
- Phase 1 remains incomplete
- **Against rules**: "All quality gates are blocking"

## Recommended Path

1. **Stop current work** - Do not proceed to Phase 2-4
2. **Fix shared state issues** in semantic-search package:
   - Remove `process.env` mutations from tests
   - Implement config DI
   - Remove `isolate: true` from config
3. **Fix type shortcuts** (`unknown[]` → proper types)
4. **Re-run quality gates** until all pass
5. **Then** resume Phases 2-4

## Updates Required

Document current state in:
- [`.agent/plans/semantic-search/part-1-search-excellence.md`](part-1-search-excellence.md)
- [`.agent/prompts/semantic-search/semantic-search.prompt.md`](../../prompts/semantic-search/semantic-search.prompt.md)

## Success Criteria

- [ ] `pnpm test` exits 0 (no OOM)
- [ ] No `unknown` types in return values
- [ ] `isolate: true` removed (shared state fixed)
- [ ] All quality gates pass

---

## References

- [Global State Elimination Plan](../quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md)
- [Rules](../../directives-and-memory/rules.md)
- [Testing Strategy](../../directives-and-memory/testing-strategy.md)

