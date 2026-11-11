/**
 * An in-memory stand-in for a `(path) => Promise<string>` text-file reader.
 *
 * Tests inject it where a composition root injects `node:fs/promises`'s
 * `readFile`, so a reader's failure path is exercised without touching the
 * filesystem (testing-strategy.md §Philosophy: in-process tests use no IO).
 */

import { typeSafeEntries } from '@oaknational/type-helpers';

/**
 * Creates a reader over the given path-to-content table.
 *
 * @param files - The files the reader can see, keyed by path
 * @returns A reader that resolves with a listed file's content and rejects,
 *   as `fs` does, for a path not in the table
 */
export function createInMemoryFileReader(
  files: Readonly<Record<string, string>>,
): (path: string) => Promise<string> {
  const table = new Map<string, string>(typeSafeEntries(files));
  return (path) => {
    const content = table.get(path);
    if (content === undefined) {
      return Promise.reject(new Error(`ENOENT: no such file or directory, open '${path}'`));
    }
    return Promise.resolve(content);
  };
}
