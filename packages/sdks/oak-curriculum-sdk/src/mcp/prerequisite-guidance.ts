/**
 * Shared prerequisite guidance constants for aggregated tool descriptions.
 *
 * These constants ensure consistent messaging across all tools that need
 * to guide users to call get-ontology first for domain understanding.
 *
 * @remarks
 * The generated tools use DOMAIN_PREREQUISITE_GUIDANCE from the type-gen
 * module. Aggregated tools use these constants to maintain consistency
 * with generated tools while allowing customization where needed.
 *
 * @module mcp/prerequisite-guidance
 */

/**
 * The name of the ontology tool that provides domain understanding.
 *
 * Used consistently across all tool descriptions to reference the
 * recommended first-call tool.
 */
export const ONTOLOGY_TOOL_NAME = 'get-ontology' as const;

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
  `PREREQUISITE: If unfamiliar with Oak's curriculum structure, call \`${ONTOLOGY_TOOL_NAME}\` first to understand key stages, subjects, entity hierarchy, and ID formats.` as const;

/**
 * Fetch-specific prerequisite guidance emphasizing ID formats.
 *
 * The fetch tool specifically needs users to understand the "type:slug" pattern,
 * so this variant adds that context.
 */
export const FETCH_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: If unfamiliar with Oak's curriculum structure or ID formats, call \`${ONTOLOGY_TOOL_NAME}\` first to understand key stages, subjects, entity hierarchy, and the "type:slug" pattern.` as const;

/**
 * Help tool prerequisite guidance distinguishing it from ontology.
 *
 * The help tool provides tool usage guidance, not curriculum structure,
 * so this variant clarifies the distinction.
 */
export const HELP_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: For curriculum domain understanding (key stages, subjects, entity hierarchy), use \`${ONTOLOGY_TOOL_NAME}\` instead. This tool provides tool usage guidance, not curriculum structure.` as const;

/**
 * Ontology tool emphasis that it IS the recommended starting point.
 *
 * Unlike other tools, ontology doesn't need a prerequisite - it IS the prerequisite.
 * This text emphasizes calling it first.
 */
export const ONTOLOGY_RECOMMENDED_FIRST_STEP =
  'RECOMMENDED FIRST STEP: Call this tool before using other curriculum tools to understand the domain model.' as const;
