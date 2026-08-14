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
import type { PostHogEventPolicyConfig } from './event-policy.js';
import {
  createPostHogMcpTransportObserver,
  type PostHogMcpCaptureClient,
} from './mcp-transport-observer.js';

const ACTOR_ID = 'raw-verified-actor';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];
const RAW_UA_SENTINEL = 'RAW-UA-SENTINEL-9f31';
const RAW_USER_AGENT = `${RAW_UA_SENTINEL} Claude-User (claude-code/1.0) raw-host`;
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

function createProjector(): ActivePostHogActorProjector {
  return {
    project: () =>
      ok({
        environment: RELEASE.environment,
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
  };
}

function createConfig(): PostHogEventPolicyConfig {
  return {
    release: RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames: ['search'],
    servedResourceNames: ['lesson-guide'],
    activeActorProjector: createProjector(),
    reportOperationalError: () => undefined,
  };
}

function createSubject() {
  const initializeCaptures: Parameters<PostHogMcpCaptureClient['captureInitialize']>[0][] = [];
  const toolsListCaptures: Parameters<PostHogMcpCaptureClient['captureToolsList']>[0][] = [];
  const toolCallCaptures: Parameters<PostHogMcpCaptureClient['captureToolCall']>[0][] = [];
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

function surfaceExtra(headers: Record<string, string | string[]>): MessageExtraInfo {
  return { ...AUTH_EXTRA, requestInfo: { headers } };
}

function emitInitializeRoundTrip(subject: Subject, extra: MessageExtraInfo): void {
  subject.delegate.emit(
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: 'claude-desktop', version: 'raw-client-version' },
      },
    },
    extra,
  );
  void subject.transport.send({
    jsonrpc: '2.0',
    id: 1,
    result: { protocolVersion: PROTOCOL_VERSION },
  });
}

function emitToolsListRoundTrip(subject: Subject, extra: MessageExtraInfo): void {
  subject.delegate.emit({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, extra);
  void subject.transport.send({
    jsonrpc: '2.0',
    id: 2,
    result: { tools: [{ name: 'search' }] },
  });
}

function emitToolCallRoundTrip(subject: Subject, extra: MessageExtraInfo): void {
  subject.delegate.emit(
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'search' } },
    extra,
  );
  void subject.transport.send({ jsonrpc: '2.0', id: 3, result: { content: [] } });
}

function emitAllRoundTrips(subject: Subject, extra: MessageExtraInfo): void {
  emitInitializeRoundTrip(subject, extra);
  emitToolsListRoundTrip(subject, extra);
  emitToolCallRoundTrip(subject, extra);
}

describe('createPostHogMcpTransportObserver client surface', () => {
  it('derives the surface from transport request headers on every capture kind', () => {
    const subject = createSubject();

    emitAllRoundTrips(subject, surfaceExtra({ 'user-agent': 'claude-code/2.0' }));

    expect(subject.initializeCaptures[0]?.properties.oak_client_surface).toBe('cli');
    expect(subject.toolsListCaptures[0]?.properties.oak_client_surface).toBe('cli');
    expect(subject.toolCallCaptures[0]?.properties.oak_client_surface).toBe('cli');
  });

  it('prefers the x-anthropic-client header over the user-agent header', () => {
    const subject = createSubject();

    emitToolCallRoundTrip(
      subject,
      surfaceExtra({
        'user-agent': 'Mozilla/5.0',
        'x-anthropic-client': 'claude-code/2.0',
      }),
    );

    expect(subject.toolCallCaptures[0]?.properties.oak_client_surface).toBe('cli');
  });

  it('captures the safe default category when the transport supplies no request info', () => {
    const subject = createSubject();

    emitAllRoundTrips(subject, AUTH_EXTRA);

    expect(subject.initializeCaptures[0]?.properties.oak_client_surface).toBe('other');
    expect(subject.toolsListCaptures[0]?.properties.oak_client_surface).toBe('other');
    expect(subject.toolCallCaptures[0]?.properties.oak_client_surface).toBe('other');
  });

  it('never ships the raw user-agent value on any capture', () => {
    const subject = createSubject();

    emitAllRoundTrips(subject, surfaceExtra({ 'user-agent': RAW_USER_AGENT }));

    const captures = [
      ...subject.initializeCaptures,
      ...subject.toolsListCaptures,
      ...subject.toolCallCaptures,
    ];
    expect(captures).toHaveLength(3);
    for (const capture of captures) {
      expect(capture.properties.oak_client_surface).toBe('cli');
      expect(
        JSON.stringify(capture),
        'a raw client-controlled header value must never reach a capture record',
      ).not.toContain(RAW_UA_SENTINEL);
    }
  });
});
