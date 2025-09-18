import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createAdaptiveStorage } from '../src/adaptive';
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('createAdaptiveStorage - Integration Tests', () => {
  // Use relative path for tests - in real usage, the base path would be injected
  const testDir = join('.', '.storage', 'test-namespace');

  beforeEach(() => {
    // Clean up test directory if it exists
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    // Clean up after tests
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('file storage integration', () => {
    it('should persist and retrieve data', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      // Set a value
      await storage.set('test-key', JSON.stringify({ data: 'test-value' }));

      // Retrieve it
      const value = await storage.get('test-key');
      expect(value).not.toBeNull();
      if (value) {
        expect(JSON.parse(value)).toEqual({ data: 'test-value' });
      }
    });

    it('should return null for non-existent keys', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      const value = await storage.get('missing-key');
      expect(value).toBeNull();
    });

    it('should delete keys', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      await storage.set('delete-me', 'value');
      expect(await storage.has('delete-me')).toBe(true);

      await storage.delete('delete-me');
      expect(await storage.has('delete-me')).toBe(false);
    });

    it('should check key existence', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      await storage.set('exists', 'value');

      expect(await storage.has('exists')).toBe(true);
      expect(await storage.has('not-exists')).toBe(false);
    });

    it('should list all keys', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      await storage.set('key1', 'value1');
      await storage.set('key2', 'value2');
      await storage.set('key3', 'value3');

      const keys = await storage.keys();
      expect(keys).toEqual(expect.arrayContaining(['key1', 'key2', 'key3']));
      expect(keys.length).toBe(3);
    });

    it('should clear all keys', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      await storage.set('clear1', 'value1');
      await storage.set('clear2', 'value2');

      await storage.clear();

      expect(await storage.has('clear1')).toBe(false);
      expect(await storage.has('clear2')).toBe(false);

      const keys = await storage.keys();
      expect(keys).toEqual([]);
    });

    it('should handle complex data types', async () => {
      const storage = await createAdaptiveStorage(globalThis, {
        namespace: 'test-namespace',
      });

      const complexData = {
        string: 'text',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        nested: {
          deep: {
            value: 'nested',
          },
        },
      };

      await storage.set('complex', JSON.stringify(complexData));
      const retrieved = await storage.get('complex');

      expect(retrieved).not.toBeNull();
      if (retrieved) {
        expect(JSON.parse(retrieved)).toEqual(complexData);
      }
    });

    it('should isolate namespaces', async () => {
      const storage1 = await createAdaptiveStorage(globalThis, {
        namespace: 'namespace1',
      });
      const storage2 = await createAdaptiveStorage(globalThis, {
        namespace: 'namespace2',
      });

      await storage1.set('key', 'value1');
      await storage2.set('key', 'value2');

      expect(await storage1.get('key')).toBe('value1');
      expect(await storage2.get('key')).toBe('value2');
    });
  });
});
