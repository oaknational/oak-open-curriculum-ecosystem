/**
 * Environment provider that detects available environment variables
 *
 * This module handles the EXTERNAL BOUNDARY where we receive unknown
 * environment data from the JavaScript runtime (globalThis).
 */

import {
  type EnvironmentProvider,
  isEnvironmentObject,
  hasNestedProperty,
  extractNestedProperty,
  hasProperty,
  extractProperty,
} from '@oaknational/mcp-core';

/**
 * Internal type for validated environment variables
 * After boundary validation, we work with this type internally
 */
type EnvVars = Record<string, string | undefined>;

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
 * EXTERNAL BOUNDARY: Validates and extracts environment variables from runtime context
 *
 * This function handles the boundary where external data (globalThis) enters our system.
 * After this point, all types are trusted and we work with EnvVars internally.
 *
 * @param context - Unknown external data from globalThis
 * @returns Validated environment variables
 */
function extractEnvVars(context: unknown): EnvVars {
  // Try Node.js style: globalThis.process.env
  if (hasNestedProperty(context, ['process', 'env'])) {
    const processEnv = extractNestedProperty(context, ['process', 'env']);
    if (isEnvironmentObject(processEnv)) {
      return processEnv;
    }
  }

  // Try Edge/Deno style: globalThis.env
  if (hasProperty(context, 'env')) {
    const env = extractProperty(context, 'env');
    if (isEnvironmentObject(env)) {
      return env;
    }
  }

  // No valid environment found
  throw new EnvironmentNotSupportedError();
}

/**
 * Creates an environment provider by detecting available features
 *
 * Checks for:
 * 1. globalThis.process.env (Node.js style)
 * 2. globalThis.env (Edge/Deno style)
 * 3. Throws EnvironmentNotSupportedError if neither available
 *
 * @param gThis - The global object (typically globalThis) to extract env vars from
 */
export function createAdaptiveEnvironment(gThis: unknown): EnvironmentProvider {
  const envSource = extractEnvVars(gThis);

  return {
    get(key: string): string | undefined {
      return envSource[key];
    },

    getAll(): EnvVars {
      return { ...envSource };
    },

    has(key: string): boolean {
      return key in envSource;
    },
  };
}

// Export types from moria
export type { EnvironmentProvider } from '@oaknational/mcp-core';
