/**
 * Request validation functions using generated Zod schemas
 * Maps API operations to their validators from generated endpoints
 */

import { z } from 'zod';
import type { ValidationResult, HttpMethod } from './types';
import { parseEndpointParameters } from './types';
import { endpoints } from '../types/generated/zod/curriculumZodSchemas.js';
import { toColon } from '../types/generated/api-schema/path-utils.js';
import type {
  AllowedMethodsForPath,
  ValidPath,
} from '../types/generated/api-schema/path-parameters';

// Runtime type utilities (no assertions)
function isNonArrayObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getOwnProperty(value: unknown, key: string): unknown {
  if (!isNonArrayObject(value)) {
    return undefined;
  }
  if (!Object.prototype.hasOwnProperty.call(value, key)) {
    return undefined;
  }
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  return descriptor?.value;
}

function hasFunction(o: unknown, key: string): boolean {
  const candidate = getOwnProperty(o, key);
  return typeof candidate === 'function';
}

function isZodSchema(value: unknown): value is z.ZodTypeAny {
  return hasFunction(value, 'parse') && hasFunction(value, 'safeParse');
}

/**
 * Type for endpoint definition from generated file
 */
interface EndpointDefinition {
  method: string;
  path: string;
  parameters?: ParamDefinition[];
}

interface ParamDefinition {
  name: string;
  type: 'Path' | 'Query' | 'Body';
  schema: z.ZodSchema;
}

function isParameterDefinition(value: unknown): value is ParamDefinition {
  if (!isNonArrayObject(value)) {
    return false;
  }
  const name = getOwnProperty(value, 'name');
  const type = getOwnProperty(value, 'type');
  const schema = getOwnProperty(value, 'schema');
  return (
    typeof name === 'string' &&
    (type === 'Path' || type === 'Query' || type === 'Body') &&
    isZodSchema(schema)
  );
}
function isEndpointDefinition(value: unknown): value is EndpointDefinition {
  if (!isNonArrayObject(value)) {
    return false;
  }
  const method = getOwnProperty(value, 'method');
  const path = getOwnProperty(value, 'path');
  if (typeof method !== 'string' || typeof path !== 'string') {
    return false;
  }
  const params = getOwnProperty(value, 'parameters');
  if (params === undefined) {
    return true;
  }
  if (!Array.isArray(params)) {
    return false;
  }
  return params.every(isParameterDefinition);
}

/**
 * Builds a map of path+method to parameter schemas from generated endpoints
 *
 * @remarks move generation to compile-time, so this can be a static constant, with typ guards and a static type
 */
function buildParameterSchemaMap(): Map<string, z.ZodSchema> {
  const schemaMap = new Map<string, z.ZodSchema>();

  function paramsToSchema(parameters: readonly ParamDefinition[]): z.ZodSchema {
    const pairs: readonly (readonly [string, z.ZodSchema])[] = parameters.map(
      (p) => [p.name, p.schema] as const,
    );
    const entries = Object.fromEntries(pairs);
    return z.object(entries);
  }

  if (Array.isArray(endpoints)) {
    for (const e of endpoints) {
      if (!isEndpointDefinition(e)) {
        continue;
      }
      const key = `${e.method.toUpperCase()}:${e.path}`;
      const parameters = Array.isArray(e.parameters) ? e.parameters : [];
      const schema = parameters.length > 0 ? paramsToSchema(parameters) : z.object({});
      schemaMap.set(key, schema);
    }
  }

  return schemaMap;
}

// Build the schema map once at module load time
const parameterSchemaMap = buildParameterSchemaMap();

function hasPathInMap(normalizedPath: string): boolean {
  return Array.from(parameterSchemaMap.keys()).some((k) => k.endsWith(`:${normalizedPath}`));
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
 * @param path - The API path (e.g., "/lessons/{lesson}/transcript")
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
  /** @remarks sort out proper types for schemas */
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
