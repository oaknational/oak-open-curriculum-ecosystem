# MCP Tools

**You're in the Model Context Protocol (MCP) server implementation directory.**

This organ handles all MCP protocol concerns - tools, resources, and server setup. It's a self-contained unit that exposes Notion functionality through the MCP interface.

## 🗺️ Developer Quick Reference

| What you need    | Where to find it   | Purpose                           |
| ---------------- | ------------------ | --------------------------------- |
| Add a new tool   | `tools/`           | MCP tool definitions and handlers |
| Handle resources | `resources/`       | MCP resource listing and reading  |
| Tool schemas     | `tools/schemas.ts` | Zod schemas for tool inputs       |
| Main handlers    | `handlers.ts`      | Top-level request routing         |

### Architecture Overview

```
tools/
├── tools/                 # MCP tools (search, query, etc.)
│   ├── definitions/       # Tool metadata and descriptions
│   ├── notion-operations/ # Business logic for each tool
│   └── core/              # Tool infrastructure (factory, registry)
├── resources/             # MCP resources (discovery, reading)
│   └── handlers/          # Resource-specific logic
├── handlers.ts            # Main entry point
└── types.ts               # MCP-specific types
```

### Adding a New Tool

1. **Define the tool** in `tools/definitions/`:

```typescript
export const myToolDefinition: ToolDefinition = {
  name: 'notion-my-tool',
  description: 'Does something with Notion',
  inputSchema: myToolSchema,
};
```

2. **Add the schema** in `tools/schemas.ts`:

```typescript
export const myToolSchema = z.object({
  parameter: z.string().describe('What this does'),
});
```

3. **Implement the executor** in `tools/notion-operations/`:

```typescript
export function createMyToolExecutor(deps: Dependencies): ToolExecutor {
  return {
    async execute(input: unknown): Promise<string> {
      const params = myToolSchema.parse(input);
      // Implementation here
      return 'Result as formatted string';
    },
  };
}
```

4. **Wire it up** in `tools/handlers.ts`

### Common Imports

```typescript
// Main handler creation
import { createMcpHandlers } from '../tools/handlers';

// Types
import type { McpTool } from '../tools/types';
```

### Key Concepts

- **Tools**: Execute actions (search, query, get page)
- **Resources**: Provide data (list resources, read content)
- **Handlers**: Route MCP requests to appropriate logic
- **Executors**: Contain the actual business logic

💡 **Remember**: This layer knows MCP, not Notion internals. It uses injected Notion operations to do its work.
