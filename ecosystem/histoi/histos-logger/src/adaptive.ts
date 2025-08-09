/**
 * Adaptive logger that uses Consola for all environments
 * Consola already handles different runtime environments internally
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { LoggerOptions } from './types';
import { ConsolaLogger } from './consola-logger';

/**
 * Creates a logger using Consola which works in any environment
 */
export function createAdaptiveLogger(options?: LoggerOptions): Logger {
  return new ConsolaLogger(options);
}

// Export types from moria
export type { Logger } from '@oaknational/mcp-moria';
