/**
 * Simple storage provider that detects available storage mechanisms
 */

import type { StorageProvider } from '@oaknational/mcp-core';

import { detectStorageOptions, STORAGE_OPTIONS, type GThis } from './detect-storage-options.js';
import {
  createFileStorage as createFileStorageImpl,
  type FileSystemInterface,
  type PathInterface,
} from './file-storage.js';

export interface StorageOptions {
  namespace?: string;
  basePath?: string;
}

class StorageNotSupportedError extends Error {
  constructor() {
    super(
      'No storage mechanism available. ' +
        'Expected either file system access (fs module) or Cloudflare KV. ' +
        'Falling back to in-memory storage.',
    );
    this.name = 'StorageNotSupportedError';
  }
}

// Removed - now using createFileStorage from file-storage.ts

/**
 * Creates file-based storage provider
 *
 * @param options - Storage options
 * @returns StorageProvider
 *
 * @throws TypeError if the Node.js file system is not available, can only happen through improper flow control.
 */
async function createFileStorage(options?: StorageOptions): Promise<StorageProvider> {
  const fsModule = await import('node:fs/promises');
  const pathModule = await import('node:path');

  const basePath = options?.basePath ?? '.storage';
  const namespace = options?.namespace ?? 'default';
  const dir = pathModule.join(basePath, namespace);

  // Ensure directory exists
  await fsModule.mkdir(dir, { recursive: true });

  // Create adapter that matches our interface using the actual Node.js types
  // No type assertions needed - we're adapting the functions to our interface
  const fs: FileSystemInterface = {
    readFile: fsModule.readFile,
    writeFile: fsModule.writeFile,
    unlink: fsModule.unlink,
    access: fsModule.access,
    readdir: fsModule.readdir,
    mkdir: fsModule.mkdir,
  };

  const path: PathInterface = {
    join: (...paths: string[]) => pathModule.join(...paths),
  };

  return createFileStorageImpl(fs, path, dir);
}

/**
 * Creates Cloudflare KV storage provider
 */
async function createKVStorage(gThis: GThis, options?: StorageOptions): Promise<StorageProvider> {
  if (!gThis.env?.KV || typeof gThis.env.KV !== 'object') {
    throw new TypeError('Cloudflare KV confusingly not available');
  }

  // Note: This is a simplified example. Real Cloudflare KV integration
  // would need proper error handling and putting in a separate
  // file, with the proper types imported
  const kv = gThis.env.KV;
  const namespace = options?.namespace ?? 'default';

  return Promise.resolve({
    async get(key: string): Promise<string | null> {
      return await kv.get(`${namespace}:${key}`);
    },

    async set(key: string, value: string): Promise<void> {
      await kv.put(`${namespace}:${key}`, value);
    },

    async delete(key: string): Promise<void> {
      await kv.delete(`${namespace}:${key}`);
    },

    async has(key: string): Promise<boolean> {
      const value = await kv.get(`${namespace}:${key}`);
      return value !== null;
    },

    clear(): Promise<void> {
      // KV doesn't have a clear all, would need to track keys
      return Promise.reject(new Error('Clear not supported in Cloudflare KV'));
    },

    keys(): Promise<string[]> {
      // Would need to implement key listing
      return Promise.reject(new Error('Keys listing not supported in Cloudflare KV'));
    },
  });
}

/**
 * Creates a storage provider by detecting available features
 *
 * Checks for:
 * 1. File system access via dynamic import of fs/promises
 * 2. Cloudflare KV (if available on globalThis)
 *
 * If neither is available, throws StorageNotSupportedError
 *
 * @param gThis - GlobalThis object to detect features on
 * @param options - Storage options
 * @returns StorageProvider
 *
 * @throws StorageNotSupportedError if neither fs nor KV is available
 */
export async function createAdaptiveStorage(
  gThis: GThis,
  options?: StorageOptions,
): Promise<StorageProvider> {
  const storageOption = await detectStorageOptions(gThis);

  if (storageOption === null) {
    throw new StorageNotSupportedError();
  }

  if (storageOption === STORAGE_OPTIONS.NODE_FS.name) {
    return createFileStorage(options);
  }

  return createKVStorage(gThis, options);
}
