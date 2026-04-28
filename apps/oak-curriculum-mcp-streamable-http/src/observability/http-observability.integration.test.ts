import { describe, expect, it, vi } from 'vitest';
import type { LogEvent, LogSink } from '@oaknational/logger';
import type { SentryNodeSdk } from '@oaknational/sentry-node';
import type { Env } from '../env.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { createRuntimeConfigFromValidatedEnv } from '../runtime-config-from-validated-env.js';
import { createHttpObservability } from './http-observability.js';

interface CapturingStdoutSink {
  readonly sink: LogSink;
  readonly events: readonly LogEvent[];
}

const noopLogger: SentryNodeSdk['logger'] = {
  trace(): void {
    // noop
  },
  debug(): void {
    // noop
  },
  info(): void {
    // noop
  },
  warn(): void {
    // noop
  },
  error(): void {
    // noop
  },
  fatal(): void {
    // noop
  },
};

function createFakeSentrySdk(): SentryNodeSdk {
  return {
    init: vi.fn<SentryNodeSdk['init']>(),
    captureException: vi.fn<SentryNodeSdk['captureException']>(),
    captureMessage: vi.fn<SentryNodeSdk['captureMessage']>(),
    flush: vi.fn<SentryNodeSdk['flush']>().mockResolvedValue(true),
    close: vi.fn<SentryNodeSdk['close']>().mockResolvedValue(true),
    setUser: vi.fn<SentryNodeSdk['setUser']>(),
    setTag: vi.fn<SentryNodeSdk['setTag']>(),
    setContext: vi.fn<SentryNodeSdk['setContext']>(),
    logger: noopLogger,
  };
}

function createCapturingStdoutSink(): CapturingStdoutSink {
  const events: LogEvent[] = [];
  return {
    events,
    sink: {
      write(event): void {
        events.push(event);
      },
    },
  };
}

function baseEnv(overrides: Partial<Env> = {}): Env {
  return {
    OAK_API_KEY: 'test-api-key',
    ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
    ELASTICSEARCH_API_KEY: 'test-es-key',
    LOG_LEVEL: 'info',
    APP_VERSION_OVERRIDE: '1.2.3-test',
    ...overrides,
  };
}

function expectRuntimeConfig(input: Env): RuntimeConfig {
  const result = createRuntimeConfigFromValidatedEnv(input);

  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`Expected runtime config, got ${JSON.stringify(result.error)}`);
  }

  return result.value;
}

describe('createHttpObservability', () => {
  it('constructs off-mode observability without deploy release metadata', () => {
    const sdk = createFakeSentrySdk();
    const stdout = createCapturingStdoutSink();
    const runtimeConfig = expectRuntimeConfig(
      baseEnv({
        DANGEROUSLY_DISABLE_AUTH: 'true',
        SENTRY_MODE: 'off',
      }),
    );
    const result = createHttpObservability(runtimeConfig, {
      sentrySdk: sdk,
      stdoutSink: stdout.sink,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.environment).toBe('development');
    expect('release' in result.value).toBe(false);
    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.captureMessage).not.toHaveBeenCalled();
    expect(sdk.captureException).not.toHaveBeenCalled();

    const logger = result.value.createLogger({ name: 'test-http' });
    logger.info('off-mode-log', { path: '/mcp' });

    expect(stdout.events).toHaveLength(1);
    const event = stdout.events[0];
    expect(event?.otelRecord).toMatchObject({
      SeverityText: 'INFO',
      Body: 'off-mode-log',
      Attributes: { path: '/mcp' },
      Resource: {
        'service.name': 'test-http',
        'service.version': '1.2.3-test',
        'deployment.environment': 'development',
      },
    });
    expect(event?.line).toBe(`${JSON.stringify(event?.otelRecord)}\n`);
  });

  it('propagates validated production-main env into live Sentry release identity', () => {
    const sdk = createFakeSentrySdk();
    const runtimeConfig = expectRuntimeConfig(
      baseEnv({
        CLERK_PUBLISHABLE_KEY: 'test-clerk-publishable-key',
        CLERK_SECRET_KEY: 'test-clerk-secret-key',
        APP_VERSION_OVERRIDE: '1.2.3',
        SENTRY_MODE: 'sentry',
        SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
        SENTRY_TRACES_SAMPLE_RATE: '0.5',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: 'abcdef1234567890abcdef1234567890abcdef12',
      }),
    );

    const result = createHttpObservability(runtimeConfig, {
      sentrySdk: sdk,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.environment).toBe('production');
    expect(result.value.release).toBe('1.2.3');
    expect(sdk.init).toHaveBeenCalledOnce();
    expect(sdk.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
        release: '1.2.3',
        tracesSampleRate: 0.5,
      }),
    );
  });
});
