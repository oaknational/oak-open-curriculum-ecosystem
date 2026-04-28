import {
  describeConfigError,
  type InitialiseSentryError,
  type ObservabilityConfigError,
} from '@oaknational/sentry-node';

export type CliObservabilityError = ObservabilityConfigError | InitialiseSentryError;

/**
 * Describe a CLI observability error as a human-readable message.
 *
 * @remarks Delegates config error descriptions to the shared
 * `describeConfigError` in `@oaknational/sentry-node`. Only the
 * `sentry_sdk_init_failed` case is handled locally because it is
 * specific to the initialisation lifecycle.
 */
export function describeCliObservabilityError(error: CliObservabilityError): string {
  if (error.kind === 'sentry_sdk_init_failed') {
    return `Sentry SDK initialisation failed: ${error.message}`;
  }

  return describeConfigError(error);
}
