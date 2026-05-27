import fs from 'node:fs/promises';
import path from 'node:path';

import { extractFrontmatter, getFrontmatterNumber, getFrontmatterString } from './markdown.js';

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

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
