import { describe, expect, it } from 'vitest';

import { measurableProseWidth } from './markdown.js';

describe('measurableProseWidth', () => {
  it('returns the raw length of a line with no links or URLs', () => {
    expect(measurableProseWidth('hello world')).toBe('hello world'.length);
  });

  it('measures an inline link by its visible text, not its target', () => {
    // The target path is long and unwrappable; only the visible text counts.
    expect(measurableProseWidth('[the plan](../../../very/long/path/to/plan.md)')).toBe(
      'the plan'.length,
    );
  });

  it('keeps surrounding prose when collapsing an inline link', () => {
    expect(measurableProseWidth('see [the plan](../../../very/long/path/to/plan.md) now')).toBe(
      'see the plan now'.length,
    );
  });

  it('discounts a bare URL embedded in prose', () => {
    // Contract: the URL contributes nothing; only the surrounding prose
    // ('visit ' = 6, ' here' = 5) counts toward width.
    expect(measurableProseWidth('visit https://example.com/very/long/unwrappable/url here')).toBe(
      11,
    );
  });

  it('discounts an autolinked URL entirely', () => {
    expect(measurableProseWidth('<https://example.com/very/long/unwrappable/url>')).toBe(0);
  });

  it('discounts every link on a line with multiple inline links', () => {
    expect(
      measurableProseWidth(
        'see [plan A](../../../very/long/path/a.md) and [plan B](../../../very/long/path/b.md) now',
      ),
    ).toBe('see plan A and plan B now'.length);
  });

  it('discounts a link target that contains balanced parentheses', () => {
    expect(measurableProseWidth('[see](https://en.wikipedia.org/wiki/Foo_(bar))')).toBe(
      'see'.length,
    );
  });

  it('discounts the full target including a title attribute', () => {
    expect(measurableProseWidth('[click here](https://example.com "link title")')).toBe(
      'click here'.length,
    );
  });

  it('measures an image by its alt text with no stray marker', () => {
    expect(measurableProseWidth('![diagram](../../../very/long/path/to/diagram.png)')).toBe(
      'diagram'.length,
    );
  });

  it('still discounts the URL of a malformed link, counting only the visible residual', () => {
    // The link is unparseable (no closing paren) so its text is not collapsed,
    // but the bare-URL pass still discounts the unwrappable URL — only the
    // visible residual '[text](' counts toward width.
    expect(measurableProseWidth('[text](https://example.com/unterminated')).toBe('[text]('.length);
  });

  it('still measures a genuinely long prose sentence in full', () => {
    const longProse = 'the quick brown fox jumps over the lazy dog and keeps on running forever';
    expect(measurableProseWidth(longProse)).toBe(longProse.length);
  });

  it('still measures the prose portion of a line that mixes long prose with a link', () => {
    const prose = 'this sentence is itself comfortably longer than any short limit would allow';
    expect(measurableProseWidth(`${prose} [ref](https://example.com/x)`)).toBe(
      `${prose} ref`.length,
    );
  });
});
