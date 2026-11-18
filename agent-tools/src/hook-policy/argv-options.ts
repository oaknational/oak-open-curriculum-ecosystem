import type { OptionSpec } from './argv-option-spec.js';
import type { ShellWord } from '../shell/shell-words.js';

/**
 * Option resolution for the argument-aware Bash-guard matcher: how one
 * invocation word, or one pattern word, maps to the canonical option names
 * in a command's table.
 *
 * @packageDocumentation
 */

/**
 * Resolve a long option name the way git's parse-options does: an exact name
 * wins; otherwise a prefix that names exactly one option wins; a prefix that
 * names several is ambiguous and resolves to nothing, as git refuses the
 * command. Short-only options have no long spelling and never resolve here.
 * A `--no-<name>` spelling resolves only when the table lists it.
 */
function resolveLongOption(name: string, table: readonly OptionSpec[]): OptionSpec | null {
  const longOptions = table.filter((spec) => spec.shortOnly !== true);
  const exact = longOptions.find((spec) => spec.name === name);
  if (exact !== undefined) {
    return exact;
  }
  const candidates = longOptions.filter((spec) => spec.name.startsWith(name));
  return candidates.length === 1 ? (candidates[0] ?? null) : null;
}

/** The canonical option names one spelling stands for. */
function namesOf(spec: OptionSpec): readonly string[] {
  return spec.implies ?? [spec.name];
}

/** The value a short option takes from the rest of its cluster, when it takes one and the rest is non-empty. */
function attachedValue(spec: OptionSpec, rest: string): string | null {
  return spec.arg === undefined || rest === '' ? null : rest;
}

/**
 * Record an option as present, cancelling the options it overrides (last on
 * the line wins) unless its value is one under which it cancels nothing.
 */
function recordPresent(spec: OptionSpec, present: Set<string>, value: string | null): void {
  const exempt = value !== null && (spec.overridesUnless ?? []).includes(value);
  for (const cancelled of exempt ? [] : (spec.overrides ?? [])) {
    present.delete(cancelled);
  }
  for (const canonical of namesOf(spec)) {
    present.add(canonical);
  }
}

/** Resolve one short-option letter; `null` when the table does not list it. */
function resolveShortOption(letter: string, table: readonly OptionSpec[]): OptionSpec | null {
  return table.find((spec) => spec.short?.includes(letter) === true) ?? null;
}

/** Parse one `--name[=value]` invocation word; returns the index of the next word to read. */
function parseLongWord(
  text: string,
  next: number,
  table: readonly OptionSpec[],
  present: Set<string>,
): number {
  const equals = text.indexOf('=');
  const name = equals === -1 ? text.slice(2) : text.slice(2, equals);
  const spec = resolveLongOption(name, table);
  if (spec === null) {
    return next;
  }
  recordPresent(spec, present, equals === -1 ? null : text.slice(equals + 1));
  return spec.arg === 'required' && equals === -1 ? next + 1 : next;
}

/** Parse one `-abc` cluster; returns the index of the next word to read. */
function parseShortCluster(
  text: string,
  next: number,
  table: readonly OptionSpec[],
  present: Set<string>,
): number {
  const letters = text.slice(1);
  for (let position = 0; position < letters.length; position += 1) {
    const spec = resolveShortOption(letters[position] ?? '', table);
    if (spec === null) {
      continue;
    }
    recordPresent(spec, present, attachedValue(spec, letters.slice(position + 1)));
    if (spec.arg === 'required') {
      // The rest of the cluster is the value; an empty rest takes the next word.
      return position + 1 < letters.length ? next : next + 1;
    }
    if (spec.arg === 'optional') {
      // The rest of the cluster, if any, is the value; the next word never is.
      return next;
    }
  }
  return next;
}

/**
 * A word that begins with a dash and is not the bare `-` operand. Quoting is
 * no exemption: the shell removes the quotes before the command sees its
 * `argv`, so `rm '-rf' dir` is `rm -rf dir` to `rm`.
 */
function isOptionWord(word: ShellWord): boolean {
  return word.text.startsWith('-') && word.text !== '-';
}

/**
 * Walk the words after the command (or subcommand) and collect the canonical
 * names of the options present, consuming option values so they are never
 * read as flags. Options may appear in any position; `--` ends option
 * parsing.
 */
export function collectPresentOptions(
  words: readonly ShellWord[],
  table: readonly OptionSpec[],
): ReadonlySet<string> {
  const present = new Set<string>();
  let index = 0;
  while (index < words.length) {
    const word = words[index];
    index += 1;
    if (word === undefined || !isOptionWord(word)) {
      continue;
    }
    if (word.text === '--') {
      break;
    }
    index = word.text.startsWith('--')
      ? parseLongWord(word.text, index, table, present)
      : parseShortCluster(word.text, index, table, present);
  }
  return present;
}

function resolveShortLetters(
  letters: string,
  table: readonly OptionSpec[],
): readonly string[] | null {
  const names: string[] = [];
  for (const letter of letters) {
    const spec = resolveShortOption(letter, table);
    if (spec === null) {
      return null;
    }
    names.push(...namesOf(spec));
  }
  return names;
}

/**
 * Resolve one PATTERN word (`--hard`, `-rf`) to the canonical option names it
 * requires; `null` when any part of it is unknown to the table, so a pattern
 * that would match nothing is refused rather than left as a dead entry.
 */
export function resolvePatternWord(
  word: string,
  table: readonly OptionSpec[],
): readonly string[] | null {
  if (word.startsWith('--')) {
    const spec = resolveLongOption(word.slice(2), table);
    return spec === null ? null : namesOf(spec);
  }
  if (word.startsWith('-') && word.length > 1) {
    return resolveShortLetters(word.slice(1), table);
  }
  return null;
}
