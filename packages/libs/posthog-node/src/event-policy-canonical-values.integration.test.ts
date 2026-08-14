import type { ResolvedRelease } from '@oaknational/build-metadata';
import { ok } from '@oaknational/result';
import type { EventMessage } from 'posthog-node';
import { describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { createPostHogEventPolicies } from './event-policy.js';

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
  oak_client_surface: 'other',
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

function toolListEvent(listedToolNames: readonly string[]): EventMessage {
  return {
    distinctId: DISTINCT_ID,
    event: '$mcp_tools_list',
    properties: {
      ...COMMON_PROPERTIES,
      $mcp_duration_ms: 1,
      $mcp_is_error: false,
      $mcp_listed_tool_names: listedToolNames,
    },
    timestamp: new Date(CAPTURE_TIMESTAMP),
    uuid: EVENT_UUID_V7,
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
      policies.finalOakEventPolicy(toolListEvent(['beta', '_private', 'zeta', 'Alpha'])),
    ).toStrictEqual({
      distinctId: DISTINCT_ID,
      event: '$mcp_tools_list',
      properties: {
        ...COMMON_PROPERTIES,
        $mcp_duration_ms: 1,
        $mcp_is_error: false,
        $mcp_listed_tool_names: ['Alpha', '_private', 'beta', 'zeta'],
      },
      timestamp: new Date(CAPTURE_TIMESTAMP),
      uuid: EVENT_UUID_V7,
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
