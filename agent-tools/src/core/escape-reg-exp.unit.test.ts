import { describe, expect, it } from 'vitest';

import { escapeRegExp } from './escape-reg-exp.js';

describe('escapeRegExp', () => {
  it('escapes every metacharacter, so the text matches itself literally and nothing else', () => {
    const text = String.raw`a.b*c+d?e^f$g{2}(h)|i[j]k\l`;
    const pattern = new RegExp(`^${escapeRegExp(text)}$`, 'u');
    expect(pattern.test(text)).toBe(true);
    expect(pattern.test(String.raw`aXb*c+d?e^f$g{2}(h)|i[j]k\l`)).toBe(false);
  });
});
