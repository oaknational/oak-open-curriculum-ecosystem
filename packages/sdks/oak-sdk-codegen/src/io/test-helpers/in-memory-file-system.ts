/**
 * An in-memory {@link FileSystemPort} for in-process tests.
 *
 * @remarks
 * Paths are absolute strings normalised with `node:path`, so the fake keys its
 * entries the same way the product code builds them on the running platform.
 * The root directory always exists; every other directory exists only once
 * `mkdir` created it or a seeded file implied it. A write into a directory
 * that does not exist rejects with `ENOENT`, as `node:fs` does, so a product
 * path that forgets its `mkdir` fails here rather than only on disk. The fake
 * performs no IO (`principles.md` §Testing).
 *
 * @packageDocumentation
 */

import { basename, dirname, isAbsolute, normalize, parse, sep } from 'node:path';

import { typeSafeEntries } from '../../types/helpers/type-helpers.js';
import type { DirectoryEntry, FileSystemPort } from '../file-system-port.js';

/** The fake, plus read access to its state for assertions. */
export interface InMemoryFileSystem extends FileSystemPort {
  /** Every file's content, keyed by normalised absolute path. */
  readonly files: ReadonlyMap<string, string>;
  /** Every directory that exists, keyed by normalised absolute path. */
  readonly directories: ReadonlySet<string>;
}

/** The fake's state: file contents and the directories that exist. */
interface FileSystemState {
  readonly files: Map<string, string>;
  readonly directories: Set<string>;
}

/** Builds the error `node:fs` raises for a missing path. */
function missingPathError(syscall: string, path: string): Error {
  return Object.assign(new Error(`ENOENT: no such file or directory, ${syscall} '${path}'`), {
    code: 'ENOENT',
  });
}

/** Normalises an absolute path and strips any trailing separator below the root. */
function normalisePath(path: string): string {
  if (!isAbsolute(path)) {
    throw new Error(`The in-memory file system takes absolute paths; received '${path}'.`);
  }
  const normalised = normalize(path);
  const { root } = parse(normalised);
  return normalised.length > root.length && normalised.endsWith(sep)
    ? normalised.slice(0, -sep.length)
    : normalised;
}

/** Creates a directory and every missing ancestor. */
function makeDirectory(state: FileSystemState, path: string): void {
  let current = normalisePath(path);
  while (!state.directories.has(current)) {
    state.directories.add(current);
    const parent = dirname(current);
    if (parent === current) {
      return;
    }
    current = parent;
  }
}

/** Writes a file into an existing directory; throws `ENOENT` when the parent is absent. */
function putFile(state: FileSystemState, path: string, content: string): void {
  const target = normalisePath(path);
  if (!state.directories.has(dirname(target))) {
    throw missingPathError('open', target);
  }
  state.files.set(target, content);
}

/** Lists a directory's direct children, directories first; throws `ENOENT` when it is absent. */
function readDirectory(state: FileSystemState, path: string): readonly DirectoryEntry[] {
  const directory = normalisePath(path);
  if (!state.directories.has(directory)) {
    throw missingPathError('scandir', directory);
  }
  const isChild = (candidate: string): boolean =>
    candidate !== directory && dirname(candidate) === directory;
  const directoryEntries = [...state.directories]
    .filter((candidate) => isChild(candidate))
    .map((candidate): DirectoryEntry => ({ name: basename(candidate), kind: 'directory' }));
  const fileEntries = [...state.files.keys()]
    .filter((candidate) => isChild(candidate))
    .map((candidate): DirectoryEntry => ({ name: basename(candidate), kind: 'file' }));
  return [...directoryEntries, ...fileEntries];
}

/**
 * Creates an empty in-memory file system, optionally seeded with files whose
 * parent directories are created implicitly.
 *
 * @param seed - Files to create before the test runs, keyed by absolute path
 */
export function createInMemoryFileSystem(
  seed: Readonly<Record<string, string>> = {},
): InMemoryFileSystem {
  const state: FileSystemState = {
    files: new Map<string, string>(),
    directories: new Set<string>([normalisePath(sep)]),
  };
  for (const [path, content] of typeSafeEntries(seed)) {
    makeDirectory(state, dirname(normalisePath(path)));
    putFile(state, path, content);
  }
  return {
    files: state.files,
    directories: state.directories,
    readFile: (path) => {
      const content = state.files.get(normalisePath(path));
      return content === undefined
        ? Promise.reject(missingPathError('open', path))
        : Promise.resolve(content);
    },
    writeFile: (path, content) => {
      putFile(state, path, content);
      return Promise.resolve();
    },
    mkdir: (path) => {
      makeDirectory(state, path);
      return Promise.resolve();
    },
    readdir: (path) => Promise.resolve(readDirectory(state, path)),
    copyFile: async (from, to) => {
      const content = state.files.get(normalisePath(from));
      if (content === undefined) {
        throw missingPathError('copyfile', from);
      }
      putFile(state, to, content);
    },
  };
}
