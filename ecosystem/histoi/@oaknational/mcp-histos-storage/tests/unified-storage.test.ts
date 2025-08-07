import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMemoryStorage,
  createStorageWithNodeFeatures,
  createStorageWithBrowserFeatures,
} from '../src/unified-storage';

describe('MemoryStorage', () => {
  it('should create memory storage', () => {
    const storage = createMemoryStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.get).toBe('function');
    expect(typeof storage.set).toBe('function');
  });

  it('should store and retrieve values', async () => {
    const storage = createMemoryStorage();
    await storage.set('test-key', { value: 'test-value' });
    const result = await storage.get('test-key');
    expect(result).toEqual({ value: 'test-value' });
  });

  it('should handle namespaces', async () => {
    const storage1 = createMemoryStorage({ namespace: 'ns1' });
    const storage2 = createMemoryStorage({ namespace: 'ns2' });

    await storage1.set('key', 'value1');
    await storage2.set('key', 'value2');

    expect(await storage1.get('key')).toBe('value1');
    expect(await storage2.get('key')).toBe('value2');
  });

  it('should delete values', async () => {
    const storage = createMemoryStorage();
    await storage.set('key', 'value');
    expect(await storage.has('key')).toBe(true);

    await storage.delete('key');
    expect(await storage.has('key')).toBe(false);
    expect(await storage.get('key')).toBeUndefined();
  });

  it('should clear namespace', async () => {
    const storage = createMemoryStorage({ namespace: 'test' });
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');

    await storage.clear();

    expect(await storage.get('key1')).toBeUndefined();
    expect(await storage.get('key2')).toBeUndefined();
  });

  it('should list keys', async () => {
    const storage = createMemoryStorage();
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    await storage.set('key3', 'value3');

    const keys = await storage.keys();
    expect(keys).toHaveLength(3);
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');
    expect(keys).toContain('key3');
  });
});

describe('FileSystemStorage', () => {
  it('should fall back to memory when fs is not available', async () => {
    const storage = await createStorageWithNodeFeatures();
    // In test environment without actual fs mocking, it should fall back to memory
    expect(storage).toBeDefined();

    await storage.set('test', 'value');
    expect(await storage.get('test')).toBe('value');
  });
});

describe('LocalStorage', () => {
  let mockStorage: Map<string, string>;
  let localStorage: Storage;

  beforeEach(() => {
    mockStorage = new Map();
    localStorage = {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
      clear: () => mockStorage.clear(),
      get length() {
        return mockStorage.size;
      },
      key: (index: number) => {
        const keys = Array.from(mockStorage.keys());
        return keys[index] ?? null;
      },
    };
  });

  it('should create localStorage-based storage when available', () => {
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorage,
      configurable: true,
    });

    const storage = createStorageWithBrowserFeatures();
    expect(storage).toBeDefined();

    // Restore original
    if (originalLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });
    } else {
      delete (globalThis as any).localStorage;
    }
  });

  it('should fall back to memory when localStorage is not available', () => {
    const originalLocalStorage = globalThis.localStorage;
    delete (globalThis as any).localStorage;

    const storage = createStorageWithBrowserFeatures();
    expect(storage).toBeDefined();

    // Restore original
    if (originalLocalStorage) {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });
    }
  });
});
