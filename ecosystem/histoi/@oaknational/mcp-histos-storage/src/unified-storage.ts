/**
 * Unified storage implementation that adapts based on available features
 */

import type { StorageProvider } from '@oaknational/mcp-moria';

interface StorageOptions {
  namespace?: string;
  basePath?: string;
}

/**
 * In-memory storage fallback
 */
class MemoryStorage implements StorageProvider {
  private data = new Map<string, unknown>();
  private namespace: string;

  constructor(options?: StorageOptions) {
    this.namespace = options?.namespace ?? 'default';
  }

  async get<T>(key: string): Promise<T | undefined> {
    const fullKey = `${this.namespace}:${key}`;
    return this.data.get(fullKey) as T | undefined;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const fullKey = `${this.namespace}:${key}`;
    this.data.set(fullKey, value);
  }

  async delete(key: string): Promise<void> {
    const fullKey = `${this.namespace}:${key}`;
    this.data.delete(fullKey);
  }

  async has(key: string): Promise<boolean> {
    const fullKey = `${this.namespace}:${key}`;
    return this.data.has(fullKey);
  }

  async clear(): Promise<void> {
    const prefix = `${this.namespace}:`;
    for (const key of this.data.keys()) {
      if (key.startsWith(prefix)) {
        this.data.delete(key);
      }
    }
  }

  async keys(): Promise<string[]> {
    const prefix = `${this.namespace}:`;
    const result: string[] = [];
    for (const key of this.data.keys()) {
      if (key.startsWith(prefix)) {
        result.push(key.slice(prefix.length));
      }
    }
    return result;
  }
}

/**
 * Node.js file system storage
 */
class FileSystemStorage implements StorageProvider {
  private namespace: string;
  private basePath: string;
  private fs: typeof import('node:fs');
  private path: typeof import('node:path');

  constructor(
    options: StorageOptions & { fs: typeof import('node:fs'); path: typeof import('node:path') },
  ) {
    this.namespace = options.namespace ?? 'default';
    this.basePath = options.basePath ?? './.storage';
    this.fs = options.fs;
    this.path = options.path;
  }

  private getFilePath(key: string): string {
    const sanitizedKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return this.path.join(this.basePath, this.namespace, `${sanitizedKey}.json`);
  }

  private async ensureDirectory(): Promise<void> {
    const dir = this.path.join(this.basePath, this.namespace);
    await this.fs.promises.mkdir(dir, { recursive: true });
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const filePath = this.getFilePath(key);
      const data = await this.fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T;
    } catch {
      return undefined;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureDirectory();
    const filePath = this.getFilePath(key);
    const data = JSON.stringify(value, null, 2);
    await this.fs.promises.writeFile(filePath, data, 'utf-8');
  }

  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await this.fs.promises.unlink(filePath);
    } catch {
      // File doesn't exist, that's okay
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      await this.fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const dir = this.path.join(this.basePath, this.namespace);
      const files = await this.fs.promises.readdir(dir);
      await Promise.all(
        files.map((file: string) => this.fs.promises.unlink(this.path.join(dir, file))),
      );
    } catch {
      // Directory doesn't exist, that's okay
    }
  }

  async keys(): Promise<string[]> {
    try {
      const dir = this.path.join(this.basePath, this.namespace);
      const files = await this.fs.promises.readdir(dir);
      return files
        .filter((file: string) => file.endsWith('.json'))
        .map((file: string) => file.replace('.json', '').replace(/_/g, '-'));
    } catch {
      return [];
    }
  }
}

/**
 * Browser localStorage storage
 */
class LocalStorage implements StorageProvider {
  private namespace: string;
  private storage: globalThis.Storage;

  constructor(options: StorageOptions & { storage: globalThis.Storage }) {
    this.namespace = options?.namespace ?? 'default';
    this.storage = options.storage;
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const fullKey = this.getKey(key);
    const value = this.storage.getItem(fullKey);
    if (value === null) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const fullKey = this.getKey(key);
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(fullKey, serialized);
  }

  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key);
    this.storage.removeItem(fullKey);
  }

  async has(key: string): Promise<boolean> {
    const fullKey = this.getKey(key);
    return this.storage.getItem(fullKey) !== null;
  }

  async clear(): Promise<void> {
    const prefix = `${this.namespace}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => this.storage.removeItem(key));
  }

  async keys(): Promise<string[]> {
    const prefix = `${this.namespace}:`;
    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(prefix)) {
        result.push(key.slice(prefix.length));
      }
    }
    return result;
  }
}

/**
 * Create storage with Node.js features (file system)
 */
export async function createStorageWithNodeFeatures(
  options?: StorageOptions,
): Promise<StorageProvider> {
  try {
    const fs = await import('node:fs');
    const path = await import('node:path');
    return new FileSystemStorage({ ...options, fs, path });
  } catch {
    // No fs available, fall back to memory
    return new MemoryStorage(options);
  }
}

/**
 * Create storage with browser features (localStorage)
 */
export function createStorageWithBrowserFeatures(options?: StorageOptions): StorageProvider {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return new LocalStorage({ ...options, storage: globalThis.localStorage });
  }
  // No localStorage available, fall back to memory
  return new MemoryStorage(options);
}

/**
 * Create basic memory storage (always available)
 */
export function createMemoryStorage(options?: StorageOptions): StorageProvider {
  return new MemoryStorage(options);
}
