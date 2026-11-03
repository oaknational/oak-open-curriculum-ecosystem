/**
 * Operator profile — the root layout. Pure: the CLI lists the root and the
 * scoped directories, this module says what each entry must be.
 */

import { type ProfileDocumentExpectation } from './operator-profile-document.js';
import { machineKeyFromRelPath, scopeKeyFromRelPath } from './operator-profile-keys.js';
import { INDEX_FILE_NAME, MACHINES_DIR_NAME, SCOPES_DIR_NAME } from './operator-profile-schema.js';

/**
 * What a listing entry is, read without following links: a symlink is a
 * symlink, never the file or directory it points at.
 */
export type ProfileEntryKind = 'file' | 'directory' | 'symlink' | 'other';

/** One entry of a profile root listing, as the CLI reads it. */
export interface ProfileEntry {
  /** Path relative to the profile root, `/`-separated. */
  readonly relPath: string;
  readonly kind: ProfileEntryKind;
}

export interface ProfileLayout {
  /** Documents to validate, with their layout expectations. */
  readonly documents: readonly ProfileDocumentExpectation[];
  /** Entries the layout does not name (a finding each). */
  readonly unexpected: readonly string[];
  /** Symlinks and special entries: never a document, never read (a finding each). */
  readonly notRegular: readonly string[];
}

/**
 * Entries a git-synced profile root carries that are not profile documents.
 * The Practice never creates them; it only refrains from calling them
 * unexpected.
 */
const GIT_FURNITURE = ['.git', '.gitignore', '.gitattributes'] as const;

const SCOPED_DIRS = [SCOPES_DIR_NAME, MACHINES_DIR_NAME] as const;

/** Zero-widening membership: the literal vocabulary decides, never a `string` view of it. */
function isGitFurniture(relPath: string): relPath is (typeof GIT_FURNITURE)[number] {
  return GIT_FURNITURE.some((name) => name === relPath);
}

function isScopedDir(relPath: string): relPath is (typeof SCOPED_DIRS)[number] {
  return SCOPED_DIRS.some((name) => name === relPath);
}

type EntryClass =
  | { readonly kind: 'document'; readonly expectation: ProfileDocumentExpectation }
  | { readonly kind: 'furniture' }
  | { readonly kind: 'unexpected' }
  | { readonly kind: 'not-regular' };

function classifyDirectory(relPath: string): EntryClass {
  return isScopedDir(relPath) || isGitFurniture(relPath)
    ? { kind: 'furniture' }
    : { kind: 'unexpected' };
}

function classifyFile(relPath: string): EntryClass {
  if (relPath === INDEX_FILE_NAME) {
    return { kind: 'document', expectation: { relPath, expectedKind: 'index' } };
  }
  if (isGitFurniture(relPath)) {
    return { kind: 'furniture' };
  }
  const scopeKey = scopeKeyFromRelPath(relPath);
  if (scopeKey !== undefined) {
    return {
      kind: 'document',
      expectation: { relPath, expectedKind: 'scope', expectedKey: scopeKey },
    };
  }
  const machineKey = machineKeyFromRelPath(relPath);
  if (machineKey !== undefined) {
    return {
      kind: 'document',
      expectation: { relPath, expectedKind: 'machine', expectedKey: machineKey },
    };
  }
  return { kind: 'unexpected' };
}

/** Only a regular file or directory is classified by name; anything else is refused by kind. */
function classifyEntry(entry: ProfileEntry): EntryClass {
  if (entry.kind === 'directory') {
    return classifyDirectory(entry.relPath);
  }
  if (entry.kind === 'file') {
    return classifyFile(entry.relPath);
  }
  return { kind: 'not-regular' };
}

/**
 * Classify a profile root listing against the layout the PDR names:
 * `index.md`, `repos/<scope-key>.md` and `machines/<machine-key>.md`, plus
 * the git furniture a synced root carries. Anything else is unexpected, and
 * a symlink or special entry at any position is not regular: it is never a
 * document, whatever its name, so nothing is ever read through it. The
 * listing is shallow for the root and one level deep for `repos/` and
 * `machines/`; the caller supplies every level.
 *
 * @param entries - the root's entries and the scoped directories' entries, relative paths
 * @returns the documents to validate, the unexpected entries and the entries that are not regular
 */
export function classifyProfileEntries(entries: readonly ProfileEntry[]): ProfileLayout {
  const documents: ProfileDocumentExpectation[] = [];
  const unexpected: string[] = [];
  const notRegular: string[] = [];
  for (const entry of entries) {
    const classified = classifyEntry(entry);
    if (classified.kind === 'document') {
      documents.push(classified.expectation);
    } else if (classified.kind === 'unexpected') {
      unexpected.push(entry.relPath);
    } else if (classified.kind === 'not-regular') {
      notRegular.push(entry.relPath);
    }
  }
  return { documents, unexpected, notRegular };
}
