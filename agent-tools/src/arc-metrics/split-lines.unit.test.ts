import { describe, expect, it } from 'vitest';

import { splitLines } from './split-lines.js';

async function* chunks(...values: readonly string[]): AsyncIterable<string> {
  for (const value of values) {
    yield value;
  }
}

async function collect(lines: AsyncIterable<string>): Promise<readonly string[]> {
  const collected: string[] = [];
  for await (const line of lines) {
    collected.push(line);
  }
  return collected;
}

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

describe('splitLines', () => {
  it('yields each line once, wherever the chunk boundaries fall', async () => {
    const lines = await collect(splitLines(chunks('{"a":', '1}\n{"b":2}\n{"c"', ':3}\n')));

    expect(lines).toEqual(['{"a":1}', '{"b":2}', '{"c":3}']);
  });

  it('keeps an entry whole when its text holds the Unicode line and paragraph separators', async () => {
    const entry = JSON.stringify({ text: `one${LINE_SEPARATOR}two${PARAGRAPH_SEPARATOR}three` });

    const lines = await collect(splitLines(chunks(`${entry}\n`)));

    expect(lines).toEqual([entry]);
  });

  it('leaves a lone carriage return inside a line and drops the one that ends it', async () => {
    const lines = await collect(splitLines(chunks('first\r\nsec\rond\r\n')));

    expect(lines).toEqual(['first', 'sec\rond']);
  });

  it('joins a line that spans many chunks, and drops a carriage return its newline was split from', async () => {
    const lines = await collect(splitLines(chunks('lo', 'ng', ' line', '\r', '\nnext', '\n')));

    expect(lines).toEqual(['long line', 'next']);
  });

  it('yields an empty line for each bare newline, wherever the chunks break', async () => {
    const lines = await collect(splitLines(chunks('a\n', '\n', '\nb\n')));

    expect(lines).toEqual(['a', '', '', 'b']);
  });

  it('yields a last line that has no terminator', async () => {
    const lines = await collect(splitLines(chunks('whole\npart')));

    expect(lines).toEqual(['whole', 'part']);
  });

  it('yields nothing for an empty stream', async () => {
    const lines = await collect(splitLines(chunks()));

    expect(lines).toEqual([]);
  });
});
