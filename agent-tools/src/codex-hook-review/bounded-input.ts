import { type Readable } from 'node:stream';

import { err, ok, type Result } from '@oaknational/result';

const MAX_HOOK_INPUT_BYTES = 1024 * 1024;

export type BoundedInputError = 'input-too-large' | 'input-read-error';

export async function readBoundedUtf8(
  stream: Readable,
  maximumBytes = MAX_HOOK_INPUT_BYTES,
): Promise<Result<string, BoundedInputError>> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  try {
    for await (const chunk of stream) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
      bytes += buffer.byteLength;
      if (bytes > maximumBytes) {
        stream.destroy();
        return err('input-too-large');
      }
      chunks.push(buffer);
    }
  } catch {
    return err('input-read-error');
  }
  return ok(Buffer.concat(chunks).toString('utf8'));
}
