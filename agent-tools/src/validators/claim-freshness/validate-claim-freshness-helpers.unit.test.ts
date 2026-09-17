import { describe, expect, it } from 'vitest';

import type { JsonObject } from '../../core/json.js';

import {
  assessFreshnessRows,
  decideFreshnessOutcome,
  type FreshnessAssessment,
} from './validate-claim-freshness-helpers.js';

/**
 * Fixture rows are literal `platform_support`-shaped objects. The ceiling is
 * always injected (7 here, deliberately not the registered production value)
 * so these proofs are independent of the registry configuration.
 */
const CEILING_DAYS = 7;

const WELL_FORMED_ROW: JsonObject = {
  status: 'supported',
  grounded_at: '2026-08-01',
  pin: { kind: 'pinned', version: '1.2.3' },
  review_by: '2026-08-05',
};

const EMPTY_ASSESSMENT: FreshnessAssessment = {
  integrityFindings: [],
  monitoringObligations: [],
  notTrackedRows: [],
};

function rowVariant(overrides: JsonObject): JsonObject {
  return { ...WELL_FORMED_ROW, ...overrides };
}

describe('assessFreshnessRows', () => {
  it('classifies a well-formed pinned row as a visible monitoring obligation', () => {
    expect(assessFreshnessRows({ alpha: WELL_FORMED_ROW }, CEILING_DAYS)).toEqual({
      integrityFindings: [],
      monitoringObligations: [{ row: 'alpha', pinnedVersion: '1.2.3' }],
      notTrackedRows: [],
    });
  });

  it('flags a missing freshness field as an integrity finding naming row and field', () => {
    const missingReviewBy: JsonObject = {
      status: 'supported',
      grounded_at: '2026-08-01',
      pin: { kind: 'pinned', version: '1.2.3' },
    };
    const assessment = assessFreshnessRows({ alpha: missingReviewBy }, CEILING_DAYS);
    expect(assessment.integrityFindings).toHaveLength(1);
    expect(assessment.integrityFindings[0]).toMatchObject({ row: 'alpha', field: 'review_by' });
  });

  it('rejects a legacy pinned_to property even when the pin union is valid', () => {
    const assessment = assessFreshnessRows(
      { alpha: rowVariant({ pinned_to: 'stale-cli 0.1.0' }) },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings).toContainEqual(
      expect.objectContaining({ row: 'alpha', field: 'pinned_to' }),
    );
  });

  it.each([
    { pin: undefined, description: 'a missing pin' },
    { pin: null, description: 'a null pin' },
    { pin: '1.2.3', description: 'a scalar legacy pin' },
    {
      pin: { kind: 'unknown', version: '1.2.3' },
      description: 'an unknown discriminant',
    },
    { pin: { kind: 'pinned', version: '   ' }, description: 'a whitespace-only version' },
    {
      pin: { kind: 'pinned', version: 'example-cli 1.2.3' },
      description: 'a tool-prefixed version',
    },
    {
      pin: { kind: 'pinned', version: '01.2.3' },
      description: 'a version with a leading-zero component',
    },
    {
      pin: { kind: 'pinned', version: '1.2.3\n' },
      description: 'a version with a trailing line terminator',
    },
    {
      pin: { kind: 'not-tracked', reason: '   ' },
      description: 'a whitespace-only reason',
    },
    {
      pin: { kind: 'pinned', version: '1.2.3', reason: 'wrong arm' },
      description: 'a pinned arm with an extra reason',
    },
    {
      pin: { kind: 'not-tracked', reason: 'No version was observed.', version: 'wrong arm' },
      description: 'a not-tracked arm with an extra version',
    },
  ])('rejects $description as an invalid closed pin union', ({ pin }) => {
    const assessment = assessFreshnessRows({ alpha: rowVariant({ pin }) }, CEILING_DAYS);
    expect(assessment.integrityFindings).toContainEqual(
      expect.objectContaining({ row: 'alpha', field: 'pin' }),
    );
  });

  it.each([
    { badDate: '2026-02-30', description: 'a calendar-impossible day' },
    { badDate: '2026-8-3', description: 'a non-zero-padded month/day' },
    { badDate: '2026-13-01', description: 'a month that does not exist' },
  ])('flags $badDate ($description) as a malformed date', ({ badDate }) => {
    const assessment = assessFreshnessRows(
      { alpha: rowVariant({ grounded_at: badDate }) },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings.some((finding) => finding.field === 'grounded_at')).toBe(
      true,
    );
  });

  it('flags review_by not after grounded_at as an integrity finding', () => {
    const assessment = assessFreshnessRows(
      { alpha: rowVariant({ grounded_at: '2026-08-05', review_by: '2026-08-05' }) },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings.some((finding) => finding.field === 'review_by')).toBe(
      true,
    );
  });

  it('flags an interval exceeding the injected ceiling as an integrity finding', () => {
    const assessment = assessFreshnessRows(
      { alpha: rowVariant({ grounded_at: '2026-08-01', review_by: '2026-08-09' }) },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings.some((finding) => finding.field === 'review_by')).toBe(
      true,
    );
  });

  it('accepts an interval exactly at the ceiling', () => {
    const assessment = assessFreshnessRows(
      { alpha: rowVariant({ grounded_at: '2026-08-01', review_by: '2026-08-08' }) },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings).toEqual([]);
  });

  it('classifies not-tracked as a named non-obligation and preserves its reason', () => {
    const assessment = assessFreshnessRows(
      {
        cursor: rowVariant({
          pin: {
            kind: 'not-tracked',
            reason: 'No Cursor CLI version was observed in the grounding pass.',
          },
        }),
      },
      CEILING_DAYS,
    );
    expect(assessment).toEqual({
      integrityFindings: [],
      monitoringObligations: [],
      notTrackedRows: [
        {
          row: 'cursor',
          reason: 'No Cursor CLI version was observed in the grounding pass.',
        },
      ],
    });
  });

  it('partitions multiple rows into integrity, monitoring, and not-tracked collections', () => {
    const missingGroundedAt: JsonObject = {
      status: 'supported',
      pin: { kind: 'pinned', version: 'broken-cli 0.1.0' },
      review_by: '2026-08-05',
    };
    const assessment = assessFreshnessRows(
      {
        alpha: WELL_FORMED_ROW,
        beta: rowVariant({ pin: { kind: 'not-tracked', reason: 'No version observed.' } }),
        gamma: missingGroundedAt,
      },
      CEILING_DAYS,
    );
    expect(assessment.integrityFindings).toContainEqual(
      expect.objectContaining({ row: 'gamma', field: 'grounded_at' }),
    );
    expect(assessment.monitoringObligations).toEqual([{ row: 'alpha', pinnedVersion: '1.2.3' }]);
    expect(assessment.notTrackedRows).toEqual([{ row: 'beta', reason: 'No version observed.' }]);
  });

  it('flags a non-object platform_support value as a single integrity finding', () => {
    const assessment = assessFreshnessRows('not-an-object', CEILING_DAYS);
    expect(assessment.integrityFindings).toHaveLength(1);
    expect(assessment.monitoringObligations).toEqual([]);
    expect(assessment.notTrackedRows).toEqual([]);
  });
});

describe('decideFreshnessOutcome', () => {
  it('maps any integrity finding to exit 1 with lines naming the row and field', () => {
    const outcome = decideFreshnessOutcome({
      ...EMPTY_ASSESSMENT,
      integrityFindings: [{ row: 'alpha', field: 'review_by', reason: 'missing' }],
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.reportLines.join('\n')).toContain('alpha');
    expect(outcome.reportLines.join('\n')).toContain('review_by');
  });

  it('renders a field-less integrity finding without an undefined path segment', () => {
    const outcome = decideFreshnessOutcome({
      ...EMPTY_ASSESSMENT,
      integrityFindings: [{ row: 'platform_support', reason: 'must be an object' }],
    });
    expect(outcome.exitCode).toBe(1);
    expect(outcome.reportLines).toEqual(['  platform_support: must be an object']);
  });

  it('reports pinned obligations and named not-tracked rows without enforcing them', () => {
    const outcome = decideFreshnessOutcome({
      integrityFindings: [],
      monitoringObligations: [{ row: 'alpha', pinnedVersion: '1.2.3' }],
      notTrackedRows: [{ row: 'beta', reason: 'No version observed.' }],
    });
    expect(outcome.exitCode).toBe(0);
    expect(outcome.reportLines.join('\n')).toContain('alpha');
    expect(outcome.reportLines.join('\n')).toContain('1.2.3');
    expect(outcome.reportLines.join('\n')).toContain('beta');
    expect(outcome.reportLines.join('\n')).toContain('No version observed.');
    expect(outcome.reportLines.join('\n')).toContain('landing 2');
  });

  it('reports a true zero-obligation inventory without silently swallowing the result', () => {
    const outcome = decideFreshnessOutcome(EMPTY_ASSESSMENT);
    expect(outcome.exitCode).toBe(0);
    expect(outcome.reportLines.join('\n')).toContain('0 monitoring obligations');
    expect(outcome.reportLines.join('\n')).toContain('landing 2');
  });
});
