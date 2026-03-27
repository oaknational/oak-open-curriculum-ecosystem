import { captureException, captureMessage, flush, init, type NodeOptions } from '@sentry/node';
import type { SentryLiveConfig, SentryNodeSdk } from './types.js';
import {
  redactSentryEvent,
  redactSentryLog,
  redactSentrySpan,
  redactSentryTransaction,
} from './runtime-redaction.js';

export const DEFAULT_SENTRY_FLUSH_TIMEOUT_MS = 2_000;
export const DEFAULT_TRACE_PROPAGATION_TARGETS: readonly string[] = Object.freeze([]);

function createSentryHooks(): Pick<
  NodeOptions,
  'beforeSend' | 'beforeSendLog' | 'beforeSendSpan' | 'beforeSendTransaction'
> {
  return {
    beforeSend(event) {
      return redactSentryEvent(event);
    },
    beforeSendLog(log) {
      return redactSentryLog(log);
    },
    beforeSendSpan(span) {
      return redactSentrySpan(span);
    },
    beforeSendTransaction(event) {
      return redactSentryTransaction(event);
    },
  };
}

export function createSentryInitOptions(
  config: SentryLiveConfig,
  options: { readonly serviceName: string },
): NodeOptions {
  return {
    dsn: config.dsn,
    environment: config.environment,
    release: config.release,
    tracesSampleRate: config.tracesSampleRate,
    enableLogs: config.enableLogs,
    sendDefaultPii: config.sendDefaultPii,
    debug: config.debug,
    tracePropagationTargets: [...DEFAULT_TRACE_PROPAGATION_TARGETS],
    initialScope: {
      tags: {
        service: options.serviceName,
        environment: config.environment,
        release: config.release,
      },
    },
    ...createSentryHooks(),
  };
}

export const defaultSentryNodeSdk: SentryNodeSdk = {
  init(options): void {
    init(options);
  },
  captureException(error, context): void {
    captureException(error, context);
  },
  captureMessage(message, context): void {
    captureMessage(message, context);
  },
  flush(timeoutMs): Promise<boolean> {
    return flush(timeoutMs);
  },
};
