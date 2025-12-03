/**
 * Widget renderers index.
 *
 * Exports all renderer JavaScript functions as a combined string
 * for embedding in the widget HTML.
 *
 * @see widget-script.ts - Uses WIDGET_RENDERER_FUNCTIONS
 * @see widget-renderer-registry.ts - Maps tool names to renderer IDs
 */

import { WIDGET_HELPERS } from './helpers.js';
import { HELP_RENDERER } from './help-renderer.js';
import { SEARCH_RENDERER } from './search-renderer.js';
import { FETCH_RENDERER } from './fetch-renderer.js';
import { QUIZ_RENDERER } from './quiz-renderer.js';
import { ENTITY_SUMMARY_RENDERER } from './entity-summary-renderer.js';
import { ENTITY_LIST_RENDERER } from './entity-list-renderer.js';
import { TRANSCRIPT_RENDERER } from './transcript-renderer.js';
import { ASSETS_RENDERER } from './assets-renderer.js';
import { CHANGELOG_RENDERER } from './changelog-renderer.js';
import { RATE_LIMIT_RENDERER } from './rate-limit-renderer.js';
import { ONTOLOGY_RENDERER } from './ontology-renderer.js';
import { KNOWLEDGE_GRAPH_RENDERER } from './knowledge-graph-renderer.js';

/**
 * Combined JavaScript functions for all widget renderers.
 *
 * This string is embedded in the widget HTML and provides rendering
 * functions for each tool output type. The renderer is selected by
 * tool name using the TOOL_RENDERER_MAP.
 *
 * Renderer ID → Function name mapping:
 * - 'help' → renderHelp()
 * - 'search' → renderSearch()
 * - 'fetch' → renderFetch()
 * - 'quiz' → renderQuiz()
 * - 'entitySummary' → renderEntitySummary()
 * - 'entityList' → renderEntityList()
 * - 'transcript' → renderTranscript()
 * - 'assets' → renderAssets()
 * - 'changelog' → renderChangelog()
 * - 'rateLimit' → renderRateLimit()
 * - 'ontology' → renderOntology()
 * - 'knowledgeGraph' → renderKnowledgeGraph()
 */
export const WIDGET_RENDERER_FUNCTIONS = [
  WIDGET_HELPERS,
  HELP_RENDERER,
  SEARCH_RENDERER,
  FETCH_RENDERER,
  QUIZ_RENDERER,
  ENTITY_SUMMARY_RENDERER,
  ENTITY_LIST_RENDERER,
  TRANSCRIPT_RENDERER,
  ASSETS_RENDERER,
  CHANGELOG_RENDERER,
  RATE_LIMIT_RENDERER,
  ONTOLOGY_RENDERER,
  KNOWLEDGE_GRAPH_RENDERER,
].join('\n\n');

/**
 * Renderer ID to function name mapping.
 *
 * Used by the widget script to call the correct render function
 * based on the renderer ID from the registry.
 */
export const RENDERER_FUNCTION_NAMES: Readonly<Record<string, string>> = {
  help: 'renderHelp',
  search: 'renderSearch',
  fetch: 'renderFetch',
  quiz: 'renderQuiz',
  entitySummary: 'renderEntitySummary',
  entityList: 'renderEntityList',
  transcript: 'renderTranscript',
  assets: 'renderAssets',
  changelog: 'renderChangelog',
  rateLimit: 'renderRateLimit',
  ontology: 'renderOntology',
  knowledgeGraph: 'renderKnowledgeGraph',
} as const;

// Re-export individual renderers for testing
export { WIDGET_HELPERS } from './helpers.js';
export { HELP_RENDERER } from './help-renderer.js';
export { SEARCH_RENDERER } from './search-renderer.js';
export { FETCH_RENDERER } from './fetch-renderer.js';
export { QUIZ_RENDERER } from './quiz-renderer.js';
export { ENTITY_SUMMARY_RENDERER } from './entity-summary-renderer.js';
export { ENTITY_LIST_RENDERER } from './entity-list-renderer.js';
export { TRANSCRIPT_RENDERER } from './transcript-renderer.js';
export { ASSETS_RENDERER } from './assets-renderer.js';
export { CHANGELOG_RENDERER } from './changelog-renderer.js';
export { RATE_LIMIT_RENDERER } from './rate-limit-renderer.js';
export { ONTOLOGY_RENDERER } from './ontology-renderer.js';
export { KNOWLEDGE_GRAPH_RENDERER } from './knowledge-graph-renderer.js';
