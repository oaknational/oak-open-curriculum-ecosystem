import { describe, expect, it } from 'vitest';

import { sessionIdOf } from './session-id.js';

describe('sessionIdOf', () => {
  it('reads the id from a POSIX transcript path', () => {
    expect(sessionIdOf('/h/.claude/projects/-a/3f2c9e10-abcd.jsonl')).toBe('3f2c9e10-abcd');
  });

  it('reads the id from a Windows transcript path', () => {
    expect(sessionIdOf(String.raw`D:\h\.claude\projects\-a\3f2c9e10-abcd.jsonl`)).toBe(
      '3f2c9e10-abcd',
    );
  });
});
