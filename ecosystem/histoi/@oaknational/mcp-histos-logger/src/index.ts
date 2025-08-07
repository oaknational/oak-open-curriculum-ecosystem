/**
 * @oaknational/mcp-histos-logger
 *
 * Adaptive logging tissue for multi-runtime MCP applications
 * Automatically selects the best logger implementation based on runtime
 */

export { createLogger, createAdaptiveLogger } from './adaptive.js';
export type { LoggerOptions } from './adaptive.js';
export type { Logger } from '@oaknational/mcp-moria';
