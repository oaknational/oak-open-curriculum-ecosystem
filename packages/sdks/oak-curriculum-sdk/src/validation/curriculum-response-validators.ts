/**
 * Response validation functions using generated Zod schemas
 * Maps API operations to their response validators
 */

import type { ValidationResult, HttpMethod, ValidationFailure, SchemaOutput } from './types.js';

import { isValidationFailure, parseWithCurriculumSchemaInstance } from './types.js';
import {
  getOperationIdByPathAndMethod,
  isValidPath,
  isAllowedMethod,
  isValidResponseCode,
  getResponseSchemaByOperationIdAndStatus,
  type ValidPath,
  type AllowedMethodsForPath,
  type JsonBody200,
  type OperationId,
} from '@oaknational/sdk-codegen/api-schema';
import type { CurriculumSchemaDefinition } from '@oaknational/sdk-codegen/zod';

/**
 * Parse and validate response data
 */
function parseCurriculumResponse<Schema extends CurriculumSchemaDefinition>(
  schema: Schema,
  response: unknown,
): ValidationResult<SchemaOutput<Schema>> {
  return parseWithCurriculumSchemaInstance(schema, response);
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
  let schema: CurriculumSchemaDefinition;
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
 *
 * This function validates against the SDK response schema, including generated
 * decorations such as the optional `oakUrl` field (slug-based teachers-site URL).
 * The upstream API's `canonicalUrl` may also be present. This validator does not
 * derive or augment `oakUrl`; that decoration happens at the client
 * response-augmentation middleware boundary, where a concrete request URL is
 * available.
 * @param path - The API path template (e.g., '/lessons/\{lesson\}/transcript')
 * @param method - The HTTP method
 * @param statusCode - The HTTP response status code
 * @param response - The response data to validate
 * @returns ValidationResult with validated response or validation issues
 *
 * @remarks Only the 200 responses are defined in the original OpenAPI schema, hence the overloads with unknown types
 */
export function validateCurriculumResponse(
  path: string,
  method: string,
  statusCode: number,
  response: unknown,
): ValidationResult<unknown>;
export function validateCurriculumResponse<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  statusCode: 200,
  response: unknown,
): ValidationResult<JsonBody200<P, M>>;
export function validateCurriculumResponse<P extends ValidPath>(
  path: P,
  method: AllowedMethodsForPath<P>,
  statusCode: number,
  response: unknown,
): ValidationResult<unknown>;
export function validateCurriculumResponse<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  statusCode: number,
  response: unknown,
): ValidationResult<JsonBody200<P, M>> | ValidationResult<unknown> {
  const context = resolveOperationContext(path, method, statusCode);
  const parsed = parseResponseOrThrow(context.schema, response, context);

  if (isValidationFailure(parsed)) {
    return withTrace(parsed, {
      path: context.path,
      method: context.method,
      statusCode: context.statusCode,
      operationId: context.operationId,
    });
  }

  if (context.statusCode === 200) {
    return finalizeOk200(context.path, context.method, context.operationId, parsed.value);
  }

  return parsed;
}

interface OperationContext<P extends ValidPath, M extends AllowedMethodsForPath<P>> {
  readonly path: P;
  readonly method: M;
  readonly statusCode: number;
  readonly statusCodeString: string;
  readonly operationId: OperationId;
  readonly schema: CurriculumSchemaDefinition;
}

function resolveOperationContext<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  statusCode: number,
): OperationContext<P, M> {
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

  const schema = getResponseSchemaSafely(operationId, statusCodeString);

  return { path, method, statusCode, statusCodeString, operationId, schema };
}

function getResponseSchemaSafely(
  operationId: OperationId,
  statusCode: string,
): CurriculumSchemaDefinition {
  if (!isValidResponseCode(statusCode)) {
    throw new TypeError('Invalid status code: ' + statusCode);
  }
  try {
    return getResponseSchemaByOperationIdAndStatus(operationId, statusCode);
  } catch (error) {
    throw new TypeError('Error getting response schema by operationId and statusCode', {
      cause: error,
    });
  }
}

function parseResponseOrThrow<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  schema: CurriculumSchemaDefinition,
  response: unknown,
  context: OperationContext<P, M>,
): ValidationResult<SchemaOutput<CurriculumSchemaDefinition>> {
  try {
    return parseCurriculumResponse(schema, response);
  } catch (error) {
    throw new Error(
      `Error parsing response for ${context.operationId} ${context.method} ${context.path} ${String(
        context.statusCode,
      )}, with response ${safeJson(response)} and schema [schema metadata omitted]`,
      { cause: error },
    );
  }
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserialisable value]';
  }
}

function finalizeOk200<P extends ValidPath, M extends AllowedMethodsForPath<P>>(
  path: P,
  method: M,
  operationId: OperationId,
  value: unknown,
): ValidationResult<JsonBody200<P, M>> {
  if (isResponseJsonBody200(path, method, value)) {
    return { ok: true, value };
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
