/**
 * Transformation functions for endpoint data.
 *
 * Transforms Zod v3 schema code to Zod v4 in endpoint definitions.
 */

import { transformZodV3ToV4 } from './zod-v3-to-v4-transform.js';
import type {
  EndpointDefinition,
  EndpointError,
  EndpointParameter,
  RawEndpoint,
  RawError,
  RawParameter,
} from './endpoint-types.js';

/**
 * Type guard for raw parameter objects.
 */
function isRawParameter(value: unknown): value is RawParameter {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const obj = value;
  return (
    'name' in obj &&
    typeof obj.name === 'string' &&
    'type' in obj &&
    typeof obj.type === 'string' &&
    'schema' in obj
  );
}

/**
 * Type guard for raw error objects.
 */
function isRawError(value: unknown): value is RawError {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const obj = value;
  return (
    'status' in obj &&
    (typeof obj.status === 'string' || typeof obj.status === 'number') &&
    'schema' in obj
  );
}

/**
 * Type guard for raw endpoint objects.
 */
export function isRawEndpoint(value: unknown): value is RawEndpoint {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const obj = value;
  return (
    'method' in obj &&
    typeof obj.method === 'string' &&
    'path' in obj &&
    typeof obj.path === 'string' &&
    'response' in obj
  );
}

/**
 * Checks if a value is a Zod schema object (has _def property).
 */
function isZodSchemaObject(value: unknown): boolean {
  return value !== null && typeof value === 'object' && '_def' in value;
}

/**
 * Transforms a schema value to a Zod v4 code string.
 * Handles both string schemas and Zod schema objects.
 */
function transformSchemaToV4(schema: unknown): string {
  if (typeof schema === 'string') {
    return transformZodV3ToV4(schema);
  }
  if (isZodSchemaObject(schema)) {
    return 'z.unknown()';
  }
  return 'z.unknown()';
}

/**
 * Transforms a raw parameter to an EndpointParameter with Zod v4 schema.
 */
function transformParameter(param: RawParameter): EndpointParameter {
  return {
    name: param.name,
    type: param.type,
    schema: transformSchemaToV4(param.schema),
  };
}

/**
 * Transforms a raw error to an EndpointError with Zod v4 schema.
 */
function transformError(error: RawError): EndpointError {
  return {
    status: error.status,
    description: typeof error.description === 'string' ? error.description : undefined,
    schema: transformSchemaToV4(error.schema),
  };
}

/**
 * Transforms a raw endpoint to an EndpointDefinition with Zod v4 schemas.
 */
export function transformEndpoint(endpoint: RawEndpoint): EndpointDefinition {
  const parameters = endpoint.parameters
    ? endpoint.parameters.filter(isRawParameter).map(transformParameter)
    : undefined;

  const errors = endpoint.errors
    ? endpoint.errors.filter(isRawError).map(transformError)
    : undefined;

  return {
    method: endpoint.method,
    path: endpoint.path,
    description: endpoint.description,
    requestFormat: endpoint.requestFormat,
    response: transformSchemaToV4(endpoint.response),
    errors: errors && errors.length > 0 ? errors : undefined,
    parameters: parameters && parameters.length > 0 ? parameters : undefined,
  };
}
