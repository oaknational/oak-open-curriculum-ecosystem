import { describe, expect, it } from 'vitest';

import { findForbiddenPhrases, shouldReportMatch } from './validate-fitness-vocabulary.js';

describe('shouldReportMatch', () => {
  it('reports non-filename matches of two-threshold', () => {
    expect(shouldReportMatch('two-threshold', 'The two-threshold model is retired.')).toBe(true);
  });

  it('does not report two-threshold when it only appears inside the preserved ADR-144 filename', () => {
    expect(
      shouldReportMatch('two-threshold', '[ADR-144](144-two-threshold-fitness-model.md)'),
    ).toBe(false);
    expect(
      shouldReportMatch('two-threshold', 'See docs/.../144-two-threshold-fitness-model.md line 3'),
    ).toBe(false);
  });

  it('reports two-threshold when the line contains both the filename and the phrase separately', () => {
    expect(
      shouldReportMatch(
        'two-threshold',
        'two-threshold model lives in 144-two-threshold-fitness-model.md',
      ),
    ).toBe(true);
  });

  it('always reports other forbidden phrases without filename special-casing', () => {
    expect(
      shouldReportMatch('blocking violation', 'Limit exceedance is a blocking violation.'),
    ).toBe(true);
    expect(shouldReportMatch('soft-ceiling', 'soft-ceiling report')).toBe(true);
    expect(shouldReportMatch('not a blocking gate', 'advisory, not a blocking gate')).toBe(true);
  });
});

describe('findForbiddenPhrases', () => {
  it('reports every forbidden phrase occurrence with line numbers', () => {
    const content = [
      'This doc uses the two-threshold model.',
      'Anything else is fine.',
      'It is a blocking violation when over limit.',
    ].join('\n');

    const findings = findForbiddenPhrases(content);

    expect(findings).toHaveLength(2);
    expect(findings[0]).toMatchObject({ phrase: 'two-threshold', lineNumber: 1 });
    expect(findings[1]).toMatchObject({ phrase: 'blocking violation', lineNumber: 3 });
  });

  it('returns an empty array when no forbidden phrases are present', () => {
    const content = [
      'The three-zone model has four zones: healthy, soft, hard, critical.',
      'Critical is hard limit × 1.5.',
    ].join('\n');

    expect(findForbiddenPhrases(content)).toStrictEqual([]);
  });

  it('does not report two-threshold matches that are only inside the preserved filename', () => {
    const content = 'See [ADR-144](144-two-threshold-fitness-model.md) for the three-zone model.';

    expect(findForbiddenPhrases(content)).toStrictEqual([]);
  });

  it('reports multiple distinct forbidden phrases on the same line', () => {
    const content = 'This is advisory, not a blocking gate and a blocking violation.';
    const findings = findForbiddenPhrases(content);

    const phrases = findings
      .map((finding) => finding.phrase)
      .toSorted((left, right) => left.localeCompare(right));
    expect(phrases).toContain('advisory, not a blocking gate');
    expect(phrases).toContain('blocking violation');
    expect(phrases).toContain('not a blocking gate');
  });
});
