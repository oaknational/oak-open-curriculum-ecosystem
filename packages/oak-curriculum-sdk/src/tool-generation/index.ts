/**
 * Programmatic tool generation support for the Oak Curriculum SDK.
 *
 * Exposes pre-generated metadata from the OpenAPI schema to support
 * consumers (e.g. MCP servers) in generating tools programmatically.
 */

import { schema } from '../types/generated/api-schema/api-schema';
import {
  KEY_STAGES,
  SUBJECTS,
  PATH_OPERATIONS as GENERATED_PATH_OPERATIONS,
  OPERATIONS_BY_ID as GENERATED_OPERATIONS_BY_ID,
  allowedMethods,
  type PathOperation as GeneratedPathOperation,
} from '../types/generated/api-schema/path-parameters';

// Re-export the generated constants with consistent naming
export const PATH_OPERATIONS = GENERATED_PATH_OPERATIONS;
export const OPERATIONS_BY_ID = GENERATED_OPERATIONS_BY_ID;

// Re-export types for consistency
export type PathOperation = GeneratedPathOperation;
export type HttpMethod = (typeof allowedMethods)[number];

// Curated parameter type map for well-known values
export const PARAM_TYPE_MAP = {
  keyStage: {
    type: 'string' as const,
    enum: KEY_STAGES,
  },
  subject: {
    type: 'string' as const,
    enum: SUBJECTS,
  },
} as const;

/**
 * Parse a path template to extract path parameter names and provide a deterministic
 * MCP tool name generator based on the HTTP method and non-parameter path segments.
 *
 * @param pathTemplate - A path template with `{param}` placeholders, e.g. `/lessons/{lesson}/transcript`
 * @param method - The HTTP method, e.g. `GET`
 * @returns Object with `pathParams` and `toMcpToolName()` helper.
 *
 * @example
 * ```ts
 * const { pathParams, toMcpToolName } = parsePathTemplate('/lessons/{lesson}/transcript', 'GET');
 * // pathParams => ['lesson']
 * // toMcpToolName() => 'oak-get-lessons-transcript'
 * ```
 */
export function parsePathTemplate(
  pathTemplate: string,
  method: string,
): { pathParams: string[]; toMcpToolName: () => string } {
  const pathParams: string[] = [];
  const segments = pathTemplate.split('/').filter(Boolean);
  const paramCapture = /^\{([^}]+)\}$/;
  const paramPattern = /^\{[^}]+\}$/;
  for (const seg of segments) {
    const match = paramCapture.exec(seg);
    if (match) {
      pathParams.push(match[1]);
    }
  }

  const nameSegments = segments
    .filter((seg) => !paramPattern.exec(seg))
    .map((s) => s.replace(/[^a-zA-Z0-9]+/g, '-'))
    .filter(Boolean);

  const toMcpToolName = () => `oak-${method.toLowerCase()}-${nameSegments.join('-')}`;

  return { pathParams, toMcpToolName };
}

// Re-export constants for ease of use
export { KEY_STAGES, SUBJECTS, allowedMethods, schema };

/**
 * Programmatic tool generation exports: pre-generated metadata and helpers.
 *
 * Includes:
 * - `PATH_OPERATIONS` and `OPERATIONS_BY_ID` (operation metadata)
 * - `PARAM_TYPE_MAP` (curated parameter schemas)
 * - `parsePathTemplate` (path template utility)
 * - Allowed value constants (`KEY_STAGES`, `SUBJECTS`, `allowedMethods`)
 *
 * @example
 * ```ts
 * import { toolGeneration } from '@oaknational/oak-curriculum-sdk';
 *
 * for (const op of toolGeneration.PATH_OPERATIONS) {
 *   const { toMcpToolName } = toolGeneration.parsePathTemplate(op.path, op.method);
 *   console.log(op.operationId, toMcpToolName());
 * }
 * ```
 */
const toolGeneration = {
  PATH_OPERATIONS,
  OPERATIONS_BY_ID,
  PARAM_TYPE_MAP,
  parsePathTemplate,
  KEY_STAGES,
  SUBJECTS,
  allowedMethods,
};

export default toolGeneration;
export { toolGeneration };
