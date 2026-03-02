/**
 * Type guards for Elasticsearch error shapes.
 */

/**
 * Check if an ES error indicates the resource already exists.
 *
 * @param error - The error thrown by the Elasticsearch client
 * @returns True if status code is 400 or 409
 */
export function isResourceExistsError(error: unknown): boolean {
  const code = extractStatusCode(error);
  return code === 400 || code === 409;
}

/**
 * Check if an ES error indicates the resource was not found.
 *
 * @param error - The error thrown by the Elasticsearch client
 * @returns True if status code is 404
 */
export function isNotFoundError(error: unknown): boolean {
  return extractStatusCode(error) === 404;
}

/**
 * Check if an ES error is a mapping error (strict_dynamic_mapping_exception).
 *
 * @param error - The error thrown by the Elasticsearch client
 * @returns True if message includes strict_dynamic_mapping_exception
 */
export function isMappingError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.message.includes('strict_dynamic_mapping_exception');
}

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
