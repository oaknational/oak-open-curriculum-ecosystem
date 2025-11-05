import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';

import { createHttpLogger } from './index.js';
import { loadRuntimeConfig, type RuntimeConfig } from '../runtime-config.js';

interface TestSinkConfig {
  readonly stdout: boolean;
  readonly file?: { path: string; append?: boolean } | undefined;
}

interface TestSinkEnvironment {
  readonly MCP_LOGGER_STDOUT?: string;
  readonly MCP_LOGGER_FILE_PATH?: string;
  readonly MCP_LOGGER_FILE_APPEND?: string;
}

const hoisted = vi.hoisted(() => ({
  createdLoggers: [] as Logger[],
  createdSinkConfigs: [] as TestSinkConfig[],
}));

const createdLoggers = hoisted.createdLoggers;
const createdSinkConfigs = hoisted.createdSinkConfigs;

vi.mock('@oaknational/mcp-logger', async () => {
  const actualModule = await vi.importActual('@oaknational/mcp-logger');
  // vitest's importActual has inconsistent type inference across different TS/turbo contexts
  // We need to use the actual module but TypeScript sees it as 'unknown' in some builds
  // Using `any` here for mocking is pragmatic - the mock behavior is validated by tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const actual = actualModule as any;

  type AdaptiveLoggerParams = Parameters<typeof actual.createAdaptiveLogger>;
  type AdaptiveLoggerReturn = ReturnType<typeof actual.createAdaptiveLogger>;

  const createAdaptiveLoggerMock = vi.fn((...args: AdaptiveLoggerParams): AdaptiveLoggerReturn => {
    const [_options, _instance, sinkConfig] = args;
    void _options;
    void _instance;
    // Capture the actual sink config passed to createAdaptiveLogger
    if (sinkConfig) {
      createdSinkConfigs.push(sinkConfig as TestSinkConfig);
    }
    const logger: Logger = {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      isLevelEnabled: vi.fn(() => true),
    };
    createdLoggers.push(logger);
    return logger;
  }) as (...args: AdaptiveLoggerParams) => AdaptiveLoggerReturn;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const parseLogLevelMock = vi.fn(actual.parseLogLevel);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const parseSinkConfigFromEnvMock = vi.fn((env: TestSinkEnvironment) => {
    const config: TestSinkConfig = env.MCP_LOGGER_FILE_PATH
      ? {
          stdout: env.MCP_LOGGER_STDOUT !== 'false',
          file: {
            path: env.MCP_LOGGER_FILE_PATH,
            append: env.MCP_LOGGER_FILE_APPEND !== 'false',
          },
        }
      : {
          stdout: env.MCP_LOGGER_STDOUT !== 'false',
        };
    // Don't push here - we capture the actual config passed to createAdaptiveLogger
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config as ReturnType<typeof actual.parseSinkConfigFromEnv>;
  }) as typeof actual.parseSinkConfigFromEnv;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...actual,
    createAdaptiveLogger: createAdaptiveLoggerMock,
    parseLogLevel: parseLogLevelMock,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    parseSinkConfigFromEnv: parseSinkConfigFromEnvMock,
  };
});

function createRuntimeConfig(overrides: Record<string, string> = {}): RuntimeConfig {
  const baseEnv: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_value',
    CLERK_SECRET_KEY: 'sk_test_value',
  };
  return loadRuntimeConfig({ ...baseEnv, ...overrides });
}

describe('createHttpLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createdLoggers.length = 0;
    createdSinkConfigs.length = 0;
  });

  it('returns a logger instance', () => {
    const runtimeConfig = createRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig);

    expect(logger).toBeDefined();
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('always uses stdout-only sink config (browser-safe)', () => {
    const runtimeConfig = createRuntimeConfig({ LOG_LEVEL: 'debug' });
    createHttpLogger(runtimeConfig);

    const sinkConfig = createdSinkConfigs.at(-1);
    expect(sinkConfig).toBeDefined();
    if (!sinkConfig) {
      throw new Error('Expected sink config to be created');
    }
    expect(sinkConfig.stdout).toBe(true);
    expect(sinkConfig.file).toBeUndefined();
  });

  it('uses shared logger error signature with error parameter', () => {
    const runtimeConfig = createRuntimeConfig();
    const logger = createHttpLogger(runtimeConfig);

    const testError = new Error('test error');
    const testContext = { key: 'value' };

    logger.error('test message', testError, testContext);

    const createdLogger = createdLoggers.at(-1);
    expect(createdLogger).toBeDefined();
    expect(createdLogger?.error).toHaveBeenCalledWith('test message', testError, testContext);
  });
});
