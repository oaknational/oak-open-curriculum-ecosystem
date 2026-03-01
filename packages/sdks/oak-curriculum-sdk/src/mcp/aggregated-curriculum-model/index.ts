/**
 * Aggregated curriculum model tool combining ontology and help.
 *
 * @see ./definition.ts for tool schema and metadata
 * @see ./execution.ts for validation and execution logic
 */

export { GET_CURRICULUM_MODEL_TOOL_DEF, GET_CURRICULUM_MODEL_INPUT_SCHEMA } from './definition.js';

export { runCurriculumModelTool, validateCurriculumModelArgs } from './execution.js';
