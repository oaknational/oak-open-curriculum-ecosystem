/**
 * Adaptive logger that automatically selects the best implementation
 * based on the runtime environment
 */

import type { Logger } from '@oaknational/mcp-moria';

declare global {
  // Node.js global
  var process:
    | {
        versions?: {
          node?: string;
        };
      }
    | undefined;

  // Deno global
  var Deno: object | undefined;

  // Bun global
  var Bun: object | undefined;

  // Browser globals
  var window: object | undefined;
  var self: object | undefined;
  var importScripts: unknown;

  // Cloudflare Workers global
  var caches:
    | {
        default?: unknown;
      }
    | undefined;
}

export interface LoggerOptions {
  level?: number;
  name?: string;
  context?: Record<string, unknown>;
}

/**
 * Creates an adaptive logger that works in any environment
 *
 * Uses Consola (which is browser/edge compatible) with different
 * configurations based on available features.
 */
export async function createAdaptiveLogger(options?: LoggerOptions): Promise<Logger> {
  const { createLoggerWithNodeFeatures } = await import('./consola-logger.js');
  return createLoggerWithNodeFeatures(options);
}

/**
 * Synchronous factory that returns a Promise for the logger
 * This allows for better tree-shaking in bundlers
 */
export function createLogger(options?: LoggerOptions): Promise<Logger> {
  return createAdaptiveLogger(options);
}

// Export types from moria
export type { Logger } from '@oaknational/mcp-moria';
