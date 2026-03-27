/**
 * Application bootstrap with structured error handling.
 *
 * Wraps the async startup sequence so that failures are logged
 * and the process exits cleanly rather than producing an
 * unhandled promise rejection.
 */

/**
 * Dependencies injected into {@link bootstrapApp} for testability.
 *
 * Production callers pass real implementations; integration tests
 * pass simple fakes (per ADR-078).
 */
import { normalizeError } from '@oaknational/logger';

export interface BootstrapAppDeps<T> {
  /** Async factory that creates and configures the application. */
  readonly startApp: () => Promise<T>;
  /** Logger for recording startup failures. */
  readonly logger: { error(message: string, error?: unknown): void };
  /** Process exit function — `process.exit` in production. */
  readonly exit: (code: number) => void;
}

/**
 * Bootstraps the application by calling `startApp` and handling failures.
 *
 * On success, returns the application instance. On failure, logs the error
 * via the injected logger, calls `exit(1)`, and re-throws the original
 * error. In production the `exit(1)` call terminates the process before
 * the re-throw executes; the throw exists only for type safety.
 *
 * @example
 * ```typescript
 * const app = await bootstrapApp({
 *   startApp: () => createApp({ runtimeConfig: config }),
 *   logger: bootstrapLog,
 *   exit: (code) => process.exit(code),
 * });
 * ```
 */
export async function bootstrapApp<T>(deps: BootstrapAppDeps<T>): Promise<T> {
  try {
    return await deps.startApp();
  } catch (startupError: unknown) {
    deps.logger.error('Application startup failed', normalizeError(startupError));
    deps.exit(1);
    throw startupError;
  }
}
