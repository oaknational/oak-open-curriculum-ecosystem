/**
 * A POSIX shell's lexer for one command line, as far as the cited-scripts
 * reader needs it: words with their quotes removed, unquoted control
 * operators, and the bodies of the command substitutions the line carries.
 *
 * @packageDocumentation
 */

import { substitutionEnd } from './substitution-end.js';

/** A word, its quotes removed, or an unquoted control operator. */
export interface ShellToken {
  readonly kind: 'word' | 'operator';
  readonly text: string;
}

/** A lexed command line: its words and operators, and its command substitutions' bodies. */
export interface ShellLex {
  readonly tokens: readonly ShellToken[];
  readonly substitutions: readonly string[];
}

/** Control operators, longest first so `&&` is never read as two `&`. */
const OPERATORS = ['&&', '||', ';;', '|', ';', '&', '(', ')'] as const;

interface Lexer {
  readonly tokens: ShellToken[];
  /** The bodies of the command substitutions the line carries, each a command line. */
  readonly substitutions: string[];
  word: string | undefined;
}

function endWord(lexer: Lexer): void {
  if (lexer.word !== undefined) {
    lexer.tokens.push({ kind: 'word', text: lexer.word });
    lexer.word = undefined;
  }
}

/** The characters a backslash escapes inside double quotes. */
const DOUBLE_QUOTE_ESCAPES: ReadonlySet<string> = new Set(['$', '`', '"', '\\']);

function appendToWord(lexer: Lexer, text: string): void {
  lexer.word = (lexer.word ?? '') + text;
}

/** The characters a backslash escapes inside backticks. */
const BACKTICK_ESCAPES: ReadonlySet<string> = new Set(['$', '`', '\\']);
/** Inside double quotes, a backslash in backticks escapes `"` as well (POSIX 2.2.3). */
const DOUBLE_QUOTED_BACKTICK_ESCAPES: ReadonlySet<string> = new Set([...BACKTICK_ESCAPES, '"']);

/**
 * A substitution's stand-in inside its word. The outer shell runs the body, so
 * the word never carries it: a `sh -c` argument does not cite it again, and a
 * `--filter` value holding one names no package the reader can check.
 */
const BACKTICK_MARKER = '``';
const DOLLAR_PAREN_MARKER = '$()';

/**
 * Read a backtick substitution starting after its opening backtick: its body
 * is a command line, and the word keeps a marker in its place. Returns the
 * index after the closing backtick.
 */
function readBackticks(
  text: string,
  start: number,
  lexer: Lexer,
  escapes: ReadonlySet<string>,
): number {
  let index = start;
  let body = '';
  while (index < text.length && text.charAt(index) !== '`') {
    const escaped = text.charAt(index) === '\\' && escapes.has(text.charAt(index + 1));
    body += text.charAt(escaped ? index + 1 : index);
    index += escaped ? 2 : 1;
  }
  lexer.substitutions.push(body);
  appendToWord(lexer, BACKTICK_MARKER);
  return index + 1;
}

/** Read a `$(` substitution, starting at its body; returns the index after its `)`. */
function readDollarParen(text: string, start: number, lexer: Lexer): number {
  const end = substitutionEnd(text, start);
  const body = text.slice(start, end);
  lexer.substitutions.push(body);
  appendToWord(lexer, DOLLAR_PAREN_MARKER);
  return end + 1;
}

/** Read one step inside double quotes; returns where the next starts. */
function doubleQuotedStep(text: string, index: number, lexer: Lexer): number {
  const character = text.charAt(index);
  if (character === '\\' && DOUBLE_QUOTE_ESCAPES.has(text.charAt(index + 1))) {
    appendToWord(lexer, text.charAt(index + 1));
    return index + 2;
  }
  if (character === '`') {
    return readBackticks(text, index + 1, lexer, DOUBLE_QUOTED_BACKTICK_ESCAPES);
  }
  if (text.startsWith('$(', index)) {
    return readDollarParen(text, index + 2, lexer);
  }
  appendToWord(lexer, character);
  return index + 1;
}

/** Read a quoted run starting after its opening quote; returns the index after the closing one. */
function readQuoted(text: string, start: number, quote: string, lexer: Lexer): number {
  let index = start;
  appendToWord(lexer, '');
  while (index < text.length && text.charAt(index) !== quote) {
    if (quote === '"') {
      index = doubleQuotedStep(text, index, lexer);
    } else {
      appendToWord(lexer, text.charAt(index));
      index += 1;
    }
  }
  return index + 1;
}

/** Read one unquoted character, or the character a backslash escapes. */
function readBare(text: string, index: number, lexer: Lexer): number {
  const escaped = text.charAt(index) === '\\';
  appendToWord(lexer, text.charAt(escaped ? index + 1 : index));
  return index + (escaped ? 2 : 1);
}

/** The unquoted operator at `index`, if one starts there. */
function operatorAt(text: string, index: number): string | undefined {
  return OPERATORS.find((operator) => text.startsWith(operator, index));
}

/** Read a substitution that starts unquoted at `index`, if one does; returns where the next step starts. */
function readUnquotedSubstitution(text: string, index: number, lexer: Lexer): number | undefined {
  if (text.charAt(index) === '`') {
    return readBackticks(text, index + 1, lexer, BACKTICK_ESCAPES);
  }
  return text.startsWith('$(', index) ? readDollarParen(text, index + 2, lexer) : undefined;
}

/** Lex what starts at `index`; returns where the next step starts. */
function lexStep(text: string, index: number, lexer: Lexer): number {
  const character = text.charAt(index);
  if (/\s/.test(character)) {
    endWord(lexer);
    return index + 1;
  }
  if (character === '#' && lexer.word === undefined) {
    return text.length;
  }
  const substituted = readUnquotedSubstitution(text, index, lexer);
  if (substituted !== undefined) {
    return substituted;
  }
  const operator = operatorAt(text, index);
  if (operator !== undefined) {
    endWord(lexer);
    lexer.tokens.push({ kind: 'operator', text: operator });
    return index + operator.length;
  }
  return character === "'" || character === '"'
    ? readQuoted(text, index + 1, character, lexer)
    : readBare(text, index, lexer);
}

/**
 * Split a command line into words and operators as a POSIX shell does: single
 * quotes are literal, double quotes honour `\` before `$`, a backtick, `"` and
 * `\`, a backslash outside quotes escapes the next character, and a `#` that
 * starts an unquoted word begins a comment. Parameter expansions stay as
 * written in their words. The body of each command substitution, in backticks
 * or `$( )`, unquoted or inside double quotes, is collected as a command line
 * of its own and leaves a marker in its word, so the words around it stay one
 * simple command.
 */
export function shellLex(text: string): ShellLex {
  const lexer: Lexer = { tokens: [], substitutions: [], word: undefined };
  let index = 0;
  while (index < text.length) {
    index = lexStep(text, index, lexer);
  }
  endWord(lexer);
  return { tokens: lexer.tokens, substitutions: lexer.substitutions };
}
