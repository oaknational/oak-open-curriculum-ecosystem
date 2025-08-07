/**
 * @oaknational/mcp-histos-logger
 *
 * Adaptive logging tissue for multi-runtime MCP applications
 * Uses Consola with feature detection to adapt configuration
 */

export { createLogger, createAdaptiveLogger } from './adaptive.js';
export {
  ConsolaLogger,
  createLoggerWithNodeFeatures,
  createBasicLogger,
} from './consola-logger.js';
export type { LoggerOptions } from './adaptive.js';
export type { Logger } from '@oaknational/mcp-moria';
