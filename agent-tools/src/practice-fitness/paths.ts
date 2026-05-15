import fs from 'node:fs/promises';
import path from 'node:path';

import { extractFrontmatter, getFrontmatterNumber } from './markdown.js';

const EXCLUDED_DIRECTORY_NAMES = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const EXCLUDED_PATH_PREFIXES = ['.agent/practice-core-backup-', '.agent/practice-core/incoming/'];
const EXCLUDED_PATH_SEGMENTS = ['/archive/'];

function normalizeRelativePath(relPath: string): string {
  return relPath.split(path.sep).join('/');
}

/**
 * Decide whether a directory should be skipped during repo-wide discovery.
 */
function shouldSkipDirectory(relPath: string): boolean {
  const normalizedPath = normalizeRelativePath(relPath);
  const pathParts = normalizedPath.split('/');
  const directoryName = pathParts[pathParts.length - 1];

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
async function discoverMarkdownFiles(repoRoot: string, relDir = '.'): Promise<string[]> {
  const absDir = path.join(repoRoot, relDir);
  const dirEntries = await fs.readdir(absDir, { withFileTypes: true });
  const sortedEntries = dirEntries.toSorted((left, right) => left.name.localeCompare(right.name));
  const markdownFiles: string[] = [];

  for (const entry of sortedEntries) {
    const relPath = relDir === '.' ? entry.name : path.join(relDir, entry.name);

    if (entry.isDirectory()) {
      if (shouldSkipDirectory(relPath)) {
        continue;
      }

      markdownFiles.push(...(await discoverMarkdownFiles(repoRoot, relPath)));
      continue;
    }

    if (entry.isFile() && shouldInspectFitnessPath(relPath)) {
      markdownFiles.push(normalizeRelativePath(relPath));
    }
  }

  return markdownFiles;
}

/**
 * Discover all live repo files that declare fitness frontmatter.
 */
export async function discoverFitnessFiles(repoRoot: string): Promise<string[]> {
  const markdownFiles = await discoverMarkdownFiles(repoRoot);
  const fitnessFiles: string[] = [];

  for (const relPath of markdownFiles) {
    const content = await fs.readFile(path.join(repoRoot, relPath), 'utf8');
    const frontmatter = extractFrontmatter(content);

    if (getFrontmatterNumber(frontmatter, 'fitness_line_target') !== null) {
      fitnessFiles.push(relPath);
    }
  }

  return fitnessFiles.toSorted((left, right) => left.localeCompare(right));
}
