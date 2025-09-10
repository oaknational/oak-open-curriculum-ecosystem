# Tissue Adaptation Patterns

## Overview

Histoi tissues are transplantable, runtime-adaptive components that provide infrastructure capabilities across different environments. This document describes the patterns for creating and using tissues, with `histos-transport` as the gold standard reference implementation.

## Core Principles

### 1. Dependency Injection Pattern

All tissues use constructor-based dependency injection to remain environment-agnostic:

```typescript
// ❌ BAD: Direct import couples to Node.js
import * as fs from 'node:fs/promises';

class Storage {
  async read(key: string) {
    return fs.readFile(key, 'utf-8'); // Tied to Node.js
  }
}

// ✅ GOOD: Injected dependency allows transplantability
interface FileSystemInterface {
  readFile(path: string, encoding: string): Promise<string>;
}

class Storage {
  constructor(private fs: FileSystemInterface) {}

  async read(key: string) {
    return this.fs.readFile(key, 'utf-8'); // Works anywhere
  }
}
```

### 2. Pure Function Extraction

Extract pure business logic as separate functions for easy testing:

```typescript
// Pure functions in separate file (e.g., pure-functions.ts)
export function formatMessage(id: number, method: string, params?: unknown): string {
  return JSON.stringify({ jsonrpc: '2.0', id, method, params });
}

export function parseMessage(data: string): Message {
  const parsed = JSON.parse(data);
  validateMessage(parsed);
  return parsed;
}

// Tissue uses pure functions
export class Transport {
  send(method: string, params?: unknown) {
    const message = formatMessage(this.nextId++, method, params);
    this.stream.write(message);
  }
}
```

### 3. Interface Segregation

Define minimal interfaces in Moria, implement in Histoi:

```typescript
// In Moria - minimal interface
export interface Logger {
  info(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
}

// In Histoi - full implementation with adaptation
export class ConsoleLogger implements Logger {
  constructor(private console: Console) {} // Injected

  info(message: string, context?: unknown) {
    this.console.log(message, context);
  }

  error(message: string, error?: unknown, context?: unknown) {
    this.console.error(message, error, context);
  }
}
```

## Gold Standard: histos-transport

The transport tissue demonstrates all best practices:

### 1. Structure

```
histos-transport/
├── src/
│   ├── index.ts              # Public API
│   ├── types.ts              # Local types (not from Moria)
│   ├── stdio-transport.ts    # Main implementation
│   ├── message-buffer.ts     # Pure function: buffering
│   └── message-formatter.ts  # Pure functions: formatting
└── tests/
    ├── message-buffer.unit.test.ts      # Pure function tests
    ├── message-formatter.unit.test.ts   # Pure function tests
    └── stdio-transport.integration.test.ts # Integration tests
```

### 2. Dependency Injection

```typescript
export class StdioTransport implements Transport {
  constructor(
    private stdin: NodeJS.ReadStream, // Injected
    private stdout: NodeJS.WriteStream, // Injected
    private logger: Logger, // Injected from Moria interface
  ) {
    this.messageBuffer = new MessageBuffer(); // Pure, no dependencies
  }
}
```

### 3. Pure Function Extraction

```typescript
// message-formatter.ts - Pure functions
export function formatJsonRpcMessage(message: JsonRpcMessage): string {
  const json = JSON.stringify(message);
  return `Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`;
}

// stdio-transport.ts - Uses pure functions
class StdioTransport {
  send(message: JsonRpcMessage) {
    const formatted = formatJsonRpcMessage(message); // Pure function
    this.stdout.write(formatted); // Injected I/O
  }
}
```

### 4. Testing Strategy

```typescript
// Unit test - Pure functions only, no mocks
describe('formatJsonRpcMessage', () => {
  it('should format message with content length', () => {
    const message = { jsonrpc: '2.0', id: 1, method: 'test' };
    const result = formatJsonRpcMessage(message);
    expect(result).toContain('Content-Length: ');
    expect(result).toContain('"method":"test"');
  });
});

// Integration test - Simple mocks injected
describe('StdioTransport', () => {
  it('should send messages', async () => {
    const mockStdout = { write: vi.fn() };
    const mockStdin = new EventEmitter();
    const mockLogger = { info: vi.fn(), error: vi.fn() };

    const transport = new StdioTransport(mockStdin as any, mockStdout as any, mockLogger);

    await transport.send({ method: 'test' });
    expect(mockStdout.write).toHaveBeenCalled();
  });
});
```

## Creating a New Tissue

### Step 1: Define the Interface (in Moria)

```typescript
// ecosystem/moria/moria-mcp/src/cache.ts
export interface Cache {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### Step 2: Create the Tissue Package

```bash
mkdir -p ecosystem/histoi/histos-cache
cd ecosystem/histoi/histos-cache
pnpm init
```

### Step 3: Implement with Dependency Injection

```typescript
// ecosystem/histoi/histos-cache/src/redis-cache.ts
export class RedisCache implements Cache {
  constructor(
    private client: RedisClientInterface, // Injected
    private logger: Logger, // From Moria
  ) {}

  async get(key: string): Promise<unknown> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : undefined;
    } catch (error) {
      this.logger.error('Cache get failed', error, { key });
      return undefined;
    }
  }
}
```

### Step 4: Extract Pure Functions

```typescript
// ecosystem/histoi/histos-cache/src/key-builder.ts
export function buildCacheKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

export function parseCacheKey(fullKey: string): { namespace: string; key: string } {
  const [namespace, ...parts] = fullKey.split(':');
  return { namespace, key: parts.join(':') };
}
```

### Step 5: Create Adaptive Factory

```typescript
// ecosystem/histoi/histos-cache/src/adaptive.ts
export function createAdaptiveCache(options?: CacheOptions): Cache {
  // Detect available backends
  if (options?.redis) {
    return new RedisCache(options.redis, options.logger);
  }

  if (typeof localStorage !== 'undefined') {
    return new LocalStorageCache(options?.logger);
  }

  // Fallback to memory
  return new MemoryCache(options?.logger);
}
```

### Step 6: Write Tests

```typescript
// tests/key-builder.unit.test.ts - Pure functions
describe('buildCacheKey', () => {
  it('should combine namespace and key', () => {
    expect(buildCacheKey('user', '123')).toBe('user:123');
  });
});

// tests/redis-cache.integration.test.ts - With simple mocks
describe('RedisCache', () => {
  it('should store and retrieve values', async () => {
    const mockClient = {
      get: vi.fn().mockResolvedValue('{"name":"test"}'),
      set: vi.fn().mockResolvedValue('OK'),
    };
    const mockLogger = { info: vi.fn(), error: vi.fn() };

    const cache = new RedisCache(mockClient, mockLogger);
    const result = await cache.get('key');
    expect(result).toEqual({ name: 'test' });
  });
});
```

## Common Patterns

### Feature Detection

```typescript
export function detectStorageBackend(): StorageBackend {
  // Node.js filesystem
  if (typeof process !== 'undefined' && process.versions?.node) {
    return 'filesystem';
  }

  // Browser localStorage
  if (typeof localStorage !== 'undefined') {
    return 'localstorage';
  }

  // Cloudflare KV
  if (typeof globalThis !== 'undefined' && 'KV' in globalThis) {
    return 'cloudflare-kv';
  }

  // Fallback
  return 'memory';
}
```

### Graceful Degradation

```typescript
export class AdaptiveStorage {
  private backend: StorageProvider;

  constructor(options?: StorageOptions) {
    try {
      this.backend = createOptimalBackend(options);
    } catch {
      this.backend = new MemoryStorage(); // Always works
    }
  }
}
```

### Configuration Through Injection

```typescript
// Psycha decides the configuration
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { createFileStorage } from '@oaknational/mcp-histos-storage';

const storage = createFileStorage(fs, path, './data');
```

## Testing Best Practices

### 1. Unit Tests for Pure Functions

- No mocks needed
- Test business logic thoroughly
- Fast and deterministic

### 2. Integration Tests for Composed Units

- Simple mocks injected as arguments
- Test component interaction
- Verify error handling

### 3. E2E Tests in Psycha

- Real I/O operations
- Full system validation
- Properly labeled as .e2e.test.ts

## Anti-Patterns to Avoid

### ❌ Direct Imports

```typescript
// BAD: Couples to Node.js
import { readFile } from 'fs/promises';
```

### ❌ Complex Mocks

```typescript
// BAD: Complex mock setup
jest.mock('fs/promises');
const mockFs = require('fs/promises');
mockFs.readFile.mockImplementation(...);
```

### ❌ Hidden Dependencies

```typescript
// BAD: Global access
class Logger {
  log(msg: string) {
    console.log(msg); // Hidden dependency on console
  }
}
```

### ❌ Runtime Detection in Business Logic

```typescript
// BAD: Runtime checks scattered throughout
class Storage {
  async read(key: string) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    } else {
      return fs.readFile(key);
    }
  }
}
```

## Migration Guide

### Converting Existing Code to Tissue Pattern

1. **Identify Dependencies**: List all external dependencies
2. **Define Interfaces**: Create minimal interfaces in Moria
3. **Extract Pure Functions**: Move business logic to pure functions
4. **Implement Injection**: Pass dependencies through constructor
5. **Create Factory**: Build adaptive factory function
6. **Update Tests**: Separate unit and integration tests

### Example Migration

Before:

```typescript
import * as fs from 'fs/promises';

export class ConfigLoader {
  async load(path: string) {
    const content = await fs.readFile(path, 'utf-8');
    return JSON.parse(content);
  }
}
```

After:

```typescript
// Pure function
export function parseConfig(content: string): Config {
  return JSON.parse(content);
}

// Injected dependency
export class ConfigLoader {
  constructor(private fs: FileSystemInterface) {}

  async load(path: string) {
    const content = await this.fs.readFile(path, 'utf-8');
    return parseConfig(content); // Pure function
  }
}
```

## Tissue Registry

Current tissues and their capabilities:

| Tissue      | Package                             | Capabilities                    | Environments               |
| ----------- | ----------------------------------- | ------------------------------- | -------------------------- |
| Logger      | `@oaknational/mcp-histos-logger`    | Structured logging with Consola | All                        |
| Storage     | `@oaknational/mcp-histos-storage`   | Key-value storage               | Node, Browser, Memory      |
| Environment | `@oaknational/mcp-histos-env`       | Environment variables           | Node, Edge, Memory         |
| Transport   | `@oaknational/mcp-histos-transport` | MCP communication               | Node (STDIO), Future: HTTP |

## Future Tissues

Planned tissues for ecosystem expansion:

- **histos-cache**: Redis/LocalStorage/Memory caching
- **histos-metrics**: Performance and usage metrics
- **histos-crypto**: Encryption/decryption operations
- **histos-http**: HTTP client with retries
- **histos-queue**: Job queue abstraction

## Conclusion

Tissue adaptation patterns enable true code reusability across different runtime environments. By following these patterns:

1. Code remains testable with simple mocks
2. Runtime adaptation happens at organism level
3. Business logic stays pure and portable
4. Testing becomes straightforward
5. New environments can be supported without code changes

The key insight: **Tissues adapt through injection, not detection**. The organism (Psycha) decides what to inject based on its environment, while tissues remain blissfully unaware of where they're running.
