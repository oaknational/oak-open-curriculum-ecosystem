/**
 * Configuration - Runtime settings that manifest in the organism
 *
 * Public API for configuration management
 */

export { createMcpServerInfo } from './environment.js';
export type { ServerConfig, McpServerInfo } from './environment.js';
export { env } from './env.js';
export type { Environment } from './env.js';
export { getString, getBoolean, getNumber, getLogLevel, getEnum } from './env-parser.js';
export type { BaseEnvironment } from './env-parser.js';
