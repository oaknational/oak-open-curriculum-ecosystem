/**
 * The capped stdin read: the fold the entry's read loop runs over each chunk
 * it reads from stdin, and the reason recorded when a read, or any step,
 * throws.
 *
 * @remarks
 * The fold keeps at most {@link STDIN_CAP_BYTES} bytes and counts the rest,
 * so a stdin far larger than any payload cannot make the observer hold it
 * all, and the record still says how much was cut. It is pure: the entry
 * reads, and hands each chunk here; nothing here imports `node:fs`.
 *
 * @packageDocumentation
 */

import { errorCodeOf } from '../../core/error-code.js';
import type { StdinRead } from './payload.js';

/** The most stdin bytes the observer keeps: 1 MiB. */
export const STDIN_CAP_BYTES = 1_048_576;

/**
 * The chunks kept so far, latest first: each link holds one copied chunk and
 * the links before it. Folding a chunk adds one link and copies nothing
 * earlier, so a stdin delivered in many small chunks costs linear time.
 */
export interface KeptChunks {
  readonly chunk: Buffer;
  readonly earlier: KeptChunks | undefined;
}

/** A capped read in progress: the bytes kept so far, and how many were dropped. */
export interface CappedRead {
  /**
   * The chunks kept, latest first (see {@link KeptChunks}): copies, together
   * at most {@link STDIN_CAP_BYTES} bytes; `undefined` before the first.
   */
  readonly kept: KeptChunks | undefined;
  /** How many bytes the kept chunks hold. */
  readonly keptBytes: number;
  /** How many bytes arrived past the cap and were not kept. */
  readonly droppedBytes: number;
}

/** The read before its first chunk: nothing kept, nothing dropped. */
export const EMPTY_CAPPED_READ: CappedRead = { kept: undefined, keptBytes: 0, droppedBytes: 0 };

/**
 * Fold one chunk into the read.
 *
 * @param read - The read so far.
 * @param chunk - The bytes the latest read returned.
 * @returns The read with as much of the chunk kept as fits under the cap,
 *   copied, so the caller can reuse its buffer for the next read; and every
 *   byte past the cap counted as dropped.
 */
export function keepWithinCap(read: CappedRead, chunk: Uint8Array): CappedRead {
  const keptLength = Math.min(chunk.length, STDIN_CAP_BYTES - read.keptBytes);
  return {
    kept:
      keptLength === 0
        ? read.kept
        : { chunk: Buffer.from(chunk.subarray(0, keptLength)), earlier: read.kept },
    keptBytes: read.keptBytes + keptLength,
    droppedBytes: read.droppedBytes + chunk.length - keptLength,
  };
}

/**
 * Finish the read: the kept bytes as text, and how many bytes were dropped.
 *
 * @remarks
 * The kept bytes decode as UTF-8. When the cap cut the stdin, the text ends
 * at the last whole character before the cut, and the bytes of a character
 * the cut split are counted as dropped: for a UTF-8 stdin, the text's UTF-8
 * length and the dropped count sum to the bytes read. When the cap cut
 * nothing, every byte is kept as sent, and a sequence that is not valid
 * UTF-8, even one the stdin ends inside, decodes to U+FFFD.
 *
 * @param read - The read after its last chunk.
 * @returns The text, with `droppedBytes` only when a byte was dropped.
 */
export function finishCappedRead(read: CappedRead): StdinRead {
  const kept = Buffer.concat(inReadOrder(read.kept), read.keptBytes);
  const textLength = read.droppedBytes === 0 ? kept.length : wholeCharactersLength(kept);
  const droppedBytes = read.droppedBytes + kept.length - textLength;
  const text = kept.subarray(0, textLength).toString('utf8');
  return droppedBytes === 0 ? { kind: 'read', text } : { kind: 'read', text, droppedBytes };
}

/** The kept chunks in the order they were read, from the latest-first chain. */
function inReadOrder(latest: KeptChunks | undefined): Buffer[] {
  const chunks: Buffer[] = [];
  for (let link = latest; link !== undefined; link = link.earlier) {
    chunks.push(link.chunk);
  }
  return chunks.toReversed();
}

/** The longest UTF-8 sequence: a lead byte and up to three continuation bytes. */
const LONGEST_SEQUENCE = 4;

/**
 * How many leading bytes hold whole characters: all of them, less a final
 * character the end splits. It looks back one sequence's length at most for
 * the last lead byte; a tail of continuation bytes with no lead in reach is
 * not a split character, so it is kept.
 */
function wholeCharactersLength(bytes: Buffer): number {
  const earliest = Math.max(0, bytes.length - LONGEST_SEQUENCE);
  for (let index = bytes.length - 1; index >= earliest; index -= 1) {
    const byte = bytes[index];
    if (!isContinuationByte(byte)) {
      return sequenceLength(byte) > bytes.length - index ? index : bytes.length;
    }
  }
  return bytes.length;
}

/** Whether the byte continues a sequence: `10xxxxxx`. */
function isContinuationByte(byte: number): boolean {
  return (byte & 0xc0) === 0x80;
}

/**
 * The sequence length a lead byte announces: `110xxxxx` two, `1110xxxx`
 * three, `11110xxx` four; any other byte stands alone.
 */
function sequenceLength(lead: number): number {
  if ((lead & 0xe0) === 0xc0) {
    return 2;
  }
  if ((lead & 0xf0) === 0xe0) {
    return 3;
  }
  return (lead & 0xf8) === 0xf0 ? 4 : 1;
}

/** An error's name as an identifier: a letter, then letters, digits or underscores. */
const ERROR_NAME_SHAPE = /^[A-Za-z]\w*$/u;

/** The reason for an error that neither a code nor a name identifies. */
const UNIDENTIFIED_REASON = 'UNIDENTIFIED_ERROR';

/**
 * The reason to record for a throw: the stdin read's, or any other the
 * entry's catch takes.
 *
 * @remarks
 * Never the message, which for a `node:fs` error names the path it failed
 * on. The code is read through `errorCodeOf` (`core/error-code.ts`), the one
 * owner of which codes may cross. A name crosses only when it is an
 * identifier, because a name, like a code, is a property anything can set.
 *
 * It takes an Error only. A caller narrows what it caught through
 * `failureAsError` (`core/failure-as-error.ts`), which crashes on a thrown
 * value that is not an Error (owner ruling, 2026-07-20). For the hook that
 * crash exits 1, which the harness treats as a non-blocking error and the
 * hook-error wrapper logs, so the observer still never blocks a compaction.
 *
 * @param thrown - The error the failed step threw.
 * @returns The error's code when it is shaped as an error code (`EISDIR`);
 *   else its name when that is an identifier (`TypeError`); else
 *   `UNIDENTIFIED_ERROR`.
 */
export function thrownReason(thrown: Error): string {
  const code = errorCodeOf(thrown);
  if (code !== undefined) {
    return code;
  }
  return ERROR_NAME_SHAPE.test(thrown.name) ? thrown.name : UNIDENTIFIED_REASON;
}
