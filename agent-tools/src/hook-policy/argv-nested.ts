import { interpreterScriptWords } from '../shell/interpreter-script.js';
import type { ShellWord } from '../shell/shell-words.js';

/**
 * The nested commands a shell segment carries for the argument-aware
 * matcher: the bodies of its command substitutions, and the script a shell
 * interpreter in it is given (read by the shell topic's interpreter-script
 * module). Each is re-read as a command of its own, to a bounded depth.
 *
 * @packageDocumentation
 */

/** Re-reads one nested command text at the given depth. */
export type NestedMatcher = (command: string, depth: number) => boolean;

/** How deep a quoted script is re-read (`sh -c "bash -c '…'"`). */
const MAX_NESTED_SCAN_DEPTH = 2;

/** Whether a command substitution in the segment carries a matching command. */
export function substitutionInSegment(
  words: readonly ShellWord[],
  depth: number,
  matches: NestedMatcher,
): boolean {
  return (
    depth < MAX_NESTED_SCAN_DEPTH &&
    words.some((word) => word.nested.some((body) => matches(body, depth + 1)))
  );
}

/** Whether a script handed to a shell interpreter in the segment carries a matching command. */
export function interpreterScriptInSegment(
  words: readonly ShellWord[],
  depth: number,
  matches: NestedMatcher,
): boolean {
  return (
    depth < MAX_NESTED_SCAN_DEPTH &&
    interpreterScriptWords(words).some((word) => matches(word.text, depth + 1))
  );
}
