/**
 * Real-IO readers for repo-root-relative paths (ADR-078: integration tests
 * import this helper surface, never `node:fs` directly). Root discovery goes
 * through the canonical resolver — no second sentinel walk.
 *
 * @packageDocumentation
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';

function repoPath(repoRelativePath: string): string {
  return join(resolveRepoRoot(import.meta.url, { projectDir: undefined }), repoRelativePath);
}

/** The text of a repo-relative document. */
export function readRepoDocument(repoRelativePath: string): Promise<string> {
  return readFile(repoPath(repoRelativePath), 'utf8');
}
