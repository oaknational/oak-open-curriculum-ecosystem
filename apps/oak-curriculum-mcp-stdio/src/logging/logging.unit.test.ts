import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger/node';

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

vi.mock('@oaknational/mcp-logger/node', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@oaknational/mcp-logger/node')>(
    '@oaknational/mcp-logger/node',
  );

  type AdaptiveLoggerParams = Parameters<typeof actual.createAdaptiveLogger>;
  type AdaptiveLoggerReturn = ReturnType<typeof actual.createAdaptiveLogger>;

  const createAdaptiveLoggerMock = vi.fn((...args: AdaptiveLoggerParams): AdaptiveLoggerReturn => {
    const [_options, _name, sinkConfig] = args;
    void _options;
    void _name;
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

  const parseLogLevelMock = vi.fn(actual.parseLogLevel);

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
    return config as ReturnType<typeof actual.parseSinkConfigFromEnv>;
  }) as typeof actual.parseSinkConfigFromEnv;

  return {
    ...actual,
    createAdaptiveLogger: createAdaptiveLoggerMock,
    parseLogLevel: parseLogLevelMock,
    parseSinkConfigFromEnv: parseSinkConfigFromEnvMock,
  };
});

function createRuntimeConfig(
  overrides: Partial<TestSinkEnvironment> & { LOG_LEVEL?: string } = {},
): RuntimeConfig {
  const env: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    LOG_LEVEL: overrides.LOG_LEVEL ?? 'info',
    MCP_LOGGER_STDOUT: overrides.MCP_LOGGER_STDOUT,
    MCP_LOGGER_FILE_PATH: overrides.MCP_LOGGER_FILE_PATH,
    MCP_LOGGER_FILE_APPEND: overrides.MCP_LOGGER_FILE_APPEND,
  };
  return loadRuntimeConfig(env);
}

async function importLoggingModule() {
  return import('./index');
}

describe('createStdioLogger', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    createdLoggers.length = 0;
    createdSinkConfigs.length = 0;
  });

  it('returns a logger instance', async () => {
    const { createStdioLogger } = await importLoggingModule();
    const logger = createStdioLogger(createRuntimeConfig());
    expect(logger).toBeDefined();
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('forces stdout sink to false regardless of env', async () => {
    const { createStdioLogger } = await importLoggingModule();
    createStdioLogger(createRuntimeConfig({ MCP_LOGGER_STDOUT: 'true' }));

    const sinkConfig = createdSinkConfigs.at(-1);
    expect(sinkConfig).toBeDefined();
    if (!sinkConfig) {
      throw new Error('Expected sink config to be created');
    }
    expect(sinkConfig.stdout).toBe(false);
  });

  it('uses default log file path when MCP_LOGGER_FILE_PATH not set', async () => {
    vi.mock('../app/file-reporter.js', () => ({
      getLogFilePath: vi.fn(() => '/default/log/path.log'),
    }));

    const { createStdioLogger } = await importLoggingModule();
    createStdioLogger(createRuntimeConfig());

    const sinkConfig = createdSinkConfigs.at(-1);
    expect(sinkConfig).toBeDefined();
    if (!sinkConfig) {
      throw new Error('Expected sink config to be created');
    }
    expect(sinkConfig.file?.path).toBe('/default/log/path.log');
  });

  it('respects custom file sink path when provided', async () => {
    const { createStdioLogger } = await importLoggingModule();
    createStdioLogger(createRuntimeConfig({ MCP_LOGGER_FILE_PATH: '/tmp/test.log' }));

    const sinkConfig = createdSinkConfigs.at(-1);
    expect(sinkConfig).toBeDefined();
    if (!sinkConfig) {
      throw new Error('Expected sink config to be created');
    }
    expect(sinkConfig.file?.path).toBe('/tmp/test.log');
  });

  it('respects file append flag when provided', async () => {
    const { createStdioLogger } = await importLoggingModule();
    createStdioLogger(
      createRuntimeConfig({
        MCP_LOGGER_FILE_PATH: '/tmp/test.log',
        MCP_LOGGER_FILE_APPEND: 'false',
      }),
    );

    const sinkConfig = createdSinkConfigs.at(-1);
    expect(sinkConfig).toBeDefined();
    if (!sinkConfig) {
      throw new Error('Expected sink config to be created');
    }
    expect(sinkConfig.file?.append).toBe(false);
  });

  it('uses shared logger error signature with error parameter', async () => {
    const { createStdioLogger } = await importLoggingModule();
    const logger = createStdioLogger(createRuntimeConfig());

    const testError = new Error('test error');
    const testContext = { key: 'value' };

    logger.error('test message', testError, testContext);

    const createdLogger = createdLoggers.at(-1);
    expect(createdLogger).toBeDefined();
    expect(createdLogger?.error).toHaveBeenCalledWith('test message', testError, testContext);
  });

  it('does not write to stdout when logging', async () => {
    const stdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => {
      throw new Error('stdout.write should never be called by stdio logger');
    });

    const { createStdioLogger } = await importLoggingModule();
    const logger = createStdioLogger(createRuntimeConfig());

    logger.info('test info message');
    logger.debug('test debug message');
    logger.warn('test warn message');
    logger.error('test error message');
    logger.trace('test trace message');
    logger.fatal('test fatal message');

    expect(stdoutWriteSpy).not.toHaveBeenCalled();
    stdoutWriteSpy.mockRestore();
  });
});
