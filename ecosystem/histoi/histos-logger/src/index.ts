/**
 * @oaknational/mcp-histos-logger
 *
 * Adaptive logging tissue for multi-runtime MCP applications
 * Uses Consola with feature detection to adapt configuration
 */

export { createAdaptiveLogger } from './adaptive.js';
export { ConsolaLogger } from './consola-logger.js';
export { levelToNumber } from './types.js';
export type { LoggerOptions, LogLevel } from './types.js';
export type { Logger } from '@oaknational/mcp-moria';
