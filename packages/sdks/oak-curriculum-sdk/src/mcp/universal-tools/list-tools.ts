/**
 * Tool listing functionality for MCP registration.
 *
 * This module provides the function to list all available MCP tools
 * with their metadata, combining both aggregated tools (hand-written)
 * and generated tools (from OpenAPI spec).
 */

import { typeSafeKeys } from '../../types/helpers/type-helpers.js';
import { AGGREGATED_TOOL_DEFS } from './definitions.js';
import type { GeneratedToolRegistry, UniversalToolListEntry } from './types.js';
import { extractZodShape } from './zod-utils.js';

/**
 * Lists all available MCP tools with their metadata.
 *
 * Returns both aggregated tools (search, fetch, get-curriculum-model)
 * and generated tools from the OpenAPI schema, all with proper MCP
 * annotations and metadata.
 *
 * Generated tools include `flatZodSchema` which contains .describe() calls
 * that preserve parameter descriptions through the MCP SDK's zodToJsonSchema
 * conversion. Aggregated tools don't have this (they use JSON Schema directly).
 *
 * @returns Array of tool entries with name, description, schema, security,
 *          annotations, and OpenAI Apps SDK metadata
 *
 * @example
 * ```typescript
 * const tools = listUniversalTools(registry);
 * for (const tool of tools) {
 *   if (tool.flatZodSchema) {
 *     server.registerTool(tool.name, tool.flatZodSchema, handler);
 *   } else {
 *     server.registerTool(tool.name, tool.inputSchema, handler);
 *   }
 * }
 * ```
 */
export function listUniversalTools(registry: GeneratedToolRegistry): UniversalToolListEntry[] {
  const aggregatedEntries: UniversalToolListEntry[] = typeSafeKeys(AGGREGATED_TOOL_DEFS).map(
    (name) => {
      const def = AGGREGATED_TOOL_DEFS[name];
      return {
        name,
        description: def.description,
        inputSchema: def.inputSchema,
        // Aggregated tools don't have generated Zod, so flatZodSchema is undefined
        securitySchemes: def.securitySchemes,
        annotations: def.annotations,
        _meta: def._meta,
      };
    },
  );

  const generatedEntries: UniversalToolListEntry[] = registry.toolNames.map((name) => {
    const descriptor = registry.getToolFromToolName(name);
    return {
      name,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      // Use generated Zod schema which includes .describe() for parameter descriptions
      flatZodSchema: extractZodShape(descriptor.toolMcpFlatInputSchema),
      securitySchemes: descriptor.securitySchemes,
      annotations: descriptor.annotations,
      _meta: descriptor._meta,
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}
