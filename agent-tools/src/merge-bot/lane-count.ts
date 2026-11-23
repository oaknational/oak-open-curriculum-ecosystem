/**
 * The count the open limit is read against. Pure.
 *
 * A lane is an open pull request by one of the authors a clone counts as its
 * own, on a branch that is not a coordination branch. The limit is on a
 * clone's own work in progress: a repository shared with other people holds
 * their pull requests too, and those are not this clone's lanes.
 */

/** One open pull request as the lane count reads it: its head ref and its author's login. */
export interface OpenEntry {
  readonly ref: string;
  /** Undefined for an author whose account is gone. */
  readonly author: string | undefined;
}

/** Head refs with this prefix are coordination branches, not lanes, and are not counted. */
const COORDINATION_PREFIX = 'coordination/';

/**
 * How many of the open pull requests are lanes of the counted authors.
 *
 * @param entries - Every open pull request of the repository.
 * @param laneAuthors - The GitHub logins to count, compared without regard
 *   to case; an app's login carries its `[bot]` suffix.
 * @returns The count. A pull request whose author's account is gone is
 *   nobody's and is not counted.
 */
export function laneCount(entries: readonly OpenEntry[], laneAuthors: readonly string[]): number {
  const counted = new Set(laneAuthors.map((login) => login.toLowerCase()));
  return entries.filter(
    (entry) =>
      !entry.ref.startsWith(COORDINATION_PREFIX) &&
      entry.author !== undefined &&
      counted.has(entry.author.toLowerCase()),
  ).length;
}
