import {
  captureException,
  captureMessage,
  close,
  flush,
  init,
  logger,
  setContext as sentrySetContext,
  setTag as sentrySetTag,
  setUser as sentrySetUser,
  type NodeOptions,
} from '@sentry/node';
import type {
  SentryContextPayload,
  SentryLiveConfig,
  SentryNodeSdk,
  SentryPostRedactionHooks,
  SentryUser,
} from './types.js';
import {
  redactSentryBreadcrumb,
  redactSentryEvent,
  redactSentryLog,
  redactSentrySpan,
  redactSentryTransaction,
} from './runtime-redaction.js';

export const DEFAULT_SENTRY_FLUSH_TIMEOUT_MS = 2_000;
export const DEFAULT_TRACE_PROPAGATION_TARGETS: readonly string[] = Object.freeze([]);

/**
 * The shape of the redaction hook-set composed into `NodeOptions`.
 *
 * @remarks Exported so ADR-160 conformance tests can constrain bypass
 * helpers to the exact same key-set the adapter wires — any new hook
 * wired in {@link createSentryHooks} without a matching test-registry
 * update is caught at `pnpm type-check` rather than at runtime.
 */
export type SentryRedactionHooks = Pick<
  NodeOptions,
  'beforeBreadcrumb' | 'beforeSend' | 'beforeSendLog' | 'beforeSendSpan' | 'beforeSendTransaction'
>;

function createSentryHooks(postRedactionHooks?: SentryPostRedactionHooks): SentryRedactionHooks {
  return {
    beforeSend(event, hint) {
      const redactedEvent = redactSentryEvent(event);
      return postRedactionHooks?.beforeSend
        ? postRedactionHooks.beforeSend(redactedEvent, hint)
        : redactedEvent;
    },
    beforeBreadcrumb(breadcrumb, hint) {
      const redactedBreadcrumb = redactSentryBreadcrumb(breadcrumb);
      return postRedactionHooks?.beforeBreadcrumb
        ? postRedactionHooks.beforeBreadcrumb(redactedBreadcrumb, hint)
        : redactedBreadcrumb;
    },
    beforeSendLog(log) {
      return redactSentryLog(log);
    },
    beforeSendSpan(span) {
      return redactSentrySpan(span);
    },
    beforeSendTransaction(event, hint) {
      const redactedEvent = redactSentryTransaction(event);
      return postRedactionHooks?.beforeSendTransaction
        ? postRedactionHooks.beforeSendTransaction(redactedEvent, hint)
        : redactedEvent;
    },
  };
}

export function createSentryInitOptions(
  config: SentryLiveConfig,
  options: { readonly serviceName: string; readonly postRedactionHooks?: SentryPostRedactionHooks },
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
        ...(config.gitSha ? { 'git.commit.sha': config.gitSha } : {}),
      },
    },
    ...createSentryHooks(options.postRedactionHooks),
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
  close(timeoutMs): Promise<boolean> {
    return close(timeoutMs);
  },
  setUser(user: SentryUser | null): void {
    sentrySetUser(user);
  },
  setTag(key: string, value: string): void {
    sentrySetTag(key, value);
  },
  setContext(name: string, context: SentryContextPayload | null): void {
    sentrySetContext(name, context);
  },
  logger,
};
