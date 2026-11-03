import { citationsInWords, type ScriptCitation } from './extract-script-citations.js';
import { shellLex, type ShellToken } from './shell-lexer.js';

/**
 * The `pnpm` citations in one shell command line, read as the shell reads
 * it. Prose citations keep the permissive reader in
 * `extract-script-citations.ts`; a command surface is run by a shell, so its
 * quotes are removed, and an operator or a comment counts only where it is
 * unquoted. Each simple command is read on its own: one that `echo` or
 * `printf` runs prints its words rather than running them, and the argument
 * of `sh -c`, `bash -c` or `zsh -c` is itself a command line. So is the body
 * of a command substitution, which the shell runs wherever it stands, even
 * in a word `echo` prints.
 *
 * @packageDocumentation
 */

/** Commands whose arguments are printed text, so a `pnpm` among them is not run. */
const HINT_COMMANDS: ReadonlySet<string> = new Set(['echo', 'printf']);
/** Shells whose `-c` argument is a command line of its own. */
const SHELLS: ReadonlySet<string> = new Set(['sh', 'bash', 'zsh']);
/** A short-option cluster that carries `-c` (`-c`, `-lc`, `-ec`). */
const SHELL_COMMAND_FLAG = /^-[A-Za-z]*c[A-Za-z]*$/;
/** A variable assignment ahead of a command's name (`CI=1 pnpm …`). */
const ASSIGNMENT = /^[A-Za-z_]\w*=/;
/** Reserved words and `!` that can stand ahead of a command's name (`if bash -c …`, `then pnpm …`). */
const CONTROL_PREFIXES: ReadonlySet<string> = new Set([
  '!',
  '{',
  'if',
  'then',
  'else',
  'elif',
  'while',
  'until',
  'do',
  'time',
]);

/** The simple commands of a token list: the words between operators. */
function simpleCommands(tokens: readonly ShellToken[]): readonly (readonly string[])[] {
  const commands: string[][] = [[]];
  for (const token of tokens) {
    if (token.kind === 'operator') {
      commands.push([]);
    } else {
      commands.at(-1)?.push(token.text);
    }
  }
  return commands.filter((words) => words.length > 0);
}

/**
 * The index of a simple command's name: past assignments, control words, and
 * the options `time` takes (`time -p bash -c …`).
 */
function commandNameIndex(words: readonly string[]): number {
  let index = 0;
  let timing = false;
  for (const word of words) {
    const timeOption: boolean = timing && word.startsWith('-');
    if (!ASSIGNMENT.test(word) && !CONTROL_PREFIXES.has(word) && !timeOption) {
      break;
    }
    timing = word === 'time' || timeOption;
    index += 1;
  }
  return index;
}

function citationsInSimpleCommand(
  words: readonly string[],
  line: number,
): readonly ScriptCitation[] {
  const start = commandNameIndex(words);
  const name = words[start];
  if (name === undefined || HINT_COMMANDS.has(name)) {
    return [];
  }
  const commandFlag = SHELLS.has(name)
    ? words.findIndex((word, index) => index > start && SHELL_COMMAND_FLAG.test(word))
    : -1;
  if (commandFlag !== -1) {
    const script = words[commandFlag + 1];
    return script === undefined ? [] : citationsInShellCommand(script, line);
  }
  return citationsInWords(words, line);
}

/**
 * The `pnpm` script citations in one line of shell command text, numbered
 * `line`.
 *
 * @param text - One command line, continuations already joined.
 * @param line - The line it starts on.
 * @returns The citations in the line's command substitutions, then those in its simple
 *   commands, in order.
 */
export function citationsInShellCommand(text: string, line: number): readonly ScriptCitation[] {
  const { tokens, substitutions } = shellLex(text);
  return [
    ...substitutions.flatMap((body) => citationsInShellCommand(body, line)),
    ...simpleCommands(tokens).flatMap((words) => citationsInSimpleCommand(words, line)),
  ];
}
