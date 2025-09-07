/**
 * @oaknational/mcp-histos-storage
 *
 * Adaptive storage tissue for multi-runtime MCP applications
 * Uses feature detection to provide the best available storage mechanism
 */

export { createAdaptiveStorage } from './adaptive.js';
export type { StorageOptions } from './adaptive.js';
export { createFileStorage } from './file-storage.js';
export type { FileSystemInterface, PathInterface } from './file-storage.js';
export type { StorageProvider } from '@oaknational/mcp-core';
