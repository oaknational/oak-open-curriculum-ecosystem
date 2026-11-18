/**
 * Unit tests for reading at most a cap's worth of bytes through a chunk
 * reader, over literal sources (tests never use or create IO).
 */
import { describe, expect, it } from 'vitest';

import { readAtMost, type ChunkReader } from './bounded-read.js';

/** A source holding `text`, handing out at most `chunk` bytes per read. */
function sourceOf(text: string, chunk = Number.POSITIVE_INFINITY): ChunkReader {
  const bytes = new TextEncoder().encode(text);
  let position = 0;
  return (buffer, offset, length) => {
    const count = Math.min(length, chunk, bytes.length - position);
    buffer.set(bytes.subarray(position, position + count), offset);
    position += count;
    return count;
  };
}

/** A source that never ends, as a file another process keeps growing would. */
const endless: ChunkReader = (buffer, offset, length) => {
  buffer.fill(0x61, offset, offset + length);
  return length;
};

const decoded = (bytes: Uint8Array | undefined): string | undefined =>
  bytes === undefined ? undefined : new TextDecoder().decode(bytes);

describe('readAtMost', () => {
  it('reads a source within the cap whole, however the reads are chunked', () => {
    expect(decoded(readAtMost(sourceOf('gitdir: /r/.git\n'), 64))).toBe('gitdir: /r/.git\n');
    expect(decoded(readAtMost(sourceOf('gitdir: /r/.git\n', 3), 64))).toBe('gitdir: /r/.git\n');
  });

  it('reads a source of exactly the cap', () => {
    expect(decoded(readAtMost(sourceOf('abcd'), 4))).toBe('abcd');
  });

  it('refuses a source one byte over the cap', () => {
    expect(readAtMost(sourceOf('abcde'), 4)).toBeUndefined();
  });

  it('refuses a source that never ends, rather than read it to its end', () => {
    expect(readAtMost(endless, 64)).toBeUndefined();
  });

  it('reads an empty source as no bytes', () => {
    expect(decoded(readAtMost(sourceOf(''), 4))).toBe('');
  });
});
