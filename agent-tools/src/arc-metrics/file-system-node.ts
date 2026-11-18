import { createReadStream } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { ArcMetricsFileSystem } from './file-system.js';
import { splitLines } from './split-lines.js';

/**
 * Production filesystem adapter — the only file in this topic that touches
 * `node:fs`.
 *
 * @remarks
 * `readLines` streams the file rather than reading it whole: a single arc
 * transcript reached 100MB in the measured instance, and the aggregation needs
 * one line at a time. The stream's text chunks go through {@link splitLines},
 * which splits on the newline alone; `node:readline` also splits on two
 * characters JSON leaves unescaped, and so drops the entries that hold them. A
 * missing project directory lists as `undefined`, per the seam's contract; any
 * other listing error propagates.
 */
export const nodeArcMetricsFileSystem: ArcMetricsFileSystem = {
  listTranscripts: async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true }).catch((error: unknown) => {
      if (isMissingDirectory(error)) {
        return undefined;
      }
      throw error;
    });
    return entries
      ?.filter((entry) => entry.isFile() && entry.name.endsWith('.jsonl'))
      .map((entry) => join(directory, entry.name));
  },

  readLines: (absolutePath) =>
    splitLines(textChunks(createReadStream(absolutePath, { encoding: 'utf8' }))),
};

/** A text-decoding stream's chunks, typed: with an encoding set, each is a string. */
async function* textChunks(stream: AsyncIterable<unknown>): AsyncIterable<string> {
  for await (const chunk of stream) {
    if (typeof chunk === 'string') {
      yield chunk;
    }
  }
}

function isMissingDirectory(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }
  return error.code === 'ENOENT';
}
