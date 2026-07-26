import type {
  Transport,
  TransportSendOptions,
} from '@modelcontextprotocol/sdk/shared/transport.js';
import type { JSONRPCMessage, MessageExtraInfo } from '@modelcontextprotocol/sdk/types.js';
import type { McpTransportObserver } from '@oaknational/observability';

import type { PostHogEventPolicyConfig } from './event-policy-contract.js';
import { reportSafely } from './event-policy-helpers.js';
import {
  createMcpTransportEventObserver,
  type McpTransportEventObserver,
} from './mcp-transport-event-observer.js';
import type {
  McpObserverClock,
  PostHogMcpCaptureClient,
} from './mcp-transport-observer-contract.js';

function snapshotConfig(config: PostHogEventPolicyConfig): PostHogEventPolicyConfig {
  return {
    release: { ...config.release },
    serverVersion: config.serverVersion,
    servedToolNames: [...config.servedToolNames],
    servedResourceNames: [...config.servedResourceNames],
    activeActorProjector: config.activeActorProjector,
    reportOperationalError: config.reportOperationalError,
  };
}

class ObservedMcpTransport implements Transport {
  private readonly delegate: Transport;
  private readonly eventObserver: McpTransportEventObserver;
  private readonly reportOperationalError: PostHogEventPolicyConfig['reportOperationalError'];
  private callbacksWired = false;

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: <T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo) => void;
  setProtocolVersion?: (version: string) => void;

  constructor(
    delegate: Transport,
    eventObserver: McpTransportEventObserver,
    reportOperationalError: PostHogEventPolicyConfig['reportOperationalError'],
  ) {
    this.delegate = delegate;
    this.eventObserver = eventObserver;
    this.reportOperationalError = reportOperationalError;
    if (delegate.setProtocolVersion !== undefined) {
      this.setProtocolVersion = (version) => {
        delegate.setProtocolVersion?.(version);
      };
    }
  }

  get sessionId(): string | undefined {
    return this.delegate.sessionId;
  }

  set sessionId(value: string | undefined) {
    this.delegate.sessionId = value;
  }

  start(): Promise<void> {
    this.wireCallbacks();
    return this.delegate.start();
  }

  private wireCallbacks(): void {
    if (this.callbacksWired) {
      return;
    }
    this.callbacksWired = true;
    const delegateOnClose = this.delegate.onclose;
    const delegateOnError = this.delegate.onerror;
    const delegateOnMessage = this.delegate.onmessage;
    this.delegate.onclose = () => {
      delegateOnClose?.();
      this.onclose?.();
    };
    this.delegate.onerror = (error) => {
      delegateOnError?.(error);
      this.onerror?.(error);
    };
    this.delegate.onmessage = (message, extra) => {
      delegateOnMessage?.(message, extra);
      try {
        this.eventObserver.observeRequest(message, extra);
      } catch {
        reportSafely(this.reportOperationalError, 'posthog_event_policy_failed');
      }
      this.onmessage?.(message, extra);
    };
  }

  close(): Promise<void> {
    return this.delegate.close();
  }

  send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    try {
      this.eventObserver.observeResponse(message);
    } catch {
      reportSafely(this.reportOperationalError, 'posthog_event_policy_failed');
    }
    return this.delegate.send(message, options);
  }
}

/**
 * Creates a privacy-bounded observer for the public MCP transport contract.
 *
 * @remarks Each concrete transport is decorated at most once. The decorator
 * stores only projected actor identity and closed operation facts while a
 * request is pending. It forwards every JSON-RPC message and send option by
 * exact reference, returns the delegate's exact promises, and isolates all
 * analytics failures from protocol behaviour.
 *
 * @param client - Official manual PostHog MCP capture surface.
 * @param config - Snapshotted identity, release, registry, and reporting policy.
 * @param now - Monotonic-enough millisecond clock; injectable for deterministic tests.
 * @returns A provider-neutral observer for MCP SDK transports.
 */
export function createPostHogMcpTransportObserver(
  client: PostHogMcpCaptureClient,
  config: PostHogEventPolicyConfig,
  now: McpObserverClock = Date.now,
): McpTransportObserver<Transport> {
  const observed = new WeakMap<Transport, Transport>();
  const snapshottedConfig = snapshotConfig(config);

  return {
    observe(transport) {
      const existing = observed.get(transport);
      if (existing !== undefined) {
        return existing;
      }

      const eventObserver = createMcpTransportEventObserver(client, snapshottedConfig, now);
      const observer = new ObservedMcpTransport(
        transport,
        eventObserver,
        snapshottedConfig.reportOperationalError,
      );
      observed.set(transport, observer);
      observed.set(observer, observer);
      return observer;
    },
  };
}

export type { PostHogMcpCaptureClient } from './mcp-transport-observer-contract.js';
