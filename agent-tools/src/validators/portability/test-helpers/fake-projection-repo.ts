import { err, ok, type Result } from '@oaknational/result';

import {
  classifyDirectoryEntries,
  type DirectoryEntry,
  type DirectoryListing,
  type EntryRead,
} from '../directory-listing.js';
import type { RuleProjectionFs } from '../rule-projection-fs.js';

/** The in-memory repository the projection legs' cells run over. */
export type FakeProjectionRepo = RuleProjectionFs & { readonly files: Map<string, string> };

/**
 * The listing of `relDir` among the files, through the production classifier
 * (`classifyDirectoryEntries`): each first path segment under the directory is one entry, a
 * file when nothing lies below it and a directory otherwise, so a nested descendant makes
 * its directory the first foreign entry exactly as the real port reports it.
 */
function listingOf(
  files: ReadonlyMap<string, string>,
  relDir: string,
  extension: string,
): DirectoryListing {
  const children = new Map<string, boolean>();
  for (const file of files.keys()) {
    if (file.startsWith(`${relDir}/`)) {
      const [name = '', ...rest] = file.slice(relDir.length + 1).split('/');
      children.set(name, (children.get(name) ?? true) && rest.length === 0);
    }
  }
  if (children.size === 0) {
    return { kind: 'absent' };
  }
  const entries: DirectoryEntry[] = [...children].map(([name, isFile]) => ({
    name,
    isFile: () => isFile,
  }));
  return classifyDirectoryEntries(relDir, entries, extension);
}

/** A mutation the port applies, or refuses when the entry changed under it. */
function mutation(
  refusals: ReadonlySet<string>,
  relPath: string,
  refusal: string,
  apply: () => void,
): Result<undefined, string> {
  if (refusals.has(relPath)) {
    return err(`${relPath}: ${refusal}`);
  }
  apply();
  return ok(undefined);
}

/**
 * An in-memory repository keyed by repo-relative path for the projection legs' cells; every
 * write and removal is applied. A directory exists when any path lies under it; `listings`
 * overrides what listing it yields, `reads` what reading a path yields (a foreign or
 * unreadable entry), and `refusals` the mutations the port refuses (the entry changed under
 * it).
 */
export function fakeProjectionRepo(
  initial: ReadonlyMap<string, string>,
  listings: ReadonlyMap<string, DirectoryListing> = new Map(),
  reads: ReadonlyMap<string, EntryRead> = new Map(),
  refusals: ReadonlySet<string> = new Set(),
): FakeProjectionRepo {
  const files = new Map(initial);
  return {
    files,
    listDirectory: async (relDir, extension) =>
      listings.get(relDir) ?? listingOf(files, relDir, extension),
    readEntry: async (relPath) => {
      const override = reads.get(relPath);
      if (override !== undefined) {
        return override;
      }
      const text = files.get(relPath);
      return text === undefined ? { kind: 'absent' } : { kind: 'text', text };
    },
    writeText: async (relPath, text) =>
      mutation(
        refusals,
        relPath,
        'not a regular file at the moment of the write; refusing the projection write',
        () => files.set(relPath, text),
      ),
    removeFile: async (relPath) =>
      mutation(
        refusals,
        relPath,
        'not a regular file at the moment of the removal; refusing to remove it',
        () => files.delete(relPath),
      ),
  };
}
