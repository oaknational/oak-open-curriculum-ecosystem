/**
 * Shared prerequisite guidance constants for aggregated tool descriptions.
 *
 * These constants ensure consistent messaging across all tools that need
 * to guide agents to call get-curriculum-model first for domain understanding.
 *
 * @remarks
 * The generated tools use DOMAIN_PREREQUISITE_GUIDANCE from the code-generation
 * module. Aggregated tools use these constants to maintain consistency
 * with generated tools while allowing customisation where needed.
 *
 * Server instructions and context hints are now generated from the
 * AGENT_SUPPORT_TOOL_METADATA to ensure they always include all agent
 * support tools and their relationships.
 */

import {
  generateServerInstructions,
  generateContextHint,
  AGENT_SUPPORT_TOOL_NAMES,
} from './agent-support-tool-metadata.js';

/**
 * The name of the primary orientation tool that provides complete domain understanding.
 *
 * Used consistently across all tool descriptions to reference the
 * recommended first-call tool for full curriculum orientation.
 */
export const PRIMARY_ORIENTATION_TOOL_NAME = 'get-curriculum-model' as const;

/**
 * Standard prerequisite guidance for tools requiring curriculum domain knowledge.
 *
 * This matches the generated tool guidance to ensure consistent UX.
 * Append this to tool descriptions that benefit from domain context.
 *
 * @example
 * ```typescript
 * description: `Tool summary.\n\n${AGGREGATED_PREREQUISITE_GUIDANCE}\n\nUse this when...`
 * ```
 */
export const AGGREGATED_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: If unfamiliar with Oak's curriculum structure, call \`${PRIMARY_ORIENTATION_TOOL_NAME}\` first to understand key stages, subjects, entity hierarchy, and ID formats.` as const;

/**
 * Fetch-specific prerequisite guidance emphasizing ID formats.
 *
 * The fetch tool specifically needs users to understand the "type:slug" pattern,
 * so this variant adds that context.
 */
export const FETCH_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: If unfamiliar with Oak's curriculum structure or ID formats, call \`${PRIMARY_ORIENTATION_TOOL_NAME}\` first to understand key stages, subjects, entity hierarchy, and the "type:slug" pattern.` as const;

/**
 * Help tool prerequisite guidance distinguishing it from the combined model.
 *
 * The help tool provides tool usage guidance only, whereas get-curriculum-model
 * provides both domain model and tool guidance in one call.
 */
export const HELP_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: For complete orientation (domain model + tool guidance), use \`${PRIMARY_ORIENTATION_TOOL_NAME}\` instead. This tool provides tool usage guidance only.` as const;

/**
 * Recommended first step text for agent support tools.
 *
 * Used in tool descriptions for get-curriculum-model and get-ontology to
 * emphasise calling them early in the conversation.
 */
export const ONTOLOGY_RECOMMENDED_FIRST_STEP =
  'RECOMMENDED FIRST STEP: Call this tool before using other curriculum tools to understand the domain model.' as const;

/**
 * Context hint included in structuredContent for model guidance.
 *
 * GENERATED from AGENT_SUPPORT_TOOL_METADATA to ensure it always includes
 * all agent support tools.
 *
 * The model sees structuredContent (unlike _meta), so this hint guides
 * the model to call agent support tools for domain understanding.
 *
 * @remarks
 * All tools using formatToolResponse automatically include
 * this hint, providing consistent context grounding across all tools.
 */
export const OAK_CONTEXT_HINT = generateContextHint();

/**
 * Server instructions sent in the MCP initialize response.
 *
 * GENERATED from AGENT_SUPPORT_TOOL_METADATA to ensure it always includes
 * all agent support tools, their relationships, and complementary nature.
 *
 * This text is delivered to the model once at connection time, providing
 * guidance on which tools to call first for optimal results.
 *
 * @remarks
 * Unlike tool descriptions (which may be truncated in large tool lists),
 * server instructions are always visible to the model. Use this for
 * high-priority guidance about agent support tools.
 */
export const SERVER_INSTRUCTIONS = generateServerInstructions();

// Re-export for convenience
export { AGENT_SUPPORT_TOOL_NAMES };
