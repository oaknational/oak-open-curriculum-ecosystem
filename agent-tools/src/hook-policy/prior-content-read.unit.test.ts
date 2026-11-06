/**
 * Unit tests for the write-hook's prior-content read, over an in-memory edge
 * (tests never use or create IO). A request's reads share one byte budget, and
 * anything but a regular file within it reads as none.
 */
import { describe, expect, it } from 'vitest';

import { priorContentReader, type PriorReadEdge } from './prior-content-read.js';

/** An entry the fake edge opens: a regular file's bytes, or a pipe that reads as empty. */
type Entry =
  | { readonly kind: 'file'; readonly text: string; readonly grownBy?: string }
  | { readonly kind: 'pipe' };

/**
 * An edge over literal entries. A file reports its text's size, and `grownBy`
 * is text written after that report, so a read finds more than was reported.
 */
function edgeOver(entries: Readonly<Record<string, Entry>>): PriorReadEdge {
  const open: { entry: Entry; position: number }[] = [];
  return {
    open: (filePath) => {
      const entry = entries[filePath];
      if (entry === undefined) {
        throw new Error(`ENOENT: ${filePath}`);
      }
      open.push({ entry, position: 0 });
      return open.length - 1;
    },
    describe: (descriptor) => {
      const { entry } = open[descriptor] ?? { entry: { kind: 'pipe' } };
      return entry.kind === 'file'
        ? { regularFile: true, size: Buffer.byteLength(entry.text) }
        : { regularFile: false, size: 0 };
    },
    read: (descriptor, buffer, offset, length) => {
      const handle = open[descriptor];
      if (handle === undefined || handle.entry.kind === 'pipe') {
        return 0;
      }
      const bytes = Buffer.from(handle.entry.text + (handle.entry.grownBy ?? ''));
      const chunk = bytes.subarray(handle.position, handle.position + length);
      buffer.set(chunk, offset);
      handle.position += chunk.length;
      return chunk.length;
    },
    close: () => undefined,
  };
}

describe('priorContentReader', () => {
  it("reads a regular file's text", () => {
    const read = priorContentReader(edgeOver({ '/r/a.md': { kind: 'file', text: 'prior' } }), 64);
    expect(read('/r/a.md')).toBe('prior');
  });

  it('reads nothing from a path that cannot be opened', () => {
    expect(priorContentReader(edgeOver({}), 64)('/r/missing.md')).toBeNull();
  });

  it('reads nothing from anything but a regular file, such as a pipe', () => {
    const read = priorContentReader(edgeOver({ '/r/pipe': { kind: 'pipe' } }), 64);
    expect(read('/r/pipe')).toBeNull();
  });

  it('reads nothing from a file that grows past the size it reported', () => {
    const read = priorContentReader(
      edgeOver({ '/r/log.md': { kind: 'file', text: 'abc', grownBy: 'd' } }),
      64,
    );
    expect(read('/r/log.md')).toBeNull();
  });

  it("reads nothing from a file larger than what is left of the request's budget, however the budget was spent", () => {
    const read = priorContentReader(
      edgeOver({
        '/r/first.md': { kind: 'file', text: 'a'.repeat(6) },
        '/r/second.md': { kind: 'file', text: 'b'.repeat(6) },
        '/r/small.md': { kind: 'file', text: 'c'.repeat(4) },
      }),
      10,
    );
    expect(read('/r/first.md')).toBe('a'.repeat(6));
    expect(read('/r/second.md')).toBeNull();
    expect(read('/r/small.md')).toBe('c'.repeat(4));
    expect(read('/r/small.md')).toBeNull();
  });
});
