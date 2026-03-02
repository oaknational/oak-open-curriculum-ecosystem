/**
 * Agent Support Tool Metadata - Single Source of Truth
 *
 * Defines metadata for all agent support tools driving:
 * - Server instructions in the MCP initialize response
 * - Context hints in tool responses (structuredContent.oakContextHint)
 * - Cross-references between tools (seeAlso fields)
 *
 * Adding a new tool:
 * 1. Add metadata to AGENT_SUPPORT_TOOL_METADATA
 * 2. Add to `toolCategories.agentSupport.tools` in `tool-guidance-data.ts`
 * 3. Run `pnpm test agent-support-tool-metadata` to verify consistency
 *
 * @see ADR-060 for the architectural decision behind this pattern
 */

import { typeSafeValues } from '../types/helpers/type-helpers.js';

/**
 * Metadata for a single agent support tool.
 */
export interface AgentSupportToolMetadata {
  /** Tool name as it appears in tools/list */
  readonly name: string;
  /** Brief description for server instructions */
  readonly shortDescription: string;
  /** What this tool provides to the agent */
  readonly provides: readonly string[];
  /** Why an agent should call this tool */
  readonly purpose: string;
  /** Recommended call order (lower = earlier) */
  readonly callOrder: number;
  /** Tools that complement this one */
  readonly complementsTools: readonly string[];
  /** Brief guidance on when to use related tools instead */
  readonly seeAlso: string;
  /** Whether this tool should be called at conversation start */
  readonly callAtStart: boolean;
}

/**
 * Metadata for all agent support tools.
 *
 * This is the SINGLE SOURCE OF TRUTH for agent support tool information.
 * The toolGuidanceData.toolCategories.agentSupport.tools array should
 * match the keys of this object.
 */
export const AGENT_SUPPORT_TOOL_METADATA = {
  'get-curriculum-model': {
    name: 'get-curriculum-model',
    shortDescription: 'Complete curriculum orientation',
    provides: [
      'domain model',
      'tool guidance',
      'key stages',
      'subjects',
      'entity hierarchy',
      'ID formats',
      'tool categories',
      'workflows',
      'tips',
    ],
    purpose:
      'understand the Oak curriculum domain model and how to use available tools — call this ONCE at conversation start',
    callOrder: 0,
    complementsTools: ['search', 'fetch'],
    seeAlso:
      'search for finding content, fetch for retrieving details, browse-curriculum for browsing',
    callAtStart: true,
  },
} as const;

/**
 * Type for agent support tool names derived from metadata.
 */
export type AgentSupportToolName = keyof typeof AGENT_SUPPORT_TOOL_METADATA;

/**
 * Array of all agent support tool names, sorted by call order.
 */
export const AGENT_SUPPORT_TOOL_NAMES = typeSafeValues(AGENT_SUPPORT_TOOL_METADATA)
  .sort((a, b) => a.callOrder - b.callOrder)
  .map((t) => t.name);

/**
 * Generates server instructions from the metadata.
 *
 * This function derives the SERVER_INSTRUCTIONS string from the metadata,
 * ensuring it always includes all agent support tools and their relationships.
 *
 * @returns Server instructions string for MCP initialize response
 */
export function generateServerInstructions(): string {
  const allTools = typeSafeValues(AGENT_SUPPORT_TOOL_METADATA);

  // Filter to tools that should be called at conversation start
  // Currently all tools have callAtStart=true, but this supports future tools that don't

  const startTools = allTools.filter((t) => t.callAtStart);

  const toolLines = startTools
    .sort((a, b) => a.callOrder - b.callOrder)
    .map(
      (t) => `${String(t.callOrder)}. ${t.name} - ${t.shortDescription}: ${t.provides.join(', ')}`,
    );

  const relationshipLines = allTools
    .sort((a, b) => a.callOrder - b.callOrder)
    .map((t) => `- ${t.name}: ${t.purpose}. See also: ${t.seeAlso}`);

  return `Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call these agent support tools at conversation start:

${toolLines.join('\n')}

These tools are read-only and idempotent. They complement each other:

${relationshipLines.join('\n')}

Call these tools first to reduce errors when using search, fetch, and browsing tools.`;
}

/**
 * Generates context hint from the metadata.
 *
 * This is included in structuredContent of every tool response to reinforce
 * guidance about agent support tools.
 *
 * @returns Context hint string
 */
export function generateContextHint(): string {
  const toolNames = typeSafeValues(AGENT_SUPPORT_TOOL_METADATA)
    .sort((a, b) => a.callOrder - b.callOrder)
    .map((t) => t.name);

  return `If you have not called ${toolNames.join(' or ')} yet, do so before your next tool call — it provides the domain model and tool guidance needed for accurate results.`;
}

/**
 * Checks if a tool name is an agent support tool.
 *
 * @param toolName - Name to check
 * @returns true if it's an agent support tool
 */
export function isAgentSupportTool(toolName: string): toolName is AgentSupportToolName {
  return toolName in AGENT_SUPPORT_TOOL_METADATA;
}

/**
 * Gets the seeAlso reference for a given tool.
 *
 * Use this when generating cross-references in tool responses.
 *
 * @param toolName - Name of the agent support tool
 * @returns seeAlso string or undefined if not an agent support tool
 */
export function getSeeAlsoForTool(toolName: string): string | undefined {
  if (isAgentSupportTool(toolName)) {
    return AGENT_SUPPORT_TOOL_METADATA[toolName].seeAlso;
  }
  return undefined;
}

/**
 * Gets metadata for a specific agent support tool.
 *
 * @param toolName - Name of the agent support tool
 * @returns Metadata or undefined if not found
 */
export function getAgentSupportToolMetadata(
  toolName: AgentSupportToolName,
): AgentSupportToolMetadata {
  return AGENT_SUPPORT_TOOL_METADATA[toolName];
}
