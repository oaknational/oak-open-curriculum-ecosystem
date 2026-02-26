import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Walks up from `startDir` looking for `markerFile`. Returns the
 * first directory containing it, or `undefined` if the filesystem
 * root is reached.
 */
function walkUpTo(startDir: string, markerFile: string): string | undefined {
  let current = startDir;
  for (;;) {
    if (existsSync(join(current, markerFile))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === '/' || parent === current) {
      return undefined;
    }
    current = parent;
  }
}

/**
 * Finds the monorepo root by walking up from `startDir` until a
 * directory containing `pnpm-workspace.yaml` or `.git` is found.
 *
 * Returns `undefined` when no marker is found (e.g. serverless
 * environments like Vercel where the deployed bundle has no repo
 * structure). Callers that require a repo root should check the
 * return value and fail with context-appropriate guidance.
 *
 * @param startDir - Directory to start searching from
 * @returns Absolute path to the monorepo root, or `undefined` if
 *          the filesystem root is reached without finding a marker
 */
export function findRepoRoot(startDir: string): string | undefined {
  return walkUpTo(startDir, 'pnpm-workspace.yaml') ?? walkUpTo(startDir, '.git');
}

/**
 * Finds the nearest app root by walking up from `startDir` until a
 * directory containing `package.json` is found.
 *
 * Returns `undefined` when no `package.json` is found (e.g. serverless
 * environments). Used by `resolveEnv` to discover app-level `.env` files.
 *
 * @param startDir - Directory to start searching from
 * @returns Absolute path to the nearest app root, or `undefined`
 */
export function findAppRoot(startDir: string): string | undefined {
  return walkUpTo(startDir, 'package.json');
}
