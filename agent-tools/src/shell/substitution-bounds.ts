/**
 * Where a command substitution ends, for the shell-word scanner: the `)`
 * closing a `$(` (balanced past nested parentheses, quoted spans and
 * escapes) and the first unescaped backtick closing a backtick pair.
 *
 * @packageDocumentation
 */

/** The index just past a quoted span opened at `index` (the line's end when unterminated). */
function skipQuotedSpan(command: string, index: number): number {
  const quote = command[index] ?? '';
  let cursor = index + 1;
  while (cursor < command.length && command[cursor] !== quote) {
    cursor += quote === '"' && command[cursor] === '\\' ? 2 : 1;
  }
  return cursor + 1;
}

/** The index just past the opaque text at `index` (an escape pair or a quoted span), or `null` when it is plain. */
function skipOpaque(command: string, index: number): number | null {
  const char = command[index] ?? '';
  if (char === '\\') {
    return index + 2;
  }
  return char === '"' || char === "'" ? skipQuotedSpan(command, index) : null;
}

/**
 * The index of the `)` closing a `$(` opened at `start`, honouring nesting,
 * quoted spans and escapes inside the body; the line's end when unclosed.
 */
export function findSubstitutionClose(command: string, start: number): number {
  let depth = 0;
  let index = start;
  while (index < command.length) {
    const opaqueEnd = skipOpaque(command, index);
    if (opaqueEnd !== null) {
      index = opaqueEnd;
      continue;
    }
    const char = command[index] ?? '';
    depth += char === '(' ? 1 : 0;
    depth -= char === ')' ? 1 : 0;
    if (char === ')' && depth === 0) {
      return index;
    }
    index += 1;
  }
  return command.length;
}

/** The index of the first unescaped backtick at or after `start`; the line's end when there is none. */
export function findBacktickClose(command: string, start: number): number {
  let index = start;
  while (index < command.length && command[index] !== '`') {
    index += command[index] === '\\' ? 2 : 1;
  }
  return index;
}
