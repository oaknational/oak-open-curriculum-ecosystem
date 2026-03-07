# vi.mock and Test Quality Audit Report

**Date:** 2024-12-17  
**Status:** Analysis Complete  
**Scope:** All test files with `vi.mock()` instances + broader test quality issues

---

## Executive Summary

| Category | Count | Action |
|----------|-------|--------|
| ❌ DELETE - Type Testing | ~600 lines | Delete immediately |
| ❌ DELETE - Implementation Testing | ~200 lines | Delete immediately |
| ❌ DELETE - Bug Fix Verification | ~50 lines | Delete immediately |
| ❌ DELETE - Negative Type Tests | ~150 lines | Delete immediately |
| ⚠️ REFACTOR - Global Mocks | 20 files | Product code needs DI |
| ✅ COMPLIANT - E2E Mocks | 11 files | Acceptable |

**Key Finding:** The codebase has widespread violations beyond `vi.mock`:

1. **Type Testing (~700 instances)** - Tests that prove types TypeScript already guarantees
2. **Implementation Testing (~200 instances)** - Mock call assertions proving HOW not WHAT
3. **Bug Fix Verification (~50 instances)** - One-time checks that shouldn't be permanent tests
4. **Syntax Testing (~50 instances)** - Tests that should be ESLint rules

---

## Part 1: vi.mock Analysis

### 1.1 Files with vi.mock (33 total)

```
apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/enum-validation-failure.e2e.test.ts
apps/oak-search-cli/app/api/search/route.integration.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/validation-failure.e2e.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/web-security-selective.e2e.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/string-args-normalisation.e2e.test.ts
apps/oak-search-cli/app/api/docs/page.integration.test.tsx
apps/oak-curriculum-mcp-streamable-http/e2e-tests/public-resource-auth-bypass.e2e.test.ts
apps/oak-curriculum-mcp-stdio/src/app/server.unit.test.ts
apps/oak-search-cli/app/ui/search/natural/NaturalSearch.unit.test.tsx
apps/oak-search-cli/src/lib/observability/api/zero-hit-api.unit.test.ts
apps/oak-search-cli/app/api/search/nl/route.integration.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/mcp-connection-timeout.e2e.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/application-routing.e2e.test.ts
apps/oak-search-cli/app/api/observability/zero-hit/route.integration.test.ts
packages/sdks/oak-sdk-codegen/code-generation/zodgen-core.unit.test.ts
apps/oak-search-cli/src/lib/observability/zero-hit.unit.test.ts
apps/oak-search-cli/app/layout.meta.unit.test.ts
apps/oak-search-cli/src/lib/suggestions/index.unit.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-call-envelope.e2e.test.ts
apps/oak-search-cli/app/lib/theme/ThemeSystemPreference.integration.test.tsx
apps/oak-search-cli/app/api/admin/fixtures.integration.test.ts
apps/oak-search-cli/tests/app/layout.ssr-cookie.integration.test.tsx
packages/sdks/oak-sdk-codegen/code-generation/zodgen-core.integration.test.ts
apps/oak-search-cli/app/lib/registry.unit.test.tsx
apps/oak-search-cli/app/api/search/suggest/route.integration.test.ts
packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts
apps/oak-search-cli/src/lib/observability/zero-hit-persistence.unit.test.ts
apps/oak-search-cli/src/lib/hybrid-search/index.unit.test.ts
apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-call-success.e2e.test.ts
apps/oak-search-cli/app/ui/global/Header/Header.integration.test.tsx
apps/oak-search-cli/src/lib/elastic-http.unit.test.ts
```

### 1.2 vi.mock Categorisation

#### ✅ Compliant: E2E Tests with Clerk Mocks (11 files)

These mock `@clerk/express` to avoid network IO in E2E tests - acceptable per testing strategy.

| File | Mock Purpose |
|------|-------------|
| `e2e-tests/enum-validation-failure.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/validation-failure.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/auth-enforcement.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/web-security-selective.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/string-args-normalisation.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/public-resource-auth-bypass.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/mcp-connection-timeout.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/application-routing.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/tool-call-envelope.e2e.test.ts` | Clerk middleware bypass |
| `e2e-tests/tool-call-success.e2e.test.ts` | Clerk middleware bypass |

#### ⚠️ Needs Refactoring: Global Module Mocks (20 files)

These violate the testing strategy rule: "ALL mocks MUST be simple fakes, passed as arguments to the function under test."

| File | Mocked Modules | Recommended Action |
|------|----------------|-------------------|
| `check-mcp-client-auth.unit.test.ts` | 5 modules | Accept deps as params |
| `app/api/search/route.integration.test.ts` | runHybridSearch, logZeroHit | Inject search function |
| `app/api/search/nl/route.integration.test.ts` | parseQuery, llmEnabled, env | Create route handler factory |
| `app/api/search/suggest/route.integration.test.ts` | runSuggestions | Inject suggestions function |
| `NaturalSearch.unit.test.tsx` | ./NaturalSearch.helpers | Pass as prop |
| `zero-hit-api.unit.test.ts` | env, persistence | Inject config |
| `zero-hit.unit.test.ts` | logger, persistence | Inject deps |
| `zero-hit-persistence.unit.test.ts` | env, es-client | Inject ES client |
| `suggestions/index.unit.test.ts` | es-client, logger | Inject ES client |
| `hybrid-search/index.unit.test.ts` | lessons, units, sequences | Create orchestrator accepting functions |
| `elastic-http.unit.test.ts` | es-client | Inject ES client |
| `zodgen-core.unit.test.ts` | node:fs, openapi-zod-client | Inject file system abstraction |
| `zodgen-core.integration.test.ts` | node:fs, openapi-zod-client | Same |
| `server.unit.test.ts` | @modelcontextprotocol/sdk/types | Inject types |
| `page.integration.test.tsx` | redoc | Inject as prop |
| `zero-hit/route.integration.test.ts` | API handlers | Inject handlers |
| `fixtures.integration.test.ts` | routes | Inject handlers |
| `layout.ssr-cookie.integration.test.tsx` | styled-components, next/headers | Simplify with abstraction |
| `universal-tools.unit.test.ts` | api-schema mcp-tools | Complete DI pattern |

---

## Part 2: Type Testing Violations

These tests prove types that TypeScript already guarantees at compile time.

### 2.1 Files to DELETE Entirely

| File | Lines | Reason |
|------|-------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` | 239 | 100% type/structure testing |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.unit.test.ts` | 187 | 100% type/structure testing |

### 2.2 Anti-Patterns Found

#### Pattern: `expect(x).toBeDefined()` (~347 instances)

```typescript
// ❌ WRONG - If x can be undefined, fix the TYPE
expect(result.structuredContent).toBeDefined();

// ✅ If the type says it exists, don't test it
// ✅ If it might not exist, the type should be `T | undefined`
```

**Files with most violations:**
- `universal-tools.integration.test.ts` (25+ instances)
- `tool-guidance-data.unit.test.ts` (20+ instances)
- `aggregated-help.unit.test.ts` (10+ instances)
- `aggregated-fetch.integration.test.ts` (8+ instances)

#### Pattern: `expect(typeof x).toBe('string')` (~82 instances)

```typescript
// ❌ WRONG - TypeScript proves this
expect(typeof toolGuidanceData.serverOverview.name).toBe('string');

// ✅ If the type is `string`, don't test it
```

**Files with most violations:**
- `tool-guidance-data.unit.test.ts` (15+ instances)
- `universal-tools.integration.test.ts` (8+ instances)
- `timing.unit.test.ts` (4 instances)

#### Pattern: `expect(Array.isArray(x)).toBe(true)` (~48 instances)

```typescript
// ❌ WRONG - TypeScript proves this
expect(Array.isArray(PUBLIC_TOOLS)).toBe(true);

// ✅ If the type is `T[]`, don't test it
```

#### Pattern: `expect(x).toHaveProperty(key)` without value (~211 instances)

```typescript
// ❌ WRONG - Just checking presence
expect(result).toHaveProperty('canonicalUrl');

// ✅ OK - Checking specific value
expect(result).toHaveProperty('canonicalUrl', 'https://...');
```

---

## Part 3: Implementation Testing Violations

These tests prove HOW code works, not WHAT it does.

### 3.1 Mock Call Assertions (~200 instances)

```typescript
// ❌ WRONG - Tests implementation, not behaviour
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(...);
expect(mockFn).not.toHaveBeenCalled();
```

**Files with violations:**

| File | Violation Count |
|------|-----------------|
| `check-mcp-client-auth.unit.test.ts` | 15+ |
| `app/api/search/route.integration.test.ts` | 10+ |
| `fixtures.integration.test.ts` | 8+ |
| `zero-hit/route.integration.test.ts` | 5+ |
| `zodgen-core.unit.test.ts` | 10+ |
| `zodgen-core.integration.test.ts` | 8+ |

### 3.2 Useless Tests

```typescript
// From server.unit.test.ts - proves NOTHING
it('iterates over literal tool descriptors in alphabetical order', () => {
  const sortedToolNames = [...toolNames].toSorted((a, b) => a.localeCompare(b));
  expect(sortedToolNames).toEqual(sortedToolNames.slice().sort((a, b) => a.localeCompare(b)));
});
```

---

## Part 4: Negative Assertions

Negative assertions (`expect(x).not.*`, `toBeUndefined()`, `toBeNull()`) are often signs of:
1. Bug fix verification tests (should be one-time manual checks)
2. Type testing in disguise
3. Implementation testing

### 4.1 Statistics

| Pattern | Count | Assessment |
|---------|-------|------------|
| `.not.to*` | ~210 | Mixed - many problematic |
| `.toBeUndefined()` | ~131 | Mostly type testing |
| `.toBeNull()` | ~44 | Some legitimate, many type testing |
| `.not.toThrow()` | ~20 | Borderline - often "code works" tests |
| `.toBeFalsy()` | 1 | Avoid - use specific assertion |

### 4.2 ❌ DELETE: "Bug Was Fixed" Tests

These tests verify a specific bug was fixed. The correct approach is a one-time manual check, not a permanent test.

```typescript
// From oak-logo-svg.unit.test.ts - lines 11-15
// ❌ This is proving a bug was fixed, not behaviour
it('should not have width/height attributes', () => {
  expect(OAK_LOGO_SVG).not.toMatch(/width="/);
  expect(OAK_LOGO_SVG).not.toMatch(/height="/);
});
```

```typescript
// From get-prm-url.unit.test.ts - lines 35-38
// ❌ Proving a specific bug was fixed
it('should not include /mcp suffix', () => {
  expect(result).not.toContain('/mcp');  // The bug was including /mcp
});
```

**Files with "bug fix verification" tests:**
- `oak-logo-svg.unit.test.ts` - SVG sizing attributes
- `get-prm-url.unit.test.ts` - URL path construction
- `widget-file-generator.unit.test.ts` - Script escaping
- `widget-cta.unit.test.ts` - Whitespace handling

### 4.3 ❌ DELETE: Type Testing via Negative Assertions

```typescript
// ❌ WRONG - Testing that undefined is returned (type should handle this)
expect(result).toBeUndefined();
expect(getSeeAlsoForTool('search')).toBeUndefined();
expect(resolveAllowedOrigins('allow_all', undefined, [])).toBeUndefined();
```

**Files with excessive `.toBeUndefined()` type tests:**

| File | Instances | Assessment |
|------|-----------|------------|
| `check-mcp-client-auth.unit.test.ts` | 6 | Return type should be `T \| AuthError`, not undefined |
| `tool-auth-context.unit.test.ts` | 5 | Testing invalid inputs return undefined |
| `security-config.unit.test.ts` | 5 | Return type issue |
| `mcp-body-parser.unit.test.ts` | 12 | Excessive edge case testing |
| `verify-clerk-token.unit.test.ts` | 4 | Return type issue |

### 4.4 ⚠️ BORDERLINE: `.not.toThrow()`

Most `.not.toThrow()` tests are borderline useless - they prove "the code runs" which is assumed.

```typescript
// ❌ WRONG - Just proving code doesn't throw
expect(() => {
  logger.error('test message', testError, testContext);
}).not.toThrow();

// ❌ WRONG - Proving valid input works (assumed)
expect(() => {
  generateCanonicalUrlWithContext('lesson', 'lesson:test-123');
}).not.toThrow();
```

**Exception - Legitimate uses:**

```typescript
// ✅ OK - Proving valid JSON is generated (complementary to positive test)
expect(() => {
  JSON.parse(getOntologyJson());
}).not.toThrow();

// ✅ OK - Proving valid JS syntax (build artifact validation)
expect(() => {
  new Function(jsContent);
}).not.toThrow();
```

### 4.5 ⚠️ BORDERLINE: `.not.toContain()` / `.not.toHaveProperty()`

Some are legitimate, many are bug-fix verification.

```typescript
// ✅ LEGITIMATE - Proving transformation removes unwanted content
expect(result).not.toContain('@zodios/core');  // Migration test
expect(result).not.toContain('.passthrough()');  // Zod v4 migration

// ❌ BUG FIX - One-time verification that shouldn't be a test
expect(result).not.toContain('/mcp');  // Specific bug
expect(html).not.toContain('> No Icon Action<');  // Whitespace fix
```

### 4.6 ✅ LEGITIMATE: Edge Case Handling

```typescript
// ✅ OK - Testing that missing input returns null (edge case)
expect(parseResourceUri('')).toBeNull();
expect(parseExamBoardFromSlug('maths-secondary')).toBeNull();

// ✅ OK - Testing error is cleared after recovery
expect(result.current.error).toBeNull();
```

---

## Part 5: Recommended Actions

### Priority 1: Delete Immediately (~1000 lines)

#### Files to Delete Entirely

| File | Lines | Reason |
|------|-------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` | 239 | 100% type testing |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.unit.test.ts` | 187 | 100% type testing |

#### Test Blocks to Delete

| File | Lines | Reason |
|------|-------|--------|
| `aggregated-help.unit.test.ts` | 12-49 | Type testing |
| `aggregated-knowledge-graph.unit.test.ts` | 26-54 | Type testing |
| `universal-tools.unit.test.ts` | 243-294 | Annotation type testing |
| `server.unit.test.ts` | 166-178 | Useless "sorted equals sorted" test |
| `oak-logo-svg.unit.test.ts` | 10-15 | Bug fix verification |

#### Patterns to Remove Globally

Run these searches and delete violations:

```bash
# Type testing - toBeDefined where type guarantees
rg "expect\([^)]+\)\.toBeDefined\(\)" --glob "*.test.ts*"

# Type testing - typeof checks
rg "expect\(typeof" --glob "*.test.ts*"

# Type testing - Array.isArray
rg "expect\(Array\.isArray" --glob "*.test.ts*"

# Implementation testing - mock call assertions
rg "expect\([^)]+\)\.toHaveBeenCalled" --glob "*.test.ts*"
rg "expect\([^)]+\)\.not\.toHaveBeenCalled" --glob "*.test.ts*"
```

### Priority 2: Refactor Product Code for DI (20 files)

The following product code needs to accept dependencies as parameters:

| Module | Current Issue | Refactor To |
|--------|---------------|-------------|
| `checkMcpClientAuth` | Imports 5 modules | Accept deps object |
| `runHybridSearch` | Imports search modules | Accept search functions |
| `esSearch` | Imports ES client | Accept client param |
| `logZeroHit` | Imports logger, persistence | Accept deps |
| `runSuggestions` | Imports ES client | Accept client param |

### Priority 3: Fix Root Causes

1. **Tighten Types**
   - Make optional properties required where always present
   - Use literal types (`true` instead of `boolean`) where values are known
   - Add `NonEmptyArray<T>` utility type

2. **Add ESLint Rules**
   - Non-empty array enforcement
   - Naming conventions (no kebab-case in titles)
   - No `expect(x).toBeDefined()` in tests (custom rule)

3. **Add ADR**
   - Document the test quality principles
   - Reference this audit as the baseline

---

## Appendix A: Testing Strategy Reference

From `.agent/directives/testing-strategy.md`:

> - Line 13: ALWAYS test behaviour, NEVER test implementation
> - Line 19: NEVER create complex mocks
> - Line 20: ALL mocks MUST be simple fakes, passed as arguments
> - Line 23: Always ask what a test is proving - it should prove something useful
> - Line 32: No useless tests - Each test must prove something useful
> - Line 37: No global state manipulation

From `.agent/directives/principles.md`:

> - Line 82: Tests are for logic, types are explored through creating tests, but types cannot be tested. If test only tests types, delete it.

---

## Appendix B: Decision Guide for Negative Assertions

### When to DELETE negative assertions

| Pattern | DELETE If | KEEP If |
|---------|-----------|---------|
| `.toBeUndefined()` | Testing return type | Testing edge case input handling |
| `.toBeNull()` | Testing return type | Testing parser/lookup failure |
| `.not.toThrow()` | Just proving "code runs" | Validating JSON/JS syntax of output |
| `.not.toContain()` | Proving specific bug was fixed | Proving transformation removes content |
| `.not.toHaveBeenCalled()` | Always | Never - this is implementation testing |
| `.not.toHaveProperty()` | Proving bug was fixed | Proving sensitive data is excluded |

### Question Checklist

Before keeping a negative assertion, ask:

1. **Is this testing a type?** → DELETE (TypeScript's job)
2. **Is this proving a bug was fixed?** → DELETE (one-time manual check)
3. **Is this testing implementation?** → DELETE (tests should be refactor-safe)
4. **Would this catch a real future bug?** → KEEP if yes
5. **Is there a positive assertion that proves the same thing?** → DELETE negative

---

## Appendix C: Search Commands for Violations

```bash
# All negative assertions
rg "expect\([^)]+\)\.not\." --glob "*.test.ts*" -c | sort -t: -k2 -nr

# Type testing patterns
rg "\.toBeDefined\(\)" --glob "*.test.ts*" -c | sort -t: -k2 -nr
rg "expect\(typeof" --glob "*.test.ts*" -c | sort -t: -k2 -nr
rg "Array\.isArray" --glob "*.test.ts*" -c | sort -t: -k2 -nr

# Implementation testing
rg "\.toHaveBeenCalled" --glob "*.test.ts*" -c | sort -t: -k2 -nr

# Property existence without value (borderline)
rg "\.toHaveProperty\([^,]+\)" --glob "*.test.ts*" -c | sort -t: -k2 -nr
```

---

## Appendix D: Files Ranked by Violation Density

Based on this audit, the files with the most violations per line:

| Rank | File | Violations | Assessment |
|------|------|------------|------------|
| 1 | `universal-tools.integration.test.ts` | 50+ | DELETE ENTIRE FILE |
| 2 | `tool-guidance-data.unit.test.ts` | 40+ | DELETE ENTIRE FILE |
| 3 | `check-mcp-client-auth.unit.test.ts` | 25+ | Refactor for DI |
| 4 | `mcp-body-parser.unit.test.ts` | 20+ | Review edge cases |
| 5 | `aggregated-help.unit.test.ts` | 15+ | Delete lines 12-49 |
| 6 | `correlation/middleware.integration.test.ts` | 15+ | Review necessity |
| 7 | `zodgen-core.unit.test.ts` | 15+ | Refactor for DI |
| 8 | `response-augmentation.unit.test.ts` | 15+ | Review necessity |
