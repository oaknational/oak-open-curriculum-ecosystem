/**
 * @oaknational/mcp-storage
 *
 * Adaptive storage library for multi-runtime MCP applications
 * Uses feature detection to provide the best available storage mechanism
 */

export { createAdaptiveStorage } from './adaptive.js';
export type { StorageOptions } from './adaptive.js';
export { createFileStorage } from './file-storage.js';
export type { FileSystemInterface, PathInterface } from './file-storage.js';
/**
 * Storage provider interface for consistent storage access
 */
export interface StorageProvider {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  clear(): Promise<void>;
}
