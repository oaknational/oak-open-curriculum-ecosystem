import { access, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';

/**
 * Real-IO readers for repo-root-relative paths (ADR-078: integration tests
 * import this helper surface, never `node:fs` directly). Root discovery goes
 * through the canonical resolver — no second sentinel walk.
 */

function repoPath(repoRelativePath: string): string {
  return join(resolveRepoRoot(import.meta.url, { projectDir: undefined }), repoRelativePath);
}

export function readRepoDocument(repoRelativePath: string): Promise<string> {
  return readFile(repoPath(repoRelativePath), 'utf8');
}

/** The entry names directly under a repo-relative directory. */
export function listRepoDirectory(repoRelativePath: string): Promise<readonly string[]> {
  return readdir(repoPath(repoRelativePath));
}

/** Whether a repo-relative path exists, for guards that assert a file is absent. */
export function repoPathExists(repoRelativePath: string): Promise<boolean> {
  return access(repoPath(repoRelativePath)).then(
    () => true,
    () => false,
  );
}
