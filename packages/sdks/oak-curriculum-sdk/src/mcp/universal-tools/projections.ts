/**
 * Projection functions for the canonical tool descriptor surface.
 *
 * These functions transform a `UniversalToolListEntry` into the two
 * shapes that MCP consumers need:
 *
 * 1. **Registration projection** (`toRegistrationConfig`) — the config
 *    object for `McpServer.registerTool()`, with Zod inputSchema and
 *    `_meta` for widget tools.
 *
 * 2. **Protocol projection** (`toProtocolEntry`) — the `tools/list`
 *    response entry with JSON Schema inputSchema (preserving examples)
 *    and MCP spec 2025-11-25 top-level `title`.
 *
 * Both projections are referentially stable: the Zod conversion for
 * aggregated tools is cached per `inputSchema` reference via a WeakMap,
 * so repeated calls with the same tool entry produce `===`-equal
 * `inputSchema` values.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/archive/completed/mcp-runtime-boundary-simplification.plan.md — Phase 3
 */

import type { z } from 'zod';
import type { SecurityScheme } from '@oaknational/sdk-codegen/mcp-tools';

import { zodRawShapeFromToolInputJsonSchema } from '../zod-input-schema.js';
import type {
  UniversalToolListEntry,
  UniversalToolInputSchema,
  ToolAnnotations,
  ToolMeta,
} from './types.js';

/**
 * Cache for Zod conversions of JSON Schema inputSchemas.
 *
 * Aggregated tool definitions are module-level constants, so the same
 * `inputSchema` object reference is reused across `listUniversalTools()`
 * calls. Caching here ensures `toRegistrationConfig` returns stable
 * Zod shapes that pass deep-equality checks.
 */
const zodShapeCache = new WeakMap<UniversalToolInputSchema, z.ZodRawShape>();

function resolveZodShape(tool: UniversalToolListEntry): z.ZodRawShape {
  if (tool.flatZodSchema) {
    return tool.flatZodSchema;
  }
  let cached = zodShapeCache.get(tool.inputSchema);
  if (!cached) {
    cached = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    zodShapeCache.set(tool.inputSchema, cached);
  }
  return cached;
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
