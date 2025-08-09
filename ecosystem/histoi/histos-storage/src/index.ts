/**
 * @oaknational/mcp-histos-storage
 *
 * Adaptive storage tissue for multi-runtime MCP applications
 * Uses feature detection to provide the best available storage mechanism
 */

export { createAdaptiveStorage } from './adaptive';
export type { StorageOptions } from './adaptive';
export type { StorageProvider } from '@oaknational/mcp-moria';
