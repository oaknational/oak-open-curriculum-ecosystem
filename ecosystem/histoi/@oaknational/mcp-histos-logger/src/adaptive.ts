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

let cachedLogger: ((options?: LoggerOptions) => Logger) | null = null;

/**
 * Creates an adaptive logger that works in any environment
 * Uses feature detection to choose the best implementation
 */
export async function createAdaptiveLogger(options?: LoggerOptions): Promise<Logger> {
  if (cachedLogger) {
    return cachedLogger(options);
  }

  // Feature detection: Try to use the Node.js logger with consola
  // If it fails (missing Node.js APIs), fall back to edge logger
  try {
    const { createNodeLogger } = await import('./node.js');
    // Test if we can actually create the logger (this will fail if consola can't initialize)
    const testLogger = createNodeLogger(options);
    cachedLogger = createNodeLogger;
    return testLogger;
  } catch {
    // Node.js APIs not available or consola failed to initialize
    // Use the edge logger which only needs console
    const { createEdgeLogger } = await import('./edge.js');
    cachedLogger = createEdgeLogger;
    return createEdgeLogger(options);
  }
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
