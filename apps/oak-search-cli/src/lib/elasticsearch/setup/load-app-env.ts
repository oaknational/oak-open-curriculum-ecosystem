/**
 * Load environment variables from the app's .env.local file.
 *
 * This module extends the loadRootEnv pattern from `@oaknational/mcp-env`
 * to find the app root (package.json) rather than the monorepo root.
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';

/**
 * Find the app root by walking up until we find package.json.
 * This stops at the app directory, not the monorepo root.
 */
function findAppRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    const packageJson = join(current, 'package.json');
    if (existsSync(packageJson)) {
      return current;
    }
    const parent = dirname(current);
    if (parent === '/' || parent === current) {
      throw new Error(`Could not find app root from ${startDir}`);
    }
    current = parent;
  }
}

export interface LoadAppEnvResult {
  readonly appRoot: string;
  readonly loaded: boolean;
  readonly path?: string;
}

/**
 * Load environment variables from the app's .env.local or .env file.
 *
 * @param startDir - Directory to start searching from (typically __dirname or import.meta.url)
 * @param envFileOrder - Priority order for env files, defaults to ['.env.local', '.env']
 */
export function loadAppEnv(
  startDir: string,
  envFileOrder: readonly string[] = ['.env.local', '.env'],
): LoadAppEnvResult {
  const appRoot = findAppRoot(startDir);

  for (const file of envFileOrder) {
    const path = join(appRoot, file);
    if (existsSync(path)) {
      // override: true ensures .env.local takes precedence over existing env vars
      dotenvConfig({ path, override: true });
      return { appRoot, loaded: true, path };
    }
  }

  return { appRoot, loaded: false };
}
