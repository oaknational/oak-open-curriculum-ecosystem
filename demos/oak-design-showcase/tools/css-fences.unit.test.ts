import { describe, expect, it } from 'vitest';

import { cssFenceBodies, withoutCssFences } from './css-fences';

describe('cssFenceBodies', () => {
  it('returns the body of a css fence', () => {
    expect(cssFenceBodies('Before\n```css\n.a { color: red; }\n```\nAfter')).toEqual([
      '.a { color: red; }\n',
    ]);
  });

  it('accepts the upper-case info string and no other casing', () => {
    expect(cssFenceBodies('```CSS\n.b {}\n```')).toEqual(['.b {}\n']);
    expect(cssFenceBodies('```Css\n.c {}\n```')).toEqual([]);
  });

  it('returns every fence, in order', () => {
    expect(cssFenceBodies('```css\none\n```\ntext\n```css\ntwo\n```')).toEqual(['one\n', 'two\n']);
  });

  it('ignores a fence of another language', () => {
    expect(cssFenceBodies('```ts\nconst a = 1;\n```')).toEqual([]);
  });

  it('refuses an info string that continues past css', () => {
    expect(cssFenceBodies('```css-in-js\n.a {}\n```')).toEqual([]);
  });

  it('starts the body after the last newline of the run that follows the info string', () => {
    expect(cssFenceBodies('```css  \n\n  .a {}\n```')).toEqual(['  .a {}\n']);
  });

  it('finds an opener inside a longer backtick run', () => {
    expect(cssFenceBodies('````css\n.a {}\n```')).toEqual(['.a {}\n']);
  });

  it('closes at the first backtick run after the body starts, wherever it sits', () => {
    expect(cssFenceBodies('```css\n.a { content: "```"; }\n```')).toEqual(['.a { content: "']);
  });

  it('returns nothing for a fence that never closes', () => {
    expect(cssFenceBodies('```css\n.a {}\n')).toEqual([]);
  });

  it('answers a long run of backticks with no fence in linear time', () => {
    expect(cssFenceBodies('`'.repeat(100_000))).toEqual([]);
  });
});

describe('withoutCssFences', () => {
  it('replaces each whole fence, markers included, with the replacement', () => {
    expect(withoutCssFences('a ```css\n.x {}\n``` b ```CSS\n.y {}\n``` c', ' ')).toBe('a   b   c');
  });

  it('leaves text with no css fence unchanged', () => {
    expect(withoutCssFences('```ts\nx\n```', ' ')).toBe('```ts\nx\n```');
  });
});
