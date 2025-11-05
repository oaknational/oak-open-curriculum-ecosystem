import { createAdaptiveLogger, parseLogLevel, type Logger } from '@oaknational/mcp-logger';

import type { RuntimeConfig } from '../runtime-config.js';

export interface HttpLoggerOptions {
  readonly name?: string;
}

export function createHttpLogger(config: RuntimeConfig, options?: HttpLoggerOptions): Logger {
  const levelInput = config.env.LOG_LEVEL?.toUpperCase();
  const level = parseLogLevel(levelInput, 'INFO');
  const loggerName = options?.name ?? 'streamable-http';

  return createAdaptiveLogger({ level, name: loggerName, context: {} }, undefined, {
    stdout: true,
  });
}

export type { Logger } from '@oaknational/mcp-logger';
