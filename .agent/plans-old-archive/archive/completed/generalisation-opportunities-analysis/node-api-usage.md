# Node.js API Usage Audit

## Summary

Identified Node.js APIs used across the codebase:

- **File System**: `fs.writeFileSync`, `fs.mkdirSync`
- **Path**: `path.join`, `path.dirname`
- **Process**: `process.env`, `process.cwd()`, `process.exit()`
- **Crypto**: Not used
- **Streams**: Via stdio transport (MCP SDK)
- **Buffer**: Not used directly

## Detailed Usage by Module

### File System APIs

| API             | Module                            | Line   | Purpose           | Edge Alternative     |
| --------------- | --------------------------------- | ------ | ----------------- | -------------------- |
| `writeFileSync` | `src/logging/file-reporter.ts:2`  | Import | Write log files   | KV store, fetch POST |
| `writeFileSync` | `src/logging/file-reporter.ts:56` | Usage  | Append logs       | Streaming API        |
| `mkdirSync`     | `src/logging/file-reporter.ts:2`  | Import | Create log dirs   | N/A - pre-create     |
| `mkdirSync`     | `src/logging/file-reporter.ts:42` | Usage  | Ensure dir exists | Config validation    |
| `writeFileSync` | `src/startup-logger.ts:1`         | Import | Early logging     | Console only         |
| `mkdirSync`     | `src/startup-logger.ts:1`         | Import | Early logging     | Console only         |

### Path APIs

| API            | Module                           | Line   | Purpose         | Edge Alternative |
| -------------- | -------------------------------- | ------ | --------------- | ---------------- |
| `path.join`    | `src/logging/file-reporter.ts:2` | Import | Build paths     | URL API          |
| `path.join`    | `src/logging/logger.ts:2`        | Import | Log paths       | Config injection |
| `path.join`    | `src/startup-logger.ts:1`        | Import | Early log paths | URL API          |
| `path.dirname` | `src/startup-logger.ts:1`        | Import | Directory ops   | URL parsing      |

### Process APIs

| API              | Module                         | Line  | Purpose        | Edge Alternative |
| ---------------- | ------------------------------ | ----- | -------------- | ---------------- |
| `process.env`    | `src/config/environment.ts:14` | Usage | Read env vars  | Config injection |
| `process.env`    | `src/config/environment.ts:50` | Usage | Default values | Config defaults  |
| `process.cwd()`  | `src/logging/logger.ts:28`     | Usage | Base directory | Config injection |
| `process.cwd()`  | `src/startup-logger.ts:17`     | Usage | Root directory | Config injection |
| `process.exit()` | `src/index.ts:8`               | Usage | Error handling | Throw error      |

### Stream APIs (Indirect)

| API   | Module                  | Line   | Purpose        | Edge Alternative   |
| ----- | ----------------------- | ------ | -------------- | ------------------ |
| stdio | `src/index.ts:1`        | Import | MCP transport  | WebSocket/HTTP     |
| stdio | `src/server-setup.ts:1` | Type   | Transport type | Abstract transport |

## Runtime Compatibility Matrix

| API                | Node.js | Deno | Bun | CF Workers | Browser | Solution              |
| ------------------ | ------- | ---- | --- | ---------- | ------- | --------------------- |
| `fs.writeFileSync` | ✅      | ✅\* | ✅  | ❌         | ❌      | Adapter pattern       |
| `fs.mkdirSync`     | ✅      | ✅\* | ✅  | ❌         | ❌      | Pre-configuration     |
| `path.join`        | ✅      | ✅   | ✅  | ✅\*\*     | ✅\*\*  | URL API               |
| `path.dirname`     | ✅      | ✅   | ✅  | ✅\*\*     | ✅\*\*  | URL parsing           |
| `process.env`      | ✅      | ✅   | ✅  | ✅\*\*\*   | ❌      | Config injection      |
| `process.cwd()`    | ✅      | ✅   | ✅  | ❌         | ❌      | Config injection      |
| `process.exit()`   | ✅      | ✅   | ✅  | ❌         | ❌      | Error throwing        |
| stdio streams      | ✅      | ✅   | ✅  | ❌         | ❌      | Transport abstraction |

\* Deno requires permissions  
\*\* Via polyfill or native URL API  
\*\*\* Workers use env bindings

## Replaceability Analysis

### ✅ Easy to Replace (Direct alternatives exist)

1. **Path operations** → URL API

   ```typescript
   // Current
   path.join(dir, 'file.log');

   // Edge-compatible
   new URL('file.log', baseURL).pathname;
   ```

2. **Process.env** → Configuration injection

   ```typescript
   // Current
   const apiKey = process.env.NOTION_API_KEY;

   // Edge-compatible
   const apiKey = config.notionApiKey;
   ```

### 🟡 Medium Difficulty (Requires abstraction)

1. **File system operations** → Adapter pattern

   ```typescript
   interface LogWriter {
     write(path: string, content: string): void;
   }

   // Node implementation
   class FileLogWriter implements LogWriter {
     write(path: string, content: string): void {
       fs.writeFileSync(path, content, { flag: 'a' });
     }
   }

   // Edge implementation
   class KVLogWriter implements LogWriter {
     async write(key: string, content: string): Promise<void> {
       await env.KV.put(key, content);
     }
   }
   ```

2. **Process.cwd()** → Base path configuration

   ```typescript
   // Current
   const logDir = join(process.cwd(), '.logs');

   // Edge-compatible
   const logDir = config.logDirectory;
   ```

### 🔴 Hard to Replace (Architectural changes needed)

1. **stdio transport** → Transport abstraction
   - Current: Direct stdio usage for MCP communication
   - Solution: Abstract transport interface with pluggable implementations
   - Impact: Changes to server initialization

## Abstraction Patterns

### 1. File System Abstraction

```typescript
interface FileSystem {
  writeFile(path: string, data: string, options?: WriteOptions): void;
  makeDirectory(path: string, options?: MkdirOptions): void;
  exists(path: string): boolean;
}
```

### 2. Environment Abstraction

```typescript
interface RuntimeEnvironment {
  getEnv(key: string): string | undefined;
  getWorkingDirectory(): string;
  exit(code: number): never;
}
```

### 3. Transport Abstraction

```typescript
interface Transport {
  on(event: string, handler: Function): void;
  send(message: unknown): void;
  close(): void;
}
```

## Recommendations

### Immediate Actions

1. Replace `path` operations with URL API
2. Inject configuration instead of reading `process.env`
3. Replace `process.cwd()` with configured paths

### Refactoring Required

1. Create file system abstraction for logging
2. Design transport abstraction for MCP communication
3. Remove `process.exit()` in favor of error propagation

### Architecture Changes

1. Dependency injection for all Node.js APIs
2. Adapter pattern for runtime-specific implementations
3. Configuration-driven initialization

## Impact Assessment

- **Low Impact**: Path operations, environment variables
- **Medium Impact**: File system operations (logging only)
- **High Impact**: stdio transport (core MCP communication)

With proper abstractions, approximately 80% of Node.js API usage can be made edge-compatible without significant functionality loss.
