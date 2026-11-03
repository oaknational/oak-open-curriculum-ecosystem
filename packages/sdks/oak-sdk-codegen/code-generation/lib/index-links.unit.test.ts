import { describe, expect, it } from 'vitest';

import { extractRelativeLinkTargets } from './index-links.js';

describe('extractRelativeLinkTargets', () => {
  it('returns the ./-relative targets in document order', () => {
    const markdown = [
      '# API',
      '',
      '- [Classes](./classes.md)',
      '- [Type Aliases](./type-aliases.md)',
      'See [the vision](https://example.test/vision) and [sibling](../other.md).',
    ].join('\n');

    expect(extractRelativeLinkTargets(markdown)).toEqual(['classes.md', 'type-aliases.md']);
  });

  it('reads two links on one line as two targets', () => {
    expect(extractRelativeLinkTargets('[a](./a.md) and [b](./b.md)')).toEqual(['a.md', 'b.md']);
  });

  it('returns nothing for an index without relative links', () => {
    expect(extractRelativeLinkTargets('# Empty\n\nNo links here.')).toEqual([]);
  });
});
