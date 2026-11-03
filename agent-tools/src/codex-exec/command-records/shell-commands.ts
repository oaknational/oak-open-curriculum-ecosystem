import { interpreterScriptWords } from '../../shell/interpreter-script.js';
import { segmentCommand, type ShellWord } from '../../shell/shell-words.js';

/**
 * The commands a harness argv means, read through the estate's shell
 * segmenter (the Claude Bash guard's, under `src/shell`): the argv itself,
 * always; then every simple command of the script a shell in it is given
 * (`sh -c`, `bash -lc`, `bash -euo pipefail -c`, `/bin/zsh -lc`; every
 * operand of `eval` and `ssh`), each lifted through the same front door again;
 * and the body of every command substitution any word carries (`$(…)`, a
 * backtick pair, the substitutions of an unquoted here-document body), to a
 * bounded depth. The argv stays a command of its own so a shape before a
 * later interpreter operand is still read, as the guard reads it. The segmenter removes quotes
 * (`$'…'` included), drops `#` comments and here-document bodies, and reads a
 * redirection as its own word, so an option after or glued to one belongs to
 * its command.
 *
 * The interpreter is found anywhere in a segment, as the guard finds it: a
 * shell behind `sudo` is read, and so is `echo bash -c 'git push'`, which
 * lifts a command that never ran and fails closed. Only a script word with
 * whitespace in it is re-read, since a one-word script carries no two-word
 * shape. At the depth limit a segment is still a command, flag-scanned as it
 * stands, never dropped; each `eval` or `ssh` hop spends a level, so a longer
 * chain (`eval eval eval 'S'`, `ssh h ssh h ssh h 'S'`) is a residual.
 * Nothing is expanded: a word an expansion would produce, a shape behind
 * `xargs` or `find -exec`, a git alias and an abbreviated long option are
 * residuals of this reader.
 */

/** How deep a nested script or a substitution body is re-read: the argv, its script, a shell inside that script. */
const MAX_DEPTH = 3;

/** One command: its words after quote removal. */
export type Command = readonly string[];

/** A harness argv as shell words: already split, carrying no substitution. */
function wordsOf(argv: readonly string[]): readonly ShellWord[] {
  return argv.map((text) => ({ text, nested: [] }));
}

/** Every simple command of a script text, at the given depth. */
function commandsOfScript(script: string, depth: number): readonly Command[] {
  return segmentCommand(script).flatMap((segment) => commandsOfWords(segment, depth));
}

/**
 * The commands one segment of shell words means: itself, the commands of the
 * script a shell in it runs, and the commands of every substitution body its
 * words carry.
 */
function commandsOfWords(words: readonly ShellWord[], depth: number): readonly Command[] {
  const texts = words.map((word) => word.text);
  if (depth >= MAX_DEPTH) {
    return [texts];
  }
  const scripts = interpreterScriptWords(words).flatMap((script) =>
    commandsOfScript(script.text, depth + 1),
  );
  const substituted = words
    .flatMap((word) => word.nested)
    .flatMap((body) => commandsOfScript(body, depth + 1));
  return [texts, ...scripts, ...substituted];
}

/** The commands a harness argv means; an empty argv means none. */
export function commandsOf(argv: readonly string[]): readonly Command[] {
  return argv.length === 0 ? [] : commandsOfWords(wordsOf(argv), 0);
}

/** The commands a script text means: an interaction typed into a running shell, or a refused command line. */
export function commandsOfText(script: string): readonly Command[] {
  return commandsOfScript(script, 0);
}
