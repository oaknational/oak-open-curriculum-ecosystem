/**
 * Response validation functions using generated Zod schemas
 * Maps API operations to their response validators
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

/* eslint-disable max-lines-per-function */

import type { ZodType, ZodSchema } from 'zod';
import type { ValidationResult, HttpMethod, ValidationFailure } from './types.js';
import type {
  ValidPath,
  AllowedMethodsForPath,
  JsonBody200,
} from '../types/generated/api-schema/path-parameters.js';
import { isValidationFailure, parseWithSchema } from './types.js';
import { PATH_OPERATIONS } from '../types/generated/api-schema/path-parameters.js';
import { toCurly } from '../types/generated/api-schema/path-utils.js';
import { responseSchemaMap } from '../types/generated/api-schema/response-map.js';
import { augmentResponseWithCanonicalUrl } from '../response-augmentation.js';

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
function parseResponse<T>(schema: ZodType<T>, response: unknown): ValidationResult<T> {
  return parseWithSchema(schema, response);
}

function withTrace(
  failure: ValidationFailure,
  ctx: { path: string; method: HttpMethod; statusCode: number; operationId?: string },
): ValidationFailure {
  if (failure.trace) {
    return failure;
  }
  return {
    ...failure,
    trace: {
      when: new Date().toISOString(),
      context: {
        path: ctx.path,
        method: ctx.method,
        statusCode: ctx.statusCode,
        operationId: ctx.operationId,
      },
    },
  };
}

/**
 * Validates response data for an API operation
 * @param path - The API path template (e.g., '/lessons/{lesson}/transcript')
 * @param method - The HTTP method
 * @param statusCode - The HTTP response status code
 * @param response - The response data to validate
 * @returns ValidationResult with validated response or validation issues
 */
export function validateResponse<P extends string, M extends string, S extends number>(
  path: P,
  method: M,
  statusCode: S,
  response: unknown,
): ValidationResult<
  P extends ValidPath
    ? M extends AllowedMethodsForPath<P>
      ? S extends 200
        ? JsonBody200<P & ValidPath, M & AllowedMethodsForPath<P & ValidPath>>
        : unknown
      : unknown
    : unknown
> {
  const operationId = findOperationId(path as string, method as HttpMethod);

  if (!operationId) {
    const unknownOperation: ValidationFailure = {
      ok: false,
      issues: [
        {
          path: [],
          message: `Unknown operation: ${String(method).toUpperCase()} ${path}`,
          code: 'UNKNOWN_OPERATION',
        },
      ],
    };
    return withTrace(unknownOperation, {
      path: path as string,
      method: method as HttpMethod,
      statusCode,
    });
  }

  const schema = findResponseSchema(operationId, statusCode);
  if (!schema) {
    const noSchemaForStatus: ValidationFailure = {
      ok: false,
      issues: [
        {
          path: [],
          message: `No schema for status code ${String(statusCode)} in operation ${operationId}`,
          code: 'NO_SCHEMA_FOR_STATUS',
        },
      ],
    };
    return withTrace(noSchemaForStatus, {
      path: path as string,
      method: method as HttpMethod,
      statusCode,
      operationId,
    });
  }

  const result = parseResponse(schema, response);
  if (isValidationFailure(result)) {
    return withTrace(result, {
      path: path as string,
      method: method as HttpMethod,
      statusCode,
      operationId,
    });
  }

  // Augment successful responses with canonical URLs
  if (result.ok && statusCode >= 200 && statusCode < 300) {
    const augmentedResponse = augmentResponseWithCanonicalUrl(
      result.value,
      path as string,
      method as HttpMethod,
    );
    return {
      ...result,
      value: augmentedResponse as unknown as any,
    };
  }

  return result as unknown as any;
}

/**
 * Finds the appropriate response schema for an operation and status code
 */
function findResponseSchema(
  operationId: string,
  statusCode: number,
): ZodSchema<unknown> | undefined {
  // Try to find schema for specific operation and status code
  let schema = responseSchemaMap.get(`${operationId}:${String(statusCode)}`);

  // If not found, try generic error schemas
  if (!schema && statusCode >= 400) {
    schema = responseSchemaMap.get(`*:${String(statusCode)}`);
  }

  return schema;
}
