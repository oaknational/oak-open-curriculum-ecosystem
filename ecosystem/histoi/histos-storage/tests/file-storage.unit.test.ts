import { describe, it, expect, vi } from 'vitest';
import { createFileStorage } from '../src/file-storage';
import type { FileSystemInterface, PathInterface } from '../src/file-storage';

describe('createFileStorage - Unit Tests', () => {
  function createMocks() {
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
      readdir: vi.fn(() => {
        // Extract filenames from paths
        const files = Array.from(storage.keys()).map((p) => p.split('/').pop() ?? '');
        return Promise.resolve([...new Set(files)]);
      }),
      mkdir: vi.fn(() => Promise.resolve(undefined)),
    };

    const mockPath: PathInterface = {
      join: vi.fn((...paths: string[]) => paths.join('/')),
    };

    return { mockFs, mockPath, storage };
  }

  describe('basic operations', () => {
    it('should store and retrieve data', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      await storage.set('key1', 'value1');
      const value = await storage.get('key1');

      expect(value).toBe('value1');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/test/key1.json',
        JSON.stringify('value1'),
        'utf-8',
      );
    });

    it('should return null for non-existent keys', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      const value = await storage.get('missing');
      expect(value).toBeNull();
    });

    it('should delete keys', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      await storage.set('key1', 'value1');
      await storage.delete('key1');

      const value = await storage.get('key1');
      expect(value).toBeNull();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockFs.unlink).toHaveBeenCalledWith('/test/key1.json');
    });

    it('should check key existence', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      await storage.set('key1', 'value1');

      expect(await storage.has('key1')).toBe(true);
      expect(await storage.has('missing')).toBe(false);
    });
  });

  describe('bulk operations', () => {
    it('should list all keys', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');
      await storage.set('key3', 'value3');

      const keys = (await storage.keys?.()) ?? [];
      expect(keys).toEqual(expect.arrayContaining(['key1', 'key2', 'key3']));
      expect(keys).toHaveLength(3);
    });

    it('should clear all keys', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');

      await storage.clear?.();

      expect(await storage.has('key1')).toBe(false);
      expect(await storage.has('key2')).toBe(false);
      expect(await storage.keys?.()).toEqual([]);
    });

    it('should handle clear when directory does not exist', async () => {
      const { mockFs, mockPath } = createMocks();
      // Override readdir to throw error
      mockFs.readdir = vi.fn().mockRejectedValue(new Error('ENOENT'));

      const storage = createFileStorage(mockFs, mockPath, '/test');

      // Should not throw
      await expect(storage.clear?.()).resolves.toBeUndefined();
    });

    it('should handle keys when directory does not exist', async () => {
      const { mockFs, mockPath } = createMocks();
      // Override readdir to throw error
      mockFs.readdir = vi.fn().mockRejectedValue(new Error('ENOENT'));

      const storage = createFileStorage(mockFs, mockPath, '/test');

      const keys = (await storage.keys?.()) ?? [];
      expect(keys).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle delete for non-existent file', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      // Should not throw
      await expect(storage.delete('missing')).resolves.toBeUndefined();
    });

    it('should handle complex data correctly', async () => {
      const { mockFs, mockPath } = createMocks();
      const storage = createFileStorage(mockFs, mockPath, '/test');

      const complexData = JSON.stringify({
        nested: { deep: { value: 'test' } },
        array: [1, 2, 3],
      });

      await storage.set('complex', complexData);
      const retrieved = await storage.get('complex');

      expect(retrieved).toBe(complexData);
    });
  });
});
