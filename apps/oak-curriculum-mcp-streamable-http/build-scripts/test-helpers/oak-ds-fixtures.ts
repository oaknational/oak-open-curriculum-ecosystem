/**
 * Filesystem access for the design-system copy tests.
 *
 * @remarks
 * The subject under test IS a filesystem copy, so the tests cannot prove it
 * against a fake without becoming tautological — asserting the mock rather
 * than the copy. The `no-real-io-in-tests` lint rule's structural allowlist
 * (`packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`) exists for
 * exactly this: the real IO lives behind a `test-helpers/` surface with a
 * named, narrow API, and the test files themselves import no IO module.
 *
 * @packageDocumentation
 */

import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

/** Create a scratch directory for a copy run. */
export async function createScratchDirectory(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), 'oak-ds-copy-'));
}

/** Remove a scratch directory and everything under it. */
export async function removeScratchDirectory(directory: string): Promise<void> {
  await rm(directory, { recursive: true, force: true });
}

/** Read a design-system file as text, package-relative. */
export async function readPackageText(packageRoot: string, relativePath: string): Promise<string> {
  return readFile(path.join(packageRoot, relativePath), 'utf8');
}

/** Directory entry names, sorted for stable comparison. */
export async function listDirectory(...segments: readonly string[]): Promise<string[]> {
  const entries = await readdir(path.join(...segments));
  return entries.sort((a, b) => a.localeCompare(b));
}

/** Whether the given path exists and is a regular file. */
export async function isFile(...segments: readonly string[]): Promise<boolean> {
  try {
    const stats = await stat(path.join(...segments));
    return stats.isFile();
  } catch {
    return false;
  }
}

/** Join path segments without the test file needing `node:path`. */
export function joinPath(...segments: readonly string[]): string {
  return path.join(...segments);
}

/** The directory portion of a package-relative path. */
export function directoryOf(relativePath: string): string {
  return path.dirname(relativePath);
}

/**
 * Normalise a package-relative reference resolved against a stylesheet.
 *
 * @remarks
 * Both inputs and the result live in the manifest's package-relative,
 * forward-slash form (CSS `@import`/`url()` targets are always POSIX), so
 * the resolution stays in `path.posix` regardless of the host separator.
 */
export function resolveRelative(fromFile: string, reference: string): string {
  return path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), reference));
}

/** Read a file from the app's own workspace, workspace-relative. */
export async function readAppText(relativePath: string): Promise<string> {
  return readFile(path.resolve(import.meta.dirname, '..', '..', relativePath), 'utf8');
}

/**
 * Every regular file under a root, as sorted root-relative paths.
 *
 * @remarks
 * Returned in the manifest's forward-slash form: `path.relative` emits the
 * host separator, so the mapping normalises it to keep the contract the
 * consumers compare against (manifest entries, licence-notice paths) host
 * independent.
 */
export async function listFilesRecursive(...segments: readonly string[]): Promise<string[]> {
  const root = path.join(...segments);
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      path.relative(root, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'),
    )
    .sort((a, b) => a.localeCompare(b));
}
