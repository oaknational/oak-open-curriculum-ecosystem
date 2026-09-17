/*
 * Unit-class: the system under test is the pure boundary parser
 * (wow-verdict-register.ts) — string in, Result out, no IO, no fakes.
 * The committed live register's byte-level proof lives in the sibling
 * integration suite (wow-verdict-register.integration.test.ts).
 */
import { describe, expect, it } from 'vitest';

import { parseWowVerdictRegister, rowsForDemo } from './wow-verdict-register.js';

const validPreReadRow = {
  page: '/',
  demo: 'oak-design-showcase',
  verdict: 'FAIL',
  qualitiesJudged: ['content-relevance'],
  cellsCovered: [{ identity: 'oak', theme: 'light' }],
  ownerStatementDate: '2026-08-05',
  rowClass: 'pre-read',
  source: 'sitting record §Verdict 1',
};

const allCriteriaPass = {
  'type-scale': { verdict: 'PASS' },
  'spatial-rhythm': { verdict: 'PASS' },
  hierarchy: { verdict: 'PASS' },
  'colour-discipline': { verdict: 'PASS' },
  'composition-grammar': { verdict: 'PASS' },
  'cross-page-cohesion': { verdict: 'PASS' },
  'ordered-calm-readability': { verdict: 'PASS' },
};

const validLegResults = {
  seat: { verdict: 'PASS', perCriterion: allCriteriaPass },
  accessibilityExpert: {
    verdict: 'PASS',
    perCriterion: allCriteriaPass,
    notes: 'contrast floors hold in both themes',
  },
  designSystemExpert: { verdict: 'PASS', perCriterion: allCriteriaPass },
};

const validCheckpointRow = {
  page: '/',
  demo: 'oak-design-showcase',
  verdict: 'PASS',
  qualitiesJudged: ['composition'],
  cellsCovered: [{ identity: 'oak', theme: 'dark' }],
  ownerStatementDate: '2026-08-08',
  rowClass: 'checkpoint',
  instrumentLegResults: validLegResults,
  source: 'checkpoint record',
};

const validBlockedRow = {
  page: '/',
  demo: 'oak-design-showcase',
  qualitiesJudged: ['composition'],
  cellsCovered: [{ identity: 'oak', theme: 'light' }],
  rowClass: 'instrument-blocked',
  instrumentLegResults: {
    ...validLegResults,
    seat: {
      verdict: 'FAIL',
      perCriterion: {
        ...allCriteriaPass,
        hierarchy: { verdict: 'FAIL', note: 'two competing primary emphases' },
      },
      notes: 'render blocked on the hierarchy criterion',
    },
  },
  directorDisposition: {
    decision: 'blocked-upheld',
    date: '2026-08-08',
    source: 'Director disposition event',
  },
  source: 'instrument pass record',
};

describe('parseWowVerdictRegister', () => {
  it('accepts a well-formed register carrying all three row classes', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({
        version: 1,
        entries: [validPreReadRow, validCheckpointRow, validBlockedRow],
      }),
    );

    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(result.value.entries).toHaveLength(3);
    }
  });

  it('rejects invalid JSON with a readable error, never a throw', () => {
    const result = parseWowVerdictRegister('{not json');

    expect(result.ok, 'invalid JSON must be refused, not thrown').toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('wow-verdict-register');
    }
  });

  it('rejects a checkpoint-class row without instrument-leg results', () => {
    const rowWithoutLegs: Record<string, unknown> = { ...validCheckpointRow };
    delete rowWithoutLegs.instrumentLegResults;
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 1, entries: [rowWithoutLegs] }),
    );

    expect(result.ok, 'a checkpoint row without leg results must be refused').toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('instrumentLegResults');
    }
  });

  it('rejects a checkpoint-class row carrying only a partial leg set', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({
        version: 1,
        entries: [
          {
            ...validCheckpointRow,
            instrumentLegResults: { seat: validLegResults.seat },
          },
        ],
      }),
    );

    expect(result.ok).toBe(false);
  });

  it('accepts a pre-read row with leg results present (the optional arm)', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({
        version: 1,
        entries: [{ ...validPreReadRow, instrumentLegResults: validLegResults }],
      }),
    );

    expect(result.ok ? undefined : result.error).toBeUndefined();
  });

  it('rejects an instrument-blocked row that invents an owner verdict', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({
        version: 1,
        entries: [{ ...validBlockedRow, verdict: 'FAIL', ownerStatementDate: '2026-08-08' }],
      }),
    );

    expect(
      result.ok,
      'owner fields are reserved for rows the owner actually saw — a blocked row carrying them must be refused',
    ).toBe(false);
  });

  it('rejects an instrument-blocked row without its Director disposition', () => {
    const rowWithoutDisposition: Record<string, unknown> = { ...validBlockedRow };
    delete rowWithoutDisposition.directorDisposition;
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 1, entries: [rowWithoutDisposition] }),
    );

    expect(result.ok).toBe(false);
  });

  it('rejects a row missing its provenance source', () => {
    const rowWithoutSource: Record<string, unknown> = { ...validPreReadRow };
    delete rowWithoutSource.source;
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 1, entries: [rowWithoutSource] }),
    );

    expect(result.ok).toBe(false);
  });

  it.each([
    ['an unknown verdict', { ...validPreReadRow, verdict: 'MAYBE' }],
    ['an unknown row class', { ...validPreReadRow, rowClass: 'audit' }],
    ['empty qualitiesJudged', { ...validPreReadRow, qualitiesJudged: [] }],
    ['empty cellsCovered', { ...validPreReadRow, cellsCovered: [] }],
    [
      'an identity outside the closed roster',
      { ...validPreReadRow, cellsCovered: [{ identity: 'oaak', theme: 'light' }] },
    ],
    [
      'a theme typo that would otherwise mint a phantom coverage cell',
      { ...validPreReadRow, cellsCovered: [{ identity: 'oak', theme: 'ligt' }] },
    ],
    [
      'an unknown key (a typo would otherwise silently vanish)',
      { ...validPreReadRow, instrumentLegResult: validLegResults },
    ],
    [
      'a leg carrying an unknown key',
      {
        ...validCheckpointRow,
        instrumentLegResults: {
          ...validLegResults,
          seat: { ...validLegResults.seat, note: 'typo of notes' },
        },
      },
    ],
    [
      'a leg missing its per-criterion evaluation',
      {
        ...validCheckpointRow,
        instrumentLegResults: {
          ...validLegResults,
          seat: { verdict: 'PASS' },
        },
      },
    ],
    [
      'a leg whose per-criterion record skips a criterion',
      {
        ...validCheckpointRow,
        instrumentLegResults: {
          ...validLegResults,
          seat: {
            verdict: 'PASS',
            perCriterion: { 'type-scale': { verdict: 'PASS' } },
          },
        },
      },
    ],
    [
      'an unexplained FAIL leg (no notes)',
      {
        ...validCheckpointRow,
        instrumentLegResults: {
          ...validLegResults,
          seat: { verdict: 'FAIL', perCriterion: allCriteriaPass },
        },
      },
    ],
    [
      'a non-PASS criterion verdict without a note',
      {
        ...validCheckpointRow,
        instrumentLegResults: {
          ...validLegResults,
          seat: {
            verdict: 'FAIL',
            perCriterion: { ...allCriteriaPass, hierarchy: { verdict: 'FAIL' } },
            notes: 'fails on hierarchy',
          },
        },
      },
    ],
    ['an impossible calendar date', { ...validPreReadRow, ownerStatementDate: '2026-13-45' }],
  ])('rejects a row with %s', (_label, malformedRow) => {
    const result = parseWowVerdictRegister(JSON.stringify({ version: 1, entries: [malformedRow] }));

    expect(result.ok).toBe(false);
  });

  it('rejects a register whose version is not 1', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 2, entries: [validPreReadRow] }),
    );

    expect(result.ok).toBe(false);
  });
});

describe('rowsForDemo', () => {
  const showcaseRow = { ...validPreReadRow, demo: 'oak-design-showcase' };
  const hubRow = { ...validPreReadRow, page: '/search', demo: 'oak-curriculum-hub' };

  it('returns only the named demo’s rows', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 1, entries: [showcaseRow, hubRow] }),
    );

    expect(result.ok, 'the two-row register must parse').toBe(true);
    if (result.ok) {
      const rows = rowsForDemo(result.value, 'oak-curriculum-hub');
      expect(rows).toHaveLength(1);
      expect(rows[0]?.page).toBe('/search');
    }
  });

  it('returns no rows for an unknown demo', () => {
    const result = parseWowVerdictRegister(
      JSON.stringify({ version: 1, entries: [showcaseRow, hubRow] }),
    );

    expect(result.ok, 'the two-row register must parse').toBe(true);
    if (result.ok) {
      expect(rowsForDemo(result.value, 'no-such-demo')).toHaveLength(0);
    }
  });
});
