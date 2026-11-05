import { isErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseFlags } from './parse-flags.js';

const options = { 'map-result': { type: 'string' } } as const;

describe('parseFlags', () => {
  it('returns the values when every flag is known', () => {
    expect(parseFlags({ args: ['--map-result', 'a.json'], options })).toEqual({
      ok: true,
      value: { 'map-result': 'a.json' },
    });
  });

  it('returns an unknown flag as an input error naming the flag, carrying the refusal as its cause', () => {
    const flags = parseFlags({ args: ['--no-such-flag'], options });
    expect(isErr(flags) && flags.error.message).toMatch(/^Invalid flags: .*--no-such-flag/u);
    expect(isErr(flags) && flags.error.cause).toBeInstanceOf(Error);
  });

  it('returns a flag missing its value as an input error', () => {
    const flags = parseFlags({ args: ['--map-result'], options });
    expect(isErr(flags) && flags.error.message).toMatch(/^Invalid flags: .*--map-result/u);
  });

  it('returns a stray positional as an input error', () => {
    const flags = parseFlags({ args: ['stray'], options });
    expect(isErr(flags) && flags.error.message).toMatch(/^Invalid flags: .*stray/u);
  });

  it("rethrows a defect in the caller's own options, which no operator input can cure", () => {
    expect(() =>
      parseFlags({ args: [], options: { 'map-result': { type: 'string', short: 'mr' } } }),
    ).toThrow();
  });
});
