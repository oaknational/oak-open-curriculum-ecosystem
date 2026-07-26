import type { McpServerInstrumenter } from '@oaknational/observability';
import { instrument as officialInstrumentMcpServer, type MCPAnalyticsOptions } from '@posthog/mcp';
import { PostHog } from 'posthog-node';

import { createPostHogEventPolicies, type PostHogEventPolicyConfig } from './event-policy.js';
import { reportSafely } from './event-policy-helpers.js';

type InstrumentMcpServer<TClient> = (
  server: unknown,
  client: TClient,
  options: MCPAnalyticsOptions,
) => unknown;

function defaultInstrumentMcpServer<TClient>(
  reportOperationalError: PostHogEventPolicyConfig['reportOperationalError'],
): InstrumentMcpServer<TClient> {
  return (server, client, options) => {
    if (!(client instanceof PostHog)) {
      reportSafely(reportOperationalError, 'posthog_event_policy_failed');
      return;
    }
    officialInstrumentMcpServer(server, client, options);
  };
}

export function createPostHogMcpServerInstrumenter<TServer extends WeakKey, TClient = PostHog>(
  client: TClient,
  config: PostHogEventPolicyConfig,
  instrumentMcpServer: InstrumentMcpServer<TClient> = defaultInstrumentMcpServer(
    config.reportOperationalError,
  ),
): McpServerInstrumenter<TServer> {
  const policies = createPostHogEventPolicies(config);
  const attemptedServers = new WeakSet<TServer>();
  const reportOperationalError = config.reportOperationalError;

  return {
    instrument(server) {
      if (attemptedServers.has(server)) {
        return;
      }
      attemptedServers.add(server);

      try {
        instrumentMcpServer(server, client, {
          reportMissing: false,
          enableConversationId: false,
          enableExceptionAutocapture: false,
          context: false,
          beforeSend: policies.synchronousMcpEventPolicy,
          eventProperties: policies.projectVerifiedIdentityAndRelease,
        });
      } catch {
        reportSafely(reportOperationalError, 'posthog_event_policy_failed');
      }
    },
  };
}
