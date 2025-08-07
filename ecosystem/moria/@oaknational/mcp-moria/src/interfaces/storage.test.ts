/**
 * @fileoverview Tests for StorageProvider interface
 * @module moria/interfaces/storage.test
 */

import { describe, it, expect } from 'vitest';
import type { StorageProvider } from './storage';

describe('StorageProvider interface', () => {
  it('should define async get method', () => {
    const mockStorage: StorageProvider = {
      get: async (key: string) => {
        return key === 'test' ? 'value' : undefined;
      },
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => {
        return key === 'test';
      },
    };

    expect(mockStorage.get).toBeDefined();
    expect(typeof mockStorage.get).toBe('function');
  });

  it('should define async set method', () => {
    const mockStorage: StorageProvider = {
      get: async (key: string) => undefined,
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => false,
    };

    expect(mockStorage.set).toBeDefined();
    expect(typeof mockStorage.set).toBe('function');
  });

  it('should define async delete method', () => {
    const mockStorage: StorageProvider = {
      get: async (key: string) => undefined,
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => false,
    };

    expect(mockStorage.delete).toBeDefined();
    expect(typeof mockStorage.delete).toBe('function');
  });

  it('should define async has method', () => {
    const mockStorage: StorageProvider = {
      get: async (key: string) => undefined,
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => false,
    };

    expect(mockStorage.has).toBeDefined();
    expect(typeof mockStorage.has).toBe('function');
  });

  it('should support optional clear method', () => {
    const mockStorageWithClear: StorageProvider = {
      get: async (key: string) => undefined,
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => false,
      clear: async () => {
        // Mock implementation
      },
    };

    expect(mockStorageWithClear.clear).toBeDefined();
    expect(typeof mockStorageWithClear.clear).toBe('function');
  });

  it('should support optional keys method', () => {
    const mockStorageWithKeys: StorageProvider = {
      get: async (key: string) => undefined,
      set: async (key: string, value: string) => {
        // Mock implementation
      },
      delete: async (key: string) => {
        // Mock implementation
      },
      has: async (key: string) => false,
      keys: async () => {
        return ['key1', 'key2'];
      },
    };

    expect(mockStorageWithKeys.keys).toBeDefined();
    expect(typeof mockStorageWithKeys.keys).toBe('function');
  });
});
