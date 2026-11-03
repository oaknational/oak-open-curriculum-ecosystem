import { decodeAnsiCQuoted } from './ansi-c-quotes.js';
import {
  continuesRedirection,
  isRedirectionPart,
  readHeredocOperator,
  skipHeredocBodies,
} from './redirections.js';
import { endSegment, endWord, type ScanState, type ShellWord } from './scan-state.js';
import { findBacktickClose, findSubstitutionClose } from './substitution-bounds.js';

/**
 * Shell-word segmentation for the argument-aware Bash-guard matcher and the
 * Codex seat-rollout reader.
 *
 * Splits a command line into simple-command segments of words the way a
 * shell would read it far enough for option matching. What the words are:
 * the literal text after quote removal (`rm '-rf' dir` gives `rm` the word
 * `-rf`, exactly as the shell does; the ANSI-C `$'…'` form is a quote whose
 * escapes are decoded), with a backslash escaping the next character (inside
 * double quotes only the characters bash lets it escape) and a
 * backslash-newline continuing the line; a command substitution (`$(…)` or
 * a backtick pair), unquoted or inside double quotes, stays inside its word
 * and its body — balanced past quoted and escaped parentheses — is carried
 * alongside as a nested command; a comment from an unquoted `#` at a word
 * start is dropped. What ends a segment: the
 * command-list and pipeline operators (`&&`, `||`, `|`, `|&`, `;`, `&`), a
 * newline, and a bare sub-shell or group parenthesis, so an option is only
 * ever read against the command in its own segment. The `&` or `|` of a
 * redirection (`2>&1`, `&>log`, `>|file`) stays inside its word: the shell
 * removes a redirection before the command runs, so an option after it
 * still belongs to the same command; and an unquoted `<`, `>` or `&>` after
 * an ordinary word opens a new word, as the shell reads it, so `-rf>/dev/null`
 * is `-rf` then `>/dev/null` and an option glued to a redirection is still
 * the option. A here-document body is the command's
 * data, not commands, and is dropped — except the substitutions the shell
 * runs inside a body whose delimiter is unquoted, kept as nested commands.
 *
 * What the scanner does not do, by design: expand variables or tildes,
 * resolve aliases or shell functions, or read a script arriving on stdin.
 * A word it produces is what a command would see in `argv` only when no
 * expansion intervenes.
 *
 * @packageDocumentation
 */

export type { ShellWord } from './scan-state.js';

const TWO_CHAR_OPERATORS: readonly string[] = ['&&', '||', '|&'];
const ONE_CHAR_OPERATORS: ReadonlySet<string> = new Set(['|', ';', '&', '\n', '(', ')']);
/** The characters a redirection operator is made of; a `&` here is one `isRedirectionPart` kept. */
const REDIRECTION_CHARACTERS: ReadonlySet<string> = new Set(['<', '>', '&']);

/** The characters a backslash escapes inside double quotes; before any other it is literal. */
const DOUBLE_QUOTE_ESCAPABLE: ReadonlySet<string> = new Set(['$', '`', '"', '\\', '\n']);

/** Consume one character of a double-quoted span at `index`, honouring bash's escape and substitution rules. */
function readDoubleQuotedAt(command: string, index: number, state: ScanState): number {
  const char = command[index] ?? '';
  if (char === '\\' && DOUBLE_QUOTE_ESCAPABLE.has(command[index + 1] ?? '')) {
    return readEscape(command, index, state);
  }
  if (command.startsWith('$(', index) || char === '`') {
    return readSubstitution(command, index, state);
  }
  state.word += char;
  return index + 1;
}

/**
 * Read a quoted span opened at `start`; returns the index just past the
 * closing quote (or the end of the line when the quote is unterminated). A
 * single-quoted span is literal; inside double quotes a backslash escapes
 * the characters bash lets it escape, and a command substitution is read
 * as it would be unquoted, so its body is carried as a nested command.
 */
function readQuoted(command: string, start: number, quote: string, state: ScanState): number {
  let index = start + 1;
  while (index < command.length && command[index] !== quote) {
    if (quote === '"') {
      index = readDoubleQuotedAt(command, index, state);
    } else {
      state.word += command[index] ?? '';
      index += 1;
    }
  }
  state.inWord = true;
  state.literal = true;
  return index + 1;
}

/** A backslash before a newline is a line continuation: both vanish before the shell reads a word. */
function readEscape(command: string, index: number, state: ScanState): number {
  const escaped = command[index + 1] ?? '';
  if (escaped !== '\n') {
    state.word += escaped;
    state.inWord = true;
    state.literal = true;
  }
  return index + 2;
}

/**
 * Read a command substitution — `$(…)` or a backtick pair — keeping its full
 * text inside the current word and carrying its body as a nested command.
 */
function readSubstitution(command: string, index: number, state: ScanState): number {
  const isDollar = command.startsWith('$(', index);
  const bodyStart = isDollar ? index + 2 : index + 1;
  const close = isDollar
    ? findSubstitutionClose(command, index + 1)
    : findBacktickClose(command, bodyStart);
  const body = command.slice(bodyStart, close);
  // Inside a backtick pair an escaped backtick is a nested substitution's
  // delimiter; the body is read with those unescaped, as the shell does.
  state.nested.push(isDollar ? body : body.replaceAll('\\`', '`'));
  state.word += command.slice(index, close + 1);
  state.inWord = true;
  state.literal = false;
  return close + 1;
}

function readComment(command: string, index: number): number {
  const newline = command.indexOf('\n', index);
  return newline === -1 ? command.length : newline;
}

/** Consume a here-document operator, or the bodies pending at a newline; `null` when neither is at `index`. */
function scanHeredoc(command: string, index: number, state: ScanState): number | null {
  if (command[index] === '\n' && state.heredocs.length > 0) {
    endWord(state);
    const nested: string[] = [];
    const next = skipHeredocBodies(command, index, state.heredocs, nested);
    state.heredocs = [];
    if (nested.length > 0) {
      state.words.push({ text: '<<', nested });
    }
    endSegment(state);
    return next;
  }
  const operator = readHeredocOperator(command, index);
  if (operator === null) {
    return null;
  }
  const [heredoc, next] = operator;
  state.heredocs.push(heredoc);
  // The operator is its own token, so `rm<<EOT -rf` is `rm` `<<EOT` `-rf`.
  endWord(state);
  state.words.push({ text: (heredoc.stripTabs ? '<<-' : '<<') + heredoc.delimiter, nested: [] });
  return next;
}

/** The word being read so far; empty at a word start. Read only at an operator, since each read flattens the growing word. */
function currentWord(state: ScanState): string {
  return state.inWord ? state.word : '';
}

/** The last character of the word being read as an operator's character: empty at a word start or after quoted or escaped text. */
function lastCharacter(state: ScanState): string {
  return state.literal ? '' : currentWord(state).slice(-1);
}

/** Consume an operator or a substitution at `index`; `null` when the text there is neither. */
function scanOperator(command: string, index: number, state: ScanState): number | null {
  const char = command[index] ?? '';
  if (TWO_CHAR_OPERATORS.includes(command.slice(index, index + 2))) {
    endSegment(state);
    return index + 2;
  }
  if (command.startsWith('$(', index) || char === '`') {
    return readSubstitution(command, index, state);
  }
  if (ONE_CHAR_OPERATORS.has(char) && !isRedirectionPart(command, index, lastCharacter(state))) {
    endSegment(state);
    return index + 1;
  }
  endWordBeforeRedirection(char, state);
  return null;
}

/** Before a redirection character an ordinary word ends; an IO number, a lone `&` or an operator so far continues, unless quoted or escaped text wrote it. */
function endWordBeforeRedirection(char: string, state: ScanState): void {
  if (!REDIRECTION_CHARACTERS.has(char)) {
    return;
  }
  if (state.literal || !continuesRedirection(currentWord(state))) {
    endWord(state);
  }
}

/** Consume a quoted span (including the ANSI-C `$'…'` form) or an escape at `index`; `null` when the text there is neither. */
function scanQuoting(command: string, index: number, state: ScanState): number | null {
  if (command.startsWith("$'", index)) {
    const [text, next] = decodeAnsiCQuoted(command, index);
    state.word += text;
    state.inWord = true;
    state.literal = true;
    return next;
  }
  const char = command[index] ?? '';
  if (char === '"' || char === "'") {
    return readQuoted(command, index, char, state);
  }
  return char === '\\' ? readEscape(command, index, state) : null;
}

/** Consume the text at `index` and return the index of the next unread character. */
function scanAt(command: string, index: number, state: ScanState): number {
  const consumed =
    scanHeredoc(command, index, state) ??
    scanOperator(command, index, state) ??
    scanQuoting(command, index, state);
  if (consumed !== null) {
    return consumed;
  }
  const char = command[index] ?? '';
  if (char === '#' && !state.inWord) {
    return readComment(command, index);
  }
  if (/\s/u.test(char)) {
    endWord(state);
    return index + 1;
  }
  state.word += char;
  state.inWord = true;
  state.literal = false;
  return index + 1;
}

/**
 * Split a shell command line into simple-command segments of words. See the
 * module doc for what a word is and what ends a segment.
 */
export function segmentCommand(command: string): readonly (readonly ShellWord[])[] {
  const state: ScanState = {
    segments: [],
    words: [],
    word: '',
    inWord: false,
    literal: false,
    nested: [],
    heredocs: [],
  };
  let index = 0;
  while (index < command.length) {
    index = scanAt(command, index, state);
  }
  endSegment(state);
  return state.segments;
}
