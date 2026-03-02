/**
 * Shared utility for resolving the monorepo root in the STDIO app.
 *
 * The STDIO server always runs locally inside the monorepo, so a missing
 * repo root is an unrecoverable misconfiguration. This function wraps
 * `findRepoRoot` with a fail-fast guard and a clear error message.
 */

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRepoRoot } from '@oaknational/env-resolution';

/**
 * Resolves the monorepo root from the current module's location.
 *
 * @throws Error if no `pnpm-workspace.yaml` or `.git` marker is found.
 *         The STDIO server always runs locally, so this is unrecoverable.
 */
export function requireRepoRoot(): string {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const root = findRepoRoot(thisDir);
  if (root === undefined) {
    throw new Error(
      `Could not find monorepo root from ${thisDir}. ` +
        `The STDIO server must run inside the monorepo.`,
    );
  }
  return root;
}
