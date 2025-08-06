/**
 * @fileoverview ChainedError implementation - preserving error history through the system
 * @module @oak-mcp-core/errors
 *
 * ChainedError maintains the complete history of errors as they propagate
 * through system layers, like signals through an organism's nervous system.
 * Each layer can add context without losing the original cause.
 *
 * Follows the TC39 Error Cause proposal for compatibility.
 */

/**
 * Error that preserves cause chain and accumulates context
 *
 * @example
 * ```typescript
 * try {
 *   await database.query(sql);
 * } catch (dbError) {
 *   throw new ChainedError(
 *     'Failed to fetch user',
 *     dbError,
 *     { userId: 123, operation: 'getUser' }
 *   );
 * }
 * ```
 */
export class ChainedError extends Error {
  /**
   * The error that caused this error
   * Following TC39 Error Cause proposal
   */
  public readonly cause?: unknown;

  /**
   * Context information for this error layer
   * Each layer adds its own context without overwriting previous layers
   */
  public readonly context?: Record<string, unknown>;

  /**
   * Creates a new ChainedError
   *
   * @param message - Human-readable error message for this layer
   * @param cause - The underlying error that caused this error
   * @param context - Additional context for debugging this error layer
   */
  constructor(message: string, cause?: unknown, context?: Record<string, unknown>) {
    super(message);

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ChainedError.prototype);

    // Set the name for better error identification
    this.name = 'ChainedError';

    // Preserve the cause following TC39 proposal
    this.cause = cause;

    // Store context for this error layer
    this.context = context;

    // Merge stack traces for complete error history
    if (cause && this.isErrorWithStack(cause) && cause.stack) {
      // Append the cause's stack to our stack
      const ownStack = this.stack ?? '';
      const causeStack = cause.stack;
      this.stack = `${ownStack}\nCaused by: ${causeStack}`;
    }
  }

  /**
   * Type guard to check if a value is an Error-like object with a stack
   */
  private isErrorWithStack(value: unknown): value is { stack?: string } {
    return (
      typeof value === 'object' && value !== null && ('stack' in value || value instanceof Error)
    );
  }

  /**
   * Retrieves the root cause of the error chain
   * Traverses down the cause chain to find the original error
   *
   * @returns The root cause error
   */
  getRootCause(): unknown {
    let current: unknown = this;

    while (current instanceof ChainedError && current.cause !== undefined) {
      current = current.cause;
    }

    return current;
  }

  /**
   * Collects all context objects from the error chain
   * Returns contexts from top to bottom (most recent first)
   *
   * @returns Array of context objects from each error layer
   */
  getAllContext(): Record<string, unknown>[] {
    const contexts: Record<string, unknown>[] = [];
    let current: unknown = this;

    while (current instanceof ChainedError) {
      if (current.context) {
        contexts.push(current.context);
      }
      current = current.cause;
    }

    return contexts;
  }

  /**
   * Creates a string representation of the entire error chain
   * Useful for logging the complete error history
   *
   * @returns String representation of the error chain
   */
  toChainString(): string {
    const parts: string[] = [];
    let current: unknown = this;
    let depth = 0;

    while (current) {
      const indent = '  '.repeat(depth);

      if (current instanceof Error) {
        parts.push(`${indent}${current.name}: ${current.message}`);

        if (current instanceof ChainedError && current.context) {
          parts.push(`${indent}  Context: ${JSON.stringify(current.context)}`);
        }
      } else if (typeof current === 'string') {
        parts.push(`${indent}Error: ${current}`);
      } else {
        parts.push(`${indent}Unknown error: ${JSON.stringify(current)}`);
      }

      if (current instanceof ChainedError) {
        current = current.cause;
        depth++;
      } else {
        break;
      }
    }

    return parts.join('\n');
  }
}
