# Phase 2.5 Implementation Plan: High-Priority Enhancements

## Overview

Phase 2.5 focuses on implementing the high-priority enhancements identified in the Phase 2 code review. These improvements will optimize performance, improve SDK usage, and enhance the overall quality of the codebase.

## Implementation Order

### 1. MCP SDK High-Level API Migration

**Goal**: Upgrade from low-level `Server` to high-level `McpServer` API for better features and UX

**Tasks**:

1. Research `McpServer` API in the MCP SDK documentation
2. Create a parallel implementation using `McpServer`
3. Migrate all handlers to use the high-level API patterns
4. Add completion support for tools and resources
5. Implement resource templates for dynamic URIs
6. Add title fields to all resources and tools for better UI presentation
7. Update tests to verify new functionality

**Files to modify**:

- `src/server.ts` - Main server implementation
- `src/index.ts` - Server initialization
- `src/mcp/handlers.ts` - Update handler registration
- All test files that mock the server

### 2. Error Handling Enhancement

**Goal**: Use Notion SDK's error types for precise error classification and proper propagation

**Tasks**:

1. Import and use `APIErrorCode` enum from Notion SDK
2. Implement `isNotionClientError` type guard
3. Create error mapping functions for each error type
4. Ensure errors propagate with proper context through all layers
5. Update error messages to be more actionable
6. Add error recovery suggestions where applicable

**Files to modify**:

- `src/errors/error-handler.ts` - Main error handling logic
- `src/notion/client.ts` - Add error type guards
- All files that catch errors - ensure proper propagation

### 3. Type Guards Implementation

**Goal**: Use SDK's built-in type guards and reduce type assertions

**Tasks**:

1. Import type guards from Notion SDK (`isFullPage`, `isFullDatabase`, etc.)
2. Replace manual type checks with SDK type guards
3. Create custom type guards for our domain types
4. Remove unnecessary type assertions
5. Add runtime validation where type guards aren't sufficient

**Files to modify**:

- `src/notion/transformers.ts` - Use SDK type guards
- `src/mcp/resources/handlers.ts` - Replace type assertions
- `src/mcp/tools/handlers.ts` - Replace type assertions
- Create new file: `src/utils/type-guards.ts` for custom guards

### 4. Pagination Support

**Goal**: Implement proper pagination for large datasets

**Tasks**:

1. Research Notion SDK's `iteratePaginatedAPI` helper
2. Implement pagination wrapper for all list operations
3. Add cursor-based pagination to tools that return lists
4. Handle page_size limits appropriately
5. Add pagination info to responses (hasMore, nextCursor)
6. Update tests to verify pagination behavior

**Files to modify**:

- `src/notion/client.ts` - Add pagination methods
- `src/mcp/tools/handlers.ts` - Update list operations
- `src/mcp/resources/handlers.ts` - Update discovery resource

### 5. Discovery Resource Optimization

**Goal**: Make the discovery resource more efficient

**Tasks**:

1. Analyze current discovery resource performance
2. Implement lazy loading for counts
3. Add pagination to discovery lists
4. Cache static information
5. Make parallel API calls where possible
6. Add summary-only mode for quick overview

**Files to modify**:

- `src/mcp/resources/handlers.ts` - Optimize discovery handler
- `src/notion/client.ts` - Add batch operations

### 6. Resource Linking Pattern

**Goal**: Return resource URIs instead of inline data for better composability

**Tasks**:

1. Design URI format for all resource types
2. Update tools to return resource URIs in responses
3. Add resource resolution helpers
4. Update response types to include resource links
5. Maintain backward compatibility with inline data option
6. Document the new pattern

**Files to modify**:

- `src/mcp/tools/handlers.ts` - Return URIs instead of data
- `src/mcp/types.ts` - Add resource link types
- Create new file: `src/mcp/resource-links.ts` for URI utilities

### 7. Performance Annotations

**Goal**: Add code comments for future caching and rate limiting

**Tasks**:

1. Identify all API call sites
2. Add comments explaining caching strategy at each site
3. Add comments for rate limiting implementation points
4. Document cache key generation strategies
5. Document rate limit bucket strategies
6. Create architectural decision record (ADR) for caching/rate limiting

**Files to annotate**:

- `src/notion/client.ts` - API call sites
- `src/mcp/resources/handlers.ts` - Resource caching points
- `src/mcp/tools/handlers.ts` - Tool result caching points
- Create new file: `docs/adr/caching-rate-limiting.md`

## Testing Strategy

1. **Maintain all existing tests** - No regression allowed
2. **Add tests for new features**:
   - Pagination edge cases
   - Error type classification
   - Type guard usage
   - Resource URI generation
3. **Performance benchmarks**:
   - Measure discovery resource performance
   - Verify pagination improves response times
4. **E2E tests**:
   - Test pagination with real data
   - Verify error handling with real API errors

## Success Criteria

1. All existing tests continue to pass
2. No type assertions remain (except where absolutely necessary)
3. Discovery resource responds in < 2 seconds for typical workspaces
4. Pagination works correctly for all list operations
5. Error messages are actionable and include recovery steps
6. Resource linking reduces response sizes by > 50%
7. Code is annotated with clear caching/rate limiting strategies

## Rollback Plan

Since we're enhancing existing functionality:

1. Keep the current implementation working alongside new code
2. Use feature flags if needed for gradual rollout
3. Ensure all changes are backward compatible
4. Tag the current version before starting

## Timeline Estimate

- MCP SDK Migration: 2-3 hours
- Error Handling Enhancement: 1-2 hours
- Type Guards: 1-2 hours
- Pagination Support: 2-3 hours
- Discovery Optimization: 1-2 hours
- Resource Linking: 2-3 hours
- Performance Annotations: 1 hour

**Total: 10-16 hours of focused work**
