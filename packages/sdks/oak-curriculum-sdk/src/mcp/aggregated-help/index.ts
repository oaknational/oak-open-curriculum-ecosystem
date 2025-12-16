/**
 * Aggregated help tool module.
 *
 * Provides a tool for returning tool usage guidance to help
 * users understand how to use the Oak Curriculum MCP server.
 *
 * @packageDocumentation
 */

// Tool definition and schema
export { GET_HELP_INPUT_SCHEMA, GET_HELP_TOOL_DEF } from './definition.js';

// Validation and execution
export { validateHelpArgs, runHelpTool } from './execution.js';
