# Restoration – Function & Symbol Index

Collected from memory to aid blob searches after the destructive git command. These symbols were introduced or touched during the logger split, JSON sanitisation refactor, and smoke-test clean-up on 2025-11-03.

## Logger Package (`packages/libs/logger`)

### Core Exports

```ts
export { createAdaptiveLogger } from './adaptive';
export { createRequestLogger, createErrorLogger } from './express-middleware';
export { ConsolaLogger } from './consola-logger';
export { convertLogLevel, toConsolaLevel } from './log-level-conversion';
export {
  mergeLogContext,
  normalizeError,
  sanitiseForJson,
  isJsonValue,
  sanitiseObject,
} from './json-sanitisation';
```

### Adaptive Logger (Browser Entry)

```ts
const NODE_ENTRY_HINT =
  'File or stdout-disabled sinks require the Node entry point. Import from "@oaknational/mcp-logger/node".';

function ensureBrowserCompatibleSinkConfig(sinkConfig: LoggerSinkConfig): void;

export function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance,
  sinkConfig?: LoggerSinkConfig,
): Logger;
```

### Adaptive Logger (Node Entry – `adaptive-node.ts`)

```ts
function toBufferEncoding(encoding?: string): BufferEncoding;

function createFileSystemAdapter(fs: FileSystem): {
  mkdir: (path: string, opts: { recursive: true }) => void;
  createWriteStream: (
    path: string,
    options: { flags: string; encoding: BufferEncoding },
  ) => SimpleWriteStream;
};

export function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance,
  sinkConfig?: LoggerSinkConfig,
  fileSystem?: FileSystem,
): Logger;
```

### Multi-Sink Logger

```ts
export class MultiSinkLogger implements Logger {
  constructor(
    config: LoggerSinkConfig,
    options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
    consolaInstance?: ConsolaInstance,
    fileSinkFactory?: (config: FileSinkConfig) => FileSinkInterface,
  );

  log(level: LogLevel, message: string, context?: JsonObject): void;
  isLevelEnabled(level: LogLevel): boolean;
}
```

### Sink Configuration Symbols

```ts
export const DEFAULT_HTTP_SINK_CONFIG: LoggerSinkConfig;
export const DEFAULT_STDIO_SINK_CONFIG: LoggerSinkConfig;
export function parseSinkConfigFromEnv(env: LoggerSinkEnvironment): LoggerSinkConfig;

export type FileSinkConfig = {
  path: string;
  append?: boolean;
  encoding?: BufferEncoding;
};
```

### Log-Level Utilities

```ts
export const LOG_LEVEL_VALUES: readonly LogLevel[];
export const LOG_LEVEL_KEY = 'LOG_LEVEL';
export const ENABLE_DEBUG_LOGGING_KEY = 'ENABLE_DEBUG_LOGGING';
export function isLevelEnabled(logger: Logger, level: LogLevel): boolean;
export function isLogLevel(input: string): input is LogLevel;
export function getDefaultLogLevel(env?: BaseLoggingEnvironment): LogLevel;
export function parseLogLevel(input: string): LogLevel;
export function compareLogLevels(a: LogLevel, b: LogLevel): number;
export function shouldLog(level: LogLevel, threshold: LogLevel): boolean;
```

### JSON Sanitisation (Refactored for Lint Compliance)

```ts
type ValueSanitiser = (value: unknown, context: SanitiserContext) => JsonValue | undefined;

function sanitisePlainObjectValue(source: PlainObject, context: SanitiserContext): JsonValue;
function sanitiseArrayValue(values: readonly unknown[], context: SanitiserContext): JsonValue;
function sanitisePrimitive(value: unknown): JsonValue | undefined;
function sanitiseDate(value: Date): string;
function sanitiseError(error: Error, context: SanitiserContext): JsonObject;
function sanitiseBigInt(value: bigint): string;
```

## Node Entry Barrel (`src/node.ts`)

```ts
export {
  createAdaptiveLogger,
  ConsolaLogger,
  convertLogLevel,
  toConsolaLevel,
  mergeLogContext,
  normalizeError,
  sanitiseForJson,
  isJsonValue,
  sanitiseObject,
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
  parseSinkConfigFromEnv,
  isLevelEnabled,
  LOG_LEVEL_VALUES,
  LOG_LEVEL_KEY,
  ENABLE_DEBUG_LOGGING_KEY,
  isLogLevel,
  getDefaultLogLevel,
  parseLogLevel,
  compareLogLevels,
  shouldLog,
} from './index.js';

export { MultiSinkLogger } from './multi-sink-logger.js';
export { DEFAULT_HTTP_SINK_CONFIG, DEFAULT_STDIO_SINK_CONFIG } from './sink-config.js';
export type { FileSinkConfig } from './sink-config.js';
export { createFileSink } from './file-sink.js';
export type { FileSinkInterface, FileSystem, SimpleWriteStream } from './file-sink.js';
```

## Smoke Test Adjustments (HTTP App)

```ts
export type SmokeSuiteMode = 'local-stub' | 'local-stub-auth' | 'local-live' | 'remote';

export async function runSmokeAssertions(context: SmokeContext): Promise<void>;
```

## Constants & Environment Keys

```ts
const NODE_ENTRY_HINT: string;
const CIRCULAR_REFERENCE_PLACEHOLDER = '[Circular]';
const LOG_FILE_APPEND_FLAG = 'append';
const SMOKE_USE_HEADLESS_OAUTH = 'SMOKE_USE_HEADLESS_OAUTH';
```

_End of remembered symbol list._
