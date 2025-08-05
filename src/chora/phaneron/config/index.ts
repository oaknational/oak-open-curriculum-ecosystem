/**
 * Configuration - Runtime settings that manifest in the organism
 *
 * Public API for configuration management
 */

export { getNotionConfig, createMcpServerInfo } from './environment.js';
export type { NotionConfig, ServerConfig, McpServerInfo } from './environment.js';
export { env } from './env.js';
