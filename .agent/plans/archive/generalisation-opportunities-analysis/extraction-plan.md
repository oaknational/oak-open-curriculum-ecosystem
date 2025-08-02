# oak-mcp-core Extraction Plan

## Executive Summary

This document outlines the extraction of generic MCP server components from oak-notion-mcp into a reusable oak-mcp-core library. Based on our analysis, 695 lines of code (23%) can be immediately extracted, with an additional ~700 lines (23%) available after refactoring, achieving a total reusability of ~47%.

## Library Overview

### Package: @oak-national/mcp-core

**Purpose**: Provide a foundation for building MCP servers with:

- Standardized error handling and logging
- Type-safe configuration management
- Edge-runtime compatibility
- Plugin architecture for resources and tools
- Testing utilities

**Target Consumers**:

- oak-notion-mcp (this project)
- Future MCP integrations (GitHub, Jira, Slack, etc.)
- External developers building MCP servers

## Extraction Phases

### Phase 1: Core Infrastructure (Week 1)

**Goal**: Extract immediately reusable components with zero dependencies on Notion

#### Components to Extract

1. **Error Handling Framework** (190 LoC)
   - `src/errors/error-handler.ts` → `@oak-national/mcp-core/errors`
   - Generic error types and handlers
   - MCP error code mapping

2. **Logging Infrastructure** (166 LoC)
   - `src/logging/logger.ts` → `@oak-national/mcp-core/logging`
   - `src/logging/file-reporter.ts` → `@oak-national/mcp-core/logging/reporters`
   - Abstract logging interface
   - Configurable reporters

3. **Utility Functions** (40 LoC)
   - `src/utils/scrubbing.ts` → `@oak-national/mcp-core/utils`
   - PII scrubbing utilities
   - Generic helper functions

4. **Type Definitions** (142 LoC)
   - `src/types/environment.ts` → `@oak-national/mcp-core/types`
   - `src/mcp/tools/types.ts` → `@oak-national/mcp-core/mcp/types`
   - `src/mcp/tools/schemas.ts` → `@oak-national/mcp-core/mcp/schemas`
   - Base MCP types and schemas

5. **MCP Utilities** (167 LoC)
   - `src/mcp/handlers.ts` → `@oak-national/mcp-core/mcp/handlers`
   - `src/mcp/resources/uri-parser.ts` → `@oak-national/mcp-core/mcp/uri`
   - Generic handler utilities
   - URI parsing for resources

**Total Phase 1**: 695 LoC (all current generic components)

### Phase 2: Refactor and Extract (Week 2)

**Goal**: Refactor mixed components to separate generic from specific code

#### Components to Refactor

1. **Base MCP Server Class** (~40 LoC from 60 total)

   ```typescript
   // From src/server.ts
   export abstract class McpServerBase<TDeps> {
     protected server: Server;
     protected dependencies: TDeps;

     abstract setupHandlers(): void;
     abstract validateConfig(): void;

     async start(): Promise<void> {
       /* generic startup */
     }
     async shutdown(): Promise<void> {
       /* generic shutdown */
     }
   }
   ```

2. **Configuration Management** (~35 LoC from 87 total)

   ```typescript
   // From src/config/environment.ts
   export interface ConfigSchema<T> {
     validate(raw: unknown): T;
     withDefaults(partial: Partial<T>): T;
   }

   export class ConfigBuilder<T> {
     constructor(private schema: z.ZodSchema<T>) {}
     fromEnv(mapping: Record<keyof T, string>): T {
       /* ... */
     }
   }
   ```

3. **Startup Utilities** (~50 LoC from 61 total)

   ```typescript
   // From src/startup-logger.ts
   export class StartupLogger {
     constructor(private options: LogOptions) {}
     logStartup(name: string, version: string): void {
       /* ... */
     }
     logConfig(config: Record<string, unknown>): void {
       /* ... */
     }
   }
   ```

4. **Test Utilities** (~80 LoC from 162 total)

   ```typescript
   // From src/test-helpers/factories.ts
   export class McpTestServer<T> {
     async start(): Promise<void> {
       /* ... */
     }
     async sendRequest(method: string, params: unknown): Promise<unknown> {
       /* ... */
     }
     async shutdown(): Promise<void> {
       /* ... */
     }
   }
   ```

5. **Dependency Injection** (~30 LoC from 52 total)
   ```typescript
   // From src/types/dependencies.ts
   export interface DependencyContainer<T> {
     register<K extends keyof T>(key: K, factory: () => T[K]): void;
     resolve<K extends keyof T>(key: K): T[K];
   }
   ```

**Total Phase 2**: ~235 LoC extracted from mixed components

### Phase 3: API Design and Edge Runtime Support (Week 3)

**Goal**: Create abstractions for Node.js APIs and design plugin architecture

#### Runtime Abstractions

1. **File System Abstraction**

   ```typescript
   export interface FileSystem {
     writeFile(path: string, data: string, options?: WriteOptions): Promise<void>;
     makeDirectory(path: string, options?: MkdirOptions): Promise<void>;
     exists(path: string): Promise<boolean>;
   }

   // Implementations
   export class NodeFileSystem implements FileSystem {
     /* ... */
   }
   export class MemoryFileSystem implements FileSystem {
     /* ... */
   }
   export class KVFileSystem implements FileSystem {
     /* ... */
   }
   ```

2. **Environment Abstraction**

   ```typescript
   export interface RuntimeEnvironment {
     getEnv(key: string): string | undefined;
     getWorkingDirectory(): string;
     exit(code: number): never;
   }

   // Implementations
   export class NodeEnvironment implements RuntimeEnvironment {
     /* ... */
   }
   export class EdgeEnvironment implements RuntimeEnvironment {
     /* ... */
   }
   ```

3. **Transport Abstraction**

   ```typescript
   export interface Transport {
     on(event: string, handler: Function): void;
     send(message: unknown): Promise<void>;
     close(): Promise<void>;
   }

   // Implementations
   export class StdioTransport implements Transport {
     /* For local subprocess communication */
   }
   export class StreamableHTTPTransport implements Transport {
     /* For remote/edge hosting - supports both stateful and stateless modes */
   }

   // Transport factory for runtime selection
   export function createTransport(options: TransportOptions): Transport {
     if (options.type === 'stdio' && typeof process !== 'undefined') {
       return new StdioTransport();
     }
     return new StreamableHTTPTransport(options);
   }
   ```

#### Plugin Architecture

1. **Resource Handler Registration**

   ```typescript
   export interface ResourceHandler {
     uriPattern: RegExp;
     handle(uri: string, context: ResourceContext): Promise<Resource>;
   }

   export class ResourceRegistry {
     register(handler: ResourceHandler): void;
     handle(uri: string): Promise<Resource>;
   }
   ```

2. **Tool Handler Registration**

   ```typescript
   export interface ToolHandler<TInput = unknown, TOutput = unknown> {
     name: string;
     schema: z.ZodSchema<TInput>;
     handle(input: TInput, context: ToolContext): Promise<TOutput>;
   }

   export class ToolRegistry {
     register<T, U>(handler: ToolHandler<T, U>): void;
     handle(name: string, input: unknown): Promise<unknown>;
   }
   ```

## Migration Strategy

### For oak-notion-mcp

1. **Install oak-mcp-core**

   ```bash
   pnpm add @oak-national/mcp-core
   ```

2. **Update Imports** (automated with codemod)

   ```typescript
   // Before
   import { handleError } from './errors/error-handler';

   // After
   import { handleError } from '@oak-national/mcp-core/errors';
   ```

3. **Extend Base Classes**

   ```typescript
   // Before
   export class NotionMcpServer {
     // Custom implementation
   }

   // After
   import { McpServerBase } from '@oak-national/mcp-core';

   export class NotionMcpServer extends McpServerBase<NotionDependencies> {
     setupHandlers(): void {
       // Notion-specific handlers
     }
   }
   ```

### For New MCP Servers

1. **Quick Start Template**

   ```typescript
   import { McpServerBase, createConfig } from '@oak-national/mcp-core';

   interface MyConfig {
     apiKey: string;
     baseUrl: string;
   }

   class MyMcpServer extends McpServerBase<MyConfig> {
     setupHandlers(): void {
       this.resources.register({
         uriPattern: /^my:\/\//,
         handle: async (uri) => {
           /* ... */
         },
       });

       this.tools.register({
         name: 'my-tool',
         schema: z.object({
           /* ... */
         }),
         handle: async (input) => {
           /* ... */
         },
       });
     }
   }
   ```

## Package Structure

```
@oak-national/mcp-core/
├── package.json
├── README.md
├── src/
│   ├── index.ts                 # Main exports
│   ├── server.ts                # McpServerBase class
│   ├── errors/
│   │   ├── index.ts
│   │   ├── error-handler.ts
│   │   └── types.ts
│   ├── logging/
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   └── reporters/
│   │       └── file-reporter.ts
│   ├── config/
│   │   ├── index.ts
│   │   ├── builder.ts
│   │   └── validators.ts
│   ├── mcp/
│   │   ├── handlers.ts
│   │   ├── types.ts
│   │   ├── schemas.ts
│   │   ├── uri-parser.ts
│   │   ├── resources/
│   │   │   └── registry.ts
│   │   └── tools/
│   │       └── registry.ts
│   ├── runtime/
│   │   ├── abstractions.ts
│   │   ├── node.ts
│   │   ├── edge.ts
│   │   └── browser.ts
│   ├── utils/
│   │   └── scrubbing.ts
│   └── testing/
│       ├── index.ts
│       └── test-server.ts
└── dist/                        # Built output
```

## Edge Deployment Strategy

With the Streamable HTTP transport, oak-mcp-core servers can be deployed to:

1. **Cloudflare Workers**

   ```typescript
   export default {
     async fetch(request: Request): Promise<Response> {
       const transport = new StreamableHTTPTransport({
         stateless: true, // Workers are stateless by nature
       });
       return transport.handleRequest(request);
     },
   };
   ```

2. **Vercel Edge Functions / Next.js Edge Runtime**
3. **Deno Deploy**
4. **AWS Lambda@Edge**
5. **Any HTTP-capable edge runtime**

The key advantage is that the same MCP server code can run both locally (with stdio) and remotely (with Streamable HTTP), enabling flexible deployment options.

## Success Metrics

### Quantitative

- [ ] Extract minimum 1400 LoC (47% of codebase)
- [ ] Zero Notion dependencies in oak-mcp-core
- [ ] 100% test coverage for extracted components
- [ ] Support for Node.js, Deno, and Bun runtimes
- [ ] < 50KB bundle size (minified + gzipped)

### Qualitative

- [ ] Clear documentation with examples
- [ ] Intuitive API design
- [ ] Smooth migration path
- [ ] Active community adoption

## Timeline

### Week 1: Phase 1 Extraction

- Day 1-2: Set up oak-mcp-core repository
- Day 3-4: Extract and test generic components
- Day 5: Documentation and examples

### Week 2: Phase 2 Refactoring

- Day 1-2: Refactor mixed components
- Day 3-4: Extract refactored code
- Day 5: Update oak-notion-mcp to use library

### Week 3: Phase 3 Polish

- Day 1-2: Implement edge runtime support
- Day 3-4: Create migration tools
- Day 5: Release v1.0.0

## Risk Mitigation

| Risk                               | Impact | Mitigation                                  |
| ---------------------------------- | ------ | ------------------------------------------- |
| Breaking changes in oak-notion-mcp | High   | Comprehensive test suite, gradual migration |
| Low adoption by other teams        | Medium | Clear docs, example projects, workshops     |
| Edge runtime incompatibilities     | Medium | Progressive enhancement, polyfills          |
| Increased maintenance burden       | Low    | Automated testing, clear ownership          |

## Next Steps

1. Review and approve this extraction plan
2. Create oak-mcp-core repository
3. Set up CI/CD pipeline
4. Begin Phase 1 extraction
5. Communicate timeline to stakeholders
