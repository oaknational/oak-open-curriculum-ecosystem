import type { ResolvedRelease } from '@oaknational/build-metadata';
import { ok } from '@oaknational/result';
import type { BeforeSendFn } from '@posthog/mcp';
import type { EventMessage } from 'posthog-node';
import { describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { createPostHogEventPolicies } from './event-policy.js';

type InstrumentationEvent = Parameters<BeforeSendFn>[0];

const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const CAPTURE_TIMESTAMP = '2026-07-26T12:34:56.000Z';
const EVENT_UUID_V7 = '0199e8f0-8abc-7def-8abc-123456789abc';
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
  project: () =>
    ok({
      environment: RELEASE.environment,
      keyId: '2026-07',
      distinctId: DISTINCT_ID,
    }),
};

function createPolicies(servedToolNames: readonly string[]) {
  return createPostHogEventPolicies({
    release: RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames,
    servedResourceNames: [],
    activeActorProjector: ACTIVE_ACTOR_PROJECTOR,
    reportOperationalError: () => undefined,
  });
}

function instrumentationToolListEvent(listedToolNames: readonly string[]): InstrumentationEvent {
  return {
    distinct_id: 'vendor-session-identity',
    event: '$mcp_tools_list',
    properties: {
      ...COMMON_PROPERTIES,
      __oak_posthog_distinct_id: DISTINCT_ID,
      $mcp_duration_ms: 1,
      $mcp_is_error: false,
      $mcp_listed_tool_names: listedToolNames,
    },
    timestamp: CAPTURE_TIMESTAMP,
    type: 'capture',
  };
}

function toolCallEvent(uuid: string): EventMessage {
  return {
    distinctId: DISTINCT_ID,
    event: '$mcp_tool_call',
    properties: {
      ...COMMON_PROPERTIES,
      $mcp_tool_name: 'search',
      $mcp_duration_ms: 3,
      $mcp_is_error: false,
    },
    timestamp: new Date(CAPTURE_TIMESTAMP),
    uuid,
  };
}

describe('event-policy canonical value integration', () => {
  it('sorts canonical tool names by explicit code-unit order', () => {
    const policies = createPolicies(['zeta', 'Alpha', '_private', 'beta']);

    expect(
      policies.synchronousMcpEventPolicy(
        instrumentationToolListEvent(['beta', '_private', 'zeta', 'Alpha']),
      ),
    ).toStrictEqual({
      distinct_id: DISTINCT_ID,
      event: '$mcp_tools_list',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_duration_ms: 1,
        $mcp_is_error: false,
        $mcp_listed_tool_names: ['Alpha', '_private', 'beta', 'zeta'],
      },
      timestamp: CAPTURE_TIMESTAMP,
      type: 'capture',
    });
  });

  it('accepts an RFC-variant UUIDv7 event identifier', () => {
    const policies = createPolicies(['search']);
    const input = toolCallEvent(EVENT_UUID_V7);

    expect(policies.finalOakEventPolicy(input)).toStrictEqual(input);
  });

  it.each([
    ['UUIDv4', '550e8400-e29b-41d4-a716-446655440000'],
    ['nil UUID', '00000000-0000-0000-0000-000000000000'],
    ['UUIDv7 with a non-RFC variant', '0199e8f0-8abc-7def-7abc-123456789abc'],
  ])('drops an event carrying %s', (_label, uuid) => {
    const policies = createPolicies(['search']);

    expect(policies.finalOakEventPolicy(toolCallEvent(uuid))).toBeNull();
  });
});
