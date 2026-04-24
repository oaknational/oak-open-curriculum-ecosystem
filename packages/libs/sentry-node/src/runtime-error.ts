import { buildNormalizedError, type LogContext, type NormalizedError } from '@oaknational/logger';
import {
  redactJsonObject,
  redactText,
  type ObservabilityCloseError,
  type ObservabilityFlushError,
} from '@oaknational/observability';
import type { ObservabilityConfigError, SentryCloseError, SentryFlushError } from './types.js';

type ValueConfigError = Extract<
  ObservabilityConfigError,
  | { readonly kind: 'invalid_sentry_mode' }
  | { readonly kind: 'invalid_boolean_flag' }
  | { readonly kind: 'invalid_app_version' }
  | { readonly kind: 'invalid_traces_sample_rate' }
  | { readonly kind: 'invalid_git_sha' }
  | { readonly kind: 'invalid_release_override' }
>;

/**
 * Describe an observability configuration error as a human-readable message.
 *
 * @remarks This pure function maps every `ObservabilityConfigError` kind to a
 * user-facing description. It lives in the adapter library because the error
 * discriminated union is defined here — consumers should not duplicate the
 * switch. Exhaustive switch ensures new error kinds produce a compile error.
 */
function isValueConfigError(error: ObservabilityConfigError): error is ValueConfigError {
  switch (error.kind) {
    case 'invalid_sentry_mode':
    case 'invalid_boolean_flag':
    case 'invalid_app_version':
    case 'invalid_traces_sample_rate':
    case 'invalid_git_sha':
    case 'invalid_release_override':
      return true;
    default:
      return false;
  }
}

function describeValueConfigError(error: ValueConfigError): string {
  switch (error.kind) {
    case 'invalid_sentry_mode':
      return `Invalid SENTRY_MODE value: ${error.value}`;
    case 'invalid_boolean_flag':
      return `Invalid ${error.name} value: ${error.value}`;
    case 'invalid_app_version':
      return `Invalid application version value: ${error.value}`;
    case 'invalid_traces_sample_rate':
      return `Invalid SENTRY_TRACES_SAMPLE_RATE value: ${error.value}`;
    case 'invalid_git_sha':
      return `Invalid git SHA value: ${error.value}`;
    case 'invalid_release_override':
      return `Invalid SENTRY_RELEASE_OVERRIDE value: ${error.value}`;
    default: {
      const exhaustive: never = error;
      throw new Error(`Unhandled value config error kind: ${String(exhaustive)}`);
    }
  }
}

type NonValueConfigError = Exclude<ObservabilityConfigError, ValueConfigError>;

function describeNonValueConfigError(error: NonValueConfigError): string {
  switch (error.kind) {
    case 'missing_app_version':
      return 'Application version is required for Sentry release resolution';
    case 'missing_git_sha':
      return 'Git SHA is required for Sentry release resolution but VERCEL_GIT_COMMIT_SHA is not set';
    case 'missing_branch_url_in_preview':
      return 'VERCEL_BRANCH_URL is required for preview-shape release resolution';
    case 'missing_sentry_dsn':
      return 'SENTRY_DSN is required when SENTRY_MODE=sentry';
    case 'invalid_sentry_dsn':
      return 'Invalid SENTRY_DSN value';
    case 'send_default_pii_forbidden':
      return 'SENTRY_SEND_DEFAULT_PII=true is not allowed';
    case 'invalid_release_registration_override':
      return 'SENTRY_RELEASE_REGISTRATION_OVERRIDE=1 and SENTRY_RELEASE_OVERRIDE must be set together (ADR-163 §4)';
    default: {
      const exhaustive: never = error;
      throw new Error(`Unhandled config error kind: ${String(exhaustive)}`);
    }
  }
}

export function describeConfigError(error: ObservabilityConfigError): string {
  return isValueConfigError(error)
    ? describeValueConfigError(error)
    : describeNonValueConfigError(error);
}

export function redactLogContext(context: LogContext | undefined): LogContext | undefined {
  return context ? redactJsonObject(context) : undefined;
}

export function redactNormalizedError(error: NormalizedError): NormalizedError {
  return buildNormalizedError({
    name: redactText(error.name),
    message: redactText(error.message),
    stack: error.stack ? redactText(error.stack) : undefined,
    cause: error.cause ? redactNormalizedError(error.cause) : undefined,
    metadata: redactLogContext(error.metadata),
  });
}

export function toNativeError(error: NormalizedError): Error {
  const native = new Error(
    error.message,
    error.cause ? { cause: toNativeError(error.cause) } : undefined,
  );

  native.name = error.name;

  if (error.stack) {
    native.stack = error.stack;
  }

  return native;
}

/**
 * Map a Sentry-specific flush error to a provider-neutral equivalent.
 *
 * @remarks Lives in the adapter library because it knows both sides
 * of the boundary: `SentryFlushError` (adapter) and
 * `ObservabilityFlushError` (core). Consumers import this mapper
 * rather than duplicating the switch in each app.
 */
export function mapFlushError(error: SentryFlushError): ObservabilityFlushError {
  switch (error.kind) {
    case 'sentry_flush_timeout':
      return { kind: 'observability_flush_timeout', timeoutMs: error.timeoutMs };
    case 'sentry_flush_failed':
      return { kind: 'observability_flush_failed', message: error.message };
  }
  const exhaustive: never = error;
  throw new Error(`Unhandled flush error kind: ${String(exhaustive)}`);
}

/**
 * Map a Sentry-specific close error to a provider-neutral equivalent.
 *
 * @remarks Lives in the adapter library because it knows both sides
 * of the boundary: `SentryCloseError` (adapter) and
 * `ObservabilityCloseError` (core). Consumers import this mapper
 * rather than duplicating the switch in each app.
 */
export function mapCloseError(error: SentryCloseError): ObservabilityCloseError {
  switch (error.kind) {
    case 'sentry_close_timeout':
      return { kind: 'observability_close_timeout', timeoutMs: error.timeoutMs };
    case 'sentry_close_failed':
      return { kind: 'observability_close_failed', message: error.message };
  }
  const exhaustive: never = error;
  throw new Error(`Unhandled close error kind: ${String(exhaustive)}`);
}
