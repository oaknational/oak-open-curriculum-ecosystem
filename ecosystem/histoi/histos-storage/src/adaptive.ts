/**
 * Simple storage provider that detects available storage mechanisms
 */

import type { StorageProvider } from '@oaknational/mcp-moria';

import { detectStorageOptions, STORAGE_OPTIONS, type GThis } from './detect-storage-options.js';

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

interface FSModule {
  readFile: (path: string, encoding: string) => Promise<string>;
  writeFile: (path: string, data: string, encoding: string) => Promise<void>;
  unlink: (path: string) => Promise<void>;
  access: (path: string) => Promise<void>;
  readdir: (path: string) => Promise<string[]>;
  mkdir: (path: string, options: { recursive: boolean }) => Promise<string | undefined>;
}

interface PathModule {
  join: (...paths: string[]) => string;
}

/**
 * Creates read/write operations for file storage
 */
function createFileOps(dir: string, fs: FSModule, path: PathModule) {
  const getFilePath = (key: string): string => path.join(dir, `${key}.json`);

  return {
    async get(key: string): Promise<string | null> {
      try {
        const content = await fs.readFile(getFilePath(key), 'utf-8');
        return JSON.parse(content) as string;
      } catch {
        return null;
      }
    },
    async set(key: string, value: string): Promise<void> {
      await fs.writeFile(getFilePath(key), JSON.stringify(value), 'utf-8');
    },
    async delete(key: string): Promise<void> {
      try {
        await fs.unlink(getFilePath(key));
      } catch {
        // File doesn't exist, that's okay
      }
    },
    async has(key: string): Promise<boolean> {
      try {
        await fs.access(getFilePath(key));
        return true;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Creates bulk operations for file storage
 */
function createBulkOps(dir: string, fs: FSModule, path: PathModule) {
  return {
    async clear(): Promise<void> {
      try {
        const files = await fs.readdir(dir);
        await Promise.all(
          files
            .filter((f: string) => f.endsWith('.json'))
            .map((f: string) => fs.unlink(path.join(dir, f))),
        );
      } catch {
        // Directory might not exist
      }
    },
    async keys(): Promise<string[]> {
      try {
        const files = await fs.readdir(dir);
        return files.filter((f: string) => f.endsWith('.json')).map((f: string) => f.slice(0, -5));
      } catch {
        return [];
      }
    },
  };
}

/**
 * Creates file storage methods
 */
function createFileStorageMethods(dir: string, fs: FSModule, path: PathModule): StorageProvider {
  return {
    ...createFileOps(dir, fs, path),
    ...createBulkOps(dir, fs, path),
  };
}

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

  // Cast to our interface type
  const fs: FSModule = {
    readFile: fsModule.readFile as FSModule['readFile'],
    writeFile: fsModule.writeFile as FSModule['writeFile'],
    unlink: fsModule.unlink as FSModule['unlink'],
    access: fsModule.access as FSModule['access'],
    readdir: fsModule.readdir as FSModule['readdir'],
    mkdir: fsModule.mkdir as FSModule['mkdir'],
  };

  const path: PathModule = {
    join: (...paths: string[]) => pathModule.join(...paths),
  };

  return createFileStorageMethods(dir, fs, path);
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
