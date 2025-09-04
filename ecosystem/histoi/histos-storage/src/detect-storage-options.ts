/**
 * @oaknational/mcp-histos-storage
 *
 * Adaptive storage tissue for multi-runtime MCP applications
 * Uses feature detection to provide the best available storage mechanism
 */

export const STORAGE_OPTIONS = {
  NODE_FS: {
    name: 'NODE_FS',
    importName: 'node:fs',
    globalThisProperty: false,
  },
  CLOUDFLARE_KV: {
    name: 'CLOUDFLARE_KV',
    importName: false,
    globalThisProperty: 'env.KV',
  },
} as const;

type StorageOptions = typeof STORAGE_OPTIONS;
export type StorageOptionKey = keyof StorageOptions;

// Partial of GlobalThis in Node or Cloudflare Workers
export interface GThis {
  // Cloudflare Workers
  env?: {
    KV: {
      get: (key: string) => Promise<string | null>;
      put: (key: string, value: string) => Promise<void>;
      delete: (key: string) => Promise<void>;
    };
  };
  // Node.js
  process?: { env: Record<string, string | undefined> };
}

/**
 * Detects available storage options.
 *
 * Order of precedence:
 * 1. Node.js fs module
 * 2. Cloudflare KV
 *
 * @returns The first available storage option, or null if none are available
 */
export async function detectStorageOptions(gThis: GThis): Promise<StorageOptionKey | null> {
  let isNodeFsAvailable = false;
  try {
    await import(STORAGE_OPTIONS.NODE_FS.importName);
    isNodeFsAvailable = true;
  } catch {
    isNodeFsAvailable = false;
  }

  if (isNodeFsAvailable) {
    return STORAGE_OPTIONS.NODE_FS.name;
  }

  let isCloudflareKVAvailable = false;
  try {
    if (gThis.env?.KV) {
      isCloudflareKVAvailable = true;
    }
  } catch {
    isCloudflareKVAvailable = false;
  }

  if (isCloudflareKVAvailable) {
    return STORAGE_OPTIONS.CLOUDFLARE_KV.name;
  }

  return null;
}
