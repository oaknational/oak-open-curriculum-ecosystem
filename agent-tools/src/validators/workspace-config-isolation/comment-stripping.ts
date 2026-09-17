/**
 * Comment blanking for the containment scan.
 *
 * @remarks Comments are not code: a commented-out escape must not fire,
 * and a comment MENTIONING `import(...)` must not read as unanalysable
 * (a JSDoc note in a live config was the first instance). Comments are
 * replaced with spaces, never removed, so every character offset — and
 * therefore every reported line number — matches the original text.
 *
 * A `//` inside a string is protected by a quote-parity heuristic: the
 * tail is stripped only when each quote kind appears an even number of
 * times before it. Exact for this file class, where import specifiers
 * never contain `//`.
 *
 * @packageDocumentation
 */

const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;

/** Blank comments while preserving every character offset. */
export function stripComments(content: string): string {
  const blanked = content.replaceAll(BLOCK_COMMENT, (match) => match.replaceAll(/[^\n]/g, ' '));
  return blanked
    .split('\n')
    .map((line) => {
      const index = findCommentTail(line);
      return index === -1 ? line : line.slice(0, index) + ' '.repeat(line.length - index);
    })
    .join('\n');
}

function isQuoteParityEven(counts: ReadonlyMap<string, number>): boolean {
  for (const count of counts.values()) {
    if (count % 2 !== 0) {
      return false;
    }
  }
  return true;
}

function findCommentTail(line: string): number {
  const counts = new Map<string, number>([
    ["'", 0],
    ['"', 0],
    ['`', 0],
  ]);
  for (let i = 0; i < line.length - 1; i += 1) {
    const char = line[i] ?? '';
    const seen = counts.get(char);
    if (seen !== undefined) {
      counts.set(char, seen + 1);
      continue;
    }
    if (char === '/' && line[i + 1] === '/' && isQuoteParityEven(counts)) {
      return i;
    }
  }
  return -1;
}
