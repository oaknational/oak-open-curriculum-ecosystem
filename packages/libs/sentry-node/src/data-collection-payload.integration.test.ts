/**
 * Integration tests for what the Sentry SDK attaches under this package's
 * init options, before the redaction barrier runs.
 *
 * `data-collection.integration.test.ts` proves what the SDK resolves from the
 * options. These tests prove what two of its collectors then do with that:
 * the request data attached to an error event, and the attributes on the span
 * the SDK's MCP server wrapper records for a tool call. Each uses a real
 * `NodeClient` whose transport never sends, bound to a scope that ends with
 * the test, so nothing leaves the process and no global client is set.
 */
import {
  createTransport,
  defaultStackParser,
  NodeClient,
  requestDataIntegration,
  spanToJSON,
  withScope,
  wrapMcpServerWithSentry,
} from '@sentry/node';
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
  tracesSampleRate: 1,
  enableLogs: false,
  debug: false,
};

function createClient(): NodeClient {
  return new NodeClient({
    ...createSentryInitOptions(LIVE_CONFIG, { serviceName: 'oak-http' }),
    integrations: [],
    includeServerName: false,
    stackParser: defaultStackParser,
    transport: () =>
      createTransport({ recordDroppedEvent: () => undefined }, () => Promise.resolve({})),
  });
}

interface JsonRpcMessage {
  readonly jsonrpc: '2.0';
  readonly id: number;
  readonly method?: string;
  readonly params?: unknown;
  readonly result?: unknown;
}

interface FakeTransport {
  sessionId: string;
  onmessage: (message: JsonRpcMessage, extra: object) => void;
  send: (message: JsonRpcMessage) => Promise<void>;
  onclose: () => void;
  onerror: (error: Error) => void;
}

const TOOL_ARGUMENT = 'tool-argument-marker';
const TOOL_RESULT = 'tool-result-marker';

/**
 * Wrap a minimal MCP server, pass one `tools/call` request and its response
 * through the wrapped transport, and return every span the client saw end,
 * serialised.
 */
async function recordToolCallSpans(
  recording: Parameters<typeof wrapMcpServerWithSentry>[1],
): Promise<string[]> {
  const client = createClient();
  const spans: string[] = [];
  client.on('spanEnd', (span) => {
    spans.push(JSON.stringify(spanToJSON(span)));
  });

  await withScope(async (scope) => {
    scope.setClient(client);
    const transport: FakeTransport = {
      sessionId: 'session-1',
      onmessage: () => undefined,
      send: () => Promise.resolve(),
      onclose: () => undefined,
      onerror: () => undefined,
    };
    const server = {
      connect: (connected: FakeTransport) => Promise.resolve(connected.sessionId),
      tool: () => undefined,
      resource: () => undefined,
      prompt: () => undefined,
    };

    wrapMcpServerWithSentry(server, recording);
    await server.connect(transport);
    transport.onmessage(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'search', arguments: { query: TOOL_ARGUMENT } },
      },
      {},
    );
    await transport.send({
      jsonrpc: '2.0',
      id: 1,
      result: { content: [{ type: 'text', text: TOOL_RESULT }] },
    });
  });

  return spans;
}

describe('what the Sentry SDK attaches under the init options', () => {
  it('attaches this request data to an error event', async () => {
    const event = {
      sdkProcessingMetadata: {
        ipAddress: '203.0.113.9',
        normalizedRequest: {
          method: 'POST',
          url: 'https://example.test/mcp?page=2&x-user=u1',
          query_string: 'page=2&x-user=u1',
          headers: {
            cookie: 'theme=dark; consent=yes',
            authorization: 'Bearer token-value',
            'x-forwarded-for': '203.0.113.9',
            'x-real-ip': '203.0.113.9',
            'user-agent': 'client/1.0',
            via: '1.1 proxy',
          },
          data: '{"q":"body text"}',
        },
      },
    };

    const processed = await requestDataIntegration().processEvent?.(event, {}, createClient());

    // The whole of what the SDK attaches, so a change in what it collects
    // shows here. No user or IP address is attached, the IP headers are
    // dropped, and no cookie is attached: neither the `cookie` header nor a
    // parsed record. Everything else is attached as received: the redaction
    // barrier (ADR-160), which runs after this, is what removes credentials.
    expect(processed?.user).toBeUndefined();
    expect(processed?.request).toEqual({
      method: 'POST',
      url: 'https://example.test/mcp?page=2&x-user=u1',
      query_string: 'page=2&x-user=u1',
      headers: {
        authorization: 'Bearer token-value',
        'user-agent': 'client/1.0',
        via: '1.1 proxy',
      },
      data: '{"q":"body text"}',
    });
  });

  it('keeps tool arguments and results off the MCP server span, as the app calls the wrapper', async () => {
    // The app calls the wrapper with no recording options, so what is recorded
    // comes from the client's data collection.
    const spans = await recordToolCallSpans(undefined);

    expect(spans).toHaveLength(1);
    expect(spans[0]).toContain('"mcp.tool.name":"search"');
    expect(spans[0]).not.toContain(TOOL_ARGUMENT);
    expect(spans[0]).not.toContain(TOOL_RESULT);
  });

  it('would show tool arguments and results on that span if recording were on', async () => {
    // The control for the test above: the same exchange with recording asked
    // for puts both markers on the span, so their absence there is the data
    // collection option at work and not a gap in what this test can see.
    const spans = await recordToolCallSpans({ recordInputs: true, recordOutputs: true });

    expect(spans).toHaveLength(1);
    expect(spans[0]).toContain(TOOL_ARGUMENT);
    expect(spans[0]).toContain(TOOL_RESULT);
  });
});
