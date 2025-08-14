/**
 * MCP Tool to Schema Mapping Generator
 *
 * Generates the mapping between MCP tools and their Zod schemas
 * directly from the OpenAPI schema. NO HARDCODING.
 */

import type { OpenAPI3, OperationObject, ResponseObject } from 'openapi-typescript';
import type { McpToolInfo } from './index.js';

/**
 * Extract the response schema name for an operation
 * This should match what zodgen produces
 */
function extractResponseSchemaName(operation: OperationObject): string {
  // Get the 200 response
  const responses = operation.responses;
  if (!responses) return 'z.unknown()';

  const successResponse = responses['200'];
  if (!successResponse || typeof successResponse !== 'object') return 'z.unknown()';

  // If it has a content type with a schema, we can derive the name
  const content = successResponse.content;
  if (!content) return 'z.unknown()';

  const jsonContent = content['application/json'];
  if (!jsonContent?.schema) return 'z.unknown()';

  // Check if it's a reference to a schema
  const schema = jsonContent.schema;
  if ('$ref' in schema) {
    // Extract schema name from ref like "#/components/schemas/SequenceUnitsResponseSchema"
    const refParts = schema.$ref.split('/');
    const schemaName = refParts[refParts.length - 1];
    if (schemaName) {
      // The schema name already includes "Schema" suffix from OpenAPI
      // Use it directly without adding another suffix
      return schemaName;
    }
  }

  // For inline schemas, we need to generate them inline
  // This will be handled by zodgen
  return 'z.unknown()';
}

/**
 * Generate the schema mapping from OpenAPI
 */
export function generateSchemaMapping(schema: OpenAPI3, tools: McpToolInfo[]): Map<string, string> {
  const mapping = new Map<string, string>();

  if (!schema.paths) return mapping;

  for (const tool of tools) {
    const pathItem = schema.paths[tool.path];
    if (!pathItem || typeof pathItem !== 'object' || '$ref' in pathItem) {
      mapping.set(tool.mcpName, 'z.unknown()');
      continue;
    }

    const method = tool.method;
    if (
      method !== 'get' &&
      method !== 'post' &&
      method !== 'put' &&
      method !== 'delete' &&
      method !== 'patch'
    ) {
      mapping.set(tool.mcpName, 'z.unknown()');
      continue;
    }
    const operation = pathItem[method];
    if (!operation || typeof operation !== 'object') {
      mapping.set(tool.mcpName, 'z.unknown()');
      continue;
    }

    const schemaName = extractResponseSchemaName(operation);
    mapping.set(tool.mcpName, schemaName);
  }

  return mapping;
}

/**
 * Generate the validator mapping code
 */
export function generateValidatorMappingCode(schema: OpenAPI3, tools: McpToolInfo[]): string {
  const mapping = generateSchemaMapping(schema, tools);

  const lines: string[] = [];
  for (const [toolName, schemaName] of mapping.entries()) {
    if (schemaName.startsWith('z.')) {
      // Inline Zod schema
      lines.push(`  '${toolName}': ${schemaName},`);
    } else if (schemaName !== 'z.unknown()') {
      // Reference to schemas object
      lines.push(`  '${toolName}': schemas.${schemaName},`);
    } else {
      // Unknown schema
      lines.push(`  '${toolName}': z.unknown(),`);
    }
  }

  return lines.join('\n');
}
