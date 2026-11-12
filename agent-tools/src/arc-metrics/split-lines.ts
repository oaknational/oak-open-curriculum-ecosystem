/**
 * Split a transcript's text into its lines, on the newline alone.
 *
 * @remarks
 * A vendor transcript is JSONL: one JSON object per line, terminated by a
 * newline. JSON leaves the Unicode line separator (U+2028) and paragraph
 * separator (U+2029) unescaped inside strings, and `node:readline` treats both
 * as line endings, so an entry whose text holds either arrives from it as
 * fragments that do not parse and is dropped whole. On 2026-10-01, over one
 * project directory's fifteen transcripts, that reader broke 15 well-formed
 * entries into 52 unparseable fragments; splitting on the newline alone left
 * none. This splitter is pure, so the rule is proved in process.
 *
 * A carriage return that ends a line is dropped with its newline; one inside a
 * line is the entry's own text and stays.
 *
 * Each chunk is scanned once. A line that spans chunks is held as its
 * fragments and joined when its newline arrives, so a single entry of many
 * megabytes costs time in proportion to its length, not to its length times
 * the number of chunks it spans.
 *
 * @packageDocumentation
 */

/**
 * Yield each line of a chunked text stream, without its terminator.
 *
 * @param chunks - The text in arrival order; a line may span chunks.
 * @returns The lines, split on `\n` only. A last line with no terminator is
 *   yielded as it stands: the partial tail of a transcript still being written
 *   is the caller's to skip.
 */
export async function* splitLines(chunks: AsyncIterable<string>): AsyncIterable<string> {
  let unfinished: string[] = [];
  for await (const chunk of chunks) {
    const parts = chunk.split('\n');
    const tail = parts.pop() ?? '';
    for (const part of parts) {
      unfinished.push(part);
      yield withoutTrailingCarriageReturn(unfinished.join(''));
      unfinished = [];
    }
    if (tail.length > 0) {
      unfinished.push(tail);
    }
  }
  if (unfinished.length > 0) {
    yield withoutTrailingCarriageReturn(unfinished.join(''));
  }
}

function withoutTrailingCarriageReturn(line: string): string {
  return line.endsWith('\r') ? line.slice(0, -1) : line;
}
