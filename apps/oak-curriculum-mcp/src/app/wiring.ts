/**
 * Psychon wiring - dependency injection and composition
 * Assembles all components into a working MCP server
 */

import { createMcpOrgan } from '../tools/index.js';
import type { McpOrgan } from '../tools/index.js';
import { appendToLogFile, getLogFilePath } from './file-reporter.js';

function mapLogLevelToIndex(level: string): number {
  if (level === 'trace') return 0;
  if (level === 'debug') return 1;
  if (level === 'info') return 2;
  if (level === 'warn') return 3;
  if (level === 'error') return 4;
  if (level === 'fatal') return 5;
  return 2; // default INFO
}

function formatLogMessage(lvl: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `${timestamp}: [${lvl}] ${message}${dataStr}`;
}

function makeLoggerMethods(currentLevelIndex: number, logFilePath: string | null): Logger {
  const shouldLog = (idx: number): boolean => currentLevelIndex <= idx;
  const logToFile = (lvl: string, message: string, data?: unknown): void => {
    if (logFilePath) appendToLogFile(logFilePath, formatLogMessage(lvl, message, data));
  };
  const consoleErr = (tag: string, message: string, data?: unknown): void => {
    console.error(`${tag} ${message}`, data ?? '');
  };
  const makeStdErrMethod =
    (tag: string, idx: number) =>
    (message: string, data?: unknown): void => {
      if (shouldLog(idx)) {
        consoleErr(tag, message, data);
        const label = tag.replace(/\[|\]/g, '');
        logToFile(label, message, data);
      }
    };
  const warnMethod = (message: string, data?: unknown): void => {
    if (shouldLog(3)) {
      console.warn(`[WARN] ${message}`, data ?? '');
      logToFile('WARN', message, data);
    }
  };
  return {
    trace: makeStdErrMethod('[TRACE]', 0),
    debug: makeStdErrMethod('[DEBUG]', 1),
    info: makeStdErrMethod('[INFO]', 2),
    warn: warnMethod,
    error: makeStdErrMethod('[ERROR]', 4),
    fatal: (message: string, data?: unknown): void => {
      consoleErr('[FATAL]', message, data);
      logToFile('FATAL', message, data);
    },
  };
}

/**
 * Configuration for the Oak Curriculum MCP server
 */
export interface ServerConfig {
  /** Log level */
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /** Oak API key */
  apiKey?: string;
  /** Server name for MCP */
  serverName?: string;
  /** Server version */
  serverVersion?: string;
}

/**
 * Simple logger interface (matches Moria's Logger)
 */
export interface Logger {
  trace(message: string, data?: unknown): void;
  debug(message: string, data?: unknown): void;
  info(message: string, data?: unknown): void;
  warn(message: string, data?: unknown): void;
  error(message: string, data?: unknown): void;
  fatal(message: string, data?: unknown): void;
}

/**
 * Create a logger with console and file output
 */
function createLogger(level: string, enableFileLogging = true): Logger {
  const currentLevelIndex = mapLogLevelToIndex(level);
  const logFilePath = enableFileLogging ? getLogFilePath() : null;
  return makeLoggerMethods(currentLevelIndex, logFilePath);
}

/**
 * Wired dependencies for the server
 */
export interface WiredDependencies {
  logger: Logger;
  mcpOrgan: McpOrgan;
  config: Required<ServerConfig>;
}

/**
 * Default server configuration values
 */
const DEFAULT_CONFIG: Required<ServerConfig> = {
  logLevel: 'info',
  apiKey: process.env.OAK_API_KEY ?? '',
  serverName: 'oak-curriculum-mcp',
  serverVersion: '0.0.1',
};

/**
 * Build complete server configuration with defaults
 */
function buildServerConfig(config?: ServerConfig): Required<ServerConfig> {
  if (!config) {
    return DEFAULT_CONFIG;
  }

  return {
    logLevel: config.logLevel ?? DEFAULT_CONFIG.logLevel,
    apiKey: config.apiKey ?? DEFAULT_CONFIG.apiKey,
    serverName: config.serverName ?? DEFAULT_CONFIG.serverName,
    serverVersion: config.serverVersion ?? DEFAULT_CONFIG.serverVersion,
  };
}

/**
 * Wire all dependencies together
 */
export function wireDependencies(config?: ServerConfig): WiredDependencies {
  const serverConfig = buildServerConfig(config);
  const logger = createLogger(serverConfig.logLevel);

  // Create MCP organ with SDK delegation
  const mcpOrgan = createMcpOrgan();

  return {
    logger,
    mcpOrgan,
    config: serverConfig,
  };
}
