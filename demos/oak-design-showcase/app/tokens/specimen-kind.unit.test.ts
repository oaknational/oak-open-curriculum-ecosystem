import { describe, expect, it } from 'vitest';

import { RESOLVED_PROPERTY, specimenKind } from './specimen-kind';

/**
 * Choosing a kind is choosing which CSS property the specimen binds to, so
 * a wrong choice renders a confidently wrong picture rather than an obvious
 * blank. These tests pin the boundaries where that could happen: the type
 * ramp's composites against its unitless parts, and everything the table
 * cannot place landing on `plain` rather than on a guess.
 */

describe('specimenKind', () => {
  it('sends every colour-typed token to a painted swatch, whatever its name', () => {
    expect(specimenKind('--surface-decorative-1', 'color')).toBe('colour');
    expect(specimenKind('--band-bg', 'color')).toBe('colour');
    expect(specimenKind('--scrim', 'color')).toBe('colour');
  });

  it('reads the composites the export cannot type from their family', () => {
    expect(specimenKind('--shadow-standard', null)).toBe('shadow');
    expect(specimenKind('--focus-ring', null)).toBe('shadow');
    expect(specimenKind('--focus-ring-inverted', null)).toBe('shadow');
    expect(specimenKind('--filter-icon', null)).toBe('filter');
    expect(specimenKind('--radius-control', null)).toBe('radius');
    expect(specimenKind('--border-solid-m', 'dimension')).toBe('border');
  });

  it('separates the type ramp composites from the unitless parts a brand tunes', () => {
    expect(specimenKind('--type-heading-1', null)).toBe('font');
    expect(specimenKind('--type-body-2', null)).toBe('font');
    expect(specimenKind('--type-heading-1-min', 'number')).toBe('plain');
    expect(specimenKind('--type-heading-1-max', 'number')).toBe('plain');
    expect(specimenKind('--type-heading-1-leading', 'number')).toBe('plain');
  });

  it('keeps the three font families apart from the size scale that shares their prefix', () => {
    expect(specimenKind('--font-sans', null)).toBe('family');
    expect(specimenKind('--font-display', null)).toBe('family');
    expect(specimenKind('--font-size-7', 'dimension')).toBe('font-size');
  });

  it('gives the remaining type axes their own samples', () => {
    expect(specimenKind('--weight-bold', 'fontWeight')).toBe('weight');
    expect(specimenKind('--leading-24', 'dimension')).toBe('leading');
    expect(specimenKind('--tracking-body', 'dimension')).toBe('tracking');
  });

  it('gives every remaining dimension a measuring bar', () => {
    expect(specimenKind('--space-16', 'dimension')).toBe('length');
    expect(specimenKind('--measure-prose', 'dimension')).toBe('length');
    expect(specimenKind('--btn-min-h', 'dimension')).toBe('length');
  });

  it('shows a token it cannot place as a value only, never as a guessed specimen', () => {
    expect(specimenKind('--motion-base', 'duration')).toBe('plain');
    expect(specimenKind('--ease-standard', 'cubicBezier')).toBe('plain');
    expect(specimenKind('--layer-raised', 'number')).toBe('plain');
    expect(specimenKind('--quiz-pad', null)).toBe('plain');
  });
});

describe('RESOLVED_PROPERTY', () => {
  it('names a readable property only for the kinds whose custom property hides the answer', () => {
    // light-dark(), color-mix() and the shadow composites read back as
    // expressions from the custom property; the painted property reports a
    // used value. Everywhere else the custom property is already exact.
    expect(RESOLVED_PROPERTY.colour).toBe('background-color');
    expect(RESOLVED_PROPERTY.shadow).toBe('box-shadow');
    expect(RESOLVED_PROPERTY.filter).toBe('filter');
    expect(RESOLVED_PROPERTY.length).toBeUndefined();
    expect(RESOLVED_PROPERTY.plain).toBeUndefined();
  });
});
