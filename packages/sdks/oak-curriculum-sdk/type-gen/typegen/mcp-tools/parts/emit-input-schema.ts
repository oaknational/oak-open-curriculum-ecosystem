import type { ParamMetadata, ParamMetadataMap } from './param-metadata.js';
import { buildZodFields } from './build-zod-type.js';
import { jsonSchemaFromPrimitive } from './build-json-schema-property.js';

export type {
  JsonSchemaProperty,
  JsonSchemaPropertyString,
  JsonSchemaPropertyNumber,
  JsonSchemaPropertyBoolean,
  JsonSchemaPropertyArray,
  JsonSchemaObject,
} from './json-schema-types.js';

import type { JsonSchemaObject, JsonSchemaProperty } from './json-schema-types.js';

/**
 * Build a JSON Schema object for a tool's parameters from path/query metadata.
 * Pure, compile-time friendly, no type assertions at call sites.
 */
export function buildInputSchemaObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): JsonSchemaObject {
  const buildSection = (
    entries: readonly (readonly [string, ParamMetadata])[],
  ): {
    readonly properties: Record<string, JsonSchemaProperty>;
    readonly required: readonly string[];
  } => {
    const properties: Record<string, JsonSchemaProperty> = {};
    const required: string[] = [];
    for (const [name, meta] of entries) {
      properties[name] = jsonSchemaFromPrimitive(meta);
      if (meta.required) {
        required.push(name);
      }
    }
    return { properties, required };
  };

  const pathEntries = Object.entries(pathParams);
  const queryEntries = Object.entries(queryParams);
  const pathSection = buildSection(pathEntries);
  const querySection = buildSection(queryEntries);

  const paramsProperties: Record<string, JsonSchemaProperty> = {};
  const paramsRequired: string[] = [];

  if (Object.keys(pathSection.properties).length > 0) {
    paramsProperties.path = {
      type: 'object',
      properties: pathSection.properties,
      additionalProperties: false,
      ...(pathSection.required.length > 0 ? { required: pathSection.required } : {}),
    };
    paramsRequired.push('path');
  }

  if (Object.keys(querySection.properties).length > 0) {
    paramsProperties.query = {
      type: 'object',
      properties: querySection.properties,
      additionalProperties: false,
      ...(querySection.required.length > 0 ? { required: querySection.required } : {}),
    };
    if (querySection.required.length > 0) {
      paramsRequired.push('query');
    }
  }

  const paramsSchema: JsonSchemaObject = {
    type: 'object',
    properties: paramsProperties,
    additionalProperties: false,
    ...(paramsRequired.length > 0 ? { required: paramsRequired } : {}),
  };

  return {
    type: 'object',
    properties: { params: paramsSchema },
    required: ['params'],
    additionalProperties: false,
  };
}

export function buildZodObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): string {
  const pathEntries = Object.entries(pathParams);
  const queryEntries = Object.entries(queryParams);
  const hasPath = pathEntries.length > 0;
  const hasQuery = queryEntries.length > 0;

  if (!hasPath && !hasQuery) {
    return 'z.object({ params: z.object({}) })';
  }

  const paramsShape: string[] = [];

  if (hasPath) {
    const fields = buildZodFields(pathEntries).join(', ');
    paramsShape.push(`path: z.object({ ${fields} })`);
  }

  if (hasQuery) {
    const fields = buildZodFields(queryEntries).join(', ');
    const maybeOptional = queryEntries.some(([, meta]) => meta.required) ? '' : '.optional()';
    paramsShape.push(`query: z.object({ ${fields} })${maybeOptional}`);
  }

  const paramsSchema =
    paramsShape.length > 0 ? `z.object({ ${paramsShape.join(', ')} })` : 'z.object({})';

  return `z.object({ params: ${paramsSchema} })`;
}

/**
 * Build a flat Zod object for MCP tool registration.
 *
 * Merges path and query parameters into a single flat object structure
 * that MCP clients can navigate to discover individual parameters.
 *
 * This differs from buildZodObject which creates nested structure
 * (params → path/query) for internal SDK type safety.
 *
 * @param pathParams - Path parameter metadata from OpenAPI
 * @param queryParams - Query parameter metadata from OpenAPI
 * @returns Zod schema string with flat parameter structure
 *
 * @example
 * ```typescript
 * // Input: path: { id: 'ks1' }, query: { q: 'search' }
 * // Output: "z.object({ id: z.string(), q: z.string() })"
 * ```
 *
 * @remarks
 * - Reuses existing buildZodFields() for type generation
 * - Parameters appear at top level (no params/path/query nesting)
 * - Path parameters listed before query parameters
 * - MCP clients can discover and document each parameter individually
 *
 * @see buildZodObject - Generates nested structure for SDK internal use
 * @see .agent/plans/p0-mcp-flat-schema-generator-fix.md
 * @see .agent/research/deep-reflection-schema-first-and-findings.md (Priority 0)
 */
export function buildFlatMcpZodObject(
  pathParams: ParamMetadataMap,
  queryParams: ParamMetadataMap,
): string {
  // Merge path and query parameters - path first for consistency
  const allEntries = [...Object.entries(pathParams), ...Object.entries(queryParams)];

  // Handle zero-parameter tools
  if (allEntries.length === 0) {
    return 'z.object({})';
  }

  // Reuse existing buildZodFields which handles all type generation logic:
  // - Enum unions (z.literal values)
  // - Optional parameters (.optional())
  // - Array types
  // - Primitive types
  const fields = buildZodFields(allEntries).join(', ');

  return `z.object({ ${fields} })`;
}
