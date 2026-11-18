/**
 * Contained file writing for the EEF markdown writer. Every directory is
 * checked to sit inside a base before it is created (canonically, through its
 * nearest existing ancestor, so a symbolic link already on the path cannot
 * carry the creation outside) and once it exists; every target is opened
 * without following symbolic links and without blocking, then verified
 * through its own descriptor before a byte is written.
 *
 * The contract is closed: a target is written only when the descriptor refers
 * to a regular file that no other path shares. A symbolic link, a hard link to
 * another file, a directory, a named pipe, a socket or a device in the
 * target's place is refused with no check-then-write window and no hang (a
 * hard link shares its inode, so a truncation through it would rewrite a file
 * that may lie outside the base); a platform whose no-follow flag is absent or
 * inert (present with the value 0) is refused outright.
 */

import {
  closeSync,
  constants,
  fstatSync,
  ftruncateSync,
  mkdirSync,
  openSync,
  realpathSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { assertPathWithinBase } from '@oaknational/safe-path';
import type { RenderedMarkdownFile } from '../src/eef-strands/eef-markdown-files.js';

/** The reason a run writes nothing more. */
export interface Refusal {
  readonly refused: string;
}

/** The `code` of a system error, when the thrown value carries one. */
function errorCode(error: unknown): string | undefined {
  return error instanceof Error && 'code' in error && typeof error.code === 'string'
    ? error.code
    : undefined;
}

/** The canonical path of the nearest existing ancestor of `path` (`path` itself when it exists). */
function canonicalNearestExisting(path: string): string | Refusal {
  let current = path;
  while (current !== dirname(current)) {
    try {
      return realpathSync(current);
    } catch (error) {
      const code = errorCode(error);
      if (code !== 'ENOENT') {
        return { refused: `${current} could not be canonicalised (${code ?? String(error)})` };
      }
      current = dirname(current);
    }
  }
  return realpathSync(current);
}

/**
 * Create `directory` inside `base` and return its canonical path: the nearest
 * existing ancestor is canonicalised and checked before anything is created,
 * and the created directory is checked again once it exists.
 */
export function ensureContainedDirectory(directory: string, base: string): string | Refusal {
  const nearest = canonicalNearestExisting(directory);
  if (typeof nearest !== 'string') {
    return nearest;
  }
  assertPathWithinBase(nearest, base);
  mkdirSync(directory, { recursive: true });
  return assertPathWithinBase(directory, base);
}

/**
 * Open `target` for writing as a regular file: without following a symbolic
 * link in its place and without blocking on a pipe, then verified through the
 * descriptor itself and truncated only once it is known to be a regular file
 * with a single link, so the refusal, the open and the truncation leave no
 * window between them.
 */
function openRegularFileForWriting(target: string, relativePath: string): number | Refusal {
  // Presence is not support: a platform can expose the flag with the value 0,
  // where it does nothing and a link would be followed.
  if (!Object.hasOwn(constants, 'O_NOFOLLOW') || constants.O_NOFOLLOW === 0) {
    return {
      refused:
        'this platform cannot open a file without following symbolic links; run under a POSIX shell',
    };
  }
  const flags =
    constants.O_WRONLY | constants.O_CREAT | constants.O_NOFOLLOW | constants.O_NONBLOCK;
  let descriptor: number;
  try {
    descriptor = openSync(target, flags, 0o644);
  } catch (error) {
    const code = errorCode(error);
    const reason =
      code === 'ELOOP'
        ? 'is a symbolic link; not followed'
        : `could not be opened for writing (${code ?? String(error)})`;
    return { refused: `${relativePath} ${reason}` };
  }
  const stat = fstatSync(descriptor);
  if (!stat.isFile()) {
    closeSync(descriptor);
    return { refused: `${relativePath} exists and is not a regular file; not written` };
  }
  // A hard link shares its inode: truncating through it would rewrite the
  // other path's file, which may lie outside the output root.
  if (stat.nlink > 1) {
    closeSync(descriptor);
    return { refused: `${relativePath} has more than one link; not written` };
  }
  ftruncateSync(descriptor, 0);
  return descriptor;
}

/**
 * Write one rendered file under the output root: the target directory is
 * canonicalised and checked against the root first, and the target is opened
 * as a regular file (no link following, no blocking) and written through that
 * descriptor.
 */
export function writeContained(outputRoot: string, file: RenderedMarkdownFile): string | Refusal {
  const directory = ensureContainedDirectory(join(outputRoot, dirname(file.path)), outputRoot);
  if (typeof directory !== 'string') {
    return directory;
  }
  const target = join(directory, basename(file.path));
  const descriptor = openRegularFileForWriting(target, file.path);
  if (typeof descriptor !== 'number') {
    return descriptor;
  }
  try {
    writeFileSync(descriptor, file.text);
  } finally {
    closeSync(descriptor);
  }
  return target;
}
