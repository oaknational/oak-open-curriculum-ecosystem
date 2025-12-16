/**
 * Helper functions for emit-index code generation.
 *
 * These pure functions are extracted to keep emit-index.ts focused
 * on the main code emission logic while staying under the line limit.
 */

import type { OperationObject } from 'openapi3-ts/oas31';

/**
 * Converts a kebab-case tool name to camelCase for use as a JavaScript identifier.
 *
 * @param toolName - Tool name in kebab-case (e.g., 'get-lessons-summary')
 * @returns camelCase identifier (e.g., 'getLessonsSummary')
 *
 * @example
 * ```typescript
 * literalName('get-lessons-summary'); // 'getLessonsSummary'
 * literalName('get-key-stages');      // 'getKeyStages'
 * ```
 */
export function literalName(toolName: string): string {
  const parts = toolName.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) {
    return toolName;
  }
  return parts
    .map((segment, index) => {
      const lower = segment.toLowerCase();
      if (index === 0) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Collects documented HTTP status codes from an OpenAPI operation.
 *
 * Extracts status codes from the operation's responses object and sorts
 * them numerically (numeric codes first, then wildcards like '2XX').
 *
 * @param operation - OpenAPI operation object
 * @returns Sorted array of status code strings
 *
 * @example
 * ```typescript
 * collectDocumentedStatuses({ responses: { '200': {}, '404': {} } });
 * // ['200', '404']
 * ```
 */
export function collectDocumentedStatuses(operation: OperationObject): readonly string[] {
  const responses = operation.responses ?? {};
  const keys = Object.keys(responses);
  if (keys.length === 0) {
    return ['200'];
  }
  return keys.sort(compareStatuses);
}

/**
 * Compares HTTP status codes for sorting.
 *
 * Numeric status codes are sorted numerically and come before
 * non-numeric codes (like 'default' or '2XX' wildcards).
 *
 * @param left - First status code
 * @param right - Second status code
 * @returns Comparison result for Array.sort()
 */
export function compareStatuses(left: string, right: string): number {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const leftIsNumber = Number.isFinite(leftNumber);
  const rightIsNumber = Number.isFinite(rightNumber);
  if (leftIsNumber && rightIsNumber) {
    return leftNumber - rightNumber;
  }
  if (leftIsNumber) {
    return -1;
  }
  if (rightIsNumber) {
    return 1;
  }
  return left.localeCompare(right);
}
