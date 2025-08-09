# @oaknational/mcp-histos-storage

## Overview

An adaptive storage tissue that provides key-value storage across different runtime environments with automatic backend selection.

## Features

- **Multi-Backend Support**: FileSystem (Node.js), LocalStorage (Browser), Memory (Universal)
- **Automatic Detection**: Chooses the best available storage backend
- **Namespace Isolation**: Separate storage areas for different components
- **Dependency Injection**: All I/O operations are injectable
- **Pure Functions**: Core logic extracted for testability
- **Async API**: Consistent Promise-based interface

## Installation

```bash
pnpm add @oaknational/mcp-histos-storage
```

## Usage

### Basic Usage (Automatic Backend)

```typescript
import { createAdaptiveStorage } from '@oaknational/mcp-histos-storage';

// Automatically selects best backend
const storage = await createAdaptiveStorage({
  namespace: 'my-app',
});

// Store data
await storage.set('user:123', { name: 'Alice', age: 30 });

// Retrieve data
const user = await storage.get('user:123');
console.log(user); // { name: 'Alice', age: 30 }

// List all keys
const keys = await storage.keys();
console.log(keys); // ['user:123']

// Delete data
await storage.delete('user:123');
```

### Manual Backend Selection

```typescript
import { createFileStorage } from '@oaknational/mcp-histos-storage';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Explicitly use filesystem backend with injected dependencies
const storage = createFileStorage(fs, path, './data/storage');

await storage.set('config', { theme: 'dark' });
```

### Memory Storage (Testing)

```typescript
import { MemoryStorage } from '@oaknational/mcp-histos-storage';

// In-memory storage for testing
const storage = new MemoryStorage('test-namespace');

await storage.set('key', 'value');
const value = await storage.get('key');
```

## Architecture

### Dependency Injection Pattern

```typescript
// FileSystem storage with injected dependencies
export function createFileStorage(
  fs: FileSystemInterface, // Injected filesystem
  path: PathInterface, // Injected path module
  dir: string, // Storage directory
): StorageProvider;
```

### Backend Detection

```typescript
export interface StorageOptions {
  namespace: string;
  backend?: 'filesystem' | 'localstorage' | 'memory' | 'auto';
  directory?: string; // For filesystem backend
}

// Automatic detection order:
// 1. Check for Node.js filesystem
// 2. Check for browser localStorage
// 3. Check for Cloudflare KV
// 4. Fallback to memory storage
```

## Storage Backends

### FileSystem Backend (Node.js)

- Stores data as JSON files on disk
- Supports large data sets
- Persistent across restarts
- Requires filesystem access

### LocalStorage Backend (Browser)

- Uses browser's localStorage API
- Limited to ~5-10MB
- Persistent across sessions
- Synchronous API wrapped in Promises

### Memory Backend (Universal)

- In-memory Map storage
- No size limits (bound by available RAM)
- Data lost on restart
- Perfect for testing

## API Reference

### StorageProvider Interface

```typescript
interface StorageProvider {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  clear?(): Promise<void>;
  keys?(): Promise<string[]>;
}
```

### createAdaptiveStorage

```typescript
async function createAdaptiveStorage(options: StorageOptions): Promise<StorageProvider>;
```

### File Storage

```typescript
function createFileStorage(
  fs: FileSystemInterface,
  path: PathInterface,
  dir: string,
): StorageProvider;
```

## Testing

### Unit Tests

```bash
pnpm test tests/file-storage.unit.test.ts
```

### Integration Tests

```bash
pnpm test tests/adaptive-mock.integration.test.ts
```

### E2E Tests

```bash
pnpm test tests/adaptive.e2e.test.ts
```

## Design Decisions

1. **Backend Agnostic**: Same API regardless of storage backend
2. **Dependency Injection**: Filesystem operations are injected
3. **Namespace Isolation**: Each instance has its own namespace
4. **JSON Serialization**: All values are JSON serialized
5. **Error Recovery**: Operations fail gracefully with fallbacks

## Error Handling

```typescript
const storage = await createAdaptiveStorage({
  namespace: 'app',
});

try {
  await storage.set('key', value);
} catch (error) {
  // Storage errors are caught and logged
  // Operations fail gracefully
}

// get() returns undefined for missing keys
const value = await storage.get('nonexistent'); // undefined
```

## Performance Considerations

- **FileSystem**: Best for large data, slower operations
- **LocalStorage**: Fast but limited size
- **Memory**: Fastest but not persistent

## Future Enhancements

- **Cloudflare KV Backend**: For edge deployments
- **Redis Backend**: For distributed systems
- **IndexedDB Backend**: For larger browser storage
- **Compression**: Optional value compression
- **Encryption**: Optional value encryption
- **TTL Support**: Automatic expiration

## Contributing

This tissue is part of the Oak MCP ecosystem. See the main repository for contribution guidelines.

## License

MIT
