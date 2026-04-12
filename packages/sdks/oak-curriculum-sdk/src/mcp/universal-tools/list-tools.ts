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
import {
  requireGeneratedToolInputShape,
  requireGeneratedToolMetadata,
} from './descriptor-utils.js';

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
 * All tools include `inputSchema` which contains `.describe()` and
 * `.meta({ examples })` calls that preserve parameter descriptions and
 * examples through the MCP SDK's native `z.toJSONSchema()` conversion.
 * Tools without arguments expose `{}` so downstream registration never has
 * to branch on a missing schema field.
 *
 * Generated tools must already carry a human-facing title and description.
 * Title resolution is SDK-owned and consistent across listing and execution:
 * top-level descriptor `title` first, then `annotations.title` while codegen
 * catches up. This function fails fast if the generator output is missing
 * either value or no longer exposes an object-shaped flat input schema.
 *
 * @returns Array of tool entries with name, description, schema, security,
 *          annotations, and MCP Apps standard metadata
 *
 * @example
 * ```typescript
 * const tools = listUniversalTools(registry);
 * for (const tool of tools) {
 *   const config = {
 *     title: tool.title,
 *     description: tool.description,
 *     inputSchema: tool.inputSchema,
 *     annotations: tool.annotations,
 *   };
 *
 *   if (isAppToolEntry(tool)) {
 *     registerAppTool(server, tool.name, { ...config, _meta: { ...tool._meta } }, handler);
 *   } else {
 *     server.registerTool(tool.name, { ...config, _meta: tool._meta }, handler);
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
        title: def.title,
        description: def.description,
        inputSchema: def.inputSchema,
        securitySchemes: def.securitySchemes,
        annotations: def.annotations,
        _meta: def._meta,
      };
    },
  );

  const generatedEntries: UniversalToolListEntry[] = registry.toolNames.map((name) => {
    const descriptor = registry.getToolFromToolName(name);
    const { title, description } = requireGeneratedToolMetadata(name, descriptor);

    return {
      name,
      title,
      description,
      inputSchema: requireGeneratedToolInputShape(name, descriptor),
      securitySchemes: descriptor.securitySchemes,
      annotations: descriptor.annotations,
      _meta: descriptor._meta,
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}
