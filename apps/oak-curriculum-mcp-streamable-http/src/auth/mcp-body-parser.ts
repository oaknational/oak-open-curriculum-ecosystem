/**
 * MCP request body parsing utilities.
 *
 * Pure functions for extracting data from MCP request bodies with proper type narrowing.
 * These utilities are used by authentication middleware to determine resource URIs.
 *
 * @module
 */

/**
 * Type guard for object with params property.
 *
 * @param value - Unknown value to check
 * @returns True if value is an object with a params property
 *
 * @example
 * ```typescript
 * if (hasParamsProperty(body)) {
 *   // body.params is safely accessible
 * }
 * ```
 */
function hasParamsProperty(value: unknown): value is { params: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'params' in value;
}

/**
 * Type guard for object with uri property.
 *
 * @param value - Unknown value to check
 * @returns True if value is an object with a uri property
 *
 * @example
 * ```typescript
 * if (hasUriProperty(params)) {
 *   // params.uri is safely accessible
 * }
 * ```
 */
function hasUriProperty(value: unknown): value is { uri: unknown } {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'uri' in value;
}

/**
 * Extracts resource URI from MCP request body.
 *
 * Uses chained type guards to safely narrow types without assertions.
 * Returns undefined if the body structure is invalid or uri is not a string.
 *
 * @param body - Request body (unknown shape)
 * @returns Resource URI if present and string, undefined otherwise
 *
 * @example
 * ```typescript
 * const uri = getResourceUriFromBody(req.body);
 * if (uri && isPublicResourceUri(uri)) {
 *   // Skip authentication for public resource
 * }
 * ```
 */
export function getResourceUriFromBody(body: unknown): string | undefined {
  if (!hasParamsProperty(body)) {
    return undefined;
  }
  if (!hasUriProperty(body.params)) {
    return undefined;
  }
  if (typeof body.params.uri !== 'string') {
    return undefined;
  }
  return body.params.uri;
}
