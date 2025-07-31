# Migration Guide: Phase 2 to Phase 2.5

This guide helps developers understand the changes coming in Phase 2.5 and how to prepare for them.

## Overview

Phase 2.5 implements high-priority enhancements identified in the code review:

- Better MCP SDK usage
- Pagination support
- Performance optimizations
- Enhanced error handling
- Improved type safety
- Resource linking patterns

## Breaking Changes

### 1. Server API Changes

**Current (Phase 2)**:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
const server = new Server({ name, version }, { capabilities });
```

**Phase 2.5**:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/index.js';
const server = new McpServer({ name, version });
// Simplified API with automatic capability detection
```

### 2. Error Handling

**Current (Phase 2)**:

```typescript
// Basic error classification
if (error.code === 'object_not_found') {
  return 'Not found';
}
```

**Phase 2.5**:

```typescript
// Using SDK error types
import { APIErrorCode, isNotionClientError } from '@notionhq/client';

if (isNotionClientError(error)) {
  switch (error.code) {
    case APIErrorCode.ObjectNotFound:
      return handleNotFound(error);
    // ... more specific handling
  }
}
```

### 3. Resource Responses

**Current (Phase 2)**:

```typescript
// Tools return full data
return {
  content: [
    {
      type: 'text',
      text: JSON.stringify(fullPageData),
    },
  ],
};
```

**Phase 2.5**:

```typescript
// Tools return resource URIs
return {
  content: [
    {
      type: 'text',
      text: 'Page found: Project Planning',
    },
  ],
  resources: ['notion://pages/0b76f124-6d3f-4363-b7cd-9c80f8dd5d99'],
};
```

## Non-Breaking Enhancements

### 1. Pagination

All list operations will support pagination:

```typescript
// Automatically handled by SDK
const results = [];
for await (const page of notion.iteratePaginatedAPI(notion.databases.query, { database_id })) {
  results.push(...page.results);
}
```

### 2. Type Guards

Replace manual type checking:

```typescript
// Current
if (block.type === 'paragraph' && 'paragraph' in block) {
  // ...
}

// Phase 2.5
import { isFullBlock } from '@notionhq/client';
if (isFullBlock(block) && block.type === 'paragraph') {
  // Type-safe access to block.paragraph
}
```

### 3. Performance Comments

Look for new comments indicating optimization points:

```typescript
// TODO(cache): Results for this query could be cached with key `search:${query}:${type}`
// Cache TTL: 5 minutes for search results
const results = await notion.search({ query });

// TODO(rate-limit): This endpoint has a rate limit of 3 requests/second
// Consider implementing client-side rate limiting with exponential backoff
```

## Migration Steps

### For Core Contributors

1. **Before Phase 2.5 Merge**:
   - Review all TODO comments added
   - Understand new patterns
   - Test with feature branch

2. **After Merge**:
   - Update any custom integrations
   - Review error handling code
   - Test pagination with large datasets

### For Package Users

1. **No immediate action required** - Changes are backward compatible

2. **Optional optimizations**:
   - Use resource URIs instead of inline data
   - Implement caching based on TODO comments
   - Add rate limiting if needed

## Testing Your Integration

### Check Compatibility

```bash
# Install beta version (when available)
npm install oak-notion-mcp@next

# Test your integration
NOTION_API_KEY=your_notion_api_key_here
```

### Verify Error Handling

```typescript
// Test with invalid IDs to check error handling
await client.callTool({
  name: 'notion-get-page',
  arguments: {
    page_id: 'invalid-uuid-format',
  },
});
```

### Test Pagination

```typescript
// Query a large database
await client.callTool({
  name: 'notion-query-database',
  arguments: {
    database_id: 'your-large-db-id',
    page_size: 100, // Maximum
  },
});
```

## Performance Improvements

### Discovery Resource

**Before**: Loads all data synchronously
**After**: Lazy loading with pagination

```typescript
// Phase 2.5 adds progress indication
'Loading workspace data... Users (5/5) ✓ Pages (42/150) ...';
```

### Caching Preparation

While caching isn't implemented, comments indicate where to add it:

```typescript
class NotionCache {
  // Implement based on TODO(cache) comments
  async get(key: string): Promise<any> {}
  async set(key: string, value: any, ttl: number): Promise<void> {}
}
```

## New Features to Explore

### 1. Completion Support

The McpServer provides completion hints:

```typescript
// Users will see autocomplete for:
- Tool names
- Resource URIs
- Common parameters
```

### 2. Resource Templates

Dynamic resource patterns:

```typescript
// Old: Static list of resources
// New: Dynamic templates
server.registerResourceTemplate('notion://pages/{pageId}', 'Access any Notion page by ID');
```

### 3. Enhanced UI Metadata

All tools and resources have better UI hints:

```typescript
{
  name: 'notion-search',
  title: 'Search Notion',  // New: Human-friendly title
  description: 'Search pages and databases',
  inputSchema: {
    // Enhanced with examples and hints
  }
}
```

## Rollback Plan

If issues arise:

1. **Revert to Phase 2**:

   ```bash
   npm install oak-notion-mcp@^2.0.0
   ```

2. **Report issues**:
   - GitHub Issues with error details
   - Include Notion workspace size
   - Provide reproduction steps

## Future (Phase 3)

Phase 2.5 prepares for Phase 3 features:

- Write operations with confirmation
- Real-time subscriptions
- Advanced caching
- OAuth authentication

## Questions?

- Check updated documentation in `/docs`
- See CONTRIBUTING.md for development setup
- Create GitHub issue for bugs
- Join Discord for discussions
