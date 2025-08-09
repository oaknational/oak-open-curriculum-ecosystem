import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAdaptiveStorage } from '../src/adaptive';

describe('createAdaptiveStorage', () => {
  let mockFs: {
    mkdir: ReturnType<typeof vi.fn>;
    readFile: ReturnType<typeof vi.fn>;
    writeFile: ReturnType<typeof vi.fn>;
    unlink: ReturnType<typeof vi.fn>;
    access: ReturnType<typeof vi.fn>;
    readdir: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock fs/promises module
    mockFs = {
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn(),
      writeFile: vi.fn().mockResolvedValue(undefined),
      unlink: vi.fn().mockResolvedValue(undefined),
      access: vi.fn(),
      readdir: vi.fn().mockResolvedValue([]),
    };

    vi.doMock('node:fs/promises', () => mockFs);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('file storage', () => {
    it('should create file-based storage provider', async () => {
      const storage = await createAdaptiveStorage(globalThis);
      expect(storage).toBeDefined();
      expect(typeof storage.get).toBe('function');
      expect(typeof storage.set).toBe('function');
      expect(typeof storage.delete).toBe('function');
      expect(typeof storage.has).toBe('function');
    });

    it('should handle get operation', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify('test-value'));
      
      const storage = await createAdaptiveStorage(globalThis);
      const value = await storage.get('test-key');
      
      expect(value).toBe('test-value');
      expect(mockFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('test-key.json'),
        'utf-8'
      );
    });

    it('should return null for non-existent key', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      
      const storage = await createAdaptiveStorage(globalThis);
      const value = await storage.get('missing');
      
      expect(value).toBeNull();
    });

    it('should handle set operation', async () => {
      const storage = await createAdaptiveStorage(globalThis);
      await storage.set('test-key', 'test-value');
      
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('test-key.json'),
        JSON.stringify('test-value'),
        'utf-8'
      );
    });

    it('should handle delete operation', async () => {
      const storage = await createAdaptiveStorage(globalThis);
      await storage.delete('test-key');
      
      expect(mockFs.unlink).toHaveBeenCalledWith(
        expect.stringContaining('test-key.json')
      );
    });

    it('should handle has operation', async () => {
      mockFs.access.mockResolvedValue(undefined);
      
      const storage = await createAdaptiveStorage(globalThis);
      const exists = await storage.has('test-key');
      
      expect(exists).toBe(true);
      expect(mockFs.access).toHaveBeenCalledWith(
        expect.stringContaining('test-key.json')
      );
    });

    it('should return false for non-existent key in has', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'));
      
      const storage = await createAdaptiveStorage(globalThis);
      const exists = await storage.has('missing');
      
      expect(exists).toBe(false);
    });

    it('should handle keys operation', async () => {
      mockFs.readdir.mockResolvedValue(['file1.json', 'file2.json', 'other.txt']);
      
      const storage = await createAdaptiveStorage(globalThis);
      const keys = await storage.keys?.();
      
      expect(keys).toEqual(['file1', 'file2']);
    });

    it('should handle clear operation', async () => {
      mockFs.readdir.mockResolvedValue(['file1.json', 'file2.json']);
      
      const storage = await createAdaptiveStorage(globalThis);
      await storage.clear?.();
      
      expect(mockFs.unlink).toHaveBeenCalledTimes(2);
    });

    it('should use custom namespace', async () => {
      const storage = await createAdaptiveStorage(globalThis, { 
        namespace: 'custom-ns' 
      });
      await storage.set('key', 'value');
      
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('custom-ns'),
        { recursive: true }
      );
    });

    it('should use custom base path', async () => {
      const storage = await createAdaptiveStorage(globalThis, { 
        basePath: '/custom/path' 
      });
      await storage.set('key', 'value');
      
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('/custom/path'),
        { recursive: true }
      );
    });
  });

  describe('Cloudflare KV storage', () => {
    it('should create KV storage when available', async () => {
      const mockKV = {
        get: vi.fn().mockResolvedValue('value'),
        put: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const gThis = {
        env: { KV: mockKV },
      };

      // Mock fs import to fail so KV is used
      vi.doMock('node:fs/promises', () => {
        throw new Error('Not available');
      });

      const storage = await createAdaptiveStorage(gThis as any);
      
      await storage.set('key', 'value');
      expect(mockKV.put).toHaveBeenCalledWith('default:key', 'value');
      
      const value = await storage.get('key');
      expect(value).toBe('value');
      expect(mockKV.get).toHaveBeenCalledWith('default:key');
    });

    it('should handle KV with namespace', async () => {
      const mockKV = {
        get: vi.fn().mockResolvedValue(null),
        put: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      };

      const gThis = {
        env: { KV: mockKV },
      };

      vi.doMock('node:fs/promises', () => {
        throw new Error('Not available');
      });

      const storage = await createAdaptiveStorage(gThis as any, { 
        namespace: 'test-ns' 
      });
      
      await storage.set('key', 'value');
      expect(mockKV.put).toHaveBeenCalledWith('test-ns:key', 'value');
    });
  });

  describe('error handling', () => {
    it('should throw when no storage is available', async () => {
      vi.doMock('node:fs/promises', () => {
        throw new Error('Not available');
      });

      const gThis = {}; // No KV available

      await expect(createAdaptiveStorage(gThis as any)).rejects.toThrow(
        'No storage mechanism available'
      );
    });
  });
});