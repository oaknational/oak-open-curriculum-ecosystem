/**
 * Request validation functions using generated Zod schemas
 * Maps API operations to their validators from generated data
 */

import type { ZodType } from 'zod';
import type { ValidationResult, HttpMethod } from './types.js';
import { parseEndpointParameters } from './types.js';
import { toColon } from '../types/generated/api-schema/path-utils.js';
import { typeSafeEntries } from '../types/helpers/type-helpers.js';
import type {
  AllowedMethodsForPath,
  ValidPath,
} from '../types/generated/api-schema/path-parameters.js';
import { REQUEST_PARAMETER_SCHEMAS } from '../types/generated/api-schema/validation/request-parameter-map.js';

const parameterSchemaEntries = typeSafeEntries(REQUEST_PARAMETER_SCHEMAS);
const parameterSchemaMap = new Map<string, ZodType>(parameterSchemaEntries);

const knownPaths = (() => {
  const paths = new Set<string>();
  for (const key of parameterSchemaMap.keys()) {
    const separatorIndex = key.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }
    const pathPart = key.slice(separatorIndex + 1);
    paths.add(pathPart);
  }
  return paths;
})();

function hasPathInMap(normalizedPath: string): boolean {
  return knownPaths.has(normalizedPath);
}

function makeUnsupportedMethod(
  method: HttpMethod,
  normalizedPath: string,
): ValidationResult<unknown> {
  console.warn(`Unsupported method ${method} for path ${normalizedPath}`);
  return {
    ok: false,
    issues: [
      {
        path: [],
        message: `Unsupported method ${method} for path ${normalizedPath}`,
        code: 'UNKNOWN_OPERATION',
      },
    ],
  };
}

function makeUnknownOperation(key: string): ValidationResult<unknown> {
  console.warn(`Unknown operation ${key}`);
  return {
    ok: false,
    issues: [
      {
        path: [],
        message: `Unknown operation ${key}`,
        code: 'UNKNOWN_OPERATION',
      },
    ],
  };
}

/**
 * Validates request parameters against the schema for the given path and method
 * Uses generated schemas from the endpoints file
 *
 * @param path - The API path (e.g., "/lessons/\{lesson\}/transcript")
 * @param method - The HTTP method
 * @param args - The request parameters to validate
 * @returns Validation result with success/failure status
 *
 * @remarks consider if we can further narrow the return type
 */
export function validateRequest<P extends ValidPath>(
  path: P,
  method: AllowedMethodsForPath<P>,
  args: unknown,
): ValidationResult<unknown> {
  // Normalize the path to match generated format
  const normalizedPath = toColon(path);
  const key = `${method.toUpperCase()}:${normalizedPath}`;

  // Look up the schema for this endpoint
  const schema = parameterSchemaMap.get(key);

  if (!schema) {
    // No schema found - determine the type of error
    return hasPathInMap(normalizedPath)
      ? makeUnsupportedMethod(method, normalizedPath)
      : makeUnknownOperation(key);
  }

  // Validate using the schema
  return parseEndpointParameters(schema, args);
}
