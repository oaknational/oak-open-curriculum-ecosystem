/**
 * Provider-neutral delegation bridge from Sentry adapter to HttpObservability.
 *
 * Maps adapter-specific types (errors, user, context) to provider-neutral
 * equivalents. This boundary ensures app-layer code never imports adapter
 * types directly through the HttpObservability interface.
 */

import { normalizeError, type LogContextInput } from '@oaknational/logger';
import { err, type Result } from '@oaknational/result';
import {
  sanitiseObject,
  type ObservabilityCloseError,
  type ObservabilityContextPayload,
  type ObservabilityFlushError,
  type ObservabilityUser,
} from '@oaknational/observability';
import { mapCloseError, mapFlushError, type SentryNodeRuntime } from '@oaknational/sentry-node';

/** Sentry-delegating methods shaped for HttpObservability. */
interface SentryObservabilityDelegates {
  captureHandledError(error: unknown, context?: LogContextInput): void;
  setUser(user: ObservabilityUser | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: ObservabilityContextPayload | null): void;
  flush(timeoutMs?: number): Promise<Result<void, ObservabilityFlushError>>;
  close(timeoutMs?: number): Promise<Result<void, ObservabilityCloseError>>;
}

/**
 * Create the Sentry-delegating methods for the HttpObservability object.
 *
 * @remarks All delegation happens through `SentryNodeRuntime` — the
 * adapter boundary. Error types are mapped from Sentry-specific to
 * provider-neutral at this seam.
 */
export function createSentryDelegates(
  sentryRuntime: SentryNodeRuntime,
): SentryObservabilityDelegates {
  return {
    captureHandledError(error, captureContext): void {
      sentryRuntime.captureHandledError(
        normalizeError(error),
        sanitiseObject(captureContext) ?? undefined,
      );
    },
    setUser(user): void {
      sentryRuntime.setUser(user);
    },
    setTag(key, value): void {
      sentryRuntime.setTag(key, value);
    },
    setContext(name, ctx): void {
      sentryRuntime.setContext(name, ctx);
    },
    async flush(timeoutMs): Promise<Result<void, ObservabilityFlushError>> {
      const result = await sentryRuntime.flush(timeoutMs);
      return result.ok ? result : err(mapFlushError(result.error));
    },
    async close(timeoutMs): Promise<Result<void, ObservabilityCloseError>> {
      const result = await sentryRuntime.close(timeoutMs);
      return result.ok ? result : err(mapCloseError(result.error));
    },
  };
}
