/**
 * Safe GET wrapper for SDK client calls.
 *
 * Catches network exceptions and converts them to Result.Err(SdkNetworkError)
 * per ADR-088.
 *
 * @see `../../../docs/architecture/architectural-decisions/088-result-pattern-for-error-handling.md`
 */

import type { SdkFetchError, ResourceType } from '@oaknational/curriculum-sdk';
import { classifyException } from '@oaknational/curriculum-sdk';
import { ok, err, type Result } from '@oaknational/result';
import { searchLogger } from '../lib/logger';

/**
 * Safely call client.GET, catching network exceptions and returning Result.
 *
 * @param operation - The async operation to execute
 * @param resource - Resource identifier for error context
 * @param resourceType - Type of resource for error classification
 * @returns Result with response or SdkFetchError
 */
export async function safeGet<T>(
  operation: () => Promise<T>,
  resource: string,
  resourceType: ResourceType,
): Promise<Result<T, SdkFetchError>> {
  searchLogger.trace('Executing safe SDK GET', { resource, resourceType });
  try {
    const response = await operation();
    return ok(response);
  } catch (error) {
    return err(classifyException(error, resource, resourceType));
  }
}
