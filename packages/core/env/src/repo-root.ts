import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Finds the monorepo root by walking up from `startDir` until a
 * directory containing `pnpm-workspace.yaml` or `.git` is found.
 *
 * @param startDir - Directory to start searching from
 * @returns Absolute path to the monorepo root
 * @throws Error if the filesystem root is reached without finding a marker
 */
export function findRepoRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    const workspace = join(current, 'pnpm-workspace.yaml');
    const gitDir = join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) {
      return current;
    }
    const parent = dirname(current);
    if (parent === '/') {
      throw new Error('Could not find repo root. Iterated to `/`');
    }
    if (parent === current) {
      return current;
    }
    current = parent;
  }
}
