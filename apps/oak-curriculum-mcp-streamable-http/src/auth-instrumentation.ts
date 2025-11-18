import { startTimer } from '@oaknational/mcp-logger';
import type { Logger } from '@oaknational/mcp-logger';

export type AuthSetupStep =
  | 'auth.disabled.register'
  | 'clerkMiddleware.create'
  | 'clerkMiddleware.install'
  | 'registerPublicOAuthMetadata'
  | 'mcp.auth.register';

/**
 * Measures an authentication setup step and emits start/finish/error logs with duration metrics.
 *
 * @param log - Logger instance used for emitting diagnostic entries.
 * @param step - Identifier for the step being executed.
 * @param operation - Function performing the step.
 * @returns The result of the provided operation.
 */
export function measureAuthSetupStep<T>(log: Logger, step: AuthSetupStep, operation: () => T): T {
  log.debug('auth.bootstrap.step.start', { step });
  const timer = startTimer();
  try {
    const result = operation();
    const duration = timer.end();
    log.info('auth.bootstrap.step.finish', {
      step,
      duration: duration.formatted,
      durationMs: duration.ms,
    });
    return result;
  } catch (error) {
    const duration = timer.end();
    const errorAsError =
      error instanceof Error
        ? error
        : new Error(`Auth setup step "${step}" threw non-error value: ${String(error)}`);
    log.error('auth.bootstrap.step.error', errorAsError, {
      step,
      duration: duration.formatted,
      durationMs: duration.ms,
    });
    throw error;
  }
}
