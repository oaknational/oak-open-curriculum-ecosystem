/**
 * Phaneron (Φανερόν) - What's visible and manifest at runtime
 *
 * Public API for runtime configuration
 */

// Re-export configuration public API
export { createMcpServerInfo, env } from './config/index.js';
export type { ServerConfig, McpServerInfo, Environment } from './config/index.js';
export { getString, getBoolean, getNumber, getLogLevel, getEnum } from './config/index.js';
export type { BaseEnvironment } from './config/index.js';
