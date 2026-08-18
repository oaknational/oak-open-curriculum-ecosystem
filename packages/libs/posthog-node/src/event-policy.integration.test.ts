import { SUPPORTED_PROTOCOL_VERSIONS } from '@modelcontextprotocol/sdk/types.js';
import type { ResolvedRelease } from '@oaknational/build-metadata';
import { err, ok } from '@oaknational/result';
import { FeatureFlagEvaluations, type EventMessage } from 'posthog-node';
import { describe, expect, it, vi } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import { createPostHogEventPolicies } from './event-policy.js';

const ACTOR_ID = 'user_sensitive_identity';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_NAME = 'oak-curriculum-http';
const SERVER_VERSION = '1.2.3';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};
const CAPTURE_TIMESTAMP = '2026-07-26T12:34:56.000Z';
const NODE_TIMESTAMP = new Date(CAPTURE_TIMESTAMP);
const EVENT_UUID = '0199e8f0-8abc-7def-8abc-123456789abc';
const SERVED_TOOL_NAMES = ['search', 'browse'] as const;
const SERVED_RESOURCE_NAMES = ['lesson-guide', 'quiz-results'] as const;

// Resource reads are Oak-constructed at the sink and never pass the transport
// observer, so their envelope carries no observer-derived client surface.
const RESOURCE_COMMON_PROPERTIES = {
  $mcp_source: 'posthog_mcp_analytics',
  $mcp_server_name: SERVER_NAME,
  $mcp_server_version: SERVER_VERSION,
  oak_environment: RELEASE.environment,
  oak_release: RELEASE.value,
} as const;
const COMMON_PROPERTIES = {
  ...RESOURCE_COMMON_PROPERTIES,
  oak_client_product: 'other',
  oak_client_surface: 'other',
} as const;

function authenticatedExtra(userId: unknown = ACTOR_ID): Record<string, unknown> {
  return {
    authInfo: {
      token: 'raw-token',
      clientId: 'raw-client-id',
      scopes: ['raw-scope'],
      extra: {
        userId,
        email: 'raw-email@example.test',
      },
    },
    headers: { authorization: 'Bearer raw-token' },
    sessionId: 'raw-session',
  };
}

function initialiseRequest(clientName: unknown): Record<string, unknown> {
  return {
    method: 'initialize',
    params: {
      clientInfo: {
        name: clientName,
        version: 'raw-client-version',
      },
    },
  };
}

function createProjector(
  project: ActivePostHogActorProjector['project'] = () =>
    ok({
      environment: RELEASE.environment,
      keyId: '2026-07',
      distinctId: DISTINCT_ID,
    }),
): ActivePostHogActorProjector {
  return { project };
}

interface SubjectOptions {
  readonly release?: ResolvedRelease;
  readonly servedToolNames?: readonly string[];
  readonly servedResourceNames?: readonly string[];
  readonly activeActorProjector?: ActivePostHogActorProjector;
}

function createSubject(options: SubjectOptions = {}) {
  const activeActorProjector = options.activeActorProjector ?? createProjector();
  const reportOperationalError = vi.fn();
  const policies = createPostHogEventPolicies({
    release: options.release ?? RELEASE,
    serverVersion: SERVER_VERSION,
    servedToolNames: options.servedToolNames ?? SERVED_TOOL_NAMES,
    servedResourceNames: options.servedResourceNames ?? SERVED_RESOURCE_NAMES,
    activeActorProjector,
    reportOperationalError,
  });

  return { activeActorProjector, policies, reportOperationalError };
}

function nodeEvent(event: string, properties: Readonly<Record<string, unknown>>): EventMessage {
  return {
    distinctId: DISTINCT_ID,
    event,
    properties: {
      ...COMMON_PROPERTIES,
      ...properties,
    },
    timestamp: NODE_TIMESTAMP,
    uuid: EVENT_UUID,
  };
}

function resourceReadEvent(properties: Readonly<Record<string, unknown>>): EventMessage {
  return {
    distinctId: DISTINCT_ID,
    event: '$mcp_resource_read',
    properties: {
      ...RESOURCE_COMMON_PROPERTIES,
      ...properties,
    },
    timestamp: NODE_TIMESTAMP,
    uuid: EVENT_UUID,
  };
}

describe('projectVerifiedIdentityAndRelease', () => {
  it('projects only the verified actor and release fields without retaining raw identity', () => {
    const project = vi.fn<ActivePostHogActorProjector['project']>(() =>
      ok({
        environment: RELEASE.environment,
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
    );
    const { policies } = createSubject({
      activeActorProjector: createProjector(project),
    });

    const result = policies.projectVerifiedIdentityAndRelease(
      { method: 'tools/call', params: { name: 'search', userId: 'request-user' } },
      {
        ...authenticatedExtra(),
        userId: 'top-level-user',
        authInfo: {
          token: 'token-user',
          clientId: 'client-user',
          scopes: ['scope-user'],
          userId: 'auth-info-user',
          extra: {
            userId: ACTOR_ID,
            actorId: 'alternate-user',
          },
        },
      },
    );

    expect(result).not.toBeInstanceOf(Promise);
    expect(result).toStrictEqual({
      __oak_posthog_distinct_id: DISTINCT_ID,
      oak_environment: RELEASE.environment,
      oak_release: RELEASE.value,
    });
    expect(project).toHaveBeenCalledOnce();
    expect(project).toHaveBeenCalledWith(ACTOR_ID);
    expect(JSON.stringify(result)).not.toContain(ACTOR_ID);
  });

  it.each([
    ['ChatGPT', 'chatgpt'],
    ['  CHATGPT / desktop  ', 'chatgpt'],
    ['chatgpt-web', 'chatgpt'],
    ['chatgptx', 'other'],
    ['chatgpt_web', 'other'],
    ['Claude', 'claude'],
    [' CLAUDE/code ', 'claude'],
    ['claude-desktop', 'claude'],
    ['claude.ai', 'other'],
    ['other-client', 'other'],
    [42, 'other'],
  ] as const)('normalises client family %j to %s', (clientName, expectedFamily) => {
    const { policies } = createSubject();

    expect(
      policies.projectVerifiedIdentityAndRelease(
        initialiseRequest(clientName),
        authenticatedExtra(),
      ),
    ).toStrictEqual({
      __oak_posthog_distinct_id: DISTINCT_ID,
      oak_environment: RELEASE.environment,
      oak_release: RELEASE.value,
      oak_client_family: expectedFamily,
    });
  });

  it.each([
    ['missing extra', undefined],
    ['missing auth info', { sessionId: 'raw-session' }],
    ['identity outside auth extra', { authInfo: { userId: ACTOR_ID } }],
    ['alternate identity in auth extra', { authInfo: { extra: { actorId: ACTOR_ID } } }],
    ['non-string verified identity', authenticatedExtra(42)],
  ])('drops %s without attempting projection', (_label, extra) => {
    const project = vi.fn<ActivePostHogActorProjector['project']>(() =>
      err({ kind: 'posthog_identity_projection_failed' }),
    );
    const { policies, reportOperationalError } = createSubject({
      activeActorProjector: createProjector(project),
    });

    expect(policies.projectVerifiedIdentityAndRelease({ method: 'tools/list' }, extra)).toBeNull();
    expect(project).not.toHaveBeenCalled();
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it('drops a projection failure and reports only its fixed operational code', () => {
    const activeActorProjector = createProjector(() =>
      err({ kind: 'posthog_identity_projection_failed' }),
    );
    const { policies, reportOperationalError } = createSubject({ activeActorProjector });

    expect(
      policies.projectVerifiedIdentityAndRelease({ method: 'tools/list' }, authenticatedExtra()),
    ).toBeNull();
    expect(reportOperationalError).toHaveBeenCalledOnce();
    expect(reportOperationalError).toHaveBeenCalledWith('posthog_identity_projection_failed');
    expect(JSON.stringify(reportOperationalError.mock.calls)).not.toContain(ACTOR_ID);
  });

  it('drops a projection for a different release environment with the same fixed signal', () => {
    const activeActorProjector = createProjector(() =>
      ok({
        environment: 'preview',
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
    );
    const { policies, reportOperationalError } = createSubject({ activeActorProjector });

    expect(
      policies.projectVerifiedIdentityAndRelease({ method: 'tools/list' }, authenticatedExtra()),
    ).toBeNull();
    expect(reportOperationalError).toHaveBeenCalledWith('posthog_identity_projection_failed');
  });
});

describe('finalOakEventPolicy integration', () => {
  it('independently reconstructs each automatic event and strips hostile fields', () => {
    const { policies } = createSubject();
    const examples = [
      {
        event: '$mcp_initialize',
        inputProperties: {
          $mcp_is_error: false,
          oak_client_family: 'claude',
          $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
        },
        expectedProperties: {
          $mcp_is_error: false,
          oak_client_family: 'claude',
          $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
        },
      },
      {
        event: '$mcp_tools_list',
        inputProperties: {
          $mcp_duration_ms: 8,
          $mcp_is_error: false,
          $mcp_listed_tool_names: ['private-tool', 'search', 'browse'],
        },
        expectedProperties: {
          $mcp_duration_ms: 8,
          $mcp_is_error: false,
          $mcp_listed_tool_names: ['browse', 'search'],
        },
      },
      {
        event: '$mcp_tool_call',
        inputProperties: {
          $mcp_tool_name: 'search',
          $mcp_duration_ms: 13,
          $mcp_is_error: true,
        },
        expectedProperties: {
          $mcp_tool_name: 'search',
          $mcp_duration_ms: 13,
          $mcp_is_error: true,
        },
      },
    ] as const;

    for (const example of examples) {
      const input = {
        ...nodeEvent(example.event, {
          ...example.inputProperties,
          $session_id: 'raw-session',
          $mcp_client_name: ACTOR_ID,
          $mcp_parameters: { raw: true },
          $mcp_response: { raw: true },
          $set: { raw: true },
          unknown_property: ACTOR_ID,
        }),
        groups: { organisation: 'raw-group' },
        flags: new FeatureFlagEvaluations({
          host: {
            captureFlagCalledEventIfNeeded: () => undefined,
            logWarning: () => undefined,
          },
          distinctId: DISTINCT_ID,
          flags: {},
        }),
        sendFeatureFlags: true,
        disableGeoip: false,
        unknownTopLevel: ACTOR_ID,
      };
      const inputBefore = JSON.stringify(input);

      const result = policies.finalOakEventPolicy(input);

      expect(result).not.toBeInstanceOf(Promise);
      expect(result).toStrictEqual(nodeEvent(example.event, example.expectedProperties));
      expect(JSON.stringify(input)).toBe(inputBefore);
      expect(JSON.stringify(result)).not.toContain(ACTOR_ID);
    }
  });

  it('accepts the closed unknown tool value produced by the instrumentation policy', () => {
    const { policies } = createSubject();
    const input = nodeEvent('$mcp_tool_call', {
      $mcp_tool_name: 'unknown',
      $mcp_duration_ms: 3,
      $mcp_is_error: false,
    });

    expect(policies.finalOakEventPolicy(input)).toStrictEqual(input);
  });

  it('accepts a canonical resource read and drops an unknown resource name', () => {
    const { policies } = createSubject();
    const canonical = resourceReadEvent({
      $mcp_resource_name: 'lesson-guide',
      $mcp_duration_ms: 21,
      $mcp_is_error: false,
    });
    const unknown = resourceReadEvent({
      $mcp_resource_name: 'private-resource',
      $mcp_duration_ms: 21,
      $mcp_is_error: false,
    });

    expect(policies.finalOakEventPolicy(canonical)).toStrictEqual(canonical);
    expect(policies.finalOakEventPolicy(unknown)).toBeNull();
  });

  it.each([
    ['null', null],
    ['$identify', nodeEvent('$identify', {})],
    ['$exception', nodeEvent('$exception', {})],
    ['unknown event', nodeEvent('custom_event', {})],
    [
      'wrong source',
      nodeEvent('$mcp_initialize', {
        ...COMMON_PROPERTIES,
        $mcp_source: 'another-source',
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      }),
    ],
    [
      'wrong server',
      nodeEvent('$mcp_initialize', {
        $mcp_server_name: 'another-server',
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      }),
    ],
    [
      'wrong server version',
      nodeEvent('$mcp_initialize', {
        $mcp_server_version: '0.0.0',
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      }),
    ],
    [
      'wrong release',
      nodeEvent('$mcp_initialize', {
        oak_release: 'another-release',
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        $mcp_protocol_version: SUPPORTED_PROTOCOL_VERSIONS[0],
      }),
    ],
    [
      'unsupported protocol',
      nodeEvent('$mcp_initialize', {
        $mcp_is_error: false,
        oak_client_family: 'chatgpt',
        $mcp_protocol_version: '1900-01-01',
      }),
    ],
    [
      'malformed duration',
      nodeEvent('$mcp_tools_list', {
        $mcp_duration_ms: -1,
        $mcp_is_error: false,
        $mcp_listed_tool_names: ['search'],
      }),
    ],
    [
      'invalid distinct ID',
      {
        ...nodeEvent('$mcp_tool_call', {
          $mcp_tool_name: 'search',
          $mcp_duration_ms: 1,
          $mcp_is_error: false,
        }),
        distinctId: 'raw-user-id',
      },
    ],
  ])('drops %s', (_label, input) => {
    const { policies } = createSubject();

    expect(policies.finalOakEventPolicy(input)).toBeNull();
  });
});

describe('policy configuration snapshots', () => {
  it('is unaffected by later release, tool-name, and resource-name mutations', () => {
    const release = {
      value: RELEASE.value,
      source: RELEASE.source,
      environment: RELEASE.environment,
    };
    const servedToolNames: string[] = [...SERVED_TOOL_NAMES];
    const servedResourceNames: string[] = [...SERVED_RESOURCE_NAMES];
    const { policies } = createSubject({
      release,
      servedToolNames,
      servedResourceNames,
    });

    release.value = 'mutated-release';
    release.environment = 'preview';
    servedToolNames.splice(0, servedToolNames.length, 'private-tool');
    servedResourceNames.splice(0, servedResourceNames.length, 'private-resource');

    function toolProperties(toolName: string): Record<string, unknown> {
      return {
        $mcp_tool_name: toolName,
        $mcp_duration_ms: 1,
        $mcp_is_error: false,
      };
    }
    function toolEvent(toolName: string): EventMessage {
      return nodeEvent('$mcp_tool_call', toolProperties(toolName));
    }
    function resourceEvent(resourceName: string): EventMessage {
      return resourceReadEvent({
        $mcp_resource_name: resourceName,
        $mcp_duration_ms: 1,
        $mcp_is_error: false,
      });
    }

    expect([
      policies.finalOakEventPolicy(toolEvent('search')),
      policies.finalOakEventPolicy(toolEvent('private-tool')),
      policies.finalOakEventPolicy(resourceEvent('lesson-guide')),
      policies.finalOakEventPolicy(resourceEvent('private-resource')),
    ]).toStrictEqual([
      toolEvent('search'),
      nodeEvent('$mcp_tool_call', {
        ...toolProperties('private-tool'),
        $mcp_tool_name: 'unknown',
      }),
      resourceEvent('lesson-guide'),
      null,
    ]);
  });
});
