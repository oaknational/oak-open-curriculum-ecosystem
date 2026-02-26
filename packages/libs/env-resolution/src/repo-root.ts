import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

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
  let current = startDir;
  for (;;) {
    const workspace = join(current, 'pnpm-workspace.yaml');
    const gitDir = join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) {
      return current;
    }
    const parent = dirname(current);
    if (parent === '/' || parent === current) {
      return undefined;
    }
    current = parent;
  }
}
