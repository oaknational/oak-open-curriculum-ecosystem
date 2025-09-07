/**
 * File storage implementation with injectable filesystem
 */

import type { StorageProvider } from '@oaknational/mcp-core';

// BufferEncoding is a global type from Node.js
export interface FileSystemInterface {
  readFile(path: string, encoding: BufferEncoding): Promise<string>;
  writeFile(path: string, data: string, encoding?: BufferEncoding): Promise<void>;
  unlink(path: string): Promise<void>;
  access(path: string): Promise<void>;
  readdir(path: string): Promise<string[]>;
  mkdir(path: string, options: { recursive: boolean }): Promise<string | undefined>;
}

export interface PathInterface {
  join(...paths: string[]): string;
}

/**
 * Creates read/write operations for file storage
 */
function createFileOps(fs: FileSystemInterface, path: PathInterface, dir: string) {
  const getFilePath = (key: string): string => path.join(dir, `${key}.json`);

  return {
    async get(key: string): Promise<string | null> {
      try {
        const content = await fs.readFile(getFilePath(key), 'utf-8');
        // EXTERNAL BOUNDARY: Validate JSON content from file system
        const parsed: unknown = JSON.parse(content);
        // We expect the stored value to be a string
        if (typeof parsed === 'string') {
          return parsed;
        }
        // If not a string, return null (invalid data)
        return null;
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
function createBulkOps(fs: FileSystemInterface, path: PathInterface, dir: string) {
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
 * Creates file storage with injected dependencies
 */
export function createFileStorage(
  fs: FileSystemInterface,
  path: PathInterface,
  dir: string,
): StorageProvider {
  return {
    ...createFileOps(fs, path, dir),
    ...createBulkOps(fs, path, dir),
  };
}
