/**
 * Shared Elasticsearch error helpers used by admin and retrieval paths.
 */

/**
 * Extract the HTTP status code from an ES error.
 *
 * The ES client may put it directly on the error (`statusCode`) or
 * nested in a `meta` property.
 *
 * @param error - The error thrown by the Elasticsearch client
 * @returns The HTTP status code, or `undefined` if not available
 */
export function extractStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }
  if ('meta' in error && isMetaWithStatusCode(error.meta)) {
    return error.meta.statusCode;
  }
  return undefined;
}

/**
 * Type guard: value has a numeric statusCode property.
 *
 * @param value - Value to check
 * @returns True if value is object with numeric statusCode
 */
function isMetaWithStatusCode(value: unknown): value is { statusCode: number } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'statusCode' in value && typeof value.statusCode === 'number';
}
