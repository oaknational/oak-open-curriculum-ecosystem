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
 * Returns both aggregated tools (search, fetch, get-curriculum-model, download-asset)
 * and generated tools from the OpenAPI schema, all with proper MCP
 * annotations and metadata.
 *
 * All tools are always listed. If a tool cannot function on a given transport
 * (e.g. download-asset on stdio), its handler fails fast with a clear error
 * rather than silently hiding the tool.
 *
 * All tools include `flatZodSchema` which contains `.describe()` and
 * `.meta({ examples })` calls that preserve parameter descriptions and
 * examples through the MCP SDK's native `z.toJSONSchema()` conversion.
 *
 * @returns Array of tool entries with name, description, schema, security,
 *          annotations, and MCP Apps standard metadata
 *
 * @example
 * ```typescript
 * const tools = listUniversalTools(registry);
 * for (const tool of tools) {
 *   const config = toRegistrationConfig(tool);
 *   server.registerTool(tool.name, config, handler);
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
        flatZodSchema: def.flatZodSchema,
        securitySchemes: def.securitySchemes,
        annotations: def.annotations,
        _meta: '_meta' in def ? def._meta : undefined,
      };
    },
  );

  const generatedEntries: UniversalToolListEntry[] = registry.toolNames.map((name) => {
    const descriptor = registry.getToolFromToolName(name);
    return {
      name,
      description: descriptor.description,
      flatZodSchema: extractZodShape(descriptor.toolMcpFlatInputSchema) ?? {},
      securitySchemes: descriptor.securitySchemes,
      annotations: descriptor.annotations,
      _meta: descriptor._meta,
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}
