import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';

interface WritableMock {
  readonly write: ReturnType<typeof vi.fn>;
  readonly end: ReturnType<typeof vi.fn>;
}

const mkdirSyncMock = vi.fn();
const createWriteStreamMock = vi.fn((): WritableMock => {
  return {
    write: vi.fn(),
    end: vi.fn(),
  };
});

vi.mock('node:fs', () => ({
  default: {
    mkdirSync: mkdirSyncMock,
    createWriteStream: createWriteStreamMock,
  },
  mkdirSync: mkdirSyncMock,
  createWriteStream: createWriteStreamMock,
}));

const createdLoggers: {
  debug: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  warn: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
}[] = [];

const createAdaptiveLoggerMock = vi.fn(() => {
  const logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as const;
  createdLoggers.push(logger);
  return logger;
});

vi.mock('@oaknational/mcp-logger', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@oaknational/mcp-logger');
  return {
    ...actual,
    createAdaptiveLogger: createAdaptiveLoggerMock,
  } satisfies Record<string, unknown>;
});

const ORIGINAL_ENV = { ...process.env };

async function importLoggingModule() {
  return import('./logging');
}

describe('logging configuration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    createdLoggers.length = 0;
    mkdirSyncMock.mockClear();
    createWriteStreamMock.mockClear();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.MCP_STREAMABLE_HTTP_FILE_LOGS;
    delete process.env.MCP_STREAMABLE_HTTP_LOG_FILE;
    delete process.env.LOG_LEVEL;
  });

  it('does not initialise file sinks by default', async () => {
    const { createLoggerFromEnv } = await importLoggingModule();
    expect(typeof createLoggerFromEnv).toBe('function');

    createLoggerFromEnv();

    expect(mkdirSyncMock).not.toHaveBeenCalled();
    expect(createWriteStreamMock).not.toHaveBeenCalled();
  });

  it('initialises the default file sink when explicitly enabled', async () => {
    process.env.MCP_STREAMABLE_HTTP_FILE_LOGS = 'true';
    const expectedPath = path.resolve(
      process.cwd(),
      'apps/oak-curriculum-mcp-streamable-http/.logs/dev-server.log',
    );

    const { createLoggerFromEnv } = await importLoggingModule();
    createLoggerFromEnv();

    expect(mkdirSyncMock).toHaveBeenCalledWith(path.dirname(expectedPath), { recursive: true });
    expect(createWriteStreamMock).toHaveBeenCalledWith(expectedPath, { flags: 'a' });
  });

  it('honours MCP_STREAMABLE_HTTP_LOG_FILE overrides when file logging enabled', async () => {
    process.env.MCP_STREAMABLE_HTTP_FILE_LOGS = 'true';
    process.env.MCP_STREAMABLE_HTTP_LOG_FILE = '/tmp/custom.log';

    const { createLoggerFromEnv } = await importLoggingModule();
    createLoggerFromEnv();

    expect(createWriteStreamMock).toHaveBeenCalledWith('/tmp/custom.log', { flags: 'a' });
  });

  it('suppresses debug output when LOG_LEVEL is info', async () => {
    process.env.LOG_LEVEL = 'info';
    const { createLoggerFromEnv } = await importLoggingModule();
    const logger = createLoggerFromEnv();

    const baseLogger = createdLoggers.at(-1);
    expect(baseLogger).toBeDefined();

    logger.debug('should be filtered');
    expect(baseLogger?.debug).not.toHaveBeenCalled();

    logger.info('should log');
    expect(baseLogger?.info).toHaveBeenCalledWith('should log', undefined);
  });

  it('emits debug output when LOG_LEVEL is debug', async () => {
    process.env.LOG_LEVEL = 'debug';
    const { createLoggerFromEnv } = await importLoggingModule();
    const logger = createLoggerFromEnv();

    const baseLogger = createdLoggers.at(-1);
    expect(baseLogger).toBeDefined();

    logger.debug('visible debug');
    expect(baseLogger?.debug).toHaveBeenCalledWith('visible debug', undefined);
  });
});
