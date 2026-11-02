import { describe, expect, it } from 'vitest';

import { stripLinkTitle } from './strip-link-title.js';

describe('stripLinkTitle', () => {
  it('strips a quoted title after one space', () => {
    expect(stripLinkTitle('./sibling.md "Title text"')).toBe('./sibling.md');
  });

  it('strips the whole whitespace run before the title', () => {
    expect(stripLinkTitle('./sibling.md \t "T"')).toBe('./sibling.md');
  });

  it('strips an empty title', () => {
    expect(stripLinkTitle('./sibling.md ""')).toBe('./sibling.md');
  });

  it('strips only the last quoted span when two stand after whitespace', () => {
    expect(stripLinkTitle('a "b" "c"')).toBe('a "b"');
  });

  it('leaves a target that does not end in a quote', () => {
    expect(stripLinkTitle('./sibling.md#anchor')).toBe('./sibling.md#anchor');
  });

  it('leaves a quote not preceded by whitespace', () => {
    expect(stripLinkTitle('./weird"name"')).toBe('./weird"name"');
  });

  it('leaves a target that is only a quoted span', () => {
    expect(stripLinkTitle('"Title"')).toBe('"Title"');
  });

  it('leaves a lone closing quote', () => {
    expect(stripLinkTitle('./x "')).toBe('./x "');
  });
});
