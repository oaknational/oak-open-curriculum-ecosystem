# @oaknational/mcp-logger

## Overview

An adaptive logging library that provides structured logging across different runtime environments using Consola as the underlying engine.

## Features

- **Universal Compatibility**: Works in Node.js, Edge, Browser environments
- **Structured Logging**: Rich context and metadata support
- **Pure Functions**: Core logic extracted for testability
- **Dependency Injection**: Flexible logger instance injection
- **Child Loggers**: Create scoped loggers with inherited context
- **Level Control**: Configurable log levels (TRACE, DEBUG, INFO, WARN, ERROR, FATAL)

## Installation

```bash
pnpm add @oaknational/mcp-logger
```

## Usage

### Basic Usage

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

// Create a logger
const logger = createAdaptiveLogger({
  level: 'INFO',
  name: 'my-app',
  context: { version: '1.0.0' },
});

// Log messages
logger.info('Application started');
logger.error('Connection failed', new Error('Timeout'), { retry: 3 });
logger.debug('Processing item', { id: 123 });
```

### Dependency Injection

```typescript
import { ConsolaLogger } from '@oaknational/mcp-logger';
import { createConsola } from 'consola';

// Inject your own Consola instance
const consola = createConsola({
  level: 3,
  fancy: true,
});

const logger = new ConsolaLogger(consola, {
  app: 'custom-app',
});
```

### Child Loggers

```typescript
const parentLogger = createAdaptiveLogger({
  context: { service: 'api' },
});

// Create child with additional context
const childLogger = parentLogger.child?.({
  endpoint: '/users',
  method: 'GET',
});

childLogger?.info('Request received');
// Logs with combined context: { service: 'api', endpoint: '/users', method: 'GET' }
```

### Pure Functions

The logger exports pure utility functions:

```typescript
import {
  convertLogLevel,
  toConsolaLevel,
  mergeLogContext,
  normalizeError,
  isLevelEnabled,
} from '@oaknational/mcp-logger';

// Convert semantic level to numeric
const level = convertLogLevel('DEBUG'); // Returns 10

// Check if level is enabled
const enabled = isLevelEnabled(20, 10); // true (INFO enabled for DEBUG)

// Merge contexts
const merged = mergeLogContext({ app: 'test' }, { user: 'alice' }); // { app: 'test', user: 'alice' }
```

## Architecture

### Dependency Injection Pattern

```typescript
export class ConsolaLogger implements Logger {
  constructor(
    private readonly consola: ConsolaInstance, // Injected
    private readonly contextData: Record<string, unknown> = {},
  ) {}
}
```

### Pure Functions

All business logic is extracted into pure functions:

- `convertLogLevel`: Convert semantic levels to numeric
- `toConsolaLevel`: Map to Consola's scale
- `mergeLogContext`: Combine context objects
- `normalizeError`: Convert various error types to Error objects
- `isLevelEnabled`: Check if a log level should output

## Log Levels

| Level | Numeric | Description                    |
| ----- | ------- | ------------------------------ |
| TRACE | 0       | Detailed debugging information |
| DEBUG | 10      | Debug information              |
| INFO  | 20      | General information            |
| WARN  | 30      | Warning messages               |
| ERROR | 40      | Error messages                 |
| FATAL | 50      | Fatal errors                   |

## Testing

### Unit Tests (Pure Functions)

```bash
pnpm test tests/pure-functions.unit.test.ts
```

### Integration Tests

```bash
pnpm test tests/adaptive.integration.test.ts
```

## API Reference

### createAdaptiveLogger

```typescript
function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance, // For testing
): Logger;

interface LoggerOptions {
  level?: number | LogLevel;
  name?: string;
  context?: Record<string, unknown>;
}
```

### Logger Interface

```typescript
interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
  fatal(message: string, error?: unknown, context?: unknown): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: Record<string, unknown>): Logger;
}
```

## Environment Adaptation

The logger automatically adapts to different environments:

- **Node.js**: Full console output with colors
- **Browser**: Browser console integration
- **Edge Runtime**: Structured JSON output
- **Testing**: Controllable output for test assertions

## Consumption: Source vs Bundled

- In development and app builds (e.g. Next.js), imports resolve to the TypeScript sources via monorepo path mapping:
  - `@oaknational/mcp-logger` → `packages/libs/logger/src`
  - Internal imports in `src/` are extensionless (e.g. `./pure-functions`) to keep TS and bundlers happy.
- At runtime (Node, tests, packaged usage), the library ships a single bundled ESM entry at `dist/index.js`:
  - Package `exports` maps `import`/`default` to `./dist/index.js`.
  - This avoids nested relative ESM resolution issues in child processes/e2e.

Guidance:

- **Next.js / web apps**: depend on `@oaknational/mcp-logger` normally. The app will consume source during build and bundle it.
- **Node CLIs / e2e**: also depend normally; at runtime the bundled `dist/index.js` is used automatically via `exports`.
- Do not deep‑import internal files; always import from the package root.

## Design Decisions

1. **Consola-based**: Leverages Consola's built-in environment detection
2. **Pure Function Extraction**: All logic that can be pure is extracted
3. **Dependency Injection**: ConsolaInstance can be injected for testing
4. **No Global State**: Each logger instance is independent
5. **Context Inheritance**: Child loggers inherit parent context

## Contributing

This library is part of the Oak MCP workspace. See the main repository for contribution guidelines.

## License

MIT
