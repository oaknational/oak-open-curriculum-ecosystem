import { describe, expect, it, vi } from 'vitest';
import type { LogEvent, LogSink } from '@oaknational/logger';
import type { SentryNodeSdk } from '@oaknational/sentry-node';
import type { AuthDisabledRuntimeConfig } from '../runtime-config.js';
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

function createOffRuntimeConfigWithoutDeployReleaseMetadata(): AuthDisabledRuntimeConfig {
  return {
    dangerouslyDisableAuth: true,
    useStubTools: false,
    version: '1.2.3-test',
    versionSource: 'APP_VERSION_OVERRIDE',
    vercelHostnames: [],
    env: {
      OAK_API_KEY: 'test-api-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      LOG_LEVEL: 'info',
      SENTRY_MODE: 'off',
    },
  };
}

describe('createHttpObservability', () => {
  it('constructs off-mode observability without deploy release metadata', () => {
    const sdk = createFakeSentrySdk();
    const stdout = createCapturingStdoutSink();
    const result = createHttpObservability(createOffRuntimeConfigWithoutDeployReleaseMetadata(), {
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
});
