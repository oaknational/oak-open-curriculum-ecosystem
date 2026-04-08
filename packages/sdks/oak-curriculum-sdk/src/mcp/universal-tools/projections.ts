/**
 * Projection functions for the canonical tool descriptor surface.
 *
 * These functions transform a `UniversalToolListEntry` into the shapes
 * that MCP consumers need:
 *
 * 1. **Registration projection** (`toRegistrationConfig`) — the config
 *    object for `McpServer.registerTool()`, using `flatZodSchema` as
 *    the canonical input schema. Used for non-UI tools.
 *
 * 2. **App tool projection** (`toAppToolRegistrationConfig`) — the config
 *    object for `registerAppTool()`, with non-optional `_meta.ui` that
 *    satisfies `McpUiAppToolConfig`. Used for UI-bearing tools.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md — Phase 3
 */

import type { z } from 'zod';
import type { SecurityScheme } from '@oaknational/sdk-codegen/mcp-tools';
import type { McpUiAppToolConfig } from '@modelcontextprotocol/ext-apps/server';

import type { UniversalToolListEntry, ToolAnnotations, ToolMeta } from './types.js';

/**
 * A `UniversalToolListEntry` known to carry `_meta.ui` metadata.
 *
 * Widget tools (those in `WIDGET_TOOL_NAMES`) always have this field.
 * Use `isAppToolEntry()` to narrow a `UniversalToolListEntry` to this type.
 */
export interface AppToolListEntry extends UniversalToolListEntry {
  readonly _meta: ToolMeta & { readonly ui: { readonly resourceUri: string } };
}

/**
 * Type guard that narrows a `UniversalToolListEntry` to an `AppToolListEntry`.
 *
 * Returns true when the tool carries `_meta.ui.resourceUri`, indicating it
 * should be registered via `registerAppTool()` for UI metadata normalisation.
 */
export function isAppToolEntry(tool: UniversalToolListEntry): tool is AppToolListEntry {
  return tool._meta?.ui !== undefined && typeof tool._meta.ui.resourceUri === 'string';
}

/**
 * Produces the config object for `McpServer.registerTool()`.
 *
 * Used for non-UI tools. For UI-bearing tools, use
 * `toAppToolRegistrationConfig()` instead.
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
    title: tool.title ?? tool.annotations?.title ?? tool.name,
    description: tool.description ?? tool.name,
    inputSchema: tool.flatZodSchema,
    securitySchemes: tool.securitySchemes,
    annotations: tool.annotations,
    _meta: tool._meta,
  };
}

/**
 * Produces the config object for `registerAppTool()`.
 *
 * Unlike `toRegistrationConfig()`, this function accepts only tools that
 * carry `_meta.ui` and returns a config where `_meta` is non-optional with
 * `ui` guaranteed present — satisfying `McpUiAppToolConfig`.
 *
 * The spread `{ ...tool._meta }` strips `readonly` modifiers for structural
 * compatibility with `McpUiAppToolConfig._meta`'s index signature.
 *
 * @param tool - A universal tool list entry known to have `_meta.ui`
 * @returns Config object ready for `registerAppTool(server, name, config, handler)`
 */
export function toAppToolRegistrationConfig(tool: AppToolListEntry): McpUiAppToolConfig & {
  readonly inputSchema: z.ZodRawShape;
  readonly securitySchemes: readonly SecurityScheme[] | undefined;
  readonly annotations: ToolAnnotations | undefined;
} {
  return {
    title: tool.title ?? tool.annotations?.title ?? tool.name,
    description: tool.description ?? tool.name,
    inputSchema: tool.flatZodSchema,
    securitySchemes: tool.securitySchemes,
    annotations: tool.annotations,
    _meta: { ...tool._meta },
  };
}
