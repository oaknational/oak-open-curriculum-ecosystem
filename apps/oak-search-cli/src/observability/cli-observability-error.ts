import type { InitialiseSentryError, ObservabilityConfigError } from '@oaknational/sentry-node';

export type CliObservabilityError = ObservabilityConfigError | InitialiseSentryError;

function describeConfigError(error: ObservabilityConfigError): string {
  switch (error.kind) {
    case 'invalid_sentry_mode':
      return `Invalid SENTRY_MODE value: ${error.value}`;
    case 'invalid_boolean_flag':
      return `Invalid ${error.name} value: ${error.value}`;
    case 'missing_sentry_dsn':
      return 'SENTRY_DSN is required when SENTRY_MODE=sentry';
    case 'invalid_sentry_dsn':
      return 'Invalid SENTRY_DSN value';
    case 'invalid_traces_sample_rate':
      return `Invalid SENTRY_TRACES_SAMPLE_RATE value: ${error.value}`;
    case 'send_default_pii_forbidden':
      return 'SENTRY_SEND_DEFAULT_PII=true is not allowed';
    case 'missing_release_for_live_mode':
      return 'A release value is required when SENTRY_MODE=sentry';
    default: {
      const exhaustive: never = error;
      throw new Error(`Unhandled config error kind: ${String(exhaustive)}`);
    }
  }
}

export function describeCliObservabilityError(error: CliObservabilityError): string {
  if (error.kind === 'sentry_sdk_init_failed') {
    return `Sentry SDK initialisation failed: ${error.message}`;
  }

  return describeConfigError(error);
}
