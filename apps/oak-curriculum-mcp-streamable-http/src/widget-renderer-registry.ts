/**
 * Widget renderer registry with tool name routing.
 *
 * Maps tool names to renderer IDs for deterministic renderer selection.
 * This is a presentation-layer concern — the mapping is hand-authored
 * based on how we want each tool's output to be rendered.
 *
 * Renderers are parked for the current release — all tools show
 * the neutral shell (Oak logo + heading only). Restore the map
 * entries post-merge to activate search, browse, and explore
 * renderers.
 *
 * @see widget-script.ts - Uses this registry for rendering
 * @see widget-renderers/ - Renderer implementations
 */

/**
 * Valid renderer IDs.
 *
 * Each ID corresponds to a renderer implementation in widget-renderers/.
 */
export const RENDERER_IDS = ['search', 'browse', 'explore'] as const;

/**
 * Type representing a valid renderer ID.
 */
export type RendererId = (typeof RENDERER_IDS)[number];

/**
 * Tool name to renderer ID mapping.
 *
 * Maps each MCP tool name to the renderer that should handle its output.
 * Tools without entries show the neutral shell (Oak logo + heading only).
 *
 * @remarks
 * Adding a map entry before the corresponding JS renderer function
 * exists causes `ReferenceError` at parse time in the ChatGPT sandbox,
 * breaking ALL tools. Each entry here must have a matching
 * `renderX()` function in the widget script — enforced by
 * four-way sync tests.
 */
export const TOOL_RENDERER_MAP = {
  // Renderers parked for current release. Restore post-merge:
  // search: 'search',
  // 'browse-curriculum': 'browse',
  // 'explore-topic': 'explore',
} as const satisfies Readonly<Record<string, RendererId>>;

/**
 * Type guard narrowing a string to a key of the tool renderer map.
 *
 * Used by the registry and by `widget-script-state.ts` for map
 * serialisation. Defined once here (DRY) and exported.
 */
export function isToolWithRenderer(name: string): name is keyof typeof TOOL_RENDERER_MAP {
  return name in TOOL_RENDERER_MAP;
}

/**
 * Gets the renderer ID for a given tool name.
 *
 * @param toolName - The MCP tool name
 * @returns The renderer ID to use, or undefined if no mapping exists
 *
 * @example
 * ```typescript
 * const rendererId = getRendererIdForTool('search');
 * // Returns: 'search'
 *
 * const unknown = getRendererIdForTool('get-lessons-quiz');
 * // Returns: undefined (non-search tools show neutral shell)
 * ```
 */
export function getRendererIdForTool(toolName: string): RendererId | undefined {
  if (isToolWithRenderer(toolName)) {
    return TOOL_RENDERER_MAP[toolName];
  }
  return undefined;
}
