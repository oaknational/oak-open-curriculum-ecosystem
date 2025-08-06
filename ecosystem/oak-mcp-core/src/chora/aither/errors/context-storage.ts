/**
 * @fileoverview Runtime-agnostic context storage abstraction
 * @module @oak-mcp-core/errors
 *
 * Pure abstraction for context storage that works across different JavaScript runtimes.
 * This is the genotype - containing only interfaces and pure implementations
 * with zero runtime dependencies.
 *
 * Runtime-specific implementations (like AsyncLocalStorage) belong in the phenotype.
 */

/**
 * Error context that flows through the system
 * Like a message attached to the error signal
 */
export interface ErrorContext {
  readonly operation?: string;
  readonly timestamp?: Date;
  readonly correlationId?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Abstract context storage interface - the morphe (Platonic form)
 * This defines how context should behave, regardless of runtime
 */
export interface ContextStorage<T> {
  /**
   * Run a function with the given context
   * Context is available within the function and its async descendants
   */
  run<R>(context: T, callback: () => R): R;

  /**
   * Get the current context
   * Returns undefined if no context is active
   */
  getStore(): T | undefined;
}

/**
 * Manual context storage - a pure implementation with no dependencies
 * Uses a stack to manage nested contexts synchronously
 *
 * Note: This does NOT propagate across async boundaries automatically.
 * In edge runtimes, context must be passed explicitly.
 */
export class ManualContextStorage<T> implements ContextStorage<T> {
  private readonly stack: T[] = [];

  run<R>(context: T, callback: () => R): R {
    this.stack.push(context);
    try {
      return callback();
    } finally {
      this.stack.pop();
    }
  }

  getStore(): T | undefined {
    return this.stack[this.stack.length - 1];
  }
}

/**
 * Factory function type for creating context storage
 * Implementations in phenotype will provide runtime-specific versions
 */
export type ContextStorageFactory<T> = () => ContextStorage<T>;

/**
 * Default factory that creates manual storage
 * This is the fallback for all environments
 */
export function createManualContextStorage<T>(): ContextStorage<T> {
  return new ManualContextStorage<T>();
}

/**
 * Global storage registry for dependency injection
 * Phenotype implementations can register their factories here
 */
const storageFactories = new Map<string, ContextStorageFactory<unknown>>();

/**
 * Register a context storage factory
 * Used by phenotype to provide runtime-specific implementations
 */
export function registerContextStorageFactory<T>(
  name: string,
  factory: ContextStorageFactory<T>,
): void {
  storageFactories.set(name, factory as ContextStorageFactory<unknown>);
}

/**
 * Get a registered context storage factory
 * Returns manual storage factory if not found
 */
export function getContextStorageFactory<T>(name: string): ContextStorageFactory<T> {
  const factory = storageFactories.get(name);
  if (factory) {
    return factory as ContextStorageFactory<T>;
  }
  return createManualContextStorage;
}

/**
 * Create context storage using registered factory or fallback
 * This allows phenotype to inject runtime-specific implementations
 */
export function createContextStorage<T>(factoryName = 'default'): ContextStorage<T> {
  const factory = getContextStorageFactory<T>(factoryName);
  return factory();
}

/**
 * Singleton storage for error context
 * Created once and reused throughout the application
 */
let errorContextStorage: ContextStorage<ErrorContext> | undefined;

/**
 * Get or create the error context storage
 * Ensures we only create one instance
 */
export function getErrorContextStorage(): ContextStorage<ErrorContext> {
  errorContextStorage ??= createContextStorage<ErrorContext>('error');
  return errorContextStorage;
}

/**
 * Reset the error context storage
 * Useful for testing or reinitialization
 */
export function resetErrorContextStorage(): void {
  errorContextStorage = undefined;
}
