import type { ResolvedRelease } from '@oaknational/build-metadata';
import type { ProductAnalyticsEvent, ProductAnalyticsSink } from '@oaknational/observability';
import { err, ok } from '@oaknational/result';
import type { EventMessage } from 'posthog-node';
import { assert, describe, expect, it, vi } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import {
  createPostHogProductAnalyticsSink,
  type PostHogProductAnalyticsSinkConfig,
} from './product-analytics-sink.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

const ACTOR_ID = 'user_sensitive_identity';
const DISTINCT_ID = 'oakph:v1:2026-07:PIfQfJcEc74jSWuy1nDltrZrud8sidpN0qAch9noHwU';
const SERVER_VERSION = '1.2.3';
const STARTED_AT_ISO = '2026-07-26T12:34:56.000Z';
const SERVED_RESOURCE_NAMES = ['lesson-guide', 'quiz-results'] as const;
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};

const EXPECTED_PROPERTIES = {
  $mcp_source: 'posthog_mcp_analytics',
  $mcp_server_name: 'oak-curriculum-http',
  $mcp_server_version: SERVER_VERSION,
  oak_environment: RELEASE.environment,
  oak_release: RELEASE.value,
  $mcp_resource_name: 'lesson-guide',
  $mcp_duration_ms: 17,
  $mcp_is_error: false,
} as const;

type CaptureImplementation = (event: EventMessage) => void;
type ReporterImplementation = (kind: PostHogOperationalErrorKind) => void;

interface SubjectOptions {
  readonly activeActorProjector?: ActivePostHogActorProjector;
  readonly capture?: CaptureImplementation;
  readonly reportOperationalError?: ReporterImplementation;
}

interface CaptureSpy {
  readonly mock: {
    readonly calls: readonly (readonly EventMessage[])[];
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

function validEvent(): ProductAnalyticsEvent {
  return {
    kind: 'mcp_resource_read',
    resourceName: 'lesson-guide',
    startedAt: new Date(STARTED_AT_ISO),
    durationMs: 17,
    isError: false,
  };
}

function createSubject(options: SubjectOptions = {}) {
  const capture = vi.fn<CaptureImplementation>(options.capture);
  const reportOperationalError = vi.fn<ReporterImplementation>(options.reportOperationalError);
  const activeActorProjector = options.activeActorProjector ?? createProjector();
  const sink = createPostHogProductAnalyticsSink(
    { capture },
    {
      release: RELEASE,
      serverVersion: SERVER_VERSION,
      servedResourceNames: SERVED_RESOURCE_NAMES,
      activeActorProjector,
      reportOperationalError,
    },
  );

  return { activeActorProjector, capture, reportOperationalError, sink };
}

function captureAtRuntime(sink: ProductAnalyticsSink, event: unknown, context: unknown): void {
  Reflect.apply(sink.capture, sink, [event, context]);
}

function onlyCapturedEvent(capture: CaptureSpy): EventMessage {
  const captured = capture.mock.calls.at(0)?.at(0);
  assert(captured, 'Expected one captured PostHog event');
  return captured;
}

describe('createPostHogProductAnalyticsSink integration', () => {
  it('captures one exact, profileless resource-read row from closed inputs', () => {
    const project = vi.fn<ActivePostHogActorProjector['project']>(() =>
      ok({
        environment: RELEASE.environment,
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
    );
    const {
      capture,
      reportOperationalError,
      sink: createdSink,
    } = createSubject({
      activeActorProjector: createProjector(project),
    });
    const sink: ProductAnalyticsSink = createdSink;
    const startedAt = new Date(STARTED_AT_ISO);
    const event = {
      kind: 'mcp_resource_read',
      resourceName: 'lesson-guide',
      startedAt,
      durationMs: 17,
      isError: false,
      rawActorId: ACTOR_ID,
      unknownProperty: { raw: ACTOR_ID },
    };
    const context = {
      verifiedActorId: ACTOR_ID,
      rawContext: { email: 'raw-email@example.test' },
    };

    captureAtRuntime(sink, event, context);

    expect(capture).toHaveBeenCalledOnce();
    const captured = onlyCapturedEvent(capture);
    expect(captured).toStrictEqual({
      distinctId: DISTINCT_ID,
      event: '$mcp_resource_read',
      timestamp: new Date(STARTED_AT_ISO),
      properties: EXPECTED_PROPERTIES,
    });
    expect(captured).not.toBe(event);
    expect(captured.timestamp).not.toBe(startedAt);
    expect(Object.hasOwn(captured, 'uuid')).toBe(false);
    expect(Object.hasOwn(captured.properties ?? {}, '$process_person_profile')).toBe(false);
    expect(JSON.stringify(captured)).not.toContain(ACTOR_ID);
    expect(JSON.stringify(captured)).not.toContain('raw-email');
    expect(project).toHaveBeenCalledOnce();
    expect(project).toHaveBeenCalledWith(ACTOR_ID);
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it.each([
    ['unknown resource', { ...validEvent(), resourceName: 'private-resource' }],
    ['invalid Date', { ...validEvent(), startedAt: new Date(Number.NaN) }],
    ['non-Date timestamp', { ...validEvent(), startedAt: STARTED_AT_ISO }],
    ['wrong event kind', { ...validEvent(), kind: 'mcp_tool_call' }],
  ])('drops a %s without a routine operational signal', (_label, event) => {
    const project = vi.fn<ActivePostHogActorProjector['project']>(() =>
      ok({
        environment: RELEASE.environment,
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
    );
    const { capture, reportOperationalError, sink } = createSubject({
      activeActorProjector: createProjector(project),
    });

    captureAtRuntime(sink, event, { verifiedActorId: ACTOR_ID });

    expect(capture).not.toHaveBeenCalled();
    expect(project).not.toHaveBeenCalled();
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it.each([
    ['NaN', Number.NaN],
    ['infinite', Number.POSITIVE_INFINITY],
    ['negative', -1],
    ['fractional', 1.5],
    ['unsafe', Number.MAX_SAFE_INTEGER + 1],
  ])('drops a %s duration without a routine operational signal', (_label, durationMs) => {
    const { capture, reportOperationalError, sink } = createSubject();

    captureAtRuntime(sink, { ...validEvent(), durationMs }, { verifiedActorId: ACTOR_ID });

    expect(capture).not.toHaveBeenCalled();
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it.each([
    ['missing', {}],
    ['non-string', { verifiedActorId: 42 }],
    ['empty', { verifiedActorId: '' }],
  ])('drops a %s verified actor without projection or signalling', (_label, context) => {
    const project = vi.fn<ActivePostHogActorProjector['project']>(() =>
      err({ kind: 'posthog_identity_projection_failed' }),
    );
    const { capture, reportOperationalError, sink } = createSubject({
      activeActorProjector: createProjector(project),
    });

    captureAtRuntime(sink, validEvent(), context);

    expect(capture).not.toHaveBeenCalled();
    expect(project).not.toHaveBeenCalled();
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it.each([
    ['an Err', () => err({ kind: 'posthog_identity_projection_failed' })],
    [
      'a throw',
      () => {
        assert.fail(`must-not-escape:${ACTOR_ID}`);
      },
    ],
    [
      'an environment mismatch',
      () =>
        ok({
          environment: 'preview' as const,
          keyId: '2026-07',
          distinctId: DISTINCT_ID,
        }),
    ],
    [
      'an empty distinct ID',
      () =>
        ok({
          environment: RELEASE.environment,
          keyId: '2026-07',
          distinctId: '',
        }),
    ],
  ] satisfies readonly [string, ActivePostHogActorProjector['project']][])(
    'drops projection result %s with one fixed content-free signal',
    (_label, project) => {
      const projection = vi.fn<ActivePostHogActorProjector['project']>(project);
      const { capture, reportOperationalError, sink } = createSubject({
        activeActorProjector: createProjector(projection),
      });

      expect(() => sink.capture(validEvent(), { verifiedActorId: ACTOR_ID })).not.toThrow();

      expect(capture).not.toHaveBeenCalled();
      expect(projection).toHaveBeenCalledOnce();
      expect(projection).toHaveBeenCalledWith(ACTOR_ID);
      expect(reportOperationalError).toHaveBeenCalledOnce();
      expect(reportOperationalError).toHaveBeenCalledWith('posthog_identity_projection_failed');
      expect(JSON.stringify(reportOperationalError.mock.calls)).not.toContain(ACTOR_ID);
    },
  );

  it('isolates a client capture throw and reports one fixed delivery signal', () => {
    const { capture, reportOperationalError, sink } = createSubject({
      capture: () => {
        assert.fail(`must-not-escape:${ACTOR_ID}`);
      },
    });

    expect(() => sink.capture(validEvent(), { verifiedActorId: ACTOR_ID })).not.toThrow();

    expect(capture).toHaveBeenCalledOnce();
    expect(reportOperationalError).toHaveBeenCalledOnce();
    expect(reportOperationalError).toHaveBeenCalledWith('posthog_client_delivery_failed');
    expect(JSON.stringify(reportOperationalError.mock.calls)).not.toContain(ACTOR_ID);
  });

  it('does not let a throwing operational reporter escape a capture failure', () => {
    const { capture, reportOperationalError, sink } = createSubject({
      capture: () => {
        assert.fail('capture-failed');
      },
      reportOperationalError: () => {
        assert.fail('reporter-failed');
      },
    });

    expect(() => sink.capture(validEvent(), { verifiedActorId: ACTOR_ID })).not.toThrow();

    expect(capture).toHaveBeenCalledOnce();
    expect(reportOperationalError).toHaveBeenCalledOnce();
    expect(reportOperationalError).toHaveBeenCalledWith('posthog_client_delivery_failed');
  });

  it('snapshots release, server version, and canonical resource names at creation', () => {
    const release: {
      value: string;
      source: ResolvedRelease['source'];
      environment: ResolvedRelease['environment'];
    } = {
      value: RELEASE.value,
      source: RELEASE.source,
      environment: RELEASE.environment,
    };
    const servedResourceNames: string[] = [...SERVED_RESOURCE_NAMES];
    const capture = vi.fn<CaptureImplementation>();
    const reportOperationalError = vi.fn<ReporterImplementation>();
    const config: PostHogProductAnalyticsSinkConfig & {
      serverVersion: string;
    } = {
      release,
      serverVersion: SERVER_VERSION,
      servedResourceNames,
      activeActorProjector: createProjector(),
      reportOperationalError,
    };
    const sink = createPostHogProductAnalyticsSink({ capture }, config);

    release.value = 'mutated-release';
    release.environment = 'preview';
    servedResourceNames.splice(0, servedResourceNames.length, 'mutated-resource');
    config.serverVersion = '9.9.9';

    sink.capture(validEvent(), { verifiedActorId: ACTOR_ID });
    captureAtRuntime(
      sink,
      { ...validEvent(), resourceName: 'mutated-resource' },
      { verifiedActorId: ACTOR_ID },
    );

    expect(capture).toHaveBeenCalledOnce();
    expect(onlyCapturedEvent(capture)).toStrictEqual({
      distinctId: DISTINCT_ID,
      event: '$mcp_resource_read',
      timestamp: new Date(STARTED_AT_ISO),
      properties: EXPECTED_PROPERTIES,
    });
    expect(reportOperationalError).not.toHaveBeenCalled();
  });

  it('captures a fresh snapshot unaffected by later event and context mutation', () => {
    const { capture, sink } = createSubject();
    const startedAt = new Date(STARTED_AT_ISO);
    const event = {
      kind: 'mcp_resource_read' as const,
      resourceName: 'lesson-guide',
      startedAt,
      durationMs: 17,
      isError: false,
    };
    const context = { verifiedActorId: ACTOR_ID };

    sink.capture(event, context);

    startedAt.setUTCFullYear(2030);
    event.resourceName = 'quiz-results';
    event.durationMs = 999;
    event.isError = true;
    context.verifiedActorId = 'mutated-actor';

    expect(onlyCapturedEvent(capture)).toStrictEqual({
      distinctId: DISTINCT_ID,
      event: '$mcp_resource_read',
      timestamp: new Date(STARTED_AT_ISO),
      properties: EXPECTED_PROPERTIES,
    });
  });
});
