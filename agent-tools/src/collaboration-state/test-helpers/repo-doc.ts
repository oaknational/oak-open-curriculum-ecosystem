/**
 * Real-IO readers for repo-root-relative paths (ADR-078: integration tests
 * import this helper surface, never `node:fs` directly). Root discovery goes
 * through the canonical resolver — no second sentinel walk.
 *
 * @packageDocumentation
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';

/** One entry of a repo directory, classified without following symlinks. */
export interface RepoDirectoryEntry {
  readonly name: string;
  readonly kind: 'directory' | 'file' | 'other';
}

function repoPath(repoRelativePath: string): string {
  return join(resolveRepoRoot(import.meta.url, { projectDir: undefined }), repoRelativePath);
}

/** The text of a repo-relative document. */
export function readRepoDocument(repoRelativePath: string): Promise<string> {
  return readFile(repoPath(repoRelativePath), 'utf8');
}

/** The entries directly under a repo-relative directory, in name order. */
export async function listRepoDirectory(
  repoRelativePath: string,
): Promise<readonly RepoDirectoryEntry[]> {
  const entries = await readdir(repoPath(repoRelativePath), { withFileTypes: true });
  return entries
    .map((entry): RepoDirectoryEntry => ({
      name: entry.name,
      kind: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : 'other',
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}
