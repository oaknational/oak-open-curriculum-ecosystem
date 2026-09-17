import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { parseWithSchema } from '../../core/schema-parse.js';
import { makeCheckpointReader } from './checkpoint-io.js';

// Pure seams: a realpath map in the safe-path test idiom, and an in-memory file table.
// Keeps the boundary contract describable without any real IO.
const canonical =
  (entries: Record<string, string>) =>
  (path: string): string => {
    const resolved = entries[path];
    if (resolved === undefined) {
      throw new Error(`ENOENT: no such file or directory, realpath '${path}'`);
    }
    return resolved;
  };

const fileTable =
  (entries: Record<string, string>) =>
  (path: string): Promise<string> => {
    const content = entries[path];
    if (content === undefined) {
      return Promise.reject(new Error(`ENOENT: no such file or directory, open '${path}'`));
    }
    return Promise.resolve(content);
  };

const parseCheckpoint = (value: unknown) =>
  parseWithSchema({
    label: 'fixture checkpoint',
    schema: z.strictObject({ ok: z.boolean() }),
    value,
  });

describe('makeCheckpointReader', () => {
  it('returns a typed failure naming the flag when the path is missing', async () => {
    const read = makeCheckpointReader('/repo');
    const result = await read(undefined, '--map-result', parseCheckpoint);
    expect(isErr(result)).toBe(true);
    expect(!result.ok && result.error.message).toContain('--map-result');
  });

  it('refuses a path that resolves outside the repo root as a typed failure, never a read', async () => {
    const reads: string[] = [];
    const read = makeCheckpointReader('/repo', {
      realpath: canonical({ '/repo': '/repo', '/secrets/run.json': '/secrets/run.json' }),
      readTextFile: (path) => {
        reads.push(path);
        return Promise.resolve('{"ok":true}');
      },
    });
    const result = await read('/secrets/run.json', '--map-result', parseCheckpoint);
    expect(isErr(result)).toBe(true);
    expect(reads).toEqual([]);
  });

  it('returns a typed failure preserving the cause for malformed JSON', async () => {
    const read = makeCheckpointReader('/repo', {
      realpath: canonical({ '/repo': '/repo', '/repo/run.json': '/repo/run.json' }),
      readTextFile: fileTable({ '/repo/run.json': 'not json at all' }),
    });
    const result = await read('/repo/run.json', '--map-result', parseCheckpoint);
    expect(isErr(result)).toBe(true);
    expect(!result.ok && result.error.cause).toBeInstanceOf(SyntaxError);
  });

  it('parses a contained, well-formed checkpoint through the supplied boundary parser', async () => {
    const read = makeCheckpointReader('/repo', {
      realpath: canonical({ '/repo': '/repo', '/repo/run.json': '/repo/run.json' }),
      readTextFile: fileTable({ '/repo/run.json': '{"ok":true}' }),
    });
    const result = await read('/repo/run.json', '--map-result', parseCheckpoint);
    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toEqual({ ok: true });
  });
});
