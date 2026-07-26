import type { ResolvedRelease } from '@oaknational/build-metadata';
import { ok } from '@oaknational/result';
import type { MCPAnalyticsOptions } from '@posthog/mcp';
import { assert, describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import type { PostHogEventPolicyConfig } from './event-policy.js';
import { createPostHogMcpServerInstrumenter } from './mcp-server-instrumenter.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

const ACTOR_ID = 'user_sensitive_identity';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const CAPTURE_TIMESTAMP = '2026-07-26T12:34:56.000Z';
const CLIENT = { kind: 'posthog-client' } as const;
const ANALYTICS_HANDLE = { kind: 'discarded-analytics-handle' } as const;
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const EXPECTED_OPTION_KEYS = [
  'reportMissing',
  'enableConversationId',
  'enableExceptionAutocapture',
  'context',
  'beforeSend',
  'eventProperties',
] as const;
const FORBIDDEN_OPTION_KEYS = [
  'identify',
  'logger',
  'intentFallback',
  'group',
  'groups',
  'capture',
  'customCapture',
  'missingCapabilityToolName',
] as const;

type FakeClient = typeof CLIENT;
type Mutable<T> = { -readonly [Key in keyof T]: T[Key] };

interface InstrumentCall {
  readonly server: unknown;
  readonly client: FakeClient;
  readonly options: MCPAnalyticsOptions;
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

function createRecordingInstrument(calls: InstrumentCall[]) {
  return (server: unknown, client: FakeClient, options: MCPAnalyticsOptions): unknown => {
    calls.push({ server, client, options });
    return ANALYTICS_HANDLE;
  };
}

function callAt(calls: readonly InstrumentCall[], index: number): InstrumentCall {
  const call = calls.at(index);
  assert(call, `Expected instrument call at index ${index}`);
  return call;
}

function mutatePolicyInputs(
  release: Mutable<ResolvedRelease>,
  servedToolNames: string[],
  servedResourceNames: string[],
): void {
  release.value = 'mutated-release';
  release.environment = 'preview';
  servedToolNames.splice(0, servedToolNames.length, 'private-tool');
  servedResourceNames.splice(0, servedResourceNames.length, 'private-resource');
}

describe('createPostHogMcpServerInstrumenter collaborator integration', () => {
  it('instruments each fresh server once with only the closed official options', () => {
    const calls: InstrumentCall[] = [];
    const instrumenter = createPostHogMcpServerInstrumenter<object, FakeClient>(
      CLIENT,
      createConfig(),
      createRecordingInstrument(calls),
    );
    const firstServer = {};
    const secondServer = {};

    const result = instrumenter.instrument(firstServer);
    instrumenter.instrument(firstServer);
    instrumenter.instrument(secondServer);

    expect(result).toBeUndefined();
    expect(calls).toHaveLength(2);
    expect(calls.map(({ server }) => server)).toStrictEqual([firstServer, secondServer]);
    expect(calls.map(({ client }) => client)).toStrictEqual([CLIENT, CLIENT]);

    const options = callAt(calls, 0).options;
    expect(options).toMatchObject({
      reportMissing: false,
      enableConversationId: false,
      enableExceptionAutocapture: false,
      context: false,
    });
    expect(typeof options.beforeSend).toBe('function');
    expect(typeof options.eventProperties).toBe('function');
    expect(Object.keys(options)).toStrictEqual(EXPECTED_OPTION_KEYS);
    expect(FORBIDDEN_OPTION_KEYS.filter((key) => Object.hasOwn(options, key))).toStrictEqual([]);
  });

  it('wires synchronous snapshotted identity and event policies', () => {
    const release: Mutable<ResolvedRelease> = {
      value: RELEASE.value,
      source: RELEASE.source,
      environment: RELEASE.environment,
    };
    const servedToolNames = ['search', 'browse'];
    const servedResourceNames = ['lesson-guide'];
    const calls: InstrumentCall[] = [];
    const config: PostHogEventPolicyConfig = {
      release,
      serverVersion: SERVER_VERSION,
      servedToolNames,
      servedResourceNames,
      activeActorProjector: createProjector(),
      reportOperationalError: () => undefined,
    };
    const instrumenter = createPostHogMcpServerInstrumenter<object, FakeClient>(
      CLIENT,
      config,
      createRecordingInstrument(calls),
    );

    mutatePolicyInputs(release, servedToolNames, servedResourceNames);
    instrumenter.instrument({});

    const { beforeSend, eventProperties } = callAt(calls, 0).options;
    assert(beforeSend);
    assert(eventProperties);
    const projected = eventProperties(
      { method: 'tools/call' },
      { authInfo: { extra: { userId: ACTOR_ID } } },
    );
    expect(projected).not.toBeInstanceOf(Promise);
    expect(projected).toStrictEqual({
      __oak_posthog_distinct_id: DISTINCT_ID,
      oak_environment: RELEASE.environment,
      oak_release: RELEASE.value,
    });
    expect(eventProperties({ method: 'tools/call' })).toBeNull();

    const accepted = beforeSend({
      distinct_id: 'vendor-session-identity',
      event: '$mcp_tool_call',
      properties: {
        $mcp_source: 'posthog_mcp_analytics',
        $mcp_server_name: 'oak-curriculum-http',
        $mcp_server_version: SERVER_VERSION,
        oak_environment: RELEASE.environment,
        oak_release: RELEASE.value,
        __oak_posthog_distinct_id: DISTINCT_ID,
        $mcp_tool_name: 'search',
        $mcp_duration_ms: 17,
        $mcp_is_error: false,
        raw_payload: ACTOR_ID,
      },
      timestamp: CAPTURE_TIMESTAMP,
      type: 'capture',
    });

    expect(accepted).not.toBeInstanceOf(Promise);
    expect(accepted).toStrictEqual({
      distinct_id: DISTINCT_ID,
      event: '$mcp_tool_call',
      properties: {
        $mcp_source: 'posthog_mcp_analytics',
        $mcp_server_name: 'oak-curriculum-http',
        $mcp_server_version: SERVER_VERSION,
        oak_environment: RELEASE.environment,
        oak_release: RELEASE.value,
        $mcp_tool_name: 'search',
        $mcp_duration_ms: 17,
        $mcp_is_error: false,
      },
      timestamp: CAPTURE_TIMESTAMP,
      type: 'capture',
    });
  });

  it('isolates vendor and reporter throws while marking the server attempted', () => {
    const sensitiveDetails = `must-not-report:${ACTOR_ID}`;
    const reportedErrors: PostHogOperationalErrorKind[] = [];
    let attempts = 0;
    const config = createConfig((kind) => {
      reportedErrors.push(kind);
      assert.fail(sensitiveDetails);
    });
    const failingInstrument = (): never => {
      attempts += 1;
      assert.fail(sensitiveDetails);
    };
    const instrumenter = createPostHogMcpServerInstrumenter<object, FakeClient>(
      CLIENT,
      config,
      failingInstrument,
    );
    const server = {};

    expect(() => instrumenter.instrument(server)).not.toThrow();
    expect(() => instrumenter.instrument(server)).not.toThrow();

    expect(attempts).toBe(1);
    expect(reportedErrors).toStrictEqual(['posthog_event_policy_failed']);
    expect(JSON.stringify(reportedErrors)).not.toContain(ACTOR_ID);
  });
});
