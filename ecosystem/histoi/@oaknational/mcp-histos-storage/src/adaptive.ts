/**
 * Adaptive storage that automatically selects the best available storage mechanism
 */

import type { StorageProvider } from '@oaknational/mcp-moria';
import {
  createStorageWithNodeFeatures,
  createStorageWithBrowserFeatures,
  createMemoryStorage,
} from './unified-storage';

export interface StorageOptions {
  namespace?: string;
  basePath?: string;
  preferredBackend?: 'fs' | 'localStorage' | 'memory';
}

/**
 * Creates an adaptive storage instance that works in any environment
 *
 * Detection order:
 * 1. If preferredBackend is specified and available, use it
 * 2. Try Node.js file system (if available)
 * 3. Try browser localStorage (if available)
 * 4. Fall back to in-memory storage
 */
export async function createAdaptiveStorage(options?: StorageOptions): Promise<StorageProvider> {
  // If a preferred backend is specified, try it first
  if (options?.preferredBackend) {
    switch (options.preferredBackend) {
      case 'fs':
        try {
          return await createStorageWithNodeFeatures(options);
        } catch {
          // Fall through to auto-detection
        }
        break;
      case 'localStorage':
        try {
          return createStorageWithBrowserFeatures(options);
        } catch {
          // Fall through to auto-detection
        }
        break;
      case 'memory':
        return createMemoryStorage(options);
    }
  }

  // Auto-detect the best available storage
  // Try Node.js fs first (most persistent)
  try {
    await import('node:fs');
    return await createStorageWithNodeFeatures(options);
  } catch {
    // Not in Node.js or fs not available
  }

  // Try browser localStorage
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return createStorageWithBrowserFeatures(options);
  }

  // Fall back to memory storage
  return createMemoryStorage(options);
}

/**
 * Convenience function that creates storage synchronously
 * Note: This will never use file system storage as that requires async import
 */
export function createStorage(options?: StorageOptions): StorageProvider {
  if (options?.preferredBackend === 'memory') {
    return createMemoryStorage(options);
  }

  // Try browser localStorage
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return createStorageWithBrowserFeatures(options);
  }

  // Fall back to memory
  return createMemoryStorage(options);
}
