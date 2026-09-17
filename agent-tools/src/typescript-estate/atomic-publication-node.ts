import {
  closeSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  renameSync,
  unlinkSync,
  writeSync,
  constants as fsConstants,
  type Stats,
} from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { assertPathWithinBase } from '@oaknational/safe-path';

import type {
  AtomicPublicationPort,
  PreparedPublicationTarget,
  PublicationFileKind,
} from './atomic-publication-model.js';

/**
 * Real `node:fs` implementation of the phase-specific atomic-publication port.
 *
 * The factory captures the invoking Git root once; `prepareContainedTarget`
 * refuses a mismatching root argument so a confused wiring fails loudly
 * instead of silently re-anchoring containment. Pre-create containment is
 * asserted on the deepest existing ancestor of the (possibly not yet
 * materialised) output directory; pre-commit containment re-asserts on the
 * then-existing directory itself, so a directory swapped for a symlink
 * between phases is re-inspected. Symlink refusal of the final artefact path
 * itself is the orchestrator's job through the inspect operations.
 *
 * Every `node:fs` throw is translated to a `Result` error at this single
 * boundary (ADR-088).
 */
export function createNodeAtomicPublicationPort(
  invokingGitRoot: string,
): AtomicPublicationPort<number> {
  return {
    prepareContainedTarget: (gitRoot, outDirectory) =>
      prepareContained(invokingGitRoot, gitRoot, outDirectory),
    checkBeforeCreate: (target) =>
      tryVoid(() => {
        assertPathWithinBase(deepestExistingAncestor(target.outDirectory), invokingGitRoot);
      }),
    materialiseDirectory: (target) =>
      tryVoid(() => {
        materialiseContained(invokingGitRoot, target.outDirectory);
      }),
    inspectTargetBeforeCreate: (target) => inspectKind(target.path),
    createExclusive: (target) =>
      tryResult(() =>
        openSync(
          target.path,
          fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL,
          0o644,
        ),
      ),
    write: (handle, bytes) => tryVoid(() => writeAll(handle, bytes)),
    fsync: (handle) =>
      tryVoid(() => {
        fsyncSync(handle);
      }),
    close: (handle) =>
      tryVoid(() => {
        closeSync(handle);
      }),
    checkBeforeCommit: (target) =>
      tryVoid(() => {
        assertPathWithinBase(target.outDirectory, invokingGitRoot);
      }),
    inspectTargetBeforeCommit: (target) => inspectKind(target.path),
    rename: (temp, final) =>
      tryVoid(() => {
        renameSync(temp.path, final.path);
      }),
    removeTemp: (target) =>
      tryVoid(() => {
        unlinkSync(target.path);
      }),
  };
}

function prepareContained(
  invokingGitRoot: string,
  gitRoot: string,
  outDirectory: string,
): Result<PreparedPublicationTarget, Error> {
  if (gitRoot !== invokingGitRoot) {
    return err(
      new Error(
        `publication port is anchored at '${invokingGitRoot}' but was invoked for '${gitRoot}'`,
      ),
    );
  }
  return tryResult(() => {
    const realRoot = assertPathWithinBase(invokingGitRoot, invokingGitRoot);
    const resolved = path.resolve(realRoot, outDirectory);
    if (resolved !== realRoot && !resolved.startsWith(`${realRoot}${path.sep}`)) {
      throw new Error(
        `output directory '${outDirectory}' resolves to '${resolved}', outside '${realRoot}'`,
      );
    }
    return { outDirectory: resolved };
  });
}

function writeAll(handle: number, bytes: Uint8Array): void {
  let written = 0;
  while (written < bytes.length) {
    written += writeSync(handle, bytes, written, bytes.length - written);
  }
}

/**
 * Create the output chain one level at a time, asserting realpath containment
 * after every level, so `mkdir` can never follow a symlinked component out of
 * the root (a recursive mkdir resolves hostile links silently).
 */
function materialiseContained(invokingGitRoot: string, outDirectory: string): void {
  const missing: string[] = [];
  let current = outDirectory;
  while (statNoFollow(current) === undefined) {
    missing.unshift(current);
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  assertPathWithinBase(current, invokingGitRoot);
  for (const level of missing) {
    mkdirSync(level);
    assertPathWithinBase(level, invokingGitRoot);
  }
}

function deepestExistingAncestor(candidate: string): string {
  let current = candidate;
  for (;;) {
    if (statNoFollow(current) !== undefined) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return current;
    }
    current = parent;
  }
}

function inspectKind(pathValue: string): Result<PublicationFileKind | undefined, Error> {
  return tryResult(() => {
    const stats = statNoFollow(pathValue);
    return stats === undefined ? undefined : kindOf(stats);
  });
}

function statNoFollow(pathValue: string): Stats | undefined {
  try {
    return lstatSync(pathValue);
  } catch (cause: unknown) {
    if (isErrnoException(cause) && cause.code === 'ENOENT') {
      return undefined;
    }
    throw cause;
  }
}

function kindOf(stats: Stats): PublicationFileKind {
  if (stats.isSymbolicLink()) {
    return 'symlink';
  }
  if (stats.isFile()) {
    return 'file';
  }
  return stats.isDirectory() ? 'directory' : 'other';
}

function isErrnoException(cause: unknown): cause is NodeJS.ErrnoException {
  return cause instanceof Error && 'code' in cause;
}

function tryResult<T>(operation: () => T): Result<T, Error> {
  try {
    return ok(operation());
  } catch (cause: unknown) {
    return err(cause instanceof Error ? cause : new Error(String(cause)));
  }
}

function tryVoid(operation: () => void): Result<void, Error> {
  return tryResult(operation);
}
