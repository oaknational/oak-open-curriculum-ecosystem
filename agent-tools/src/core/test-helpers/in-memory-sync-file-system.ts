/**
 * An in-memory {@link SyncFileSystem} over a literal tree, for proving the
 * modules that probe paths without a disk. Files, directories and symbolic
 * links are given as absolute paths; every ancestor of a given path is a
 * directory. Links resolve as the real file system resolves them: `exists`,
 * `isDirectory`, `readText`, `list` and `realpath` follow them and
 * `isSymbolicLink` does not. Failures carry the `code` Node's `fs` attaches.
 */
import { basename, dirname, sep } from 'node:path';

import type { SyncFileSystem } from '../sync-file-system.js';
import { typeSafeEntries } from '@oaknational/type-helpers';

export interface InMemoryTree {
  /** Files by absolute path, with their text. */
  readonly files?: Readonly<Record<string, string>>;
  /** Directories by absolute path, beyond those implied as ancestors. */
  readonly directories?: readonly string[];
  /** Symbolic links, each from its own absolute path to the path it names. */
  readonly links?: Readonly<Record<string, string>>;
}

const MAX_LINK_HOPS = 32;

function errnoError(code: string, path: string): Error {
  return Object.assign(new Error(`${code}: ${path}`), { code });
}

/** Every directory above a path, up to and including the root. */
function ancestorsOf(path: string): string[] {
  const ancestors: string[] = [];
  let directory = dirname(path);
  while (directory !== ancestors.at(-1)) {
    ancestors.push(directory);
    directory = dirname(directory);
  }
  return ancestors;
}

/** The path with every symbolic link along it replaced by its target. */
function followLinks(path: string, links: ReadonlyMap<string, string>): string {
  let resolved = path;
  for (let hop = 0; hop < MAX_LINK_HOPS; hop += 1) {
    const linkPath = [...links.keys()].find(
      (candidate) => resolved === candidate || resolved.startsWith(`${candidate}${sep}`),
    );
    if (linkPath === undefined) {
      return resolved;
    }
    resolved = `${links.get(linkPath) ?? ''}${resolved.slice(linkPath.length)}`;
  }
  throw errnoError('ELOOP', path);
}

export function inMemorySyncFileSystem(tree: InMemoryTree): SyncFileSystem {
  const files = new Map(typeSafeEntries(tree.files ?? {}));
  const links = new Map(typeSafeEntries(tree.links ?? {}));
  const directories = new Set(tree.directories ?? []);
  for (const path of [...files.keys(), ...links.keys(), ...directories]) {
    for (const ancestor of ancestorsOf(path)) {
      directories.add(ancestor);
    }
  }
  const resolve = (path: string): string => followLinks(path, links);
  const present = (resolved: string): boolean => files.has(resolved) || directories.has(resolved);
  const entries = new Set([...files.keys(), ...directories, ...links.keys()]);

  return {
    exists: (path) => present(resolve(path)),
    isDirectory: (path) => directories.has(resolve(path)),
    isSymbolicLink: (path) => links.has(path),
    readText: (path) => {
      const text = files.get(resolve(path));
      if (text === undefined) {
        throw errnoError('ENOENT', path);
      }
      return text;
    },
    list: (path) => {
      const resolved = resolve(path);
      if (!directories.has(resolved)) {
        throw errnoError(files.has(resolved) ? 'ENOTDIR' : 'ENOENT', path);
      }
      return [...entries]
        .filter((entry) => entry !== resolved && dirname(entry) === resolved)
        .map((entry) => basename(entry))
        .sort((left, right) => left.localeCompare(right));
    },
    realpath: (path) => {
      const resolved = resolve(path);
      if (!present(resolved)) {
        throw errnoError('ENOENT', path);
      }
      return resolved;
    },
  };
}
