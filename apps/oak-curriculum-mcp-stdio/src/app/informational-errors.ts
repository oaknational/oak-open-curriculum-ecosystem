/**
 * Identifies error classifications that represent informational outcomes
 * rather than genuine failures.
 *
 * Some upstream API responses indicate deliberate, correct behaviour
 * (e.g. copyright-blocked content) rather than errors. These should be
 * presented to the AI agent as informational content (`isError: false`),
 * not as tool failures.
 */

/**
 * Error codes that represent informational outcomes, not failures.
 *
 * - `CONTENT_NOT_AVAILABLE`: Content exists but is restricted by
 *   third-party copyright. The API is working correctly — the content
 *   simply cannot be served due to licensing.
 */
const INFORMATIONAL_ERROR_CODES: ReadonlySet<string> = new Set(['CONTENT_NOT_AVAILABLE']);

/**
 * Check whether an error represents an informational outcome.
 *
 * @param error - An object with an optional `code` property (e.g. McpToolError)
 * @returns `true` if the error code is in the informational set
 */
export function isInformationalError(error: { readonly code?: string }): boolean {
  return typeof error.code === 'string' && INFORMATIONAL_ERROR_CODES.has(error.code);
}
