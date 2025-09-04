/**
 * Unit tests for factory pattern
 * Tests the factory with injected dependencies
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRuntimeAdapter } from '../src/factory';
import type { RuntimeAdapter, RuntimeContext } from '../src';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID, randomBytes, createHash } from 'node:crypto';

describe('Runtime Factory', () => {
  let testDir: string;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = join(tmpdir(), `test-${Date.now()}`);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('Node.js Adapter Factory', () => {
    let adapter: RuntimeAdapter;
    let context: RuntimeContext;

    beforeEach(() => {
      // Create a Node.js context with injected dependencies
      // Note: In a real scenario, these values would be injected from the psycha level
      context = {
        processEnv: { TEST_VAR: 'test_value', NODE_ENV: 'test' },
        processVersion: 'v20.0.0',
        runtimeName: 'node',
        fs: {
          readFile: (path: string) => fs.readFile(path),
          writeFile: (path: string, data: Buffer) => fs.writeFile(path, data),
          access: (path: string) => fs.access(path),
          mkdir: async (path: string, options?: { recursive?: boolean }) => {
            await fs.mkdir(path, options);
          },
          readdir: (path: string) => fs.readdir(path),
          stat: async (path: string) => {
            const stats = await fs.stat(path);
            return {
              isFile: () => stats.isFile(),
              isDirectory: () => stats.isDirectory(),
              size: stats.size,
              mtime: stats.mtime,
            };
          },
          open: async (path: string, flags: string) => {
            const handle = await fs.open(path, flags);
            return {
              write: async (data: Buffer | string) => {
                if (typeof data === 'string') {
                  await handle.write(data);
                } else {
                  await handle.write(data);
                }
              },
              close: async () => {
                await handle.close();
              },
            };
          },
        },
        crypto: {
          randomUUID: () => randomUUID(),
          randomBytes: (size: number) => randomBytes(size),
          createHash: (algorithm: string) => {
            const hash = createHash(algorithm);
            return {
              update: (data: Buffer) => hash.update(data),
              digest: () => hash.digest(),
            };
          },
        },
      };

      adapter = createRuntimeAdapter(context);
    });

    describe('Runtime Info', () => {
      it('should identify as Node.js runtime', () => {
        expect(adapter.runtime.name).toBe('node');
      });

      it('should provide Node.js version', () => {
        expect(adapter.runtime.version).toBe('v20.0.0');
      });

      it('should list Node.js capabilities', () => {
        expect(adapter.runtime.capabilities).toContain('fs');
        expect(adapter.runtime.capabilities).toContain('env');
        expect(adapter.runtime.capabilities).toContain('crypto');
        expect(adapter.runtime.capabilities).toContain('streams');
      });
    });

    describe('File System Operations', () => {
      it('should write and read files', async () => {
        const filePath = join(testDir, 'test.txt');
        const content = Buffer.from('Hello, World!');

        await adapter.fs.writeFile(filePath, content);
        const result = await adapter.fs.readFile(filePath);

        expect(result.toString()).toBe('Hello, World!');
      });

      it('should check file existence', async () => {
        const filePath = join(testDir, 'exists.txt');

        expect(await adapter.fs.exists(filePath)).toBe(false);

        await fs.writeFile(filePath, 'test');

        expect(await adapter.fs.exists(filePath)).toBe(true);
      });

      it('should create directories', async () => {
        const dirPath = join(testDir, 'nested', 'dir');

        await adapter.fs.mkdir(dirPath, { recursive: true });

        const stats = await fs.stat(dirPath);
        expect(stats.isDirectory()).toBe(true);
      });

      it('should read directory contents', async () => {
        await fs.writeFile(join(testDir, 'file1.txt'), 'content1');
        await fs.writeFile(join(testDir, 'file2.txt'), 'content2');

        const files = await adapter.fs.readdir(testDir);

        expect(files).toContain('file1.txt');
        expect(files).toContain('file2.txt');
      });

      it('should get file statistics', async () => {
        const filePath = join(testDir, 'stat.txt');
        await fs.writeFile(filePath, 'test content');

        const stats = await adapter.fs.stat(filePath);

        expect(stats.isFile()).toBe(true);
        expect(stats.isDirectory()).toBe(false);
        expect(stats.size).toBeGreaterThan(0);
        expect(stats.mtime).toBeInstanceOf(Date);
      });
    });

    describe('Environment Operations', () => {
      it('should get environment variables from injected context', () => {
        expect(adapter.env.get('TEST_VAR')).toBe('test_value');
        expect(adapter.env.get('NON_EXISTENT')).toBeUndefined();
      });

      it('should check environment variable existence', () => {
        expect(adapter.env.has('TEST_VAR')).toBe(true);
        expect(adapter.env.has('NON_EXISTENT')).toBe(false);
      });

      it('should get all environment variables', () => {
        const allEnv = adapter.env.getAll();

        expect(allEnv).toHaveProperty('TEST_VAR', 'test_value');
        expect(typeof allEnv).toBe('object');
      });
    });

    describe('Crypto Operations', () => {
      it('should generate random UUIDs', () => {
        const uuid1 = adapter.crypto.randomUUID();
        const uuid2 = adapter.crypto.randomUUID();

        expect(uuid1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        expect(uuid2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        expect(uuid1).not.toBe(uuid2);
      });

      it('should generate random bytes', () => {
        const bytes = adapter.crypto.randomBytes(16);

        expect(bytes).toBeInstanceOf(Uint8Array);
        expect(bytes.length).toBe(16);
      });

      it('should hash data', async () => {
        const data = Buffer.from('test data');
        const hash = await adapter.crypto.hash('SHA-256', data);

        expect(hash).toBeInstanceOf(Buffer);
        expect(hash.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cloudflare Adapter Factory', () => {
    it('should create Cloudflare adapter from context', () => {
      const context: RuntimeContext = {
        processEnv: { CF_ENV: 'production' },
        processVersion: '1.0.0',
        runtimeName: 'cloudflare',
      };

      const adapter = createRuntimeAdapter(context);

      expect(adapter.runtime.name).toBe('cloudflare');
      expect(adapter.runtime.capabilities).toContain('env');
      expect(adapter.runtime.capabilities).toContain('crypto');
      expect(adapter.runtime.capabilities).toContain('streams');
      expect(adapter.runtime.capabilities).not.toContain('fs');
    });

    it('should throw error for file system operations in Cloudflare', async () => {
      const context: RuntimeContext = {
        processEnv: {},
        processVersion: '1.0.0',
        runtimeName: 'cloudflare',
      };

      const adapter = createRuntimeAdapter(context);

      await expect(adapter.fs.readFile('test')).rejects.toThrow('File system not available');
      await expect(adapter.fs.writeFile('test', Buffer.from('data'))).rejects.toThrow(
        'File system not available',
      );
    });
  });
});
