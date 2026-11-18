import type { EnvFileSystem } from '../../src/types.js';

/**
 * An in-memory {@link EnvFileSystem}: every key of `entries` is an absolute
 * path that exists, and its value is the text `readText` returns for it. A
 * marker that is a directory on a real disk (`.git`) is an entry whose text
 * is never read.
 */
export function createInMemoryFileSystem(entries: Readonly<Record<string, string>>): EnvFileSystem {
  return {
    exists: (path) => Object.hasOwn(entries, path),
    readText: (path) => entries[path],
  };
}
