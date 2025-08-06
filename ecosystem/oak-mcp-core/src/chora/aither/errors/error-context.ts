/**
 * @fileoverview ErrorContextManager - managing error context across async boundaries
 * @module @oak-mcp-core/errors
 *
 * The ErrorContextManager provides context that flows with errors through the system.
 * In Node.js/Bun, context automatically propagates across async boundaries.
 * In edge runtimes, context must be passed explicitly.
 */

import {
  getErrorContextStorage,
  type ErrorContext,
  type ContextStorage,
} from './context-storage.js';

/**
 * Manages error context throughout the application lifecycle
 * Provides context creation, enrichment, and async boundary crossing
 */
export class ErrorContextManager {
  private readonly storage: ContextStorage<ErrorContext>;

  constructor(storage?: ContextStorage<ErrorContext>) {
    // Use provided storage or get the singleton
    this.storage = storage ?? getErrorContextStorage();
  }

  /**
   * Run a function with the given error context
   * Context is available within the function scope
   *
   * @param context - The error context to use
   * @param fn - The function to run with context
   * @returns The function's return value
   */
  withContext<T>(context: ErrorContext, fn: () => T): T {
    return this.storage.run(context, fn);
  }

  /**
   * Run an async function with the given error context
   * In Node.js/Bun, context flows through async boundaries automatically
   * In edge runtimes, context must be passed explicitly
   *
   * @param context - The error context to use
   * @param fn - The async function to run with context
   * @returns Promise with the function's return value
   */
  async withContextAsync<T>(context: ErrorContext, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(context, fn);
  }

  /**
   * Get the current error context
   * Returns undefined if no context is active
   *
   * @returns The current error context or undefined
   */
  getCurrentContext(): ErrorContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Create a new error context with auto-generated correlation ID
   *
   * @param operation - The operation being performed
   * @param correlationId - Optional correlation ID (auto-generated if not provided)
   * @param metadata - Optional additional metadata
   * @returns A new error context
   */
  createContext(
    operation: string,
    correlationId?: string,
    metadata?: Record<string, unknown>,
  ): ErrorContext {
    return {
      operation,
      correlationId: correlationId ?? this.generateCorrelationId(),
      timestamp: new Date(),
      metadata,
    };
  }

  /**
   * Enrich the current context with additional metadata
   * Creates a new context with merged metadata
   *
   * @param additionalMetadata - Metadata to add to current context
   * @returns Enriched error context
   */
  enrichContext(additionalMetadata: Record<string, unknown>): ErrorContext {
    const current = this.getCurrentContext();

    if (!current) {
      // No current context, create a new one with just the metadata
      return this.createContext('unknown', undefined, additionalMetadata);
    }

    // Merge metadata
    const mergedMetadata = {
      ...(current.metadata ?? {}),
      ...additionalMetadata,
    };

    return {
      ...current,
      metadata: mergedMetadata,
    };
  }

  /**
   * Generate a correlation ID for tracing errors across the system
   * Format: timestamp-randomstring
   *
   * @returns A unique correlation ID
   */
  private generateCorrelationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `${String(timestamp)}-${random}`;
  }

  /**
   * Create a context from an error
   * Useful for adding context when catching errors
   *
   * @param error - The error to create context from
   * @param operation - The operation that failed
   * @returns Error context with error details
   */
  createContextFromError(error: unknown, operation: string): ErrorContext {
    const errorDetails: Record<string, unknown> = {};

    if (error instanceof Error) {
      errorDetails.errorName = error.name;
      errorDetails.errorMessage = error.message;

      // Always include stack
      errorDetails.errorStack = error.stack;
    } else if (typeof error === 'string') {
      errorDetails.errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorDetails.errorDetails = error;
    }

    return this.createContext(operation, undefined, errorDetails);
  }

  /**
   * For edge runtimes: Get context for explicit passing
   * This is needed when AsyncLocalStorage isn't available
   *
   * @param operation - The operation being performed
   * @returns Context that can be passed explicitly
   */
  createExplicitContext(operation: string): ErrorContext {
    // In edge runtimes, we can't rely on AsyncLocalStorage
    // So we create context that must be passed explicitly
    return this.createContext(operation);
  }

  /**
   * Check if we're in a runtime that supports async context
   * Note: With the ContextStorage abstraction, this always returns true
   * as the storage handles runtime differences transparently
   *
   * @returns True - storage handles context appropriately for the runtime
   */
  hasAsyncContextSupport(): boolean {
    // The ContextStorage abstraction handles runtime differences
    // AsyncLocalStorage in Node.js/Bun, manual in edge runtimes
    return true;
  }
}

/**
 * Singleton instance for convenience
 * Most applications will use a single ErrorContextManager
 */
let defaultManager: ErrorContextManager | undefined;

/**
 * Get the default ErrorContextManager instance
 * Creates one if it doesn't exist
 *
 * @returns The default ErrorContextManager
 */
export function getDefaultErrorContextManager(): ErrorContextManager {
  defaultManager ??= new ErrorContextManager();
  return defaultManager;
}
