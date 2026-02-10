/**
 * Type guards for Elasticsearch error shapes.
 *
 * @packageDocumentation
 */

/** Check if an ES error indicates the resource already exists. */
export function isResourceExistsError(error: unknown): boolean {
  const code = extractStatusCode(error);
  return code === 400 || code === 409;
}

/** Check if an ES error indicates the resource was not found. */
export function isNotFoundError(error: unknown): boolean {
  return extractStatusCode(error) === 404;
}

/** Check if an ES error is a mapping error. */
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
 */
function extractStatusCode(error: unknown): number | undefined {
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

function isMetaWithStatusCode(value: unknown): value is { statusCode: number } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'statusCode' in value && typeof value.statusCode === 'number';
}
