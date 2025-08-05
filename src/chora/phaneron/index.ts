/**
 * Phaneron (Φανερόν) - What's visible and manifest at runtime
 *
 * Public API for runtime configuration
 */

// Re-export configuration public API
export { getNotionConfig, createMcpServerInfo, env } from './config/index.js';
export type { NotionConfig, ServerConfig, McpServerInfo } from './config/index.js';
