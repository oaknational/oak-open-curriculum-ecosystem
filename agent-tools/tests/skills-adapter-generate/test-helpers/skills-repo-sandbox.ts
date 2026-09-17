/**
 * Hermetic filesystem sandbox for the skills-adapter carriage integration
 * tests: real IO on behalf of tests, homed on the `test-helpers/` surface
 * per the no-real-io-in-tests structural allowlist. Each sandbox is a fresh
 * temp directory laid out as a minimal repo root; `cleanupSandboxes`
 * removes everything a test file created.
 */
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const created: string[] = [];

/** Create a fresh sandbox repo root, tracked for cleanup. */
export function sandboxRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'skills-carriage-'));
  created.push(dir);
  return dir;
}

/** Remove every sandbox created since the last cleanup. */
export function cleanupSandboxes(): void {
  for (const dir of created.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Write a repo-relative file (bytes or UTF-8 text), creating parents. */
export function writeRepoFile(root: string, relPath: string, content: string | Uint8Array): void {
  const absolute = join(root, relPath);
  mkdirSync(join(absolute, '..'), { recursive: true });
  writeFileSync(absolute, content);
}

/** Create a repo-relative directory (for empty-directory fixtures). */
export function makeRepoDir(root: string, relPath: string): void {
  mkdirSync(join(root, relPath), { recursive: true });
}

/** Remove a repo-relative file (for canonical-source-deletion fixtures). */
export function removeRepoFile(root: string, relPath: string): void {
  rmSync(join(root, relPath));
}

/** Remove a repo-relative path of any shape (for transition fixtures). */
export function removeRepoPath(root: string, relPath: string): void {
  rmSync(join(root, relPath), { recursive: true, force: true });
}

/** Rename a repo-relative path (for whole-skill rename fixtures). */
export function renameRepoPath(root: string, fromRelPath: string, toRelPath: string): void {
  renameSync(join(root, fromRelPath), join(root, toRelPath));
}

/** Read a repo-relative file's raw bytes (as a plain `Uint8Array`, so
 * deep-equality against literal byte fixtures compares content, not the
 * Buffer wrapper), or undefined when absent. */
export function readRepoBytes(root: string, relPath: string): Uint8Array | undefined {
  const absolute = join(root, relPath);
  return existsSync(absolute) ? new Uint8Array(readFileSync(absolute)) : undefined;
}

/** Whether a repo-relative path (file or directory) exists. */
export function repoPathExists(root: string, relPath: string): boolean {
  return existsSync(join(root, relPath));
}

/** Create a repo-relative symlink pointing at `target` (absolute, or
 * relative to the link's own directory), creating link parents. */
export function symlinkRepoPath(root: string, relLinkPath: string, target: string): void {
  const absolute = join(root, relLinkPath);
  mkdirSync(join(absolute, '..'), { recursive: true });
  symlinkSync(target, absolute);
}

/** Whether a repo-relative path is itself a symlink (never follows). */
export function repoPathIsSymlink(root: string, relPath: string): boolean {
  const absolute = join(root, relPath);
  try {
    return lstatSync(absolute).isSymbolicLink();
  } catch {
    return false;
  }
}

/** Set a repo-relative file's mode (for executable-bit fixtures). */
export function chmodRepoFile(root: string, relPath: string, mode: number): void {
  chmodSync(join(root, relPath), mode);
}

/** Whether a repo-relative file carries any executable bit. */
export function repoFileIsExecutable(root: string, relPath: string): boolean {
  return (statSync(join(root, relPath)).mode & 0o111) !== 0;
}

/** Recursively list files under a repo-relative directory, sorted. */
export function listRepoFiles(root: string, relPath: string): string[] {
  const absolute = join(root, relPath);
  if (!existsSync(absolute)) {
    return [];
  }
  return readdirSync(absolute, { recursive: true, withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => join(dirent.parentPath, dirent.name).slice(absolute.length + 1))
    .sort((a, b) => a.localeCompare(b, 'en'));
}
