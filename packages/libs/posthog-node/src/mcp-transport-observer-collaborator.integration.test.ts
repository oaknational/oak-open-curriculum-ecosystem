import type {
  Transport,
  TransportSendOptions,
} from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  SUPPORTED_PROTOCOL_VERSIONS,
  type JSONRPCMessage,
  type MessageExtraInfo,
} from '@modelcontextprotocol/sdk/types.js';
import type { ResolvedRelease } from '@oaknational/build-metadata';
import { ok } from '@oaknational/result';
import { assert, describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import type { PostHogEventPolicyConfig } from './event-policy.js';
import {
  createPostHogMcpTransportObserver,
  type PostHogMcpCaptureClient,
} from './mcp-transport-observer.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

const ACTOR_ID = 'raw-verified-actor';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];
const COMMON_PROPERTIES = {
  $mcp_source: 'posthog_mcp_analytics',
  $mcp_server_name: 'oak-curriculum-http',
  $mcp_server_version: SERVER_VERSION,
  oak_client_surface: 'other',
  oak_environment: RELEASE.environment,
  oak_release: RELEASE.value,
} as const;
const AUTH_EXTRA: MessageExtraInfo = {
  authInfo: {
    token: 'raw-token',
    clientId: 'raw-client',
    scopes: ['raw-scope'],
    extra: {
      userId: ACTOR_ID,
      email: 'raw-email@example.test',
    },
  },
};

type InitializeCapture = Parameters<PostHogMcpCaptureClient['captureInitialize']>[0];
type ToolsListCapture = Parameters<PostHogMcpCaptureClient['captureToolsList']>[0];
type ToolCallCapture = Parameters<PostHogMcpCaptureClient['captureToolCall']>[0];

interface SendCall {
  readonly message: JSONRPCMessage;
  readonly options: TransportSendOptions | undefined;
}

class RecordingTransport implements Transport {
  readonly startPromise = Promise.resolve();
  readonly closePromise = Promise.resolve();
  readonly sendPromise = Promise.resolve();
  readonly sendCalls: SendCall[] = [];
  readonly protocolVersions: string[] = [];
  callbacksPresentAtStart = false;
  sessionId = 'delegate-session';

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: <T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo) => void;
  setProtocolVersion = (version: string): void => {
    this.protocolVersions.push(version);
  };

  start(): Promise<void> {
    this.callbacksPresentAtStart =
      this.onclose !== undefined && this.onerror !== undefined && this.onmessage !== undefined;
    return this.startPromise;
  }

  close(): Promise<void> {
    return this.closePromise;
  }

  send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    this.sendCalls.push({ message, options });
    return this.sendPromise;
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

function createConfig(
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void = () => undefined,
): PostHogEventPolicyConfig {
  return {
    release: RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames: ['search', 'browse'],
    servedResourceNames: ['lesson-guide'],
    activeActorProjector: createProjector(),
    reportOperationalError,
  };
}

function createClock(...values: number[]): () => number {
  return () => {
    const value = values.shift();
    assert(value !== undefined, 'Expected another deterministic clock value');
    return value;
  };
}

function createSubject(
  now: () => number = Date.now,
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void = () => undefined,
) {
  const initializeCaptures: InitializeCapture[] = [];
  const toolsListCaptures: ToolsListCapture[] = [];
  const toolCallCaptures: ToolCallCapture[] = [];
  const client: PostHogMcpCaptureClient = {
    captureInitialize: (capture) => initializeCaptures.push(capture),
    captureToolsList: (capture) => toolsListCaptures.push(capture),
    captureToolCall: (capture) => toolCallCaptures.push(capture),
  };
  const delegate = new RecordingTransport();
  const observer = createPostHogMcpTransportObserver(
    client,
    createConfig(reportOperationalError),
    now,
  );
  const transport = observer.observe(delegate);
  return {
    client,
    delegate,
    initializeCaptures,
    observer,
    toolCallCaptures,
    toolsListCaptures,
    transport,
  };
}

function initializeRequest(id: string | number = 1): JSONRPCMessage {
  return {
    jsonrpc: '2.0',
    id,
    method: 'initialize',
    params: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { rawCapability: 'raw-capability' },
      clientInfo: {
        name: 'ChatGPT Desktop/raw-client-name',
        version: 'raw-client-version',
      },
    },
  };
}

type Subject = ReturnType<typeof createSubject>;

interface ForwardingProbe {
  readonly closeSignals: undefined[];
  readonly errors: Error[];
  readonly extras: (MessageExtraInfo | undefined)[];
  readonly messages: JSONRPCMessage[];
  readonly order: string[];
}

function attachForwardingProbe(subject: Subject): ForwardingProbe {
  const probe: ForwardingProbe = {
    closeSignals: [],
    errors: [],
    extras: [],
    messages: [],
    order: [],
  };
  subject.transport.onmessage = (message, extra) => {
    probe.order.push('protocol-message');
    probe.messages.push(message);
    probe.extras.push(extra);
  };
  subject.transport.onerror = (error) => {
    probe.order.push('protocol-error');
    probe.errors.push(error);
  };
  subject.transport.onclose = () => {
    probe.order.push('protocol-close');
    probe.closeSignals.push(undefined);
  };
  return probe;
}

function attachExistingDelegateCallbacks(subject: Subject, probe: ForwardingProbe): void {
  subject.delegate.onmessage = () => {
    probe.order.push('delegate-message');
  };
  subject.delegate.onerror = () => {
    probe.order.push('delegate-error');
  };
  subject.delegate.onclose = () => {
    probe.order.push('delegate-close');
  };
}

function exerciseDelegateCallbacks(subject: Subject): {
  readonly error: Error;
  readonly extra: MessageExtraInfo;
  readonly notification: JSONRPCMessage;
  readonly start: Promise<void>;
} {
  const start = subject.transport.start();
  subject.transport.sessionId = 'updated-session';
  subject.transport.setProtocolVersion?.(PROTOCOL_VERSION);
  const notification: JSONRPCMessage = {
    jsonrpc: '2.0',
    method: 'notifications/tools/list_changed',
  };
  const extra: MessageExtraInfo = { authInfo: AUTH_EXTRA.authInfo };
  subject.delegate.emit(notification, extra);
  const error = new Error('delegate-error');
  subject.delegate.onerror?.(error);
  subject.delegate.onclose?.();
  return { error, extra, notification, start };
}

function expectCallbackDelegation(
  subject: Subject,
  probe: ForwardingProbe,
  exercise: ReturnType<typeof exerciseDelegateCallbacks>,
): void {
  expect(exercise.start).toBe(subject.delegate.startPromise);
  expect(subject.delegate.callbacksPresentAtStart).toBe(true);
  expect(subject.observer.observe(subject.delegate)).toBe(subject.transport);
  expect(subject.observer.observe(subject.transport)).toBe(subject.transport);
  expect(subject.transport).not.toBe(subject.delegate);
  expect(subject.transport.sessionId).toBe('updated-session');
  expect(subject.delegate.protocolVersions).toStrictEqual([PROTOCOL_VERSION]);
  expect(probe.messages).toStrictEqual([exercise.notification]);
  expect(probe.messages[0]).toBe(exercise.notification);
  expect(probe.extras[0]).toBe(exercise.extra);
  expect(probe.errors).toStrictEqual([exercise.error]);
  expect(probe.closeSignals).toStrictEqual([undefined]);
  expect(probe.order).toStrictEqual([
    'delegate-message',
    'protocol-message',
    'delegate-error',
    'protocol-error',
    'delegate-close',
    'protocol-close',
  ]);
}

function expectSendAndCloseDelegation(subject: Subject): void {
  const response: JSONRPCMessage = { jsonrpc: '2.0', id: 404, result: {} };
  const options: TransportSendOptions = { relatedRequestId: 'related-request' };
  const send = subject.transport.send(response, options);
  const close = subject.transport.close();

  expect(send).toBe(subject.delegate.sendPromise);
  expect(close).toBe(subject.delegate.closePromise);
  expect(subject.delegate.sendCalls).toStrictEqual([{ message: response, options }]);
  expect(subject.delegate.sendCalls[0]?.message).toBe(response);
  expect(subject.delegate.sendCalls[0]?.options).toBe(options);
}

function initializeResponse(): JSONRPCMessage {
  return {
    jsonrpc: '2.0',
    id: 1,
    result: {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { rawCapability: 'raw-server-capability' },
      serverInfo: { name: 'raw-server-name', version: 'raw-server-version' },
      _meta: { rawMetadata: 'raw-initialize-metadata' },
    },
  };
}

function listTraffic(): {
  readonly request: JSONRPCMessage;
  readonly response: JSONRPCMessage;
} {
  return {
    request: {
      jsonrpc: '2.0',
      id: 'list-1',
      method: 'tools/list',
      params: {
        cursor: 'raw-request-cursor',
        _meta: { rawRequestMetadata: true },
      },
    },
    response: {
      jsonrpc: '2.0',
      id: 'list-1',
      result: {
        tools: [
          { name: 'search', description: 'raw-description' },
          { name: 'private-tool', description: 'raw-private-description' },
          { name: 'browse', _meta: { rawToolMetadata: true } },
          { name: 'search' },
        ],
        nextCursor: 'raw-next-cursor',
        _meta: { rawResponseMetadata: true },
      },
    },
  };
}

function callTraffic(): {
  readonly request: JSONRPCMessage;
  readonly response: JSONRPCMessage;
} {
  return {
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'search',
        arguments: { privateQuery: 'raw-tool-argument' },
        _meta: { rawRequestMetadata: true },
      },
    },
    response: {
      jsonrpc: '2.0',
      id: 3,
      result: {
        content: [{ type: 'text', text: 'raw-tool-result' }],
        isError: true,
        _meta: { rawResponseMetadata: true },
      },
    },
  };
}

interface ClosedTrafficExercise {
  readonly call: ReturnType<typeof callTraffic>;
  readonly forwarded: JSONRPCMessage[];
  readonly initialize: JSONRPCMessage;
  readonly initializeResponse: JSONRPCMessage;
  readonly list: ReturnType<typeof listTraffic>;
  readonly sends: readonly Promise<void>[];
}

function exerciseClosedTraffic(subject: Subject): ClosedTrafficExercise {
  const forwarded: JSONRPCMessage[] = [];
  subject.transport.onmessage = (message) => forwarded.push(message);
  void subject.transport.start();
  const initialize = initializeRequest();
  subject.delegate.emit(initialize, AUTH_EXTRA);
  const initResponse = initializeResponse();
  const initSend = subject.transport.send(initResponse);
  const list = listTraffic();
  subject.delegate.emit(list.request, AUTH_EXTRA);
  const listSend = subject.transport.send(list.response, { relatedRequestId: 'list-1' });
  const call = callTraffic();
  subject.delegate.emit(call.request, AUTH_EXTRA);
  const callSend = subject.transport.send(call.response);
  return {
    call,
    forwarded,
    initialize,
    initializeResponse: initResponse,
    list,
    sends: [initSend, listSend, callSend],
  };
}

function expectClosedWirePreserved(subject: Subject, exercise: ClosedTrafficExercise): void {
  expect(exercise.sends).toStrictEqual([
    subject.delegate.sendPromise,
    subject.delegate.sendPromise,
    subject.delegate.sendPromise,
  ]);
  expect(exercise.forwarded).toStrictEqual([
    exercise.initialize,
    exercise.list.request,
    exercise.call.request,
  ]);
  expect(subject.delegate.sendCalls.map(({ message }) => message)).toStrictEqual([
    exercise.initializeResponse,
    exercise.list.response,
    exercise.call.response,
  ]);
  expect(subject.delegate.sendCalls[0]?.message).toBe(exercise.initializeResponse);
  expect(subject.delegate.sendCalls[1]?.message).toBe(exercise.list.response);
  expect(subject.delegate.sendCalls[2]?.message).toBe(exercise.call.response);
}

function expectClosedCaptureRows(subject: Subject): void {
  expect(subject.initializeCaptures).toStrictEqual([
    {
      distinctId: DISTINCT_ID,
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
      },
      protocolVersion: PROTOCOL_VERSION,
    },
  ]);
  expect(subject.toolsListCaptures).toStrictEqual([
    {
      distinctId: DISTINCT_ID,
      durationMs: 11,
      isError: false,
      toolNames: ['browse', 'search'],
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_listed_tool_names: ['browse', 'search'],
      },
    },
  ]);
  expect(subject.toolCallCaptures).toStrictEqual([
    {
      distinctId: DISTINCT_ID,
      durationMs: 15,
      isError: true,
      properties: COMMON_PROPERTIES,
      toolName: 'search',
    },
  ]);
}

function expectClosedCapturePrivacy(subject: Subject): void {
  const captured = JSON.stringify({
    initialize: subject.initializeCaptures,
    list: subject.toolsListCaptures,
    call: subject.toolCallCaptures,
  });
  expect(captured).not.toContain(ACTOR_ID);
  expect(captured).not.toContain('raw-client');
  expect(captured).not.toContain('raw-tool-argument');
  expect(captured).not.toContain('raw-tool-result');
  expect(captured).not.toContain('raw-next-cursor');
  expect(captured).not.toContain('rawResponseMetadata');
}

function emitIgnoredTraffic(subject: Subject): void {
  const unsupported: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 'ping',
    method: 'ping',
    params: { raw: 'unsupported' },
  };
  const notification: JSONRPCMessage = {
    jsonrpc: '2.0',
    method: 'notifications/initialized',
    params: { raw: 'notification' },
  };
  const unauthenticatedList: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 'unauthenticated',
    method: 'tools/list',
  };
  subject.delegate.emit(unsupported, AUTH_EXTRA);
  subject.delegate.emit(notification, AUTH_EXTRA);
  subject.delegate.emit(unauthenticatedList);
}

function emitOverlappingRequests(subject: Subject): void {
  const list: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/list',
  };
  const call: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 8,
    method: 'tools/call',
    params: {
      name: 'private-tool',
      arguments: { raw: 'private-argument' },
    },
  };
  subject.delegate.emit(list, AUTH_EXTRA);
  subject.delegate.emit(call, AUTH_EXTRA);
}

function sendOverlappingErrors(subject: Subject): void {
  const callError: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 8,
    error: {
      code: -32_603,
      message: 'raw-error-message',
      data: { raw: 'raw-error-data' },
    },
  };
  const listError: JSONRPCMessage = {
    jsonrpc: '2.0',
    id: 7,
    error: {
      code: -32_603,
      message: 'raw-list-error',
    },
  };
  void subject.transport.send(callError);
  void subject.transport.send(listError);
  void subject.transport.send({
    jsonrpc: '2.0',
    id: 'unauthenticated',
    result: { tools: [] },
  });
  void subject.transport.send({ jsonrpc: '2.0', id: 'ping', result: {} });
}

function expectOverlappingCaptures(subject: Subject): void {
  expect(subject.initializeCaptures).toStrictEqual([]);
  expect(subject.toolCallCaptures).toStrictEqual([
    {
      distinctId: DISTINCT_ID,
      durationMs: 6,
      isError: true,
      properties: COMMON_PROPERTIES,
      toolName: 'unknown',
    },
  ]);
  expect(subject.toolsListCaptures).toStrictEqual([
    {
      distinctId: DISTINCT_ID,
      durationMs: 9,
      isError: true,
      properties: COMMON_PROPERTIES,
    },
  ]);
  expect(JSON.stringify(subject.toolCallCaptures)).not.toContain('raw-error');
  expect(JSON.stringify(subject.toolsListCaptures)).not.toContain('raw-list-error');
}

describe('createPostHogMcpTransportObserver collaborator integration', () => {
  it('registers delegate handlers before start and preserves every transport identity', () => {
    const subject = createSubject();
    expect(subject.transport.sessionId).toBe('delegate-session');
    const probe = attachForwardingProbe(subject);
    attachExistingDelegateCallbacks(subject, probe);
    const exercise = exerciseDelegateCallbacks(subject);

    expectCallbackDelegation(subject, probe, exercise);
    expectSendAndCloseDelegation(subject);
  });

  it('captures only closed facts while preserving pagination, metadata, and result objects', () => {
    const subject = createSubject(createClock(10, 15, 20, 31, 40, 55));
    const exercise = exerciseClosedTraffic(subject);

    expectClosedWirePreserved(subject, exercise);
    expectClosedCaptureRows(subject);
    expectClosedCapturePrivacy(subject);
  });

  it('drops a successful tools/list response without a valid tools array', () => {
    const subject = createSubject(createClock(10, 20));
    subject.transport.onmessage = () => undefined;
    void subject.transport.start();
    subject.delegate.emit(
      {
        jsonrpc: '2.0',
        id: 'malformed-list',
        method: 'tools/list',
      },
      AUTH_EXTRA,
    );
    const response: JSONRPCMessage = {
      jsonrpc: '2.0',
      id: 'malformed-list',
      result: { raw: 'missing-tools-array' },
    };

    const send = subject.transport.send(response);

    expect(send).toBe(subject.delegate.sendPromise);
    expect(subject.delegate.sendCalls[0]?.message).toBe(response);
    expect(subject.toolsListCaptures).toStrictEqual([]);
  });

  it('correlates overlapping IDs, closes unknown names, and ignores unsupported traffic', () => {
    const subject = createSubject(createClock(1, 2, 8, 10));
    subject.transport.onmessage = () => undefined;
    void subject.transport.start();
    emitIgnoredTraffic(subject);
    emitOverlappingRequests(subject);
    sendOverlappingErrors(subject);

    expectOverlappingCaptures(subject);
  });

  it('keeps protocol delivery exact when capture and the fixed reporter throw', () => {
    const reported: PostHogOperationalErrorKind[] = [];
    const client: PostHogMcpCaptureClient = {
      captureInitialize: () => undefined,
      captureToolsList: () => undefined,
      captureToolCall: () => {
        assert.fail('raw-capture-error');
      },
    };
    const delegate = new RecordingTransport();
    const observer = createPostHogMcpTransportObserver(
      client,
      createConfig((kind) => {
        reported.push(kind);
        assert.fail('raw-reporter-error');
      }),
      createClock(1, 2),
    );
    const transport = observer.observe(delegate);
    transport.onmessage = () => undefined;
    void transport.start();
    delegate.emit(
      {
        jsonrpc: '2.0',
        id: 9,
        method: 'tools/call',
        params: { name: 'search', arguments: { raw: 'private-argument' } },
      },
      AUTH_EXTRA,
    );
    const response: JSONRPCMessage = {
      jsonrpc: '2.0',
      id: 9,
      result: { content: [{ type: 'text', text: 'raw-result' }] },
    };

    const send = transport.send(response);

    expect(send).toBe(delegate.sendPromise);
    expect(delegate.sendCalls[0]?.message).toBe(response);
    expect(reported).toStrictEqual(['posthog_event_policy_failed']);
    expect(JSON.stringify(reported)).not.toContain('raw-capture-error');
    expect(JSON.stringify(reported)).not.toContain('raw-reporter-error');
  });
});
