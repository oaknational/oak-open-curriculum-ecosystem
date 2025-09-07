/**
 * Unit tests for runtime detection utilities
 */

import { describe, it, expect } from 'vitest';
import { createAdapter, hasCapability, getRuntimeName, getRuntimeVersion } from '../src/detector';
import type { RuntimeContext } from '../src/factory';

describe('Runtime Detection Utilities', () => {
  describe('createAdapter', () => {
    it('should create a Node.js adapter from context', () => {
      const context: RuntimeContext = {
        processEnv: { TEST: 'value' },
        processVersion: 'v20.0.0',
        runtimeName: 'node',
        fs: {
          readFile: async () => Buffer.from('test'),
          writeFile: async () => Promise.resolve(),
          access: async () => Promise.resolve(),
          mkdir: async () => Promise.resolve(),
          readdir: async () => [],
          stat: async () => ({
            isFile: () => true,
            isDirectory: () => false,
            size: 0,
            mtime: new Date(),
          }),
          open: async () => ({
            write: async () => Promise.resolve(),
            close: async () => Promise.resolve(),
          }),
        },
        crypto: {
          randomUUID: () => 'uuid',
          randomBytes: (size: number) => Buffer.alloc(size),
          createHash: () => ({
            update: () => {
              /* noop */
            },
            digest: () => Buffer.from('hash'),
          }),
        },
      };

      const adapter = createAdapter(context);

      expect(adapter).toBeDefined();
      expect(adapter.runtime.name).toBe('node');
      expect(adapter.runtime.version).toBe('v20.0.0');
    });

    it('should create a Cloudflare adapter from context', () => {
      const context: RuntimeContext = {
        processEnv: { CF_ENV: 'production' },
        processVersion: '1.0.0',
        runtimeName: 'cloudflare',
      };

      const adapter = createAdapter(context);

      expect(adapter).toBeDefined();
      expect(adapter.runtime.name).toBe('cloudflare');
    });
  });

  describe('hasCapability', () => {
    it('should check if adapter has a capability', () => {
      const context: RuntimeContext = {
        processEnv: {},
        processVersion: 'v20.0.0',
        runtimeName: 'node',
        fs: {
          readFile: async () => Buffer.from('test'),
          writeFile: async () => Promise.resolve(),
          access: async () => Promise.resolve(),
          mkdir: async () => Promise.resolve(),
          readdir: async () => [],
          stat: async () => ({
            isFile: () => true,
            isDirectory: () => false,
            size: 0,
            mtime: new Date(),
          }),
          open: async () => ({
            write: async () => Promise.resolve(),
            close: async () => Promise.resolve(),
          }),
        },
        crypto: {
          randomUUID: () => 'uuid',
          randomBytes: (size: number) => Buffer.alloc(size),
          createHash: () => ({
            update: () => {
              /* noop */
            },
            digest: () => Buffer.from('hash'),
          }),
        },
      };

      const adapter = createAdapter(context);

      expect(hasCapability(adapter, 'fs')).toBe(true);
      expect(hasCapability(adapter, 'env')).toBe(true);
      expect(hasCapability(adapter, 'nonexistent')).toBe(false);
    });
  });

  describe('getRuntimeName', () => {
    it('should get runtime name from adapter', () => {
      const context: RuntimeContext = {
        processEnv: {},
        processVersion: 'v20.0.0',
        runtimeName: 'node',
        fs: {
          readFile: async () => Buffer.from('test'),
          writeFile: async () => Promise.resolve(),
          access: async () => Promise.resolve(),
          mkdir: async () => Promise.resolve(),
          readdir: async () => [],
          stat: async () => ({
            isFile: () => true,
            isDirectory: () => false,
            size: 0,
            mtime: new Date(),
          }),
          open: async () => ({
            write: async () => Promise.resolve(),
            close: async () => Promise.resolve(),
          }),
        },
        crypto: {
          randomUUID: () => 'uuid',
          randomBytes: (size: number) => Buffer.alloc(size),
          createHash: () => ({
            update: () => {
              /* noop */
            },
            digest: () => Buffer.from('hash'),
          }),
        },
      };

      const adapter = createAdapter(context);

      expect(getRuntimeName(adapter)).toBe('node');
    });
  });

  describe('getRuntimeVersion', () => {
    it('should get runtime version from adapter', () => {
      const context: RuntimeContext = {
        processEnv: {},
        processVersion: 'v20.0.0',
        runtimeName: 'node',
        fs: {
          readFile: async () => Buffer.from('test'),
          writeFile: async () => Promise.resolve(),
          access: async () => Promise.resolve(),
          mkdir: async () => Promise.resolve(),
          readdir: async () => [],
          stat: async () => ({
            isFile: () => true,
            isDirectory: () => false,
            size: 0,
            mtime: new Date(),
          }),
          open: async () => ({
            write: async () => Promise.resolve(),
            close: async () => Promise.resolve(),
          }),
        },
        crypto: {
          randomUUID: () => 'uuid',
          randomBytes: (size: number) => Buffer.alloc(size),
          createHash: () => ({
            update: () => {
              /* noop */
            },
            digest: () => Buffer.from('hash'),
          }),
        },
      };

      const adapter = createAdapter(context);

      expect(getRuntimeVersion(adapter)).toBe('v20.0.0');
    });
  });
});
