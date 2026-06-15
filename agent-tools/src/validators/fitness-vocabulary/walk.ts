/**
 * File discovery for the fitness-vocabulary check.
 *
 * Walks the current working tree for the files the check should scan, and
 * decides which paths are in scope. Foreign git working trees (vendor
 * worktrees such as `.claude/worktrees/*`, or nested clones) and transient /
 * machine-local roots are excluded, so the check only sees the canonical
 * estate of this checkout.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * The directory-entry shape the walk needs. Structurally satisfied by Node's
 * `Dirent`, and injectable as a fake in tests (mirrors the seam in
 * `practice-fitness/paths.ts`).
 */
interface WalkDirEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

export type ReaddirFn = (absDir: string) => Promise<readonly WalkDirEntry[]>;

// `withFileTypes` yields `Dirent`s. Symlinks report neither isFile() nor
// isDirectory(), so a symlinked file or directory is skipped — the estate
// holds real files, and symlinks only occur under already-excluded vendor dirs.
const nodeReaddir: ReaddirFn = (absDir) => fs.readdir(absDir, { withFileTypes: true });

// `.git` here stops descent into the git storage dir itself; the complementary
// {@link isForeignWorkingTreeRoot} check stops descent into a *worktree* whose
// root merely carries a `.git` marker.
const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];
const EXCLUDED_PATH_PREFIXES_EXTRA = ['.agent/experience/', '.remember/'];

/**
 * Transient or machine-local roots that are gitignored and not part of the
 * canonical estate: the repo-root scratch dir and the local-only reference
 * dump. Matched at a path boundary (exact dir or its subtree) so `tmp` never
 * greedily swallows `template.md` or `tmp-notes/`. Vendor worktrees are
 * excluded structurally instead — see {@link isForeignWorkingTreeRoot}.
 */
const EXCLUDED_PATH_ROOTS = ['tmp', '.agent/reference-local'];

/**
 * Files where the retired vocabulary is permitted by design (because they
 * explicitly discuss the evolution from the prior two-scale model to the
 * three-zone one).
 */
const ALLOWED_FILES = new Set([
  'docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md',
  'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts',
  'agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.unit.test.ts',
]);

function normalizeRelativePath(relPath: string): string {
  return relPath.split(path.sep).join('/');
}

function isUnderExcludedRoot(normalizedPath: string): boolean {
  return EXCLUDED_PATH_ROOTS.some(
    (root) => normalizedPath === root || normalizedPath.startsWith(`${root}/`),
  );
}

/**
 * A `.git` entry marks the root of a separate git working tree: a vendor
 * worktree (`.claude/worktrees/*`, `.cursor/worktrees/*`, …) where `.git` is a
 * file, or a nested clone where it is a directory. Such a tree belongs to a
 * different checkout and must not be walked.
 *
 * @param entries - the directory's entries
 * @returns true if the directory is the root of a foreign git working tree
 */
export function isForeignWorkingTreeRoot(entries: readonly { readonly name: string }[]): boolean {
  return entries.some((entry) => entry.name === '.git');
}

function shouldSkipDirectory(relPath: string): boolean {
  const normalized = normalizeRelativePath(relPath);
  const directoryName = normalized.split('/').pop() ?? '';

  return (
    EXCLUDED_DIRECTORY_NAMES.has(directoryName) ||
    EXCLUDED_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix)) ||
    isUnderExcludedRoot(normalized) ||
    EXCLUDED_PATH_SEGMENTS.some((segment) => normalized.includes(segment))
  );
}

function hasInspectableExtension(normalizedPath: string): boolean {
  return (
    normalizedPath.endsWith('.md') ||
    normalizedPath.endsWith('.ts') ||
    normalizedPath.endsWith('.mjs')
  );
}

function isExcludedPath(normalizedPath: string): boolean {
  return (
    EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix)) ||
    EXCLUDED_PATH_PREFIXES_EXTRA.some((prefix) => normalizedPath.startsWith(prefix)) ||
    EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment)) ||
    isUnderExcludedRoot(normalizedPath) ||
    ALLOWED_FILES.has(normalizedPath)
  );
}

/**
 * Decide whether a file should be scanned for forbidden vocabulary.
 *
 * @param relPath - repo-relative path
 * @returns true if the file should be scanned
 */
export function shouldInspectFile(relPath: string): boolean {
  const normalized = normalizeRelativePath(relPath);
  return hasInspectableExtension(normalized) && !isExcludedPath(normalized);
}

async function collectFromEntry(
  repoRoot: string,
  relDir: string,
  entry: WalkDirEntry,
  readdir: ReaddirFn,
): Promise<readonly string[]> {
  const relPath = relDir === '.' ? entry.name : path.join(relDir, entry.name);

  if (entry.isDirectory()) {
    return shouldSkipDirectory(relPath) ? [] : walkFiles(repoRoot, relPath, readdir);
  }

  return entry.isFile() && shouldInspectFile(relPath) ? [normalizeRelativePath(relPath)] : [];
}

/**
 * Recursively discover in-scope files under the current working tree.
 *
 * @param repoRoot - absolute path to the repository root
 * @param relDir - repo-relative directory to walk (defaults to the root)
 * @param readdir - directory reader (injectable; defaults to the real filesystem)
 * @returns repo-relative paths of files to scan
 */
export async function walkFiles(
  repoRoot: string,
  relDir = '.',
  readdir: ReaddirFn = nodeReaddir,
): Promise<readonly string[]> {
  const entries = await readdir(path.join(repoRoot, relDir));

  // Skip foreign working trees (vendor worktrees, nested clones); their
  // contents belong to a different checkout.
  if (relDir !== '.' && isForeignWorkingTreeRoot(entries)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of entries) {
    files.push(...(await collectFromEntry(repoRoot, relDir, entry, readdir)));
  }

  return files;
}
