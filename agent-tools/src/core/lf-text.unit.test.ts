import { describe, expect, it } from 'vitest';

import { toLfText } from './lf-text.js';

describe('toLfText', () => {
  it('converts CRLF sequences to LF', () => {
    expect(toLfText('one\r\ntwo\r\n')).toBe('one\ntwo\n');
  });

  it('preserves a lone carriage return — only the CRLF pair is checkout presentation', () => {
    expect(toLfText('one\rtwo')).toBe('one\rtwo');
  });

  it('leaves LF-only text untouched', () => {
    expect(toLfText('one\ntwo\n')).toBe('one\ntwo\n');
  });
});
