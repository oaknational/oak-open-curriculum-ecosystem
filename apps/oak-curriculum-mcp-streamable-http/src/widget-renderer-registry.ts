/**
 * Widget renderer registry with tool name routing.
 *
 * Maps tool names to renderer IDs for deterministic renderer selection.
 * This is a presentation-layer concern - the mapping is hand-authored
 * based on how we want each tool's output to be rendered.
 *
 * @see widget-script.ts - Uses this registry for rendering
 * @see widget-renderers/ - Renderer implementations
 */

/**
 * Valid renderer IDs.
 *
 * Each ID corresponds to a renderer implementation in widget-renderers/.
 */
export const RENDERER_IDS = [
  'quiz',
  'entitySummary',
  'entityList',
  'transcript',
  'assets',
  'changelog',
  'rateLimit',
  'help',
  'search',
  'fetch',
  'ontology',
] as const;

/**
 * Type representing a valid renderer ID.
 */
export type RendererId = (typeof RENDERER_IDS)[number];

/**
 * Tool name to renderer ID mapping.
 *
 * Maps each MCP tool name to the renderer that should handle its output.
 * Tools with similar output structures share the same renderer.
 *
 * @remarks
 * - Quiz tools (3): Return starterQuiz/exitQuiz structures
 * - Entity summary tools (3): Return single entity details (lesson/unit/subject)
 * - Entity list tools (~12): Return arrays of curriculum entities
 * - Transcript tool (1): Returns transcript + VTT
 * - Assets tools (4): Return downloadable asset information
 * - Changelog tools (2): Return version history
 * - Rate limit tool (1): Returns rate limit status
 * - Help tool (1): Returns server help content
 * - Search tools (3): Return search results with lessons/transcripts
 * - Fetch tool (1): Returns fetched resource with type/data/canonicalUrl
 * - Ontology tool (1): Returns curriculum domain model
 * - Property graph: Concept relationships are included in the ontology response
 */
export const TOOL_RENDERER_MAP: Readonly<Record<string, RendererId>> = {
  // Quiz tools → quizRenderer
  'get-lessons-quiz': 'quiz',
  'get-key-stages-subject-questions': 'quiz',
  'get-sequences-questions': 'quiz',

  // Entity summary tools → entitySummaryRenderer
  'get-lessons-summary': 'entitySummary',
  'get-units-summary': 'entitySummary',
  'get-subject-detail': 'entitySummary',

  // Entity list tools → entityListRenderer
  'get-key-stages': 'entityList',
  'get-subjects': 'entityList',
  'get-subjects-key-stages': 'entityList',
  'get-subjects-years': 'entityList',
  'get-subjects-sequences': 'entityList',
  'get-key-stages-subject-lessons': 'entityList',
  'get-key-stages-subject-units': 'entityList',
  'get-sequences-units': 'entityList',
  'get-threads': 'entityList',
  'get-threads-units': 'entityList',

  // Transcript tool → transcriptRenderer
  'get-lessons-transcript': 'transcript',

  // Assets tools → assetsRenderer
  'get-lessons-assets': 'assets',
  'get-lessons-assets-by-type': 'assets',
  'get-key-stages-subject-assets': 'assets',
  'get-sequences-assets': 'assets',

  // Changelog tools → changelogRenderer
  'get-changelog': 'changelog',
  'get-changelog-latest': 'changelog',

  // Rate limit tool → rateLimitRenderer
  'get-rate-limit': 'rateLimit',

  // Help tool → helpContentRenderer (existing)
  'get-help': 'help',

  // Search tools → searchResultsRenderer (existing)
  search: 'search',
  'get-search-lessons': 'search',
  'get-search-transcripts': 'search',

  // Fetch tool → fetchResultRenderer (existing)
  fetch: 'fetch',

  // Ontology tool → ontologyRenderer
  'get-ontology': 'ontology',
} as const;

/**
 * Gets the renderer ID for a given tool name.
 *
 * @param toolName - The MCP tool name
 * @returns The renderer ID to use, or undefined if no mapping exists
 *
 * @example
 * ```typescript
 * const rendererId = getRendererIdForTool('get-lessons-quiz');
 * // Returns: 'quiz'
 *
 * const unknown = getRendererIdForTool('unknown-tool');
 * // Returns: undefined
 * ```
 */
export function getRendererIdForTool(toolName: string): RendererId | undefined {
  return TOOL_RENDERER_MAP[toolName];
}
