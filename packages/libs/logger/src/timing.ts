/**
 * Timing utilities for measuring operation duration
 *
 * @remarks
 * Uses performance.now() which is available in both browser and Node.js contexts.
 * Provides sub-millisecond precision for accurate timing measurements.
 *
 * @example
 * ```typescript
 * import { startTimer } from '@oaknational/mcp-logger';
 *
 * const timer = startTimer();
 *
 * // Do some work...
 *
 * const duration = timer.end();
 * console.log(`Operation took ${duration.formatted}`);
 * console.log(`Precise duration: ${duration.ms}ms`);
 * ```
 */

/**
 * Represents the duration of a timed operation
 */
export interface Duration {
  /**
   * Duration in milliseconds with sub-millisecond precision
   */
  readonly ms: number;

  /**
   * Human-readable formatted duration string
   * - Less than 1 second: "123ms"
   * - 1 second or more: "1.23s"
   */
  readonly formatted: string;
}

/**
 * A timer for measuring operation duration
 */
export interface Timer {
  /**
   * Get the elapsed time in milliseconds since the timer was started
   * @returns Elapsed milliseconds with sub-millisecond precision
   */
  elapsed(): number;

  /**
   * End the timer and get the final duration
   * @returns Duration object with precise ms value and formatted string
   */
  end(): Duration;
}

/**
 * Start a new timer to measure operation duration
 *
 * @returns Timer instance with elapsed() and end() methods
 *
 * @example
 * ```typescript
 * const timer = startTimer();
 *
 * // Check elapsed time without stopping
 * console.log(`Elapsed: ${timer.elapsed()}ms`);
 *
 * // Get final duration
 * const duration = timer.end();
 * console.log(duration.formatted); // "1.23s"
 * ```
 */
export function startTimer(): Timer {
  const startTime = performance.now();

  return {
    elapsed: () => performance.now() - startTime,
    end: () => {
      const ms = performance.now() - startTime;
      return {
        ms,
        formatted: formatDuration(ms),
      };
    },
  };
}

/**
 * Format a duration in milliseconds to a human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted string: "123ms" or "1.23s"
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms).toString()}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}
