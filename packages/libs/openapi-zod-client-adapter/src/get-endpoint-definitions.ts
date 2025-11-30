/**
 * Wrapper for openapi-zod-client's getZodiosEndpointDefinitionList.
 *
 * This module provides access to endpoint definitions extracted from OpenAPI,
 * transforming all Zod v3 schema code to Zod v4 before returning.
 *
 * @packageDocumentation
 */

import { getZodiosEndpointDefinitionList } from 'openapi-zod-client';
import type { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';
import type { EndpointDefinitionOptions, EndpointDefinitionResult } from './endpoint-types.js';
import { DEFAULT_ENDPOINT_OPTIONS } from './endpoint-types.js';
import { isRawEndpoint, transformEndpoint } from './endpoint-transformers.js';

// Re-export types for public API
export type {
  EndpointDefinitionOptions,
  EndpointDefinitionResult,
  EndpointDefinition,
  EndpointParameter,
  EndpointError,
} from './endpoint-types.js';

/**
 * Extracts endpoint definitions from an OpenAPI document.
 *
 * This function wraps openapi-zod-client's getZodiosEndpointDefinitionList
 * and transforms ALL Zod v3 schema code to Zod v4 before returning.
 *
 * @param openApiDoc - The OpenAPI document to extract endpoints from
 * @param options - Configuration options for endpoint extraction
 * @returns Endpoint definitions with Zod v4 schema code
 *
 * @example
 * ```typescript
 * import { getEndpointDefinitions } from '@oaknational/openapi-zod-client-adapter';
 *
 * const result = getEndpointDefinitions(openApiDoc);
 *
 * for (const endpoint of result.endpoints) {
 *   // endpoint.parameters[].schema is Zod v4 code
 *   console.log(`${endpoint.method} ${endpoint.path}`);
 * }
 * ```
 */
export function getEndpointDefinitions(
  openApiDoc: OpenAPIObject,
  options?: EndpointDefinitionOptions,
): EndpointDefinitionResult {
  const mergedOptions = { ...DEFAULT_ENDPOINT_OPTIONS, ...options };

  // openapi-zod-client expects paths to be present
  const openApiDocWithPaths =
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- openapi-zod-client uses an outdated PathsObject definition
    openApiDoc as OpenAPIObject & { paths: PathsObject };

  const result = getZodiosEndpointDefinitionList(openApiDocWithPaths, mergedOptions);

  // Transform all endpoints to use Zod v4 schemas
  const rawEndpoints = Array.isArray(result.endpoints) ? result.endpoints : [];
  const endpoints = rawEndpoints.filter(isRawEndpoint).map(transformEndpoint);

  return { endpoints };
}
