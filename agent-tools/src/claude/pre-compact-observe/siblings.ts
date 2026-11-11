/**
 * The sibling selection: which entries beside the transcript the observation
 * records.
 *
 * @remarks
 * The entries are sorted by name and capped, and the full count travels with
 * them, so a truncated listing never reads as complete.
 *
 * @packageDocumentation
 */

import { compareUtf16 } from '../../typescript-estate/utf16-order.js';

/** The most entries one observation records. */
const SIBLING_CAP = 24;

/** One entry in the transcript's directory. */
export interface SiblingEntry {
  /** The entry's name within the directory. */
  readonly name: string;
  /** What the entry is. */
  readonly kind: 'file' | 'directory' | 'symlink' | 'other';
  /** The size in bytes, for a file whose size was measured; absent otherwise. */
  readonly size?: number;
}

/** The recorded entries and the full count they were selected from. */
export interface SiblingSelection {
  /** The entries sorted by name, at most 24 of them. */
  readonly entries: readonly SiblingEntry[];
  /** How many entries the directory held; absent when it was not listed. */
  readonly count?: number;
}

/**
 * Select the sibling entries to record.
 *
 * @param listing - Every entry beside the transcript, or `undefined` when
 *   there was no transcript path or its directory could not be listed.
 * @returns The entries sorted by name and capped at 24, with the full count;
 *   for an unlisted directory, no entries and no count, because a count of 0
 *   would claim the directory was read and found empty.
 */
export function selectSiblings(listing: readonly SiblingEntry[] | undefined): SiblingSelection {
  if (listing === undefined) {
    return { entries: [] };
  }
  return {
    entries: listing.toSorted(byName).slice(0, SIBLING_CAP),
    count: listing.length,
  };
}

/** Order entries by name, in UTF-16 code-unit order so the result is locale-free. */
function byName(left: SiblingEntry, right: SiblingEntry): number {
  return compareUtf16(left.name, right.name);
}
