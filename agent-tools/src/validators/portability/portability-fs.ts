/**
 * Filesystem helpers used by the portability validator entry point.
 *
 * These thin wrappers encapsulate the `node:fs/promises` calls so the main
 * orchestration module remains focused on validation logic rather than I/O
 * mechanics.  All paths are relative to the repo root, which is resolved once
 * at startup and threaded through via the `repoRoot` parameter.
 *
 * None of these helpers are exported from the public barrel
 * (`validate-portability-helpers.ts`) — they are entry-point internals only.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Reads the UTF-8 text content of a file at `<repoRoot>/<relPath>`.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relPath  - Repo-relative path to the file.
 * @returns The full text content of the file.
 * @throws When the file cannot be read.
 */
export async function readText(repoRoot: string, relPath: string): Promise<string> {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

/**
 * Writes `content` to `<repoRoot>/<relPath>`, creating any missing parent
 * directories.
 *
 * @param repoRoot          - Absolute path to the repository root.
 * @param relPath           - Repo-relative destination path.
 * @param content           - Text content to write.
 * @param writtenWrappers   - Mutable array that collects all paths written
 *   during a `--fix` run; the path is appended on success.
 */
export async function writeText(
  repoRoot: string,
  relPath: string,
  content: string,
  writtenWrappers: string[],
): Promise<void> {
  const absPath = path.join(repoRoot, relPath);
  await fs.mkdir(path.dirname(absPath), { recursive: true });
  await fs.writeFile(absPath, content, 'utf8');
  writtenWrappers.push(relPath);
}

/**
 * Parses the JSON file at `<repoRoot>/<relPath>`.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relPath  - Repo-relative path to the JSON file.
 * @returns The parsed JSON value.
 * @throws When the file cannot be read or its content is not valid JSON.
 */
export async function readJson(repoRoot: string, relPath: string): Promise<unknown> {
  return JSON.parse(await readText(repoRoot, relPath));
}

/**
 * Checks whether a file or directory exists at `<repoRoot>/<relPath>`.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relPath  - Repo-relative path to test.
 * @returns `true` when `fs.access` succeeds; `false` otherwise.
 */
export async function exists(repoRoot: string, relPath: string): Promise<boolean> {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

/**
 * Result type returned by {@link readOptionalText}.
 */
export interface OptionalTextResult {
  /** Whether the file was present on disk. */
  isPresent: boolean;
  /** The file text, or `null` when the file was absent. */
  value: string | null;
}

/**
 * Reads the text content of a file if it exists, or returns
 * `{ isPresent: false, value: null }` when it does not.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relPath  - Repo-relative path to the file.
 * @returns An {@link OptionalTextResult} describing presence and content.
 */
export async function readOptionalText(
  repoRoot: string,
  relPath: string,
): Promise<OptionalTextResult> {
  if (!(await exists(repoRoot, relPath))) {
    return { isPresent: false, value: null };
  }
  return { isPresent: true, value: await readText(repoRoot, relPath) };
}

/**
 * Lists all files with the given extension in `<repoRoot>/<relDir>`, sorted
 * lexicographically.
 *
 * @param repoRoot  - Absolute path to the repository root.
 * @param relDir    - Repo-relative path to the directory to list.
 * @param extension - File extension to filter by (including the leading dot).
 * @returns Sorted array of repo-relative file paths, or an empty array when
 *   the directory does not exist or cannot be read.
 */
export async function listFiles(
  repoRoot: string,
  relDir: string,
  extension: string,
): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(repoRoot, relDir), { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(extension))
      .map((e) => `${relDir}/${e.name}`)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/**
 * Lists all immediate subdirectory names in `<repoRoot>/<relDir>`, sorted
 * lexicographically.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relDir   - Repo-relative path to the directory to list.
 * @returns Sorted array of subdirectory names (not full paths), or an empty
 *   array when the directory does not exist or cannot be read.
 */
export async function listSubdirs(repoRoot: string, relDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(path.join(repoRoot, relDir), { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

/**
 * Extracts the YAML frontmatter block from a Markdown document.
 *
 * The frontmatter is expected to be delimited by `---` lines at the very
 * start of the file.
 *
 * @param content - Full text of the Markdown document.
 * @returns The raw frontmatter text (between the delimiters), or `null` when
 *   no frontmatter block is present.
 */
export function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

/**
 * Reads a single key's value from a YAML frontmatter string.
 *
 * Handles both bare and single/double-quoted values.
 *
 * @param frontmatter - The raw frontmatter text, as returned by
 *   {@link extractFrontmatter}.
 * @param key         - The frontmatter key to look up.
 * @returns The trimmed, unquoted value string, or an empty string when the
 *   key is not present.
 */
export function getFrontmatterValue(frontmatter: string, key: string): string {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const match = frontmatter.match(new RegExp(String.raw`^${escapedKey}:\s*(.+)$`, 'm'));
  return match?.[1]?.trim().replaceAll(/^['"]|['"]$/g, '') ?? '';
}

/**
 * Strips a YAML frontmatter block from the start of a Markdown document.
 *
 * @param content - Full text of the Markdown document.
 * @returns The document text with the frontmatter block removed.
 */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u, '');
}
