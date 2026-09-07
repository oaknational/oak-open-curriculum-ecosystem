/**
 * Integration tests for the bootstrap failure reporter.
 *
 * The reporter composes the shared env schema, DSN validation, environment
 * resolution, the ADR-160 redaction barrier, and the injected SDK seam —
 * several units at a boundary, so these are integration tests rather than
 * unit tests.
 *
 * Every arm drives the public `reportBootstrapFailure` boundary and observes
 * what the injected SDK was asked to do. No ambient state, no timers, no
 * `process.env`: the deadline is an injected seam.
 */
import type { CaptureContext, ErrorEvent, EventHint, NodeOptions } from '@sentry/node';
import { describe, expect, it } from 'vitest';
import {
  BOOTSTRAP_REPORT_DEADLINE_MS,
  reportBootstrapFailure,
  type BootstrapReportInput,
  type BootstrapReportOutcome,
} from './bootstrap-reporter.js';
import type { SentryNodeSdk } from './types.js';

const CANARY = 'oak-canary-3f9d2b7c9e';
const REDACTION_MARKER = '[REDACTED]';

const liveEnv = {
  SENTRY_MODE: 'sentry',
  SENTRY_DSN: 'https://public@o1.ingest.sentry.io/2',
  VERCEL_ENV: 'preview',
};

interface ExceptionCall {
  readonly error: Error;
  readonly context?: CaptureContext;
}

interface RecordingSdk {
  readonly sdk: SentryNodeSdk;
  readonly initCalls: readonly NodeOptions[];
  readonly exceptionCalls: readonly ExceptionCall[];
  readonly flushTimeouts: readonly (number | undefined)[];
  /** Every interaction the reporter had with the SDK, in order. */
  readonly interactions: readonly string[];
}

interface RecordingSdkBehaviour {
  readonly onInit?: () => void;
  readonly onCapture?: () => void;
  readonly flush?: () => Promise<boolean>;
}

/** A simple recording fake of the SDK boundary — no engine modelling. */
function createRecordingSdk(behaviour: RecordingSdkBehaviour = {}): RecordingSdk {
  const initCalls: NodeOptions[] = [];
  const exceptionCalls: ExceptionCall[] = [];
  const flushTimeouts: (number | undefined)[] = [];
  const interactions: string[] = [];
  const record = (name: string) => (): void => {
    interactions.push(name);
  };

  const sdk: SentryNodeSdk = {
    init(options) {
      interactions.push('init');
      initCalls.push(options);
      behaviour.onInit?.();
    },
    captureException(error, context) {
      interactions.push('captureException');
      exceptionCalls.push({ error, context });
      behaviour.onCapture?.();
    },
    captureMessage: record('captureMessage'),
    async flush(timeoutMs) {
      interactions.push('flush');
      flushTimeouts.push(timeoutMs);
      return await (behaviour.flush?.() ?? Promise.resolve(true));
    },
    async close() {
      interactions.push('close');
      return true;
    },
    setUser: record('setUser'),
    setTag: record('setTag'),
    setContext: record('setContext'),
    logger: {
      trace: record('logger.trace'),
      debug: record('logger.debug'),
      info: record('logger.info'),
      warn: record('logger.warn'),
      error: record('logger.error'),
      fatal: record('logger.fatal'),
    },
  };

  return { sdk, initCalls, exceptionCalls, flushTimeouts, interactions };
}

/** A flush that never settles — the deadline must end the wait. */
function neverSettlingFlush(): Promise<boolean> {
  return new Promise<boolean>(() => {
    /* intentionally never settles */
  });
}

/** Deadline that never fires — the flush outcome decides the race. */
function neverDeadline(): Promise<void> {
  return new Promise<void>(() => {
    /* intentionally never settles */
  });
}

/** Deadline that has already expired — the budget decides the race. */
async function expiredDeadline(): Promise<void> {
  return await Promise.resolve();
}

async function report(
  overrides: Partial<BootstrapReportInput> & { readonly sdk: SentryNodeSdk },
): Promise<BootstrapReportOutcome> {
  return await reportBootstrapFailure({
    env: liveEnv,
    serviceName: 'oak-service-under-test',
    boundaryError: new Error('invalid PostHog product-analytics configuration'),
    waitForDeadline: neverDeadline,
    ...overrides,
  });
}

describe('reportBootstrapFailure — activation gate', () => {
  it('reports through the injected SDK when live mode is selected with a usable DSN', async () => {
    const recording = createRecordingSdk();

    const outcome = await report({ sdk: recording.sdk });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: true });
    expect(recording.initCalls[0]?.dsn).toBe(liveEnv.SENTRY_DSN);
    expect(recording.initCalls[0]?.environment).toBe(liveEnv.VERCEL_ENV);
  });

  it('carries the boundary error message to the destination', async () => {
    const recording = createRecordingSdk();
    const boundaryError = new Error('POSTHOG_PSEUDONYM_KEYRING is not valid JSON');

    await report({ sdk: recording.sdk, boundaryError });

    expect(recording.exceptionCalls[0]?.error.message).toBe(boundaryError.message);
  });

  it.each([
    ['off', 'off'],
    ['fixture', 'fixture'],
  ])('stays authoritative in %s mode — no interaction at all', async (_label, mode) => {
    const recording = createRecordingSdk();

    const outcome = await report({ sdk: recording.sdk, env: { ...liveEnv, SENTRY_MODE: mode } });

    expect(outcome).toEqual({ attempted: false, reason: 'mode_not_live' });
    expect(recording.interactions).toEqual([]);
  });

  it('treats an absent SENTRY_MODE as the schema default, which is not live', async () => {
    const recording = createRecordingSdk();

    const outcome = await report({
      sdk: recording.sdk,
      env: { SENTRY_DSN: liveEnv.SENTRY_DSN },
    });

    expect(outcome).toEqual({ attempted: false, reason: 'mode_not_live' });
    expect(recording.interactions).toEqual([]);
  });

  it.each([
    ['an unknown SENTRY_MODE', { SENTRY_MODE: 'disabled' }],
    ['a non-boolean SENTRY_ENABLE_LOGS', { SENTRY_ENABLE_LOGS: 'yes' }],
    ['a non-boolean SENTRY_DEBUG', { SENTRY_DEBUG: '1' }],
    ['a non-boolean SENTRY_SEND_DEFAULT_PII', { SENTRY_SEND_DEFAULT_PII: 'TRUE' }],
  ])('stays silent on %s, adding no failure of its own', async (_label, invalid) => {
    const recording = createRecordingSdk();

    const outcome = await report({ sdk: recording.sdk, env: { ...liveEnv, ...invalid } });

    expect(outcome).toEqual({ attempted: false, reason: 'sentry_env_rejected' });
    expect(recording.interactions).toEqual([]);
  });

  it.each([
    ['an absent DSN', undefined],
    ['a blank DSN', '   '],
    ['a non-URL DSN', 'not-a-dsn'],
    ['a non-HTTP DSN', 'ftp://public@o1.ingest.sentry.io/2'],
  ])('stays silent in live mode with %s', async (_label, dsn) => {
    const recording = createRecordingSdk();

    const outcome = await report({ sdk: recording.sdk, env: { ...liveEnv, SENTRY_DSN: dsn } });

    expect(outcome).toEqual({ attempted: false, reason: 'dsn_unusable' });
    expect(recording.interactions).toEqual([]);
  });
});

describe('reportBootstrapFailure — bounded attempt', () => {
  it('touches the SDK exactly three times: one init, one capture, one flush', async () => {
    const recording = createRecordingSdk();

    await report({ sdk: recording.sdk });

    expect(recording.interactions).toEqual(['init', 'captureException', 'flush']);
  });

  it('does not retry when the flush reports a timeout', async () => {
    const recording = createRecordingSdk({ flush: async () => await Promise.resolve(false) });

    const outcome = await report({ sdk: recording.sdk });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: false });
    expect(recording.interactions).toEqual(['init', 'captureException', 'flush']);
  });

  it('hands the SDK the whole deadline as its own flush budget', async () => {
    const recording = createRecordingSdk();

    await report({ sdk: recording.sdk });

    expect(recording.flushTimeouts).toEqual([BOOTSTRAP_REPORT_DEADLINE_MS]);
  });

  it('abandons a flush that never settles once the deadline expires', async () => {
    const recording = createRecordingSdk({ flush: neverSettlingFlush });

    const outcome = await report({ sdk: recording.sdk, waitForDeadline: expiredDeadline });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: false });
  });

  it('survives a flush that rejects', async () => {
    const recording = createRecordingSdk({
      flush: async () => await Promise.reject(new Error('transport down')),
    });

    const outcome = await report({ sdk: recording.sdk });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: false });
  });

  it('survives a deadline seam that rejects', async () => {
    const recording = createRecordingSdk({ flush: neverSettlingFlush });

    const outcome = await report({
      sdk: recording.sdk,
      waitForDeadline: async () => await Promise.reject(new Error('deadline seam exploded')),
    });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: false });
  });

  it('survives a deadline seam that throws synchronously', async () => {
    const recording = createRecordingSdk({ flush: neverSettlingFlush });

    const outcome = await report({
      sdk: recording.sdk,
      waitForDeadline: (): Promise<void> => {
        throw new Error('deadline seam exploded');
      },
    });

    expect(outcome).toEqual({ attempted: true, captured: true, flushed: false });
  });

  it('survives SDK initialisation throwing, and never reaches capture or flush', async () => {
    const recording = createRecordingSdk({
      onInit: () => {
        throw new Error('sdk init exploded');
      },
    });

    const outcome = await report({ sdk: recording.sdk });

    expect(outcome).toEqual({ attempted: true, captured: false });
    expect(recording.interactions).toEqual(['init']);
  });

  it('survives capture throwing, and never reaches flush', async () => {
    const recording = createRecordingSdk({
      onCapture: () => {
        throw new Error('capture exploded');
      },
    });

    const outcome = await report({ sdk: recording.sdk });

    expect(outcome).toEqual({ attempted: true, captured: false });
    expect(recording.interactions).toEqual(['init', 'captureException']);
  });
});

describe('reportBootstrapFailure — redaction barrier', () => {
  it('redacts a canary in the boundary message before the SDK ever sees it', async () => {
    const recording = createRecordingSdk();

    await report({
      sdk: recording.sdk,
      boundaryError: new Error(`upstream refused Bearer ${CANARY}`),
    });

    const captured = recording.exceptionCalls[0]?.error.message ?? '';
    expect(captured).toContain(REDACTION_MARKER);
    expect(captured).not.toContain(CANARY);
  });

  it('redacts a canary in the boundary stack before the SDK ever sees it', async () => {
    const recording = createRecordingSdk();
    const boundaryError = new Error('boot refused');
    boundaryError.stack = `Error: boot refused\n    at load (/app/run?token=${CANARY}:1:1)`;

    await report({ sdk: recording.sdk, boundaryError });

    const stack = recording.exceptionCalls[0]?.error.stack ?? '';
    // A secret inside a URL is redacted by the URL barrier, which
    // percent-encodes the marker it substitutes — hence the shape-tolerant
    // match. The load-bearing assertion is the second one.
    expect(stack).toMatch(/REDACTED/u);
    expect(stack).not.toContain(CANARY);
  });

  it('redacts an operator-supplied release before it reaches the tags', async () => {
    const recording = createRecordingSdk();

    await report({
      sdk: recording.sdk,
      env: { ...liveEnv, SENTRY_RELEASE_OVERRIDE: `Bearer ${CANARY}` },
    });

    // `beforeSend` sanitises event content, and reaches neither the
    // top-level `release` option nor the tag set — so an operator-supplied
    // release has to be redacted where it enters the config.
    const serialised = JSON.stringify([recording.initCalls[0], recording.exceptionCalls[0]]);
    expect(serialised).toContain(REDACTION_MARKER);
    expect(serialised).not.toContain(CANARY);
  });

  it('wires the shared beforeSend barrier, so a canary added at the SDK is redacted too', async () => {
    const recording = createRecordingSdk();

    await report({ sdk: recording.sdk });

    const beforeSend = recording.initCalls[0]?.beforeSend;
    expect(beforeSend).toBeTypeOf('function');

    const incoming: ErrorEvent = {
      type: undefined,
      message: `Bearer ${CANARY}`,
      extra: { access_token: CANARY },
    };
    const hint: EventHint = {};
    const serialised = JSON.stringify(beforeSend?.(incoming, hint));

    expect(serialised).toContain(REDACTION_MARKER);
    expect(serialised).not.toContain(CANARY);
  });
});
