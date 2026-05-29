import fs from 'node:fs/promises';
import path from 'node:path';

import type { ScannedFile } from './external-data-contract.js';

/**
 * File-system discovery for the `*.external-data.ts` file convention.
 *
 * Walks a repository tree for snapshot modules and reads them into the
 * in-memory shape the pure contract checker
 * ({@link findExternalDataViolations | findExternalDataViolations} in
 * `./external-data-contract.ts`) consumes. Traversal goes through an injected
 * {@link ExternalDataFileSystem} so it is unit-testable with an in-memory
 * adapter (per `feedback_tests_no_global_state`); the node default is used in
 * production.
 *
 * @packageDocumentation
 */

/** Filename suffix that marks a faithful external-data snapshot module. */
const EXTERNAL_DATA_SUFFIX = '.external-data.ts';

/** Directory names skipped during discovery (never contain authored snapshots). */
const EXCLUDED_DIRECTORY_NAMES: ReadonlySet<string> = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.turbo',
  '.next',
  'stryker-tmp',
]);

/** Whether a repo-relative path is an external-data snapshot module. */
export function isExternalDataFile(relativePath: string): boolean {
  return relativePath.endsWith(EXTERNAL_DATA_SUFFIX);
}

/** Whether a directory name is excluded from discovery traversal. */
export function shouldSkipDirectory(name: string): boolean {
  return EXCLUDED_DIRECTORY_NAMES.has(name);
}

/** A directory entry, structurally compatible with `node:fs` `Dirent`. */
export interface ExternalDataDirEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
}

/**
 * File-system surface used by {@link discoverExternalDataFiles}. Injected for
 * deterministic unit tests; the node default below is used in production.
 */
export interface ExternalDataFileSystem {
  readdir(absoluteDir: string): Promise<readonly ExternalDataDirEntry[]>;
  readFile(absolutePath: string): Promise<string>;
}

/** Production adapter binding {@link ExternalDataFileSystem} to `node:fs`. */
const nodeExternalDataFileSystem: ExternalDataFileSystem = {
  readdir: (absoluteDir) => fs.readdir(absoluteDir, { withFileTypes: true }),
  readFile: (absolutePath) => fs.readFile(absolutePath, 'utf8'),
};

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

async function handleEntry(
  rootAbsolute: string,
  absoluteDir: string,
  entry: ExternalDataDirEntry,
  fileSystem: ExternalDataFileSystem,
  accumulator: ScannedFile[],
): Promise<void> {
  const entryAbsolute = path.join(absoluteDir, entry.name);

  if (entry.isDirectory()) {
    if (!shouldSkipDirectory(entry.name)) {
      await collectFiles(rootAbsolute, entryAbsolute, fileSystem, accumulator);
    }
    return;
  }

  if (!entry.isFile()) {
    return;
  }

  const relative = path.relative(rootAbsolute, entryAbsolute).split(path.sep).join('/');
  if (isExternalDataFile(relative)) {
    accumulator.push({ path: relative, content: await fileSystem.readFile(entryAbsolute) });
  }
}

async function collectFiles(
  rootAbsolute: string,
  absoluteDir: string,
  fileSystem: ExternalDataFileSystem,
  accumulator: ScannedFile[],
): Promise<void> {
  let entries: readonly ExternalDataDirEntry[];
  try {
    entries = await fileSystem.readdir(absoluteDir);
  } catch (error) {
    // A missing optional directory is not a discovery failure.
    if (isErrnoException(error) && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  for (const entry of entries) {
    await handleEntry(rootAbsolute, absoluteDir, entry, fileSystem, accumulator);
  }
}

/**
 * Recursively discover every `*.external-data.ts` file under `rootAbsolute`,
 * skipping {@link EXCLUDED_DIRECTORY_NAMES}, and read each into a
 * {@link ScannedFile} with a repo-relative POSIX path.
 *
 * @param rootAbsolute - Absolute path of the repository root to scan.
 * @param fileSystem - File-system surface; defaults to the node adapter.
 * @returns The discovered files, ready for the pure contract checker.
 */
export async function discoverExternalDataFiles(
  rootAbsolute: string,
  fileSystem: ExternalDataFileSystem = nodeExternalDataFileSystem,
): Promise<readonly ScannedFile[]> {
  const accumulator: ScannedFile[] = [];
  await collectFiles(rootAbsolute, rootAbsolute, fileSystem, accumulator);
  return accumulator;
}
