# Notion Integration

**You're in the Notion API integration directory.**

This module handles all interactions with the Notion API - it's a self-contained unit responsible for transforming Notion data into formats the rest of the system can use.

## 🗺️ Developer Quick Reference

| What you need         | Where to find it    | Purpose                                 |
| --------------------- | ------------------- | --------------------------------------- |
| Transform Notion data | `transformers/`     | Convert Notion objects to MCP resources |
| Format responses      | `formatters.ts`     | Format data for human-readable output   |
| Build queries         | `query-builders.ts` | Construct Notion API queries            |

### Key Functions

```typescript
// Main entry point
import { createNotionOperations } from '../../integrations/notion';

// The operations object provides:
const operations = createNotionOperations();

// Transformers
operations.transformers.transformNotionPageToMcpResource(page);
operations.transformers.transformNotionDatabaseToMcpResource(database);
operations.transformers.transformNotionUserToMcpResource(user);

// Formatters
operations.formatters.formatSearchResults(results);
operations.formatters.formatDatabaseList(databases);
operations.formatters.formatUserList(users);
```

### Architecture

This module follows clear boundaries:

- **Self-contained**: All Notion logic lives here
- **Clear boundaries**: Exposes operations through a single interface
- **No cross-module imports**: Doesn't know about MCP or other internal modules
- **Dependency injection**: Receives what it needs, doesn't reach out

### Common Tasks

**Transform a Notion page:**

```typescript
const mcpResource = transformNotionPageToMcpResource(notionPage);
```

**Format search results:**

```typescript
const formatted = formatSearchResults(searchResponse, resources);
```

**Build a database query:**

```typescript
const query = {
  filter: buildPropertyFilter('Status', 'equals', 'Active'),
  sorts: [{ property: 'Created', direction: 'descending' }],
};
```

💡 **Remember**: This integration knows Notion, not MCP. It transforms Notion data into neutral formats that other modules can consume.
