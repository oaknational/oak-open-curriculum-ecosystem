import { describe, expect, it } from 'vitest';

import { closesFence, fenceLineOf, fenceOpenerOf } from './fence-line.js';

describe('fenceLineOf', () => {
  it('reads a backtick fence with its indent, run and info string', () => {
    expect(fenceLineOf('  ```ts title="a.ts"')).toEqual({
      indent: '  ',
      delimiter: '```',
      info: 'ts title="a.ts"',
    });
  });

  it('reads a tilde fence and drops the blanks before the info string', () => {
    expect(fenceLineOf('~~~~ \t yaml')).toEqual({ indent: '', delimiter: '~~~~', info: 'yaml' });
  });

  it('reads a bare run as an empty info string', () => {
    expect(fenceLineOf('```   ')).toEqual({ indent: '', delimiter: '```', info: '' });
  });

  it('reads no fence from a run of two, an indent of four, or inline code', () => {
    expect(fenceLineOf('``ts')).toBeUndefined();
    expect(fenceLineOf('    ```')).toBeUndefined();
    expect(fenceLineOf('see `code` here')).toBeUndefined();
  });
});

describe('fenceOpenerOf', () => {
  it('opens a fence on a plain run and on a tilde run whose info string holds a backtick', () => {
    expect(fenceOpenerOf('```ts')?.delimiter).toBe('```');
    expect(fenceOpenerOf('~~~ a `b`')?.delimiter).toBe('~~~');
  });

  it('opens no fence on a backtick run whose info string holds a backtick (inline code)', () => {
    expect(fenceOpenerOf('``` `not a fence` ```')).toBeUndefined();
  });
});

describe('closesFence', () => {
  it('closes on the same character, no shorter, with nothing but blanks after the run', () => {
    expect(closesFence('```', '```')).toBe(true);
    expect(closesFence('```', '`````  ')).toBe(true);
    expect(closesFence('~~~', '  ~~~')).toBe(true);
  });

  it('leaves the fence open on a shorter run, the other character, or text after the run', () => {
    expect(closesFence('````', '```')).toBe(false);
    expect(closesFence('```', '~~~')).toBe(false);
    expect(closesFence('```', '``` still code')).toBe(false);
    expect(closesFence('```', 'plain text')).toBe(false);
  });

  it('closes nothing for an empty delimiter, which names no character', () => {
    expect(closesFence('', '```')).toBe(false);
  });
});
