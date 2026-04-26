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

/**
 * Default timeout used by {@link SentryNodeRuntime.flush} and
 * {@link SentryNodeRuntime.close} when the caller does not pass an
 * explicit `timeoutMs`.
 *
 * @remarks
 * **Lambda freeze-and-resume trade-off.** On Vercel's Node.js runtime
 * the function is frozen after handler return. In-flight Sentry
 * events that have not yet been transmitted are buffered; under
 * bursty error scenarios the SDK can hold multiple events in the
 * queue when freeze begins. A short flush window (the previous
 * 2_000ms value) raised the risk of dropped events; a longer window
 * extends the Lambda billing-time tail by the corresponding amount.
 *
 * **Empirical context (2026-04-26 L-IMM Sub-item 3 hardening)**: the
 * Sentry validation walk produced single-error captures cleanly at
 * 2s, but bursty error patterns are known to lose events under
 * freeze; raising to 5s biases for capture completeness over a small
 * billing-tail extension. Existing flush-timing contract tests in
 * `runtime-sinks.unit.test.ts` cover the constant indirectly via
 * timeout behaviour and still pass.
 */
export const DEFAULT_SENTRY_FLUSH_TIMEOUT_MS = 5_000;

/**
 * Targets for outbound trace propagation (`sentry-trace` + `baggage`
 * headers added to outbound HTTP calls by `httpIntegration`).
 *
 * @remarks Empty by default — the MCP HTTP server's only outbound
 * upstreams (Clerk, third parties) are external trust boundaries
 * where leaking trace context is undesirable on compliance and
 * downstream-cost grounds.
 *
 * **Future state (owner direction, 2026-04-26)**: this list will be
 * extended once the Search service (`apps/oak-search-cli` /
 * `packages/sdks/oak-search-sdk` callers) is also wired to the same
 * Sentry org. At that point internal Oak service hostnames go in this
 * list so trace IDs flow MCP server ↔ search service while still
 * NOT propagating to Clerk / external third parties.
 *
 * Internal trace correlation WITHIN a single Lambda is unaffected by
 * this list and works today — proven by the four-span POST /mcp
 * trace captured during 2026-04-26 Sentry validation (HTTP server →
 * Clerk verify outbound → MCP server span → Oak custom span all
 * under the same trace ID).
 */
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
