# Phase 2.5 Implementation Plan: Working WITH the Libraries

## Starting Point: Revert to Working State

Based on analysis of the git history, we need to start by reverting to the last known working state (commit `58c0dbf`) and selectively keeping only the valuable improvements.

### Changes to Keep:

1. **Documentation** - All new docs and improvements
2. **Logging Enhancements** - File logging, data scrubbing
3. **Error Handling** - Process error handlers, transport logging
4. **Zod Schemas** - Well-defined input validation schemas

### Changes to Discard:

1. **McpServer Migration** - Incorrect usage of high-level API
2. **NotionClientWrapper Changes** - Type gymnastics and mismatches
3. **Complex Tool Handlers** - Tuple-based approach adds complexity
4. **Type Over-engineering** - Unnecessary abstractions and `any` types

### Revert Strategy:

```bash
# Reset src/ to working state
git checkout 58c0dbf -- src/

# Cherry-pick specific improvements
git checkout HEAD -- src/logging/logger.ts
git checkout HEAD -- src/index.ts  # For error handling
git checkout HEAD -- docs/

# Keep the Zod schemas for later use
cp src/mcp/tools/schemas.ts /tmp/schemas-backup.ts
```

## Overview

Phase 2.5 is a complete architectural restructuring based on the fundamental insight: **We've been fighting the libraries instead of working with them**. This plan focuses on:

1. Using library types directly (no wrappers, no substitute types)
2. Following MCP SDK patterns as documented
3. Implementing proper pure functions and dependency injection
4. Fixing all TypeScript violations

## Core Principles

Based on [AGENT.md](../directives-and-memory/AGENT.md), [TypeScript Practice](../../docs/typescript-practice.md), and [Development Practice](../../docs/development-practice.md):

- **NEVER use `any` or type assertions (`as`)**
- **NEVER create substitute types for library types**
- **ALWAYS use library types directly**
- **ALWAYS use pure functions with dependency injection**
- **ALWAYS validate at boundaries with Zod**
- **Single source of truth for each type**

## Root Cause Analysis

### What Went Wrong

1. **NotionClientWrapper** - Adds no value, creates type mismatches
2. **MCP SDK misunderstanding** - Trying to pass Zod schemas as inputSchema instead of plain objects
3. **Type system abuse** - Using `any` and `as` to hide problems instead of fixing them
4. **No pure functions** - Everything has side effects, making testing difficult
5. **Complex mocks** - Indicates architectural problems

### What the Libraries Actually Expect

#### MCP SDK Pattern (from [reference](../reference/mcp-typescript-sdk-readme.md))

```typescript
server.registerTool(
  'add',
  {
    title: 'Addition Tool',
    description: 'Add two numbers',
    inputSchema: { a: z.number(), b: z.number() }, // Plain object with Zod validators
  },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }],
  }),
);
```

#### Notion SDK Pattern

- Use types directly: `PageObjectResponse`, `DatabaseObjectResponse`, etc.
- Use type guards: `isFullPage()`, `isFullDatabase()`, etc.
- Handle errors with `isNotionClientError()`

## Implementation Strategy

### Phase 1: Remove Harmful Abstractions

#### 1.1 Eliminate NotionClientWrapper

**Goal**: Use Notion Client directly with its native types

**Tasks**:

1. Delete `src/notion/client.ts` wrapper
2. Update all imports to use `@notionhq/client` directly
3. Use Notion SDK types everywhere (no custom types)
4. Fix all resulting type errors properly (no `any`, no `as`)

**Example**:

```typescript
// OLD: Through wrapper
import { NotionClientWrapper } from './notion/client.js';

// NEW: Direct usage
import { Client } from '@notionhq/client';
import type { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client';
```

#### 1.2 Fix MCP Tool Registration

**Goal**: Follow MCP SDK patterns correctly

**Tasks**:

1. Update tool registration to match SDK examples
2. Use plain objects with Zod validators for inputSchema
3. Parse/validate inside handlers, not in registration

**Correct Pattern**:

```typescript
// From MCP SDK examples
server.registerTool(
  'notion-search',
  {
    title: 'Search Notion',
    description: 'Search for pages and databases',
    inputSchema: {
      query: z.string().min(1),
      filter: z.optional(
        z.object({
          type: z.enum(['page', 'database']),
        }),
      ),
    },
  },
  async (args) => {
    // args is already validated by MCP SDK
    const results = await notion.search(args);
    return {
      content: [{ type: 'text', text: formatResults(results) }],
    };
  },
);
```

### Phase 2: Implement Pure Functions

#### 2.1 Extract Business Logic

**Goal**: Separate pure business logic from IO

**Tasks**:

1. Identify all business logic mixed with IO
2. Extract to pure functions
3. Pass dependencies as arguments
4. Write unit tests for pure functions

**Example**:

```typescript
// Pure function for formatting
export function formatSearchResults(
  results: Array<PageObjectResponse | DatabaseObjectResponse>,
): string {
  // Pure transformation logic
  return results
    .map((result) => {
      if (result.object === 'page') {
        return `📄 Page: ${extractTitle(result)}`;
      } else {
        return `🗂️ Database: ${extractTitle(result)}`;
      }
    })
    .join('\n');
}

// Integration point with injected dependency
export function createSearchHandler(notion: Client) {
  return async (args: SearchArgs) => {
    const results = await notion.search(args); // IO
    const formatted = formatSearchResults(results.results); // Pure
    return { content: [{ type: 'text', text: formatted }] };
  };
}
```

#### 2.2 Proper Dependency Injection

**Goal**: Make all dependencies explicit and mockable

**Pattern**:

```typescript
// Dependencies interface
interface ToolDependencies {
  notion: Client;
  logger: Logger;
}

// Factory function with dependency injection
export function createTools(deps: ToolDependencies) {
  return {
    search: createSearchHandler(deps.notion, deps.logger),
    listDatabases: createListDatabasesHandler(deps.notion, deps.logger),
    // ... etc
  };
}
```

### Phase 3: Fix Type System

#### 3.1 Use SDK Type Guards

**Goal**: Replace manual type checking with SDK utilities

**Tasks**:

1. Import type guards from Notion SDK
2. Remove all type assertions
3. Use proper narrowing

**Example**:

```typescript
import { isFullPage, isFullDatabase } from '@notionhq/client';

// Proper type narrowing
if (isFullPage(response)) {
  // response is now typed as PageObjectResponse
  const title = response.properties.title;
}
```

#### 3.2 Zod Only at Boundaries

**Goal**: Use Zod for validation at external boundaries only

**Where to use Zod**:

- Validating environment variables
- Validating configuration files
- Inside tool handlers for runtime validation (if needed)

**Where NOT to use Zod**:

- As type definitions (use TypeScript interfaces)
- For internal function parameters
- As MCP inputSchema (use plain objects with Zod validators)

### Phase 4: Testing Strategy

Based on [Testing and Development Strategy](../../docs/testing-and-development-strategy.md):

#### 4.1 Unit Tests for Pure Functions

**Example**:

```typescript
// formatters.unit.test.ts
describe('formatSearchResults', () => {
  it('should format page results correctly', () => {
    const mockPage = createMockPage({ title: 'Test Page' });
    const result = formatSearchResults([mockPage]);
    expect(result).toBe('📄 Page: Test Page');
  });
});
```

#### 4.2 Integration Tests with Simple Mocks

**Example**:

```typescript
// handlers.integration.test.ts
describe('createSearchHandler', () => {
  it('should search and format results', async () => {
    const mockNotion = {
      search: vi.fn().mockResolvedValue({
        results: [createMockPage()],
        has_more: false,
      }),
    };

    const handler = createSearchHandler(mockNotion);
    const result = await handler({ query: 'test' });

    expect(mockNotion.search).toHaveBeenCalledWith({ query: 'test' });
    expect(result.content[0].text).toContain('Page:');
  });
});
```

## Pre-Implementation Checklist

Before starting any code changes:

1. **Create a safety branch**: `git checkout -b phase-2.5-refactor`
2. **Run initial quality gates**: Capture baseline metrics
   ```bash
   pnpm type-check 2>&1 | tee baseline-type-errors.txt
   pnpm lint 2>&1 | tee baseline-lint-errors.txt
   pnpm test 2>&1 | tee baseline-test-results.txt
   ```
3. **Review MCP SDK examples**: Re-read the SDK documentation
4. **Review Notion SDK types**: Open the type definitions for reference

## Implementation Order

### Step 0: Create Test Infrastructure First (1 hour)

Before any refactoring, set up proper test helpers:

1. **Create Mock Factories**
   - `src/test-helpers/notion-mocks.ts` - Already exists, enhance it
   - Add factories that use actual Notion SDK types
   - No custom types, use SDK types with partial overrides

2. **Create Test Utilities**
   - Simple dependency injection helpers
   - Type-safe mock creation utilities
   - No complex mocking frameworks

### Step 1: Fix Core Architecture (4 hours)

1. **Remove NotionClientWrapper**
   - Delete the wrapper
   - Update all imports
   - Fix type errors properly

2. **Create Pure Business Logic**
   - Extract formatters to `src/formatters.ts`
   - Extract transformers (keep existing ones)
   - Write unit tests

3. **Implement Dependency Injection**
   - Create interfaces for dependencies
   - Update factory functions
   - Pass dependencies explicitly

### Step 2: Fix MCP Integration (3 hours)

1. **Update Tool Registration**
   - Follow SDK examples exactly
   - Use plain objects with Zod validators
   - Remove complex type gymnastics

2. **Simplify Handler Creation**
   - Create simple handler functions
   - Inject dependencies
   - Return proper MCP responses

### Step 3: Fix Type System (2 hours)

1. **Remove All Type Violations**
   - No `any` types
   - No `as` assertions
   - No `@ts-ignore` or eslint-disable

2. **Use SDK Types Directly**
   - Import from `@notionhq/client`
   - Use SDK type guards
   - Proper error handling with `isNotionClientError`

### Step 4: Complete Test Coverage (3 hours)

1. **Unit Tests**
   - All pure functions
   - All formatters
   - All transformers

2. **Integration Tests**
   - Tool handlers with mocked Notion client
   - Resource handlers with mocked Notion client
   - Server setup with mocked dependencies

## Success Criteria

1. **Zero TypeScript violations**
   - No `any` types
   - No type assertions
   - Clean `npm run type-check`

2. **All tests passing**
   - Unit tests for pure functions
   - Integration tests with simple mocks
   - No complex mocking

3. **Clean architecture**
   - Pure functions for business logic
   - Dependency injection at boundaries
   - No unnecessary abstractions

4. **Library usage**
   - Using Notion SDK types directly
   - Following MCP SDK patterns
   - No wrapper types

## Quality Gates

After each step, run:

```bash
pnpm format
pnpm type-check  # Must pass with no errors
pnpm lint        # Must pass with no errors
pnpm test        # All tests must pass
pnpm build       # Must build successfully
```

## Files to Modify/Delete

**Delete**:

- `src/notion/client.ts` - Unnecessary wrapper

**Modify**:

- `src/server.ts` - Use MCP SDK patterns correctly
- `src/mcp/tools/handlers.ts` - Pure functions + dependency injection
- `src/mcp/resources/handlers.ts` - Pure functions + dependency injection
- All test files - Remove type assertions, use simple mocks

**Create**:

- `src/formatters.ts` - Pure formatting functions
- `src/formatters.unit.test.ts` - Unit tests

## Risk Mitigation

### Potential Issues and Solutions

1. **Breaking Changes**
   - Risk: Removing NotionClientWrapper breaks everything
   - Mitigation: Update one file at a time, run tests after each change
2. **Type Mismatches**
   - Risk: Notion SDK types don't match our usage
   - Mitigation: Use type guards and proper narrowing, not assertions

3. **MCP Registration Failures**
   - Risk: New registration pattern doesn't work
   - Mitigation: Test with a single tool first before converting all

4. **Test Failures**
   - Risk: Tests rely on implementation details
   - Mitigation: Rewrite tests to test behavior, not implementation

### Rollback Strategy

If things go wrong:

1. `git stash` or `git checkout .` to discard changes
2. Return to main branch: `git checkout main`
3. Analyze what went wrong before trying again
4. Consider smaller, incremental changes

## Validation Checkpoints

After each major step:

1. **Type Check Must Pass**: `pnpm type-check`
2. **Lint Must Pass**: `pnpm lint`
3. **Tests Must Pass**: `pnpm test`
4. **Build Must Succeed**: `pnpm build`
5. **Manual Testing**: Test with MCP Inspector

## Definition of Done

Phase 2.5 is complete when:

1. ✅ No TypeScript errors or warnings
2. ✅ No ESLint errors or warnings
3. ✅ All tests passing
4. ✅ No `any` types in codebase
5. ✅ No type assertions (`as`) in codebase
6. ✅ All functions are either pure or have injected dependencies
7. ✅ Notion Client used directly (no wrapper)
8. ✅ MCP SDK patterns followed correctly
9. ✅ Code coverage maintained or improved
10. ✅ Performance not degraded

## Next Steps After Phase 2.5

Once we have a clean, working architecture:

1. Add caching at integration points
2. Add rate limiting at integration points
3. Add pagination support
4. Optimize discovery resource
5. Add more comprehensive error handling

But first, we must fix the foundation.
