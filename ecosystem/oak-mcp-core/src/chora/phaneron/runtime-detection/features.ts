/**
 * Runtime feature detection
 * Detects capabilities of the current JavaScript runtime
 */

/**
 * Runtime capabilities that can be detected
 */
export interface RuntimeFeatures {
  hasNativeEnvs: boolean;
  hasNodeFilesystem: boolean;
}

/**
 * Detects the current runtime environment and its capabilities
 */
export async function detectRuntimeFeatures(): Promise<RuntimeFeatures> {
  let hasNativeEnvs = false;
  try {
    hasNativeEnvs = !!globalThis.process.env;
  } catch {
    hasNativeEnvs = false;
  }

  let hasNodeFilesystem = false;
  try {
    await import('node:fs');
    hasNodeFilesystem = true;
  } catch {
    hasNodeFilesystem = false;
  }

  return { hasNativeEnvs, hasNodeFilesystem };
}

/**
 * Cached runtime features to avoid repeated detection
 */
let cachedFeatures: RuntimeFeatures | undefined;

/**
 * Gets runtime features (cached after first call)
 */
export async function getRuntimeFeatures(): Promise<RuntimeFeatures> {
  cachedFeatures = await detectRuntimeFeatures();
  return cachedFeatures;
}

/**
 * Checks if we can access the filesystem
 */
export async function canAccessFilesystem(): Promise<boolean> {
  return (await getRuntimeFeatures()).hasNodeFilesystem;
}

/**
 * Checks if we can access environment variables
 */
export async function canAccessEnvVars(): Promise<boolean> {
  return (await getRuntimeFeatures()).hasNativeEnvs;
}
