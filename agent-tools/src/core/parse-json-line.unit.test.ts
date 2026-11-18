import { describe, expect, it } from 'vitest';

import { parseJsonLine } from './parse-json-line.js';

describe('parseJsonLine', () => {
  it('parses a JSON object line into its value', () => {
    expect(parseJsonLine('{"type":"assistant","n":1}')).toEqual({ type: 'assistant', n: 1 });
  });

  it('returns undefined for a truncated tail line, so a reader can skip it', () => {
    expect(parseJsonLine('{"type":"assist')).toBeUndefined();
  });

  it('returns undefined for an empty line', () => {
    expect(parseJsonLine('')).toBeUndefined();
  });

  it('parses a JSON scalar line', () => {
    expect(parseJsonLine('42')).toBe(42);
  });
});
