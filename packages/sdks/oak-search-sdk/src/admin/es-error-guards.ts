/**
 * Elasticsearch error guard helpers shared by admin operations.
 */

import { extractStatusCode } from '../internal/index.js';

/**
 * Return true when an error indicates a missing index target.
 *
 * @param error - Unknown caught error
 */
export function isMissingIndexError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return error.message.includes('index_not_found_exception');
}
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
