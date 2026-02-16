/**
 * Browse-curriculum tool for structured curriculum navigation.
 *
 * This module provides the browse tool backed by the Search SDK's
 * `fetchSequenceFacets()`, offering structured facet data showing
 * available subjects, key stages, sequences, units, and lesson counts.
 *
 * @example
 * ```typescript
 * import {
 *   BROWSE_TOOL_DEF,
 *   BROWSE_INPUT_SCHEMA,
 *   validateBrowseArgs,
 *   runBrowseTool,
 * } from './aggregated-browse/index.js';
 * ```
 */

export { BROWSE_TOOL_DEF, BROWSE_INPUT_SCHEMA } from './tool-definition.js';
export type { BrowseArgs } from './types.js';
export { validateBrowseArgs } from './validation.js';
export { runBrowseTool } from './execution.js';
