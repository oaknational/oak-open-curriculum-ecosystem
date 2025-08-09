/**
 * @oaknational/mcp-histos-logger
 *
 * Adaptive logging tissue for multi-runtime MCP applications
 * Uses Consola with feature detection to adapt configuration
 */

export { createAdaptiveLogger } from './adaptive';
export { ConsolaLogger } from './consola-logger';
export { levelToNumber } from './types';
export type { LoggerOptions, LogLevel } from './types';
export type { Logger } from '@oaknational/mcp-moria';
