/**
 * Agent Support Tool Metadata - Single Source of Truth
 *
 * This module defines metadata for all agent support tools, including their
 * relationships and complementary nature. This data drives:
 * - Server instructions in the MCP initialize response
 * - Context hints in tool responses (structuredContent.oakContextHint)
 * - Cross-references between tools (seeAlso fields)
 *
 * ## Architecture
 *
 * The agent support tool metadata system ensures that:
 * 1. All agent support tools are consistently documented
 * 2. Relationships between tools are explicitly encoded
 * 3. Server instructions and context hints are always up-to-date
 * 4. Adding a new tool automatically updates all downstream artifacts
 *
 * See ADR-060 for the architectural decision behind this pattern.
 *
 * ## Adding a New Agent Support Tool
 *
 * To add a new agent support tool:
 *
 * 1. Add metadata to {@link AGENT_SUPPORT_TOOL_METADATA}:
 *    ```typescript
 *    'get-glossary': {
 *      name: 'get-glossary',
 *      shortDescription: 'Curriculum terminology',
 *      provides: ['definitions', 'synonyms', 'related terms'],
 *      purpose: 'understand terminology and jargon',
 *      callOrder: 4, // Next available number
 *      complementsTools: ['get-ontology', 'get-help'],
 *      seeAlso: 'get-ontology for domain structure',
 *      callAtStart: true,
 *    }
 *    ```
 *
 * 2. Add the tool to `toolCategories.agentSupport.tools` in `tool-guidance-data.ts`
 *
 * 3. Run tests to verify consistency:
 *    ```bash
 *    pnpm test agent-support-tool-metadata
 *    ```
 *
 * The tests verify that metadata entries match the tools array, ensuring
 * the single source of truth is maintained.
 *
 * ## Relationship Encoding
 *
 * Tool relationships are encoded through:
 * - `complementsTools`: Array of tools that complement this one
 * - `seeAlso`: Human-readable guidance on when to use related tools
 * - `purpose`: Uses WHAT/HOW/WHICH verbs to distinguish tool roles
 * - `callOrder`: Recommended sequence for calling tools
 *
 * @example
 * ```typescript
 * import {
 *   generateServerInstructions,
 *   generateContextHint,
 *   AGENT_SUPPORT_TOOL_NAMES,
 * } from './agent-support-tool-metadata.js';
 *
 * // Get server instructions for MCP initialize response
 * const instructions = generateServerInstructions();
 *
 * // Get context hint for tool responses
 * const hint = generateContextHint();
 *
 * // Check all tool names (in call order)
 * console.log(AGENT_SUPPORT_TOOL_NAMES);
 * // ['get-ontology', 'get-knowledge-graph', 'get-help']
 * ```
 *
 * @module mcp/agent-support-tool-metadata
 * @see {@link ../../../docs/architecture/architectural-decisions/060-agent-support-metadata-system.md | ADR-060}
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
  'get-ontology': {
    name: 'get-ontology',
    shortDescription: 'Domain model definitions',
    provides: ['key stages', 'subjects', 'entity hierarchy', 'ID formats', 'domain vocabulary'],
    purpose: 'understand WHAT curriculum concepts are and what they mean',
    callOrder: 1,
    complementsTools: ['get-knowledge-graph', 'get-help'],
    seeAlso: 'get-knowledge-graph for structural relationships, get-help for tool usage',
    callAtStart: true,
  },
  'get-knowledge-graph': {
    name: 'get-knowledge-graph',
    shortDescription: 'Concept TYPE relationships',
    provides: [
      'domain structure graph',
      'entity relationships',
      'hierarchy paths',
      'taxonomy connections',
    ],
    purpose: 'understand HOW curriculum concept types connect structurally',
    callOrder: 2,
    complementsTools: ['get-ontology', 'get-help'],
    seeAlso: 'get-ontology for rich definitions, get-help for tool guidance',
    callAtStart: true,
  },
  'get-help': {
    name: 'get-help',
    shortDescription: 'Tool usage guidance',
    provides: ['tool categories', 'workflows', 'tips', 'common patterns'],
    purpose: 'understand WHICH tools to use and when',
    callOrder: 3,
    complementsTools: ['get-ontology', 'get-knowledge-graph'],
    seeAlso: 'get-ontology for domain definitions, get-knowledge-graph for structure',
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
  const toolPurposes = typeSafeValues(AGENT_SUPPORT_TOOL_METADATA)
    .sort((a, b) => a.callOrder - b.callOrder)
    .map((t) => `${t.name} for ${t.provides.slice(0, 2).join('/')}`);

  return `For optimal results with Oak curriculum tools, call ${toolPurposes.join(', ')}.`;
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
