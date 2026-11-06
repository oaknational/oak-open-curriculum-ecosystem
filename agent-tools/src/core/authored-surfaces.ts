/**
 * Discover the authored surfaces a validator scans: the markdown, YAML and
 * similar files under a set of roots plus a set of optional root-level
 * files, minus the path fragments the validator excludes.
 *
 * Every walk of the authored surfaces has the same semantics: a missing root
 * is not a failure, a path outside the universe (normally the tracked tree)
 * is never entered or read, an excluded fragment or root prunes a directory
 * or a file, and only files with a scanned extension are read. One walker owns
 * those semantics (`consolidate-at-second-consumer`); each caller supplies
 * its own roots, extensions and scope exclusions, and the universe comes
 * from git rather than from a list (`compute-dont-hope`). The projection leg
 * consumes `isEnoent`; the walker is here for the validators that cite paths
 * and scripts.
 *
 * The file system is an injected port so the walk's semantics are proven by
 * a unit test over an in-memory tree, never by touching a real checkout.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises';
import path from 'node:path';

/** One authored file: its repo-relative path (POSIX separators) and text. */
export interface AuthoredFile {
  readonly path: string;
  readonly content: string;
}

/** What a validator scans. */
export interface AuthoredSurfaceSpec {
  /** Repo-relative directories walked recursively; a missing root is skipped. */
  readonly roots: readonly string[];
  /** Repo-relative files read when present; a missing file is skipped. */
  readonly rootFiles: readonly string[];
  /** Extensions (with the dot) of the files read under `roots`. */
  readonly extensions: ReadonlySet<string>;
  /**
   * Path fragments that prune the walk: a directory whose repo-relative
   * path plus a trailing slash contains a fragment is not entered, and a
   * file whose repo-relative path contains a fragment is not read. These
   * declare the validator's SCOPE (archives, history, memory); what the
   * repository ignores is never listed here — it is outside the universe.
   */
  readonly excludedPathFragments: readonly string[];
  /**
   * Repo-relative directory prefixes, each ending with a slash, under which
   * nothing is entered or read: the host's history roots (frozen backlogs,
   * archived records, its architectural decision records). A fragment names
   * a shape found anywhere; a root names one place. The roots are host data,
   * declared in each validator's entry file beside its general fragments.
   */
  readonly excludedRoots: readonly string[];
  /**
   * The paths the walk may see: repo-relative files and the directories they
   * imply, normally the tracked tree (`listTrackedPathSet`). A directory or
   * file outside the universe is never entered or read, so ignored material
   * (build output, local boundaries, vendored trees) is invisible without
   * anyone listing it.
   */
  readonly universe: ReadonlySet<string>;
}

/** A directory entry as `readdir` with `withFileTypes` reports it. */
interface AuthoredSurfaceDirectoryEntry {
  readonly name: string;
  isDirectory: () => boolean;
  isFile: () => boolean;
}

/** The file-system operations the walk needs; the real `node:fs` by default. */
export interface AuthoredSurfaceFs {
  readdir: (absoluteDir: string) => Promise<readonly AuthoredSurfaceDirectoryEntry[]>;
  readFile: (absolutePath: string) => Promise<string>;
}

const defaultAuthoredSurfaceFs: AuthoredSurfaceFs = {
  readdir: (absoluteDir) => fs.readdir(absoluteDir, { withFileTypes: true }),
  readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
};

/** Whether an error is the file system's "no such file or directory". */
export function isEnoent(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

/**
 * Walk the spec's roots and read its root files.
 *
 * @param repoRoot - Absolute path of the repository root every spec path is
 * relative to.
 * @param spec - The roots, root files, extensions and exclusions to apply.
 * @param surfaceFs - File-system port; defaults to `node:fs/promises`.
 * @returns The files in walk order: each root's files depth-first in
 * directory-listing order, then the root files in the order given.
 *
 * @example
 * ```ts
 * const files = await discoverAuthoredFiles(repoRoot, {
 *   roots: ['.agent/rules'],
 *   rootFiles: ['AGENTS.md'],
 *   extensions: new Set(['.md']),
 *   excludedPathFragments: ['/archive/'],
 *   excludedRoots: [],
 * });
 * ```
 */
export async function discoverAuthoredFiles(
  repoRoot: string,
  spec: AuthoredSurfaceSpec,
  surfaceFs: AuthoredSurfaceFs = defaultAuthoredSurfaceFs,
): Promise<readonly AuthoredFile[]> {
  const files: AuthoredFile[] = [];
  for (const rootRelative of spec.roots) {
    // POSIX joins throughout: every surface path is POSIX-relative, Node's fs accepts forward slashes
    // on Windows, and the fakes the tests inject key their trees by POSIX paths.
    await collectFiles(path.posix.join(repoRoot, rootRelative), files, {
      repoRoot,
      spec,
      surfaceFs,
    });
  }
  for (const fileName of spec.rootFiles) {
    if (!spec.universe.has(fileName)) {
      continue;
    }
    const content = await readOptionalFile(path.posix.join(repoRoot, fileName), surfaceFs);
    if (content !== undefined) {
      files.push({ path: fileName, content });
    }
  }
  return files;
}

/** Read a file's text, or `undefined` when it does not exist. */
export async function readOptionalFile(
  absolutePath: string,
  surfaceFs: AuthoredSurfaceFs = defaultAuthoredSurfaceFs,
): Promise<string | undefined> {
  try {
    return await surfaceFs.readFile(absolutePath);
  } catch (error) {
    if (isEnoent(error)) {
      return undefined;
    }
    throw error;
  }
}

interface WalkContext {
  readonly repoRoot: string;
  readonly spec: AuthoredSurfaceSpec;
  readonly surfaceFs: AuthoredSurfaceFs;
}

async function collectFiles(
  absoluteDir: string,
  accumulator: AuthoredFile[],
  context: WalkContext,
): Promise<void> {
  for (const entry of await readDirectoryEntries(absoluteDir, context.surfaceFs)) {
    const entryAbsolute = path.posix.join(absoluteDir, entry.name);
    const repoRelative = toRepoRelative(context.repoRoot, entryAbsolute);
    if (!context.spec.universe.has(repoRelative)) {
      continue;
    }
    if (isExcluded(context.spec, entry.isDirectory() ? `${repoRelative}/` : repoRelative)) {
      continue;
    }
    if (entry.isDirectory()) {
      await collectFiles(entryAbsolute, accumulator, context);
    } else if (entry.isFile() && context.spec.extensions.has(path.extname(entry.name))) {
      accumulator.push({
        path: repoRelative,
        content: await context.surfaceFs.readFile(entryAbsolute),
      });
    }
  }
}

async function readDirectoryEntries(
  absoluteDir: string,
  surfaceFs: AuthoredSurfaceFs,
): Promise<readonly AuthoredSurfaceDirectoryEntry[]> {
  try {
    return await surfaceFs.readdir(absoluteDir);
  } catch (error) {
    if (isEnoent(error)) {
      return [];
    }
    throw error;
  }
}

function toRepoRelative(repoRoot: string, absolute: string): string {
  return path.relative(repoRoot, absolute).split(path.sep).join('/');
}

function isExcluded(spec: AuthoredSurfaceSpec, repoRelative: string): boolean {
  return (
    spec.excludedPathFragments.some((fragment) => repoRelative.includes(fragment)) ||
    spec.excludedRoots.some((root) => repoRelative.startsWith(root))
  );
}
