import { describe, expect, it } from 'vitest';

import { classifyVerdict, distinctGroundingWindows, isBorderline } from './aggregation-verdict.js';
import type { AdversaryVerdict, Candidate, Confidence } from './judgment-schemas.js';

function test(pass: boolean, confidence: Confidence = 'high') {
  return { pass, confidence };
}

function verdict(overrides: Partial<AdversaryVerdict> = {}): AdversaryVerdict {
  return {
    grounded: test(true),
    baseRateHolds: test(true),
    survivesNull: test(true),
    notArtefact: test(true),
    importance: 'med',
    ...overrides,
  };
}

describe('classifyVerdict', () => {
  it('keeps a verdict only when all four tests pass', () => {
    expect(classifyVerdict(verdict())).toBe('keep');
  });

  it('kills when grounding fails', () => {
    expect(classifyVerdict(verdict({ grounded: test(false) }))).toBe('kill');
  });

  it('reroutes a base-rate-only failure at high importance', () => {
    expect(classifyVerdict(verdict({ baseRateHolds: test(false), importance: 'high' }))).toBe(
      'reroute',
    );
  });

  it('kills a base-rate-only failure that is not high importance', () => {
    expect(classifyVerdict(verdict({ baseRateHolds: test(false), importance: 'low' }))).toBe(
      'kill',
    );
  });

  it('kills when base-rate fails alongside another test, even at high importance', () => {
    expect(
      classifyVerdict(
        verdict({ baseRateHolds: test(false), survivesNull: test(false), importance: 'high' }),
      ),
    ).toBe('kill');
  });
});

describe('isBorderline', () => {
  it('is not borderline when every passing test is high confidence', () => {
    expect(isBorderline(verdict())).toBe(false);
  });

  it('is borderline when a kept verdict has any test passing at med or low confidence', () => {
    expect(isBorderline(verdict({ survivesNull: test(true, 'med') }))).toBe(true);
    expect(isBorderline(verdict({ grounded: test(true, 'low') }))).toBe(true);
  });

  it('is not borderline for a verdict that does not classify as keep', () => {
    expect(isBorderline(verdict({ grounded: test(false, 'low') }))).toBe(false);
  });
});

describe('distinctGroundingWindows', () => {
  it('counts distinct windows, recomputed not trusting groundingCount', () => {
    const candidate: Candidate = {
      id: 'c1',
      pattern: 'p',
      kind: 'recurrence',
      isAbsenceClaim: false,
      supportingWindows: ['W04', 'W04', 'W09', 'W14'],
      supportingLeafIds: ['l1', 'l2'],
      groundingCount: 99,
    };
    expect(distinctGroundingWindows(candidate)).toBe(3);
  });
});
