import { describe, expect, it } from 'vitest';

import { hasCssDeclaration, hasCustomPropertyDeclaration } from './css-declarations';

describe('hasCssDeclaration', () => {
  it('finds a property name and its colon', () => {
    expect(hasCssDeclaration(' color: red')).toBe(true);
  });

  it('finds a property with whitespace before its colon, in any case', () => {
    expect(hasCssDeclaration(' Margin :0')).toBe(true);
  });

  it('finds nothing in whitespace', () => {
    expect(hasCssDeclaration('  ')).toBe(false);
  });

  it('finds nothing where no letter or hyphen precedes the colon', () => {
    expect(hasCssDeclaration('1: 2')).toBe(false);
  });

  it('answers a long run of letters and spaces with no colon in linear time', () => {
    expect(hasCssDeclaration('a '.repeat(100_000))).toBe(false);
  });
});

describe('hasCustomPropertyDeclaration', () => {
  it('finds a custom property declaration', () => {
    expect(hasCustomPropertyDeclaration(' --bg: 1')).toBe(true);
  });

  it('finds one with whitespace before the colon', () => {
    expect(hasCustomPropertyDeclaration(' --bg : 1')).toBe(true);
  });

  it('finds one directly after an opening brace', () => {
    expect(hasCustomPropertyDeclaration('{--x:1}')).toBe(true);
  });

  it('finds nothing in an ordinary declaration', () => {
    expect(hasCustomPropertyDeclaration('color: red')).toBe(false);
  });

  it('requires a name after the two hyphens', () => {
    expect(hasCustomPropertyDeclaration('-- : 1')).toBe(false);
  });

  it('reads a name with two hyphens inside it as an ordinary property, not a custom one', () => {
    expect(hasCustomPropertyDeclaration('x--a: 1')).toBe(false);
  });

  it('answers a long run of hyphens with no colon in linear time', () => {
    expect(hasCustomPropertyDeclaration('-'.repeat(100_000))).toBe(false);
  });
});
