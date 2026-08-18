import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  SUPPORTED_PROTOCOL_VERSIONS,
  type JSONRPCMessage,
  type MessageExtraInfo,
} from '@modelcontextprotocol/sdk/types.js';
import type { ResolvedRelease } from '@oaknational/build-metadata';
import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { createPostHogEventPolicies, type PostHogEventPolicyConfig } from './event-policy.js';
import {
  createPostHogMcpTransportObserver,
  type PostHogMcpCaptureClient,
} from './mcp-transport-observer.js';

/**
 * MCP-594: proves a named client survives from the transport into the event that
 * actually leaves the process — through the observer's projection AND through the
 * final reconstruction barrier, which is the gate that decides what PostHog ever
 * sees. Asserting only on the capture record would pass while the barrier
 * silently dropped the property, which is the defect class this cures.
 */
const ACTOR_ID = 'raw-verified-actor';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];
const CAPTURE_TIMESTAMP = new Date('2026-08-13T12:00:00.000Z');
const EVENT_UUID_V7 = '0199e8f0-8abc-7def-8abc-123456789abc';

/** User-Agents verified first-hand in Oak's inbound traffic, 7 days to 2026-08-13. */
const OBSERVED_USER_AGENTS = {
  claudeAi: 'Claude-User',
  claudeCode: 'claude-code/2.1.226 (cli)',
  codex: 'codex-mcp-client/0.147.0-alpha.6.5',
  unidentifiable: 'python-httpx/0.28.1',
} as const;

const AUTH_EXTRA: MessageExtraInfo = {
  authInfo: {
    token: 'raw-token',
    clientId: 'raw-client',
    scopes: ['raw-scope'],
    extra: { userId: ACTOR_ID },
  },
};

class RecordingTransport implements Transport {
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: <T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo) => void;

  start(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }

  send(): Promise<void> {
    return Promise.resolve();
  }

  emit<T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo): void {
    this.onmessage?.(message, extra);
  }
}

function createConfig(): PostHogEventPolicyConfig {
  const projector: ActivePostHogActorProjector = {
    project: () =>
      ok({ environment: RELEASE.environment, keyId: '2026-07', distinctId: DISTINCT_ID }),
  };
  return {
    release: RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames: ['get-lessons-summary'],
    servedResourceNames: [],
    activeActorProjector: projector,
    reportOperationalError: () => undefined,
  };
}

function createSubject() {
  const toolCallCaptures: Parameters<PostHogMcpCaptureClient['captureToolCall']>[0][] = [];
  const toolsListCaptures: Parameters<PostHogMcpCaptureClient['captureToolsList']>[0][] = [];
  const initializeCaptures: Parameters<PostHogMcpCaptureClient['captureInitialize']>[0][] = [];
  const client: PostHogMcpCaptureClient = {
    captureInitialize: (capture) => initializeCaptures.push(capture),
    captureToolsList: (capture) => toolsListCaptures.push(capture),
    captureToolCall: (capture) => toolCallCaptures.push(capture),
  };
  const delegate = new RecordingTransport();
  const observer = createPostHogMcpTransportObserver(client, createConfig(), () => 0);
  const transport = observer.observe(delegate);
  void transport.start();
  return { delegate, initializeCaptures, toolCallCaptures, toolsListCaptures, transport };
}

type Subject = ReturnType<typeof createSubject>;

function extraWithUserAgent(userAgent: string): MessageExtraInfo {
  return { ...AUTH_EXTRA, requestInfo: { headers: { 'user-agent': userAgent } } };
}

/**
 * A tool call is the grain that matters: it is the one MCP-574 needs broken down
 * by client, and the one the handshake's `clientInfo` provably cannot reach under
 * ADR-112's per-request transport.
 */
function emitToolCall(subject: Subject, extra: MessageExtraInfo, isError = false): void {
  subject.delegate.emit(
    { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'get-lessons-summary' } },
    extra,
  );
  void subject.transport.send({
    jsonrpc: '2.0',
    id: 7,
    result: { content: [], ...(isError ? { isError: true } : {}) },
  });
}

/**
 * Pushes a tool-call event through the barrier that decides what leaves the
 * process.
 *
 * @remarks The vendor client turns a capture record's `toolName` / `durationMs` /
 * `isError` fields into `$mcp_*` properties, so those are stated here explicitly
 * rather than derived from the capture — reproducing the vendor's mapping in a
 * test would make the test a fake of it. The genuine transport-to-wire path
 * through the real vendor client is proven in
 * `posthog-final-wire.integration.test.ts`; this helper isolates the barrier's
 * own treatment of the product category.
 */
function throughFinalPolicy(properties: Record<string, unknown>) {
  return createPostHogEventPolicies(createConfig()).finalOakEventPolicy({
    distinctId: DISTINCT_ID,
    event: '$mcp_tool_call',
    properties: {
      $mcp_tool_name: 'get-lessons-summary',
      $mcp_duration_ms: 4,
      $mcp_is_error: false,
      ...properties,
    },
    timestamp: CAPTURE_TIMESTAMP,
    uuid: EVENT_UUID_V7,
  });
}

describe('createPostHogMcpTransportObserver client product', () => {
  it.each([
    ['Claude.ai', OBSERVED_USER_AGENTS.claudeAi, 'claude_ai'],
    ['Claude Code', OBSERVED_USER_AGENTS.claudeCode, 'claude_code'],
    ['Codex', OBSERVED_USER_AGENTS.codex, 'codex'],
    ['an unidentifiable client', OBSERVED_USER_AGENTS.unidentifiable, 'other'],
  ])(
    'carries %s from the transport onto the emitted tool-call event',
    (_label, userAgent, expected) => {
      const subject = createSubject();

      emitToolCall(subject, extraWithUserAgent(userAgent));

      const capture = subject.toolCallCaptures[0];
      expect(capture?.properties.oak_client_product).toBe(expected);
      expect(throughFinalPolicy({ ...capture?.properties })?.properties).toEqual(
        expect.objectContaining({ oak_client_product: expected }),
      );
    },
  );

  it('attributes an errored tool call to its client, so an error rate is readable by product', () => {
    const claudeCode = createSubject();
    const codex = createSubject();

    emitToolCall(claudeCode, extraWithUserAgent(OBSERVED_USER_AGENTS.claudeCode), true);
    emitToolCall(codex, extraWithUserAgent(OBSERVED_USER_AGENTS.codex), true);

    for (const [subject, expected] of [
      [claudeCode, 'claude_code'],
      [codex, 'codex'],
    ] as const) {
      const capture = subject.toolCallCaptures[0];
      expect(capture?.isError).toBe(true);
      expect(capture?.properties.oak_client_product).toBe(expected);
    }
  });

  it('carries the product onto every capture kind, not only the handshake', () => {
    const subject = createSubject();
    const extra = extraWithUserAgent(OBSERVED_USER_AGENTS.claudeCode);

    subject.delegate.emit(
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: {},
          clientInfo: { name: 'claude-code', version: '2.1.226' },
        },
      },
      extra,
    );
    void subject.transport.send({
      jsonrpc: '2.0',
      id: 1,
      result: { protocolVersion: PROTOCOL_VERSION },
    });
    subject.delegate.emit({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, extra);
    void subject.transport.send({
      jsonrpc: '2.0',
      id: 2,
      result: { tools: [{ name: 'get-lessons-summary' }] },
    });
    emitToolCall(subject, extra);

    expect(subject.initializeCaptures[0]?.properties.oak_client_product).toBe('claude_code');
    expect(subject.toolsListCaptures[0]?.properties.oak_client_product).toBe('claude_code');
    expect(subject.toolCallCaptures[0]?.properties.oak_client_product).toBe('claude_code');
  });

  // An unreadable header container must be visible in the data, because a future
  // SDK release that stops populating `requestInfo`, or a move to a Fetch-native
  // adapter whose Headers instance this reader cannot see, would otherwise send
  // EVERY event to 'other' — a total attribution regression indistinguishable from
  // healthy traffic. That is the MCP-594 false-green recreated inside its own cure.
  it('records unavailable when the transport supplies no readable header container', () => {
    const subject = createSubject();

    emitToolCall(subject, AUTH_EXTRA);

    expect(subject.toolCallCaptures[0]?.properties.oak_client_product).toBe('unavailable');
  });

  // The behavioural guarantee: a client choosing to send no User-Agent is a
  // measurement ('other'), never the transport-health signal. Otherwise any client
  // could raise the alarm at will and it would not be an alarm.
  it.each([
    ['an empty header container', {}],
    ['no user-agent among other headers', { accept: 'application/json' }],
    ['an empty user-agent', { 'user-agent': '' }],
    ['an unrecognised user-agent', { 'user-agent': 'definitely-not-a-known-client/9.9' }],
  ])('records other, not unavailable, for a readable container with %s', (_label, headers) => {
    const subject = createSubject();

    emitToolCall(subject, { ...AUTH_EXTRA, requestInfo: { headers } });

    expect(subject.toolCallCaptures[0]?.properties.oak_client_product).toBe('other');
  });

  it('distinguishes an unrecognised client from an unreadable container', () => {
    const unrecognised = createSubject();
    const unreadable = createSubject();

    emitToolCall(unrecognised, extraWithUserAgent(OBSERVED_USER_AGENTS.unidentifiable));
    emitToolCall(unreadable, AUTH_EXTRA);

    expect(unrecognised.toolCallCaptures[0]?.properties.oak_client_product).toBe('other');
    expect(unreadable.toolCallCaptures[0]?.properties.oak_client_product).toBe('unavailable');
  });

  it('never ships the raw client header value alongside the category', () => {
    const subject = createSubject();

    emitToolCall(subject, extraWithUserAgent(OBSERVED_USER_AGENTS.claudeCode));

    const capture = subject.toolCallCaptures[0];
    expect(capture?.properties.oak_client_product).toBe('claude_code');
    expect(
      JSON.stringify(capture),
      'the raw client-controlled header value must never reach a capture record',
    ).not.toContain('2.1.226');
    expect(JSON.stringify(throughFinalPolicy({ ...capture?.properties }))).not.toContain('2.1.226');
  });

  it('drops an event whose product category is absent, rather than defaulting it to other', () => {
    const subject = createSubject();
    emitToolCall(subject, extraWithUserAgent(OBSERVED_USER_AGENTS.claudeCode));
    const withoutProduct = Object.fromEntries(
      Object.entries({ ...subject.toolCallCaptures[0]?.properties }).filter(
        ([key]) => key !== 'oak_client_product',
      ),
    );

    expect(withoutProduct).not.toHaveProperty('oak_client_product');
    expect(throughFinalPolicy(withoutProduct)).toBeNull();
  });

  it('drops an event carrying a non-canonical product value', () => {
    const subject = createSubject();
    emitToolCall(subject, extraWithUserAgent(OBSERVED_USER_AGENTS.claudeCode));

    expect(
      throughFinalPolicy({
        ...subject.toolCallCaptures[0]?.properties,
        oak_client_product: 'claude-code/2.1.226',
      }),
    ).toBeNull();
  });
});
