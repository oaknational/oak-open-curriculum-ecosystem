export interface CoreLogger {
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
}

export interface CoreClock {
  now(): number;
}

export interface CoreStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface CoreProviders {
  logger: CoreLogger;
  clock: CoreClock;
  storage: CoreStorage;
}

export type CoreRuntime = CoreProviders;

export function createRuntime(providers: CoreProviders): CoreRuntime {
  return providers;
}

// ---------------------------------------------
// Temporary compatibility surface (behaviour‑preserving)
// ---------------------------------------------
// These definitions mirror commonly used types previously imported from
// the legacy core so we can switch imports mechanically without
// changing behaviour. When consumers migrate fully, this surface can be
// narrowed or removed in favour of dedicated core types.

// JSON types
export type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

// Logger (legacy-compatible shape)
export interface Logger {
  trace(message: string, context?: unknown): void;
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, error?: unknown, context?: unknown): void;
  fatal(message: string, error?: unknown, context?: unknown): void;
  isLevelEnabled?(level: number): boolean;
  child?(context: JsonObject): Logger;
}

// Storage (legacy-compatible shape)
export interface StorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear?(): Promise<void>;
  keys?(): Promise<string[]>;
  size?(): Promise<number>;
}
export type AsyncStorageProvider = StorageProvider;

// Environment (legacy-compatible interface)
export interface EnvironmentProvider {
  get(key: string): string | undefined;
  getAll(): Record<string, string | undefined>;
  has(key: string): boolean;
}

// Streams (legacy-compatible evented interfaces)
export interface ReadableStream {
  on(event: 'data', handler: (chunk: Buffer | string) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'end', handler: () => void): void;
  removeListener(event: 'data', handler: (chunk: Buffer | string) => void): this;
  removeListener(event: 'error', handler: (error: Error) => void): this;
  removeListener(event: 'end', handler: () => void): this;
  removeListener(event: string, handler: (...args: unknown[]) => void): this;
  pause(): void;
  resume(): void;
}

export interface WritableStream {
  write(chunk: string | Buffer, callback?: (error?: Error | null) => void): boolean;
  end(callback?: () => void): void;
}

export interface DuplexStream extends ReadableStream, WritableStream {}

// Tool abstractions (legacy-compatible)
export interface ToolExecutor<TInput = unknown, TOutput = unknown> {
  execute(input: TInput): Promise<TOutput>;
}

export interface ToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: {
    readonly type: 'object';
    readonly properties: JsonObject;
    readonly required?: readonly string[];
    readonly additionalProperties?: boolean;
  };
}

export interface Tool<TInput = unknown, TOutput = unknown> {
  readonly definition: ToolDefinition;
  readonly executor: ToolExecutor<TInput, TOutput>;
}

export interface ToolRegistry<T extends Tool = Tool> {
  register(tool: T): void;
  get(name: string): T | undefined;
  getAll(): readonly T[];
  has(name: string): boolean;
  clear(): void;
  unregister?(name: string): boolean;
  size?(): number;
}

export interface ToolValidator<TInput = unknown> {
  validate(input: unknown): input is TInput;
  getErrors?(input: unknown): string[];
}

// Runtime-boundary helpers (legacy-compatible)
export function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isEnvironmentObject(value: unknown): value is Record<string, string | undefined> {
  if (!isObject(value)) return false;
  for (const v of Object.values(value)) {
    if (typeof v !== 'string' && typeof v !== 'undefined') {
      return false;
    }
  }
  return true;
}

type Keyed<K extends string> = JsonObject & Record<K, unknown>;

export function hasProperty<K extends string>(value: unknown, property: K): value is Keyed<K> {
  if (!isObject(value)) return false;
  return property in value;
}

export function hasNestedProperty(value: unknown, path: string[]): boolean {
  if (path.length === 0) return false;
  let current: unknown = value;
  for (const segment of path) {
    if (!hasProperty(current, segment)) return false;
    current = current[segment];
  }
  return true;
}

export function extractProperty(value: unknown, property: string): unknown {
  if (!hasProperty(value, property)) return undefined;
  return value[property];
}

export function extractNestedProperty(value: unknown, path: string[]): unknown {
  if (path.length === 0) return undefined;
  let current: unknown = value;
  for (const segment of path) {
    current = extractProperty(current, segment);
    if (current === undefined) return undefined;
  }
  return current;
}
