/**
 * Shared tracked-file scanning primitives for the whole-tree validators.
 *
 * @remarks
 * Two gates enforce an invariant over EVERY git-tracked file — the
 * machine-local-path gate and the identity-naming gate — and both need the
 * same three things: the tracked-path list, one tracked path's scannable text,
 * and the binary/generated skip policy deciding which paths carry scannable
 * content at all. That plumbing was duplicated across the two entry files;
 * it is single-sourced here (`consolidate-at-second-consumer`). Validators are
 * the security-critical floor, and a skip set that drifts between two gates is
 * a silent hole in whichever one falls behind.
 *
 * The unreadable-tracked-file POSTURE is deliberately not decided here. A
 * tracked file the scan cannot read could hide exactly what a gate exists to
 * catch, so silently skipping it would be a green-gate bypass — but whether
 * that surfaces as an exit-2 refusal or as a thrown error is each validator's
 * contract with its operator. This module reports the failure as a `Result`
 * and every caller translates it (ADR-088 / the Result discipline).
 *
 * @packageDocumentation
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readlinkSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { resolveTrustedGit } from './trusted-git.js';

/** Null byte: the `git ls-files -z` record separator, and the binary-content marker. */
const NUL = '\u0000';

/**
 * File extensions that are genuinely binary — not worth scanning as text, and
 * skipped by the CONTENT leg only (a path leg, where a validator has one,
 * still inspects every tracked path including these). SVG is deliberately NOT
 * here: it is plain text and can embed a machine-local path or an identity
 * token in metadata, so it is scanned like any other text file.
 */
const SKIP_EXTENSIONS: ReadonlySet<string> = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.map',
  '.lock',
]);

/** Specific large generated files with no human-authored prose to police. */
const SKIP_FILES: ReadonlySet<string> = new Set(['pnpm-lock.yaml']);

/** A file to scan: its repo-relative path and full text content. */
export interface ScanFile {
  readonly path: string;
  readonly content: string;
}

/**
 * True when a tracked path may carry scannable text under the skip policy —
 * the pure half of the content leg's admission decision (path-shape only;
 * {@link isScannableContent} rules on what a read actually returned).
 */
export function isScannablePath(relativePath: string): boolean {
  return !(
    SKIP_FILES.has(path.basename(relativePath)) || SKIP_EXTENSIONS.has(path.extname(relativePath))
  );
}

/**
 * True when read content is scannable text: a NUL byte marks binary content
 * that slipped past the extension policy (e.g. an extensionless blob).
 */
export function isScannableContent(content: string): boolean {
  return !content.includes(NUL);
}

/** The one tracked path a scan could not read, with the underlying cause. */
export interface UnreadableTrackedFile {
  /** The repo-relative path that failed to read. */
  readonly relativePath: string;
  /** The error thrown by the read attempt. */
  readonly cause: unknown;
}

/**
 * List every tracked file, NUL-delimited so paths with spaces survive.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @returns Every tracked repo-relative path, including binaries.
 */
export function listTrackedFiles(repoRoot: string): string[] {
  const stdout = execFileSync(resolveTrustedGit(), ['ls-files', '-z'], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout.split(NUL).filter((entry) => entry.length > 0);
}

/**
 * A tracked path's scannable text: a symlink's link text, else the file
 * content.
 *
 * @remarks
 * A tracked symlink's scannable content IS its link text (what git stores):
 * an absolute target into a home directory is exactly the machine-local-path
 * class one validator exists to catch, while following the link would
 * double-scan (or `EISDIR` on) the target, which is scanned under its own
 * tracked path. The read itself is the symlink test (`readlink` gives EINVAL
 * on a regular file), so there is no check-then-use window (CodeQL
 * `js/file-system-race`).
 *
 * @param absolute - Absolute path to the tracked file.
 * @returns The link text for a symlink, otherwise the file's UTF-8 content.
 */
function readLinkTextOrFile(absolute: string): string {
  try {
    return readlinkSync(absolute);
  } catch {
    return readFileSync(absolute, 'utf8');
  }
}

/**
 * Read the scannable text of every given tracked path.
 *
 * @remarks
 * Binary extensions, the generated-file skip list, and NUL-bearing content are
 * dropped — those carry no scannable text. An UNREADABLE tracked file is never
 * dropped: it short-circuits to the `Err` arm so the caller can refuse rather
 * than pass a scan that silently missed a file.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @param relativePaths - The tracked repo-relative paths to read.
 * @returns The scannable files, or the first unreadable tracked path.
 */
export function readScanFiles(
  repoRoot: string,
  relativePaths: readonly string[],
): Result<ScanFile[], UnreadableTrackedFile> {
  const files: ScanFile[] = [];
  for (const relativePath of relativePaths) {
    if (!isScannablePath(relativePath)) {
      continue;
    }
    let content: string;
    try {
      content = readLinkTextOrFile(path.join(repoRoot, relativePath));
    } catch (error) {
      return err({ relativePath, cause: error });
    }
    if (!isScannableContent(content)) {
      continue;
    }
    files.push({ path: relativePath, content });
  }
  return ok(files);
}
