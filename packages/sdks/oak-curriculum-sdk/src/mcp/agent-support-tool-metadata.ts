/**
 * Agent Support Tool Metadata - Single Source of Truth
 *
 * Defines metadata for all agent support tools driving:
 * - Server instructions in the MCP initialize response
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
 * Where to send an agent for the Oak surfaces this server does not cover.
 *
 * @remarks
 * Oak publishes three agent-facing entry points — the main site's `llms.txt`,
 * the Oak Open API's machine-readable discovery documents, and this MCP
 * server — and each names the other two so an arriving agent is never at a
 * dead end (MCP-421). This constant is this server's half of that.
 *
 * Deliberately phrased as a CAPABILITY BOUNDARY, not as a parallel route. The
 * Open API serves the same curriculum data over plain HTTP with no
 * authorisation binding, so a sentence that merely advertised it as an easier
 * path would invite an agent to abandon the audience-bound token, the
 * tool-level telemetry, and the graph and search tools that have no HTTP
 * equivalent. Bulk export is the one thing this server genuinely does not do,
 * so that is what the paragraph offers.
 *
 * The URLs are absolute because the reader is an agent on another host, not a
 * browser on this one.
 *
 * Placed BEFORE the brand-provenance paragraph: that paragraph must close the
 * string, and its `endsWith` test is what holds the ordering. Length matters
 * here as much as position — see `SERVER_INSTRUCTIONS_BUDGET`.
 */
const OTHER_SURFACES_GUIDANCE = `For whole-catalogue bulk export, which this server does not offer, use the Oak Open API: https://open-api.thenational.academy/.well-known/api-catalog. Oak's index for agents is https://www.thenational.academy/llms.txt.`;

/**
 * Character ceiling for the generated server instructions.
 *
 * @remarks
 * A host that injects `instructions` into the model's context may cap it, and
 * the cap observed in a real client is 2048 characters, applied per server and
 * taking the TAIL. That makes length a correctness property here, not a style
 * preference: the string closes with the owner-signed brand-provenance
 * paragraph (A011), so an overrun does not degrade gracefully — it silently
 * severs the non-endorsement clause at the client while every gate in this
 * repo, which measures the generated string and not the delivered one, stays
 * green.
 *
 * The budget is asserted by a unit test. When it binds, shorten the prose or
 * move content to a tool; do not raise the ceiling to fit.
 */
export const SERVER_INSTRUCTIONS_BUDGET = 2048;

/**
 * Oak brand ownership and non-endorsement guidance (MCP-365, owner-directed).
 *
 * Surfaces at the point of use the pair of duties Oak's data licence already
 * encodes (see LICENCE-DATA.md): the OGL v3.0 attribution statement for
 * reused curriculum content, and NO implied endorsement OF content the
 * assistant derives. Assembled from the owner's 2026-07-29 words and
 * LICENCE-DATA.md only; the rendered wording is owner-signed-off
 * (never-invent-public-copy).
 *
 * @remarks
 * The expert-authored Brand Usage guidance document (MCP-102 pipeline) is the
 * full form that later deepens or supersedes this compressed paragraph —
 * evolve the two together, never separately.
 */
const BRAND_PROVENANCE_GUIDANCE = `Oak brand and content provenance: Oak National Academy owns the Oak brand and brand elements. When you reuse Oak's curriculum content, attribute it ("Contains public sector information licensed under the Open Government Licence v3.0."). When you create content derived from Oak's resources, we request that it adheres to the same high design standards as Oak — but it must not use the Oak branding, and it must never present itself as Oak-created or Oak-endorsed.`;

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

Call these tools first to reduce errors when using search, fetch, and browsing tools.

Oak's curriculum is fully sequenced: year-ordered progressions, prior-knowledge, misconception, and keyword graphs are served by the anchored graph tools (get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, get-keyword-graph), so lesson and curriculum plans can build on what a class has already covered.

For questions that are not about curriculum content — about the mechanisms by which the content is delivered, about this MCP app or its associated services, or about the repository itself — use the oak-under-the-hood tool to orient yourself to the Oak Open Curriculum Ecosystem.

${OTHER_SURFACES_GUIDANCE}

${BRAND_PROVENANCE_GUIDANCE}`;
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
