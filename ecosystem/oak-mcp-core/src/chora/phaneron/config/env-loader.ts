/**
 * Environment loader with proper separation of concerns
 * Handles .env file discovery and loading for Node.js/Bun environments
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canAccessFilesystem, canAccessEnvVars } from '../runtime-detection/features.js';

/**
 * Attempts to find the repository root by looking for .git
 *
 * @param startPath - Starting directory to search from
 * @returns Repository root path or null if not found
 */
async function findRepoRoot(startPath: string): Promise<string | null> {
  if (!(await canAccessFilesystem())) {
    return null;
  }

  try {
    const fs = await import('node:fs');
    return await searchForGitRoot(fs, startPath);
  } catch {
    return null;
  }
}

/**
 * Helper to search for git root directory
 */
async function searchForGitRoot(
  fs: {
    promises: {
      stat: (path: string) => Promise<{ isDirectory: () => boolean; isFile: () => boolean }>;
    };
  },
  startPath: string,
): Promise<string | null> {
  let currentPath = startPath;
  const root = path.parse(currentPath).root;

  while (currentPath !== root) {
    const gitPath = path.join(currentPath, '.git');
    try {
      const stats = await fs.promises.stat(gitPath);
      if (stats.isDirectory() || stats.isFile()) {
        return currentPath;
      }
    } catch {
      // Continue searching
    }
    currentPath = path.dirname(currentPath);
  }
  return null;
}

/**
 * Loads environment variables from a specific .env file
 *
 * @param envPath - Path to the .env file
 * @returns true if successful
 */
async function loadEnvFile(envPath: string): Promise<boolean> {
  try {
    // Dynamic import for dotenv in ESM
    const dotenv = await import('dotenv');
    const result = dotenv.config({ path: envPath });

    if (result.error) {
      console.warn(`Failed to parse .env file at ${envPath}:`, result.error.message);
      return false;
    }

    console.info(`Loaded environment from: ${envPath}`);
    return true;
  } catch (error) {
    console.warn(`Failed to load .env file at ${envPath}:`, error);
    return false;
  }
}

/**
 * Get potential .env file paths to check
 */
async function getEnvFilePathsToCheck(): Promise<string[]> {
  const paths: string[] = [];

  // Current working directory
  paths.push(path.join(process.cwd(), '.env'));

  // Module location repo root
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const moduleRoot = await findRepoRoot(__dirname);
  if (moduleRoot) {
    paths.push(path.join(moduleRoot, '.env'));
  }

  // CWD repo root
  const cwdRoot = await findRepoRoot(process.cwd());
  if (cwdRoot && cwdRoot !== moduleRoot) {
    paths.push(path.join(cwdRoot, '.env'));
  }

  return paths;
}

/**
 * Attempts to find and load .env file
 *
 * @returns true if .env was loaded, false otherwise
 */
async function findAndLoadEnvFile(): Promise<boolean> {
  if (!(await canAccessFilesystem())) {
    return false;
  }

  try {
    const fs = await import('node:fs');
    const paths = await getEnvFilePathsToCheck();

    for (const envPath of paths) {
      if (fs.existsSync(envPath)) {
        return await loadEnvFile(envPath);
      }
    }

    console.warn('No .env file found. Searched in:', paths);
    return false;
  } catch (error) {
    console.warn('Error while searching for .env file:', error);
    return false;
  }
}

/**
 * Check if environment has required variables
 */
function checkRequiredVars(requiredVars: string[]): string[] {
  return requiredVars.filter((name) => !process.env[name]);
}

/**
 * Create error for missing env vars
 */
function createMissingVarsError(missingVars: string[], context: string): Error {
  return new Error(`Missing required environment variables: ${missingVars.join(', ')}\n${context}`);
}

/**
 * Ensures environment variables are loaded
 *
 * @param requiredVars - Array of required environment variable names
 */
export async function ensureEnvironmentLoaded(requiredVars: string[] = []): Promise<void> {
  // Check runtime capabilities
  if (!(await canAccessEnvVars())) {
    if (requiredVars.length > 0) {
      throw createMissingVarsError(
        requiredVars,
        'Cannot access environment variables in this runtime.',
      );
    }
    return;
  }

  // Check if vars already present
  const missingVars = checkRequiredVars(requiredVars);
  if (missingVars.length === 0) return;

  // Try loading from filesystem
  if (!(await canAccessFilesystem())) {
    throw createMissingVarsError(
      missingVars,
      'Running without filesystem access. Set environment variables before running.',
    );
  }

  const loaded = await findAndLoadEnvFile();
  const stillMissing = checkRequiredVars(requiredVars);

  if (stillMissing.length === 0) return;

  const context = loaded
    ? 'After loading .env file. Ensure these variables are defined in your .env file.'
    : 'No .env file found. Create a .env file or set environment variables.';

  throw createMissingVarsError(stillMissing, context);
}

/**
 * Loads environment if needed, but doesn't fail if optional
 * Useful for development environments
 */
export async function loadEnvironmentIfAvailable(): Promise<void> {
  try {
    if ((await canAccessEnvVars()) && (await canAccessFilesystem())) {
      await findAndLoadEnvFile();
    }
  } catch {
    // Silently ignore errors when loading optional environment
  }
}

/**
 * Simple loader that just tries to load .env if it's available
 * Used by environment.ts to ensure .env is loaded before reading vars
 */
export async function loadDotenvIfNeeded(): Promise<void> {
  await loadEnvironmentIfAvailable();
}
