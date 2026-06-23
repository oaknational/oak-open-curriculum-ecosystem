import fs from 'node:fs/promises';
import path from 'node:path';

import { extractFrontmatter, getFrontmatterNumber, getFrontmatterString } from './markdown.js';

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

/**
 * Transient or machine-local roots that are not part of the canonical Practice
 * estate and are gitignored: the repo-root scratch dir and the local-only
 * reference dump. Matched at a path boundary (exact dir or its subtree) so the
 * `tmp` root never greedily swallows `template.md` or `tmp-notes/`.
 *
 * Vendor worktrees (`.claude/worktrees/*`, `.cursor/worktrees/*`, …) are
 * excluded structurally instead — see {@link isForeignWorkingTreeRoot} — so
 * every vendor's worktrees are skipped without enumerating vendor names, while
 * other vendor content (e.g. generated skill adapters) is still inspected.
 */
const EXCLUDED_PATH_ROOTS = ['tmp', '.agent/reference-local'];

/**
 * A `.git` entry marks the root of a separate git working tree: a worktree
 * (where `.git` is a file) or a nested clone (where it is a directory). Such a
 * tree is never part of the current tree's estate and must not be walked.
 *
 * @param entries - the directory's entries
 * @returns true if the directory is the root of a foreign git working tree
 */
function isForeignWorkingTreeRoot(entries: readonly Pick<FitnessPathDirEntry, 'name'>[]): boolean {
  return entries.some((entry) => entry.name === '.git');
}

function isUnderExcludedRoot(normalizedPath: string): boolean {
  return EXCLUDED_PATH_ROOTS.some(
    (root) => normalizedPath === root || normalizedPath.startsWith(`${root}/`),
  );
}

export interface FitnessPathDirEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

export interface FitnessPathFileSystem {
  readdir(absDir: string): Promise<readonly FitnessPathDirEntry[]>;
  readFileUtf8(absPath: string): Promise<string>;
}

const nodeFitnessPathFileSystem: FitnessPathFileSystem = {
  readdir: (absDir) => fs.readdir(absDir, { withFileTypes: true }),
  readFileUtf8: (absPath) => fs.readFile(absPath, 'utf8'),
};

function normalizeRelativePath(relPath: string): string {
  return relPath.split(path.sep).join('/');
}

/**
 * Decide whether a directory should be skipped during repo-wide discovery.
 */
function shouldSkipDirectory(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);
  const pathParts = normalizedPath.split('/');
  const directoryName = pathParts.at(-1) ?? '';

  if (EXCLUDED_DIRECTORY_NAMES.has(directoryName)) {
    return true;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return true;
  }

  if (isUnderExcludedRoot(normalizedPath)) {
    return true;
  }

  return EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/**
 * Decide whether a markdown path should be inspected for fitness frontmatter.
 */
export function shouldInspectFitnessPath(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);

  if (!normalizedPath.endsWith('.md')) {
    return false;
  }

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))) {
    return false;
  }

  if (isUnderExcludedRoot(normalizedPath)) {
    return false;
  }

  return !EXCLUDED_PATH_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/**
 * Recursively discover candidate markdown files in the repo.
 */
async function discoverMarkdownEntryFiles(
  repoRoot: string,
  relDir: string,
  entry: FitnessPathDirEntry,
  fileSystem: FitnessPathFileSystem,
): Promise<string[]> {
  const relPath = relDir === '.' ? entry.name : path.join(relDir, entry.name);
  if (entry.isDirectory()) {
    return shouldSkipDirectory(relPath) ? [] : discoverMarkdownFiles(repoRoot, relPath, fileSystem);
  }
  return entry.isFile() && shouldInspectFitnessPath(relPath)
    ? [normalizeRelativePath(relPath)]
    : [];
}

async function discoverMarkdownFiles(
  repoRoot: string,
  relDir = '.',
  fileSystem = nodeFitnessPathFileSystem,
): Promise<string[]> {
  const absDir = path.join(repoRoot, relDir);
  const dirEntries = await fileSystem.readdir(absDir);

  // A non-root directory carrying a `.git` marker is a foreign working tree
  // (a vendor worktree such as `.claude/worktrees/*`, or a nested clone). Its
  // contents belong to a different checkout and must not enter the estate.
  if (relDir !== '.' && isForeignWorkingTreeRoot(dirEntries)) {
    return [];
  }

  const sortedEntries = dirEntries.toSorted((left, right) => left.name.localeCompare(right.name));
  const markdownFiles: string[] = [];

  for (const entry of sortedEntries) {
    markdownFiles.push(...(await discoverMarkdownEntryFiles(repoRoot, relDir, entry, fileSystem)));
  }

  return markdownFiles;
}

/**
 * Discover all live repo files that declare fitness frontmatter.
 */
export async function discoverFitnessFiles(
  repoRoot: string,
  fileSystem = nodeFitnessPathFileSystem,
): Promise<string[]> {
  const markdownFiles = await discoverMarkdownFiles(repoRoot, '.', fileSystem);
  const fitnessFiles: string[] = [];

  for (const relPath of markdownFiles) {
    const content = await fileSystem.readFileUtf8(path.join(repoRoot, relPath));
    const frontmatter = extractFrontmatter(content);

    if (
      getFrontmatterNumber(frontmatter, 'fitness_line_target') !== null ||
      getFrontmatterString(frontmatter, 'fitness_content_role') !== null ||
      getFrontmatterString(frontmatter, 'surface_kind') !== null ||
      getFrontmatterString(frontmatter, 'merge_class') !== null
    ) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}
