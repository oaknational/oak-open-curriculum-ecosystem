/**
 * Adaptive logger that uses Consola for all environments
 * Consola already handles different runtime environments internally
 * Supports configurable stdout and file sinks
 */

import { createConsola, type ConsolaInstance, type ConsolaOptions } from 'consola';
import type { Logger, LoggerOptions } from './types';
import { ConsolaLogger } from './consola-logger';
import { convertLogLevel, toConsolaLevel } from './log-level-conversion';
import { DEFAULT_HTTP_SINK_CONFIG, type LoggerSinkConfig } from './sink-config';

const NODE_ENTRY_HINT =
  'File or stdout-disabled sinks require the Node entry point. Import from "@oaknational/mcp-logger/node".';

function ensureBrowserCompatibleSinkConfig(sinkConfig: LoggerSinkConfig): void {
  if (!sinkConfig.stdout) {
    throw new Error(NODE_ENTRY_HINT);
  }

  if (sinkConfig.file) {
    throw new Error(NODE_ENTRY_HINT);
  }
}

/**
 * Helper to create a configured consola instance
 */
function createConfiguredConsola(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
): ConsolaInstance {
  const numericLevel = options?.level ? convertLogLevel(options.level) : 20; // Default to INFO
  const consolaLevel = toConsolaLevel(numericLevel);

  let consola = createConsola({
    level: consolaLevel,
    ...options?.consolaOptions,
  });

  if (options?.name) {
    consola = consola.withTag(options.name);
  }

  return consola;
}

/**
 * Creates an adaptive logger instance with configurable sinks
 *
 * @param options - Logger options (level, name, context)
 * @param consolaInstance - Optional injected consola instance for testing
 * @param sinkConfig - Optional sink configuration (defaults to stdout only)
 * @returns Configured logger instance
 *
 * @example
 * ```typescript
 * // Simple stdout logger
 * const logger = createAdaptiveLogger({ level: 'INFO' });
 * logger.info('Hello world');
 *
 * // HTTP server with stdout only (Vercel-compatible)
 * const httpLogger = createAdaptiveLogger(
 *   { level: 'INFO' },
 *   undefined,
 *   DEFAULT_HTTP_SINK_CONFIG
 * );
 *
 * // For file or stdio configurations use the Node entry point:
 * // import { createAdaptiveLogger, DEFAULT_STDIO_SINK_CONFIG } from '@oaknational/mcp-logger/node';
 * ```
 */
export function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance,
  sinkConfig?: LoggerSinkConfig,
): Logger {
  // Use injected instance or create a new one
  const consola = consolaInstance ?? createConfiguredConsola(options);
  const consolaLogger = new ConsolaLogger(consola, options?.context ?? {});

  // Apply sink configuration if provided, otherwise use HTTP default
  const effectiveSinkConfig = sinkConfig ?? DEFAULT_HTTP_SINK_CONFIG;
  ensureBrowserCompatibleSinkConfig(effectiveSinkConfig);

  return consolaLogger;
}

// Export core types for convenience
export type { Logger } from './types';
