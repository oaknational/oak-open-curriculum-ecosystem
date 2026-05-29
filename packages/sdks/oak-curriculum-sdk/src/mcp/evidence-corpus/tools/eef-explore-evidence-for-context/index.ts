/**
 * `eef-explore-evidence-for-context` tool (gate-1a t6a) — barrel.
 *
 * Surfaces a connected subgraph of EEF Teaching and Learning Toolkit strands
 * for a teacher's lesson context, with structural citations + caveats.
 *
 * @example
 * ```typescript
 * import {
 *   EEF_EXPLORE_TOOL_DEF,
 *   EEF_EXPLORE_INPUT_SCHEMA,
 *   validateEefExploreArgs,
 *   runEefExploreTool,
 * } from './evidence-corpus/tools/eef-explore-evidence-for-context/index.js';
 * ```
 */

export {
  EEF_EXPLORE_TOOL_DEF,
  EEF_EXPLORE_INPUT_SCHEMA,
  type EefExploreArgs,
  type EefExploreFocus,
} from './tool-definition.js';
export { validateEefExploreArgs } from './validation.js';
export { runEefExploreTool, handleEefExploreTool, type EefExploreToolDeps } from './execution.js';
