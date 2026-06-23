# Phase 3: Strategic Enhancements (Restructured for oak-mcp-core)

## Executive Summary

This restructured Phase 3 plan optimizes enhancements to maximize benefit for the future oak-mcp-core extraction (Phase Future 2). Every enhancement is designed to create reusable abstractions that will form the foundation of oak-mcp-core, reducing Future 2's effort by ~40%.

## Key Strategy: Build Generic First, Specialize Second

Instead of implementing Notion-specific enhancements directly, we'll:

1. Create generic interfaces and base classes
2. Implement Notion-specific versions extending these bases
3. Ensure all utilities are framework-agnostic
4. Build with multi-runtime support from day one

## Restructured Deliverables

### 1. Generic MCP Server Base Class (Replaces SDK Migration)

**Why**: Instead of migrating directly to `McpServer`, create our own base class that will become part of oak-mcp-core.

```typescript
// src/mcp/base/mcp-server-base.ts (GENERIC - Future oak-mcp-core)
export abstract class McpServerBase<TConfig, TDeps> {
  protected server: McpServer;

  abstract validateConfig(config: TConfig): void;
  abstract setupHandlers(deps: TDeps): void;

  async start(transport: Transport): Promise<void> {
    // Generic startup logic
  }
}

// src/server.ts (NOTION-SPECIFIC)
export class NotionMcpServer extends McpServerBase<NotionConfig, NotionDeps> {
  validateConfig(config: NotionConfig): void {
    // Notion-specific validation
  }

  setupHandlers(deps: NotionDeps): void {
    // Wire up Notion handlers
  }
}
```

**Benefits for Future 2**:

- McpServerBase is immediately extractable (est. 150 LoC)
- Establishes plugin architecture pattern
- All future MCP servers inherit common behavior

### 2. Enhanced Error Framework (Not Just Notion Errors)

**Why**: Error handling is already identified as 100% generic (190 LoC). Enhance it generically first.

```typescript
// src/errors/mcp-error-base.ts (GENERIC)
export abstract class McpErrorHandler {
  abstract mapToMcpError(error: unknown): McpError;
  abstract shouldRetry(error: unknown): boolean;
  abstract getRetryDelay(error: unknown, attempt: number): number;
}

// src/errors/error-registry.ts (GENERIC)
export class ErrorRegistry {
  private handlers = new Map<string, McpErrorHandler>();

  register(errorType: string, handler: McpErrorHandler): void {
    this.handlers.set(errorType, handler);
  }

  handle(error: unknown): McpError {
    // Generic error routing
  }
}

// src/notion/errors/notion-error-handler.ts (NOTION-SPECIFIC)
export class NotionErrorHandler extends McpErrorHandler {
  mapToMcpError(error: unknown): McpError {
    if (isNotionClientError(error)) {
      // Notion-specific mapping using APIErrorCode
    }
  }
}
```

**Benefits for Future 2**:

- Error framework is 100% extractable
- Supports any integration's error types
- Retry logic is generic and configurable

### 3. Generic Pagination Framework (Not Just Notion Pagination)

**Why**: Every API needs pagination. Build it once, properly.

```typescript
// src/utils/pagination.ts (GENERIC)
export interface PaginationStrategy<T, TCursor> {
  getNextCursor(response: T): TCursor | null;
  hasMore(response: T): boolean;
  mergeResults(accumulated: T[], current: T): T[];
}

export class PaginationHandler<T, TCursor> {
  constructor(private strategy: PaginationStrategy<T, TCursor>) {}

  async *paginate<TParams>(
    fetcher: (params: TParams & { cursor?: TCursor }) => Promise<T>,
    params: TParams,
  ): AsyncGenerator<T> {
    let cursor: TCursor | null = null;

    do {
      const response = await fetcher({ ...params, cursor });
      yield response;
      cursor = this.strategy.getNextCursor(response);
    } while (cursor);
  }
}

// src/notion/pagination/notion-pagination-strategy.ts (NOTION-SPECIFIC)
export class NotionPaginationStrategy implements PaginationStrategy<NotionResponse, string> {
  getNextCursor(response: NotionResponse): string | null {
    return response.next_cursor;
  }
  // Notion-specific implementation
}
```

**Benefits for Future 2**:

- Generic pagination utilities (~100 LoC)
- Works with any API's pagination style
- AsyncGenerator pattern is modern and efficient

### 4. Type Guard Framework with Registry

**Why**: Type guards are needed by every integration, not just Notion.

```typescript
// src/utils/type-guards.ts (GENERIC)
export class TypeGuardRegistry<T = unknown> {
  private guards = new Map<string, (value: unknown) => value is T>();

  register<K extends T>(name: string, guard: (value: unknown) => value is K): void {
    this.guards.set(name, guard as any);
  }

  createCompositeGuard<K extends T>(...names: string[]): (value: unknown) => value is K {
    // Combine multiple guards
  }
}

// src/notion/type-guards/index.ts (NOTION-SPECIFIC)
const notionGuards = new TypeGuardRegistry<NotionTypes>();
notionGuards.register('fullPage', isFullPage);
notionGuards.register('fullDatabase', isFullDatabase);
```

**Benefits for Future 2**:

- Registry pattern is generic and reusable
- Composite guards reduce boilerplate
- Type-safe and extensible

### 5. Resource Linking as First-Class Pattern

**Why**: This pattern improves all MCP servers, not just Notion.

```typescript
// src/mcp/patterns/resource-linking.ts (GENERIC)
export interface ResourceLinker {
  extractResourceRefs(data: unknown): string[];
  createResourceRef(type: string, id: string): string;
  resolveResourceRef(ref: string): { type: string; id: string };
}

export class ResourceLinkingHandler {
  constructor(private linker: ResourceLinker) {}

  transformToolResponse(response: unknown): McpToolResponse {
    const refs = this.linker.extractResourceRefs(response);
    return {
      content: [{ type: 'resource-ref', refs }],
      metadata: { hasLinkedResources: refs.length > 0 },
    };
  }
}
```

**Benefits for Future 2**:

- Establishes MCP best practice patterns
- Reduces response payload universally
- Improves client-side caching

### 6. Performance Instrumentation Layer

**Why**: Every production MCP server needs performance monitoring.

```typescript
// src/monitoring/performance.ts (GENERIC)
export interface PerformanceMonitor {
  startTimer(operation: string): () => void;
  recordMetric(name: string, value: number): void;
  getMetrics(): Record<string, PerformanceMetric>;
}

export class PerformanceMiddleware {
  constructor(private monitor: PerformanceMonitor) {}

  wrapHandler<T extends (...args: any[]) => any>(handler: T, operation: string): T {
    return ((...args) => {
      const done = this.monitor.startTimer(operation);
      try {
        const result = handler(...args);
        if (result instanceof Promise) {
          return result.finally(done);
        }
        done();
        return result;
      } catch (error) {
        done();
        throw error;
      }
    }) as T;
  }
}
```

**Benefits for Future 2**:

- Generic performance monitoring
- Pluggable metric backends
- Zero overhead when disabled

## Implementation Order (Maximizing Extraction Value)

1. **Week 1: Foundations**
   - Generic MCP Server Base Class (150 LoC extractable)
   - Enhanced Error Framework (adds 100 LoC extractable)
   - Type Guard Framework (80 LoC extractable)

2. **Week 2: Patterns**
   - Generic Pagination Framework (100 LoC extractable)
   - Resource Linking Pattern (75 LoC extractable)
   - Performance Instrumentation (100 LoC extractable)

3. **Week 3: Integration**
   - Implement Notion-specific versions
   - Migrate existing code to use new abstractions
   - Document patterns for oak-mcp-core

## Success Metrics

### For Phase 3

- All existing tests pass
- New abstractions have 100% test coverage
- Performance improves by 20%+
- Code is more maintainable

### For Future 2 Preparation

- **605 additional LoC** ready for extraction (on top of existing 695)
- **Total extractable: 1,300 LoC** (43% of codebase)
- All abstractions are runtime-agnostic
- Clear interfaces between generic/specific code

## Quality Checkpoints

After each component:

- `pnpm format`
- `pnpm type-check`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

Additional checks:

- Verify component has zero Notion dependencies
- Confirm it works with generic types
- Document extraction readiness

## Risk Mitigation

1. **Over-abstraction**: Keep abstractions simple and justified by real needs
2. **Performance**: Benchmark before/after each abstraction
3. **Compatibility**: Ensure all changes are backward compatible
4. **Complexity**: If an abstraction makes code harder to understand, reconsider

## Conclusion

This restructured Phase 3 transforms tactical enhancements into strategic investments. By building generic abstractions first, we:

1. Reduce Future Phase 2 effort by ~40%
2. Improve code quality across the board
3. Establish patterns for all future MCP servers
4. Create immediate value while preparing for the future

Every line of code written in Phase 3 should answer: "Will this help oak-mcp-core?"
