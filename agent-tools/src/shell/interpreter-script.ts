import type { ShellWord } from './shell-words.js';

/**
 * The scripts a shell interpreter in a segment is given: for the sh-like
 * shells, every operand with whitespace in it after an option cluster
 * carrying `c` (`-c`, `-lc`, `+c`, `+xc`, ksh's `-e+c`); for `eval` and
 * `ssh`, the later operands joined into one command. Shared by the Claude
 * Bash guard's argument matcher and the Codex seat-rollout reader.
 *
 * Residuals, which neither reader follows: a script built from unquoted
 * positional words (`bash -c '"$@"' _ git push`), since no one word of it
 * carries whitespace; a script on standard input (`bash <<< 'S'`, a
 * here-document or a pipe into a shell, `bash -s`); interpreters outside the
 * set (ash, mksh, fish, csh, `su -c`, `env -S`); a one-word script an
 * expansion turns into a command (`{git,push}`, `git${IFS}push`); and zsh's
 * digit clusters (`-1c`).
 *
 * @packageDocumentation
 */

/** The last path segment of a command word (`/bin/rm` is `rm`). */
export function basename(text: string): string {
  const separator = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'));
  return text.slice(separator + 1).replace(/\.(?:exe|cmd)$/iu, '');
}

/** Shell interpreters whose quoted argument is a script and so is read as a nested command. */
const SHELL_INTERPRETERS: ReadonlySet<string> = new Set([
  'sh',
  'bash',
  'zsh',
  'dash',
  'ksh',
  'eval',
  'ssh',
]);

/** Interpreters that read every operand as their script (`eval a b`, `ssh host cmd`). */
const SCRIPT_OPERAND_INTERPRETERS: ReadonlySet<string> = new Set(['eval', 'ssh']);

/** A word with whitespace in it can only come from quoting or escaping: handed to an interpreter, it is a script. */
function isScriptWord(word: ShellWord): boolean {
  return /\s/u.test(word.text);
}

const ASSIGNMENT = /^[A-Za-z_]\w*=/u;

/** Whether a word is an assignment (`KEY=value`), which names no command. */
export function isAssignment(text: string): boolean {
  return ASSIGNMENT.test(text);
}

/** The index of the first word naming an interpreter of the given kind. An assignment in the leading run of assignments (`GIT_SSH=/usr/bin/ssh bash …`) names none; a later word shaped like one is a command path (`nice a=x/bash -c …`). */
function firstInterpreter(words: readonly ShellWord[], operands: boolean): number {
  const leading = words.findIndex((word) => !isAssignment(word.text));
  const assignments = leading === -1 ? words.length : leading;
  return words.findIndex((word, index) => {
    const name = basename(word.text);
    return (
      index >= assignments &&
      SHELL_INTERPRETERS.has(name) &&
      SCRIPT_OPERAND_INTERPRETERS.has(name) === operands
    );
  });
}

/**
 * The words an interpreter in the segment reads as its scripts, each with
 * whitespace in it (a one-word script carries no command with an argument):
 * for the first sh-like shell, every such operand after the option cluster
 * carrying `c`, since the shell reads options after it (`-o posix`,
 * `+x`, `--`) and a later operand can be a script that the first one runs
 * (`'eval "$1"' _ 'S'`); for the first `eval` or `ssh`, its later operands
 * joined into the one command they run. Both kinds are read, so a word that
 * only carries an interpreter's name (`sudo -u ssh bash -c …`) hides no
 * shell after it. A path handed to `bash` without `-c` is a file, not source
 * text.
 */
export function interpreterScriptWords(words: readonly ShellWord[]): readonly ShellWord[] {
  const shell = firstInterpreter(words, false);
  const rest = shell === -1 ? [] : words.slice(shell + 1);
  const commandFlag = rest.findIndex((word) => isCommandFlagCluster(word.text));
  const scripts = commandFlag === -1 ? [] : rest.slice(commandFlag + 1);
  const operand = firstInterpreter(words, true);
  const joined =
    operand === -1
      ? []
      : joinedOperands(words.slice(operand + 1), basename(words[operand]?.text ?? '') === 'ssh');
  return [...scripts, ...joined].filter(isScriptWord);
}

/** The ssh options that take a value, so the word after one of them is not the host. */
const SSH_VALUE_OPTIONS: ReadonlySet<string> = new Set([...'BbcDEeFIiJLlmOoPpQRSWw']);
const SSH_CLUSTER = /^-[A-Za-z0-9]+$/u;

/** Whether an ssh option word takes the next word as its value: the cluster's first option that takes a value is its last letter. An earlier one takes the rest of the word as its value (`-p22`, `-ljoe`), so nothing more is taken. */
function takesNextWord(text: string): boolean {
  if (!SSH_CLUSTER.test(text)) {
    return false;
  }
  const letters = [...text.slice(1)];
  return letters.findIndex((letter) => SSH_VALUE_OPTIONS.has(letter)) === letters.length - 1;
}

/** The index of ssh's host: the first word past its options. */
function sshHostIndex(rest: readonly ShellWord[]): number {
  let index = 0;
  while (index < rest.length) {
    const text = rest[index]?.text ?? '';
    if (text === '--') {
      return index + 1;
    }
    if (!text.startsWith('-')) {
      return index;
    }
    index += takesNextWord(text) ? 2 : 1;
  }
  return index;
}

/** Words joined with a blank into the one command line they make, their substitution bodies carried together; none when there are no words. */
function joined(words: readonly ShellWord[]): readonly ShellWord[] {
  if (words.length === 0) {
    return [];
  }
  return [
    {
      text: words.map((word) => word.text).join(' '),
      nested: words.flatMap((word) => word.nested),
    },
  ];
}

/**
 * The one script `eval` or `ssh` runs: `eval` joins every operand into one
 * command; `ssh` joins every word after its options and host. Quoted or not,
 * the operands become one command line. A host that carries an
 * interpreter's name may be the real command, the word before it having
 * only carried ssh's name (`sudo -u ssh ssh host …`), so that reading is
 * read as well.
 */
function joinedOperands(rest: readonly ShellWord[], skipHost: boolean): readonly ShellWord[] {
  if (!skipHost) {
    return joined(rest);
  }
  const host = sshHostIndex(rest);
  const command = joined(rest.slice(host + 1));
  const hostNamesInterpreter = SHELL_INTERPRETERS.has(basename(rest[host]?.text ?? ''));
  return hostNamesInterpreter ? [...joined(rest.slice(host)), ...command] : command;
}

/** A sign, a letter, then letters or further signs: an option cluster (`-lc`, `+xc`, ksh's `-e+c`), read in one pass so its cost is linear in the word. */
const OPTION_CLUSTER = /^[-+][A-Za-z][A-Za-z+]*$/u;

/** An option cluster carrying `c`, which hands the shell its script. */
function isCommandFlagCluster(text: string): boolean {
  return OPTION_CLUSTER.test(text) && text.includes('c');
}
