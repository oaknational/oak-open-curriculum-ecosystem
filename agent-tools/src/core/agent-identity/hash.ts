import { createHash } from 'node:crypto';

/**
 * SHA-256 digest material used by the deterministic identity router.
 */
interface SeedDigest {
  /** Lowercase hexadecimal digest for audit output. */
  readonly hex: string;
}

/**
 * Internal digest shape used by the wordlist router.
 */
interface RoutableSeedDigest extends SeedDigest {
  /** Digest bytes in the order emitted by SHA-256. */
  readonly bytes: readonly number[];
}

/**
 * Hash a seed with SHA-256 for deterministic identity routing.
 *
 * @param seed - Stable, non-empty seed string.
 * @returns Digest bytes and hex representation.
 */
export function digestSeed(seed: string): SeedDigest {
  return {
    hex: createHash('sha256').update(seed).digest('hex'),
  };
}

/**
 * Hash a seed with SHA-256 and expose readonly bytes for routing.
 *
 * @param seed - Stable, non-empty seed string.
 * @returns Digest bytes and hex representation.
 */
export function digestSeedForRouting(seed: string): RoutableSeedDigest {
  const digest = createHash('sha256').update(seed).digest();

  return {
    bytes: Array.from(digest),
    hex: digest.toString('hex'),
  };
}

/**
 * Read four digest bytes as an unsigned 32-bit big-endian integer.
 *
 * @param bytes - Digest bytes.
 * @param startIndex - First byte index for the four-byte slice.
 * @returns Unsigned integer represented by the four-byte slice.
 */
export function readUInt32BigEndian(bytes: readonly number[], startIndex: number): number {
  const first = readByte(bytes, startIndex);
  const second = readByte(bytes, startIndex + 1);
  const third = readByte(bytes, startIndex + 2);
  const fourth = readByte(bytes, startIndex + 3);

  return (first * 0x1000000 + second * 0x10000 + third * 0x100 + fourth) >>> 0;
}

function readByte(bytes: readonly number[], index: number): number {
  const value = bytes[index];
  if (value === undefined) {
    throw new Error(`digest does not contain byte at index ${index.toString()}`);
  }
  return value;
}
