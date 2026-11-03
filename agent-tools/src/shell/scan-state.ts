import type { Heredoc } from './redirections.js';

/**
 * The scanner's state while it reads one command line: the segments closed
 * so far, the words of the open segment, the word being read with the
 * substitution bodies it carries, and the here-documents announced on the
 * line.
 */

/**
 * One shell word: its text after quote removal, and the bodies of any command
 * substitutions it carries (from unquoted or double-quoted text; a
 * single-quoted span is literal).
 */
export interface ShellWord {
  readonly text: string;
  readonly nested: readonly string[];
}

/** The scanner's mutable state over one command line; the segments closed so far are its result. */
export interface ScanState {
  readonly segments: ShellWord[][];
  words: ShellWord[];
  word: string;
  inWord: boolean;
  /** The last character of the word came from quoting or an escape, so it is text, never an operator's. */
  literal: boolean;
  nested: string[];
  heredocs: Heredoc[];
}

/** Close the word being read, if any, into the open segment with the substitution bodies it carries. */
export function endWord(state: ScanState): void {
  if (state.inWord) {
    state.words.push({ text: state.word, nested: state.nested });
  }
  state.word = '';
  state.inWord = false;
  state.literal = false;
  state.nested = [];
}

/** Close the word being read and the open segment; a segment with no words is not recorded. */
export function endSegment(state: ScanState): void {
  endWord(state);
  if (state.words.length > 0) {
    state.segments.push(state.words);
  }
  state.words = [];
}
