/**
 * Request validation functions using generated Zod schemas
 * Maps API operations to their validators from generated endpoints
 */

import { z } from 'zod';
import type { ValidationResult, HttpMethod } from './types.js';
import { parseWithSchema } from './types.js';
import { endpoints } from '../types/generated/zod/endpoints.js';
import { typeSafeFromEntries } from '../types/helpers.js';

// Runtime type utilities (no assertions)
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function get(o: Record<string, unknown>, key: string): unknown {
  return o[key];
}

function hasFunction(o: Record<string, unknown>, key: string): boolean {
  const v = o[key];
  return typeof v === 'function';
}

function isZodSchema(value: unknown): value is z.ZodTypeAny {
  if (!isObject(value)) return false;
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
  if (!isObject(value)) return false;
  const name = get(value, 'name');
  const type = get(value, 'type');
  const schema = get(value, 'schema');
  return (
    typeof name === 'string' &&
    (type === 'Path' || type === 'Query' || type === 'Body') &&
    isZodSchema(schema)
  );
}

function isEndpointDefinition(value: unknown): value is EndpointDefinition {
  if (!isObject(value)) return false;
  const method = get(value, 'method');
  const path = get(value, 'path');
  if (typeof method !== 'string' || typeof path !== 'string') return false;
  const params = 'parameters' in value ? get(value, 'parameters') : undefined;
  if (params === undefined) return true;
  if (!Array.isArray(params)) return false;
  return params.every(isParameterDefinition);
}

/**
 * Builds a map of path+method to parameter schemas from generated endpoints
 */
function buildParameterSchemaMap(): Map<string, z.ZodSchema> {
  const schemaMap = new Map<string, z.ZodSchema>();

  function paramsToSchema(parameters: readonly ParamDefinition[]): z.ZodSchema {
    const pairs: readonly (readonly [string, z.ZodSchema])[] = parameters.map(
      (p) => [p.name, p.schema] as const,
    );
    const entries = typeSafeFromEntries(pairs);
    return z.object(entries);
  }

  if (Array.isArray(endpoints)) {
    for (const e of endpoints) {
      if (!isEndpointDefinition(e)) continue;
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

/**
 * Normalizes API path by converting parameter placeholders
 * Converts OpenAPI style paths to match the generated format
 * e.g., "/lessons/{lesson}/transcript" -> "/lessons/:lesson/transcript"
 */
function normalizePath(path: string): string {
  // Convert curly brace params to colon-prefixed format
  return path.replace(/\{([^}]+)\}/g, ':$1');
}

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
        code: 'METHOD_NOT_SUPPORTED',
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
        code: 'OPERATION_NOT_FOUND',
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
 */
export function validateRequest(
  path: string,
  method: HttpMethod,
  args: unknown,
): ValidationResult<unknown> {
  // Normalize the path to match generated format
  const normalizedPath = normalizePath(path);
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
  return parseWithSchema(schema, args);
}
