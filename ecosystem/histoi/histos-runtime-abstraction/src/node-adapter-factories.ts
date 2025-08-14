/**
 * Factory functions for Node.js adapter components
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
 * Create file system operations for Node.js
 */
export function createNodeFileSystemOperations(
  fs: NonNullable<RuntimeContext['fs']>,
): FileSystemOperations {
  return {
    readFile: (path: string) => fs.readFile(path),

    writeFile: (path: string, data: Buffer) => fs.writeFile(path, data),

    exists: async (path: string) => {
      try {
        await fs.access(path);
        return true;
      } catch {
        return false;
      }
    },

    mkdir: (path: string, options?: { recursive?: boolean }) => fs.mkdir(path, options),

    readdir: (path: string) => fs.readdir(path),

    stat: (path: string) => fs.stat(path),
  };
}

/**
 * Create environment operations for Node.js
 */
export function createNodeEnvironmentOperations(
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
 * Create crypto operations for Node.js
 */
export function createNodeCryptoOperations(
  crypto: NonNullable<RuntimeContext['crypto']>,
): CryptoOperations {
  return {
    randomUUID: () => crypto.randomUUID(),

    randomBytes: (size: number) => {
      const buffer = crypto.randomBytes(size);
      return new Uint8Array(buffer);
    },

    hash: (algorithm: string, data: Buffer) => {
      const nodeAlgorithm = algorithm.toLowerCase().replace('-', '');
      const hash = crypto.createHash(nodeAlgorithm);
      hash.update(data);
      return Promise.resolve(hash.digest());
    },
  };
}

/**
 * Create stream operations for Node.js
 */
export function createNodeStreamOperations(
  fs: NonNullable<RuntimeContext['fs']>,
): StreamOperations {
  return {
    createReadStream: (path: string) => {
      return new ReadableStream({
        async start(controller) {
          try {
            const data = await fs.readFile(path);
            controller.enqueue(data);
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });
    },

    createWriteStream: (path: string) => {
      let fileHandle: {
        write: (data: Buffer | string) => Promise<void>;
        close: () => Promise<void>;
      } | null = null;

      return new WritableStream({
        async start() {
          fileHandle = await fs.open(path, 'w');
        },
        async write(chunk) {
          if (fileHandle) {
            await fileHandle.write(chunk);
          }
        },
        async close() {
          if (fileHandle) {
            await fileHandle.close();
          }
        },
        async abort() {
          if (fileHandle) {
            await fileHandle.close();
          }
        },
      });
    },

    pipe: async (source: ReadableStream, destination: WritableStream) => {
      const reader = source.getReader();
      const writer = destination.getWriter();

      try {
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (!done && result.value) {
            await writer.write(result.value);
          }
        }
      } finally {
        reader.releaseLock();
        writer.releaseLock();
      }
    },
  };
}

/**
 * Create runtime info for Node.js
 */
export function createNodeRuntimeInfo(processVersion: string): RuntimeInfo {
  return {
    name: 'node',
    version: processVersion,
    capabilities: ['fs', 'env', 'crypto', 'streams'],
  };
}
