/**
 * Widget renderers index.
 *
 * Exports renderer JavaScript functions as a combined string
 * for embedding in the widget HTML.
 *
 * @see widget-script.ts - Uses WIDGET_RENDERER_FUNCTIONS
 * @see widget-renderer-registry.ts - Maps tool names to renderer IDs
 */

import { WIDGET_HELPERS } from './helpers.js';
import { SEARCH_RENDERER } from './search-renderer.js';
import { BROWSE_RENDERER } from './browse-renderer.js';
import { EXPLORE_RENDERER } from './explore-renderer.js';

/**
 * Combined JavaScript functions for widget renderers.
 *
 * Renderer ID to function name mapping:
 * - 'search' maps to renderSearch()
 * - 'browse' maps to renderBrowse()
 * - 'explore' maps to renderExplore()
 */
export const WIDGET_RENDERER_FUNCTIONS = [
  WIDGET_HELPERS,
  SEARCH_RENDERER,
  BROWSE_RENDERER,
  EXPLORE_RENDERER,
].join('\n\n');

export { WIDGET_HELPERS } from './helpers.js';
export { SEARCH_RENDERER } from './search-renderer.js';
export { BROWSE_RENDERER } from './browse-renderer.js';
export { EXPLORE_RENDERER } from './explore-renderer.js';
