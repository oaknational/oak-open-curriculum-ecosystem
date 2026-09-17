import { Buffer } from 'node:buffer';

import { err, ok, type Result } from '@oaknational/result';

/** A byte sequence paired with its unsigned 64-bit big-endian byte length. */
export interface LengthFramedBytes {
  readonly length: Uint8Array;
  readonly bytes: Uint8Array;
}

/** Frame exact bytes for deterministic domain-separated hashing. */
export function lengthFrame(bytes: Uint8Array): Result<LengthFramedBytes, Error> {
  if (!Number.isSafeInteger(bytes.byteLength) || bytes.byteLength < 0) {
    return err(new Error('byte length must be a non-negative safe integer'));
  }
  const length = Buffer.alloc(8);
  length.writeBigUInt64BE(BigInt(bytes.byteLength));
  return ok({ length, bytes });
}
