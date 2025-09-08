/**
 * Public API for the MCP tools module
 *
 * Only these exports should be imported by other modules or the app layer.
 */

// Resource handlers
export { createResourceHandlers } from './resources/handlers/index.js';

// Tool handlers
export { createToolHandlers } from './runtime/handlers.js';

// Types
export type { McpTool, McpToolResult } from '../types';
