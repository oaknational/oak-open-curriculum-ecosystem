/**
 * Extract `pnpm <script>` citations from authored text.
 *
 * Fenced blocks are scanned line by line; outside fences only inline code
 * spans are read, so a noun phrase such as "pnpm workspaces" in prose never
 * counts as a command. Each `pnpm` token starts a small tokenizer that skips
 * pass-through flags, consumes `--filter` and `run`, and stops at a shell
 * terminator; invocations that cannot be resolved to one scope (a `-C`
 * directory, a recursive run, a path or glob filter, a placeholder name, an
 * unfiltered pnpm built-in) are omitted rather than guessed at. A filtered
 * built-in is kept so its filter is checked, and a `pnpm` that an `echo` or
 * `printf` prints is text, not a command. Inside a fenced block a `cd` line
 * makes its directory current for the lines that follow (`command-context.ts`),
 * so a bare `pnpm <script>` after `cd agent-tools` carries that directory.
 *
 * @packageDocumentation
 */

import {
  AT_ROOT,
  advance,
  COMMAND_TERMINATORS,
  lineStart,
  type CommandContext,
} from './command-context.js';
import { PNPM_BUILTINS } from './pnpm-builtins.js';

/** One `pnpm` command found in a code span or fenced block. */
export interface ScriptCitation {
  /** 1-based line number of the citation. */
  readonly line: number;
  /** The `pnpm …` text as written, trimmed to the parsed tokens. */
  readonly match: string;
  /** The script name the command runs. */
  readonly scriptName: string;
  /** The `--filter` target when the command names a workspace. */
  readonly workspaceFilter?: string;
  /** Set when the command is a pnpm built-in: only its filter is checked, never a script. */
  readonly builtin?: true;
  /**
   * The repo-relative directory a preceding `cd` in the same block made
   * current, normalised (`./x/` is `x`); absent when the command runs at the
   * root.
   */
  readonly workingDirectory?: string;
}

/** Flags that consume the next token. */
const FLAGS_WITH_VALUE: ReadonlySet<string> = new Set([
  '--filter',
  '-F',
  '-C',
  '--dir',
  '--prefix',
]);

/** Flags after which the invocation cannot be resolved to one scope. */
const UNRESOLVABLE_FLAGS: ReadonlySet<string> = new Set([
  '-C',
  '--dir',
  '--prefix',
  '-r',
  '--recursive',
]);

/** The terminators, split off a token they touch (`check&&echo`); `||` before `|`. */
const TERMINATOR_SPLIT = /(&&|\|\||\||;)/;

/** A script name: word characters and dots, with colon-separated segments that never end bare. */
const SCRIPT_NAME_PATTERN = /^[A-Za-z][\w.-]*(?::[\w.-]+)*$/;
/** A shell comment token inside a fenced block ends the command text. */
const COMMENT_PREFIX = '#';
const FENCE_PATTERN = /^\s*(```|~~~)/;
const INLINE_CODE_PATTERN = /`([^`\n]+)`/g;

/**
 * Extract every `pnpm` script citation from one file's content.
 *
 * @param content - The file's UTF-8 text.
 * @returns Citations in line order.
 */
export function extractScriptCitations(content: string): readonly ScriptCitation[] {
  const citations: ScriptCitation[] = [];
  let inFence = false;
  let context = AT_ROOT;
  const lines = content.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const lineText = lines[index] ?? '';
    if (FENCE_PATTERN.test(lineText)) {
      inFence = !inFence;
      context = AT_ROOT;
      continue;
    }
    if (inFence) {
      const read = citationsInCommandText(lineText, index + 1, context);
      citations.push(...read.citations);
      context = read.context;
      continue;
    }
    for (const span of inlineCodeSpans(lineText)) {
      citations.push(...citationsInCommandText(span, index + 1, AT_ROOT).citations);
    }
  }
  return citations;
}

function inlineCodeSpans(lineText: string): readonly string[] {
  return [...lineText.matchAll(INLINE_CODE_PATTERN)].map((match) => match[1] ?? '');
}

/**
 * Whitespace-split tokens up to the first shell comment. A terminator touching
 * a token (`pnpm check; then`, `check&&echo`) is split off as its own token.
 */
function commandTokens(text: string): readonly string[] {
  const tokens: string[] = [];
  for (const token of text.split(/\s+/)) {
    if (token.startsWith(COMMENT_PREFIX)) {
      break;
    }
    for (const part of token.split(TERMINATOR_SPLIT)) {
      if (part.length > 0) {
        tokens.push(part);
      }
    }
  }
  return tokens;
}

/**
 * The `pnpm` script citations among one simple command's words, which a
 * shell reader has already split and unquoted, numbered `line`.
 */
export function citationsInWords(
  words: readonly string[],
  line: number,
): readonly ScriptCitation[] {
  return words.flatMap((word, index) => {
    const citation = word === 'pnpm' ? parseInvocation(words, index + 1, line) : undefined;
    return citation === undefined ? [] : [citation];
  });
}

/**
 * The `pnpm` script citations in one line of prose command text, numbered
 * `line`, read in `context`, with the context the line leaves for the next
 * one. Every invocation on the line is read, up to a shell comment; a `cd`
 * that opens a command changes the directory for what follows it.
 */
function citationsInCommandText(
  text: string,
  line: number,
  context: CommandContext,
): { readonly citations: readonly ScriptCitation[]; readonly context: CommandContext } {
  const tokens = commandTokens(text);
  const citations: ScriptCitation[] = [];
  let state = lineStart(context);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index] ?? '';
    state = advance(state, token, tokens[index + 1]);
    if (token !== 'pnpm' || state.printing || state.context.lost) {
      continue;
    }
    const citation = parseInvocation(tokens, index + 1, line);
    if (citation !== undefined) {
      citations.push(inDirectory(citation, state.context));
    }
  }
  return { citations, context: state.context };
}

/** The citation as read in `context`: carrying its directory when a `cd` named one. */
function inDirectory(citation: ScriptCitation, context: CommandContext): ScriptCitation {
  return context.directory === undefined
    ? citation
    : { ...citation, workingDirectory: context.directory };
}

interface ParseState {
  readonly workspaceFilter?: string;
  readonly unresolvable: boolean;
}

function parseInvocation(
  tokens: readonly string[],
  start: number,
  line: number,
): ScriptCitation | undefined {
  let state: ParseState = { unresolvable: false };
  for (let index = start; index < tokens.length; index += 1) {
    const token = tokens[index] ?? '';
    if (COMMAND_TERMINATORS.has(token)) {
      return undefined;
    }
    if (token.startsWith('-')) {
      state = applyFlag(state, token, tokens[index + 1]);
      if (FLAGS_WITH_VALUE.has(token)) {
        index += 1;
      }
      continue;
    }
    if (token === 'run') {
      continue;
    }
    return citationFor(tokens.slice(start - 1, index + 1).join(' '), token, state, line);
  }
  return undefined;
}

function applyFlag(state: ParseState, flag: string, value: string | undefined): ParseState {
  const [name, inlineValue] = flag.split('=', 2);
  const flagName = name ?? flag;
  if (UNRESOLVABLE_FLAGS.has(flagName)) {
    return { ...state, unresolvable: true };
  }
  if (flagName === '--filter' || flagName === '-F') {
    const filter = inlineValue ?? value;
    return filter === undefined
      ? { ...state, unresolvable: true }
      : { ...state, workspaceFilter: filter };
  }
  return state;
}

function citationFor(
  match: string,
  token: string,
  state: ParseState,
  line: number,
): ScriptCitation | undefined {
  if (state.unresolvable || !SCRIPT_NAME_PATTERN.test(token)) {
    return undefined;
  }
  if (state.workspaceFilter !== undefined && !isPackageName(state.workspaceFilter)) {
    return undefined;
  }
  if (PNPM_BUILTINS.has(token)) {
    return state.workspaceFilter === undefined
      ? undefined
      : { line, match, scriptName: token, workspaceFilter: state.workspaceFilter, builtin: true };
  }
  return state.workspaceFilter === undefined
    ? { line, match, scriptName: token }
    : { line, match, scriptName: token, workspaceFilter: state.workspaceFilter };
}

/** A `--filter` value that names a package rather than a path, a glob, a placeholder or an expansion. */
function isPackageName(filter: string): boolean {
  return !/[*.]{2,}|^\.{1,2}\/|\/$|[<>{}*$`]/.test(filter);
}
