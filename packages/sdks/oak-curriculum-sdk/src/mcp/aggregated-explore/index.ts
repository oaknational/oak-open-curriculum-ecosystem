/**
 * Explore-topic compound tool for cross-curriculum discovery.
 *
 * This module provides the explore tool that searches lessons, units,
 * and threads in parallel, returning a unified topic map showing what's
 * available across the curriculum for a given topic.
 *
 * @example
 * ```typescript
 * import {
 *   EXPLORE_TOOL_DEF,
 *   EXPLORE_FLAT_ZOD_SCHEMA,
 *   validateExploreArgs,
 *   runExploreTool,
 * } from './aggregated-explore/index.js';
 * ```
 */

export { EXPLORE_TOOL_DEF, EXPLORE_FLAT_ZOD_SCHEMA } from './tool-definition.js';
export type { ExploreArgs } from './types.js';
export { validateExploreArgs } from './validation.js';
export { runExploreTool } from './execution.js';
export { formatTopicMap } from './formatting.js';
