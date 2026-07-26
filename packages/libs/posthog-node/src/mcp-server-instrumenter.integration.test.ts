import type { ResolvedRelease } from '@oaknational/build-metadata';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
  Transport,
  TransportSendOptions,
} from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  SUPPORTED_PROTOCOL_VERSIONS,
  type JSONRPCMessage,
  type MessageExtraInfo,
} from '@modelcontextprotocol/sdk/types.js';
import { ok } from '@oaknational/result';
import { instrument as officialInstrumentMcpServer, type MCPAnalyticsOptions } from '@posthog/mcp';
import type { EventMessage } from 'posthog-node';
import { assert, describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import type { PostHogEventPolicyConfig } from './event-policy.js';
import { createPostHogMcpServerInstrumenter } from './mcp-server-instrumenter.js';

const ACTOR_ID = 'user_example';
const PROJECTED_ACTOR_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const TOOL_NAME = 'search';
const RESOURCE_NAME = 'lesson-guide';
const RESOURCE_URI = 'oak://lesson-guide';
const RAW_CLIENT_NAME = 'ChatGPT Desktop/private-client-name';
const RAW_CLIENT_VERSION = 'private-client-version';
const RAW_TOOL_ARGUMENT = 'private-tool-argument';
const RAW_TOOL_RESULT = 'private-tool-result';
const RAW_TOOL_DESCRIPTION = 'private-tool-description';
const RAW_TOOL_CATEGORY = 'private-tool-category';
const RAW_UNKNOWN_METADATA = 'private-unknown-metadata';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const AUTH_INFO: AuthInfo = {
  token: 'test-token',
  clientId: 'test-client',
  scopes: [],
  extra: { userId: ACTOR_ID },
};
const ACTIVE_ACTOR_PROJECTOR: ActivePostHogActorProjector = {
  project: () =>
    ok({
      environment: RELEASE.environment,
      keyId: '2026-07',
      distinctId: PROJECTED_ACTOR_ID,
    }),
};
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;

type PolicyDecision = Awaited<ReturnType<NonNullable<MCPAnalyticsOptions['beforeSend']>>>;
type PolicyEvent = Parameters<NonNullable<MCPAnalyticsOptions['beforeSend']>>[0];

interface SequentialProbe<T> {
  readonly values: T[];
  readonly emit: (value: T) => void;
  readonly next: () => Promise<T>;
}

interface CapturingPostHogClient {
  capture(event: EventMessage): void;
  getLibraryId(): string;
  getLibraryVersion(): string;
}

interface CompleteEventEnvelope extends EventMessage {
  readonly distinctId: string;
  readonly timestamp: Date;
  readonly uuid: string;
}

interface InstrumentedRuntime {
  readonly server: McpServer;
  readonly client: Client;
  readonly captureEvents: SequentialProbe<EventMessage>;
  readonly policyDecisions: SequentialProbe<PolicyDecision>;
}

/**
 * Adds the authenticated request context expected by the MCP transport contract.
 *
 * The adapter is deliberately branch-free: every caller option is forwarded and
 * the verified auth context is added at the single transport seam.
 */
class AuthenticatedInMemoryTransport implements Transport {
  private readonly delegate: InMemoryTransport;
  private readonly authInfo: AuthInfo;

  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: <T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo) => void;

  constructor(delegate: InMemoryTransport, authInfo: AuthInfo) {
    this.delegate = delegate;
    this.authInfo = authInfo;
  }

  get sessionId(): string | undefined {
    return this.delegate.sessionId;
  }

  set sessionId(value: string | undefined) {
    this.delegate.sessionId = value;
  }

  async start(): Promise<void> {
    this.delegate.onclose = () => this.onclose?.();
    this.delegate.onerror = (error) => this.onerror?.(error);
    this.delegate.onmessage = (message, extra) => this.onmessage?.(message, extra);
    await this.delegate.start();
  }

  async close(): Promise<void> {
    await this.delegate.close();
  }

  async send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    await this.delegate.send(message, { ...options, authInfo: this.authInfo });
  }
}

/**
 * Records values and exposes one deterministic signal for the next value.
 *
 * Tests arm the signal before an operation. The probe has no branching,
 * scheduling policy, retry, or queue semantics of its own.
 */
function createSequentialProbe<T>(): SequentialProbe<T> {
  const values: T[] = [];
  let notify: (value: T) => void = () => undefined;

  return {
    values,
    emit: (value) => {
      values.push(value);
      notify(value);
    },
    next: () =>
      new Promise((resolve) => {
        notify = resolve;
      }),
  };
}

function createCapturingPostHogClient(
  captureEvents: SequentialProbe<EventMessage>,
): CapturingPostHogClient {
  return {
    capture: captureEvents.emit,
    getLibraryId: () => 'integration-capture-probe',
    getLibraryVersion: () => '0.0.0',
  };
}

function createOfficialInstrumentAdapter(policyDecisions: SequentialProbe<PolicyDecision>) {
  return (
    server: unknown,
    client: CapturingPostHogClient,
    options: MCPAnalyticsOptions,
  ): unknown => {
    const beforeSend = options.beforeSend;
    assert(beforeSend, 'Expected the Oak event policy at the official instrumentation seam');

    return Reflect.apply(officialInstrumentMcpServer, undefined, [
      server,
      client,
      {
        ...options,
        beforeSend: async (event: PolicyEvent) => {
          const decision = await beforeSend(event);
          policyDecisions.emit(decision);
          return decision;
        },
      },
    ]);
  };
}

function createPolicyConfig(): PostHogEventPolicyConfig {
  return {
    release: RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames: [TOOL_NAME],
    servedResourceNames: [RESOURCE_NAME],
    activeActorProjector: ACTIVE_ACTOR_PROJECTOR,
    reportOperationalError: () => undefined,
  };
}

function registerTestSurface(server: McpServer): void {
  server.registerTool(
    TOOL_NAME,
    {
      description: RAW_TOOL_DESCRIPTION,
      _meta: {
        category: RAW_TOOL_CATEGORY,
        unknown: RAW_UNKNOWN_METADATA,
      },
    },
    async () => ({
      content: [{ type: 'text', text: RAW_TOOL_RESULT }],
    }),
  );
  server.registerPrompt('lesson-prompt', { description: 'Stable prompt' }, async () => ({
    messages: [{ role: 'user', content: { type: 'text', text: 'prompt-result' } }],
  }));
  server.registerResource(
    RESOURCE_NAME,
    RESOURCE_URI,
    { description: 'Stable resource', mimeType: 'text/plain' },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/plain', text: 'resource-result' }],
    }),
  );
}

function createInstrumentedRuntime(): InstrumentedRuntime {
  const server = new McpServer({
    name: 'oak-curriculum-http',
    version: SERVER_VERSION,
  });
  registerTestSurface(server);

  const client = new Client({
    name: RAW_CLIENT_NAME,
    version: RAW_CLIENT_VERSION,
  });
  const captureEvents = createSequentialProbe<EventMessage>();
  const policyDecisions = createSequentialProbe<PolicyDecision>();
  const posthog = createCapturingPostHogClient(captureEvents);
  createPostHogMcpServerInstrumenter<McpServer, CapturingPostHogClient>(
    posthog,
    createPolicyConfig(),
    createOfficialInstrumentAdapter(policyDecisions),
  ).instrument(server);

  return { server, client, captureEvents, policyDecisions };
}

function assertCompleteEnvelope(event: EventMessage): asserts event is CompleteEventEnvelope {
  assert(typeof event.distinctId === 'string', 'Expected a projected distinct ID');
  assert(event.timestamp instanceof Date, 'Expected a capture timestamp');
  assert(typeof event.uuid === 'string', 'Expected the vendor capture UUID');
  expect(event.uuid).toMatch(UUID_V7_PATTERN);
}

function expectClosedEvent(
  event: EventMessage,
  name: string,
  properties: Record<string, unknown>,
): void {
  assertCompleteEnvelope(event);
  expect(event).toStrictEqual({
    distinctId: PROJECTED_ACTOR_ID,
    event: name,
    properties,
    timestamp: event.timestamp,
    uuid: event.uuid,
  });
}

function commonProperties(): Record<string, unknown> {
  return {
    $mcp_source: 'posthog_mcp_analytics',
    $mcp_server_name: 'oak-curriculum-http',
    $mcp_server_version: SERVER_VERSION,
    oak_environment: RELEASE.environment,
    oak_release: RELEASE.value,
  };
}

async function closeTestRuntime(runtime: InstrumentedRuntime): Promise<void> {
  await runtime.client.close();
  await runtime.server.close();
}

async function connectAuthenticated(
  runtime: InstrumentedRuntime,
  clientTransport: InMemoryTransport,
  serverTransport: InMemoryTransport,
): Promise<void> {
  await runtime.server.connect(serverTransport);
  const initializeCapture = runtime.captureEvents.next();
  await runtime.client.connect(new AuthenticatedInMemoryTransport(clientTransport, AUTH_INFO));
  const initializeEvent = await initializeCapture;

  expect(SUPPORTED_PROTOCOL_VERSIONS).toContain(initializeEvent.properties?.$mcp_protocol_version);
  expectClosedEvent(initializeEvent, '$mcp_initialize', {
    ...commonProperties(),
    $mcp_is_error: false,
    oak_client_family: 'chatgpt',
    $mcp_protocol_version: expect.any(String),
  });
}

async function expectUnsupportedOperationsPreserveMcpResults(
  runtime: InstrumentedRuntime,
): Promise<void> {
  const prompts = await runtime.client.listPrompts();
  const resources = await runtime.client.listResources();
  const resource = await runtime.client.readResource({ uri: RESOURCE_URI });
  const ping = await runtime.client.ping();

  expect(prompts.prompts).toEqual([
    expect.objectContaining({
      name: 'lesson-prompt',
      description: 'Stable prompt',
    }),
  ]);
  expect(resources.resources).toEqual([
    expect.objectContaining({
      name: RESOURCE_NAME,
      uri: RESOURCE_URI,
      description: 'Stable resource',
      mimeType: 'text/plain',
    }),
  ]);
  expect(resource.contents).toEqual([
    expect.objectContaining({
      uri: RESOURCE_URI,
      mimeType: 'text/plain',
      text: 'resource-result',
    }),
  ]);
  expect(ping).toStrictEqual({});
}

async function expectClosedToolsList(runtime: InstrumentedRuntime): Promise<void> {
  const toolsListCapture = runtime.captureEvents.next();
  const toolsList = await runtime.client.listTools();
  const toolsListEvent = await toolsListCapture;

  expect(toolsList.tools).toEqual([
    expect.objectContaining({
      name: TOOL_NAME,
      description: RAW_TOOL_DESCRIPTION,
      _meta: {
        category: RAW_TOOL_CATEGORY,
        unknown: RAW_UNKNOWN_METADATA,
      },
    }),
  ]);
  expect(toolsListEvent.properties?.$mcp_duration_ms).toEqual(expect.any(Number));
  expect(toolsListEvent.properties?.$mcp_duration_ms).toBeGreaterThanOrEqual(0);
  expectClosedEvent(toolsListEvent, '$mcp_tools_list', {
    ...commonProperties(),
    $mcp_duration_ms: expect.any(Number),
    $mcp_is_error: false,
    $mcp_listed_tool_names: [TOOL_NAME],
  });
}

async function expectClosedToolCall(runtime: InstrumentedRuntime): Promise<void> {
  const toolCallCapture = runtime.captureEvents.next();
  const toolResult = await runtime.client.callTool({
    name: TOOL_NAME,
    arguments: { privateQuery: RAW_TOOL_ARGUMENT },
  });
  const toolCallEvent = await toolCallCapture;

  expect(toolResult).toStrictEqual({
    content: [{ type: 'text', text: RAW_TOOL_RESULT }],
  });
  expect(toolCallEvent.properties?.$mcp_duration_ms).toEqual(expect.any(Number));
  expect(toolCallEvent.properties?.$mcp_duration_ms).toBeGreaterThanOrEqual(0);
  expectClosedEvent(toolCallEvent, '$mcp_tool_call', {
    ...commonProperties(),
    $mcp_tool_name: TOOL_NAME,
    $mcp_duration_ms: expect.any(Number),
    $mcp_is_error: false,
  });
}

describe('createPostHogMcpServerInstrumenter official integration', () => {
  it('emits only closed authenticated events while preserving the MCP results', async () => {
    const runtime = createInstrumentedRuntime();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    try {
      await connectAuthenticated(runtime, clientTransport, serverTransport);
      await expectUnsupportedOperationsPreserveMcpResults(runtime);
      await expectClosedToolsList(runtime);
      await expectClosedToolCall(runtime);

      expect(runtime.captureEvents.values.map(({ event }) => event)).toStrictEqual([
        '$mcp_initialize',
        '$mcp_tools_list',
        '$mcp_tool_call',
      ]);
    } finally {
      await closeTestRuntime(runtime);
    }
  });

  it('drops automatic events when the MCP request has no verified actor', async () => {
    const runtime = createInstrumentedRuntime();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    try {
      await runtime.server.connect(serverTransport);

      const initializeDecision = runtime.policyDecisions.next();
      await runtime.client.connect(clientTransport);
      expect(await initializeDecision).toBeNull();

      const toolsListDecision = runtime.policyDecisions.next();
      await runtime.client.listTools();
      expect(await toolsListDecision).toBeNull();

      const toolCallDecision = runtime.policyDecisions.next();
      await runtime.client.callTool({
        name: TOOL_NAME,
        arguments: { privateQuery: RAW_TOOL_ARGUMENT },
      });
      expect(await toolCallDecision).toBeNull();

      expect(runtime.captureEvents.values).toStrictEqual([]);
    } finally {
      await closeTestRuntime(runtime);
    }
  });
});
