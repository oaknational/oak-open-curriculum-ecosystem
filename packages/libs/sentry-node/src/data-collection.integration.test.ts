/**
 * Integration test for what the init options tell the Sentry SDK to collect.
 *
 * The options are handed to a real `NodeClient` and read back through the
 * SDK's own resolver, so this proves the collection the vendor will apply and
 * not only the literal this package writes. The transport never sends and no
 * integration is installed, so nothing leaves the process. Vendor code and
 * this package's options work together here, which is why this is an
 * integration test.
 */
import { createTransport, defaultStackParser, NodeClient } from '@sentry/node';
import { describe, expect, it } from 'vitest';
import { createSentryInitOptions } from './runtime-sdk.js';
import type { SentryLiveConfig } from './types.js';

const LIVE_CONFIG: SentryLiveConfig = {
  mode: 'sentry',
  dsn: 'https://key@example.ingest.sentry.io/123',
  environment: 'production',
  environmentSource: 'SENTRY_ENVIRONMENT_OVERRIDE',
  release: 'release-123',
  releaseSource: 'SENTRY_RELEASE_OVERRIDE',
  tracesSampleRate: 0.5,
  enableLogs: false,
  debug: false,
};

const IDENTIFYING_KEY_SNIPPETS = ['forwarded', '-ip', 'remote-', 'via', '-user'];

describe('the data collection the Sentry SDK resolves from the init options', () => {
  it('collects no user information, bodies, AI payloads or database values', () => {
    const client = new NodeClient({
      ...createSentryInitOptions(LIVE_CONFIG, { serviceName: 'oak-http' }),
      integrations: [],
      // Stops the client reading the host name and SENTRY_NAME from the
      // environment. `enableLogs` stays false in the fixture for the same
      // reason: with it on, the client registers a process exit listener.
      includeServerName: false,
      stackParser: defaultStackParser,
      transport: () =>
        createTransport({ recordDroppedEvent: () => undefined }, () => Promise.resolve({})),
    });

    // Full equality on purpose: a category the SDK adds later appears here as
    // an unexpected key instead of defaulting to "collect".
    expect(client.getDataCollectionOptions()).toEqual({
      userInfo: false,
      cookies: { deny: IDENTIFYING_KEY_SNIPPETS },
      httpHeaders: {
        request: { deny: IDENTIFYING_KEY_SNIPPETS },
        response: { deny: IDENTIFYING_KEY_SNIPPETS },
      },
      httpBodies: [],
      urlQueryParams: { deny: IDENTIFYING_KEY_SNIPPETS },
      graphQL: { document: true, variables: true },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      stackFrameVariables: true,
      frameContextLines: 7,
    });
  });
});
