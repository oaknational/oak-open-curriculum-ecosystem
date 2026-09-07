/**
 * Integration tests for the boot-failure reporting seam.
 *
 * These drive the real shared bootstrap reporter and the real ADR-160
 * redaction barrier against an injected recording SDK. Only the vendor
 * transport, the deadline, and the announcement sink are fakes.
 *
 * The state described here is the app's, not the reporter's: **whatever
 * the reporter does, this boundary refuses with the configuration
 * failure's own message, and it reports at most once per isolate.** The
 * reporter's own outcome values are described at its own boundary in
 * `packages/libs/sentry-node/src/bootstrap-reporter.integration.test.ts`.
 */
import type { CaptureContext, NodeOptions } from '@sentry/node';
import { err, type Result } from '@oaknational/result';
import type { SentryNodeSdk } from '@oaknational/sentry-node';
import { describe, expect, it } from 'vitest';
import { createBootFailureReportingLoader, type LoadOrReportDeps } from './boot-failure-report.js';
import {
  resolveProductAnalyticsConfig,
  type ProductAnalyticsBootstrap,
} from './product-analytics-config.js';
import type { ConfigError } from './runtime-config-support.js';

const CANARY = 'oak-canary-6b21e0f4d7';
const REDACTION_MARKER = '[REDACTED]';
const SERVICE_NAME = 'oak-curriculum-mcp-streamable-http';

/**
 * A distinctive injected refusal. Most arms here prove the Sentry seam,
 * not the resolver, so they must not be coupled to the resolver's wording
 * — only the composition arm below uses the real thing.
 */
const BOUNDARY_MESSAGE = 'injected configuration refusal — seam fixture';

const liveSentryEnv = {
  SENTRY_MODE: 'sentry',
  SENTRY_DSN: 'https://public@o1.ingest.sentry.io/2',
  VERCEL_ENV: 'preview',
};

function failingLoad(message = BOUNDARY_MESSAGE): Result<ProductAnalyticsBootstrap, ConfigError> {
  return err({ message, diagnostics: [] });
}

/** The real resolver, refusing for real — used by the composition arm only. */
function loadWithMalformedKeyring(): Result<ProductAnalyticsBootstrap, ConfigError> {
  return resolveProductAnalyticsConfig({
    OBSERVABILITY_SINKS: ['sentry', 'posthog'],
    POSTHOG_PROJECT_API_KEY: 'phc_test_project_key',
    POSTHOG_HOST: 'https://eu.i.posthog.com',
    POSTHOG_PSEUDONYM_ACTIVE_KEY_ID: 'k2026_01',
    POSTHOG_PSEUDONYM_KEYRING: 'not json',
  });
}

interface ExceptionCall {
  readonly error: Error;
  readonly context?: CaptureContext;
}

interface RecordingSdk {
  readonly sdk: SentryNodeSdk;
  readonly initCalls: readonly NodeOptions[];
  readonly exceptionCalls: readonly ExceptionCall[];
  readonly flushTimeouts: readonly (number | undefined)[];
  readonly interactionCount: () => number;
}

interface RecordingSdkBehaviour {
  readonly onInit?: () => void;
  readonly onCapture?: () => void;
  readonly flush?: () => Promise<boolean>;
}

function createRecordingSdk(behaviour: RecordingSdkBehaviour = {}): RecordingSdk {
  const initCalls: NodeOptions[] = [];
  const exceptionCalls: ExceptionCall[] = [];
  const flushTimeouts: (number | undefined)[] = [];
  const noop = (): void => {
    /* not exercised by the bootstrap path */
  };

  const sdk: SentryNodeSdk = {
    init(options) {
      initCalls.push(options);
      behaviour.onInit?.();
    },
    captureException(error, context) {
      exceptionCalls.push({ error, context });
      behaviour.onCapture?.();
    },
    captureMessage: noop,
    async flush(timeoutMs) {
      flushTimeouts.push(timeoutMs);
      return await (behaviour.flush?.() ?? Promise.resolve(true));
    },
    async close() {
      return true;
    },
    setUser: noop,
    setTag: noop,
    setContext: noop,
    logger: { trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop },
  };

  return {
    sdk,
    initCalls,
    exceptionCalls,
    flushTimeouts,
    interactionCount: () => initCalls.length + exceptionCalls.length + flushTimeouts.length,
  };
}

function neverSettlingFlush(): Promise<boolean> {
  return new Promise<boolean>(() => {
    /* intentionally never settles */
  });
}

function neverDeadline(): Promise<void> {
  return new Promise<void>(() => {
    /* intentionally never settles */
  });
}

async function expiredDeadline(): Promise<void> {
  return await Promise.resolve();
}

interface Harness {
  readonly load: <TLoaded>(deps: LoadOrReportDeps<TLoaded>) => Promise<TLoaded>;
  readonly announced: readonly string[];
  readonly deps: (
    overrides?: Partial<LoadOrReportDeps<ProductAnalyticsBootstrap>>,
  ) => LoadOrReportDeps<ProductAnalyticsBootstrap>;
}

/** One isolate's loader, with the announcement sink captured. */
function createHarness(sdk: SentryNodeSdk): Harness {
  const announced: string[] = [];
  const load = createBootFailureReportingLoader();

  return {
    load,
    announced,
    deps: (overrides = {}) => ({
      load: () => failingLoad(),
      env: liveSentryEnv,
      serviceName: SERVICE_NAME,
      waitForDeadline: neverDeadline,
      announce: (line: string) => announced.push(line),
      sentrySdk: sdk,
      ...overrides,
    }),
  };
}

describe('the boot-failure seam — the healthy path', () => {
  it('returns the loaded value and never touches the reporter', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);
    const bootstrap: ProductAnalyticsBootstrap = { selected: false };

    const loaded = await harness.load(
      harness.deps({ load: () => ({ ok: true, value: bootstrap }) }),
    );

    expect(loaded).toBe(bootstrap);
    expect(recording.interactionCount()).toBe(0);
    expect(harness.announced).toEqual([]);
  });
});

describe('the boot-failure seam — a configuration failure reaches Sentry', () => {
  it('captures the real resolver refusal, naming the failing key and its guard', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps({ load: loadWithMalformedKeyring }))).rejects.toThrow(
      'POSTHOG_PSEUDONYM_KEYRING is not valid JSON',
    );

    expect(recording.exceptionCalls).toHaveLength(1);
    expect(recording.exceptionCalls[0]?.error.message).toContain('POSTHOG_PSEUDONYM_KEYRING');
    expect(recording.exceptionCalls[0]?.error.message).toContain('is not valid JSON');
  });

  it('reports the refusal message across the seam without transforming it', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps())).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(recording.exceptionCalls[0]?.error.message).toBe(BOUNDARY_MESSAGE);
  });

  it('marks the event as a boot failure under this service', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps())).rejects.toThrow();

    expect(recording.initCalls[0]?.initialScope).toMatchObject({
      tags: { service: SERVICE_NAME, 'oak.boot_failure': 'true' },
    });
  });

  it('reports once per isolate, however many requests retry the failing load', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps())).rejects.toThrow(BOUNDARY_MESSAGE);
    await expect(harness.load(harness.deps())).rejects.toThrow(BOUNDARY_MESSAGE);
    await expect(harness.load(harness.deps())).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(recording.initCalls).toHaveLength(1);
    expect(recording.exceptionCalls).toHaveLength(1);
    expect(recording.flushTimeouts).toHaveLength(1);
    expect(harness.announced).toHaveLength(1);
  });

  it('gives a fresh isolate its own single report', async () => {
    const recording = createRecordingSdk();
    const first = createHarness(recording.sdk);
    const second = createHarness(recording.sdk);

    await expect(first.load(first.deps())).rejects.toThrow(BOUNDARY_MESSAGE);
    await expect(second.load(second.deps())).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(recording.initCalls).toHaveLength(2);
  });
});

describe('the boot-failure seam — what the reporter did is announced', () => {
  it.each([
    ['a completed flush', {}, neverDeadline, 'captured, flush completed'],
    [
      'an abandoned flush',
      { flush: neverSettlingFlush },
      expiredDeadline,
      'captured, flush abandoned',
    ],
    [
      'a failed capture',
      {
        onCapture: (): never => {
          throw new Error('capture exploded');
        },
      },
      neverDeadline,
      'capture failed',
    ],
  ])('announces %s beside the refusal', async (_label, behaviour, deadline, expected) => {
    const recording = createRecordingSdk(behaviour);
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps({ waitForDeadline: deadline }))).rejects.toThrow(
      BOUNDARY_MESSAGE,
    );

    expect(harness.announced[0]).toContain(expected);
  });

  it('announces why it stayed silent, so silence is never ambiguous', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(
      harness.load(harness.deps({ env: { ...liveSentryEnv, SENTRY_MODE: 'off' } })),
    ).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(harness.announced[0]).toContain('not sent (mode_not_live)');
  });

  it('never puts the boundary error into the announcement', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(
      harness.load(harness.deps({ load: () => failingLoad(`Bearer ${CANARY}`) })),
    ).rejects.toThrow(CANARY);

    expect(harness.announced.join('\n')).not.toContain(CANARY);
  });
});

describe('the boot-failure seam — modes that must stay silent', () => {
  it.each([
    ['off', { ...liveSentryEnv, SENTRY_MODE: 'off' }],
    ['fixture', { ...liveSentryEnv, SENTRY_MODE: 'fixture' }],
    ['an unset mode', { SENTRY_DSN: liveSentryEnv.SENTRY_DSN }],
  ])('makes no transport interaction in %s mode, and still refuses', async (_label, env) => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps({ env }))).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(recording.interactionCount()).toBe(0);
  });

  it('stays silent on Sentry inputs the shared schema rejects, and still refuses', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(
      harness.load(harness.deps({ env: { ...liveSentryEnv, SENTRY_MODE: 'disabled' } })),
    ).rejects.toThrow(BOUNDARY_MESSAGE);

    expect(recording.interactionCount()).toBe(0);
  });
});

describe('the boot-failure seam — the reporter never masks the boundary error', () => {
  it.each([
    [
      'reporter initialisation throws',
      {
        onInit: (): never => {
          throw new Error('sdk init exploded');
        },
      },
      neverDeadline,
    ],
    [
      'capture throws',
      {
        onCapture: (): never => {
          throw new Error('capture exploded');
        },
      },
      neverDeadline,
    ],
    [
      'flush rejects',
      { flush: async (): Promise<boolean> => await Promise.reject(new Error('transport down')) },
      neverDeadline,
    ],
    [
      'flush reports a timeout',
      { flush: async (): Promise<boolean> => await Promise.resolve(false) },
      neverDeadline,
    ],
    ['flush never settles', { flush: neverSettlingFlush }, expiredDeadline],
    [
      'the deadline seam itself rejects',
      { flush: neverSettlingFlush },
      async (): Promise<void> => await Promise.reject(new Error('deadline seam exploded')),
    ],
  ])('propagates the original error unchanged when %s', async (_label, behaviour, deadline) => {
    const recording = createRecordingSdk(behaviour);
    const harness = createHarness(recording.sdk);

    await expect(harness.load(harness.deps({ waitForDeadline: deadline }))).rejects.toThrow(
      BOUNDARY_MESSAGE,
    );
  });
});

describe('the boot-failure seam — the redaction barrier holds at this boundary', () => {
  it('never lets a canary in the failure message reach the SDK', async () => {
    const recording = createRecordingSdk();
    const harness = createHarness(recording.sdk);

    await expect(
      harness.load(harness.deps({ load: () => failingLoad(`boot refused: Bearer ${CANARY}`) })),
    ).rejects.toThrow(CANARY);

    const captured = recording.exceptionCalls[0]?.error.message ?? '';
    expect(captured).toContain(REDACTION_MARKER);
    expect(captured).not.toContain(CANARY);
  });
});
