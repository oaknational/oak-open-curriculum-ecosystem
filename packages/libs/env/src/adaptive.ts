/**
 * Environment provider that detects available environment variables
 *
 * This module handles the EXTERNAL BOUNDARY where we receive unknown
 * environment data from the JavaScript runtime (globalThis).
 */

// Local export to avoid import cycle with index.ts
// Avoid cross-lib dependency to respect layering constraints
export interface EnvironmentProvider {
  get(key: string): string | undefined;
  getAll(): Readonly<Record<string, string | undefined>>;
  has(key: string): boolean;
}

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isEnvironmentObject(
  value: unknown,
): value is Readonly<Record<string, string | undefined>> {
  if (!isPlainObject(value)) {
    return false;
  }
  for (const k in value) {
    if (!Object.prototype.hasOwnProperty.call(value, k)) {
      continue;
    }
    const v = value[k];
    if (typeof v !== 'string' && typeof v !== 'undefined') {
      return false;
    }
  }
  return true;
}

function hasNestedProperty(value: unknown, path: readonly string[]): boolean {
  if (path.length === 0) {
    return true;
  }
  if (!isPlainObject(value)) {
    return false;
  }
  const [first, ...rest] = path;
  if (!(first in value)) {
    return false;
  }
  return hasNestedProperty(value[first], rest);
}

function extractNestedProperty(value: unknown, path: readonly string[]): unknown {
  if (path.length === 0) {
    return value;
  }
  if (!isPlainObject(value)) {
    return undefined;
  }
  const [first, ...rest] = path;
  if (!(first in value)) {
    return undefined;
  }
  return extractNestedProperty(value[first], rest);
}

function hasProperty(value: unknown, property: string): value is Record<PropertyKey, unknown> {
  return isPlainObject(value) && property in value;
}

function extractProperty(value: unknown, property: string): unknown {
  return isPlainObject(value) ? value[property] : undefined;
}

/**
 * Internal type for validated environment variables
 * After boundary validation, we work with this type internally
 */
type EnvVars = Readonly<Record<string, string | undefined>>;

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

// Export core types for convenience
// (Types re-exported from index.ts to consumers)
