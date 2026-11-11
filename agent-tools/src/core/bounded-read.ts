/**
 * A read that never takes more than a cap's worth of bytes plus one, the byte
 * that tells a source over the cap from one at it, however large the source
 * is or grows while it is read.
 *
 * @packageDocumentation
 */

/**
 * Reads into `buffer` from `offset`, at most `length` bytes, continuing where
 * the last read ended.
 *
 * @returns The bytes read; 0 at the end of the source.
 */
export type ChunkReader = (buffer: Uint8Array, offset: number, length: number) => number;

/**
 * Read at most `cap` bytes through `read`, asking for one byte more so that a
 * source larger than the cap is refused rather than read to its end. A size
 * measured before the read is no bound: the source may grow after it.
 *
 * @param read - The source's chunk reader.
 * @param cap - The most bytes the source may hold.
 * @returns The bytes read, or `undefined` when the source holds more than `cap`.
 */
export function readAtMost(read: ChunkReader, cap: number): Uint8Array | undefined {
  const buffer = new Uint8Array(cap + 1);
  let filled = 0;
  while (filled < buffer.length) {
    const count = read(buffer, filled, buffer.length - filled);
    if (count === 0) {
      break;
    }
    filled += count;
  }
  return filled > cap ? undefined : buffer.subarray(0, filled);
}
