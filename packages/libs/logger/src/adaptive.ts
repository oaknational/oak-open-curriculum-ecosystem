/**
 * Adaptive logger that uses Consola for all environments
 * Consola already handles different runtime environments internally
 */

import { createConsola, type ConsolaInstance, type ConsolaOptions } from 'consola';
import type { Logger } from '@oaknational/mcp-core';
import type { LoggerOptions } from './types';
import { ConsolaLogger } from './consola-logger';
import { convertLogLevel, toConsolaLevel } from './pure-functions';

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
 * Creates a logger using Consola which works in any environment
 * @param options - Logger configuration options
 * @param consolaInstance - Optional injected consola instance for testing
 */
export function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance,
): Logger {
  // Use injected instance or create a new one
  const consola = consolaInstance ?? createConfiguredConsola(options);
  return new ConsolaLogger(consola, options?.context ?? {});
}

// Export core types for convenience
export type { Logger } from '@oaknational/mcp-core';
