/**
 * Public API for the MCP organ
 *
 * Only these exports should be imported by other organs or the psychon layer.
 */

// Resource handlers
export { createResourceHandlers } from './resources/handlers/index';

// Tool handlers
export { createToolHandlers } from './tools/handlers';

// Types
export type { McpTool, McpToolResult } from './types';
