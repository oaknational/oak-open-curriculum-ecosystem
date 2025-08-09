/**
 * Simple environment provider that detects available environment variables
 */

import type { EnvironmentProvider } from '@oaknational/mcp-moria';

class EnvironmentNotSupportedError extends Error {
  constructor() {
    super(
      'No environment variables available. ' +
        'Expected either globalThis.process.env or globalThis.env. ' +
        'Please ensure your runtime provides environment variables.',
    );
    this.name = 'EnvironmentNotSupportedError';
  }
}

/**
 * Creates an environment provider by detecting available features
 *
 * Checks for:
 * 1. globalThis.process.env (Node.js style)
 * 2. globalThis.env (Edge/Deno style)
 * 3. Throws EnvironmentNotSupportedError if neither available
 */
export function createAdaptiveEnvironment(gThis: Record<string, unknown>): EnvironmentProvider {
  let envSource: Record<string, string | undefined>;

  if (gThis.process && typeof gThis.process === 'object') {
    const proc = gThis.process as Record<string, unknown>;
    if (proc.env && typeof proc.env === 'object') {
      envSource = proc.env as Record<string, string | undefined>;
    } else {
      throw new EnvironmentNotSupportedError();
    }
  } else if (gThis.env && typeof gThis.env === 'object') {
    envSource = gThis.env as Record<string, string | undefined>;
  } else {
    throw new EnvironmentNotSupportedError();
  }

  // Return a simple EnvironmentProvider implementation
  return {
    get(key: string): string | undefined {
      return envSource[key];
    },

    getAll(): Record<string, string | undefined> {
      return { ...envSource };
    },

    has(key: string): boolean {
      return key in envSource;
    },
  };
}

// Export types from moria
export type { EnvironmentProvider } from '@oaknational/mcp-moria';
