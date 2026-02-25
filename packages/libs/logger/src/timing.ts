/**
 * Timing utilities for measuring operation duration
 *
 * @remarks
 * Uses performance.now() which is available in both browser and Node.js contexts.
 * Provides sub-millisecond precision for accurate timing measurements.
 *
 * @example
 * ```typescript
 * import { startTimer } from '@oaknational/logger';
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
 * Describes the completed duration of an individual phase within a larger async operation.
 */
export interface PhaseResult {
  /**
   * Logical name of the phase that was measured (for example `setupBaseMiddleware`).
   */
  readonly name: string;

  /**
   * Duration information for the phase.
   */
  readonly duration: Duration;
}

/**
 * Handle that controls timing for a single phase within a {@link PhasedTimer}.
 */
export interface PhaseHandle {
  /**
   * Returns the currently elapsed time for the phase.
   *
   * @returns Elapsed milliseconds since the phase started.
   */
  elapsed(): number;

  /**
   * Ends the phase and returns the measured {@link PhaseResult}.
   *
   * @returns Phase duration result.
   *
   * @throws Error if the phase has already ended.
   */
  end(): PhaseResult;
}

/**
 * Timer that supports measuring multiple sequential phases within a broader async workflow.
 */
export interface PhasedTimer {
  /**
   * Starts timing for a named phase.
   *
   * @param name - Human-readable identifier for the phase being measured.
   * @returns Handle that exposes {@link PhaseHandle.end | end} and {@link PhaseHandle.elapsed | elapsed} operations.
   *
   * @throws Error if a previous phase is still active.
   */
  startPhase(name: string): PhaseHandle;

  /**
   * Ends the overall timer and returns the cumulative duration across all phases.
   *
   * @returns Total {@link Duration} since the timer was created.
   */
  end(): Duration;
}

/**
 * Create a timer capable of capturing sequential phase durations for long-lived async operations
 *
 * @returns {@link PhasedTimer} instance controlling the measurement lifecycle.
 *
 * @example
 * ```typescript
 * const timer = createPhasedTimer();
 *
 * const phase = timer.startPhase('setup');
 * // do work...
 * const result = phase.end();
 *
 * const total = timer.end();
 * ```
 */
export function createPhasedTimer(): PhasedTimer {
  const totalTimer = startTimer();
  let activePhase: InternalPhaseHandle | undefined;

  return {
    startPhase: (name: string): PhaseHandle => {
      if (activePhase !== undefined) {
        throw new Error(`Phase "${activePhase.name}" is still in progress`);
      }

      const handle: InternalPhaseHandle = createPhaseHandle(name, () => {
        activePhase = undefined;
      });
      activePhase = handle;
      return handle;
    },
    end: () => totalTimer.end(),
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

interface InternalPhaseHandle extends PhaseHandle {
  readonly name: string;
}

function createPhaseHandle(name: string, onComplete: () => void): InternalPhaseHandle {
  const startTime = performance.now();
  let completedDuration: Duration | undefined;

  return {
    name,
    elapsed: () => {
      if (completedDuration !== undefined) {
        return completedDuration.ms;
      }
      return performance.now() - startTime;
    },
    end: () => {
      if (completedDuration !== undefined) {
        throw new Error(`Phase "${name}" has already ended`);
      }
      const ms = performance.now() - startTime;
      completedDuration = {
        ms,
        formatted: formatDuration(ms),
      };
      onComplete();
      return {
        name,
        duration: completedDuration,
      };
    },
  };
}
