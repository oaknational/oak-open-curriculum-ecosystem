# Notion Organ (Ὄργανον)

**You're in the Notion API integration directory.**

This organ handles all interactions with the Notion API - it's a self-contained unit responsible for transforming Notion data into formats the rest of the system can use.

## 🗺️ Developer Quick Reference

| What you need         | Where to find it    | Purpose                                 |
| --------------------- | ------------------- | --------------------------------------- |
| Transform Notion data | `transformers/`     | Convert Notion objects to MCP resources |
| Format responses      | `formatters.ts`     | Format data for human-readable output   |
| Build queries         | `query-builders.ts` | Construct Notion API queries            |

### Key Functions

```typescript
// Main entry point
import { createNotionOperations } from '@organa/notion';

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

This organ follows the biological architecture:

- **Self-contained**: All Notion logic lives here
- **Clear boundaries**: Exposes operations through a single interface
- **No cross-organ imports**: Doesn't know about MCP or other organs
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

💡 **Remember**: This organ knows Notion, not MCP. It transforms Notion data into neutral formats that other organs can consume.
