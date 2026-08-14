import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import {
  SUPPORTED_PROTOCOL_VERSIONS,
  type MessageExtraInfo,
} from '@modelcontextprotocol/sdk/types.js';
import type { ResolvedRelease } from '@oaknational/build-metadata';
import type { ProductAnalyticsRuntime } from '@oaknational/observability';
import { setLogger } from '@posthog/mcp';
import { gunzipSync } from 'node:zlib';
import { afterEach, assert, describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { createPostHogProductAnalyticsRuntimeWithFetch } from './product-analytics-runtime.js';
import {
  POSTHOG_EU_INGESTION_HOST,
  type PostHogOperationalErrorKind,
  type PostHogProductAnalyticsConfig,
} from './product-analytics-runtime-contract.js';

const PROJECT_API_KEY = 'phc_final_wire_test';
const ACTOR_ID = 'user_example';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const TOOL_NAME = 'search';
const RESOURCE_NAME = 'lesson-guide';
const RESOURCE_TIMESTAMP = '2026-07-26T12:35:56.000Z';
const RAW_CLIENT_NAME = 'ChatGPT Desktop/raw-client-name';
const RAW_CLIENT_VERSION = 'raw-client-version';
const RAW_TOOL_ARGUMENT = 'raw-parameters';
const RAW_TOOL_RESULT = 'raw-result';
const RAW_UA_SENTINEL = 'RAW-UA-SENTINEL-9f31';
const RAW_USER_AGENT = `${RAW_UA_SENTINEL} Claude-User (claude-code/1.0) raw-host`;
const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u;
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const COMMON_PROPERTIES = {
  $mcp_source: 'posthog_mcp_analytics',
  $mcp_server_name: 'oak-curriculum-http',
  $mcp_server_version: SERVER_VERSION,
  oak_environment: RELEASE.environment,
  oak_release: RELEASE.value,
} as const;
const ACTIVE_ACTOR_PROJECTOR: ActivePostHogActorProjector = {
  project: () => ({
    ok: true,
    value: {
      environment: RELEASE.environment,
      keyId: '2026-07',
      distinctId: DISTINCT_ID,
    },
  }),
};
const AUTH_INFO: AuthInfo = {
  token: 'test-token',
  clientId: 'test-client',
  scopes: [],
  extra: { userId: ACTOR_ID },
};

type InjectedFetch = Parameters<typeof createPostHogProductAnalyticsRuntimeWithFetch>[1];
type FetchOptions = Parameters<InjectedFetch>[1];

interface RecordedRequest {
  readonly url: string;
  readonly options: FetchOptions;
}

interface Subject {
  readonly reportedErrors: PostHogOperationalErrorKind[];
  readonly runtime: Extract<ProductAnalyticsRuntime<Transport>, { mode: 'posthog' }>;
  readonly requests: RecordedRequest[];
  readonly waitUntilPromises: Promise<unknown>[];
}

interface McpConnection {
  readonly client: Client;
  readonly server: McpServer;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createRecordingFetch(status: number, requests: RecordedRequest[]): InjectedFetch {
  return async (url, options) => {
    requests.push({ url, options });
    return {
      status,
      text: async () => '{"results":{}}',
      json: async () => ({ results: {} }),
      headers: { get: () => null },
    };
  };
}

function createSubject(responseStatus: number): Subject {
  const waitUntilPromises: Promise<unknown>[] = [];
  const reportedErrors: PostHogOperationalErrorKind[] = [];
  const config: PostHogProductAnalyticsConfig = {
    projectApiKey: PROJECT_API_KEY,
    host: POSTHOG_EU_INGESTION_HOST,
    serverVersion: SERVER_VERSION,
    release: RELEASE,
    activeActorProjector: ACTIVE_ACTOR_PROJECTOR,
    toolNames: [TOOL_NAME],
    resourceNames: [RESOURCE_NAME],
    waitUntil: (promise) => waitUntilPromises.push(promise),
    reportOperationalError: (kind) => reportedErrors.push(kind),
  };
  const requests: RecordedRequest[] = [];
  const runtime = createPostHogProductAnalyticsRuntimeWithFetch(
    config,
    createRecordingFetch(responseStatus, requests),
  );
  return { reportedErrors, runtime, requests, waitUntilPromises };
}

function createServer(): McpServer {
  const server = new McpServer({
    name: 'oak-curriculum-http',
    version: SERVER_VERSION,
  });
  server.registerTool(TOOL_NAME, {}, async () => ({
    content: [{ type: 'text', text: RAW_TOOL_RESULT }],
  }));
  return server;
}

async function connectInstrumentedRuntime(
  subject: Subject,
  headers: Record<string, string> = {},
): Promise<McpConnection> {
  const server = createServer();
  const client = new Client({
    name: RAW_CLIENT_NAME,
    version: RAW_CLIENT_VERSION,
  });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const send = clientTransport.send.bind(clientTransport);
  clientTransport.send = (message, options) => send(message, { ...options, authInfo: AUTH_INFO });
  try {
    await server.connect(subject.runtime.transportObserver.observe(serverTransport));
    // InMemoryTransport delivers only authInfo, so request headers are injected
    // at the wired server-transport seam, matching a network transport's extra.
    const installed = serverTransport.onmessage;
    assert(installed !== undefined, 'Expected the observer to wire the server transport');
    serverTransport.onmessage = (message, extra) => {
      const enriched: MessageExtraInfo = { ...extra, requestInfo: { headers } };
      installed(message, enriched);
    };
    await client.connect(clientTransport);
    return { client, server };
  } catch (error: unknown) {
    await Promise.allSettled([client.close(), server.close()]);
    return Promise.reject(error);
  }
}

async function closeMcpConnection(connection: McpConnection): Promise<void> {
  await Promise.all([connection.client.close(), connection.server.close()]);
}

async function closeSubject(
  subject: Subject,
  connection: McpConnection | undefined,
): Promise<void> {
  try {
    await subject.runtime.close();
  } finally {
    if (connection !== undefined) {
      await closeMcpConnection(connection);
    }
  }
}

function captureResourceRead(subject: Subject): void {
  subject.runtime.sink.capture(
    {
      kind: 'mcp_resource_read',
      resourceName: RESOURCE_NAME,
      startedAt: new Date(RESOURCE_TIMESTAMP),
      durationMs: 23,
      isError: false,
    },
    { verifiedActorId: ACTOR_ID },
  );
}

async function parseLegacyBody(request: RecordedRequest): Promise<Record<string, unknown>> {
  expect(request.url).toBe(`${POSTHOG_EU_INGESTION_HOST}/batch/`);
  expect(request.options.method).toBe('POST');
  expect(request.options.headers['Content-Encoding']).toBe('gzip');
  const body = request.options.body;
  assert(body instanceof Blob, 'Expected the real client to send a gzip Blob');
  const decompressed = gunzipSync(Buffer.from(await body.arrayBuffer())).toString('utf8');
  const parsed: unknown = JSON.parse(decompressed);
  assert(isRecord(parsed), 'Expected a JSON object request body');
  return parsed;
}

function readBatch(body: Record<string, unknown>): unknown[] {
  expect(Object.keys(body).sort((left, right) => left.localeCompare(right))).toStrictEqual([
    'api_key',
    'batch',
    'sent_at',
  ]);
  expect(body.api_key).toBe(PROJECT_API_KEY);
  expect(body.sent_at).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/u));
  assert(Array.isArray(body.batch), 'Expected a PostHog batch');
  return body.batch;
}

function readDynamicWireValues(row: unknown): {
  readonly libVersion: string;
  readonly properties: Record<string, unknown>;
  readonly timestamp: string;
  readonly uuid: string;
} {
  assert(isRecord(row), 'Expected a PostHog event row');
  assert(isRecord(row.properties), 'Expected PostHog event properties');
  assert(typeof row.properties.$lib_version === 'string', 'Expected an SDK version');
  assert(row.properties.$lib_version.length > 0, 'Expected a non-empty SDK version');
  assert(typeof row.timestamp === 'string', 'Expected an event timestamp');
  assert(typeof row.uuid === 'string', 'Expected an event UUID');
  expect(row.uuid).toMatch(UUID_V7);
  return {
    libVersion: row.properties.$lib_version,
    properties: row.properties,
    timestamp: row.timestamp,
    uuid: row.uuid,
  };
}

function expectedMcpSdkProperties(libVersion: string) {
  return {
    $lib: 'posthog-node-mcp',
    $lib_version: libVersion,
    $is_server: true,
    $geoip_disable: true,
  };
}

function expectNoForbiddenContent(value: unknown): void {
  const serialised = JSON.stringify(value);
  expect(serialised).not.toContain(ACTOR_ID);
  expect(serialised).not.toContain(RAW_CLIENT_NAME);
  expect(serialised).not.toContain(RAW_CLIENT_VERSION);
  expect(serialised).not.toContain(RAW_TOOL_ARGUMENT);
  expect(serialised).not.toContain(RAW_TOOL_RESULT);
  expect(serialised).not.toContain(RAW_UA_SENTINEL);
  expect(serialised).not.toContain('$mcp_client_name');
  expect(serialised).not.toContain('$mcp_client_version');
  expect(serialised).not.toContain('$mcp_parameters');
  expect(serialised).not.toContain('$mcp_response');
  expect(serialised).not.toContain('$process_person_profile');
}

async function expectSuccessfulFinalWireBatch(subject: Subject): Promise<void> {
  expect(subject.requests).toHaveLength(1);
  const batch = readBatch(await parseLegacyBody(subject.requests[0]));
  const [initializeDynamic, listDynamic, toolDynamic, resourceDynamic] = [
    readDynamicWireValues(batch[0]),
    readDynamicWireValues(batch[1]),
    readDynamicWireValues(batch[2]),
    readDynamicWireValues(batch[3]),
  ];
  const [protocolVersion, listDuration, toolDuration] = [
    initializeDynamic.properties.$mcp_protocol_version,
    listDynamic.properties.$mcp_duration_ms,
    toolDynamic.properties.$mcp_duration_ms,
  ];
  assert(typeof protocolVersion === 'string', 'Expected a negotiated MCP protocol');
  assert(
    SUPPORTED_PROTOCOL_VERSIONS.includes(protocolVersion),
    'Expected an SDK-supported MCP protocol',
  );
  assert(typeof listDuration === 'number', 'Expected a numeric list duration');
  assert(typeof toolDuration === 'number', 'Expected a numeric tool duration');

  expect(batch).toStrictEqual([
    {
      distinct_id: DISTINCT_ID,
      event: '$mcp_initialize',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        oak_client_surface: 'other',
        $mcp_protocol_version: protocolVersion,
        ...expectedMcpSdkProperties(initializeDynamic.libVersion),
      },
      timestamp: initializeDynamic.timestamp,
      uuid: initializeDynamic.uuid,
    },
    {
      distinct_id: DISTINCT_ID,
      event: '$mcp_tools_list',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_duration_ms: listDuration,
        $mcp_is_error: false,
        $mcp_listed_tool_names: [TOOL_NAME],
        oak_client_surface: 'other',
        ...expectedMcpSdkProperties(listDynamic.libVersion),
      },
      timestamp: listDynamic.timestamp,
      uuid: listDynamic.uuid,
    },
    {
      distinct_id: DISTINCT_ID,
      event: '$mcp_tool_call',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_tool_name: TOOL_NAME,
        $mcp_duration_ms: toolDuration,
        $mcp_is_error: false,
        oak_client_surface: 'other',
        ...expectedMcpSdkProperties(toolDynamic.libVersion),
      },
      timestamp: toolDynamic.timestamp,
      uuid: toolDynamic.uuid,
    },
    {
      distinct_id: DISTINCT_ID,
      event: '$mcp_resource_read',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_resource_name: RESOURCE_NAME,
        $mcp_duration_ms: 23,
        $mcp_is_error: false,
        ...expectedMcpSdkProperties(resourceDynamic.libVersion),
      },
      timestamp: RESOURCE_TIMESTAMP,
      uuid: resourceDynamic.uuid,
    },
  ]);
  expectNoForbiddenContent(batch);
}

// Each createSubject reaches the production factory, which installs the
// vendor setLogger singleton at composition; the runtime's close() never
// uninstalls it. Reset per test so a closed subject's late microtask log
// cannot reach the next test's logger (whose reportedErrors assertions are
// strict). Same install-then-reset shape as posthog-mcp-logger.smoke.ts.
afterEach(() => {
  setLogger(undefined);
});

describe('PostHog final wire', () => {
  it('sends only reconstructed manual MCP and resource rows through the real client', async () => {
    const subject = createSubject(200);
    let connection: McpConnection | undefined;

    try {
      connection = await connectInstrumentedRuntime(subject);
      const toolsList = await connection.client.listTools();
      const toolResult = await connection.client.callTool({
        name: TOOL_NAME,
        arguments: { privateQuery: RAW_TOOL_ARGUMENT },
      });
      captureResourceRead(subject);

      await expect(subject.runtime.close()).resolves.toStrictEqual({
        ok: true,
        value: undefined,
      });
      await Promise.all(subject.waitUntilPromises);

      expect(toolResult).toStrictEqual({
        content: [{ type: 'text', text: RAW_TOOL_RESULT }],
      });
      expect(toolsList.tools).toEqual([expect.objectContaining({ name: TOOL_NAME })]);
      expect(subject.reportedErrors).toStrictEqual([]);
      await expectSuccessfulFinalWireBatch(subject);
    } finally {
      await closeSubject(subject, connection);
    }
  });

  it('derives the client surface from request headers without shipping the raw value', async () => {
    const subject = createSubject(200);
    let connection: McpConnection | undefined;

    try {
      connection = await connectInstrumentedRuntime(subject, { 'user-agent': RAW_USER_AGENT });
      await connection.client.listTools();

      await expect(subject.runtime.close()).resolves.toStrictEqual({
        ok: true,
        value: undefined,
      });
      await Promise.all(subject.waitUntilPromises);

      expect(subject.reportedErrors).toStrictEqual([]);
      expect(subject.requests).toHaveLength(1);
      const batch = readBatch(await parseLegacyBody(subject.requests[0]));
      expect(batch).toHaveLength(2);
      for (const row of batch) {
        assert(isRecord(row) && isRecord(row.properties), 'Expected a PostHog event row');
        expect(row.properties.oak_client_surface).toBe('cli');
      }
      expectNoForbiddenContent(batch);
    } finally {
      await closeSubject(subject, connection);
    }
  });

  it('uses the configured initial attempt plus three identical retries', async () => {
    const subject = createSubject(500);
    let connection: McpConnection | undefined;

    try {
      connection = await connectInstrumentedRuntime(subject);
      await expect(subject.runtime.close()).resolves.toStrictEqual({
        ok: true,
        value: undefined,
      });
      expect(subject.reportedErrors).toStrictEqual(['posthog_client_delivery_failed']);
      expect(subject.requests).toHaveLength(4);
      const bodies = await Promise.all([
        parseLegacyBody(subject.requests[0]),
        parseLegacyBody(subject.requests[1]),
        parseLegacyBody(subject.requests[2]),
        parseLegacyBody(subject.requests[3]),
      ]);
      const firstBody = bodies[0];
      expect(bodies).toStrictEqual([firstBody, firstBody, firstBody, firstBody]);
      const batch = readBatch(firstBody);
      expect(batch).toHaveLength(1);
      const dynamic = readDynamicWireValues(batch[0]);
      const protocolVersion = dynamic.properties.$mcp_protocol_version;
      assert(typeof protocolVersion === 'string', 'Expected a negotiated MCP protocol');
      assert(
        SUPPORTED_PROTOCOL_VERSIONS.includes(protocolVersion),
        'Expected an SDK-supported MCP protocol',
      );
      expect(batch[0]).toStrictEqual({
        distinct_id: DISTINCT_ID,
        event: '$mcp_initialize',
        properties: {
          ...COMMON_PROPERTIES,
          $mcp_is_error: false,
          oak_client_family: 'chatgpt',
          oak_client_surface: 'other',
          $mcp_protocol_version: protocolVersion,
          ...expectedMcpSdkProperties(dynamic.libVersion),
        },
        timestamp: dynamic.timestamp,
        uuid: dynamic.uuid,
      });
      expectNoForbiddenContent(bodies);
    } finally {
      await closeSubject(subject, connection);
    }
  }, 30_000);
});
