/**
 * ANSI-C quoting (`$'…'`) for the shell-word scanner: bash decodes the
 * escapes inside such a span before the command sees the word, so a script
 * written as `$'echo a\\nrm -rf x'` is two lines to the interpreter.
 *
 * @packageDocumentation
 */

const ANSI_C_SIMPLE_ESCAPES: Readonly<Record<string, string>> = {
  n: '\n',
  t: '\t',
  r: '\r',
  a: '\u0007',
  b: '\b',
  e: '\u001b',
  f: '\f',
  v: '\v',
  '\\': '\\',
  "'": "'",
  '"': '"',
};

/** Decode one ANSI-C escape at `index` (the backslash); returns the text and the index past it. */
function decodeAnsiCEscape(command: string, index: number): readonly [string, number] {
  const next = command[index + 1] ?? '';
  const simple = ANSI_C_SIMPLE_ESCAPES[next];
  if (simple !== undefined) {
    return [simple, index + 2];
  }
  const hex = /^x([0-9A-Fa-f]{1,2})/u.exec(command.slice(index + 1));
  if (hex?.[1] !== undefined) {
    return [String.fromCodePoint(Number.parseInt(hex[1], 16)), index + 2 + hex[1].length];
  }
  const octal = /^[0-7]{1,3}/u.exec(command.slice(index + 1));
  if (octal !== null) {
    return [String.fromCodePoint(Number.parseInt(octal[0], 8)), index + 1 + octal[0].length];
  }
  return decodeUnicodeOrControlEscape(command, index, next);
}

/** Decode `\uHHHH`, `\UHHHHHHHH` and `\cX`; an unknown escape stays literal, as bash leaves it. */
function decodeUnicodeOrControlEscape(
  command: string,
  index: number,
  next: string,
): readonly [string, number] {
  const unicode = /^[uU]([0-9A-Fa-f]{1,8})/u.exec(command.slice(index + 1));
  if (unicode?.[1] !== undefined) {
    const digits = next === 'u' ? unicode[1].slice(0, 4) : unicode[1];
    const codePoint = Number.parseInt(digits, 16);
    const text = codePoint <= 0x10_ff_ff ? String.fromCodePoint(codePoint) : '';
    return [text, index + 2 + digits.length];
  }
  if (next === 'c' && command.length > index + 2) {
    const control = (command.codePointAt(index + 2) ?? 0) & 0x1f;
    return [String.fromCodePoint(control), index + 3];
  }
  return [`\\${next}`, index + 2];
}

/**
 * Decode an ANSI-C quoted span `$'…'` opened at `start` (the `$`) as bash
 * does; returns the decoded text and the index just past the closing quote
 * (the line's end when unterminated).
 */
export function decodeAnsiCQuoted(command: string, start: number): readonly [string, number] {
  let text = '';
  let index = start + 2;
  while (index < command.length && command[index] !== "'") {
    if (command[index] === '\\') {
      const [decoded, next] = decodeAnsiCEscape(command, index);
      text += decoded;
      index = next;
    } else {
      text += command[index] ?? '';
      index += 1;
    }
  }
  return [text, index + 1];
}
