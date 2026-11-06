import { describe, expect, it } from 'vitest';

import { dataThemeRules, quotedAttributeValues } from './theme-markup';

describe('dataThemeRules: the rules it reads', () => {
  it('reads a rule whose selector names a data-theme value', () => {
    expect(dataThemeRules(":root[data-theme='dark'] { --bg: #000; }")).toEqual([
      { index: 0, prelude: ":root[data-theme='dark'] ", theme: 'dark', body: ' --bg: #000; ' },
    ]);
  });

  it('starts the prelude after the previous brace and skips rules without a data-theme', () => {
    expect(dataThemeRules('a{} [data-theme="light"] .x { --c: 1 } b { y }')).toEqual([
      { index: 3, prelude: ' [data-theme="light"] .x ', theme: 'light', body: ' --c: 1 ' },
    ]);
  });

  it('reads a rule nested in a media block, its index inside the block', () => {
    expect(
      dataThemeRules(
        '@media (prefers-color-scheme: dark) { :root[data-theme="system"] { --c: 1 } }',
      ),
    ).toEqual([
      { index: 37, prelude: ' :root[data-theme="system"] ', theme: 'system', body: ' --c: 1 ' },
    ]);
  });

  it('takes the last data-theme value in a selector', () => {
    expect(dataThemeRules("[data-theme='a'][data-theme='b'] { x }")).toEqual([
      { index: 0, prelude: "[data-theme='a'][data-theme='b'] ", theme: 'b', body: ' x ' },
    ]);
  });

  it('matches the attribute and its value in any case, keeping the value as written', () => {
    expect(dataThemeRules("[DATA-THEME='HC'] { x }")).toEqual([
      { index: 0, prelude: "[DATA-THEME='HC'] ", theme: 'HC', body: ' x ' },
    ]);
  });

  it('keeps markup before a style block in the prelude', () => {
    expect(
      dataThemeRules('<p>x</p><style>[data-theme="high-contrast"] { --a: 1 }</style>'),
    ).toEqual([
      {
        index: 0,
        prelude: '<p>x</p><style>[data-theme="high-contrast"] ',
        theme: 'high-contrast',
        body: ' --a: 1 ',
      },
    ]);
  });
});

describe('dataThemeRules: what it skips', () => {
  it('skips a rule whose body holds a nested block', () => {
    expect(dataThemeRules("[data-theme='dark'] { a { b } }")).toEqual([]);
  });

  it('requires the value to be quoted', () => {
    expect(dataThemeRules('[data-theme=dark] { x }')).toEqual([]);
  });

  it('answers a long selector with no rule in linear time', () => {
    expect(dataThemeRules("[data-theme='a']".repeat(20_000))).toEqual([]);
  });
});

describe('quotedAttributeValues', () => {
  it('returns each quoted, letters-and-hyphens attribute value, as written', () => {
    expect(
      quotedAttributeValues(` value="dark" data-x = 'Light' id="a1" class="btn primary"`),
    ).toEqual(['dark', 'Light']);
  });

  it('answers a long attribute name with no value in linear time', () => {
    expect(quotedAttributeValues('a'.repeat(100_000))).toEqual([]);
  });
});
