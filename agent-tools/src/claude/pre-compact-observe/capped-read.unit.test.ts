import { describe, expect, it } from 'vitest';

import {
  EMPTY_CAPPED_READ,
  STDIN_CAP_BYTES,
  finishCappedRead,
  keepWithinCap,
  thrownReason,
} from './capped-read.js';
import type { StdinRead } from './payload.js';

/** Fold the chunks in order, as the entry's read loop does, then finish the read. */
function readChunks(chunks: readonly Uint8Array[]): StdinRead {
  return finishCappedRead(chunks.reduce(keepWithinCap, EMPTY_CAPPED_READ));
}

/** `count` bytes of one-byte characters. */
function filler(count: number): Buffer {
  return Buffer.alloc(count, 'a');
}

/** The text {@link filler} decodes to. */
function fillerText(count: number): string {
  return 'a'.repeat(count);
}

/** A character of four UTF-8 bytes: F0 9F 98 80. */
const FOUR_BYTE_CHARACTER = '\u{1F600}';

/** What any UTF-8 decode gives for a byte sequence that is not valid UTF-8. */
const REPLACEMENT_CHARACTER = '\u{FFFD}';

describe('the capped stdin read', () => {
  it('keeps all of a stdin under the cap, and reports nothing dropped', () => {
    const read = readChunks([Buffer.from('{"a":'), Buffer.from('"é"}')]);

    expect(read).toStrictEqual({ kind: 'read', text: '{"a":"é"}' });
  });

  it('keeps all of a stdin of exactly the cap, and reports nothing dropped', () => {
    const read = readChunks([filler(STDIN_CAP_BYTES - 1), Buffer.from('}')]);

    expect(read).toStrictEqual({ kind: 'read', text: `${fillerText(STDIN_CAP_BYTES - 1)}}` });
  });

  it('keeps the cap and counts every byte past it as dropped, across several chunks', () => {
    const read = readChunks([filler(STDIN_CAP_BYTES - 2), Buffer.from('bcde'), Buffer.from('fg')]);

    expect(read).toStrictEqual({
      kind: 'read',
      text: `${fillerText(STDIN_CAP_BYTES - 2)}bc`,
      droppedBytes: 4,
    });
  });

  // Each character is followed by a one-byte brace, so every byte past the
  // text is dropped: the character's own, and the brace.
  it.each([
    { character: '\u{416}', bytesUnderTheCap: 1, droppedBytes: 3 }, // D0 96: a D0-DF lead
    { character: '\u{20AC}', bytesUnderTheCap: 1, droppedBytes: 4 }, // E2 82 AC
    { character: '\u{20AC}', bytesUnderTheCap: 2, droppedBytes: 4 },
    { character: FOUR_BYTE_CHARACTER, bytesUnderTheCap: 1, droppedBytes: 5 },
    { character: FOUR_BYTE_CHARACTER, bytesUnderTheCap: 2, droppedBytes: 5 },
    { character: FOUR_BYTE_CHARACTER, bytesUnderTheCap: 3, droppedBytes: 5 },
  ])(
    'ends the text before $character when the cap splits it after $bytesUnderTheCap of its bytes, and counts them as dropped',
    ({ character, bytesUnderTheCap, droppedBytes }) => {
      const read = readChunks([
        filler(STDIN_CAP_BYTES - bytesUnderTheCap),
        Buffer.from(`${character}}`),
      ]);

      expect(read).toStrictEqual({
        kind: 'read',
        text: fillerText(STDIN_CAP_BYTES - bytesUnderTheCap),
        droppedBytes,
      });
    },
  );

  it('keeps a character that ends exactly at the cap', () => {
    const read = readChunks([filler(STDIN_CAP_BYTES - 4), Buffer.from(`${FOUR_BYTE_CHARACTER}}`)]);

    expect(read).toStrictEqual({
      kind: 'read',
      text: `${fillerText(STDIN_CAP_BYTES - 4)}${FOUR_BYTE_CHARACTER}`,
      droppedBytes: 1,
    });
  });

  it('keeps a run of continuation bytes with no lead byte in reach, because no cut split a character there', () => {
    // A character the cut split would have its lead byte within the last
    // four kept bytes. These four are all continuation bytes, so each decodes
    // to U+FFFD and only the brace past the cap is dropped.
    const continuationRun = Buffer.from([0x80, 0x80, 0x80, 0x80]);

    const read = readChunks([filler(STDIN_CAP_BYTES - 4), continuationRun, Buffer.from('}')]);

    expect(read).toStrictEqual({
      kind: 'read',
      text: `${fillerText(STDIN_CAP_BYTES - 4)}${REPLACEMENT_CHARACTER.repeat(4)}`,
      droppedBytes: 1,
    });
  });

  it('keeps a stdin that itself ends inside a character when the cap cut nothing', () => {
    // The sender's own truncated sequence, not the cap's cut: it decodes to
    // U+FFFD, and no byte is counted as dropped.
    const read = readChunks([Buffer.from('{'), Buffer.from([0xf0, 0x9f])]);

    expect(read).toStrictEqual({ kind: 'read', text: `{${REPLACEMENT_CHARACTER}` });
  });

  it('keeps its own copy of each chunk, so the reader can reuse its buffer', () => {
    const buffer = Buffer.from('{}');
    const read = keepWithinCap(EMPTY_CAPPED_READ, buffer);
    buffer.write('xx');

    expect(finishCappedRead(read)).toStrictEqual({ kind: 'read', text: '{}' });
  });
});

describe('thrownReason', () => {
  const PATH = '/work/private/transcript.jsonl';
  const MESSAGE = `EISDIR: illegal operation on a directory, read ${PATH}`;

  it.each([
    {
      label: 'the code of an error that carries one',
      thrown: Object.assign(new Error(MESSAGE), { code: 'EISDIR' }),
      reason: 'EISDIR',
    },
    {
      label: "libuv's own UNKNOWN code, as a code",
      thrown: Object.assign(new Error(MESSAGE), { code: 'UNKNOWN' }),
      reason: 'UNKNOWN',
    },
    {
      label: 'the name of an error whose code is not an error code',
      thrown: Object.assign(new Error(MESSAGE), { code: MESSAGE }),
      reason: 'Error',
    },
    {
      label: 'the name of an error without a code',
      thrown: new TypeError(MESSAGE),
      reason: 'TypeError',
    },
    {
      label: 'a fixed text for an error whose name is not an identifier',
      thrown: Object.assign(new Error(MESSAGE), { name: `read ${PATH}` }),
      reason: 'UNIDENTIFIED_ERROR',
    },
  ])('gives $label, never the message', ({ thrown, reason }) => {
    expect(thrownReason(thrown)).toBe(reason);
  });
});
