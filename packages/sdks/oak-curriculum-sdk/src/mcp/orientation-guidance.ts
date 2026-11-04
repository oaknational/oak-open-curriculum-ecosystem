/**
 * Orientation guidance surfaces for the MCP server.
 *
 * Server instructions are generated from the AGENT_SUPPORT_TOOL_METADATA
 * to ensure they always include all agent support tools and their
 * relationships. Tool DESCRIPTIONS carry no call-another-tool-first
 * imperatives (MCP-300): directory policy bars descriptions from
 * instructing the model about other tools. The one orientation channel
 * is the `instructions` field, delivered once at initialise (MCP-366
 * removed the per-response `oakContextHint` reinforcement; ADR-058
 * records the accepted residual risk).
 */

import { generateServerInstructions } from './agent-support-tool-metadata.js';

/**
 * The name of the primary orientation tool that provides complete domain understanding.
 *
 * Used by the aggregated tool descriptions that cross-reference it (routing
 * documentation such as "use 'get-curriculum-model'"), and by the generated
 * orientation channels, so every surface names the same tool.
 */
export const PRIMARY_ORIENTATION_TOOL_NAME = 'get-curriculum-model' as const;

/**
 * Server instructions sent in the MCP initialize response.
 *
 * GENERATED from AGENT_SUPPORT_TOOL_METADATA to ensure it always includes
 * all agent support tools, their relationships, and complementary nature.
 *
 * This text is sent to the CLIENT once, in the initialize response;
 * whether and how the host surfaces it to the model is client-dependent
 * (the residual risk this channel carries — see the MCP-300 PR record).
 *
 * @remarks
 * Unlike tool descriptions (which may be truncated in large tool lists),
 * server instructions ride a single stable field that hosts CAN surface
 * whole. Use this for high-priority guidance about agent support tools.
 */
export const SERVER_INSTRUCTIONS = generateServerInstructions();

// Re-export for convenience

export { AGENT_SUPPORT_TOOL_NAMES } from './agent-support-tool-metadata.js';
