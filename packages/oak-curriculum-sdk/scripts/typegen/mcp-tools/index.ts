/**
 * MCP Tool Generation from OpenAPI Schema
 *
 * Minimal tool generation - only creates tool name to path/method mapping.
 * Everything else (parameters, types, descriptions) lives in the schema.
 */

export { generateMinimalToolLookup } from './minimal-tool-generator.js';
export { generateMcpToolName } from './name-generator.js';
