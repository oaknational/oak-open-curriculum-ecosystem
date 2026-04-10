/**
 * Fetch aggregated tool — retrieve curriculum resources by canonical ID.
 *
 * @example
 * ```typescript
 * import {
 *   FETCH_TOOL_DEF,
 *   FETCH_INPUT_SCHEMA,
 *   validateFetchArgs,
 *   runFetchTool,
 * } from './aggregated-fetch/index.js';
 * ```
 */

export { FETCH_TOOL_DEF, validateFetchArgs, runFetchTool } from './execution.js';
export type { FetchArgs } from './execution.js';
export { FETCH_INPUT_SCHEMA } from './flat-zod-schema.js';
