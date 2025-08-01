/**
 * @fileoverview Context-aware logger implementation using AsyncLocalStorage
 * @module @oak-mcp-core/logging
 *
 * This module will be extracted to oak-mcp-core.
 * Uses AsyncLocalStorage for correlation ID tracking across async boundaries.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { Logger, LogContext, LogLevel } from './logger-interface.js';

/**
 * Merge two contexts with later values taking precedence
 * Pure function - no side effects
 */
export function mergeContexts(base: LogContext, override: LogContext): LogContext {
  return { ...base, ...override };
}

/**
 * Generate a unique correlation ID
 * Pure function - deterministic format
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Sanitize sensitive fields from context
 * Pure function - no side effects
 */
export function sanitizeContext(
  context: LogContext,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'apiKey'],
): LogContext {
  const sanitized: LogContext = {};

  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sensitive) =>
      lowerKey.includes(sensitive.toLowerCase()),
    );

    sanitized[key] = isSensitive ? '[REDACTED]' : value;
  }

  return sanitized;
}

/**
 * Format context for logging output
 * Pure function - deterministic output
 */
export function formatContext(context: LogContext): string {
  if (Object.keys(context).length === 0) {
    return '';
  }

  const pairs = Object.entries(context)
    .map(([key, value]) => {
      const formattedValue = typeof value === 'string' ? value : JSON.stringify(value);
      return `${key}=${formattedValue}`;
    })
    .join(' ');

  return ` ${pairs}`;
}

/**
 * Context-aware logger that merges AsyncLocalStorage context
 * Wraps a base logger with automatic context injection
 */
export class ContextLogger implements Logger {
  private storage: AsyncLocalStorage<LogContext>;

  constructor(
    private baseLogger: Logger,
    storage?: AsyncLocalStorage<LogContext>,
  ) {
    this.storage = storage || new AsyncLocalStorage<LogContext>();
  }

  /**
   * Get merged context from AsyncLocalStorage and provided context
   */
  private getMergedContext(context?: LogContext): LogContext | undefined {
    const asyncContext = this.storage.getStore() || {};
    const merged = context ? mergeContexts(asyncContext, context) : asyncContext;

    return Object.keys(merged).length > 0 ? merged : undefined;
  }

  trace(message: string, context?: LogContext): void {
    this.baseLogger.trace(message, this.getMergedContext(context));
  }

  debug(message: string, context?: LogContext): void {
    this.baseLogger.debug(message, this.getMergedContext(context));
  }

  info(message: string, context?: LogContext): void {
    this.baseLogger.info(message, this.getMergedContext(context));
  }

  warn(message: string, context?: LogContext): void {
    this.baseLogger.warn(message, this.getMergedContext(context));
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    this.baseLogger.error(message, error, this.getMergedContext(context));
  }

  fatal(message: string, error?: unknown, context?: LogContext): void {
    this.baseLogger.fatal(message, error, this.getMergedContext(context));
  }

  child(context: LogContext): Logger {
    // Create a child logger with additional context
    const childLogger = this.baseLogger.child(context);
    return new ContextLogger(childLogger, this.storage);
  }

  isLevelEnabled(level: LogLevel): boolean {
    return this.baseLogger.isLevelEnabled(level);
  }

  setLevel(level: LogLevel): void {
    this.baseLogger.setLevel(level);
  }

  getLevel(): LogLevel {
    return this.baseLogger.getLevel();
  }

  /**
   * Run a function with additional context
   * Context is available to all async operations within the function
   */
  async runWithContext<T>(context: LogContext, fn: () => T | Promise<T>): Promise<T> {
    const currentContext = this.storage.getStore() || {};
    const mergedContext = mergeContexts(currentContext, context);

    return this.storage.run(mergedContext, fn);
  }

  /**
   * Get the current async context
   * Useful for debugging and testing
   */
  getCurrentContext(): LogContext | undefined {
    return this.storage.getStore();
  }

  /**
   * Create a new correlation ID and add it to context
   */
  async withCorrelationId<T>(fn: () => T | Promise<T>, correlationId?: string): Promise<T> {
    const id = correlationId || generateCorrelationId();
    return this.runWithContext({ correlationId: id }, fn);
  }
}

/**
 * Factory function to create a context logger
 * Allows for easy dependency injection
 */
export function createContextLogger(
  baseLogger: Logger,
  storage?: AsyncLocalStorage<LogContext>,
): ContextLogger {
  return new ContextLogger(baseLogger, storage);
}
