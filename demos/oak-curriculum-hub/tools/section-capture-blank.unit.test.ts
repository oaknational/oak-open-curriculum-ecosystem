import { describe, expect, it } from 'vitest';

import { sectionCaptureLooksBlank } from './section-capture-blank';

describe('sectionCaptureLooksBlank', () => {
  it('accepts a rendered content region', () => {
    expect(sectionCaptureLooksBlank({ boxHeight: 900, textLength: 400 })).toBe(false);
  });

  it('flags a collapsed region — the deep link never swapped the section in', () => {
    expect(sectionCaptureLooksBlank({ boxHeight: 40, textLength: 400 })).toBe(true);
  });

  it('flags a tall but textless region — a pre-hydration SSR shell', () => {
    expect(sectionCaptureLooksBlank({ boxHeight: 900, textLength: 10 })).toBe(true);
  });

  it('flags a missing region outright', () => {
    expect(sectionCaptureLooksBlank(undefined)).toBe(true);
  });
});
