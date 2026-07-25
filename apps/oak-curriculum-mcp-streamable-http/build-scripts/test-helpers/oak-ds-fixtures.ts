/**
 * Filesystem access for the design-system copy tests.
 *
 * @remarks
 * The subject under test IS a filesystem copy, so the tests cannot prove it
 * against a fake without becoming tautological — asserting the mock rather
 * than the copy. ADR-078's structural allowlist exists for exactly this: the
 * real IO lives behind a `test-helpers/` surface with a named, narrow API,
 * and the test files themselves import no IO module.
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

/** Normalise a package-relative reference resolved against a stylesheet. */
export function resolveRelative(fromFile: string, reference: string): string {
  return path.normalize(path.join(path.dirname(fromFile), reference));
}
