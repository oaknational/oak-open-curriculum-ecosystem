import path from 'node:path';

import {
  UnifiedLogger,
  buildResourceAttributes,
  parseLogLevel,
  logLevelToSeverityNumber,
  LOG_LEVEL_KEY,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import type { Logger, LogLevel } from '@oaknational/logger';

import type { SmokeSuiteMode } from './smoke-assertions/types.js';

export interface LogConfig {
  readonly logToFile: boolean;
  readonly logDirectory: string;
  readonly captureAnalysis: boolean;
}

export const DEFAULT_LOG_DIRECTORY = path.resolve(process.cwd(), 'tmp', 'smoke-logs');

export const SMOKE_LOG_TO_FILE_KEY = 'SMOKE_LOG_TO_FILE';
export const SMOKE_CAPTURE_ANALYSIS_KEY = 'SMOKE_CAPTURE_ANALYSIS';

export function resolveLogConfig(): LogConfig {
  return {
    logToFile: shouldWriteFiles(process.env[SMOKE_LOG_TO_FILE_KEY]),
    logDirectory: DEFAULT_LOG_DIRECTORY,
    captureAnalysis: shouldWriteFiles(process.env[SMOKE_CAPTURE_ANALYSIS_KEY]),
  };
}

export function createRootLogger(mode: SmokeSuiteMode): Logger {
  const level = resolveLogLevel();
  const minSeverity = logLevelToSeverityNumber(level);
  const resourceAttributes = buildResourceAttributes(
    process.env,
    'streamable-http-smoke',
    process.env.npm_package_version ?? '0.0.0',
  );

  return new UnifiedLogger({
    minSeverity,
    resourceAttributes,
    context: { requestedMode: mode },
    sinks: [createNodeStdoutSink()],
    getActiveSpanContext: getActiveSpanContextSnapshot,
  });
}

export function createModeLogger(
  rootLogger: Logger,
  mode: SmokeSuiteMode,
  baseUrl: string,
): Logger {
  return rootLogger.child?.({ mode, baseUrl }) ?? rootLogger;
}

export function resolveLogLevel(): LogLevel {
  try {
    return parseLogLevel(process.env[LOG_LEVEL_KEY], 'INFO');
  } catch (error) {
    const value = process.env[LOG_LEVEL_KEY];
    console.warn(
      `[smoke] Invalid ${LOG_LEVEL_KEY} value "${value ?? 'undefined'}", defaulting to INFO`,
      { reason: error instanceof Error ? error.message : error },
    );
    return 'INFO';
  }
}

export function shouldWriteFiles(flag: string | undefined): boolean {
  if (!flag) {
    return false;
  }
  return flag.trim().toLowerCase() === 'true';
}
