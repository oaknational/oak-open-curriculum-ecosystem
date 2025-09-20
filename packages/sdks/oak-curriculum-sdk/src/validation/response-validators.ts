/**
 * Response validation functions using generated Zod schemas
 * Maps API operations to their response validators
 */

import type { ZodType, ZodSchema } from 'zod';
import type { ValidationResult, HttpMethod, ValidationFailure } from './types';

import { isValidationFailure, parseWithSchema } from './types.js';
import {
  getOperationIdByPathAndMethod,
  isValidPath,
  isAllowedMethod,
  isValidResponseCode,
  type ValidPath,
  type AllowedMethodsForPath,
  type JsonBody200,
  type OperationId,
} from '../types/generated/api-schema/path-parameters.js';
import { getResponseSchemaByOperationIdAndStatus } from '../types/generated/api-schema/response-map.js';
import { augmentResponseWithCanonicalUrl } from '../response-augmentation.js';

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
 * Runtime type guard: does `value` conform to the exact JSON body type
 * for the given path/method/status as defined by the generated schema?
 */
export function isResponseJsonBody200<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  value: unknown,
): value is JsonBody200<P, M> {
  const operationId = getOperationIdByPathAndMethod(path, method);
  if (!operationId) {
    return false;
  }
  let schema: ZodSchema<unknown>;
  try {
    schema = getResponseSchemaByOperationIdAndStatus(operationId, 200);
  } catch {
    return false;
  }
  const res = schema.safeParse(value);
  return res.success;
}

/**
 * Validates response data for an API operation
 * @param path - The API path template (e.g., '/lessons/{lesson}/transcript')
 * @param method - The HTTP method
 * @param statusCode - The HTTP response status code
 * @param response - The response data to validate
 * @returns ValidationResult with validated response or validation issues
 *
 * @remarks Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types
 */
export function validateResponse<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  statusCode: 200,
  response: unknown,
): ValidationResult<JsonBody200<P, M>>;
export function validateResponse<P extends ValidPath>(
  path: P,
  method: AllowedMethodsForPath<P>,
  statusCode: number,
  response: unknown,
): ValidationResult<unknown>;
export function validateResponse<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  statusCode: number,
  response: unknown,
): ValidationResult<JsonBody200<P, M>> | ValidationResult<unknown> {
  if (!isValidPath(path)) {
    throw new TypeError('Invalid path: ' + String(path));
  }
  if (!isAllowedMethod(method)) {
    throw new TypeError('Invalid method: ' + method);
  }

  const operationId = getOperationIdByPathAndMethod(path, method);
  if (!operationId) {
    throw new TypeError('Unknown operation: ' + method + ' ' + path);
  }

  const statusCodeString = String(statusCode);
  if (!isValidResponseCode(statusCodeString)) {
    throw new TypeError(
      'Invalid status code for operation: ' + operationId + ' ' + statusCodeString,
    );
  }

  let schema: ZodSchema;
  try {
    schema = getResponseSchemaByOperationIdAndStatus(operationId, statusCodeString);
  } catch (err) {
    throw new TypeError('Error getting response schema by operationId and statusCode', {
      cause: err,
    });
  }

  const result = parseResponse(schema, response);
  if (isValidationFailure(result)) {
    return withTrace(result, { path, method, statusCode, operationId });
  }

  if (statusCode === 200) {
    return finalizeOk200(path, method, operationId, result.value);
  }

  return result;
}

function finalizeOk200<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  operationId: OperationId,
  value: unknown,
): ValidationResult<JsonBody200<P, M>> {
  if (isResponseJsonBody200(path, method, value)) {
    const value200 =
      method === 'get' ? augmentResponseWithCanonicalUrl(value, path, method) : value;
    return { ok: true, value: value200 };
  }
  const unexpectedShape: ValidationFailure = {
    ok: false,
    issues: [
      {
        path: [],
        message: 'Response body did not match 200 JSON body after validation',
        code: 'VALIDATION_ERROR',
      },
    ],
  };
  return withTrace(unexpectedShape, { path, method, statusCode: 200, operationId });
}

/**
 * Finds the appropriate response schema for an operation and status code
 */
// getResponseSchema is generated alongside responseSchemaMap and throws when not found
