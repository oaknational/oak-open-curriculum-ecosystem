/**
 * Response validation functions using generated Zod schemas
 * Maps API operations to their response validators
 */

import type { z } from 'zod';
import type { ValidationResult, HttpMethod } from './types.js';
import { PATH_OPERATIONS } from '../types/generated/api-schema/path-parameters.js';
import { toCurly } from '../types/generated/api-schema/path-utils.js';
import { parseWithSchema } from './types.js';
import { responseSchemaMap } from '../types/generated/api-schema/response-map.js';

// Error schemas for common status codes
// TODO: Generate error schemas from OpenAPI spec
// responseSchemaMap.set('*:401', schemas.error_UNAUTHORIZED);
// responseSchemaMap.set('*:403', schemas.error_FORBIDDEN);
// responseSchemaMap.set('*:500', schemas.error_INTERNAL_SERVER_ERROR);

/**
 * Find the operation ID for a given path and method
 */
function findOperationId(path: string, method: HttpMethod): string | undefined {
  const normalizedPath = toCurly(path);
  const methodLower = typeof method === 'string' ? method.toLowerCase() : method;
  const operation = PATH_OPERATIONS.find(
    (op) => op.path === normalizedPath && op.method === methodLower,
  );
  return operation?.operationId;
}

/**
 * Parse and validate response data
 */
function parseResponse<T>(schema: z.ZodSchema<T>, response: unknown): ValidationResult<T> {
  return parseWithSchema(schema, response);
}

/**
 * Validates response data for an API operation
 * @param path - The API path template (e.g., '/lessons/{lesson}/transcript')
 * @param method - The HTTP method
 * @param statusCode - The HTTP response status code
 * @param response - The response data to validate
 * @returns ValidationResult with validated response or validation issues
 */
export function validateResponse(
  path: string,
  method: HttpMethod,
  statusCode: number,
  response: unknown,
): ValidationResult<unknown> {
  const operationId = findOperationId(path, method);

  if (!operationId) {
    return {
      ok: false,
      issues: [
        {
          path: [],
          message: `Unknown operation: ${method.toUpperCase()} ${path}`,
          code: 'UNKNOWN_OPERATION',
        },
      ],
    };
  }

  // Try to find schema for specific operation and status code
  let schema = responseSchemaMap.get(`${operationId}:${String(statusCode)}`);

  // If not found, try generic error schemas
  if (!schema && statusCode >= 400) {
    schema = responseSchemaMap.get(`*:${String(statusCode)}`);
  }

  if (!schema) {
    return {
      ok: false,
      issues: [
        {
          path: [],
          message: `No schema for status code ${String(statusCode)} in operation ${operationId}`,
          code: 'NO_SCHEMA_FOR_STATUS',
        },
      ],
    };
  }

  return parseResponse(schema, response);
}
