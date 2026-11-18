/**
 * Trim a trailing run of characters by predicate, as a string walk.
 *
 * @remarks
 * The regex form of this (`/[...]+$/`) is super-linear: on a string that
 * ends in a long run the class does not match, the engine retries the
 * quantified class from every position, which SonarCloud S8786 flags and
 * which `docs/governance/sonar-disposition-policy.md` §S8786 cures by a
 * rewrite to a string operation. One walk from the end is linear and
 * reads as what it is. Shared by the cited-path reader, the practice
 * fitness status reader and the workspace page renderer (one home at the
 * second consumer).
 *
 * @packageDocumentation
 */

/**
 * The text with every trailing character satisfying `isTrimmed` removed.
 *
 * @param text - The text to trim.
 * @param isTrimmed - True for a single-character string the trailing run may hold.
 * @returns `text` up to and including its last character `isTrimmed` refuses.
 */
export function trimEndWhile(text: string, isTrimmed: (character: string) => boolean): string {
  let end = text.length;
  while (end > 0 && isTrimmed(text.charAt(end - 1))) {
    end -= 1;
  }
  return text.slice(0, end);
}
