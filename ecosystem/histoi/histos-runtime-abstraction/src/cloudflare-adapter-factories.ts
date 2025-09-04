/**
 * Factory functions for Cloudflare adapter components
 * These are extracted to keep individual functions under the ESLint line limit
 */

import type {
  FileSystemOperations,
  EnvironmentOperations,
  CryptoOperations,
  StreamOperations,
  RuntimeInfo,
} from './interfaces';
import type { RuntimeContext } from './factory';

/**
 * Create file system operations for Cloudflare (throws errors as not supported)
 */
export function createCloudflareFileSystemOperations(): FileSystemOperations {
  const notAvailable = () => {
    throw new Error('File system not available in Cloudflare Workers');
  };

  return {
    readFile: notAvailable,
    writeFile: notAvailable,
    exists: () => Promise.resolve(false),
    mkdir: notAvailable,
    readdir: notAvailable,
    stat: notAvailable,
  };
}

/**
 * Create environment operations for Cloudflare
 */
export function createCloudflareEnvironmentOperations(
  processEnv: RuntimeContext['processEnv'],
): EnvironmentOperations {
  return {
    get: (key: string) => processEnv[key],
    getAll: () => {
      const result: Record<string, string> = {};
      for (const [key, value] of Object.entries(processEnv)) {
        if (value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    },
    has: (key: string) => key in processEnv,
  };
}

/**
 * Create crypto operations for Cloudflare
 */
export function createCloudflareCryptoOperations(
  crypto?: RuntimeContext['crypto'],
): CryptoOperations {
  return {
    randomUUID: () => crypto?.randomUUID() ?? '',

    randomBytes: (size: number) => {
      const buffer = new Uint8Array(size);
      // Note: In a real Cloudflare Worker, globalThis.crypto would be available
      // This is just for type safety in the histoi tissue
      return buffer;
    },

    hash: (_algorithm: string, data: Buffer) => {
      // Note: In a real Cloudflare Worker, crypto.subtle would be available
      // This is just for type safety in the histoi tissue
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data.toString());
      // Simulate hash for now - real implementation would use crypto.subtle
      return Promise.resolve(Buffer.from(dataBuffer));
    },
  };
}

/**
 * Create stream operations for Cloudflare
 */
export function createCloudflareStreamOperations(): StreamOperations {
  return {
    createReadStream: () => new ReadableStream(),
    createWriteStream: () => new WritableStream(),
    pipe: (source: ReadableStream, destination: WritableStream) => source.pipeTo(destination),
  };
}

/**
 * Create runtime info for Cloudflare
 */
export function createCloudflareRuntimeInfo(): RuntimeInfo {
  return {
    name: 'cloudflare',
    version: '1.0.0',
    capabilities: ['env', 'crypto', 'streams'],
  };
}
