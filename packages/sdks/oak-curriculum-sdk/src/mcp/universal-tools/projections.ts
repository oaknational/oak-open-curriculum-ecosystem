/**
 * Projection functions for the canonical tool descriptor surface.
 *
 * These functions transform a `UniversalToolListEntry` into the two
 * shapes that MCP consumers need:
 *
 * 1. **Registration projection** (`toRegistrationConfig`) — the config
 *    object for `McpServer.registerTool()`, using `flatZodSchema` as
 *    the canonical input schema. The MCP SDK converts this to JSON
 *    Schema for the `tools/list` response automatically.
 *
 * 2. **Protocol projection** (`toProtocolEntry`) — the `tools/list`
 *    response entry with the hand-written JSON Schema `inputSchema`.
 *    This projection exists only for the `preserve-schema-examples.ts`
 *    shim. Phase 4 deletes the shim and this projection.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/archive/completed/mcp-runtime-boundary-simplification.plan.md — Phase 3
 */

import type { z } from 'zod';
import type { SecurityScheme } from '@oaknational/sdk-codegen/mcp-tools';

import type {
  UniversalToolListEntry,
  UniversalToolInputSchema,
  ToolAnnotations,
  ToolMeta,
} from './types.js';

/**
 * Returns the tool's Zod raw shape for MCP SDK registration.
 *
 * All tools provide `flatZodSchema` — aggregated tools define it
 * directly, generated tools extract it from `toolMcpFlatInputSchema`.
 */
function resolveZodShape(tool: UniversalToolListEntry): z.ZodRawShape {
  return tool.flatZodSchema;
}

/**
 * Produces the config object for `McpServer.registerTool()`.
 *
 * Resolves the inputSchema to a Zod raw shape (using `flatZodSchema`
 * when available, falling back to JSON Schema conversion). Includes
 * `_meta` for widget tools so `registerAppTool()` can normalise UI
 * metadata.
 *
 * @param tool - A universal tool list entry from `listUniversalTools()`
 * @returns Config object ready for `server.registerTool(tool.name, config, handler)`
 */
export function toRegistrationConfig(tool: UniversalToolListEntry): {
  readonly title: string;
  readonly description: string;
  readonly inputSchema: z.ZodRawShape;
  readonly securitySchemes: readonly SecurityScheme[] | undefined;
  readonly annotations: ToolAnnotations | undefined;
  readonly _meta: ToolMeta | undefined;
} {
  return {
    title: tool.annotations?.title ?? tool.name,
    description: tool.description ?? tool.name,
    inputSchema: resolveZodShape(tool),
    securitySchemes: tool.securitySchemes,
    annotations: tool.annotations,
    _meta: tool._meta,
  };
}

/**
 * Produces a `tools/list` protocol entry with JSON Schema inputSchema.
 *
 * Unlike `toRegistrationConfig`, this preserves the original JSON Schema
 * (including `examples` properties) rather than converting to Zod. This
 * is necessary because Zod→JSON Schema conversion structurally drops
 * examples.
 *
 * Includes top-level `title` per MCP spec 2025-11-25 (distinct from
 * `annotations.title`).
 *
 * @param tool - A universal tool list entry from `listUniversalTools()`
 * @returns Protocol entry for the `tools/list` response
 */
export function toProtocolEntry(tool: UniversalToolListEntry): {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly inputSchema: UniversalToolInputSchema;
  readonly outputSchema?: undefined;
  readonly annotations: ToolAnnotations | undefined;
  readonly _meta: ToolMeta | undefined;
} {
  // MCP spec requires inputSchema to be a JSON Schema object type.
  // All Oak tools must have type: 'object' — fail fast if violated.
  if (tool.inputSchema.type !== 'object') {
    throw new TypeError(
      `Tool ${tool.name} has inputSchema.type '${String(tool.inputSchema.type)}', ` +
        `expected 'object'. MCP protocol requires object-type input schemas.`,
    );
  }

  return {
    name: tool.name,
    title: tool.annotations?.title ?? tool.name,
    description: tool.description ?? tool.name,
    inputSchema: tool.inputSchema,
    annotations: tool.annotations,
    _meta: tool._meta,
  };
}
