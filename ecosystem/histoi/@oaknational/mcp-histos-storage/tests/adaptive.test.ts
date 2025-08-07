import { describe, it, expect } from 'vitest';
import { createAdaptiveStorage, createStorage } from '../src/adaptive';

describe('createAdaptiveStorage', () => {
  it('should create adaptive storage', async () => {
    const storage = await createAdaptiveStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.get).toBe('function');
    expect(typeof storage.set).toBe('function');
    expect(typeof storage.delete).toBe('function');
    expect(typeof storage.has).toBe('function');
    expect(typeof storage.clear).toBe('function');
    expect(typeof storage.keys).toBe('function');
  });

  it('should work with namespace option', async () => {
    const storage = await createAdaptiveStorage({ namespace: 'test-ns' });
    await storage.set('key', 'value');
    expect(await storage.get('key')).toBe('value');
  });

  it('should respect preferredBackend option for memory', async () => {
    const storage = await createAdaptiveStorage({ preferredBackend: 'memory' });
    await storage.set('test', { data: 'value' });
    const result = await storage.get('test');
    expect(result).toEqual({ data: 'value' });
  });

  it('should handle storage operations', async () => {
    const storage = await createAdaptiveStorage();

    // Set and get
    await storage.set('user', { name: 'John', age: 30 });
    const user = await storage.get('user');
    expect(user).toEqual({ name: 'John', age: 30 });

    // Has
    expect(await storage.has('user')).toBe(true);
    expect(await storage.has('nonexistent')).toBe(false);

    // Delete
    await storage.delete('user');
    expect(await storage.has('user')).toBe(false);

    // Keys
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');
    const keys = await storage.keys();
    expect(keys).toContain('key1');
    expect(keys).toContain('key2');

    // Clear
    await storage.clear();
    expect(await storage.keys()).toHaveLength(0);
  });

  it('should handle complex data types', async () => {
    const storage = await createAdaptiveStorage();

    const complexData = {
      string: 'text',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2, 3],
      nested: {
        deep: {
          value: 'nested',
        },
      },
    };

    await storage.set('complex', complexData);
    const retrieved = await storage.get('complex');
    expect(retrieved).toEqual(complexData);
  });
});

describe('createStorage (synchronous)', () => {
  it('should create storage synchronously', () => {
    const storage = createStorage();
    expect(storage).toBeDefined();
    expect(typeof storage.get).toBe('function');
  });

  it('should work with memory backend', () => {
    const storage = createStorage({ preferredBackend: 'memory' });
    expect(storage).toBeDefined();
  });

  it('should handle basic operations', async () => {
    const storage = createStorage();

    await storage.set('sync-key', 'sync-value');
    expect(await storage.get('sync-key')).toBe('sync-value');

    await storage.delete('sync-key');
    expect(await storage.get('sync-key')).toBeUndefined();
  });
});
