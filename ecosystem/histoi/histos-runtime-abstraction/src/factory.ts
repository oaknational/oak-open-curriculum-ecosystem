/**
 * Factory for creating runtime adapters with injected dependencies
 *
 * This follows the biological architecture pattern where histoi tissues
 * receive their runtime context from the consuming organism (psycha level)
 */

import type { RuntimeAdapter } from './interfaces';
import {
  createNodeFileSystemOperations,
  createNodeEnvironmentOperations,
  createNodeCryptoOperations,
  createNodeStreamOperations,
  createNodeRuntimeInfo,
} from './node-adapter-factories';
import {
  createCloudflareFileSystemOperations,
  createCloudflareEnvironmentOperations,
  createCloudflareCryptoOperations,
  createCloudflareStreamOperations,
  createCloudflareRuntimeInfo,
} from './cloudflare-adapter-factories';

/**
 * Runtime context that must be injected from the consuming organism
 * This avoids direct access to runtime globals in the histoi tissue
 */
export interface RuntimeContext {
  /**
   * Environment variables from the runtime
   */
  processEnv: Record<string, string | undefined>;

  /**
   * Runtime version string
   */
  processVersion: string;

  /**
   * Detected runtime name
   */
  runtimeName: 'node' | 'cloudflare' | 'unknown';

  /**
   * File system operations (optional - not available in all runtimes)
   */
  fs?: {
    readFile: (path: string) => Promise<Buffer>;
    writeFile: (path: string, data: Buffer) => Promise<void>;
    access: (path: string) => Promise<void>;
    mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
    readdir: (path: string) => Promise<string[]>;
    stat: (path: string) => Promise<{
      isFile(): boolean;
      isDirectory(): boolean;
      size: number;
      mtime: Date;
    }>;
    open: (
      path: string,
      flags: string,
    ) => Promise<{
      write: (data: Buffer | string) => Promise<void>;
      close: () => Promise<void>;
    }>;
  };

  /**
   * Crypto operations
   */
  crypto?: {
    randomUUID: () => string;
    randomBytes: (size: number) => Buffer;
    createHash: (algorithm: string) => {
      update: (data: Buffer) => void;
      digest: () => Buffer;
    };
  };
}

/**
 * Create a runtime adapter with injected context
 *
 * @param context - Runtime context injected from the consuming organism
 * @returns Runtime adapter configured for the detected runtime
 */
export function createRuntimeAdapter(context: RuntimeContext): RuntimeAdapter {
  switch (context.runtimeName) {
    case 'node':
      return createNodeAdapter(context);
    case 'cloudflare':
      return createCloudflareAdapter(context);
    default:
      throw new Error(`Unsupported runtime: ${context.runtimeName}`);
  }
}

/**
 * Create Node.js runtime adapter with injected dependencies
 */
function createNodeAdapter(context: RuntimeContext): RuntimeAdapter {
  if (!context.fs) {
    throw new Error('File system operations required for Node.js adapter');
  }

  if (!context.crypto) {
    throw new Error('Crypto operations required for Node.js adapter');
  }

  return {
    fs: createNodeFileSystemOperations(context.fs),
    env: createNodeEnvironmentOperations(context.processEnv),
    crypto: createNodeCryptoOperations(context.crypto),
    streams: createNodeStreamOperations(context.fs),
    runtime: createNodeRuntimeInfo(context.processVersion),
  };
}

/**
 * Create Cloudflare Workers runtime adapter with injected dependencies
 */
function createCloudflareAdapter(context: RuntimeContext): RuntimeAdapter {
  return {
    fs: createCloudflareFileSystemOperations(),
    env: createCloudflareEnvironmentOperations(context.processEnv),
    crypto: createCloudflareCryptoOperations(context.crypto),
    streams: createCloudflareStreamOperations(),
    runtime: createCloudflareRuntimeInfo(),
  };
}
