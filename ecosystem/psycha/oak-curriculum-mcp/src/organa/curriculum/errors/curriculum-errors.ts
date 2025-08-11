/**
 * Custom error classes for curriculum operations
 */

/**
 * Error thrown when a curriculum operation fails
 */
export class CurriculumOperationError extends Error {
  /**
   * Create a new curriculum operation error
   */
  constructor(
    operation: string,
    cause: unknown,
    public readonly context?: Record<string, unknown>,
  ) {
    const causeMessage = cause instanceof Error ? cause.message : String(cause);
    super(`Curriculum ${operation} failed: ${causeMessage}`);
    this.name = 'CurriculumOperationError';

    // Preserve the original error if it's an Error instance
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}
