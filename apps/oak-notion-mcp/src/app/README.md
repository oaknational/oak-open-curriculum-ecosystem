# Application Startup Orchestrator

This directory contains the application wiring and startup logic for the Notion MCP server.

## What Happens Here

The startup index is where:

- All dependencies are created and connected
- Configuration is loaded and validated
- The MCP server is initialised

## Architectural Principles

1. **Composition Root**: ALL wiring happens here, nowhere else
2. **No Business Logic**: Only connects, never computes
3. **Single Source**: One file that shows how everything connects
4. **Lifecycle**: Manages startup and shutdown

## The Soul Nature

Like the soul in ancient philosophy:

- It's not a thing but a principle of organization
- Without it, you have parts, not a whole
- It emerges from proper arrangement
- It cannot be reduced to its components

This layer doesn't DO anything in the business sense - it simply wires components. By existing, by connecting, by organizing, it transforms a collection of modules into a coherent, running server that can:

- Respond to requests
- Process information
- Maintain state
- Exhibit behaviour

## The Mystery of Life

The deepest mystery in biology is how life emerges from non-life. Similarly, the app wiring represents that moment when:

- Types become data
- Interfaces become connections
- Functions become behaviors
- Components become organism

This is why we don't distribute the wiring throughout the codebase. There should be a clear composition root: a single place where wiring happens.

## 🗺️ Developer Quick Reference

**You're in the application wiring and startup directory!**

| What you need     | Where to find it | Purpose                             |
| ----------------- | ---------------- | ----------------------------------- |
| Main entry point  | `index.ts`       | Exports the startServer function    |
| Server setup      | `server.ts`      | MCP server initialization           |
| Dependency wiring | `wiring.ts`      | Creates and connects all components |
| Startup logging   | `startup.ts`     | Beautiful startup messages          |

### Key Files

```typescript
// Main entry - what external code uses
import { main as startServer } from '../../index';

// The wiring - how everything connects
// wiring.ts shows:
// - How to create loggers
// - How to get configuration
// - How to wire modules together
// - How to inject dependencies
```

### The Wiring Pattern

```typescript
// In wiring.ts, you'll see:
export async function createWiredDependencies() {
  // 1. Create infrastructure
  const logger = createConsoleLogger({ level });
  const config = getNotionConfig();

  // 2. Create operations with dependencies
  const notionOperations = createNotionOperations();
  const notionClient = new Client({ auth: config.apiKey });

  // 3. Wire everything together
  const dependencies: ServerDependencies = {
    config,
    logger,
    notionClient,
    notionOperations,
  };

  // 4. Create handlers
  const handlers = createMcpHandlers(dependencies);

  return { dependencies, handlers };
}
```

### Starting the Server

The server can be started in different ways:

```typescript
// For production (via npx/CLI)
await startServer();

// For testing with custom options
await startServer({
  notionApiKey: 'test-key',
  logLevel: 'debug',
});
```

💡 **Remember**: This directory contains wiring only—no business logic.
