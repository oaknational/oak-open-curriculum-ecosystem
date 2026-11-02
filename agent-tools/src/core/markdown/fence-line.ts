/**
 * A fenced-code line as CommonMark reads it, the one model the estate's
 * fence-aware readers share: an opener is three or more backticks or tildes
 * after up to three spaces of indent, followed by its info string; a
 * backtick opener's info string may not itself contain a backtick (which
 * keeps inline code from opening a block); a closer is the same character,
 * no shorter, with nothing but blanks after the run.
 *
 * The run is matched and the info string is read in code, so no quantifier
 * follows another it could overlap (SonarCloud S8786).
 *
 * @packageDocumentation
 */

/** The opening of a fence line: its indent, then a run of three or more backticks or tildes. */
const FENCE_OPENING = /^(?<indent> {0,3})(?<delimiter>`{3,}|~{3,})/u;

/** Leading spaces and tabs, the blanks a fence line may carry before its info string. */
const LEADING_BLANKS = /^[ \t]+/u;

/** A fence line read: its indent, its delimiter run and its info string (the rest, less its leading blanks). */
export interface FenceLine {
  readonly indent: string;
  readonly delimiter: string;
  readonly info: string;
}

/** The fence line `line` is, or undefined when it opens or closes no fence. */
export function fenceLineOf(line: string): FenceLine | undefined {
  const opening = FENCE_OPENING.exec(line);
  if (opening === null) {
    return undefined;
  }
  return {
    indent: opening.groups?.indent ?? '',
    delimiter: opening.groups?.delimiter ?? '',
    info: line.slice(opening[0].length).replace(LEADING_BLANKS, ''),
  };
}

/**
 * The fence `line` opens, or undefined when it opens none: a fence line
 * whose backtick run is followed by an info string holding a backtick is
 * inline code, not an opener.
 */
export function fenceOpenerOf(line: string): FenceLine | undefined {
  const fence = fenceLineOf(line);
  if (fence === undefined) {
    return undefined;
  }
  return fence.delimiter.startsWith('`') && fence.info.includes('`') ? undefined : fence;
}

/** True when `line` closes the fence `delimiter` opened: same character, no shorter, nothing after the run. */
export function closesFence(delimiter: string, line: string): boolean {
  const fence = fenceLineOf(line);
  if (fence?.info !== '') {
    return false;
  }
  return fence.delimiter.charAt(0) === delimiter.charAt(0) && fence.delimiter.length >= delimiter.length;
}
