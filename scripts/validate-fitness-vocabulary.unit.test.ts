import { describe, expect, it } from 'vitest';

import {
  findForbiddenPhrases,
  shouldInspectFile,
  shouldReportMatch,
} from './validate-fitness-vocabulary.mjs';

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

describe('shouldInspectFile', () => {
  it('inspects live markdown files', () => {
    expect(shouldInspectFile('.agent/commands/consolidate-docs.md')).toBe(true);
    expect(shouldInspectFile('docs/governance/development-practice.md')).toBe(true);
  });

  it('excludes archived files', () => {
    expect(shouldInspectFile('.agent/memory/active/archive/napkin-2026-03-21.md')).toBe(false);
    expect(
      shouldInspectFile('.agent/plans/agentic-engineering-enhancements/archive/completed/foo.md'),
    ).toBe(false);
  });

  it('excludes incoming practice-box files', () => {
    expect(shouldInspectFile('.agent/practice-core/incoming/practice.md')).toBe(false);
  });

  it('excludes experience files (reflective, not normative)', () => {
    expect(shouldInspectFile('.agent/experience/2026-04-05-concepts-as-currency.md')).toBe(false);
  });

  it('excludes backup directories', () => {
    expect(shouldInspectFile('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(false);
  });

  it('excludes non-markdown, non-ts, non-mjs files', () => {
    expect(shouldInspectFile('scripts/foo.sh')).toBe(false);
    expect(shouldInspectFile('package.json')).toBe(false);
  });

  it('excludes the ADR-144 file itself (permitted to discuss retired vocabulary)', () => {
    expect(
      shouldInspectFile(
        'docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md',
      ),
    ).toBe(false);
  });

  it('excludes the outgoing broadcast files (carry provenance of the evolution)', () => {
    expect(
      shouldInspectFile('.agent/practice-context/outgoing/three-dimension-fitness-functions.md'),
    ).toBe(false);
    expect(shouldInspectFile('.agent/practice-context/outgoing/validate-practice-fitness.ts')).toBe(
      false,
    );
  });

  it('excludes the vocabulary validator itself and its tests', () => {
    expect(shouldInspectFile('scripts/validate-fitness-vocabulary.mjs')).toBe(false);
    expect(shouldInspectFile('scripts/validate-fitness-vocabulary.unit.test.ts')).toBe(false);
  });
});

describe('findForbiddenPhrases', () => {
  it('reports every forbidden phrase occurrence with line numbers', () => {
    const content = [
      'This doc uses the two-threshold model.',
      'Anything else is fine.',
      'It is a blocking violation when over limit.',
    ].join('\n');

    const findings = findForbiddenPhrases('test.md', content);

    expect(findings).toHaveLength(2);
    expect(findings[0]).toMatchObject({ phrase: 'two-threshold', lineNumber: 1 });
    expect(findings[1]).toMatchObject({ phrase: 'blocking violation', lineNumber: 3 });
  });

  it('returns an empty array when no forbidden phrases are present', () => {
    const content = [
      'The three-zone model has four zones: healthy, soft, hard, critical.',
      'Critical is hard limit × 1.5.',
    ].join('\n');

    expect(findForbiddenPhrases('test.md', content)).toStrictEqual([]);
  });

  it('does not report two-threshold matches that are only inside the preserved filename', () => {
    const content = 'See [ADR-144](144-two-threshold-fitness-model.md) for the three-zone model.';

    expect(findForbiddenPhrases('test.md', content)).toStrictEqual([]);
  });

  it('reports multiple distinct forbidden phrases on the same line', () => {
    const content = 'This is advisory, not a blocking gate and a blocking violation.';
    const findings = findForbiddenPhrases('test.md', content);

    const phrases = findings.map((finding) => finding.phrase).toSorted();
    expect(phrases).toContain('advisory, not a blocking gate');
    expect(phrases).toContain('blocking violation');
    expect(phrases).toContain('not a blocking gate');
  });
});
