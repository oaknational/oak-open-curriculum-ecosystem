/**
 * Normalize a repository path for commit-queue comparisons.
 */
export function normalizeRepoPath(repoPath: string): string {
  return repoPath.replaceAll('\\', '/');
}

/**
 * Normalize, deduplicate, and sort a newline-delimited file list.
 */
export function normalizeFileList(text: string): readonly string[] {
  const files = text
    .split(/\r?\n/u)
    .map((line) => normalizeRepoPath(line.trim()))
    .filter(Boolean);

  return [...new Set(files)].toSorted((a, b) => a.localeCompare(b));
}

/**
 * Format a file list for operator-facing diagnostics.
 */
export function formatFileList(files: readonly string[]): string {
  return files.length === 0 ? 'none' : files.join(', ');
}
