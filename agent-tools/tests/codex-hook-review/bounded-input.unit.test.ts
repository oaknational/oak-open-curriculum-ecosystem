import { Readable } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { readBoundedUtf8 } from '../../src/codex-hook-review/bounded-input.js';

describe('readBoundedUtf8', () => {
  it('returns bounded UTF-8 input without transformation', async () => {
    const result = await readBoundedUtf8(Readable.from(['{"hook_', 'event_name":"x"}']), 64);

    expect(result).toEqual({ ok: true, value: '{"hook_event_name":"x"}' });
  });

  it('refuses input as soon as its UTF-8 byte count exceeds the ceiling', async () => {
    const result = await readBoundedUtf8(Readable.from(['££']), 3);

    expect(result).toEqual({ ok: false, error: 'input-too-large' });
  });

  it('reports stream failures without throwing', async () => {
    const stream = new Readable({
      read() {
        this.destroy(new Error('broken'));
      },
    });

    expect(await readBoundedUtf8(stream, 64)).toEqual({
      ok: false,
      error: 'input-read-error',
    });
  });
});
