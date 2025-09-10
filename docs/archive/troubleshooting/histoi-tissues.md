# Histoi Tissues Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with Histoi tissues across different runtime environments.

## Common Issues

### 1. Module Resolution Errors

#### Symptom

```
Error: Cannot find module '@oaknational/mcp-histos-logger'
```

#### Causes

- Package not installed
- Workspace not properly configured
- Build not completed

#### Solutions

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Check workspace configuration
cat pnpm-workspace.yaml
```

### 2. TypeScript Import Errors

#### Symptom

```typescript
// TS2307: Cannot find module or its corresponding type declarations
import { Logger } from '@oaknational/mcp-moria';
```

#### Causes

- Missing `.js` extension in imports
- TypeScript not recognizing workspace packages
- Build artifacts not generated

#### Solutions

```typescript
// Add .js extension for ESM
import { Logger } from '@oaknational/mcp-moria/dist/index.js';

// Or ensure package.json exports are correct
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

### 3. Runtime Adaptation Failures

#### Symptom

```
Error: localStorage is not defined
ReferenceError: process is not defined
```

#### Causes

- Direct access to runtime-specific globals
- Missing dependency injection
- Wrong backend detection

#### Solutions

```typescript
// ❌ Bad: Direct global access
class Storage {
  save(key: string, value: string) {
    localStorage.setItem(key, value); // Fails in Node.js
  }
}

// ✅ Good: Dependency injection
class Storage {
  constructor(private backend: StorageBackend) {}

  save(key: string, value: string) {
    return this.backend.set(key, value);
  }
}
```

### 4. ESLint Boundary Violations

#### Symptom

```
ESLint: Histoi tissues cannot import from Node.js built-ins
ESLint: Cross-tissue imports are not allowed
```

#### Causes

- Direct Node.js imports in Histoi
- Tissue importing from another tissue
- Missing dependency injection

#### Solutions

```typescript
// ❌ Bad: Direct Node.js import
import * as fs from 'node:fs/promises';

// ✅ Good: Interface + Injection
interface FileSystem {
  readFile(path: string): Promise<string>;
}

class Storage {
  constructor(private fs: FileSystem) {}
}
```

### 5. Test Failures

#### Symptom

```
FAIL: Integration test performing real I/O
Error: ENOENT: no such file or directory
```

#### Causes

- Integration tests doing real I/O
- Missing mock injection
- Wrong test type (should be E2E)

#### Solutions

```typescript
// ❌ Bad: Real I/O in integration test
it('should read file', async () => {
  const storage = new FileStorage();
  await storage.read('./test.json'); // Real filesystem!
});

// ✅ Good: Mocked I/O in integration test
it('should read file', async () => {
  const mockFs = {
    readFile: vi.fn().mockResolvedValue('{"test": true}'),
  };
  const storage = new FileStorage(mockFs);
  await storage.read('./test.json');
});
```

## Runtime Compatibility Matrix

| Tissue           | Node.js | Deno | Bun | Browser | Edge | Cloudflare |
| ---------------- | ------- | ---- | --- | ------- | ---- | ---------- |
| histos-logger    | ✅      | ✅   | ✅  | ✅      | ✅   | ✅         |
| histos-storage   | ✅      | ⚠️   | ✅  | ✅      | ⚠️   | 🔄         |
| histos-env       | ✅      | ✅   | ✅  | ❌      | ✅   | ✅         |
| histos-transport | ✅      | ⚠️   | ✅  | ❌      | ❌   | ❌         |

Legend:

- ✅ Fully supported
- ⚠️ Partial support (with adaptation)
- 🔄 In development
- ❌ Not applicable

## Debugging Tissue Adaptation

### 1. Check Backend Detection

```typescript
import { detectStorageOptions } from '@oaknational/mcp-histos-storage';

const options = detectStorageOptions();
console.log('Detected backend:', options.backend);
console.log('Environment:', {
  node: typeof process !== 'undefined',
  browser: typeof window !== 'undefined',
  deno: typeof Deno !== 'undefined',
});
```

### 2. Verify Dependency Injection

```typescript
// Add debug logging to constructors
class MyTissue {
  constructor(deps: Dependencies) {
    console.log('Injected dependencies:', Object.keys(deps));
    if (!deps.requiredDep) {
      throw new Error('Missing required dependency: requiredDep');
    }
  }
}
```

### 3. Test in Different Environments

```bash
# Node.js
node test-script.js

# Deno
deno run --allow-read test-script.js

# Bun
bun test-script.js

# Browser (using Vite)
vite preview
```

## Build Issues

### Missing Exports

#### Symptom

```
Error: Package subpath './dist/index.js' is not defined by "exports"
```

#### Solution

Ensure package.json has proper exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "type": "module"
}
```

### TypeScript Declaration Files

#### Symptom

```
Cannot find type declarations
```

#### Solution

```bash
# Build with declarations
pnpm build

# Check tsconfig.build.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  }
}
```

## Performance Issues

### Memory Leaks

#### Symptom

- Increasing memory usage over time
- Node.js heap out of memory

#### Common Causes

- Event listeners not cleaned up
- Circular references in stored data
- Large buffers not released

#### Solutions

```typescript
class Transport {
  private listeners = new Set<Function>();

  close() {
    // Clean up listeners
    this.listeners.clear();

    // Remove event listeners
    this.stream.removeAllListeners();

    // Clear buffers
    this.buffer = null;
  }
}
```

### Slow Operations

#### Symptom

- Storage operations taking >100ms
- Logger causing performance degradation

#### Solutions

```typescript
// Batch operations
const batch = [];
for (const item of items) {
  batch.push(storage.set(item.key, item.value));
}
await Promise.all(batch);

// Adjust log levels in production
const logger = createAdaptiveLogger({
  level: process.env.NODE_ENV === 'production' ? 'WARN' : 'DEBUG',
});
```

## Environment-Specific Issues

### Node.js

```typescript
// Issue: fs module not available
// Solution: Inject fs dependency
import * as fs from 'node:fs/promises';
const storage = createFileStorage(fs, path, './data');
```

### Browser

```typescript
// Issue: localStorage quota exceeded
// Solution: Implement cleanup
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Clean up old entries
    cleanupOldEntries();
    localStorage.setItem(key, value);
  }
}
```

### Edge Runtime

```typescript
// Issue: No filesystem access
// Solution: Use KV storage or memory
const storage = globalThis.KV ? new KVStorage(globalThis.KV) : new MemoryStorage();
```

## Getting Help

1. **Check Examples**: Review tissue test files for usage patterns
2. **Read ADRs**: Architecture Decision Records explain design choices
3. **Review Tests**: Test files show correct usage
4. **GitHub Issues**: Report bugs or request features
5. **Documentation**: Check tissue-adaptation-patterns.md

## Quick Fixes Checklist

- [ ] Dependencies installed: `pnpm install`
- [ ] Packages built: `pnpm build`
- [ ] Using `.js` extensions in imports
- [ ] Dependencies injected, not imported
- [ ] Tests use correct type (.unit, .integration, .e2e)
- [ ] ESLint boundaries configured correctly
- [ ] Runtime detection at organism level, not tissue
- [ ] Error handling for adaptation failures
- [ ] Fallback strategies implemented

## Prevention

1. **Always inject dependencies** - Never import Node.js modules directly in tissues
2. **Extract pure functions** - Make code testable without mocks
3. **Follow tissue patterns** - Use histos-transport as reference
4. **Test in target environments** - Don't assume compatibility
5. **Handle adaptation failures** - Always have a fallback strategy
