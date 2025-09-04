import { describe, it, expect, vi } from 'vitest';
import { createFileStorage } from '../src/file-storage';
import type { FileSystemInterface, PathInterface } from '../src/file-storage';

describe('Adaptive Storage Integration - Mocked', () => {
  function createMockFileSystem() {
    const storage = new Map<string, string>();

    const mockFs: FileSystemInterface = {
      readFile: vi.fn((path: string) => {
        const content = storage.get(path);
        if (!content) {
          return Promise.reject(new Error(`ENOENT: no such file or directory, open '${path}'`));
        }
        return Promise.resolve(content);
      }),
      writeFile: vi.fn((path: string, data: string) => {
        storage.set(path, data);
        return Promise.resolve();
      }),
      unlink: vi.fn((path: string) => {
        if (!storage.has(path)) {
          return Promise.reject(new Error(`ENOENT: no such file or directory, unlink '${path}'`));
        }
        storage.delete(path);
        return Promise.resolve();
      }),
      access: vi.fn((path: string) => {
        if (!storage.has(path)) {
          return Promise.reject(new Error(`ENOENT: no such file or directory, access '${path}'`));
        }
        return Promise.resolve();
      }),
      readdir: vi.fn((dir: string) => {
        // Filter files by directory prefix
        const files = Array.from(storage.keys())
          .filter((p) => p.startsWith(dir + '/'))
          .map((p) => p.substring(dir.length + 1));
        return Promise.resolve(files);
      }),
      mkdir: vi.fn(() => Promise.resolve(undefined)),
    };

    const mockPath: PathInterface = {
      join: (...paths: string[]) => paths.filter(Boolean).join('/'),
    };

    return { mockFs, mockPath, storage };
  }

  describe('namespace isolation', () => {
    it('should isolate data between namespaces', async () => {
      const { mockFs, mockPath } = createMockFileSystem();

      const storage1 = createFileStorage(mockFs, mockPath, '/storage/namespace1');
      const storage2 = createFileStorage(mockFs, mockPath, '/storage/namespace2');

      await storage1.set('key', 'value1');
      await storage2.set('key', 'value2');

      expect(await storage1.get('key')).toBe('value1');
      expect(await storage2.get('key')).toBe('value2');
    });

    it('should clear only its namespace', async () => {
      const { mockFs, mockPath } = createMockFileSystem();

      const storage1 = createFileStorage(mockFs, mockPath, '/storage/namespace1');
      const storage2 = createFileStorage(mockFs, mockPath, '/storage/namespace2');

      await storage1.set('key1', 'value1');
      await storage2.set('key2', 'value2');

      await storage1.clear?.();

      expect(await storage1.has('key1')).toBe(false);
      expect(await storage2.has('key2')).toBe(true);
    });

    it('should list only keys from its namespace', async () => {
      const { mockFs, mockPath } = createMockFileSystem();

      const storage1 = createFileStorage(mockFs, mockPath, '/storage/namespace1');
      const storage2 = createFileStorage(mockFs, mockPath, '/storage/namespace2');

      await storage1.set('a', 'value1');
      await storage1.set('b', 'value2');
      await storage2.set('c', 'value3');

      const keys1 = (await storage1.keys?.()) ?? [];
      const keys2 = (await storage2.keys?.()) ?? [];

      expect(keys1).toEqual(expect.arrayContaining(['a', 'b']));
      expect(keys1).not.toContain('c');
      expect(keys2).toEqual(['c']);
    });
  });

  describe('concurrent operations', () => {
    it('should handle concurrent writes correctly', async () => {
      const { mockFs, mockPath } = createMockFileSystem();
      const storage = createFileStorage(mockFs, mockPath, '/storage/test');

      // Simulate concurrent writes
      const writes = Promise.all([
        storage.set('key1', 'value1'),
        storage.set('key2', 'value2'),
        storage.set('key3', 'value3'),
      ]);

      await writes;

      expect(await storage.get('key1')).toBe('value1');
      expect(await storage.get('key2')).toBe('value2');
      expect(await storage.get('key3')).toBe('value3');
    });

    it('should handle mixed operations concurrently', async () => {
      const { mockFs, mockPath } = createMockFileSystem();
      const storage = createFileStorage(mockFs, mockPath, '/storage/test');

      // Setup initial data
      await storage.set('existing', 'initial');

      // Simulate concurrent mixed operations
      const operations = Promise.all([
        storage.set('new', 'value'),
        storage.get('existing'),
        storage.has('existing'),
        storage.delete('toDelete'),
        storage.keys?.() ?? Promise.resolve([]),
      ]);

      const [, getValue, hasValue, , keys] = await operations;

      expect(getValue).toBe('initial');
      expect(hasValue).toBe(true);
      expect(keys).toContain('existing');
    });
  });

  describe('error handling', () => {
    it('should gracefully handle filesystem errors during read', async () => {
      const { mockPath } = createMockFileSystem();

      const errorFs: FileSystemInterface = {
        readFile: vi.fn().mockRejectedValue(new Error('Read error')),
        writeFile: vi.fn(),
        unlink: vi.fn(),
        access: vi.fn().mockRejectedValue(new Error('Access error')),
        readdir: vi.fn().mockRejectedValue(new Error('Readdir error')),
        mkdir: vi.fn(),
      };

      const storage = createFileStorage(errorFs, mockPath, '/storage/test');

      // Should return null instead of throwing
      expect(await storage.get('any')).toBeNull();
      expect(await storage.has('any')).toBe(false);
      expect(await storage.keys?.()).toEqual([]);
    });

    it('should handle partial failures in bulk operations gracefully', async () => {
      const { mockFs, mockPath } = createMockFileSystem();

      const storage = createFileStorage(mockFs, mockPath, '/storage/test');

      // Setup some data
      await storage.set('keep1', 'value');
      await storage.set('keep2', 'value');

      let unlinkCallCount = 0;
      // Make unlink fail after first success
      mockFs.unlink = vi.fn((path: string) => {
        unlinkCallCount++;
        if (unlinkCallCount === 2) {
          return Promise.reject(new Error('Unlink failed'));
        }
        // Actually remove from storage
        const { storage: internalStorage } = createMockFileSystem();
        internalStorage.delete(path);
        return Promise.resolve();
      });

      // Clear should complete despite the partial failure
      // (the implementation catches errors)
      await expect(storage.clear?.()).resolves.toBeUndefined();

      // Verify unlink was called for both files

      expect(mockFs.unlink).toHaveBeenCalledTimes(2);
    });
  });
});
